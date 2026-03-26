import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowDown } from "lucide-react";

import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function CaesarCipherAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [word, setWord] = useState("SECRET");
  const [keyStr, setKeyStr] = useState("11");
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase().slice(0, 10);
  const safeWord = cleanWord || "a";
  const key = parseInt(keyStr) || 0;
  const N = safeWord.length;

  const maxSteps = 6 + 2 * N;

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

  const plainChars = safeWord.split("");
  const plainInts = plainChars.map((c) => c.charCodeAt(0) - 97);
  const finalKey = ((key % 26) + 26) % 26;
  const encInts = plainInts.map((i) => (i + finalKey) % 26);
  const encChars = encInts.map((i) => String.fromCharCode(i + 97));

  const isDecryption = step >= 3 + N;
  const currStep = isDecryption ? step - (3 + N) : step;

  const sourceChars = isDecryption ? encChars : plainChars;
  const sourceInts = isDecryption ? encInts : plainInts;
  const targetInts = isDecryption ? plainInts : encInts;
  const targetChars = isDecryption ? plainChars : encChars;

  const activeOpIndex = currStep >= 2 && currStep < 2 + N ? currStep - 2 : -1;

  const getDescription = () => {
    if (isDecryption) {
      if (currStep === 0) return "Decryption phase. We received the ciphertext.";
      if (currStep === 1) return "Mapping the ciphertext to integers (A=0, B=1... Z=25).";
      if (currStep >= 2 && currStep < 2 + N) {
        const idx = currStep - 2;
        const s = sourceInts[idx];
        const diff = s - finalKey;
        const mod = `${diff} mod 26 = ${targetInts[idx]}`;
        return (
          <span className="font-mono">
            Decrypting '{sourceChars[idx].toUpperCase()}': {s} - {finalKey} (Key) = {diff} → {mod}
          </span>
        );
      }
      if (currStep === 2 + N) return "Converting the numeric results back to alphabet letters.";
    } else {
      if (currStep === 0) return "Encryption phase. Starting with the plaintext.";
      if (currStep === 1) return "Mapping the plaintext to integers (A=0, B=1... Z=25).";
      if (currStep >= 2 && currStep < 2 + N) {
        const idx = currStep - 2;
        const s = sourceInts[idx];
        const sum = s + finalKey;
        return (
          <span className="font-mono">
            Encrypting '{sourceChars[idx].toUpperCase()}': {s} + {finalKey} (Key) = {sum} → {sum} mod 26 = {targetInts[idx]}
          </span>
        );
      }
      if (currStep === 2 + N) return "Converting the computed integers to encrypted alphabet letters.";
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
      {/* Settings Row */}
      <div className="flex w-full items-center gap-6 mb-4 justify-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Word (max 7 chars):</label>
          <input
            type="text"
            maxLength={7}
            value={word.toUpperCase()}
            onChange={(e) => {
              setWord(e.target.value);
              setStep(0);
            }}
            className="border rounded px-2 py-1 text-gray-800 w-36 uppercase font-mono shadow-inner outline-none focus:border-blue-400 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Key:</label>
          <input
            type="number"
            value={keyStr}
            onChange={(e) => {
              setKeyStr(e.target.value);
              setStep(0);
            }}
            className="border rounded px-2 py-1 text-gray-800 w-20 font-mono shadow-inner outline-none focus:border-blue-400 text-xs"
          />
        </div>
      </div>

      {/* Header Info */}
      <div className="h-8 flex items-center justify-center mb-2">
        <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-center">
          {getDescription()}
        </h3>
      </div>

      {/* Cipher Grid */}
      <div className="flex items-start justify-center gap-2 min-h-[220px]">
        {plainChars.map((_, idx) => {
          const showSourceInt = currStep >= 1;
          const showTargetInt = currStep >= 2 + N || (Math.max(0, currStep - 2) >= idx && currStep>1);
          const showTargetChar = currStep >= 2 + N;
          const isActive = activeOpIndex === idx;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? "ring-2 ring-blue-500 rounded-lg p-1 bg-blue-50/50 scale-105" : "p-1"
              }`}
            >
              {/* Source Char row */}
              <div className="w-10 h-10 flex items-center justify-center font-bold text-xl bg-gray-50 border-2 border-gray-300 rounded shadow-sm text-gray-800 uppercase">
                {sourceChars[idx]}
              </div>

              {/* Source Int row */}
              <div className={`transition-opacity duration-500 flex flex-col items-center ${showSourceInt ? "opacity-100" : "opacity-0"}`}>
                <ArrowDown size={14} className="text-gray-400 mb-0.5" />
                <div className="w-8 h-8 flex items-center justify-center font-mono text-base font-semibold text-blue-800 bg-blue-100 border-2 border-blue-200 rounded-full shadow-inner">
                  {sourceInts[idx]}
                </div>
              </div>

              {/* Op indicator row */}
              <div className={`transition-opacity duration-300 h-6 flex items-center justify-center font-black text-gray-500 text-xs ${isActive ? "opacity-100 text-blue-600 scale-125" : showTargetInt ? "opacity-40" : "opacity-0"}`}>
                {isDecryption ? `-${finalKey}` : `+${finalKey}`}
              </div>

              {/* Target Int row */}
              <div className={`transition-opacity duration-500 flex flex-col items-center ${showTargetInt ? "opacity-100" : "opacity-0"}`}>
                <div className="w-8 h-8 flex items-center justify-center font-mono text-base font-semibold text-green-800 bg-green-100 border-2 border-green-200 rounded-full shadow-inner">
                  {targetInts[idx]}
                </div>
                <ArrowDown size={14} className="text-gray-400 mt-0.5" />
              </div>

              {/* Target Char row */}
              <div className={`transition-opacity duration-500 ${showTargetChar ? "opacity-100" : "opacity-0"}`}>
                <div className="w-10 h-10 flex items-center justify-center font-bold text-xl bg-gray-800 border-2 border-gray-900 rounded shadow-md text-white uppercase">
                  {targetChars[idx]}
                </div>
              </div>
            </div>
          );
        })}
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
                  : isDecryption && s >= 3 + N 
                  ? "bg-purple-200 hover:bg-purple-300"
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
