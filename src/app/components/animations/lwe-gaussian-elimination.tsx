import React, { useState, useEffect, useMemo } from "react";
import { M, N, randomError, matVecMul, vecAdd, fullElimination, Q } from "./lwe-math";
import { Step1, Step2, Step3, Step4 } from "./lwe-steps";

const STEP_LABELS = [
  "Input A & s",
  "Compute b",
  "Gaussian Elimination",
  "Guess the Error",
];

export function LWEGaussianEliminationAnimation() {
  const [step, setStep] = useState(0);

  // Step 1 state: string inputs
  const [aStr, setAStr] = useState<string[][]>(
    Array.from({ length: M }, () => Array(N).fill(""))
  );
  const [sStr, setSStr] = useState<string[]>(Array(N).fill(""));

  // Computed values (set when advancing from step 1)
  const [A, setA] = useState<number[][]>([]);
  const [s, setS] = useState<number[]>([]);
  const [e, setE] = useState<number[]>([]);
  const [As, setAs] = useState<number[]>([]);
  const [b, setB] = useState<number[]>([]);

  // Gaussian elimination stages
  const stages = useMemo(() => {
    if (A.length === 0 || b.length === 0) return [];
    return fullElimination(A, b);
  }, [A, b]);

  // Advance from step 1 → 2: parse inputs, generate error, compute b
  const goToStep2 = () => {
    const parsedA = aStr.map(row => row.map(Number));
    const parsedS = sStr.map(Number);
    const newE = randomError();
    const newAs = matVecMul(parsedA, parsedS, Q);
    const newB = vecAdd(newAs, newE, Q);

    setA(parsedA);
    setS(parsedS);
    setE(newE);
    setAs(newAs);
    setB(newB);
    setStep(1);
  };

  const restart = () => {
    setStep(0);
    setAStr(Array.from({ length: M }, () => Array(N).fill("")));
    setSStr(Array(N).fill(""));
    setA([]);
    setS([]);
    setE([]);
    setAs([]);
    setB([]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleNext = (ev: Event) => {
      if (step < 3) {
        ev.preventDefault();
        if (step === 0) goToStep2();
        else setStep(prev => prev + 1);
      }
    };
    const handlePrev = (ev: Event) => {
      if (step > 0) {
        ev.preventDefault();
        setStep(prev => prev - 1);
      }
    };
    window.addEventListener("slide-next", handleNext);
    window.addEventListener("slide-prev", handlePrev);
    return () => {
      window.removeEventListener("slide-next", handleNext);
      window.removeEventListener("slide-prev", handlePrev);
    };
  }, [step, aStr, sStr]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Header */}
      <div className="w-full mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 m-0">
          LWE Gaussian Elimination — Interactive Tool
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          LWE(4, 3, 17, 2) — experience why the error makes LWE hard
        </p>
      </div>

      {/* Step indicator */}
      <div className="w-full flex items-center justify-center gap-1 mb-5 px-4">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                i === step
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : i < step
                  ? "bg-indigo-100 text-indigo-600 border-indigo-300"
                  : "bg-gray-100 text-gray-400 border-gray-200"
              }`}>
                {i + 1}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${
                i === step ? "text-indigo-600" : i < step ? "text-indigo-400" : "text-gray-400"
              }`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded transition-colors ${
                i < step ? "bg-indigo-300" : "bg-gray-200"
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="w-full min-h-[320px] flex items-start justify-center">
        {step === 0 && (
          <Step1
            A={aStr} s={sStr} setA={setAStr} setS={setSStr}
            onNext={goToStep2}
          />
        )}
        {step === 1 && (
          <Step2
            A={A} s={s} e={e} b={b} As={As}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && stages.length > 0 && (
          <Step3
            stages={stages}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step4
            A={A} b={b} actualE={e} actualS={s}
            onRestart={restart}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 w-full flex justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {STEP_LABELS.length}</span>
        <span>Use arrow keys to navigate</span>
      </div>
    </div>
  );
}
