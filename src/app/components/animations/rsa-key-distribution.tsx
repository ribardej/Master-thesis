import React, { useState, useEffect } from "react";
import { User, KeyRound, Lock, Unlock, EyeOff, FileLock2, RefreshCw, Pause, Play, Package } from "lucide-react";

export function RSAKeyDistributionAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const maxSteps = 6;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const handleNext = (e: Event) => {
      if (step < maxSteps - 1) {
        e.preventDefault();
        setStep((prev) => prev + 1);
        setIsPaused(true);
      }
    };

    const handlePrev = (e: Event) => {
      if (step > 0) {
        e.preventDefault();
        setStep((prev) => prev - 1);
        setIsPaused(true);
      }
    };

    window.addEventListener('slide-next', handleNext);
    window.addEventListener('slide-prev', handlePrev);

    return () => {
      window.removeEventListener('slide-next', handleNext);
      window.removeEventListener('slide-prev', handlePrev);
    };
  }, [step]);

  const reset = () => setStep(0);
  const togglePause = () => {
    if (isPaused) {
      setStep((prev) => (prev + 1) % maxSteps);
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-gray-50 rounded-xl border border-gray-200 my-8 shadow-sm">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-xl font-bold text-gray-800 m-0">General Principle of RSA Key Distribution</h3>
        <div className="flex gap-2">
          <button 
            onClick={togglePause}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            {isPaused ? "Play" : "Pause"}
          </button>
          <button 
            onClick={reset}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
          >
            <RefreshCw size={14} className={step === 5 && !isPaused ? "animate-spin" : ""} />
            Restart
          </button>
        </div>
      </div>

      <div className="relative flex justify-between items-center h-48">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-12 right-12 h-1 bg-gray-200 -translate-y-1/2 z-0" />

        {/* Sender (Alice) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Sender</p>
            <div className="flex flex-col items-center mt-1 min-h-[3rem]">
              {step >= 1 && (
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Unlock size={12} /> Public Key
                </div>
              )}
              {step >= 2 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 mt-1 ${step === 2 || step === 5 ? "text-amber-600 scale-110 drop-shadow-md" : "text-amber-500"}`}>
                  <KeyRound size={12} /> Shared Key
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Flow Animation */}
        <div className="absolute top-1/2 left-[15%] right-[15%] h-20 -translate-y-1/2 z-20 pointer-events-none">
          <style>
            {`
              @keyframes slideLeft {
                0% { left: 100%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 0%; opacity: 0; transform: translate(-50%, -50%); }
              }
              @keyframes slideRight {
                0% { left: 0%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 100%; opacity: 0; transform: translate(-50%, -50%); }
              }
              .animate-slide-left {
                animation: slideLeft 2.8s ease-in-out forwards;
              }
              .animate-slide-right {
                animation: slideRight 2.8s ease-in-out forwards;
              }
            `}
          </style>

          {/* Step 1: Public key travels from Receiver to Sender */}
          {step === 1 && (
            <div className="absolute top-1/2 animate-slide-left bg-green-50 p-2 rounded-lg shadow-md border border-green-200 flex flex-col items-center">
              <Unlock size={24} className="text-green-600 mb-1" />
              <span className="text-xs font-mono text-green-700 whitespace-nowrap">Public Key</span>
            </div>
          )}

          {/* Step 2: Sender Encrypting symmetric key with Public key */}
          {step === 2 && (
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-2 rounded-lg shadow-md border border-indigo-200 flex flex-col items-center">
              <div className="relative">
                <KeyRound size={24} className="text-amber-500 mb-1" />
                <Lock size={16} className="text-green-600 absolute bottom-1 -right-2" />
              </div>
              <span className="text-xs font-mono text-indigo-700 animate-pulse">Encrypting...</span>
            </div>
          )}

          {/* Step 3: Travelling encrypted symmetric key */}
          {step === 3 && (
            <div className="absolute top-1/2 animate-slide-right bg-red-50 p-2 rounded-lg shadow-md border border-red-200 flex flex-col items-center">
              <Package size={24} className="text-red-500 mb-1" />
              <span className="text-xs font-mono text-red-700 whitespace-nowrap">"X9#kP$2"</span>
            </div>
          )}

          {/* Step 4: Receiver decrypting with Private Key */}
          {step === 4 && (
            <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-2 rounded-lg shadow-md border border-indigo-200 flex flex-col items-center">
              <div className="relative">
                <Package size={24} className="text-red-500 mb-1 opacity-50" />
                <Lock size={16} className="text-red-600 absolute bottom-1 -left-2" />
              </div>
              <span className="text-xs font-mono text-indigo-700 animate-pulse">Decrypting...</span>
            </div>
          )}

        </div>

        {/* Attacker (Middle) */}
        <div className="relative z-10 flex flex-col items-center gap-2 mt-32">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <EyeOff size={28} className="text-red-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800 text-sm">Attacker</p>
            <p className="text-xs text-gray-500 max-w-[120px]">
              {step === 1 ? "Sees Public Key (useless alone)" : step === 3 ? "Sees encrypted Shared Key" : "-"}
            </p>
          </div>
        </div>

        {/* Receiver (Bob) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Receiver</p>
            <div className="flex flex-col items-center mt-1 min-h-[3rem]">
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Unlock size={12} /> Public Key
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 mt-1 ${step === 4 ? "text-red-600 scale-110 drop-shadow-md" : "text-red-500"}`}>
                <Lock size={12} /> Private Key
              </div>
              {step >= 4 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 mt-1 ${step === 5 ? "text-amber-600 scale-110 drop-shadow-md" : "text-amber-500 animate-fade-in"}`}>
                  <KeyRound size={12} /> Shared Key
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* State explanations */}
      <div className="mt-16 bg-white p-4 rounded-lg border text-sm text-gray-600 text-center min-h-[4rem] flex items-center justify-center shadow-sm">
        {step === 0 && <p><strong>Step 1:</strong> Receiver generates an asymmetric Key Pair (Public & Private).</p>}
        {step === 1 && <p><strong>Step 2:</strong> Receiver sends the <strong>Public Key</strong> openly. Attacker sees it, but it can only encrypt, not decrypt.</p>}
        {step === 2 && <p><strong>Step 3:</strong> Sender generates a secure <strong>Shared Key</strong> and encrypts it using Receiver's Public Key.</p>}
        {step === 3 && <p><strong>Step 4:</strong> Sender transmits the encrypted Shared Key back securely.</p>}
        {step === 4 && <p><strong>Step 5:</strong> Receiver uses their secret <strong>Private Key</strong> to decrypt the package.</p>}
        {step === 5 && <p><strong>Step 6:</strong> Both now share the exact same <strong>Symmetric Key</strong>!</p>}
      </div>

      {/* Progress Steps (Tiles) */}
      <div className="mt-4 w-full flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => {
              setStep(s);
              setIsPaused(true);
            }}
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              step === s
                ? "bg-gray-600 shadow-sm"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}