import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

const SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

const INVSBOX = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];

const INIT_STATE = [
  [0x19, 0x3d, 0xe3, 0xbe],
  [0xa0, 0xf4, 0xe2, 0x2b],
  [0x9a, 0xc6, 0x8d, 0x2a],
  [0xe9, 0xf8, 0x48, 0x08],
];

const ROUND_KEY = [
  [0xa0, 0xfa, 0xfe, 0x17],
  [0x88, 0x54, 0x2c, 0xb1],
  [0x23, 0xa3, 0x39, 0x39],
  [0x2a, 0x6c, 0x76, 0x05],
];

const gfMul = (a: number, b: number) => {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if ((b & 1) !== 0) p ^= a;
    let hiBitSet = (a & 0x80) !== 0;
    a <<= 1;
    if (hiBitSet) a ^= 0x11b; 
    b >>= 1;
  }
  return p & 0xff;
};

const hex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();

const toPoly = (n: number) => {
  if (n === 0) return '0';
  const terms: string[] = [];
  for (let i = 7; i >= 0; i--) {
    if ((n & (1 << i)) !== 0) {
      if (i === 0) terms.push("1");
      else if (i === 1) terms.push("x");
      else terms.push(`x^${i}`);
    }
  }
  return terms.join("+");
};

const toBin = (n: number) => {
  const b = n.toString(2).padStart(8, '0');
  return `${b.slice(0, 4)} ${b.slice(4)}`;
};

export function AESRoundAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [step, setStep] = useState(0); 
  const [subStep, setSubStep] = useState(0); 
  const [isPaused, setIsPaused] = useState(true);

  const maxSteps = 8;
  const getMaxSubSteps = (s: number) => {
    if (s === 0 || s === 3 || s === 4 || s === 7) return 16;
    if (s === 1 || s === 2 || s === 5 || s === 6) return 4;
    return 0;
  };

  useEffect(() => {
    if (isPaused) return;
    
    const maxSub = getMaxSubSteps(step);
    const timer = setTimeout(() => {
      if (subStep < maxSub) {
        setSubStep((s) => s + 1);
      } else {
        setStep((s) => (s + 1) % maxSteps);
        setSubStep(0);
      }
    }, 700 / (speed || 1));
    return () => clearTimeout(timer);
  }, [isPaused, speed, step, subStep, maxSteps]);

  useEffect(() => {
    const handleNext = (e: Event) => {
      const maxSub = getMaxSubSteps(step);
      if (subStep < maxSub) {
        e.preventDefault();
        setSubStep((s) => s + 1);
      } else if (step < maxSteps - 1) {
        e.preventDefault();
        setSubStep(0);
        setStep((prev) => prev + 1);
      }
    };

    const handlePrev = (e: Event) => {
      if (subStep > 0) {
        e.preventDefault();
        setSubStep((s) => s - 1);
      } else if (step > 0) {
        e.preventDefault();
        setStep((prev) => prev - 1);
        setSubStep(getMaxSubSteps(step - 1));
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
  }, [maxSteps, step, subStep]);

  const stateInit = INIT_STATE;
  const stateSubBytes = stateInit.map(row => row.map(b => SBOX[b]));
  const stateShiftRows = [
    [...stateSubBytes[0]],
    [stateSubBytes[1][1], stateSubBytes[1][2], stateSubBytes[1][3], stateSubBytes[1][0]],
    [stateSubBytes[2][2], stateSubBytes[2][3], stateSubBytes[2][0], stateSubBytes[2][1]],
    [stateSubBytes[3][3], stateSubBytes[3][0], stateSubBytes[3][1], stateSubBytes[3][2]],
  ];
  
  const mixCol = (col: number[]) => [
    gfMul(0x02, col[0]) ^ gfMul(0x03, col[1]) ^ col[2] ^ col[3],
    col[0] ^ gfMul(0x02, col[1]) ^ gfMul(0x03, col[2]) ^ col[3],
    col[0] ^ col[1] ^ gfMul(0x02, col[2]) ^ gfMul(0x03, col[3]),
    gfMul(0x03, col[0]) ^ col[1] ^ col[2] ^ gfMul(0x02, col[3]),
  ];

  const stateMixColumns: number[][] = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  for (let c = 0; c < 4; c++) {
    const col = [stateShiftRows[0][c], stateShiftRows[1][c], stateShiftRows[2][c], stateShiftRows[3][c]];
    const mixed = mixCol(col);
    stateMixColumns[0][c] = mixed[0];
    stateMixColumns[1][c] = mixed[1];
    stateMixColumns[2][c] = mixed[2];
    stateMixColumns[3][c] = mixed[3];
  }

  const stateAddRoundKey = stateMixColumns.map((row, r) => 
    row.map((b, c) => b ^ ROUND_KEY[r][c])
  );

  const getCurrentState = () => {
    if (step === 0) { 
      return stateInit.map((row, r) => row.map((b, c) => {
        const idx = c * 4 + r; 
        return idx < subStep ? stateSubBytes[r][c] : stateInit[r][c];
      }));
    }
    if (step === 1) { 
      return stateSubBytes.map((row, r) => r < subStep ? stateShiftRows[r] : stateSubBytes[r]);
    }
    if (step === 2) { 
      if (subStep === 0) return stateShiftRows;
      const res = stateShiftRows.map(r => [...r]);
      for (let c = 0; c < subStep; c++) {
        res[0][c] = stateMixColumns[0][c];
        res[1][c] = stateMixColumns[1][c];
        res[2][c] = stateMixColumns[2][c];
        res[3][c] = stateMixColumns[3][c];
      }
      return res;
    }
    if (step === 3) { 
      return stateMixColumns.map((row, r) => row.map((b, c) => {
        const idx = c * 4 + r;
        return idx < subStep ? stateAddRoundKey[r][c] : stateMixColumns[r][c];
      }));
    }
    if (step === 4) { 
      return stateAddRoundKey.map((row, r) => row.map((b, c) => {
        const idx = c * 4 + r;
        return idx < subStep ? stateMixColumns[r][c] : stateAddRoundKey[r][c];
      }));
    }
    if (step === 5) { 
      if (subStep === 0) return stateMixColumns;
      const res = stateMixColumns.map(r => [...r]);
      for (let c = 0; c < subStep; c++) {
        res[0][c] = stateShiftRows[0][c];
        res[1][c] = stateShiftRows[1][c];
        res[2][c] = stateShiftRows[2][c];
        res[3][c] = stateShiftRows[3][c];
      }
      return res;
    }
    if (step === 6) { 
      return stateMixColumns.map((row, r) => r < subStep ? stateSubBytes[r] : stateShiftRows[r]);
    }
    if (step === 7) { 
      return stateSubBytes.map((row, r) => row.map((b, c) => {
        const idx = c * 4 + r;
        return idx < subStep ? stateInit[r][c] : stateSubBytes[r][c];
      }));
    }
    return stateInit;
  };

  const currentState = getCurrentState();

  const renderGrid = (matrix: number[][], highlightPredicate: (r: number, c: number) => boolean = () => false) => (
    <div className="grid grid-cols-4 gap-1 border-2 border-gray-700 p-1 bg-gray-50 rounded select-none">
      {matrix.map((row, r) => row.map((val, c) => (
        <div key={`cell-${r}-${c}`} className={`flex items-center justify-center w-12 h-12 font-mono font-bold text-lg rounded shadow-sm transition-colors duration-300 ${highlightPredicate(r, c) ? 'bg-green-300 text-green-900 border-green-500 border-2 scale-105' : 'bg-white border text-gray-800'}`}>
          {hex(val)}
        </div>
      )))}
    </div>
  );

  const getStepName = (s: number) => {
    switch(s) {
      
      default: return "";
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 my-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          AES Round Animation 
          <span className="ml-2 text-green-600">
            {getStepName(step)}
          </span>
        </h3>
        
        <div className="flex gap-2 shadow-sm border p-1 rounded-md bg-gray-50">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex justify-center items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-green-700 transition-colors bg-white px-3 py-1.5 rounded cursor-pointer border"
          >
            {isPaused ? <Play size={14} fill="currentColor" className="text-green-600" /> : <Pause size={14} fill="currentColor" className="text-yellow-600" />}
            {isPaused ? "Play" : "Pause"}
          </button>
          <button
            onClick={() => { setIsPaused(true); setStep(0); setSubStep(0); }}
            className="flex justify-center items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded cursor-pointer border"
          >
            <RotateCcw size={14} />
            Restart
          </button>
          <div className="ml-2 pl-2 border-l border-gray-200 flex items-center">
            <AnimationSpeedControl baseTimeMs={700} />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Left Side: Main State Block */}
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Current State Matrix</p>
          {renderGrid(currentState, (r, c) => {
            if ((step === 0 || step === 3 || step === 4 || step === 7) && subStep > 0 && subStep <= 16 && (c * 4 + r) === subStep - 1) return true;
            if ((step === 1 || step === 6) && r === subStep - 1) return true;
            if ((step === 2 || step === 5) && subStep > 0 && subStep <= 4 && c === subStep - 1) return true;
            return false;
          })}
        </div>

        {/* Right Side: Contextual Explanation / Helper blocks */}
        <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200 h-[500px] w-full min-w-[400px] max-w-[600px] relative overflow-hidden flex flex-col justify-start">
          
          {(step === 0 || step === 7) && (
             <div className="flex flex-col h-full bg-white rounded-lg p-2 overflow-auto relative">
              <h4 className="font-bold text-gray-800 mb-2">{step === 0 ? "Encryption - SubBytes: S-Box Substitution" : "Decryption - InvSubBytes: Inverse S-Box"}</h4>
              <p className="text-sm text-gray-600 mb-2">{step === 0 ? "Each byte is replaced non-linearly using the Rijndael S-Box." : "Each byte is replaced using the Inverse Rijndael S-Box matrix."}</p>
              
              <div className="flex-1 border rounded shadow-inner overflow-auto text-[0.8rem] font-mono p-1">
                <div className="flex w-max min-w-full">
                  <div className="w-7 shrink-0 border-r border-b font-bold bg-gray-100 sticky left-0 z-10 flex items-center justify-center"></div>
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={'h'+i} className="w-6 shrink-0 text-center font-bold border-b bg-gray-100 flex items-center justify-center">{i.toString(16).toUpperCase()}</div>
                  ))}
                </div>
                {Array.from({length: 16}).map((_, r) => (
                  <div key={'r'+r} className="flex w-max min-w-full">
                    <div className="w-7 shrink-0 text-center font-bold border-r bg-gray-100 sticky left-0 z-10 flex items-center justify-center">{r.toString(16).toUpperCase()}</div>
                    {Array.from({length: 16}).map((_, c) => {
                      const val = (step === 0 ? SBOX : INVSBOX)[r * 16 + c];
                      let isHighlight = false;
                      if (subStep > 0 && subStep <= 16) {
                        const targetCol = Math.floor((subStep - 1) / 4);
                        const targetRow = (subStep - 1) % 4;
                        const srcByte = step === 0 ? stateInit[targetRow][targetCol] : stateSubBytes[targetRow][targetCol];
                        if (r === (srcByte >> 4) && c === (srcByte & 0x0f)) isHighlight = true;
                      }
                      return (
                        <div key={'c'+c} className={`w-6 shrink-0 text-center transition-colors flex items-center justify-center ${isHighlight ? 'bg-green-500 text-white font-bold' : 'hover:bg-gray-100'}`}>
                          {hex(val)}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              {subStep > 0 && subStep <= 16 && (
                <div className="mt-2 p-2 bg-green-50 text-green-900 border border-green-200 rounded text-sm text-center font-mono">
                  Lookup: {step === 0 
                    ? <span className="font-bold">{hex(stateInit[(subStep - 1) % 4][Math.floor((subStep - 1) / 4)])}</span> 
                    : <span className="font-bold">{hex(stateSubBytes[(subStep - 1) % 4][Math.floor((subStep - 1) / 4)])}</span>} 
                  &rarr; 
                  {step === 0 
                    ? <strong className="text-green-700">{hex(stateSubBytes[(subStep - 1) % 4][Math.floor((subStep - 1) / 4)])}</strong> 
                    : <strong className="text-green-700">{hex(stateInit[(subStep - 1) % 4][Math.floor((subStep - 1) / 4)])}</strong>}
                </div>
              )}
            </div>
          )}

          {(step === 1 || step === 6) && (
             <div className="flex flex-col h-full justify-center">
              <h4 className="font-bold text-gray-800 mb-2">{step === 1 ? "Encryption - ShiftRows" : "Decryption - InvShiftRows"}</h4>
              <p className="text-sm text-gray-600 mb-6">{step === 1 ? "Each row is cyclically shifted to the left depending on its index" : "Each row is cyclically shifted to the right to undo the encryption shift"}</p>
              
              <div className="space-y-3">
                {[0, 1, 2, 3].map((r) => (
                  <div key={r} className={`flex items-center p-2 rounded transition-colors ${subStep > r ? 'bg-green-50 border border-green-200' : 'bg-white border opacity-60 grayscale'}`}>
                    <span className="w-16 text-sm font-semibold">Row {r}</span>
                    <span className="text-xs mr-2 text-gray-500 text-right w-24">Shift {step === 1 ? 'left' : 'right'} {r}</span>
                    <div className="flex gap-1 font-mono text-sm">
                      {(subStep > r ? (step === 1 ? stateShiftRows : stateSubBytes)[r] : (step === 1 ? stateSubBytes : stateShiftRows)[r]).map((b, c) => (
                        <span key={c} className="px-2 py-1 bg-white border rounded shadow-sm">{hex(b)}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(step === 2 || step === 5) && (
            <div className="flex flex-col h-full bg-white p-2 rounded-lg overflow-auto">
              <h4 className="font-bold text-gray-800 mb-1">{step === 2 ? "Encryption - MixColumns" : "Decryption - InvMixColumns"}</h4>
              <p className="text-xs text-gray-600 mb-2">Matrix multiplication in <InlineMath math="GF(2^8)" /> using {step === 2 ? '' : 'inverse'} matrix for {step === 2 ? 'encryption' : 'decryption'}</p>

              {subStep > 0 && subStep <= 4 ? (() => {
                  const colIdx = subStep - 1;
                  const srcState = step === 2 ? stateShiftRows : stateMixColumns;
                  const resState = step === 2 ? stateMixColumns : stateShiftRows;
                  const c0 = srcState[0][colIdx];
                  const c1 = srcState[1][colIdx];
                  const c2 = srcState[2][colIdx];
                  const c3 = srcState[3][colIdx];
                  const res0 = resState[0][colIdx];
                  
                return (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm mb-2 w-full justify-center">
                      
                      {step === 2 ? (
                      <div className="grid grid-rows-4 gap-1 font-mono text-[10px]">
                        <div className="flex gap-1"><span className="p-0.5 border rounded bg-gray-50 text-center w-5">02</span><span className="p-0.5 text-center opacity-50 w-5">03</span><span className="p-0.5 text-center opacity-50 w-5">01</span><span className="p-0.5 text-center opacity-50 w-5">01</span></div>
                        <div className="flex gap-1"><span className="p-0.5 border rounded bg-gray-50 text-center w-5">01</span><span className="p-0.5 text-center opacity-50 w-5">02</span><span className="p-0.5 text-center opacity-50 w-5">03</span><span className="p-0.5 text-center opacity-50 w-5">01</span></div>
                        <div className="flex gap-1"><span className="p-0.5 border rounded bg-gray-50 text-center w-5">01</span><span className="p-0.5 text-center opacity-50 w-5">01</span><span className="p-0.5 text-center opacity-50 w-5">02</span><span className="p-0.5 text-center opacity-50 w-5">03</span></div>
                        <div className="flex gap-1"><span className="p-0.5 border rounded bg-gray-50 text-center w-5">03</span><span className="p-0.5 text-center opacity-50 w-5">01</span><span className="p-0.5 text-center opacity-50 w-5">01</span><span className="p-0.5 text-center opacity-50 w-5">02</span></div>
                      </div>
                      ) : (
                      <div className="grid grid-rows-4 gap-1 font-mono text-[10px]">
                        <div className="flex gap-1"><span className="p-0.5 border rounded bg-gray-50 text-center w-5">0E</span><span className="p-0.5 text-center opacity-50 w-5">0B</span><span className="p-0.5 text-center opacity-50 w-5">0D</span><span className="p-0.5 text-center opacity-50 w-5">09</span></div>
                        <div className="flex gap-1"><span className="p-0.5 border rounded bg-gray-50 text-center w-5">09</span><span className="p-0.5 text-center opacity-50 w-5">0E</span><span className="p-0.5 text-center opacity-50 w-5">0B</span><span className="p-0.5 text-center opacity-50 w-5">0D</span></div>
                        <div className="flex gap-1"><span className="p-0.5 border rounded bg-gray-50 text-center w-5">0D</span><span className="p-0.5 text-center opacity-50 w-5">09</span><span className="p-0.5 text-center opacity-50 w-5">0E</span><span className="p-0.5 text-center opacity-50 w-5">0B</span></div>
                        <div className="flex gap-1"><span className="p-0.5 border rounded bg-gray-50 text-center w-5">0B</span><span className="p-0.5 text-center opacity-50 w-5">0D</span><span className="p-0.5 text-center opacity-50 w-5">09</span><span className="p-0.5 text-center opacity-50 w-5">0E</span></div>
                      </div>
                      )}

                      <span className="font-bold text-sm">&times;</span>

                      <div className="grid grid-rows-4 gap-1 font-mono text-[10px] font-bold text-blue-700">
                        <span className="p-0.5 border border-blue-200 rounded bg-blue-50 text-center w-6">{hex(c0)}</span>
                        <span className="p-0.5 border border-blue-200 rounded bg-blue-50 text-center w-6">{hex(c1)}</span>
                        <span className="p-0.5 border border-blue-200 rounded bg-blue-50 text-center w-6">{hex(c2)}</span>
                        <span className="p-0.5 border border-blue-200 rounded bg-blue-50 text-center w-6">{hex(c3)}</span>
                      </div>

                      <span className="font-bold text-sm">=</span>
                      
                      <div className="grid grid-rows-4 gap-1 font-mono text-[10px] font-bold text-green-700">
                        <span className="p-0.5 border border-green-400 rounded bg-green-200 text-center w-6">{hex(res0)}</span>
                        <span className="p-0.5 border border-green-200 rounded bg-green-50 text-center w-6">{hex(resState[1][colIdx])}</span>
                        <span className="p-0.5 border border-green-200 rounded bg-green-50 text-center w-6">{hex(resState[2][colIdx])}</span>
                        <span className="p-0.5 border border-green-200 rounded bg-green-50 text-center w-6">{hex(resState[3][colIdx])}</span>
                      </div>
                    </div>

                    {step === 2 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg w-full text-[11px]">
                      <div className="p-1.5 border-b border-green-200 font-semibold text-green-900 bg-white rounded-t-lg">
                        Calculating top byte of result:
                      </div>
                      <div className="p-2 font-mono space-y-1 overflow-x-auto text-[10px] w-full">
                        <div className="flex flex-col gap-0.5 border-b border-green-200 pb-1 whitespace-nowrap">
                          <span className="text-gray-600">02 &times; {hex(c0)} in <InlineMath math="GF(2^8)" /> = </span>
                          <span><InlineMath math={`(${toPoly(0x02)}) \\cdot (${toPoly(c0)}) \\pmod{x^8+x^4+x^3+x+1} = ${toPoly(gfMul(0x02, c0))}`} /> = {toBin(gfMul(0x02, c0))} = <strong className="text-green-800">{hex(gfMul(0x02, c0))}</strong></span>
                        </div>
                        <div className="flex flex-col gap-0.5 border-b border-green-200 pb-1 whitespace-nowrap">
                          <span className="text-gray-600">03 &times; {hex(c1)} in <InlineMath math="GF(2^8)" /> = </span>
                          <span><InlineMath math={`(${toPoly(0x03)}) \\cdot (${toPoly(c1)}) \\pmod{x^8+x^4+x^3+x+1} = ${toPoly(gfMul(0x03, c1))}`} /> = {toBin(gfMul(0x03, c1))} = <strong className="text-green-800">{hex(gfMul(0x03, c1))}</strong></span>
                        </div>
                        <div className="flex flex-col gap-0.5 border-b border-green-200 pb-1 whitespace-nowrap">
                          <span className="text-gray-600">01 &times; {hex(c2)} in <InlineMath math="GF(2^8)" /> = </span>
                          <span><InlineMath math={toPoly(c2)} /> = {toBin(c2)} = <strong className="text-green-800">{hex(c2)}</strong></span>
                        </div>
                        <div className="flex flex-col gap-0.5 pb-1 whitespace-nowrap">
                          <span className="text-gray-600">01 &times; {hex(c3)} in <InlineMath math="GF(2^8)" /> = </span>
                          <span><InlineMath math={toPoly(c3)} /> = {toBin(c3)} = <strong className="text-green-800">{hex(c3)}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 font-bold pt-1 border-t-2 border-green-300 mt-0.5 text-[10px] bg-green-100 p-1.5 rounded">
                          <span className="text-green-900">XOR sum = {hex(gfMul(0x02, c0))} &oplus; {hex(gfMul(0x03, c1))} &oplus; {hex(c2)} &oplus; {hex(c3)} =</span>
                          <span className="text-green-800">{hex(res0)}</span>
                        </div>
                      </div>
                    </div>
                    )}
                    {step === 5 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg w-full text-[11px]">
                      <div className="p-1.5 border-b border-green-200 font-semibold text-green-900 bg-white rounded-t-lg">
                        Calculating top byte of result:
                      </div>
                      <div className="p-2 font-mono space-y-1 overflow-x-auto text-[11px] w-full">
                        <div className="flex flex-col gap-0.5 border-b border-green-200 pb-1 whitespace-nowrap">
                          <span className="text-gray-600">0E &times; {hex(c0)} in <InlineMath math="GF(2^8)" /> = </span>
                          <span><InlineMath math={`(${toPoly(0x0e)}) \\cdot (${toPoly(c0)}) \\pmod{x^8+x^4+x^3+x+1} = ${toPoly(gfMul(0x0e, c0))}`} /> = {toBin(gfMul(0x0e, c0))} = <strong className="text-green-800">{hex(gfMul(0x0e, c0))}</strong></span>
                        </div>
                        <div className="flex flex-col gap-0.5 border-b border-green-200 pb-1 whitespace-nowrap">
                          <span className="text-gray-600">0B &times; {hex(c1)} in <InlineMath math="GF(2^8)" /> = </span>
                          <span><InlineMath math={`(${toPoly(0x0b)}) \\cdot (${toPoly(c1)}) \\pmod{x^8+x^4+x^3+x+1} = ${toPoly(gfMul(0x0b, c1))}`} /> = {toBin(gfMul(0x0b, c1))} = <strong className="text-green-800">{hex(gfMul(0x0b, c1))}</strong></span>
                        </div>
                        <div className="flex flex-col gap-0.5 border-b border-green-200 pb-1 whitespace-nowrap">
                          <span className="text-gray-600">0D &times; {hex(c2)} in <InlineMath math="GF(2^8)" /> = </span>
                          <span><InlineMath math={`(${toPoly(0x0d)}) \\cdot (${toPoly(c2)}) \\pmod{x^8+x^4+x^3+x+1} = ${toPoly(gfMul(0x0d, c2))}`} /> = {toBin(gfMul(0x0d, c2))} = <strong className="text-green-800">{hex(gfMul(0x0d, c2))}</strong></span>
                        </div>
                        <div className="flex flex-col gap-0.5 pb-1 whitespace-nowrap">
                          <span className="text-gray-600">09 &times; {hex(c3)} in <InlineMath math="GF(2^8)" /> = </span>
                          <span><InlineMath math={`(${toPoly(0x09)}) \\cdot (${toPoly(c3)}) \\pmod{x^8+x^4+x^3+x+1} = ${toPoly(gfMul(0x09, c3))}`} /> = {toBin(gfMul(0x09, c3))} = <strong className="text-green-800">{hex(gfMul(0x09, c3))}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 font-bold pt-1 border-t-2 border-green-300 mt-0.5 text-[10px] bg-green-100 p-1.5 rounded">
                          <span className="text-green-900">XOR sum = {hex(gfMul(0x0e, c0))} &oplus; {hex(gfMul(0x0b, c1))} &oplus; {hex(gfMul(0x0d, c2))} &oplus; {hex(gfMul(0x09, c3))} =</span>
                          <span className="text-green-800">{hex(res0)}</span>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                );
              })() : (
                <div className="flex items-center justify-center h-40 text-gray-400 italic">
                  Press Play to see {step === 2 ? "" : "inverse"} matrix multiplication.
                </div>
              )}
            </div>
          )}

          {(step === 3 || step === 4) && (
            <div className="flex flex-col h-full justify-center">
              <h4 className="font-bold text-gray-800 mb-2">{step === 3 ? "Encryption - AddRoundKey" : "Decryption - AddRoundKey"}</h4>
              <p className="text-sm text-gray-600 mb-6">The step XORs the current state with the specific sub-key for this round.</p>
              
              <div className="flex justify-center gap-6 items-center">
                <div className="flex flex-col border p-2 bg-white rounded shadow-sm items-center">
                  <span className="text-xs text-gray-400 mb-1 font-semibold uppercase">{step === 3 ? "State" : "Ciphertext"}</span>
                  <div className="grid grid-cols-4 gap-1 font-mono text-xs">
                    {(step === 3 ? stateMixColumns : stateAddRoundKey).map(r => r.map((b, c) => <div key={'c'+c} className="w-6 h-6 flex justify-center items-center">{hex(b)}</div>))}
                  </div>
                </div>
                <div className="text-3xl font-bold">&oplus;</div>
                <div className="flex flex-col border p-2 bg-blue-50 border-blue-200 rounded shadow-sm items-center">
                  <span className="text-xs text-blue-400 mb-1 font-semibold uppercase">Round Key</span>
                  <div className="grid grid-cols-4 gap-1 font-mono text-xs font-semibold text-blue-800">
                    {ROUND_KEY.map(r => r.map((b, c) => <div key={'k'+c} className="w-6 h-6 flex justify-center items-center">{hex(b)}</div>))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-1 w-full">
        <div className="w-full flex gap-2 px-4 mx-auto">
          {[...Array(maxSteps)].map((_, s) => (
            <button
              key={s}
              onClick={() => { setStep(s); setSubStep(0); }}
              className={`flex-1 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                step === s
                  ? "bg-green-600 shadow-sm"
                  : s < 4
                  ? "bg-green-200 hover:bg-green-300"
                  : "bg-purple-200 hover:bg-purple-300"
              }`}
              title={getStepName(s)}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>

    </div>
  );
}
