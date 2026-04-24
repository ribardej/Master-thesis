import React, { useState, useEffect } from "react";
import { Monitor, Server, RefreshCw, Pause, Play, Shield, KeyRound, Lock, FileCheck, CheckCircle2, Send } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function PQCChannelAnimation() {
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

  const isEncrypted = step >= 6;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl border border-gray-200 my-6 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-lg font-bold text-gray-800 m-0 pt-1">Option 1: Pure PQC Channel</h3>
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

        {/* Client */}
        <div className="relative z-10 flex flex-col items-center gap-2 w-28">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${
            isEncrypted ? "bg-emerald-100" : "bg-sky-100"
          }`}>
            <Monitor size={28} className={isEncrypted ? "text-emerald-600" : "text-sky-600"} />
          </div>
          <p className="font-bold text-gray-800 text-sm">Client</p>
          <div className="flex flex-col items-center gap-1 min-h-[4rem]">
            {step >= 3 && (
              <div className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-500 ${step === 3 ? "text-emerald-600 scale-110" : "text-emerald-600"}`}>
                <CheckCircle2 size={10} /> Cert Verified
              </div>
            )}
            {step >= 4 && (
              <div className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-500 ${step === 4 ? "text-indigo-600 scale-110" : "text-indigo-600"}`}>
                <KeyRound size={10} /> ML-KEM Key
              </div>
            )}
            {step >= 5 && (
              <div className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-500 ${step === 5 ? "text-violet-600 scale-110" : "text-violet-600"}`}>
                <Shield size={10} /> ML-DSA OK
              </div>
            )}
            {step >= 6 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-fade-in">
                <Lock size={10} /> AES Key
              </div>
            )}
          </div>
        </div>

        {/* Connection area with messages */}
        <div className="flex-1 relative mx-4 mt-8">
          {/* Connection line */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-700 ${
            isEncrypted
              ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 shadow-sm shadow-emerald-200"
              : "bg-gray-300 border-t border-dashed border-gray-400"
          }`} />

          {isEncrypted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-100 px-2 py-0.5 rounded text-[9px] font-bold text-emerald-700 border border-emerald-300 whitespace-nowrap">
              ENCRYPTED CHANNEL
            </div>
          )}

          {/* "Internet" label */}
          {!isEncrypted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 px-2 py-0.5 rounded text-[9px] font-medium text-gray-500 border border-gray-200 whitespace-nowrap">
              Public Internet
            </div>
          )}

          <style>
            {`
              @keyframes pqcSlideRight {
                0% { left: 0%; opacity: 0; transform: translateY(-50%); }
                15% { opacity: 1; transform: translateY(-50%) scale(1.05); }
                85% { opacity: 1; transform: translateY(-50%) scale(1.05); }
                100% { left: 100%; opacity: 0; transform: translateY(-50%); }
              }
              @keyframes pqcSlideLeft {
                0% { left: 100%; opacity: 0; transform: translate(-100%, -50%); }
                15% { opacity: 1; transform: translate(-100%, -50%) scale(1.05); }
                85% { opacity: 1; transform: translate(-100%, -50%) scale(1.05); }
                100% { left: 0%; opacity: 0; transform: translate(-100%, -50%); }
              }
              .pqc-slide-right {
                animation: pqcSlideRight ${5 / speed}s ease-in-out forwards;
              }
              .pqc-slide-left {
                animation: pqcSlideLeft ${5 / speed}s ease-in-out forwards;
              }
            `}
          </style>

          {/* Messages */}
          <div className="relative h-32">
            {/* Step 0: ClientHello */}
            {step === 0 && (
              <div className="absolute top-4 pqc-slide-right">
                <div className="bg-sky-50 px-3 py-1.5 rounded-lg shadow-md border border-sky-200 flex items-center gap-1.5 whitespace-nowrap">
                  <Send size={12} className="text-sky-500" />
                  <span className="text-xs font-semibold text-sky-700">ClientHello + ML-KEM ek</span>
                </div>
              </div>
            )}

            {/* Step 1: ServerHello */}
            {step === 1 && (
              <div className="absolute top-4 pqc-slide-left">
                <div className="bg-violet-50 px-3 py-1.5 rounded-lg shadow-md border border-violet-200 flex items-center gap-1.5 whitespace-nowrap">
                  <Send size={12} className="text-violet-500 rotate-180" />
                  <span className="text-xs font-semibold text-violet-700">ServerHello + ML-KEM ct</span>
                </div>
              </div>
            )}

            {/* Step 2: Certificate */}
            {step === 2 && (
              <div className="absolute top-4 pqc-slide-left">
                <div className="bg-amber-50 px-3 py-1.5 rounded-lg shadow-md border border-amber-200 flex items-center gap-1.5 whitespace-nowrap">
                  <FileCheck size={12} className="text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">Certificate (ML-DSA)</span>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="absolute top-4 left-[10%] -translate-x-1/2 bg-white p-2 rounded-lg shadow-md border border-emerald-300 flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <FileCheck size={14} className="text-amber-500" />
                  <span className="text-gray-400">→</span>
                  <Shield size={14} className="text-emerald-500" />
                  <span className="text-gray-400">→</span>
                  <CheckCircle2 size={14} className="text-emerald-600" />
                </div>
                <span className="text-[10px] font-medium text-emerald-600 mt-1 animate-pulse">Verifying PKI chain...</span>
              </div>
            )}

            {/* Step 4: Key Exchange (ML-KEM) */}
            {step === 4 && (
              <>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-indigo-50 p-2 rounded-lg shadow-md border border-indigo-300 flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <KeyRound size={14} className="text-indigo-500" />
                    <span className="text-xs font-bold text-indigo-700">ML-KEM Key Exchange</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 mt-1">Encapsulate / Decapsulate</span>
                </div>
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-amber-50 px-3 py-1 rounded border border-amber-200 animate-pulse">
                  <span className="text-[10px] font-bold text-amber-700">Shared Secret Derived</span>
                </div>
              </>
            )}

            {/* Step 5: Server signs */}
            {step === 5 && (
              <div className="absolute top-4 pqc-slide-left">
                <div className="bg-violet-50 px-3 py-1.5 rounded-lg shadow-md border border-violet-200 flex items-center gap-1.5 whitespace-nowrap">
                  <Shield size={12} className="text-violet-500" />
                  <span className="text-xs font-semibold text-violet-700">Signature (ML-DSA)</span>
                </div>
              </div>
            )}

            {/* Step 6: Encrypted data */}
            {step === 6 && (
              <>
                <div className="absolute top-2 pqc-slide-right">
                  <div className="bg-emerald-50 px-2 py-1 rounded-lg shadow-md border border-emerald-300 flex items-center gap-1 whitespace-nowrap">
                    <Lock size={10} className="text-emerald-600" />
                    <span className="text-[10px] font-mono text-emerald-700">AES encrypted</span>
                  </div>
                </div>
                <div className="absolute top-12 pqc-slide-left">
                  <div className="bg-emerald-50 px-2 py-1 rounded-lg shadow-md border border-emerald-300 flex items-center gap-1 whitespace-nowrap">
                    <Lock size={10} className="text-emerald-600" />
                    <span className="text-[10px] font-mono text-emerald-700">AES encrypted</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Server */}
        <div className="relative z-10 flex flex-col items-center gap-2 w-28">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${
            isEncrypted ? "bg-emerald-100" : "bg-violet-100"
          }`}>
            <Server size={28} className={isEncrypted ? "text-emerald-600" : "text-violet-600"} />
          </div>
          <p className="font-bold text-gray-800 text-sm">Server</p>
          <div className="flex flex-col items-center gap-1 min-h-[4rem]">
            <div className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
              <FileCheck size={10} /> ML-DSA Cert
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-red-500">
              <Lock size={10} /> Private Key
            </div>
            {step >= 4 && (
              <div className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-500 ${step === 4 ? "text-indigo-600 scale-110" : "text-indigo-600"}`}>
                <KeyRound size={10} /> ML-KEM Key
              </div>
            )}
            {step >= 6 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-fade-in">
                <Lock size={10} /> AES Key
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Algorithm badges */}
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        {[
          { label: "ML-KEM (Key Exchange)", active: step >= 4, color: "indigo" },
          { label: "ML-DSA (Signature)", active: step >= 5, color: "violet" },
          { label: "PKI (Certificates)", active: step >= 2, color: "amber" },
          { label: "AES-256 (Encryption)", active: step >= 6, color: "emerald" },
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
        {step === 0 && <p><strong>Step 1:</strong> Client sends <strong>ClientHello</strong> with supported cipher suites and its <strong>ML-KEM encapsulation key</strong>.</p>}
        {step === 1 && <p><strong>Step 2:</strong> Server responds with <strong>ServerHello</strong>, and sends the <strong>ML-KEM ciphertext</strong> (encapsulated shared secret).</p>}
        {step === 2 && <p><strong>Step 3:</strong> Server sends its <strong>certificate</strong> containing an <strong>ML-DSA</strong> public key, signed by a Certificate Authority.</p>}
        {step === 3 && <p><strong>Step 4:</strong> Client <strong>verifies the certificate chain</strong> using PKI — checking ML-DSA signatures up to a trusted Root CA.</p>}
        {step === 4 && <p><strong>Step 5:</strong> Client decapsulates the ML-KEM ciphertext to recover the <strong>shared secret</strong>. Both parties derive the same key.</p>}
        {step === 5 && <p><strong>Step 6:</strong> Server <strong>signs the handshake</strong> using ML-DSA. Client verifies the signature to <strong>authenticate</strong> the server.</p>}
        {step === 6 && <p><strong>Step 7:</strong> Both derive <strong>AES-256 symmetric keys</strong> from the shared secret. All data is now encrypted. <strong>Quantum-safe channel established!</strong></p>}
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
