import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

// Helper for positive modulo
function mod(n: number, p: number) {
  return ((n % p) + p) % p;
}

// Modular inverse using Extended Euclidean Algorithm
function modInverse(a: number, m: number): number {
  let aa = mod(a, m);
  if (aa === 0) return 0;
  let [old_r, r] = [aa, m];
  let [old_s, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return old_r === 1 ? mod(old_s, m) : 0;
}

type Point = { x: number; y: number } | null;

// Elliptic curve point addition: y^2 = x^3 + ax + b over Fp
function ecAdd(P: Point, Q: Point, a: number, p: number): Point {
  if (!P) return Q;
  if (!Q) return P;
  if (P.x === Q.x && P.y === mod(-Q.y, p)) return null;

  let lambda: number;
  if (P.x === Q.x && P.y === Q.y) {
    const denom = modInverse(mod(2 * P.y, p), p);
    if (denom === 0) return null;
    lambda = mod(mod(3 * P.x * P.x + a, p) * denom, p);
  } else {
    const denom = modInverse(mod(Q.x - P.x, p), p);
    if (denom === 0) return null;
    lambda = mod(mod(Q.y - P.y, p) * denom, p);
  }

  const xR = mod(lambda * lambda - P.x - Q.x, p);
  const yR = mod(lambda * (P.x - xR) - P.y, p);
  return { x: xR, y: yR };
}

// Scalar multiplication via double-and-add
function ecMul(k: number, P: Point, a: number, p: number): Point {
  let R: Point = null;
  let Q: Point = P;
  let ck = k;
  while (ck > 0) {
    if (ck & 1) R = ecAdd(R, Q, a, p);
    Q = ecAdd(Q, Q, a, p);
    ck >>= 1;
  }
  return R;
}

const formatPoint = (pt: Point) => (pt ? `(${pt.x}, ${pt.y})` : "∞");

export function ECDSANumericAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const fieldP = 131;
  const curveA = 3;
  const curveB = 6;
  const G: Point = { x: 9, y: 32 };
  const n = 19; // order of G

  // Key generation
  const d = 12; // private key
  const Q = ecMul(d, G, curveA, fieldP); // public key Q = d·G

  // ECDSA Signing
  const eHash = 74; // hash of the message
  const k = 3; // per-message secret (1 ≤ k ≤ n-1)
  const kG = ecMul(k, G, curveA, fieldP); // k·G
  const r = kG ? kG.x % n : 0;
  const kInv = modInverse(k, n);
  const s = mod(kInv * (eHash + d * r), n);

  // ECDSA Verification
  const w = modInverse(s, n);
  const u1 = mod(eHash * w, n);
  const u2 = mod(r * w, n);
  const P1 = ecMul(u1, G, curveA, fieldP);
  const P2 = ecMul(u2, Q, curveA, fieldP);
  const Rv = ecAdd(P1, P2, curveA, fieldP);
  const v = Rv ? Rv.x % n : -1;

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
      case 0: return "1. Domain Parameters: An elliptic curve E, field prime p, base point G, and its order n.";
      case 1: return "2. Key Generation: You pick private key d and compute public key Q = d × G on the curve.";
      case 2: return "3. Hash: Hash the message to get a fixed-size integer e = H('ECDSA sign this').";
      case 3: return "4. Per-message Secret: Choose random k (1 ≤ k < n). Must be unique per signature!";
      case 4: return "5. Compute r: Multiply k × G on the curve and take r = x₁ mod n.";
      case 5: return "6. Compute s: s = k⁻¹(e + d·r) mod n. The signature is (r, s).";
      case 6: return "7. Send: The message m='ECDSA sign this' and signature (r, s) are sent over the public channel.";
      case 7: return "8. Verification: Compute w, u₁, u₂, then check if x-coord of u₁G + u₂Q equals r.";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Top Controls Row */}
      <div className="flex flex-wrap w-full items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 m-0">ECDSA Example</h3>
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
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-red-200 flex flex-col items-center ${step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-red-700">Private Key (Secret!)</span>
              <span className="font-mono text-sm font-bold text-red-600">d = {d}</span>
            </div>

            {/* Hash */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Hash the Message</span>
              <span className="font-mono text-[10px] text-gray-600">e = H('ECDSA sign this')</span>
              <span className="font-mono text-sm font-semibold text-pink-700">e = {eHash}</span>
            </div>

            {/* Random k */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-orange-200 flex flex-col items-center ${step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-orange-700">Per-message Secret</span>
              <span className="font-mono text-sm font-bold text-orange-600">k = {k}</span>
              <span className="text-[8px] text-orange-500 italic">Must never be reused!</span>
            </div>

            {/* Compute r */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-purple-200 flex flex-col items-center ${step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-purple-700">Compute r</span>
              <span className="font-mono text-[10px] text-gray-600">k·G = {formatPoint(kG)}</span>
              <span className="font-mono text-[10px] text-gray-600">r = x₁ mod n</span>
              <span className="font-mono text-sm font-bold text-purple-700">r = {r}</span>
            </div>

            {/* Compute s */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-purple-200 flex flex-col items-center ${step >= 5 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-purple-700">Compute s</span>
              <span className="font-mono text-[10px] text-gray-600">s = k⁻¹(e + d·r) mod n</span>
              <span className="font-mono text-[10px] text-gray-600">
                s = {kInv}·({eHash} + {d}·{r}) mod {n}
              </span>
              <span className="font-mono text-sm font-bold text-purple-700">s = {s}</span>
            </div>

            {/* Signature result */}
            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 5 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg border-2 border-purple-400 font-bold font-mono text-sm shadow-inner">
                σ = ({r}, {s})
              </div>
            </div>
          </div>
        </div>

        {/* PUBLIC CHANNEL COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-gray-50 border-x border-gray-200 px-2 py-3 relative w-[40%]">
          <div className="font-bold text-gray-600 text-sm mb-3">Public Channel</div>

          {/* Curve Parameters */}
          <div className={`transition-opacity duration-500 bg-white border border-gray-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[180px] ${step >= 0 ? "opacity-100" : "opacity-0"}`}>
            <span className="text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100 pb-1 mb-1 w-full text-center">
              Domain Parameters
            </span>
            <span className="font-mono text-[11px] font-semibold text-gray-800 whitespace-nowrap">
              E: y²=x³+{curveA}x+{curveB} (mod {fieldP})
            </span>
            <span className="font-mono text-[11px] font-semibold text-gray-800 mt-0.5">G = {formatPoint(G)}</span>
            <span className="font-mono text-[11px] font-semibold text-gray-800">n = {n}</span>
          </div>

          {/* Public Key */}
          <div className={`transition-opacity duration-500 bg-white border border-blue-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[180px] mt-2 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
            <span className="text-[10px] uppercase font-bold text-blue-600 border-b border-gray-100 pb-1 mb-1 w-full text-center">
              Your Public Key
            </span>
            <span className="font-mono text-[10px] text-gray-600">Q = d × G</span>
            <span className="font-mono text-sm font-bold text-blue-800">Q = {formatPoint(Q)}</span>
          </div>

          {/* Flying signature */}
          <div className="flex-1 w-full flex flex-col justify-center relative min-h-[100px]">
            <div className={`absolute left-0 right-0 flex justify-center transition-all duration-700 ease-in-out ${step === 6 ? "top-1/3 opacity-100" : step > 6 ? "top-1/3 opacity-0 scale-90 translate-x-8" : "top-0 opacity-0 -translate-x-8"}`}>
              <div className="flex flex-col shadow-lg rounded-xl overflow-hidden border border-gray-200 z-20">
                <div className="bg-green-100 text-green-800 px-3 py-1 font-mono text-[10px] font-semibold text-center border-b border-blue-100">
                  m='ECDSA sign this'
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
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 7 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Msg & Signature</span>
              <span className="font-mono text-xs font-semibold text-gray-700">m = 'ECDSA sign this'</span>
              <span className="font-mono text-[10px] font-semibold text-blue-600">σ = ({r}, {s})</span>
            </div>

            {/* Re-hash */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 7 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Re-hash Message</span>
              <span className="font-mono text-[10px] text-gray-600">e = H('ECDSA sign this')</span>
              <span className="font-mono text-sm font-semibold text-blue-700">e = {eHash}</span>
            </div>

            {/* Compute w, u1, u2 */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 7 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Intermediate Values</span>
              <span className="font-mono text-[10px] text-gray-600">w = s⁻¹ mod n = {w}</span>
              <span className="font-mono text-[10px] text-gray-600">u₁ = e·w mod n = {u1}</span>
              <span className="font-mono text-[10px] text-gray-600">u₂ = r·w mod n = {u2}</span>
            </div>

            {/* Compute verification point */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 7 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-gray-500">Verification Point</span>
              <span className="font-mono text-[10px] text-gray-600">R' = u₁·G + u₂·Q</span>
              <span className="font-mono text-[10px] text-gray-600">
                = {formatPoint(P1)} + {formatPoint(P2)}
              </span>
              <span className="font-mono text-sm font-bold text-blue-700">R' = {formatPoint(Rv)}</span>
            </div>

            {/* Check r === v */}
            <div className={`transition-all duration-500 w-full bg-white p-1.5 rounded shadow-sm border-2 border-green-200 flex flex-col items-center ${step >= 7 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              <span className="text-[9px] uppercase font-bold text-green-700">Check</span>
              <span className="font-mono text-[10px] text-gray-600">v = x₁ mod n = {v}</span>
            </div>

            {/* Result */}
            <div className={`transition-all duration-500 w-full flex flex-col items-center gap-1 ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
              <div className={`text-xs font-bold mt-1 px-3 py-1 rounded-lg border-2 shadow-inner ${v === r ? "bg-emerald-100 border-emerald-400 text-emerald-800" : "bg-red-100 border-red-400 text-red-800"}`}>
                {v === r
                  ? `✓ v = r = ${r} → Signature VALID`
                  : `✗ v ≠ r → Signature INVALID`}
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
        <span>
          Step {step + 1} / {maxSteps}
        </span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}
