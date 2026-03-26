import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";

import { useGlobalAnimationSpeed } from "./animation-speed-store";

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

// Simple GCD
function gcd(a: number, b: number): number {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function RSANumericAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [pStr, setPStr] = useState("61");
  const [qStr, setQStr] = useState("53");
  const [eStr, setEStr] = useState("17");
  const [mStr, setMStr] = useState("65"); // msg
  
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const p = parseInt(pStr) || 1;
  const q = parseInt(qStr) || 1;
  let eRaw = parseInt(eStr) || 1;
  const mRaw = parseInt(mStr) || 0;

  // Bob's Math
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  // Ensure e is coprime to phi (if not, just fallback to a default coprime, though for UI purposes we stick to what user types and let it break or work)
  const isCoprime = gcd(eRaw, phi) === 1;
  const eVal = eRaw;
  const d = isCoprime ? modInverse(eVal, phi) : 0;

  // Ensure message is valid (0 <= m < n)
  const m = Math.max(0, Math.min(n - 1, mRaw));

  // Alice encrypts: c = m^e mod n
  const c = modExp(m, eVal, n);

  // Bob decrypts: m' = c^d mod n
  const mPrime = modExp(c, d, n);

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

  const getDescription = () => {
    switch (step) {
      case 0: return "1. Primes: Bob chooses two private prime numbers p and q.";
      case 1: return "2. Keys Generation: Bob computes the Modulus n and Totient φ(n).";
      case 2: return "3. Public Exponent: Bob picks e coprime to φ(n), and shares Public Key (e, n).";
      case 3: return "4. Private Exponent: Bob computes his Private Key d = e⁻¹ mod φ(n).";
      case 4: return "5. Encryption: Alice wants to send a message M. She encrypts it using Bob's Public Key.";
      case 5: return "6. Transmission: Alice sends the Ciphertext C over the insecure channel.";
      case 6: return "7. Decryption: Bob uses his Private Key d to recover the original message M.";
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
          <label className="text-xs font-semibold text-blue-700">Bob's p:</label>
          <input type="number" min={2} max={999} value={pStr} onChange={handleInput(setPStr)} className="border rounded px-2 py-1 text-blue-800 w-16 font-mono shadow-inner outline-none focus:border-blue-400 text-xs bg-blue-50" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-blue-700">Bob's q:</label>
          <input type="number" min={2} max={999} value={qStr} onChange={handleInput(setQStr)} className="border rounded px-2 py-1 text-blue-800 w-16 font-mono shadow-inner outline-none focus:border-blue-400 text-xs bg-blue-50" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-blue-700">Bob's e:</label>
          <input type="number" min={3} max={999} value={eStr} onChange={handleInput(setEStr)} className={`border rounded px-2 py-1 w-16 font-mono shadow-inner outline-none text-xs bg-blue-50 ${isCoprime ? 'text-blue-800 focus:border-blue-400' : 'text-red-600 border-red-400'}`} />
        </div>
        <div className="h-4 w-px bg-gray-300 mx-2" />
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-pink-700">Alice's Msg M:</label>
          <input type="number" min={1} max={n-1} value={mStr} onChange={handleInput(setMStr)} className="border rounded px-2 py-1 text-pink-800 w-20 font-mono shadow-inner outline-none focus:border-pink-400 text-xs bg-pink-50" />
        </div>
      </div>

      {/* Header Info */}
      <div className="h-8 flex items-center justify-center mb-4 px-2 w-full">
        {!isCoprime && (
            <div className="text-xs font-bold text-red-600 mr-2 bg-red-100 px-2 py-1 rounded">⚠️ e and φ(n) not coprime!</div>
        )}
        <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-center">
          {getDescription()}
        </h3>
      </div>

      {/* Animation Grid */}
      <div className="flex w-full items-stretch justify-center gap-2 min-h-[350px] relative">
        
        {/* ALICE COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-pink-50/50 border border-pink-200 rounded-xl p-3 z-10 w-[30%]">
          <div className="font-bold text-pink-700 text-base mb-3 flex items-center gap-2">
            Alice
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Original Secret Message</span>
              <span className="font-mono text-lg font-semibold text-pink-600">M = {m}</span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Encrypt with Bob's Public Key</span>
              <span className="font-mono text-xs mb-1 text-gray-600">C = M<sup className="-mt-1 relative top-[-4px]">e</sup> mod n</span>
              <span className="font-mono text-sm font-semibold text-pink-700 border-t border-gray-100 pt-1 w-full text-center">
                C = {m}<sup className="text-[10px]">{eVal}</sup> mod {n}
              </span>
            </div>
            
            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-lg border-2 border-pink-400 font-bold font-mono text-sm shadow-inner mt-2">
                C = {c}
              </div>
            </div>
          </div>
        </div>

        {/* PUBLIC CHANNEL COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-gray-50 border-x border-gray-200 px-2 py-3 relative w-[40%]">
          <div className="font-bold text-gray-600 text-sm mb-3">
            Public Channel
          </div>
          
          {/* Bob's Public Key lying openly */}
          <div className={`transition-opacity duration-500 bg-white border border-blue-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[160px] ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[10px] uppercase font-bold text-blue-600 border-b border-gray-100 pb-1 mb-1 w-full text-center">Bob's Public Key</span>
            <span className="font-mono text-sm font-bold text-blue-800">e = {eVal}</span>
            <span className="font-mono text-sm font-bold text-blue-800">n = {n}</span>
          </div>

          {/* Flying Cipher Area */}
          <div className="flex-1 w-full flex flex-col justify-center relative min-h-[140px]">
            {/* Ciphertext C flying to Bob */}
            <div className={`absolute left-0 right-0 flex justify-center transition-all duration-700 ease-in-out ${step === 5 ? 'top-1/3 opacity-100' : step > 5 ? 'top-1/3 opacity-0 scale-90 translate-x-8' : 'top-0 opacity-0 -translate-x-8'}`}>
              <div className="bg-purple-100 border border-purple-300 text-purple-800 px-4 py-2 rounded-full shadow-md font-mono text-sm flex items-center gap-2 font-bold z-20">
                <ArrowRight size={14} className="text-gray-400" /> C = {c} <ArrowRight size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* BOB COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-blue-50/50 border border-blue-200 rounded-xl p-3 z-10 w-[30%]">
          <div className="font-bold text-blue-700 text-base mb-3 flex items-center gap-2">
            Bob
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Secret Primes</span>
              <span className="font-mono text-sm font-semibold text-blue-600">p={p}, q={q}</span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Calculate Modulus & Totient</span>
              <span className="font-mono text-xs text-blue-700 w-full text-center">n = p·q = {n}</span>
              <span className="font-mono text-xs text-blue-700 w-full text-center">φ(n) = (p-1)(q-1) = {phi}</span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-red-200 flex flex-col items-center ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-red-700 mb-0.5">Private Key (Secret!)</span>
              <span className="font-mono text-[10px] text-gray-600 w-full text-center leading-tight">d = e⁻¹ mod φ(n)</span>
              <span className="font-mono text-[10px] text-gray-600 border-b border-gray-100 w-full text-center pb-0.5 mb-0.5 leading-tight">({eVal} × d) mod {phi} = 1</span>
              <span className="font-mono text-sm font-bold text-red-600">d = {d}</span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-green-200 flex flex-col items-center mt-2 ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[9px] uppercase font-bold text-green-700 mb-0.5">Decrypt Message</span>
              <span className="font-mono text-xs mb-0.5 text-gray-600">M' = C<sup className="-mt-1 relative top-[-2px]">d</sup> mod n</span>
              <span className="font-mono text-xs font-semibold text-green-700 border-t border-gray-100 pt-0.5 w-full text-center">
                M' = {c}<sup className="text-[9px]">{d}</sup> mod {n}
              </span>
            </div>
            
            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 6 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg border-2 border-green-400 font-bold font-mono text-sm shadow-inner mt-1">
                Recovered: {mPrime}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-4 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}
