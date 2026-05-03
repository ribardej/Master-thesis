import React, { useState, useEffect, useMemo } from "react";
import { M, N, randomError, randomMatrix, randomSecret, matVecMul, vecAdd, fullElimination, Q } from "./lwe-math";
import { Step1, Step2, Step3, Step4 } from "./lwe-steps";

const STEP_LABELS = [
  "Input A & s",
  "Compute b",
  "Gaussian Elimination",
  "Guess the Error",
];

export function LWEGaussianEliminationAnimation() {
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(0);

  // Step 1 state: string inputs (randomized by default)
  const [aStr, setAStr] = useState<string[][]>(() =>
    randomMatrix().map((row) => row.map(String))
  );
  const [sStr, setSStr] = useState<string[]>(() => randomSecret().map(String));

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
    const parsedA = aStr.map((row) => row.map(Number));
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
    setSubStep(0);
    setAStr(randomMatrix().map((row) => row.map(String)));
    setSStr(randomSecret().map(String));
    setA([]);
    setS([]);
    setE([]);
    setAs([]);
    setB([]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleNext = (ev: Event) => {
      if (step === 2 && stages.length > 0 && subStep < stages.length - 1) {
        ev.preventDefault();
        setSubStep((prev) => prev + 1);
      } else if (step < 3) {
        ev.preventDefault();
        if (step === 0) goToStep2();
        else {
          if (step + 1 === 2) setSubStep(0);
          setStep((prev) => prev + 1);
        }
      }
    };
    const handlePrev = (ev: Event) => {

      if (step === 2 && subStep > 0) {
        ev.preventDefault();
        setSubStep((prev) => prev - 1);
      } else if (step > 0) {
        ev.preventDefault();
        if (step - 1 === 2) {
          setSubStep(stages.length > 0 ? stages.length - 1 : 0);
        }
        setStep((prev) => prev - 1);
      }
    };
    window.addEventListener("slide-next", handleNext);
    window.addEventListener("slide-prev", handlePrev);
    return () => {
      window.removeEventListener("slide-next", handleNext);
      window.removeEventListener("slide-prev", handlePrev);
    };
  }, [step, subStep, stages.length, aStr, sStr]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Header */}
      <div className="w-full mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 m-0">
          Interactive Tool - solving LWE(4, 3, 17, 2)
        </h3>
      </div>

      {/* Step indicator */}
      <div className="w-full flex items-center justify-center gap-1 mb-5 px-4">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${i === step
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : i < step
                    ? "bg-indigo-100 text-indigo-600 border-indigo-300"
                    : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${i === step
                  ? "text-indigo-600"
                  : i < step
                    ? "text-indigo-400"
                    : "text-gray-400"
                  }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded transition-colors ${i < step ? "bg-gray-400" : "bg-gray-200"
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="w-full min-h-[320px] flex items-start justify-center">
        {step === 0 && (
          <Step1
            A={aStr}
            s={sStr}
            setA={setAStr}
            setS={setSStr}
            onNext={goToStep2}
          />
        )}
        {step === 1 && (
          <Step2
            A={A}
            s={s}
            e={e}
            b={b}
            As={As}
            onNext={() => {
              setSubStep(0);
              setStep(2);
            }}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && stages.length > 0 && (
          <Step3
            stages={stages}
            subStep={subStep}
            setSubStep={setSubStep}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && stages.length > 0 && (
          <Step4
            finalSys={stages[stages.length - 1]}
            actualE={e}
            actualS={s}
            onRestart={restart}
          />
        )}
      </div>

      {/* Progress tiles */}
      <div className="mt-6 w-full flex gap-1 px-4">
        {STEP_LABELS.map((_, s) => (
          <button
            key={s}
            onClick={() => {
              if (s < step) {
                if (s === 2) setSubStep(stages.length > 0 ? stages.length - 1 : 0);
                setStep(s);
              } else if (s === step + 1 && step === 0) {
                goToStep2();
              } else if (s === step + 1 && step === 1) {
                setSubStep(0);
                setStep(s);
              } else if (s === step + 1 && step === 2) {
                setStep(s);
              }
            }}
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${step === s
              ? "bg-gray-600 shadow-sm"
              : s < step
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 w-full flex justify-between items-center text-xs text-gray-400 px-4">
        <span>
          Step {step + 1} / {STEP_LABELS.length}
        </span>
        <span>Use arrow keys to navigate</span>
      </div>
    </div>
  );
}
