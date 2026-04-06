import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

// BigInt modular exponentiation
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
  let currA = a;
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

export function RSASignatureNumericAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Same RSA parameters as the RSA encryption example
  const p = 61;
  const q = 53;
  const eVal = 517;
  const n = p * q;           // 3233
  const phi = (p - 1) * (q - 1); // 3120
  const d = modInverse(eVal, phi); // 2413

  // Signature scenario: You sign, your friend verifies
  const h = 42; // Hash of the message H(m)
  const s = modExp(h, d, n);       // Signature: s = h^d mod n
  const hPrime = modExp(s, eVal, n); // Verify: h' = s^e mod n

  const maxSteps = 7;

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
      case 0: return "1. Key Generation: You choose two secret primes p and q, compute n and φ(n).";
      case 1: return "2. Public Key: You pick exponent e coprime to φ(n), and share your Public Key (e, n).";
      case 2: return "3. Private Key: You compute your Private Key d = e⁻¹ mod φ(n). Only you know d.";
      case 3: return "4. Hashing: You hash the message to produce a fixed-size digest h = H('RSA sign this').";
      case 4: return "5. Signing: You sign the hash using your Private Key: s = h^d mod n.";
      case 5: return "6. Message m='RSA sign this' and Signature sent over the public channel.";
      case 6: return "7. Verification: Your friend computes h' = s^e mod n and checks that h' = H('RSA sign this').";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Top Controls Row */}
      <div className="flex flex-wrap w-full items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 m-0">RSA Signature Example</h3>
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
              <AnimationSpeedControl baseTimeMs={4000} />
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
      <div className="flex w-full items-stretch justify-center gap-2 min-h-[350px] relative">
        
        {/* SIGNER COLUMN (You) */}
        <div className="flex-1 flex flex-col items-center bg-pink-50/50 border border-pink-200 rounded-xl p-3 z-10 w-[30%]">
          <div className="font-bold text-pink-700 text-base mb-3 flex items-center gap-2">
            You (Signer)
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            {/* Secret Primes */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Secret Primes</span>
              <span className="font-mono text-sm font-semibold text-pink-600">p={p}, q={q}</span>
            </div>

            {/* n and φ(n) */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Modulus & Totient</span>
              <span className="font-mono text-xs text-pink-700 w-full text-center">n = p·q = {n}</span>
              <span className="font-mono text-xs text-pink-700 w-full text-center">φ(n) = (p-1)(q-1) = {phi}</span>
            </div>

            {/* Private Key */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-red-200 flex flex-col items-center ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-red-700 mb-0.5">Private Key (Secret!)</span>
              <span className="font-mono text-[10px] text-gray-600 w-full text-center leading-tight">d = e⁻¹ mod φ(n)</span>
              <span className="font-mono text-[10px] text-gray-600 border-b border-gray-100 w-full text-center pb-0.5 mb-0.5 leading-tight">({eVal} × d) mod {phi} = 1</span>
              <span className="font-mono text-sm font-bold text-red-600">d = {d}</span>
            </div>

            {/* Hash */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Hash the Message</span>
              <span className="font-mono text-[10px] text-gray-600">h = H('RSA sign this')</span>
              <span className="font-mono text-sm font-semibold text-pink-700">h = {h}</span>
            </div>

            {/* Sign */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-purple-200 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-purple-700">Sign with Private Key</span>
              <span className="font-mono text-[10px] text-gray-600">s = h<sup className="-mt-1 relative top-[-2px]">d</sup> mod n</span>
              <span className="font-mono text-xs font-semibold text-purple-700 border-t border-gray-100 pt-0.5 w-full text-center">
                s = {h}<sup className="text-[9px]">{d}</sup> mod {n}
              </span>
            </div>

            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg border-2 border-purple-400 font-bold font-mono text-sm shadow-inner mt-1">
                s = {s}
              </div>
            </div>
          </div>
        </div>

        {/* PUBLIC CHANNEL COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-gray-50 border-x border-gray-200 px-2 py-3 relative w-[40%]">
          <div className="font-bold text-gray-600 text-sm mb-3">
            Public Channel
          </div>
          
          {/* Public Key */}
          <div className={`transition-opacity duration-500 bg-white border border-blue-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[160px] ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[10px] uppercase font-bold text-blue-600 border-b border-gray-100 pb-1 mb-1 w-full text-center">Your Public Key</span>
            <span className="font-mono text-sm font-bold text-blue-800">e = {eVal}</span>
            <span className="font-mono text-sm font-bold text-blue-800">n = {n}</span>
          </div>

          {/* Flying message+signature */}
          <div className="flex-1 w-full flex flex-col justify-center relative min-h-[140px]">
            <div className={`absolute left-0 right-0 flex justify-center transition-all duration-700 ease-in-out ${step === 5 ? 'top-1/4 opacity-100' : step > 5 ? 'top-1/4 opacity-0 scale-90 translate-x-8' : 'top-0 opacity-0 -translate-x-8'}`}>
              <div className="flex flex-col shadow-lg rounded-xl overflow-hidden border border-gray-200 z-20">
                <div className="bg-green-100 text-green-800 px-3 py-1 font-mono text-[10px] font-semibold text-center border-b border-blue-100">
                  m='RSA sign this'
                </div>
                <div className="bg-purple-100 text-purple-800 px-3 py-1.5 font-mono text-xs font-bold text-center">
                  s={s}
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
          
          <div className="flex flex-col gap-2 w-full">
            {/* Receive message */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Msg & Signature</span>
              <span className="font-mono text-xs font-semibold text-gray-700">m = 'RSA sign this'</span>
              <span className="font-mono text-[10px] font-semibold text-blue-600">s = {s}</span>
            </div>

            {/* Re-hash */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Re-hash the Message</span>
              <span className="font-mono text-[10px] text-gray-600">h = H('RSA sign this')</span>
              <span className="font-mono text-sm font-semibold text-blue-700">h = {h}</span>
            </div>

            {/* Verify */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-green-200 flex flex-col items-center ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-green-700 mb-0.5">Verify with Public Key</span>
              <span className="font-mono text-[10px] text-gray-600">h' = s<sup className="-mt-1 relative top-[-2px]">e</sup> mod n</span>
              <span className="font-mono text-xs font-semibold text-green-700 border-t border-gray-100 pt-0.5 w-full text-center">
                h' = {s}<sup className="text-[9px]">{eVal}</sup> mod {n}
              </span>
            </div>

            <div className={`transition-all duration-500 w-full flex flex-col items-center gap-1 ${step >= 6 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg border-2 border-green-400 font-bold font-mono text-sm shadow-inner mt-1">
                h' = {hPrime}
              </div>
              <div className={`text-xs font-bold mt-1 px-3 py-1 rounded-lg border-2 shadow-inner ${hPrime === h ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
                {hPrime === h ? "✓ h' = h → Signature VALID" : "✗ h' ≠ h → Signature INVALID"}
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
      </div>
      <div className="mt-4 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}
