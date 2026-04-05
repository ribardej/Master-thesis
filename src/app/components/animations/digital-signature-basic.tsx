import React, { useState, useEffect } from "react";
import { User, KeyRound, FileText, Lock, Unlock, PenTool, CheckCircle2, RefreshCw, Pause, Play, UserSearch, FileCheck } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function DigitalSignatureBasicAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed] = useGlobalAnimationSpeed();
  const maxSteps = 6;

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
      }
    };

    const handlePrev = (e: Event) => {
      if (step > 0) {
        e.preventDefault();
        setStep((prev) => prev - 1);
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
      setStep((prev) => (prev + 1) % maxSteps);
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-gray-50 rounded-xl border border-gray-200 my-8 shadow-sm">
      <div className="flex justify-between items-start mb-12">
        <h3 className="text-xl font-bold text-gray-800 m-0 pt-1">Digital Signature — Signing & Verification</h3>
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
              <RefreshCw size={14} className={step === maxSteps - 1 && !isPaused ? "animate-spin" : ""} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={5000} />
        </div>
      </div>

      <div className="relative flex justify-between items-center h-48">
        {/* Connection Line */}
        <div className="absolute top-47/100 left-12 right-12 h-1 bg-gray-300 -translate-y-1/2 border-t border-b border-gray-400 border-dashed z-0" />

        {/* Sender (You) */}
        <div className="relative z-3 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">You</p>
            <div className="flex flex-col items-center mt-1 min-h-[3rem]">
              <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 0 ? "text-red-600 scale-120 drop-shadow-md" : "text-red-600"}`}>
                <Lock size={12} /> Private Key
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 mt-1 ${step === 0 ? "text-green-600 scale-120 drop-shadow-md" : "text-green-600"}`}>
                <Unlock size={12} /> Public Key
              </div>
            </div>
          </div>
        </div>

        {/* Message Flow Animation */}
        <div className="absolute top-1/2 left-[15%] right-[15%] h-20 -translate-y-1/2 z-5 pointer-events-none">
          <style>
            {`
              @keyframes dsSlideRight {
                0% { left: 0%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 100%; opacity: 0; transform: translate(-50%, -50%); }
              }
              @keyframes dsSlideLeft {
                0% { left: 100%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 0%; opacity: 0; transform: translate(-50%, -50%); }
              }
              .animate-ds-slide-right {
                animation: dsSlideRight ${5 / speed}s ease-in-out forwards;
              }
              .animate-ds-slide-left {
                animation: dsSlideLeft ${5 / speed}s ease-in-out forwards;
              }
            `}
          </style>

          {/* Step 1: Signing the message */}
          {step === 1 && (
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-2 rounded-lg shadow-md border border-indigo-200 flex flex-col items-center">
              <div className="relative">
                <FileText size={24} className="text-blue-500 mb-1" />
                <PenTool size={16} className="text-red-600 absolute bottom-1 -right-2" />
              </div>
              <span className="text-xs font-mono text-indigo-700 animate-pulse">Signing...</span>
            </div>
          )}

          {/* Step 2: Sending message + signature */}
          {step === 2 && (
            <div className="absolute top-1/2 animate-ds-slide-right bg-blue-50 p-2 rounded-lg shadow-md border border-blue-200 flex flex-col items-center">
              <div className="flex items-center gap-1">
                <FileText size={20} className="text-blue-500" />
                <span className="text-gray-400">+</span>
                <PenTool size={18} className="text-purple-600" />
              </div>
              <span className="text-xs font-mono text-blue-700 whitespace-nowrap">Message + Signature</span>
            </div>
          )}

          {/* Step 3: Public key sent to receiver (or already known) */}
          {step === 3 && (
            <div className="absolute top-1/2 animate-ds-slide-right bg-green-50 p-2 rounded-lg shadow-md border border-green-200 flex flex-col items-center">
              <Unlock size={24} className="text-green-600 mb-1" />
              <span className="text-xs font-mono text-green-700 whitespace-nowrap">Public Key</span>
            </div>
          )}

          {/* Step 4: Verifying */}
          {step === 4 && (
            <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-2 rounded-lg shadow-md border border-indigo-200 flex flex-col items-center">
              <div className="relative">
                <PenTool size={24} className="text-purple-600 mb-1 opacity-50" />
                <Unlock size={16} className="text-green-600 absolute bottom-1 -left-2" />
              </div>
              <span className="text-xs font-mono text-indigo-700 animate-pulse">Verifying...</span>
            </div>
          )}

        </div>

        {/* Attacker (Middle) */}
        <div className="relative z-10 flex top-[0%] flex-col items-center gap-2 mt-32">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <UserSearch size={36} className="text-red-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800 text-sm">Attacker</p>
            <div className="flex flex-col items-center mt-1 min-h-[3rem]">
              {step >= 3 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 mt-1 ${step === 3 ? "text-green-600 scale-120 drop-shadow-md" : "text-green-600"}`}>
                  <Unlock size={12} /> Public Key
                </div>
              )}
              <p className="text-xs text-gray-500 max-w-[120px]">
                {step === 2 ? "Sees message + signature" : step === 3 ? "Sees Public Key (can only verify, not forge)" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Receiver (Your friend) */}
        <div className="relative z-3 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Your friend</p>
            <div className="flex flex-col items-center mt-1 min-h-[3rem]">
              {step >= 2 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 mt-1 ${step === 2 ? "text-blue-600 scale-120 drop-shadow-md" : "text-blue-600"}`}>
                  <FileText size={12} /> Message
                </div>
              )}
              {step >= 2 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 mt-1 ${step === 2 ? "text-purple-600 scale-120 drop-shadow-md" : "text-purple-600"}`}>
                  <PenTool size={12} /> Signature
                </div>
              )}
              {step >= 3 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 mt-1 ${step === 3 ? "text-green-600 scale-120 drop-shadow-md" : "text-green-600"}`}>
                  <Unlock size={12} /> Public Key
                </div>
              )}
              {step >= 5 && (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mt-1 animate-fade-in bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <CheckCircle2 size={12} /> Verified ✓
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* State explanations */}
      <div className="mt-16 bg-white p-4 rounded-lg border text-sm text-gray-600 text-center min-h-[4rem] flex items-center justify-center shadow-sm">
        {step === 0 && <p><strong>Step 1:</strong> You generate an asymmetric Key Pair. The <strong>Private Key</strong> is kept secret; the <strong>Public Key</strong> can be shared with everyone.</p>}
        {step === 1 && <p><strong>Step 2:</strong> You use your <strong>Private Key</strong> to compute a digital <strong>Signature</strong> over the message. Only the Private Key holder can create this signature.</p>}
        {step === 2 && <p><strong>Step 3:</strong> You send the message together with its signature. The attacker can see both, but cannot forge a new valid signature.</p>}
        {step === 3 && <p><strong>Step 4:</strong> Your <strong>Public Key</strong> is shared with your friend (and is visible to the attacker — but it can only be used to <strong>verify</strong>, not to sign).</p>}
        {step === 4 && <p><strong>Step 5:</strong> Your friend uses your <strong>Public Key</strong> to mathematically verify the signature against the received message.</p>}
        {step === 5 && <p><strong>Step 6:</strong> Verification succeeds! Your friend is now certain the message is <strong>authentic</strong> (from you) and has <strong>not been tampered with</strong>.</p>}
      </div>

      {/* Progress Steps (Tiles) */}
      <div className="mt-4 w-full flex gap-2">
        {Array.from({ length: maxSteps }, (_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => {
              setStep(s);
            }}
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${step === s
                ? "bg-gray-600 shadow-sm"
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
