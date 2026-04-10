import React, { useState, useEffect } from "react";
import { User, Droplet, Droplets, PaintBucket, RefreshCw, Pause, Play, KeyRound, UserSearch, AlertTriangle } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function MITMDHKeyDistributionAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed] = useGlobalAnimationSpeed();
  const maxSteps = 7;

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
      setStep((prev) => (prev + 1) % maxSteps);
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gray-50 rounded-xl border border-gray-200 my-8 shadow-sm">
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-800 m-0 pt-1">Active MITM Attack on Diffie-Hellman</h3>
        </div>
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
              <RefreshCw size={14} className={step === 6 && !isPaused ? "animate-spin" : ""} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={5000} />
        </div>
      </div>

      <div className="relative flex justify-between items-start pt-6 h-64">
        {/* Connection Line */}
        <div className="absolute top-[4rem] left-12 right-12 h-1 bg-gray-300 -translate-y-1/2 border-t border-b border-gray-400 border-dashed z-0" />

        {/* Sender (Alice) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center w-28">
            <p className="font-bold text-gray-800">You</p>
            <div className="flex flex-col items-center mt-1 min-h-[5rem] space-y-1">
              <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 0 || step === 2 ? "text-yellow-600 scale-120 drop-shadow-md" : "text-yellow-600"}`}>
                <PaintBucket size={12} /> Common Paint
              </div>
              {step >= 1 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 1 || step === 5 || step === 2 ? "text-red-600 scale-120 drop-shadow-md" : "text-red-600"}`}>
                  <Droplet size={12} fill="currentColor" /> Secret Paint
                </div>
              )}
              {step >= 5 && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-900 mt-2 animate-fade-in bg-amber-400 px-2 py-1 rounded border border-amber-600">
                  <KeyRound size={12} /> Key A
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Flow Animation */}
        <div className="absolute top-[4rem] left-[15%] right-[15%] h-20 -translate-y-1/2 z-40 pointer-events-none">
          <style>
            {`
              @keyframes slideRightToMid {
                0% { left: 0%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 45%; opacity: 0; transform: translate(-50%, -50%); }
              }
              @keyframes slideLeftToMid {
                0% { left: 100%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 55%; opacity: 0; transform: translate(-50%, -50%); }
              }
              @keyframes slideMidToLeft {
                0% { left: 45%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 0%; opacity: 0; transform: translate(-50%, -50%); }
              }
              @keyframes slideMidToRight {
                0% { left: 55%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { left: 100%; opacity: 0; transform: translate(-50%, -50%); }
              }
              .animate-slide-right-mid { animation: slideRightToMid ${5 / speed}s ease-in-out forwards; }
              .animate-slide-left-mid { animation: slideLeftToMid ${5 / speed}s ease-in-out forwards; }
              .animate-slide-mid-left { animation: slideMidToLeft ${5 / speed}s ease-in-out forwards; }
              .animate-slide-mid-right { animation: slideMidToRight ${5 / speed}s ease-in-out forwards; }
            `}
          </style>

          {/* Step 2: Mixing happening on all sides */}
          {step === 2 && (
            <>
              {/* Alice Mix */}
              <div className="absolute top-1/2 left-[6%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-orange-300 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Droplet size={16} className="text-yellow-500" fill="currentColor" />
                  <span className="text-gray-400">+</span>
                  <Droplet size={16} className="text-red-500" fill="currentColor" />
                  <span className="text-gray-400">=</span>
                  <Droplets size={20} className="text-orange-500" fill="currentColor" />
                </div>
                <span className="text-xs font-medium text-orange-600 mt-1 animate-pulse">Mixing...</span>
              </div>
              
              {/* Attacker Mix */}
              <div className="absolute top-[-40%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-lime-400 flex flex-col items-center z-30">
                <div className="flex items-center gap-1">
                  <Droplet size={16} className="text-yellow-500" fill="currentColor" />
                  <span className="text-gray-400">+</span>
                  <Droplet size={16} className="text-emerald-500" fill="currentColor" />
                  <span className="text-gray-400">=</span>
                  <Droplets size={20} className="text-lime-500" fill="currentColor" />
                </div>
                <span className="text-xs font-medium text-lime-600 mt-1 animate-pulse">Mixing...</span>
              </div>

              {/* Bob Mix */}
              <div className="absolute top-1/2 left-[94%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-cyan-300 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Droplets size={20} className="text-cyan-500" fill="currentColor" />
                  <span className="text-gray-400">=</span>
                  <Droplet size={16} className="text-blue-500" fill="currentColor" />
                  <span className="text-gray-400">+</span>
                  <Droplet size={16} className="text-yellow-500" fill="currentColor" />
                </div>
                <span className="text-xs font-medium text-cyan-600 mt-1 animate-pulse">Mixing...</span>
              </div>
            </>
          )}

          {/* Step 3: Travelling public mixtures intercepted by attacker */}
          {step === 3 && (
            <>
              <div className="absolute top-[50%] animate-slide-right-mid bg-orange-50 p-2 rounded-full shadow-md border border-orange-200">
                <Droplets size={24} className="text-orange-500" fill="currentColor" />
              </div>
              <div className="absolute top-[50%] animate-slide-left-mid bg-cyan-50 p-2 rounded-full shadow-md border border-cyan-200">
                <Droplets size={24} className="text-cyan-500" fill="currentColor" />
              </div>
            </>
          )}

          {/* Step 4: Attacker sending their own public mixture out */}
          {step === 4 && (
            <>
              <div className="absolute top-[50%] animate-slide-mid-left bg-lime-50 p-2 rounded-full shadow-md border border-lime-300 z-[60]">
                <Droplets size={24} className="text-lime-500" fill="currentColor" />
              </div>
              <div className="absolute top-[50%] animate-slide-mid-right bg-lime-50 p-2 rounded-full shadow-md border border-lime-300 z-[60]">
                <Droplets size={24} className="text-lime-500" fill="currentColor" />
              </div>
            </>
          )}

          {/* Step 5 & 6: Final mixing at all destinations */}
          {(step === 5 || step === 6) && (
            <>
              {/* Alice computes Key A */}
              <div className="absolute top-1/2 left-[10%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-amber-900 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Droplets size={16} className="text-lime-500" fill="currentColor" />
                  <span className="text-gray-400">+</span>
                  <Droplet size={16} className="text-red-500" fill="currentColor" />
                  <span className="text-gray-400">=</span>
                  <Droplets size={20} className="text-amber-900" fill="currentColor" />
                </div>
              </div>

              {/* Bob computes Key B */}
              <div className="absolute top-1/2 left-[90%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-fuchsia-900 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Droplets size={20} className="text-fuchsia-900" fill="currentColor" />
                  <span className="text-gray-400">=</span>
                  <Droplet size={16} className="text-blue-500" fill="currentColor" />
                  <span className="text-gray-400">+</span>
                  <Droplets size={16} className="text-lime-500" fill="currentColor" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Attacker (Middle) */}
        <div className="relative z-51 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-300 shadow-lg relative">
            <UserSearch size={36} className="text-red-600" />
          </div>
          <div className="text-center min-w-[150px]">
            <p className="font-bold text-red-800 text-base">Active Attacker</p>
            <div className="flex flex-col items-center mt-1 space-y-1">
              <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 0 || step === 2 ? "text-yellow-600 scale-120 drop-shadow-md" : "text-yellow-600"}`}>
                <PaintBucket size={12} /> Common Paint
              </div>
              {step >= 1 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 1 || step === 2 || step === 5 ? "text-emerald-600 scale-120 drop-shadow-md" : "text-emerald-600"}`}>
                  <Droplet size={12} fill="currentColor" /> Attacker Secret
                </div>
              )}
              
              {/* Show intercepted mixtures */}
              {step >= 3 && step < 5 && (
                 <div className="flex gap-2 mt-1 fade-in">
                    <div className="bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                       <Droplets size={12} className="text-orange-500" fill="currentColor" /> <span className="text-gray-500 text-[10px]">from A</span>
                    </div>
                    <div className="bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                       <Droplets size={12} className="text-cyan-500" fill="currentColor" /> <span className="text-gray-500 text-[10px]">from B</span>
                    </div>
                 </div>
              )}

              {/* Show attacker calculating BOTH keys in Step 5+ */}
              {step >= 5 && (
                <div className="flex gap-3 mt-2 animate-fade-in w-full justify-center">
                  <div className="flex flex-col items-center bg-white p-1.5 rounded-lg shadow-sm border border-red-200">
                    <div className="flex items-center gap-0.5 mb-1 scale-90">
                      <Droplets size={12} className="text-orange-500" fill="currentColor" />
                      <span className="text-gray-400 text-[10px]">+</span>
                      <Droplet size={12} className="text-emerald-500" fill="currentColor" />
                      <span className="text-gray-400 text-[10px]">=</span>
                      <Droplets size={14} className="text-amber-900" fill="currentColor" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-400 px-1 py-0.5 rounded w-full justify-center">
                      <KeyRound size={10} /> Key A
                    </div>
                  </div>
                  <div className="flex flex-col items-center bg-white p-1.5 rounded-lg shadow-sm border border-red-200">
                    <div className="flex items-center gap-0.5 mb-1 scale-90">
                      <Droplets size={12} className="text-cyan-500" fill="currentColor" />
                      <span className="text-gray-400 text-[10px]">+</span>
                      <Droplet size={12} className="text-emerald-500" fill="currentColor" />
                      <span className="text-gray-400 text-[10px]">=</span>
                      <Droplets size={14} className="text-fuchsia-900" fill="currentColor" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-fuchsia-900 bg-fuchsia-200 px-1 py-0.5 rounded w-full justify-center">
                      <KeyRound size={10} /> Key B
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Receiver (Bob) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center w-28">
            <p className="font-bold text-gray-800">Your friend</p>
            <div className="flex flex-col items-center mt-1 min-h-[5rem] space-y-1">
              <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 0 || step === 2 ? "text-yellow-600 scale-120 drop-shadow-md" : "text-yellow-600"}`}>
                <PaintBucket size={12} /> Common Paint
              </div>
              {step >= 1 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 1 || step === 5 || step === 2 ? "text-blue-600 scale-120 drop-shadow-md" : "text-blue-600"}`}>
                  <Droplet size={12} fill="currentColor" /> Secret Paint
                </div>
              )}
              {step >= 5 && (
                <div className="flex items-center gap-1 text-xs font-bold text-fuchsia-900 mt-2 animate-fade-in bg-fuchsia-200 px-2 py-1 rounded border border-fuchsia-400">
                  <KeyRound size={12} /> Key B
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* State explanations */}
      <div className="mt-8 bg-white p-4 rounded-lg border text-sm text-gray-600 text-center min-h-[4rem] flex items-center justify-center shadow-sm relative z-20">
        {step === 0 && <p><strong>Step 1:</strong> You and your friend agree on the public <strong>Yellow Common Paint</strong>. The Attacker is monitoring the connection and also sees it.</p>}
        {step === 1 && <p><strong>Step 2:</strong> You selects <strong>Secret Red</strong>. Your friend selects <strong>Secret Blue</strong>. Importantly, the Attacker generates his own <strong>Secret Green Paint</strong>!</p>}
        {step === 2 && <p><strong>Step 3:</strong> Everyone conceptually mixes their secret color with the public yellow base.</p>}
        {step === 3 && <p><strong>Step 4:</strong> When You and your friend send their mixtures, the Attacker <strong>intercepts</strong> them both! They never reach their true destination.</p>}
        {step === 4 && <p><strong>Step 5:</strong> The Attacker sends her own <strong>Lime mixture</strong> to you and your friend (pretending to be your friend/you respectively)</p>}
        {step === 5 && <p><strong>Step 6:</strong> You mix your Red with Attacker's Lime, resulting in <strong>Key A</strong>. Your friend mixes his Blue with Attacker's Lime, resulting in <strong>Key B</strong>. You and your friend have different keys!</p>}
        {step === 6 && <p className="text-red-700 font-medium"><strong>Result:</strong> The Attacker can compute both Key A and Key B! He sits in the middle, decrypting your messages with Key A, reading them, and re-encrypting them for your friend with Key B.</p>}
      </div>

      {/* Progress Steps (Tiles) */}
      <div className="mt-4 w-full flex gap-2">
        {Array.from({ length: 7 }).map((_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => {
              setStep(s);
            }}
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              step === s
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
