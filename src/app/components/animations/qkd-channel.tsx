import React, { useState, useEffect } from "react";
import { Monitor, Server, RefreshCw, Pause, Play, KeyRound, Lock, AlertTriangle, Zap, ShieldOff, Send } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function QKDChannelAnimation() {
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

  const isEncrypted = step >= 4;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl border border-gray-200 my-6 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-lg font-bold text-gray-800 m-0 pt-1">Option 2: QKD via Dedicated Channel</h3>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              onClick={togglePause}
              className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors bg-white px-2.5 py-1 rounded-md border shadow-sm cursor-pointer"
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              {isPaused ? "Play" : "Pause"}
            </button>
            <button
              onClick={reset}
              className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors bg-white px-2.5 py-1 rounded-md border shadow-sm cursor-pointer"
            >
              <RefreshCw size={12} className={step === maxSteps - 1 && !isPaused ? "animate-spin" : ""} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={5000} />
        </div>
      </div>

      {/* Main diagram */}
      <div className="relative flex justify-between items-start">

        {/* Alice */}
        <div className="relative z-10 flex flex-col items-center gap-2 w-28">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${
            isEncrypted ? "bg-emerald-100" : "bg-sky-100"
          }`}>
            <Monitor size={28} className={isEncrypted ? "text-emerald-600" : "text-sky-600"} />
          </div>
          <p className="font-bold text-gray-800 text-sm">Alice</p>
          <div className="flex flex-col items-center gap-1 min-h-[4rem]">
            {step >= 1 && (
              <div className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-500 ${step === 1 ? "text-amber-600 scale-110" : "text-amber-600"}`}>
                <Zap size={10} /> Photon Source
              </div>
            )}
            {step >= 3 && (
              <div className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-500 ${step === 3 ? "text-indigo-600 scale-110" : "text-indigo-600"}`}>
                <KeyRound size={10} /> Sifted Key
              </div>
            )}
            {step >= 4 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-fade-in">
                <Lock size={10} /> AES Key
              </div>
            )}
          </div>
        </div>

        {/* Connection area */}
        <div className="flex-1 relative mx-4 mt-4">
          {/* Two channels */}

          {/* Quantum channel (top) */}
          <div className="relative mb-2">
            <div className={`h-0.5 transition-all duration-700 ${
              step >= 1 && step <= 2
                ? "bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 shadow-sm shadow-amber-200"
                : "bg-amber-200"
            }`} />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-50 px-2 py-0.5 rounded text-[9px] font-bold text-amber-700 border border-amber-200 whitespace-nowrap">
              ⚡ Dedicated Quantum Fiber
            </div>
          </div>

          {/* Classical channel (bottom) */}
          <div className="relative mt-6">
            <div className={`h-0.5 transition-all duration-700 ${
              isEncrypted
                ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 shadow-sm shadow-emerald-200"
                : "bg-gray-300 border-t border-dashed border-gray-400"
            }`} />
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-bold border whitespace-nowrap ${
              isEncrypted
                ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}>
              {isEncrypted ? "🔒 Encrypted Channel" : "📡 Public Internet"}
            </div>
          </div>

          <style>
            {`
              @keyframes qkdPhotonRight {
                0% { left: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { left: 100%; opacity: 0; }
              }
              @keyframes qkdSlideRight {
                0% { left: 0%; opacity: 0; transform: translateY(-50%); }
                15% { opacity: 1; transform: translateY(-50%) scale(1.05); }
                85% { opacity: 1; transform: translateY(-50%) scale(1.05); }
                100% { left: 100%; opacity: 0; transform: translateY(-50%); }
              }
              @keyframes qkdSlideLeft {
                0% { left: 100%; opacity: 0; transform: translate(-100%, -50%); }
                15% { opacity: 1; transform: translate(-100%, -50%) scale(1.05); }
                85% { opacity: 1; transform: translate(-100%, -50%) scale(1.05); }
                100% { left: 0%; opacity: 0; transform: translate(-100%, -50%); }
              }
              .qkd-photon-right {
                animation: qkdPhotonRight ${5 / speed}s ease-in-out forwards;
              }
              .qkd-slide-right {
                animation: qkdSlideRight ${5 / speed}s ease-in-out forwards;
              }
              .qkd-slide-left {
                animation: qkdSlideLeft ${5 / speed}s ease-in-out forwards;
              }
            `}
          </style>

          {/* Animated messages */}
          <div className="relative h-28 -mt-10">

            {/* Step 1: Photons travelling */}
            {step === 1 && (
              <div className="absolute top-2 w-full">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute qkd-photon-right"
                    style={{ animationDelay: `${i * 0.3 / speed}s`, top: '-2px' }}
                  >
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-300"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Basis comparison over classical channel */}
            {step === 2 && (
              <>
                <div className="absolute top-14 qkd-slide-right">
                  <div className="bg-gray-50 px-3 py-1.5 rounded-lg shadow-md border border-gray-300 flex items-center gap-1.5 whitespace-nowrap">
                    <Send size={12} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-700">Bases: ⊕⊗⊕⊗⊕⊗⊕⊗</span>
                  </div>
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-indigo-50 p-2 rounded-lg shadow-md border border-indigo-200 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-indigo-700">Sifting (basis comparison)</span>
                  <span className="text-[9px] text-indigo-500 mt-0.5">Matching bases → keep bits</span>
                </div>
              </>
            )}

            {/* Step 3: Key derived */}
            {step === 3 && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-50 p-3 rounded-lg shadow-md border border-amber-300 flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <KeyRound size={16} className="text-amber-600" />
                  <span className="text-sm font-bold text-amber-800">Shared Key Established</span>
                </div>
                <span className="text-[10px] text-amber-600 mt-1">via quantum key distribution (BB84)</span>
              </div>
            )}

            {/* Step 4: Encrypted data */}
            {step === 4 && (
              <>
                <div className="absolute top-12 qkd-slide-right">
                  <div className="bg-emerald-50 px-2 py-1 rounded-lg shadow-md border border-emerald-300 flex items-center gap-1 whitespace-nowrap">
                    <Lock size={10} className="text-emerald-600" />
                    <span className="text-[10px] font-mono text-emerald-700">AES encrypted</span>
                  </div>
                </div>
                <div className="absolute top-20 qkd-slide-left">
                  <div className="bg-emerald-50 px-2 py-1 rounded-lg shadow-md border border-emerald-300 flex items-center gap-1 whitespace-nowrap">
                    <Lock size={10} className="text-emerald-600" />
                    <span className="text-[10px] font-mono text-emerald-700">AES encrypted</span>
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Warning */}
            {step === 5 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 p-3 rounded-lg shadow-md border border-red-300 flex flex-col items-center max-w-[280px]">
                <div className="flex items-center gap-2">
                  <ShieldOff size={16} className="text-red-500" />
                  <span className="text-sm font-bold text-red-700">No Authentication!</span>
                </div>
                <span className="text-[10px] text-red-600 mt-1 text-center">Server identity is NOT verified. A MITM attacker could impersonate either party.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bob */}
        <div className="relative z-10 flex flex-col items-center gap-2 w-28">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${
            isEncrypted ? "bg-emerald-100" : "bg-violet-100"
          }`}>
            <Server size={28} className={isEncrypted ? "text-emerald-600" : "text-violet-600"} />
          </div>
          <p className="font-bold text-gray-800 text-sm">Bob</p>
          <div className="flex flex-col items-center gap-1 min-h-[4rem]">
            {step >= 1 && (
              <div className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-500 ${step === 1 ? "text-amber-600 scale-110" : "text-amber-600"}`}>
                <Zap size={10} /> Photon Detector
              </div>
            )}
            {step >= 3 && (
              <div className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-500 ${step === 3 ? "text-indigo-600 scale-110" : "text-indigo-600"}`}>
                <KeyRound size={10} /> Sifted Key
              </div>
            )}
            {step >= 4 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-fade-in">
                <Lock size={10} /> AES Key
              </div>
            )}
            {step >= 5 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 mt-1">
                <AlertTriangle size={10} /> Not Authenticated
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key properties */}
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        {[
          { label: "QKD (Key Exchange)", active: step >= 1, color: "amber" },
          { label: "AES-256 (Encryption)", active: step >= 4, color: "emerald" },
          { label: "No Authentication ⚠", active: step >= 5, color: "red" },
        ].map((alg) => (
          <span
            key={alg.label}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all duration-500 ${
              alg.active
                ? `bg-${alg.color}-50 text-${alg.color}-700 border-${alg.color}-300 shadow-sm`
                : "bg-gray-100 text-gray-400 border-gray-200"
            }`}
          >
            {alg.label}
          </span>
        ))}
      </div>

      {/* Step explanations */}
      <div className="mt-4 bg-white p-3 rounded-lg border text-sm text-gray-600 text-center min-h-[3.5rem] flex items-center justify-center shadow-sm">
        {step === 0 && <p><strong>Setup:</strong> Alice and Bob are connected by a <strong>dedicated quantum fiber</strong> for photon transmission and a <strong>public classical channel</strong> for sifting.</p>}
        {step === 1 && <p><strong>Step 1:</strong> Alice sends <strong>polarized photons</strong> to Bob through the dedicated quantum fiber (BB84 protocol).</p>}
        {step === 2 && <p><strong>Step 2:</strong> Alice and Bob compare <strong>measurement bases</strong> over the public channel. Matching-basis bits form the sifted key.</p>}
        {step === 3 && <p><strong>Step 3:</strong> After error correction and privacy amplification, Alice and Bob share an identical <strong>quantum-derived key</strong>.</p>}
        {step === 4 && <p><strong>Step 4:</strong> They use the shared key for <strong>AES-256 encryption</strong>. Data travels over the public internet, encrypted with the QKD-derived key.</p>}
        {step === 5 && <p><strong>⚠ Limitation:</strong> QKD provides <strong>no authentication</strong>. Without additional mechanisms (pre-shared keys or classical signatures), a MITM attack is possible.</p>}
      </div>

      {/* Progress tiles */}
      <div className="mt-3 w-full flex gap-2">
        {Array.from({ length: maxSteps }, (_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              step === s ? "bg-gray-600 shadow-sm" : "bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}
