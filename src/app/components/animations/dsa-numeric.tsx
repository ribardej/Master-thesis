import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

// Modular exponentiation
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

// Extended Euclidean Algorithm for modular inverse
function modInverse(a: number, m: number): number {
  let m0 = m, y = 0, x = 1;
  if (m === 1) return 0;
  let currA = ((a % m) + m) % m;
  while (currA > 1) {
    let q = Math.floor(currA / m0);
    let t = m0;
    m0 = currA % m0;
    currA = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < 0) x += m;
  return x;
}

export function DSANumericAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Small educative DSA parameters
  // p=131, q=13 (q | p-1=130), g = 4^((p-1)/q) mod p = 4^10 mod 131 = 52
  const p = 131;
  const q = 13;
  const g = 52; // generator of subgroup of order q

  // Key generation: private key x, public key y = g^x mod p
  const x = 7;
  const y = modExp(g, x, p); // 18

  // Signing: hash h=9, per-message secret k=3
  const h = 97;
  const k = 5;
  const r = modExp(g, k, p) % q;           // (g^k mod p) mod q = 2
  const kInv = modInverse(k, q);            // k^(-1) mod q = 4
  const s = ((kInv * (h + x * r)) % q + q) % q; // 4

  // Verification
  const w = modInverse(s, q);               // s^(-1) mod q = 3
  const u1 = (h * w) % q;                   // 5
  const u2 = (r * w) % q;                   // 6
  const v = (modExp(g, u1, p) * modExp(y, u2, p)) % p % q; // 2

  const maxSteps = 8;

  useEffect(() => {
    if (step >= maxSteps) setStep(0);
  }, [maxSteps, step]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 5000 / speed);
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
      case 0: return "1. Domain Parameters: A prime p, subgroup order q (q | p-1), and generator g are agreed upon.";
      case 1: return "2. Key Generation: You pick a private key x and compute public key y = g^x mod p.";
      case 2: return "3. Hash: You hash the message m to get a fixed-size digest h = H('DSA sign this').";
      case 3: return "4. Per-message Secret: You choose a random k (0 < k < q). This MUST be unique per signature!";
      case 4: return "5. Compute Signature (r, s): r = (g^k mod p) mod q, s = k⁻¹(h + xr) mod q.";
      case 5: return "6. Send: The message m='DSA sign this' and signature (r, s) are sent over the public channel.";
      case 6: return "7. Verification: Your friend computes w, u₁, u₂, and v using your Public Key.";
      case 7: return "8. Result: If v = r, the signature is valid — the message is authentic.";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Top Controls Row */}
      <div className="flex flex-wrap w-full items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 m-0">DSA Example</h3>
        <div className="flex gap-2 items-center">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex justify-center items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors bg-gray-50 px-3 py-1.5 rounded border shadow-sm cursor-pointer"
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              {isPaused ? "Play" : "Pause"}
            </button>
            <button
              onClick={reset}
              className="flex justify-center items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors bg-gray-50 px-3 py-1.5 rounded border shadow-sm cursor-pointer"
            >
              <RotateCcw size={14} />
              Restart
            </button>
            <div className="scale-90 origin-right">
              <AnimationSpeedControl baseTimeMs={5000} />
            </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="h-8 flex items-center justify-center mb-4 px-2 w-full">
        <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-center">
          {getDescription()}
        </h3>
      </div>

      {/* Animation Grid */}
      <div className="flex w-full items-stretch justify-center gap-2 min-h-[370px] relative">
        
        {/* SIGNER COLUMN (You) */}
        <div className="flex-1 flex flex-col items-center bg-pink-50/50 border border-pink-200 rounded-xl p-3 z-10 w-[30%]">
          <div className="font-bold text-pink-700 text-base mb-3 flex items-center gap-2">
            You (Signer)
          </div>
          
          <div className="flex flex-col gap-1.5 w-full">
            {/* Private Key */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-red-200 flex flex-col items-center ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-red-700">Private Key (Secret!)</span>
              <span className="font-mono text-sm font-bold text-red-600">x = {x}</span>
            </div>

            {/* Hash */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Hash the Message</span>
              <span className="font-mono text-[10px] text-gray-600">h = H('DSA sign this')</span>
              <span className="font-mono text-sm font-semibold text-pink-700">h = {h}</span>
            </div>

            {/* Random k */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-orange-200 flex flex-col items-center ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-orange-700">Per-message Secret</span>
              <span className="font-mono text-sm font-bold text-orange-600">k = {k}</span>
              <span className="text-[8px] text-orange-500 italic">Must never be reused!</span>
            </div>

            {/* Compute r */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-purple-200 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-purple-700">Compute r</span>
              <span className="font-mono text-[10px] text-gray-600">r = (g<sup className="relative top-[-2px]">k</sup> mod p) mod q</span>
              <span className="font-mono text-[10px] text-gray-600">r = ({g}<sup className="text-[8px]">{k}</sup> mod {p}) mod {q}</span>
              <span className="font-mono text-sm font-bold text-purple-700">r = {r}</span>
            </div>

            {/* Compute s */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-purple-200 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-purple-700">Compute s</span>
              <span className="font-mono text-[10px] text-gray-600">s = k⁻¹(h + x·r) mod q</span>
              <span className="font-mono text-[10px] text-gray-600">s = {kInv}·({h} + {x}·{r}) mod {q}</span>
              <span className="font-mono text-sm font-bold text-purple-700">s = {s}</span>
            </div>

            {/* Signature result */}
            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg border-2 border-purple-400 font-bold font-mono text-sm shadow-inner">
                σ = ({r}, {s})
              </div>
            </div>
          </div>
        </div>

        {/* PUBLIC CHANNEL COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-gray-50 border-x border-gray-200 px-2 py-3 relative w-[40%]">
          <div className="font-bold text-gray-600 text-sm mb-3">
            Public Channel
          </div>
          
          {/* Domain Parameters */}
          <div className={`transition-opacity duration-500 bg-white border border-gray-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[160px] ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100 pb-1 mb-1 w-full text-center">Domain Parameters</span>
            <span className="font-mono text-sm font-semibold text-gray-800">p = {p}</span>
            <span className="font-mono text-sm font-semibold text-gray-800">q = {q}</span>
            <span className="font-mono text-sm font-semibold text-gray-800">g = {g}</span>
          </div>

          {/* Public Key */}
          <div className={`transition-opacity duration-500 bg-white border border-blue-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[160px] mt-2 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[10px] uppercase font-bold text-blue-600 border-b border-gray-100 pb-1 mb-1 w-full text-center">Your Public Key</span>
            <span className="font-mono text-[10px] text-gray-600">y = g<sup className="relative top-[-2px]">x</sup> mod p</span>
            <span className="font-mono text-sm font-bold text-blue-800">y = {y}</span>
          </div>

          {/* Flying signature */}`
          <div className="flex-1 w-full flex flex-col justify-center relative min-h-[100px]">
            <div className={`absolute left-0 right-0 flex justify-center transition-all duration-700 ease-in-out ${step === 5 ? 'top-1/3 opacity-100' : step > 5 ? 'top-1/3 opacity-0 scale-90 translate-x-8' : 'top-0 opacity-0 -translate-x-8'}`}>
              <div className="flex flex-col shadow-lg rounded-xl overflow-hidden border border-gray-200 z-20">
                <div className="bg-green-100 text-green-800 px-3 py-1 font-mono text-[10px] font-semibold text-center border-b border-blue-100">
                  m='DSA sign this'
                </div>
                <div className="bg-purple-100 text-purple-800 px-3 py-1.5 font-mono text-xs font-bold text-center">
                  σ=({r}, {s})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VERIFIER COLUMN (Your friend) */}
        <div className="flex-1 flex flex-col items-center bg-blue-50/50 border border-blue-200 rounded-xl p-3 z-10 w-[30%]">
          <div className="font-bold text-blue-700 text-base mb-3 flex items-center gap-2">
            Your friend (Verifier)
          </div>
          
          <div className="flex flex-col gap-1.5 w-full">
            {/* Received signature */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Msg & Signature</span>
              <span className="font-mono text-xs font-semibold text-gray-700">m = 'DSA sign this'</span>
              <span className="font-mono text-[10px] font-semibold text-blue-600">σ = ({r}, {s})</span>
            </div>

            {/* Re-hash */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Re-hash Message</span>
              <span className="font-mono text-[10px] text-gray-600">H('DSA sign this')</span>
              <span className="font-mono text-sm font-semibold text-blue-700">h = {h}</span>
            </div>

            {/* Compute w, u1, u2 */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Intermediate Values</span>
              <span className="font-mono text-[10px] text-gray-600">w = s⁻¹ mod q = {w}</span>
              <span className="font-mono text-[10px] text-gray-600">u₁ = h·w mod q = {u1}</span>
              <span className="font-mono text-[10px] text-gray-600">u₂ = r·w mod q = {u2}</span>
            </div>

            {/* Compute v */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-green-200 flex flex-col items-center ${step >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-green-700">Compute Verification Value</span>
              <span className="font-mono text-[10px] text-gray-600">v = (g<sup className="relative top-[-2px]">u₁</sup>·y<sup className="relative top-[-2px]">u₂</sup> mod p) mod q</span>
              <span className="font-mono text-[10px] text-gray-600">v = ({g}<sup className="text-[8px]">{u1}</sup>·{y}<sup className="text-[8px]">{u2}</sup> mod {p}) mod {q}</span>
              <span className="font-mono text-sm font-bold text-green-700">v = {v}</span>
            </div>

            {/* Result */}
            <div className={`transition-all duration-500 w-full flex flex-col items-center gap-1 ${step >= 7 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className={`text-xs font-bold mt-1 px-3 py-1 rounded-lg border-2 shadow-inner ${v === r ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
                {v === r ? `✓ v = r = ${r} → Signature VALID` : `✗ v ≠ r → Signature INVALID`}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Controls Container */}
      <div className="mt-4 flex flex-col items-center gap-3 w-full">
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
      </div>
      <div className="mt-4 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}
