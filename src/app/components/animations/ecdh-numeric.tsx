import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";

import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

// Helper for positive modulo
function mod(n: number, p: number) {
  return ((n % p) + p) % p;
}

// Modular inverse using Extended Euclidean Algorithm
function modInverse(a: number, m: number): number {
  let m0 = m, y = 0, x = 1;
  if (m === 1) return 0;
  let currA = mod(a, m);
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

type Point = { x: number, y: number } | null;

// Elliptic curve point addition: y^2 = x^3 + ax + b over Fp
function addPoints(P: Point, Q: Point, a: number, p: number): Point {
  if (!P) return Q;
  if (!Q) return P;
  if (P.x === Q.x && P.y === mod(-Q.y, p)) return null; // Point at infinity

  let lambda: number;
  if (P.x === Q.x && P.y === Q.y) {
    // Point doubling
    lambda = mod((3 * P.x * P.x + a) * modInverse(2 * P.y, p), p);
  } else {
    // Point addition
    lambda = mod((Q.y - P.y) * modInverse(Q.x - P.x, p), p);
  }

  const xR = mod(lambda * lambda - P.x - Q.x, p);
  const yR = mod(lambda * (P.x - xR) - P.y, p);
  return { x: xR, y: yR };
}

// Elliptic curve scalar multiplication using double and add
function multiplyPoint(k: number, P: Point, a: number, p: number): Point {
  let R: Point = null;
  let Q: Point = P;
  let currK = k;
  while (currK > 0) {
    if (currK % 2 === 1) R = addPoints(R, Q, a, p);
    Q = addPoints(Q, Q, a, p);
    currK = Math.floor(currK / 2);
  }
  return R;
}

const formatPoint = (pt: Point) => pt ? `(${pt.x}, ${pt.y})` : "∞";

export function ECDHNumericAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Example parameters over a small finite field
  const p = 97;
  const aParam = 2;
  const bParam = 5;
  const G: Point = { x: 51, y: 16 }; 

  const d_A = 25; // Alice's private key
  const d_B = 14; // Bob's private key

  const Q_A = multiplyPoint(d_A, G, aParam, p);
  const Q_B = multiplyPoint(d_B, G, aParam, p);
  const S_a = multiplyPoint(d_A, Q_B, aParam, p);
  const S_b = multiplyPoint(d_B, Q_A, aParam, p);

  const maxSteps = 6;

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
      setIsPaused((prev) => !prev);
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
      case 0: return "Public Parameters: You and your friend agree on a Curve and Generator point G.";
      case 1: return "Private Keys: Both of you pick random private scalars (numbers) ";
      case 2: return "Public Keys: Each of you multiply point G by your private scalars (Q = d × G).";
      case 3: return "Key Exchange: Public points are sent over the public channel.";
      case 4: return "Shared Secret: Each  of you multiply the received point by your own private scalar.";
      case 5: return "The underlying math guarantees that both of you compute the identical shared point S. (Usually x-coord is used).";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Top Controls Row */}
      <div className="flex flex-wrap w-full items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 m-0">ECDH Example</h3>
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
      <div className="h-8 flex items-center justify-center mb-4 px-2">
        <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-center">
          {getDescription()}
        </h3>
      </div>

      {/* Animation Grid */}
      <div className="flex w-full items-stretch justify-center gap-2 min-h-[310px] relative">
        
        {/* ALICE COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-pink-50/50 border border-pink-200 rounded-xl p-3 z-10 w-1/3">
          <div className="font-bold text-pink-700 text-base mb-3 flex items-center gap-2">
            You
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Private Scalar</span>
              <span className="font-mono text-lg font-semibold text-pink-600">d<sub className="text-xs">A</sub> = {d_A}</span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-pink-100 flex flex-col items-center ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Compute Public Key Q<sub className="text-[8px]">A</sub></span>
              <span className="font-mono text-sm mb-1 text-gray-600">Q<sub className="text-[10px]">A</sub> = d<sub className="text-[10px]">A</sub> × G</span>
              <span className="font-mono text-sm font-semibold text-pink-700 border-t border-gray-100 pt-1 w-full text-center">
                Q<sub className="text-[10px]">A</sub> = {d_A} × {formatPoint(G)}
              </span>
              <span className="font-mono text-sm font-bold text-pink-700 mt-1">
                 = {formatPoint(Q_A)}
              </span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border-2 border-green-200 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-green-700 mb-1">Compute Shared Secret</span>
              <span className="font-mono text-sm mb-1 text-gray-600">S = d<sub className="text-[10px]">A</sub> × Q<sub className="text-[10px]">B</sub></span>
              <span className="font-mono text-sm font-semibold text-green-700 border-t border-gray-100 pt-1 w-full text-center">
                S = {d_A} × {formatPoint(Q_B)}
              </span>
            </div>
            
            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg border-2 border-green-400 font-bold font-mono text-base shadow-inner">
                S = {formatPoint(S_a)}
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
          <div className={`transition-opacity duration-500 bg-white border border-gray-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[180px] ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100 pb-1 mb-1 w-full text-center">Global Parameters</span>
            <span className="font-mono text-[11px] font-semibold text-gray-800 whitespace-nowrap">E: y² = x³+{aParam}x+{bParam} (mod {p})</span>
            <span className="font-mono text-[11px] font-semibold text-gray-800 mt-1">G = {formatPoint(G)}</span>
          </div>

          {/* Flying Keys Area */}
          <div className="flex-1 w-full flex flex-col justify-center relative min-h-[120px]">
            {/* Alice's Key Q_A flying to Bob */}
            <div className={`absolute left-0 right-0 flex justify-center transition-all duration-700 ease-in-out ${step === 3 ? 'top-1/4 opacity-100' : step > 3 ? 'top-1/4 opacity-0 scale-90' : 'top-0 opacity-0'}`}>
              <div className="bg-pink-100 border border-pink-300 text-pink-800 px-3 py-1 rounded-full shadow font-mono text-xs flex items-center gap-2 font-bold z-20 whitespace-nowrap">
                Q<sub className="-ml-1">A</sub> = {formatPoint(Q_A)} <ArrowRight size={14} />
              </div>
            </div>
            
            {/* Bob's Key Q_B flying to Alice */}
            <div className={`absolute left-0 right-0 flex justify-center transition-all duration-700 ease-in-out delay-150 ${step === 3 ? 'bottom-1/4 opacity-100' : step > 3 ? 'bottom-1/4 opacity-0 scale-90' : 'bottom-0 opacity-0'}`}>
              <div className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-1 rounded-full shadow font-mono text-xs flex items-center gap-2 font-bold z-20 whitespace-nowrap">
                <ArrowLeft size={14} /> Q<sub className="-ml-1">B</sub> = {formatPoint(Q_B)}
              </div>
            </div>
          </div>
          
          <div className={`mt-auto transition-opacity duration-500 ${step >= 5 ? 'opacity-100' : 'opacity-0'}`}>
             <div className="text-xs text-center text-gray-500 px-2 leading-tight">You and your friend now share S<br/>(The x-coordinate is used as key)</div>
          </div>
        </div>

        {/* BOB COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-blue-50/50 border border-blue-200 rounded-xl p-3 z-10 w-1/3">
          <div className="font-bold text-blue-700 text-base mb-3 flex items-center gap-2">
            Your friend
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Private Scalar</span>
              <span className="font-mono text-lg font-semibold text-blue-600">d<sub className="text-xs">B</sub> = {d_B}</span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border border-blue-100 flex flex-col items-center ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Compute Public Key Q<sub className="text-[8px]">B</sub></span>
              <span className="font-mono text-sm mb-1 text-gray-600">Q<sub className="text-[10px]">B</sub> = d<sub className="text-[10px]">B</sub> × G</span>
              <span className="font-mono text-sm font-semibold text-blue-700 border-t border-gray-100 pt-1 w-full text-center">
                Q<sub className="text-[10px]">B</sub> = {d_B} × {formatPoint(G)}
              </span>
              <span className="font-mono text-sm font-bold text-blue-700 mt-1">
                 = {formatPoint(Q_B)}
              </span>
            </div>

            <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm border-2 border-green-200 flex flex-col items-center ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="text-[10px] uppercase font-bold text-green-700 mb-1">Compute Shared Secret</span>
              <span className="font-mono text-sm mb-1 text-gray-600">S = d<sub className="text-[10px]">B</sub> × Q<sub className="text-[10px]">A</sub></span>
              <span className="font-mono text-sm font-semibold text-green-700 border-t border-gray-100 pt-1 w-full text-center">
                S = {d_B} × {formatPoint(Q_A)}
              </span>
            </div>

            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg border-2 border-green-400 font-bold font-mono text-base shadow-inner">
                S = {formatPoint(S_b)}
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