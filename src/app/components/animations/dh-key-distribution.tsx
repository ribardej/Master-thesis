import React, { useState, useEffect } from "react";
import { User, Droplet, Droplets, PaintBucket, Shuffle, EyeOff, RefreshCw, Pause, Play, KeyRound, UserSearch } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function DHKeyDistributionAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed] = useGlobalAnimationSpeed();
  const maxSteps = 6;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 3000 / speed);
    return () => clearInterval(timer);
  }, [isPaused, speed]);

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
      <div className="flex justify-between items-start mb-12">
        <h3 className="text-xl font-bold text-gray-800 m-0 pt-1">Analogy for Diffie-Hellman Key Exchange</h3>
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
              <RefreshCw size={14} className={step === 5 && !isPaused ? "animate-spin" : ""} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={3000} />
        </div>
      </div>

      <div className="relative flex justify-between items-center h-56">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-12 right-12 h-1 bg-gray-200 -translate-y-1/2 z-0" />

        {/* Sender (Alice) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center w-28">
            <p className="font-bold text-gray-800">Alice</p>
            <div className="flex flex-col items-center mt-1 min-h-[5rem] space-y-1">
              <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 0 || step === 2? "text-yellow-600 scale-120 drop-shadow-md" : "text-yellow-600"}`}>
                <PaintBucket size={12} /> Common Paint
              </div>
              {step >= 1 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 1 || step === 4  || step === 2? "text-red-600 scale-120 drop-shadow-md" : "text-red-600"}`}>
                  <Droplet size={12} fill="currentColor" /> Secret Paint
                </div>
              )}
              {step >= 4 && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 mt-2 animate-fade-in bg-amber-50 px-2 py-1 rounded border border-amber-200">
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
                animation: slideLeft ${3.3 / speed}s ease-in-out forwards;
              }
              .animate-slide-right {
                animation: slideRight ${3.3 / speed}s ease-in-out forwards;
              }
            `}
          </style>

          {/* Step 2: Mixing happening on both sides */}
          {step === 2 && (
            <>
              <div className="absolute top-1/4 left-[10%]  -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-orange-300 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Droplet size={16} className="text-yellow-500" fill="currentColor" />
                  <span className="text-gray-400">+</span>
                  <Droplet size={16} className="text-red-500" fill="currentColor" />
                  <span className="text-gray-400">=</span>
                  <Droplets size={20} className="text-orange-500" fill="currentColor" />
                </div>
                <span className="text-xs font-medium text-orange-600 mt-1 animate-pulse">Mixing...</span>
              </div>
              <div className="absolute top-1/4 left-[90%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-cyan-300 flex flex-col items-center">
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

          {/* Step 3: Travelling public mixtures passing each other */}
          {step === 3 && (
            <>
              <div className="absolute top-1/2 animate-slide-right bg-orange-50 p-2 rounded-full shadow-md border border-orange-200">
                <Droplets size={24} className="text-orange-500" fill="currentColor" />
              </div>
              <div className="absolute top-1/2 animate-slide-left bg-cyan-50 p-2 rounded-full shadow-md border border-cyan-200">
                <Droplets size={24} className="text-cyan-500" fill="currentColor" />
              </div>
            </>
          )}

          {/* Step 4: Final mixing at destinations */}
          {(step === 4 || step === 5) && (
            <>
              <div className="absolute top-1/4 left-[10%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-amber-800 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Droplets size={16} className="text-cyan-500" fill="currentColor" />
                  <span className="text-gray-400">+</span>
                  <Droplet size={16} className="text-red-500" fill="currentColor" />
                  <span className="text-gray-400">=</span>
                  <Droplets size={20} className="text-amber-800" fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-1/4 left-[90%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-amber-800 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Droplets size={20} className="text-amber-800" fill="currentColor" />
                  <span className="text-gray-400">=</span>
                  <Droplet size={16} className="text-blue-500" fill="currentColor" />
                  <span className="text-gray-400">+</span>
                  <Droplets size={16} className="text-orange-500" fill="currentColor" />
                </div>
              </div>
            </>
          )}

          {/* Step 5: Attacker tries mixing intercepts */}
          {step === 5 && (
            <div className="absolute top-[180%] mt-6 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-slate-400 flex flex-col items-center z-30">
              <div className="flex items-center gap-1">
                <Droplets size={16} className="text-orange-500" fill="currentColor" />
                <span className="text-gray-400">+</span>
                <Droplets size={16} className="text-cyan-500" fill="currentColor" />
                <span className="text-gray-400">=</span>
                <Droplets size={20} className="text-slate-800" fill="currentColor" />
              </div>
              <span className="text-[10px] font-semibold text-slate-800 mt-1 uppercase tracking-wider">Failed Mix</span>
            </div>
          )}
        </div>

        {/* Attacker (Middle) */}
        <div className="relative z-10 flex flex-col items-center gap-2 mt-32">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <UserSearch size={36} className="text-red-600" />
          </div>
          <div className="text-center min-w-[120px]">
            <p className="font-bold text-gray-800 text-sm">Attacker</p>
            <div className="flex flex-col items-center mt-1 min-h-[5rem] space-y-1">
              <div className="flex items-center gap-1 text-xs font-medium text-yellow-600">
                <PaintBucket size={12} /> Common Paint
              </div>
              {step >= 3 && (
                <div className="flex items-center gap-1 text-xs font-medium animate-fade-in bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                  <Droplets size={12} className="text-orange-500" fill="currentColor" />
                  <span className="text-gray-400">&</span>
                  <Droplets size={12} className="text-cyan-500" fill="currentColor" />
                </div>
              )}
              {step === 5 && (
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mt-1 animate-fade-in bg-slate-100 px-2 py-1 rounded border border-slate-300">
                  <KeyRound size={12} /> Wrong Key
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
            <p className="font-bold text-gray-800">Bob</p>
            <div className="flex flex-col items-center mt-1 min-h-[5rem] space-y-1">
              <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 0 || step === 2? "text-yellow-600 scale-120 drop-shadow-md" : "text-yellow-600"}`}>
                <PaintBucket size={12} /> Common Paint
              </div>
              {step >= 1 && (
                <div className={`flex items-center gap-1 text-xs font-medium transition-all duration-500 ${step === 1 || step === 4  || step === 2? "text-blue-600 scale-120 drop-shadow-md" : "text-blue-600"}`}>
                  <Droplet size={12} fill="currentColor" /> Secret Paint
                </div>
              )}
              {step >= 4 && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 mt-2 animate-fade-in bg-amber-50 px-2 py-1 rounded border border-amber-200">
                  <KeyRound size={12} /> Shared Key
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* State explanations */}
      <div className="mt-16 bg-white p-4 rounded-lg border text-sm text-gray-600 text-center min-h-[4rem] flex items-center justify-center shadow-sm">
        {step === 0 && <p><strong>Step 1:</strong> Both parties agree on a public starting base, visualized as <strong>Yellow Common Paint</strong>. Everyone sees this.</p>}
        {step === 1 && <p><strong>Step 2:</strong> Alice selects a <strong>Secret Red Paint</strong>. Bob selects a <strong>Secret Blue Paint</strong>. They keep these hidden.</p>}
        {step === 2 && <p><strong>Step 3:</strong> They mathematically mix their secret color with the common yellow base.</p>}
        {step === 3 && <p><strong>Step 4:</strong> They exchange their mixed colors. The attacker sees the mixtures, but mathematically cannot "un-mix" them to find the secrets.</p>}
        {step === 4 && <p><strong>Step 5:</strong> Both add their own secret color to the received mixture. The math ensures both arrive at the exact same <strong>Brown Shared Key</strong>!</p>}
        {step === 5 && <p><strong>Step 6:</strong> If the attacker tries to mix the intercepted mixtures together, they result in a completely different <strong>Wrong Key</strong> (due to a different proportion of the common paint)</p>}
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