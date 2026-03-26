import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";

import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

function modExp(base: number, exp: number, mod: number): number {
  if (mod <= 0 || isNaN(mod)) return 0;
  if (mod === 1) return 0;
  try {
    let res = 1n;
    let b = BigInt(base) % BigInt(mod);
    let e = BigInt(Math.max(0, exp));
    let m = BigInt(mod);
    while (e > 0n) {
      if (e % 2n === 1n) res = (res * b) % m;
      b = (b * b) % m;
      e /= 2n;
    }
    return Number(res);
  } catch (err) {
    return 0;
  }
}

export function DHNumericAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [pStr, setPStr] = useState("23");
  const [gStr, setGStr] = useState("5");
  const [aStr, setAStr] = useState("6");
  const [bStr, setBStr] = useState("15");
  
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const P = parseInt(pStr) || 1;
  const g = parseInt(gStr) || 1;
  const a = parseInt(aStr) || 1;
  const b = parseInt(bStr) || 1;

  const A = modExp(g, a, P);
  const B = modExp(g, b, P);
  const Sa = modExp(B, a, P);
  const Sb = modExp(A, b, P);

  const maxSteps = 6;

  useEffect(() => {
    if (step >= maxSteps) setStep(0);
  }, [maxSteps, step]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 4000 / speed);
    return () => clearTimeout(timer);
  }, [isPaused, speed, step, maxSteps]);

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

    window.addEventListener("slide-next", handleNext);
    window.addEventListener("slide-prev", handlePrev);
    window.addEventListener("slide-space", handleSpace);

    return () => {
      window.removeEventListener("slide-next", handleNext);
      window.removeEventListener("slide-prev", handlePrev);
      window.removeEventListener("slide-space", handleSpace);
    };
  }, [step, maxSteps]);

  const reset = () => {
    setStep(0);
    setIsPaused(false);
  };

  const getDescription = () => {
    switch (step) {
      case 0: return "Public Parameters: Alice and Bob agree on a prime P and a generator g.";
      case 1: return "Private Keys: Alice and Bob independently generate their own secret numbers a and b.";
      case 2: return "Public Keys: Each computes their public value using modular exponentiation.";
      case 3: return "Key Exchange: The public keys A and B are exchanged over the insecure public channel.";
      case 4: return "Shared Secret: Each participant raises the received public key to their private key power.";
      case 5: return "Success: By mathematical magic, both compute the identical shared secret S!";
      default: return "";
    }
  };

  const handleInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setStep(0);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Settings Row */}
      <div className="flex flex-wrap w-full items-center gap-x-6 gap-y-2 mb-4 justify-center bg-gray-50 p-2 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Prime (P):</label>
          <input type="number" min={2} max={9999} value={pStr} onChange={handleInput(setPStr)} className="border rounded px-2 py-1 text-gray-800 w-16 font-mono shadow-inner outline-none focus:border-blue-400 text-xs" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Generator (g):</label>
          <input type="number" min={2} max={9999} value={gStr} onChange={handleInput(setGStr)} className="border rounded px-2 py-1 text-gray-800 w-16 font-mono shadow-inner outline-none focus:border-blue-400 text-xs" />
        </div>
        <div className="h-4 w-px bg-gray-300 mx-2" />
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-pink-700">Alice Priv (a):</label>
          <input type="number" min={1} max={9999} value={aStr} onChange={handleInput(setAStr)} className="border rounded px-2 py-1 text-pink-800 w-16 font-mono shadow-inner outline-none focus:border-pink-400 text-xs bg-pink-50" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-blue-700">Bob Priv (b):</label>
          <input type="number" min={1} max={9999} value={bStr} onChange={handleInput(setBStr)} className="border rounded px-2 py-1 text-blue-800 w-16 font-mono shadow-inner outline-none focus:border-blue-400 text-xs bg-blue-50" />
        </div>
      </div>

      {/* Header Info */}
      <div className="h-8 flex items-center justify-center mb-4 px-2">
        <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-center">
          {getDescription()}
        </h3>
      </div>

      {/* Animation Grid */}
      <div className="flex w-full items-stretch justify-center gap-2 min-h-[290px] relative">
        
        {/* ALICE COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-pink-50/50 border border-pink-200 rounded-xl p-3 z-10 w-1/3">
          <div className="font-bold text-pink-700 text-base mb-3 flex items-center gap-2">
            Alice
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Private Key</span>
              <span className="font-mono text-lg font-semibold text-pink-600">a = {a}</span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Compute Public Key A</span>
              <span className="font-mono text-sm mb-1 text-gray-600">A = g<sup className="-mt-1 relative top-[-4px]">a</sup> mod P</span>
              <span className="font-mono text-base font-semibold text-pink-700 border-t border-gray-100 pt-1 w-full text-center">
                A = {g}<sup className="text-xs">{a}</sup> mod {P} = {A}
              </span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border-2 border-green-200 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-green-700 mb-1">Compute Shared Secret</span>
              <span className="font-mono text-sm mb-1 text-gray-600">S = B<sup className="-mt-1 relative top-[-4px]">a</sup> mod P</span>
              <span className="font-mono text-base font-semibold text-green-700 border-t border-gray-100 pt-1 w-full text-center">
                S = {B}<sup className="text-xs">{a}</sup> mod {P} = {Sa}
              </span>
            </div>
            
            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg border-2 border-green-400 font-bold font-mono text-lg shadow-inner">
                S = {Sa}
              </div>
            </div>
          </div>
        </div>

        {/* PUBLIC CHANNEL COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-gray-50 border-x border-gray-200 px-2 py-3 relative w-1/3">
          <div className="font-bold text-gray-600 text-sm mb-3">
            Public Channel
          </div>
          
          {/* Public Parameters */}
          <div className={`transition-opacity duration-500 bg-white border border-gray-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[160px] ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100 pb-1 mb-1 w-full text-center">Global Parameters</span>
            <span className="font-mono text-sm font-semibold text-gray-800">P = {P}</span>
            <span className="font-mono text-sm font-semibold text-gray-800">g = {g}</span>
          </div>

          {/* Flying Keys Area */}
          <div className="flex-1 w-full flex flex-col justify-center relative min-h-[120px]">
            {/* Alice's Key A flying to Bob */}
            <div className={`absolute left-0 right-0 flex justify-center transition-all duration-700 ease-in-out ${step === 3 ? 'top-1/4 opacity-100' : step > 3 ? 'top-1/4 opacity-0 scale-90' : 'top-0 opacity-0'}`}>
              <div className="bg-pink-100 border border-pink-300 text-pink-800 px-3 py-1 rounded-full shadow font-mono text-sm flex items-center gap-2 font-bold z-20">
                A = {A} <ArrowRight size={14} />
              </div>
            </div>
            
            {/* Bob's Key B flying to Alice */}
            <div className={`absolute left-0 right-0 flex justify-center transition-all duration-700 ease-in-out delay-150 ${step === 3 ? 'bottom-1/4 opacity-100' : step > 3 ? 'bottom-1/4 opacity-0 scale-90' : 'bottom-0 opacity-0'}`}>
              <div className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-1 rounded-full shadow font-mono text-sm flex items-center gap-2 font-bold z-20">
                <ArrowLeft size={14} /> B = {B}
              </div>
            </div>
          </div>
          
          <div className={`mt-auto transition-opacity duration-500 ${step >= 5 ? 'opacity-100' : 'opacity-0'}`}>
             <div className="text-xs text-center text-gray-500 px-2">Alice and Bob now share a secret safely!</div>
          </div>
        </div>

        {/* BOB COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-blue-50/50 border border-blue-200 rounded-xl p-3 z-10 w-1/3">
          <div className="font-bold text-blue-700 text-base mb-3 flex items-center gap-2">
            Bob
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Private Key</span>
              <span className="font-mono text-lg font-semibold text-blue-600">b = {b}</span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Compute Public Key B</span>
              <span className="font-mono text-sm mb-1 text-gray-600">B = g<sup className="-mt-1 relative top-[-4px]">b</sup> mod P</span>
              <span className="font-mono text-base font-semibold text-blue-700 border-t border-gray-100 pt-1 w-full text-center">
                B = {g}<sup className="text-xs">{b}</sup> mod {P} = {B}
              </span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border-2 border-green-200 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-green-700 mb-1">Compute Shared Secret</span>
              <span className="font-mono text-sm mb-1 text-gray-600">S = A<sup className="-mt-1 relative top-[-4px]">b</sup> mod P</span>
              <span className="font-mono text-base font-semibold text-green-700 border-t border-gray-100 pt-1 w-full text-center">
                S = {A}<sup className="text-xs">{b}</sup> mod {P} = {Sb}
              </span>
            </div>

            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg border-2 border-green-400 font-bold font-mono text-lg shadow-inner">
                S = {Sb}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Controls Container */}
      <div className="mt-4 flex flex-col items-center gap-3 w-full">
        {/* Progress Tiles */}
        <div className="w-full flex gap-1 px-4">
          {[...Array(maxSteps)].map((_, s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                step === s
                  ? "bg-blue-600 shadow-sm"
                  : s < step
                  ? "bg-indigo-300 hover:bg-indigo-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Control Buttons and Speed Control */}
        <div className="flex mt-1 item-center justify-between px-4 w-full">
          <div className="flex gap-2 mx-auto">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex justify-center items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors bg-white px-2 py-1 rounded border shadow-sm cursor-pointer w-20"
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              {isPaused ? "Play" : "Pause"}
            </button>
            <button
              onClick={reset}
              className="flex justify-center items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors bg-white px-2 py-1 rounded border shadow-sm cursor-pointer w-20"
            >
              <RotateCcw size={12} />
              Restart
            </button>
            <div className="scale-90 origin-left">
              <AnimationSpeedControl baseTimeMs={4000} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}