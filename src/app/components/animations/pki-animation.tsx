import React, { useState, useEffect } from "react";
import { Building2, User, Shield, FileCheck, Unlock, Lock, CheckCircle2, RefreshCw, Pause, Play, Award, ArrowDown, Link } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function PKIAnimationComponent() {
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
    <div className="w-full max-w-3xl mx-auto p-5 bg-gray-50 rounded-xl border border-gray-200 my-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800 m-0 pt-1">Public Key Infrastructure — Chain of Trust</h3>
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

      {/* Chain of Trust Diagram */}
      <div className="flex flex-col items-center gap-0.5">

        {/* Root CA */}
        <div className={`flex items-center gap-3 w-full max-w-md px-3 py-2 rounded-lg border-2 transition-all duration-500 ${step >= 0 ? "bg-amber-50 border-amber-300 shadow-sm" : "bg-gray-100 border-gray-200 opacity-40"
          } ${step === 0 ? "scale-[1.05] ring-2 ring-amber-400 ring-offset-1" : ""}`}>
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-300 flex-shrink-0">
            <Building2 size={20} className="text-amber-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-amber-900 text-xs">Root Certificate Authority</p>
            <p className="text-[10px] text-amber-700">Self-signed · <strong>Pre-installed in your OS/browser</strong></p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5 text-[10px] font-medium text-red-600">
                <Lock size={8} /> Private
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-medium text-green-600">
                <Unlock size={8} /> Public
              </div>
            </div>
          </div>
          {step >= 0 && <Shield size={18} className={`text-amber-600 flex-shrink-0 transition-all duration-300 ${step === 0 ? "animate-pulse" : ""}`} />}
        </div>

        {/* Arrow: Root CA signs Intermediate CA */}
        <div className={`flex flex-col items-center transition-all duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"} leading-none`}>
          <span className="text-[10px] font-medium text-gray-500 italic">signs</span>
          <ArrowDown size={14} className="text-gray-400" />
        </div>

        {/* Intermediate CA */}
        <div className={`flex items-center gap-3 w-full max-w-md px-3 py-2 rounded-lg border-2 transition-all duration-500 ${step >= 1 ? "bg-indigo-50 border-indigo-300 shadow-sm" : "bg-gray-100 border-gray-200 opacity-40"
          } ${step === 1 ? "scale-[1.05] ring-2 ring-indigo-400 ring-offset-1" : ""}`}>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-300 flex-shrink-0">
            <Award size={20} className="text-indigo-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-indigo-900 text-xs">Intermediate CA</p>
            <p className="text-[10px] text-indigo-700">Certified by Root CA</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5 text-[10px] font-medium text-red-600">
                <Lock size={8} /> Private
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-medium text-green-600">
                <Unlock size={8} /> Public
              </div>
              {step >= 1 && (
                <div className={`flex items-center gap-0.5 text-[10px] font-medium text-amber-600 transition-all duration-300 ${step === 1 ? "scale-110" : ""}`}>
                  <FileCheck size={8} /> Cert
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Arrow: Intermediate CA signs end entity */}
        <div className={`flex flex-col items-center transition-all duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"} leading-none`}>
          <span className="text-[10px] font-medium text-gray-500 italic">signs</span>
          <ArrowDown size={14} className="text-gray-400" />
        </div>

        {/* End-Entity (Your friend) */}
        <div className={`flex items-center gap-3 w-full max-w-md px-3 py-2 rounded-lg border-2 transition-all duration-500 ${step >= 2 ? "bg-green-50 border-green-300 shadow-sm" : "bg-gray-100 border-gray-200 opacity-40"
          } ${step === 2 ? "scale-[1.05] ring-2 ring-green-400 ring-offset-1" : ""}`}>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-300 flex-shrink-0">
            <User size={20} className="text-green-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-green-900 text-xs">Your Friend</p>
            <p className="text-[10px] text-green-700">End entity — owns the public key</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5 text-[10px] font-medium text-red-600">
                <Lock size={8} /> Private
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-medium text-green-600">
                <Unlock size={8} /> Public
              </div>
              {step >= 2 && (
                <div className={`flex items-center gap-0.5 text-[10px] font-medium text-indigo-600 transition-all duration-300 ${step === 2 ? "scale-110" : ""}`}>
                  <FileCheck size={8} /> Cert
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Arrow: Certificate sent to verifier */}
        <div className={`flex flex-col items-center transition-all duration-500 ${step >= 3 ? "opacity-100" : "opacity-0"} leading-none`}>
          <span className="text-[10px] font-medium text-gray-500 italic">sends certificate to</span>
          <ArrowDown size={14} className="text-gray-400" />
        </div>

        {/* Verifier (You) */}
        <div className={`flex items-center gap-3 w-full max-w-md px-3 py-2 rounded-lg border-2 transition-all duration-500 ${step >= 3 ? "bg-sky-50 border-sky-300 shadow-sm" : "bg-gray-100 border-gray-200 opacity-40"
          } ${step === 3 || step === 4 ? "scale-[1.05] ring-2 ring-sky-400 ring-offset-1" : ""}`}>
          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center border-2 border-sky-300 flex-shrink-0">
            <User size={20} className="text-sky-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sky-900 text-xs">You (Verifier)</p>
            <p className="text-[10px] text-sky-700">
              {step < 4 ? "Receives the certificate and checks the chain" : step === 4 ? "Verifying chain of signatures..." : "Chain verified — public key is trusted!"}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {step >= 3 && (
                <div className={`flex items-center gap-0.5 text-[10px] font-medium text-green-600 transition-all duration-300 ${step === 3 ? "scale-110" : ""}`}>
                  <FileCheck size={8} /> Friend's Cert
                </div>
              )}
              {step >= 4 && step < 5 && (
                <div className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 animate-pulse">
                  <Link size={8} /> Checking...
                </div>
              )}
              {step >= 5 && (
                <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 animate-fade-in bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 size={8} /> Trusted ✓
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* State explanations */}
      <div className="mt-4 bg-white p-3 rounded-lg border text-sm text-gray-600 text-center min-h-[3rem] flex items-center justify-center shadow-sm">
        {step === 0 && <p><strong>Step 1:</strong> A <strong>Root CA</strong> is a universally trusted authority. <strong>Its certificate is pre-installed in your operating system/browser.</strong> This is the key step that makes everything else possible.</p>}
        {step === 1 && <p><strong>Step 2:</strong> The Root CA <strong>signs</strong> the Intermediate CA's certificate, vouching that its public key is legitimate.</p>}
        {step === 2 && <p><strong>Step 3:</strong> The Intermediate CA <strong>signs</strong> your friend's certificate, binding their <strong>identity</strong> to their <strong>public key</strong>.</p>}
        {step === 3 && <p><strong>Step 4:</strong> Your friend sends you their certificate. It contains their public key + the Intermediate CA's signature.</p>}
        {step === 4 && <p><strong>Step 5:</strong> You verify the <strong>chain of signatures</strong>: friend's cert → signed by Intermediate CA → signed by Root CA → trusted by your OS.</p>}
        {step === 5 && <p><strong>Step 6:</strong> The entire chain is valid! You can now <strong>trust</strong> that the public key truly belongs to your friend.</p>}
      </div>

      {/* Progress Steps (Tiles) */}
      <div className="mt-3 w-full flex gap-2">
        {Array.from({ length: maxSteps }, (_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => {
              setStep(s);
            }}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${step === s
              ? "bg-gray-600 shadow-sm"
              : "bg-gray-200 hover:bg-gray-300"
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
