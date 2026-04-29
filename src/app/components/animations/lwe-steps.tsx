import React, { useState } from "react";
import { Shuffle, ArrowRight, ArrowLeft, RotateCcw, Check, X } from "lucide-react";
import {
  Q, M, N, B, mod, randomMatrix, randomSecret, randomError,
  matVecMul, vecAdd, fullElimination, formatErrExpr, errorRange,
  trySolve, type EqRow
} from "./lwe-math";

/* ── Shared helpers ── */
const SUB = ["₁", "₂", "₃", "₄"];

function severity(range: [number, number]): "green" | "amber" | "orange" | "red" {
  const v = Math.max(Math.abs(range[0]), Math.abs(range[1]));
  if (v <= 2) return "green";
  if (v <= 30) return "amber";
  if (v <= 50) return "orange";
  return "red";
}

const sevColors = {
  green: { text: "text-green-600", bg: "bg-green-400", bar: "bg-green-50 border-green-200" },
  amber: { text: "text-amber-600", bg: "bg-amber-400", bar: "bg-amber-50 border-amber-200" },
  orange: { text: "text-orange-600", bg: "bg-orange-400", bar: "bg-orange-50 border-orange-200" },
  red: { text: "text-red-600", bg: "bg-red-500", bar: "bg-red-50 border-red-200" },
};

function InputCell({ value, onChange, min = 0, max = 16 }: {
  value: string; onChange: (v: string) => void; min?: number; max?: number;
}) {
  return (
    <input
      type="number" min={min} max={max} value={value} onChange={e => onChange(e.target.value)}
      className="w-10 h-8 text-center font-mono text-sm border rounded bg-white shadow-inner outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
}

/* ══════════════════ STEP 1 ══════════════════ */
export function Step1({ A, s, setA, setS, onNext }: {
  A: string[][]; s: string[]; setA: (a: string[][]) => void; setS: (s: string[]) => void; onNext: () => void;
}) {
  const allFilled = A.every(row => row.every(v => v !== "" && !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 16))
    && s.every(v => v !== "" && !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 16);

  const randomize = () => {
    const rm = randomMatrix();
    const rs = randomSecret();
    setA(rm.map(row => row.map(String)));
    setS(rs.map(String));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm text-gray-600 text-center">
        Enter the matrix <b>A</b> ∈ ℤ₁₇<sup>4×3</sup> and secret vector <b>s</b> ∈ ℤ₁₇³, or randomize them.
      </p>

      <button onClick={randomize}
        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md border border-indigo-200 transition-colors cursor-pointer">
        <Shuffle size={14} /> Randomize All
      </button>

      <div className="flex items-center gap-4">
        {/* Matrix A */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">Matrix A</span>
          <div className="flex items-center">
            <span className="text-2xl text-gray-300 mr-1">[</span>
            <div className="flex flex-col gap-1">
              {A.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((v, j) => (
                    <InputCell key={j} value={v} onChange={val => {
                      const newA = A.map(r => [...r]);
                      newA[i][j] = val;
                      setA(newA);
                    }} />
                  ))}
                </div>
              ))}
            </div>
            <span className="text-2xl text-gray-300 ml-1">]</span>
          </div>
        </div>

        <span className="text-lg text-gray-400 font-bold mt-4">·</span>

        {/* Vector s */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">Secret s</span>
          <div className="flex items-center">
            <span className="text-2xl text-gray-300 mr-1">[</span>
            <div className="flex flex-col gap-1">
              {s.map((v, i) => (
                <div key={i}><InputCell value={v} onChange={val => { const ns = [...s]; ns[i] = val; setS(ns); }} /></div>
              ))}
            </div>
            <span className="text-2xl text-gray-300 ml-1">]</span>
          </div>
        </div>

        <span className="text-lg text-gray-400 font-bold mt-4">+</span>

        {/* Error e (unknown) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">Error e</span>
          <div className="flex items-center">
            <span className="text-2xl text-gray-300 mr-1">[</span>
            <div className="flex flex-col gap-1">
              {Array.from({ length: M }, (_, i) => (
                <div key={i} className="w-10 h-8 flex items-center justify-center text-sm font-mono text-gray-400">?</div>
              ))}
            </div>
            <span className="text-2xl text-gray-300 ml-1">]</span>
          </div>
        </div>

        <span className="text-lg text-gray-400 font-bold mt-4">=</span>

        {/* Result b (unknown) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">b (mod 17)</span>
          <div className="flex items-center">
            <span className="text-2xl text-gray-300 mr-1">[</span>
            <div className="flex flex-col gap-1">
              {Array.from({ length: M }, (_, i) => (
                <div key={i} className="w-10 h-8 flex items-center justify-center text-sm font-mono text-gray-400">?</div>
              ))}
            </div>
            <span className="text-2xl text-gray-300 ml-1">]</span>
          </div>
        </div>
      </div>

      <button onClick={onNext} disabled={!allFilled}
        className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md border transition-colors cursor-pointer ${
          allFilled ? "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-700" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        }`}>
        Next <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* ══════════════════ STEP 2 ══════════════════ */
export function Step2({ A, s, e, b, As, onNext, onBack }: {
  A: number[][]; s: number[]; e: number[]; b: number[]; As: number[]; onNext: () => void; onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm text-gray-600 text-center">
        A random error <b>e</b> ∈ {"[-2, 2]⁴"} is sampled. The vector <b>b = As + e (mod 17)</b> is computed.
      </p>

      <div className="flex items-center gap-3">
        {/* A */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">A</span>
          <div className="bg-gray-50 border rounded p-2">
            {A.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => (
                  <span key={j} className="w-8 h-6 flex items-center justify-center font-mono text-xs text-gray-700">{v}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <span className="text-gray-400 font-bold mt-4">·</span>
        {/* s */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">s</span>
          <div className="bg-gray-50 border rounded p-2">
            {s.map((v, i) => (
              <div key={i} className="w-8 h-6 flex items-center justify-center font-mono text-xs text-gray-700">{v}</div>
            ))}
          </div>
        </div>
        <span className="text-gray-400 font-bold mt-4">=</span>
        {/* As */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">A·s mod 17</span>
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            {As.map((v, i) => (
              <div key={i} className="w-8 h-6 flex items-center justify-center font-mono text-xs text-blue-700 font-semibold">{v}</div>
            ))}
          </div>
        </div>
        <span className="text-gray-400 font-bold mt-4">+</span>
        {/* e */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-amber-600">e (random)</span>
          <div className="bg-amber-50 border border-amber-200 rounded p-2">
            {e.map((v, i) => (
              <div key={i} className="w-8 h-6 flex items-center justify-center font-mono text-xs text-amber-700 font-semibold">
                {v >= 0 ? `+${v}` : v}
              </div>
            ))}
          </div>
        </div>
        <span className="text-gray-400 font-bold mt-4">=</span>
        {/* b */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-green-600">b (mod 17)</span>
          <div className="bg-green-50 border border-green-200 rounded p-2">
            {b.map((v, i) => (
              <div key={i} className="w-8 h-6 flex items-center justify-center font-mono text-xs text-green-700 font-semibold">{v}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-700 max-w-lg text-center">
        Without the error, recovering <b>s</b> from <b>A</b> and <b>b</b> would be trivial via Gaussian elimination.
        The small error <b>e</b> makes this computationally hard. Let's see why.
      </div>

      <div className="flex gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 bg-gray-50 px-3 py-2 rounded-md border transition-colors cursor-pointer">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={onNext} className="flex items-center gap-1 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md border border-indigo-700 transition-colors cursor-pointer">
          Next <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ STEP 3 ══════════════════ */
export function Step3({ stages, onNext, onBack }: {
  stages: EqRow[][]; onNext: () => void; onBack: () => void;
}) {
  const [subStep, setSubStep] = useState(0);
  const maxSub = stages.length;
  const sys = stages[Math.min(subStep, maxSub - 1)];

  const labels = ["Original System", ...Array.from({ length: maxSub - 1 }, (_, i) => `Eliminate s${SUB[i]}`)];

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-sm text-gray-600 text-center">
        Gaussian elimination on the system. Watch how the error expressions grow at each step.
      </p>

      {/* Sub-step indicator */}
      <div className="flex gap-2 items-center">
        {labels.slice(0, maxSub).map((label, i) => (
          <button key={i} onClick={() => setSubStep(i)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              subStep === i ? "bg-indigo-600 text-white border-indigo-700" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}>{label}</button>
        ))}
      </div>

      {/* Equations & error bars side by side */}
      <div className="w-full flex gap-4 px-2">
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg border p-3">
            <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">System of Equations (mod {Q})</div>
            <div className="flex flex-col gap-1.5">
              {sys.map((eq, i) => {
                const range = errorRange(eq.errCoeffs);
                const sev = severity(range);
                const isModified = subStep > 0 && i > (subStep - 1);
                return (
                  <div key={i} className={`flex items-center gap-2 font-mono text-xs px-2 py-1.5 rounded transition-all duration-500 ${
                    isModified ? "bg-indigo-50 border border-indigo-200 shadow-sm" : "bg-white border border-gray-100"
                  }`}>
                    <div className="flex gap-0.5 items-center min-w-[180px]">
                      {eq.coeffs.map((c, j) => (
                        <React.Fragment key={j}>
                          <span className={`inline-block w-[22px] text-center font-semibold ${c === 0 ? "text-gray-300" : "text-gray-800"}`}>{c}</span>
                          <span className="text-gray-400 text-[10px]">s<sub>{j + 1}</sub></span>
                          {j < N - 1 && <span className="text-gray-300 mx-0.5">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="text-gray-400">=</span>
                    <span className="font-semibold text-gray-800 w-[20px] text-center">{eq.rhs}</span>
                    <span className="text-gray-300">−</span>
                    <span className={`text-[10px] ${sevColors[sev].text} font-medium`}>
                      ({formatErrExpr(eq.errCoeffs)})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error range bars */}
        <div className="w-[200px] flex flex-col">
          <div className="bg-gray-50 rounded-lg border p-3 flex-1">
            <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">Error Range per Equation</div>
            <div className="flex flex-col gap-2">
              {sys.map((eq, i) => {
                const range = errorRange(eq.errCoeffs);
                const sev = severity(range);
                const maxRange = Math.max(...stages[stages.length - 1].map(r => { const rng = errorRange(r.errCoeffs); return Math.max(Math.abs(rng[0]), Math.abs(rng[1])); }));
                const barW = Math.min(100, Math.max(5, (Math.max(Math.abs(range[0]), Math.abs(range[1])) / maxRange) * 100));
                return (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-mono">eq.{i + 1}</span>
                      <span className={`text-[10px] font-bold ${sevColors[sev].text}`}>[{range[0]}, {range[1]}]</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${sevColors[sev].bg}`}
                        style={{ width: `${barW}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500">Modulus q = {Q}</span>
                <span className="text-gray-500">q/2 = {(Q / 2).toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {subStep >= 2 ? "Error ≫ q/2 → RHS is random mod q" : "Error must stay small for system to be solvable"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="w-full px-2">
        <div className="bg-white p-3 rounded-lg border text-sm text-gray-600 text-center shadow-sm">
          {subStep === 0 && "We start with 4 equations in 3 unknowns modulo 17. Each equation has a small unknown error eᵢ ∈ [-2, 2]."}
          {subStep === 1 && "After eliminating s₁, the error coefficients grow. The error range has expanded significantly."}
          {subStep >= 2 && "The error range has exploded — it exceeds q many times over. The RHS values are now indistinguishable from random mod 17. Gaussian elimination fails!"}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 bg-gray-50 px-3 py-2 rounded-md border transition-colors cursor-pointer">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={onNext} className="flex items-center gap-1 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md border border-indigo-700 transition-colors cursor-pointer">
          Next <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ STEP 4 ══════════════════ */
export function Step4({ A, b, actualE, actualS, onRestart }: {
  A: number[][]; b: number[]; actualE: number[]; actualS: number[]; onRestart: () => void;
}) {
  const [guess, setGuess] = useState<string[]>(Array(M).fill("0"));
  const [result, setResult] = useState<{ correct: boolean; solvedS: number[] | null } | null>(null);
  const [revealed, setRevealed] = useState(false);

  const checkGuess = () => {
    const eGuess = guess.map(Number);
    const solvedS = trySolve(A, b, eGuess);
    const correct = solvedS !== null && actualS.every((v, i) => v === solvedS[i]);
    setResult({ correct, solvedS });
  };

  const reveal = () => setRevealed(true);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm text-gray-600 text-center max-w-lg">
        The <b>LWE decision problem</b>: given <b>A</b> and <b>b</b>, is <b>b = As + e</b> for some small <b>e</b>, or is <b>b</b> random?
        Try to guess the error vector <b>e</b> and recover <b>s</b>.
      </p>

      <div className="flex gap-6 items-start">
        {/* Public info: A and b */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 text-center">Public: A and b</span>
          <div className="flex items-center gap-2">
            <div className="bg-gray-50 border rounded p-2">
              {A.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((v, j) => (
                    <span key={j} className="w-7 h-6 flex items-center justify-center font-mono text-xs text-gray-700">{v}</span>
                  ))}
                  <span className="w-4 text-center text-gray-300">|</span>
                  <span className="w-7 h-6 flex items-center justify-center font-mono text-xs text-green-700 font-semibold">{b[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guess e */}
        <div className="flex flex-col gap-2 items-center">
          <span className="text-[10px] uppercase font-bold text-amber-600">Your guess for e ∈ [-2, 2]⁴</span>
          <div className="flex flex-col gap-1">
            {guess.map((v, i) => (
              <InputCell key={i} value={v} min={-2} max={2}
                onChange={val => { const ng = [...guess]; ng[i] = val; setGuess(ng); setResult(null); setRevealed(false); }} />
            ))}
          </div>
          <button onClick={checkGuess}
            className="flex items-center gap-1 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-md border border-indigo-700 transition-colors cursor-pointer mt-1">
            <Check size={12} /> Check
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="flex flex-col gap-2 items-center">
            <span className="text-[10px] uppercase font-bold text-gray-500">Result</span>
            {result.correct ? (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center">
                <div className="text-green-700 font-bold text-sm flex items-center gap-1 justify-center"><Check size={14} /> Correct!</div>
                <div className="text-xs text-green-600 mt-1">s = [{result.solvedS?.join(", ")}]</div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-center">
                <div className="text-red-700 font-bold text-sm flex items-center gap-1 justify-center"><X size={14} /> No solution</div>
                <div className="text-xs text-red-600 mt-1">This error guess doesn't lead to a valid s.</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reveal */}
      {!revealed ? (
        <button onClick={reveal}
          className="text-xs text-gray-500 hover:text-indigo-600 underline cursor-pointer mt-2">
          Reveal actual e and s
        </button>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600">
            <b>Actual e</b> = [{actualE.join(", ")}] &nbsp;|&nbsp; <b>Actual s</b> = [{actualS.join(", ")}]
          </div>
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-700 max-w-lg text-center">
        Even in this tiny example with only 3 unknowns, guessing the correct error among 5⁴ = 625 possibilities is non-trivial.
        Real LWE uses <b>n = 256</b> and <b>q = 3329</b> — the search space is astronomically large.
      </div>

      <button onClick={onRestart}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 bg-gray-50 px-3 py-2 rounded-md border transition-colors cursor-pointer">
        <RotateCcw size={14} /> Start Over
      </button>
    </div>
  );
}
