import React, { useState, useEffect } from "react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";
import { Play, Pause, RotateCcw } from "lucide-react";

export function TranspositionCipherAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [word, setWord] = useState("CRYPTOGRAPHY");
  const [key, setKey] = useState([2, 1, 3]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Parse inputs
  const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase().slice(0, 16) || "a";
  
  const finalKey = key;
  const K = finalKey.length;
  const R = Math.ceil(cleanWord.length / K);

  const maxSteps = 2 * K + 6;

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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;

    const newKey = [...key];
    const [draggedItem] = newKey.splice(draggedIdx, 1);
    newKey.splice(targetIndex, 0, draggedItem);
    
    setKey(newKey);
    setDraggedIdx(null);
    setStep(0);
  };

  // Precompute grid and ciphertext chunks
  const grid = Array(R).fill(null).map(() => Array(K).fill(""));
  let idx = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < K; c++) {
      if (idx < cleanWord.length) {
        grid[r][c] = cleanWord[idx++];
      }
    }
  }

  const cipherChunks: string[] = [];
  for (let i = 0; i < K; i++) {
    const colIndex = finalKey[i] - 1;
    let chunk = "";
    for (let r = 0; r < R; r++) {
      if (grid[r][colIndex] !== "") {
        chunk += grid[r][colIndex];
      }
    }
    cipherChunks.push(chunk);
  }
  const cipherText = cipherChunks.join("");

  // Determine current phase
  const isEnc = step <= K + 2;
  const currPhase = isEnc ? "ENC" : "DEC";
  
  // Enc Active Logic
  const activeEncColPhase = step >= 2 && step <= K + 1 ? step - 2 : -1;
  const activeEncColIdx = activeEncColPhase >= 0 ? finalKey[activeEncColPhase] - 1 : -1;
  const encBuiltParts = isEnc && step >= 2 ? cipherChunks.slice(0, Math.max(0, step - 1)) : [];
  if (isEnc && step > K + 2) encBuiltParts.push(...cipherChunks);

  // Dec Active Logic
  const activeDecColPhase = step >= K + 4 && step <= 2 * K + 3 ? step - (K + 4) : -1;
  const activeDecColIdx = activeDecColPhase >= 0 ? finalKey[activeDecColPhase] - 1 : -1;
  
  const getDescription = () => {
    if (isEnc) {
      if (step === 0) return "Encryption phase. We start with the valid plaintext.";
      if (step === 1) return "Write the plaintext into the grid row by row.";
      if (step >= 2 && step <= K + 1) {
        return `Reading Out Column ${finalKey[activeEncColPhase]} to form ciphertext.`;
      }
      if (step === K + 2) return "Encryption complete.";
    } else {
      if (step === K + 3) return "Decryption phase. We received the ciphertext block.";
      if (step >= K + 4 && step <= 2 * K + 3) {
        return `Writing Into Column ${finalKey[activeDecColPhase]} using the received characters.`;
      }
      if (step === 2 * K + 4) return "Read the grid row by row to reconstruct the original plaintext.";
      if (step === 2 * K + 5) return "Decryption complete!";
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
      {/* Settings Row */}
      <div className="flex w-full items-center gap-6 mb-4 justify-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Word:</label>
          <input
            type="text"
            maxLength={16}
            value={word.toUpperCase()}
            onChange={(e) => {
              setWord(e.target.value);
              setStep(0);
            }}
            className="border rounded px-2 py-1 text-gray-800 w-36 uppercase font-mono shadow-inner outline-none focus:border-blue-400 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Cols:</label>
          <input
            type="number"
            min={2}
            max={5}
            value={key.length}
            onChange={(e) => {
              const len = parseInt(e.target.value) || 3;
              const newLen = Math.max(2, Math.min(5, len));
              if (newLen !== key.length) {
                setKey(Array.from({length: newLen}, (_, i) => i + 1));
                setStep(0);
              }
            }}
            className="border rounded px-2 py-1 text-gray-800 w-16 shadow-inner outline-none focus:border-blue-400 text-xs"
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs font-semibold text-gray-700 mr-1">Order:</label>
          <div className="flex gap-1">
            {key.map((num, idx) => (
              <div
                key={`${num}-${idx}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className={`w-6 h-6 flex items-center justify-center rounded border shadow-sm cursor-grab active:cursor-grabbing font-mono text-xs font-bold transition-colors ${draggedIdx === idx ? 'opacity-50 bg-gray-100' : 'bg-white hover:bg-gray-50 text-blue-600 border-gray-300'}`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="h-8 flex items-center justify-center mb-2 text-center text-sm">
        <h3 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {getDescription()}
        </h3>
      </div>

      {/* Main visualization container */}
      <div className="flex flex-col items-center min-h-[280px] gap-4 w-full">
        {/* Source Array */}
        <div className="flex items-center gap-2 h-10">
          <span className="font-bold text-gray-600 w-20 text-right text-xs">
            {isEnc ? "Plaintext:" : "Ciphertext:"}
          </span>
          <div className="flex gap-1 flex-wrap justify-start font-mono text-base font-semibold uppercase">
            {isEnc ? (
              cleanWord.split("").map((ch, i) => (
                <span key={i} className={`w-7 h-8 flex items-center justify-center rounded transition-colors duration-300 ${step === 1 ? "bg-green-100 text-green-800 border bg-green-200" : "bg-gray-100 text-gray-800 border"}`}>
                  {ch}
                </span>
              ))
            ) : (
              cipherChunks.map((chunk, i) => {
                const isTargetChunkForDec = activeDecColPhase === i;
                const isAlreadyUsed = i < activeDecColPhase;
                return (
                  <span key={i} className={`px-1.5 h-8 flex items-center justify-center rounded transition-colors duration-300 ${isTargetChunkForDec ? "bg-blue-600 text-white shadow" : isAlreadyUsed ? "bg-gray-100 text-gray-400" : "bg-purple-100 text-purple-800 border"}`}>
                    {chunk}
                  </span>
                )
              })
            )}
          </div>
        </div>

        {/* The Grid */}
        <div className="relative p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-inner min-w-[260px] flex flex-col items-center">
          <div className="absolute top-1 left-2 text-[10px] font-bold text-gray-400">THE GRID</div>
          
          <div className="grid gap-1.5 mt-2" style={{ gridTemplateColumns: `repeat(${K}, minmax(32px, 1fr))` }}>
            {/* Headers */}
            {Array.from({ length: K }).map((_, c) => {
              const isTargetEncCol = c === activeEncColIdx;
              const isTargetDecCol = c === activeDecColIdx;
              const isActive = isTargetEncCol || isTargetDecCol;
              return (
                <div key={`header-${c}`} className={`text-center font-black pb-1 border-b-2 transition-colors duration-300 text-xs ${isActive ? "text-blue-600 border-blue-600" : "text-gray-400 border-gray-300"}`}>
                  Col {c + 1}
                </div>
              );
            })}
            
            {/* Cells */}
            {grid.flatMap((row, r) =>
              row.map((char, c) => {
                const keyIndexOfCol = finalKey.indexOf(c + 1);
                const isTargetEncCol = c === activeEncColIdx;
                const isTargetDecCol = c === activeDecColIdx;
                const isActive = isTargetEncCol || isTargetDecCol;
                
                const isEncFilled = isEnc && step >= 1 && step <= K + 2;
                const isDecFilled = !isEnc && (step >= 2 * K + 4 || (step >= K + 4 && keyIndexOfCol <= activeDecColPhase));
                
                const showCellText = isEncFilled || isDecFilled;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-9 h-9 flex items-center justify-center font-bold text-lg rounded shadow-sm transition-all duration-500 uppercase ${
                      isActive ? "bg-blue-500 text-white scale-110 ring-2 ring-blue-200 shadow-md z-10" :
                      showCellText ? "bg-white text-gray-800 border border-gray-300" : 
                      "bg-gray-200 text-transparent border border-dashed border-gray-300"
                    }`}
                  >
                    {char}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Target Array */}
        <div className="flex items-center gap-2 h-10">
          <span className="font-bold text-gray-600 w-20 text-right text-xs">
            {isEnc ? "Ciphertext:" : "Plaintext:"}
          </span>
          <div className="flex gap-1 flex-wrap justify-start font-mono text-base font-semibold uppercase">
            {isEnc ? (
              // Encryption Output
              encBuiltParts.map((chunk, i) => {
                const isJustAdded = step >= 2 && i === step - 2;
                return (
                  <span key={i} className={`px-1.5 h-8 flex items-center justify-center rounded transition-colors duration-500 ${isJustAdded ? "bg-blue-600 text-white shadow scale-105" : "bg-purple-100 text-purple-900 border"}`}>
                    {chunk}
                  </span>
                )
              })
            ) : (
              // Decryption Output
              step >= 2 * K + 4 && cleanWord.split("").map((ch, i) => (
                <span key={i} className="w-7 h-8 flex items-center justify-center rounded bg-green-100 text-green-800 border border-green-300">
                  {ch}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="mt-2 flex flex-col items-center gap-3 w-full">
        {/* Progress Tiles */}
        <div className="w-full flex gap-1 px-4">
          {[...Array(maxSteps)].map((_, s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                step === s
                  ? "bg-green-600 shadow-sm"
                  : s > K + 2
                  ? "bg-purple-200 hover:bg-purple-300"
                  : "bg-green-200 hover:bg-green-300"
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

