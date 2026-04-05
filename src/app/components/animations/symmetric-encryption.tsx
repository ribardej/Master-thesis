import React, { useState, useEffect } from "react";
import { User, KeyRound, FileText, Lock, EyeOff, FileLock2, RefreshCw, Pause, Play, Ban, UserSearch } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function SymmetricEncryptionAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed] = useGlobalAnimationSpeed();
  const maxSteps = 5;

  // Auto-play animation
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 5000 / speed);
    return () => clearTimeout(timer);
  }, [isPaused, speed, step]);

  useEffect(() => {
    const handleNext = (e: Event) => {
      if (step < maxSteps - 1) {
        e.preventDefault();
        setStep((prev) => prev + 1);
        //setIsPaused(true);
      }
    };

    const handlePrev = (e: Event) => {
      if (step > 0) {
        e.preventDefault();
        setStep((prev) => prev - 1);
        //setIsPaused(true);
      }
    };

    const handleSpace = (e: Event) => {
      e.preventDefault();
      setIsPaused((p) => !p);
    };

    window.addEventListener('slide-next', handleNext);
    window.addEventListener('slide-prev', handlePrev);
    window.addEventListener('slide-space', handleSpace);

    return () => {
      window.removeEventListener('slide-next', handleNext);
      window.removeEventListener('slide-prev', handlePrev);
      window.removeEventListener('slide-space', handleSpace);
    };
  }, [step]);

  const reset = () => {
    setStep(0);
    setIsPaused(false);
  };
  const togglePause = () => {
    if (isPaused) {
      // Immediately move to next step when resuming
      setStep((prev) => (prev + 1) % maxSteps);
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-gray-50 rounded-xl border border-gray-200 my-8 shadow-sm">
      <div className="flex justify-between items-start mb-12">
        <h3 className="text-xl font-bold text-gray-800 m-0 pt-1">Symmetric Encryption Principle</h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              onClick={togglePause}
              className="flex-1 flex justify-center items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              {isPaused ? "Play" : "Pause"}
            </button>
            <button 
              onClick={reset}
              className="flex-1 flex justify-center items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
            >
              <RefreshCw size={14} className={step === 4 && !isPaused ? "animate-spin" : ""} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={5000} />
        </div>
      </div>

      <div className="relative flex justify-between items-center h-48">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-12 right-12 h-1 bg-gray-300 -translate-y-1/2 border-t border-b border-gray-400 border-dashed z-0" />

        {/* Sender (Alice) */}
        <div className="relative z-3 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">You</p>
            <div className={`flex items-center gap-1 text-sm font-medium transition-all duration-500 ${(step === 3) || (step === 1) ? "text-green-600 scale-120 drop-shadow-md" : "text-indigo-600"}`}>
              <KeyRound size={14} /> Shared Key
            </div>
          </div>
        </div>

        {/* Message Flow Animation */}
        <div className="absolute top-1/2 left-[15%] right-[15%] h-20 -translate-y-1/2 z-5 pointer-events-none">
          <style>
            {`
              @keyframes slideRight {
                0% { left: 0%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 100%; opacity: 0; transform: translate(-50%, -50%); }
              }
              .animate-slide-right {
                animation: slideRight ${5 / speed}s ease-in-out forwards;
              }
            `}
          </style>

          {/* Step 1: Plaintext appearing at sender */}
          {step === 0 && (
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow border border-gray-200 flex flex-col items-center animate-fade-in">
              <FileText size={24} className="text-blue-500 mb-1" />
              <span className="text-xs font-mono">"Hello"</span>
            </div>
          )}

          {/* Step 2: Encrypting (moving slightly right and turning to cyphertext) */}
          {step === 1 && (
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-2 rounded-lg shadow-md border border-indigo-200 flex flex-col items-center">
              <div className="relative">
                <FileText size={24} className="text-blue-500 mb-1 opacity-50" />
                <Lock size={16} className="text-indigo-600 absolute bottom-1 -right-2" />
              </div>
              <span className="text-xs font-mono text-indigo-700 animate-pulse">Encrypting...</span>
            </div>
          )}

          {/* Step 3: Travelling encrypted text (Hacker sees this) */}
          {step === 2 && (
            <div className="absolute top-1/2 animate-slide-right bg-red-50 p-2 rounded-lg shadow-md border border-red-200 flex flex-col items-center">
              <FileLock2 size={24} className="text-blue-500 mb-1" />
              <span className="text-xs font-mono text-red-700 whitespace-nowrap">"X9#kP$2"</span>
            </div>
          )}

          {/* Step 4: Decrypting at receiver */}
          {step === 3 && (
            <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-2 rounded-lg shadow-md border border-indigo-200 flex flex-col items-center">
              <div className="relative">
                <FileLock2 size={24} className="text-blue-500 mb-1 opacity-50" />
                <KeyRound size={16} className="text-indigo-600 absolute bottom-1 -left-2" />
              </div>
              <span className="text-xs font-mono text-indigo-700 animate-pulse">Decrypting...</span>
            </div>
          )}

          {/* Step 5: Plaintext received */}
          {step === 4 && (
            <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 bg-green-50 p-2 rounded-lg shadow-md border border-green-200 flex flex-col items-center animate-fade-in">
              <FileText size={24} className="text-blue-600 mb-1" />
              <span className="text-xs font-mono text-black-700">"Hello"</span>
            </div>
          )}

        </div>

        {/* Attacker (Middle) */}
        <div className="relative z-10 flex flex-col items-center gap-2 mt-32">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <UserSearch size={36} className="text-red-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800 text-sm">Attacker</p>
            <div className={`flex items-center gap-1 text-sm font-medium transition-all duration-500 ${step === 2 ? "text-red-600 scale-120 drop-shadow-md" : "text-red-600"}`}>
              <Ban size={14} /> No Shared Key
            </div>
          </div>
        </div>

        {/* Receiver (Bob) */}
        <div className="relative z-3 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Your friend</p>
            <div className={`flex items-center gap-1 text-sm font-medium transition-all duration-500 ${(step === 3) || (step === 1) ? "text-green-600 scale-120 drop-shadow-md" : "text-indigo-600"}`}>
              <KeyRound size={14} /> Shared Key
            </div>
          </div>
        </div>
      </div>

      {/* State explanations */}
      <div className="mt-16 bg-white p-4 rounded-lg border text-sm text-gray-600 text-center min-h-[4rem] flex items-center justify-center shadow-sm">
        {step === 0 && <p><strong>Step 1:</strong> You prepare a readable message (Plaintext).</p>}
        {step === 1 && <p><strong>Step 2:</strong> Algorithm (AES) encrypts the message using the secret <strong>Shared Key</strong>.</p>}
        {step === 2 && <p><strong>Step 3:</strong> Message travels across the internet. An attacker can intercept it, but sees only random characters (Ciphertext).</p>}
        {step === 3 && <p><strong>Step 4:</strong> Your friend uses the exact <strong>same Shared Key</strong> to decrypt the message.</p>}
        {step === 4 && <p><strong>Step 5:</strong> Your friend successfully reads the original message.</p>}
      </div>

      {/* Progress Steps (Tiles) */}
      <div className="mt-4 w-full flex gap-2">
        {[0, 1, 2, 3, 4].map((s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => {
              setStep(s);
            }}
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              step === s
                ? "bg-gray-500 shadow-sm"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="mt-4 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>

    </div>
  );
}