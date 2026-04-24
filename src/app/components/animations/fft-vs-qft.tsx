import React, { useState, useEffect } from "react";
import { RefreshCw, Pause, Play } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

// ─── Constants ──────────────────────────────────────────────────────
const N = 8;
const n = 3; // log2(8)

const binColors = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd",
  "#818cf8", "#7c3aed", "#5b21b6", "#4f46e5",
];

const freqLabels = ["DC", "f₁", "f₂", "f₃", "f₄", "f₅", "f₆", "f₇"];

// ─── Sub-components ─────────────────────────────────────────────────

function TimeDomainSignal({ highlight }: { highlight: boolean }) {
  // A simple sinusoidal-ish waveform with 8 sample points
  const samples = [0.3, 0.8, 1.0, 0.6, -0.1, -0.7, -0.9, -0.4];
  const w = 220;
  const h = 60;
  const padX = 10;
  const padY = 6;
  const plotW = w - 2 * padX;
  const plotH = h - 2 * padY;
  const midY = padY + plotH / 2;

  // Build a smooth curve path
  const curvePoints = samples.map((s, i) => ({
    x: padX + (i / (samples.length - 1)) * plotW,
    y: midY - s * (plotH / 2),
  }));

  let pathD = `M ${curvePoints[0].x} ${curvePoints[0].y}`;
  for (let i = 1; i < curvePoints.length; i++) {
    const prev = curvePoints[i - 1];
    const curr = curvePoints[i];
    const cpx = (prev.x + curr.x) / 2;
    pathD += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Time Domain ({N} samples)
      </span>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Axis */}
        <line x1={padX} y1={midY} x2={w - padX} y2={midY} stroke="#d1d5db" strokeWidth={1} />
        {/* Curve */}
        <path
          d={pathD}
          fill="none"
          stroke={highlight ? "#6366f1" : "#94a3b8"}
          strokeWidth={2}
          style={{ transition: "stroke 0.4s" }}
        />
        {/* Sample dots */}
        {curvePoints.map((p, i) => (
          <React.Fragment key={i}>
            <line
              x1={p.x} y1={midY} x2={p.x} y2={p.y}
              stroke={highlight ? "#6366f1" : "#c7d2fe"}
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <circle
              cx={p.x} cy={p.y} r={3.5}
              fill={highlight ? binColors[i] : "#94a3b8"}
              stroke="white" strokeWidth={1}
              style={{ transition: "fill 0.4s" }}
            />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}

function FrequencyBins({ activeBins, measured, label }: { activeBins: number; measured?: number; label: string }) {
  const magnitudes = [0.1, 0.9, 0.2, 0.15, 0.1, 0.2, 0.1, 0.8]; // Symmetric spectrum
  const maxMag = 1;

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</span>
      <div className="flex items-end gap-[3px] h-14">
        {magnitudes.map((mag, i) => {
          const h = Math.max(4, (mag / maxMag) * 48);
          const isActive = i < activeBins;
          const isMeasured = measured === i;
          const isDimmed = measured !== undefined && !isMeasured;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div
                style={{
                  height: isActive ? h : 4,
                  width: 18,
                  backgroundColor: isMeasured
                    ? "#f59e0b"
                    : isDimmed
                      ? "#e5e7eb"
                      : isActive
                        ? binColors[i]
                        : "#e5e7eb",
                  borderRadius: 3,
                  transition: "all 0.5s ease",
                  opacity: isDimmed ? 0.3 : 1,
                  boxShadow: isMeasured ? "0 0 8px rgba(245,158,11,0.6)" : "none",
                }}
              />
              <span
                className="text-[8px] font-mono"
                style={{
                  color: isMeasured ? "#d97706" : isActive ? "#6366f1" : "#d1d5db",
                  fontWeight: isMeasured ? 700 : 400,
                  transition: "all 0.4s",
                }}
              >
                {freqLabels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DivideAndConquer({ fftStep }: { fftStep: number }) {
  const levels = [
    { groups: [[0, 1, 2, 3, 4, 5, 6, 7]], label: "8 points" },
    { groups: [[0, 2, 4, 6], [1, 3, 5, 7]], label: "Split by symmetry" },
    { groups: [[0, 4], [2, 6], [1, 5], [3, 7]], label: "Split again" },
    { groups: [[0], [4], [2], [6], [1], [5], [3], [7]], label: "Base cases" },
  ];

  const maxDivideLevel = Math.min(fftStep, 3);
  const combineLevel = fftStep >= 4 ? Math.max(0, 3 - (fftStep - 3)) : -1;

  return (
    <div className="flex flex-col items-center gap-1 my-2 min-h-[140px]">
      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
        Divide & Conquer
      </span>
      <div className="flex flex-col items-center gap-[6px] w-full">
        {levels.map((level, li) => {
          const isDividing = fftStep <= 3;
          let isActive = false;
          let isCurrent = false;

          if (isDividing) {
            isActive = li <= maxDivideLevel;
            isCurrent = li === maxDivideLevel;
          } else {
            // Combining (fftStep >= 4)
            isActive = li >= combineLevel;
            isCurrent = li === combineLevel;
          }

          return (
            <div key={li} className="flex items-center gap-1 relative w-[200px] justify-center">
              {level.groups.map((group, gi) => (
                <div
                  key={gi}
                  className="flex gap-[2px] rounded px-1 py-0.5 border"
                  style={{
                    borderColor: isCurrent ? "#6366f1" : isActive ? "#c7d2fe" : "#e5e7eb",
                    backgroundColor: isCurrent ? "#eef2ff" : isActive ? "#f8fafc" : "#fafafa",
                    transition: "all 0.4s",
                    opacity: isActive ? 1 : 0.4
                  }}
                >
                  {group.map((idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        backgroundColor: isActive ? binColors[idx] : "#d1d5db",
                        transition: "all 0.4s",
                      }}
                    />
                  ))}
                </div>
              ))}
              {isCurrent && (
                <span className="text-[8px] text-indigo-500 font-medium ml-2 animate-pulse absolute left-[100%] whitespace-nowrap">
                  {isDividing ? `← ${level.label}` : `← combine`}
                </span>
              )}
            </div>
          );
        })}
        {/* Direction Indicator */}
        <div className="h-4 mt-1 flex items-center justify-center">
          {fftStep >= 1 && fftStep <= 3 && (
            <div className="text-[8px] text-indigo-400 font-mono">
              ↓ recursively divide ↓
            </div>
          )}
          {fftStep >= 4 && fftStep <= 6 && (
            <div className="text-[8px] text-indigo-500 font-mono animate-pulse">
              ↑ recombine results ↑
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QFTDepthVisualization({ activeLayer, totalLayers, measured }: { activeLayer: number; totalLayers: number; measured: boolean }) {
  const layerWidth = 45;
  const svgWidth = totalLayers * layerWidth + 60;
  const svgHeight = 96;
  const qubitSpacing = 24;
  const startY = 18;

  return (
    <div className="flex flex-col items-center my-2">
      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
        QFT Circuit Depth ({totalLayers} layers on {n} qubits)
      </span>
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="mx-auto">
        {/* Qubit wire labels */}
        {Array.from({ length: n }).map((_, i) => (
          <React.Fragment key={`ql${i}`}>
            <text x={6} y={startY + i * qubitSpacing + 4} fontSize={8} fill="#64748b" fontFamily="monospace">
              q{i}
            </text>
            <line
              x1={22} y1={startY + i * qubitSpacing}
              x2={svgWidth - 30} y2={startY + i * qubitSpacing}
              stroke="#cbd5e1"
              strokeWidth={1.5}
            />
          </React.Fragment>
        ))}

        {/* Depth layers as abstract blocks */}
        {Array.from({ length: totalLayers }).map((_, li) => {
          const x = 30 + li * layerWidth;
          const isActive = li <= activeLayer;
          const isCurrent = li === activeLayer;
          const blockH = n * qubitSpacing - 8;

          return (
            <React.Fragment key={`layer${li}`}>
              <rect
                x={x}
                y={startY - 10}
                width={32}
                height={blockH + 12}
                rx={6}
                fill={isCurrent ? "rgba(245,158,11,0.15)" : isActive ? "rgba(139,92,246,0.1)" : "rgba(0,0,0,0.02)"}
                stroke={isCurrent ? "#f59e0b" : isActive ? "#8b5cf6" : "#e2e8f0"}
                strokeWidth={isCurrent ? 2 : 1}
                style={{ transition: "all 0.4s" }}
              />
              {/* Gate dots on each qubit */}
              {Array.from({ length: n }).map((_, qi) => (
                <circle
                  key={`dot${li}_${qi}`}
                  cx={x + 16}
                  cy={startY + qi * qubitSpacing}
                  r={5}
                  fill={isCurrent ? "#f59e0b" : isActive ? "#8b5cf6" : "#d1d5db"}
                  style={{ transition: "all 0.4s" }}
                />
              ))}
              {/* Entanglement lines between qubits */}
              {li < totalLayers - 1 && Array.from({ length: n - 1 }).map((_, qi) => (
                <line
                  key={`ent${li}_${qi}`}
                  x1={x + 16} y1={startY + qi * qubitSpacing + 5}
                  x2={x + 16} y2={startY + (qi + 1) * qubitSpacing - 5}
                  stroke={isActive ? "#c4b5fd" : "#e5e7eb"}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  style={{ transition: "all 0.4s" }}
                />
              ))}
              {/* Layer label */}
              <text
                x={x + 16}
                y={startY + blockH + 12}
                textAnchor="middle"
                fontSize={7}
                fill={isActive ? "#7c3aed" : "#94a3b8"}
                fontFamily="monospace"
                style={{ transition: "all 0.3s" }}
              >
                L{li + 1}
              </text>
            </React.Fragment>
          );
        })}

        {/* Measurement symbol */}
        <g style={{ opacity: measured ? 1 : 0.2, transition: "opacity 0.5s" }}>
          {/* Meter-like icon */}
          <rect
            x={svgWidth - 28}
            y={startY - 12}
            width={20}
            height={n * qubitSpacing}
            rx={4}
            fill={measured ? "#fef3c7" : "#f8fafc"}
            stroke={measured ? "#f59e0b" : "#d1d5db"}
            strokeWidth={measured ? 2 : 1}
          />
          <text
            x={svgWidth - 18}
            y={startY + (n * qubitSpacing) / 2 - 4}
            textAnchor="middle"
            fontSize={12}
            fill={measured ? "#d97706" : "#94a3b8"}
          >
            M
          </text>
        </g>
      </svg>
    </div>
  );
}

function ScaleComparison({ active }: { active: boolean }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 mt-3"
      style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(8px)", transition: "all 0.6s ease", pointerEvents: active ? "auto" : "none" }}
    >
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
        <div className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mb-2 text-center">
          Classical FFT
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">Formula:</span>
            <span className="font-mono text-indigo-700 font-semibold">N × log₂N</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">N = 2²⁵⁶:</span>
            <span className="font-mono text-indigo-700 font-bold">2²⁵⁶ × 256</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">≈</span>
            <span className="font-mono text-indigo-800 font-bold">2²⁶⁴ operations</span>
          </div>
          <div className="text-[9px] text-indigo-500 text-center mt-1 pt-1 border-t border-indigo-100">
            Computes <strong>exact continuous spectrum</strong>
          </div>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2 text-center">
          Quantum QFT
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">Formula:</span>
            <span className="font-mono text-amber-700 font-semibold">(log₂N)²</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">N = 2²⁵⁶:</span>
            <span className="font-mono text-amber-700 font-bold">256²</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">=</span>
            <span className="font-mono text-amber-800 font-bold">65,536 gates</span>
          </div>
          <div className="text-[9px] text-amber-500 text-center mt-1 pt-1 border-t border-amber-100">
            Yields <strong>one random sample</strong> based on probabilities
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export function FFTvsQFTComparisonAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed] = useGlobalAnimationSpeed();
  const maxSteps = 12;

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 5000 / speed);
    return () => clearTimeout(timer);
  }, [isPaused, speed, step]);

  useEffect(() => {
    const handleNext = (e: Event) => {
      if (step < maxSteps - 1) { e.preventDefault(); setStep((p) => p + 1); }
    };
    const handlePrev = (e: Event) => {
      if (step > 0) { e.preventDefault(); setStep((p) => p - 1); }
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
  }, [step]);

  const reset = () => { setStep(0); setIsPaused(false); };
  const togglePause = () => {
    if (isPaused) setStep((p) => (p + 1) % maxSteps);
    setIsPaused(!isPaused);
  };

  const fftBinsActive = step >= 6 ? N : 0;
  const qftActiveLayer = step === 8 ? 1 : step === 9 ? 3 : step >= 10 ? 3 : -1;
  const qftMeasured = step >= 10;
  const measuredBin = 1; // We'll show it collapsing to f₃

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl border border-gray-200 my-8 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-xl font-bold text-gray-800 m-0 pt-1">FFT vs QFT</h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={togglePause}
              className="flex-1 flex justify-center items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              {isPaused ? "Play" : "Pause"}
            </button>
            <button
              onClick={reset}
              className="flex-1 flex justify-center items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
            >
              <RefreshCw size={14} className={step === maxSteps - 1 && !isPaused ? "animate-spin" : ""} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={5000} />
        </div>
      </div>

      {/* Side-by-side panels */}
      <div className="grid grid-cols-2 gap-4">
        {/* ─── FFT Panel ─── */}
        <div className={`bg-white rounded-lg border p-4 transition-all duration-500 ${step <= 7 ? "border-indigo-300 shadow-md" : "border-gray-200"}`}>
          <div className="text-center mb-2">
            <span className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Classical FFT</span>
            <div className="text-[10px] text-gray-400 mt-0.5">Fast Fourier Transform</div>
          </div>

          <TimeDomainSignal highlight={step >= 0} />

          <DivideAndConquer fftStep={Math.min(step, 7)} />

          <FrequencyBins
            activeBins={fftBinsActive}
            label={step >= 7 ? "All 8 Exact Amplitudes" : "Frequency Domain"}
          />

          <div className={`text-center mt-2 text-[10px] font-mono transition-all duration-500 ${step >= 6 ? "text-indigo-600 font-bold" : "text-gray-400"}`}>
            {step >= 1 && step <= 3 && <span>Dividing into base cases...</span>}
            {step >= 4 && step <= 5 && <span>Conquering... multiplying & adding</span>}
            {step >= 6 && <span>Complete: Full deterministic spectrum obtained</span>}
          </div>
        </div>

        {/* ─── QFT Panel ─── */}
        <div className={`bg-white rounded-lg border p-4 transition-all duration-500 ${step >= 8 ? "border-amber-300 shadow-md" : "border-gray-200"}`}>
          <div className="text-center mb-2">
            <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">Quantum QFT</span>
            <div className="text-[10px] text-gray-400 mt-0.5">Quantum Fourier Transform</div>
          </div>

          {/* Qubits */}
          <div className="flex flex-col items-center mb-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              {n} Qubits = 2³ ({N}) states
            </span>
            <div className="flex justify-center gap-3">
              {Array.from({ length: n }).map((_, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center transition-all duration-500 ${step >= 8 ? "opacity-100" : "opacity-30"}`}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 ${step >= 10
                      ? "border-amber-400 bg-amber-100 text-amber-800 shadow-md"
                      : step >= 8
                        ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm"
                        : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}
                    style={{
                      animation: step >= 8 && step < 10 ? "pulse 2s infinite" : "none",
                    }}
                  >
                    |q{i}⟩
                  </div>
                </div>
              ))}
            </div>
          </div>

          <QFTDepthVisualization
            activeLayer={qftActiveLayer}
            totalLayers={4}
            measured={qftMeasured}
          />

          {/* Probabilities vs Measurement */}
          <FrequencyBins
            activeBins={step >= 9 ? N : 0}
            measured={step >= 10 ? measuredBin : undefined}
            label={step >= 10 ? "Collapsed to ONE frequency!" : step >= 9 ? "Probability Amplitudes" : "Frequency Domain"}
          />

          <div className={`text-center mt-2 text-[10px] font-mono transition-all duration-500 ${step >= 10 ? "text-amber-600 font-bold" : "text-gray-400"}`}>
            {step === 8 && <span>Loading time domain amplitudes into q-state</span>}
            {step === 9 && <span>Building frequency PROBABILITY amplitudes</span>}
            {step >= 10 && <span>Measurement collapses superposition to a single index</span>}
          </div>
        </div>
      </div>



      {/* Step descriptions */}
      <div className="mt-4 bg-white p-4 rounded-lg border text-sm text-gray-600 text-center min-h-[4rem] flex items-center justify-center shadow-sm">
        {step === 0 && <p><strong>Input:</strong> 8 time-domain samples.</p>}
        {step === 1 && <p><strong>FFT — Divide:</strong> Exploiting sine/cosine symmetry, FFT splits the array into even-indexed and odd-indexed samples.</p>}
        {step === 2 && <p><strong>FFT — Divide:</strong> The recursive structure splits the smaller arrays again.</p>}
        {step === 3 && <p><strong>FFT — Base Cases:</strong> We reach 8 sub-problems of size 1 (which are trivial transforms of themselves).</p>}
        {step === 4 && <p><strong>FFT — Conquer (Pairs):</strong> We combine the 1-point results into 2-point arrays using <strong>Butterfly operations</strong> (multiply by a twiddle factor W and add/subtract).</p>}
        {step === 5 && <p><strong>FFT — Conquer (Quads):</strong> The 2-point arrays are combined into 4-point arrays using the same butterfly pattern with modified twiddle factors.</p>}
        {step === 6 && <p><strong>FFT — Conquer (Full):</strong> The final butterfly stage merges the results into the full 8-point frequency spectrum.</p>}
        {step === 7 && <p><strong>FFT Complete:</strong> All 8 complex amplitude bins are computed sequentially. The output is exactly the full Fourier Transform.</p>}
        {step === 8 && <p><strong>QFT — Initialization:</strong> The exact same 8 values are encoded as amplitudes of just 3 qubits in a superposition. The entire array exists simultaneously.</p>}
        {step === 9 && <p><strong>QFT — Processing:</strong> Quantum gates manipulate the phase of the qubits. Instead of explicit amplitude values, this shapes the <strong>probability amplitudes</strong> of measuring specific frequencies.</p>}
        {step === 10 && <p><strong>QFT — Measurement:</strong> By measuring, the quantum state <strong>collapses</strong>. We observe exactly ONE frequency, with outcomes distributed according to the probabilities. You do <strong>not</strong> get the amplitudes, only a random sample index!</p>}
        {step === 11 && <p><strong>At cryptographic scale (N = 2²⁵⁶):</strong> FFT needs ≈ 2²⁶⁴ operations — physically impossible. QFT needs only 65,536 gates to measure one sample frequency. While you only get one index per run, a few runs are enough to uncover the period in Shor{"'"}s algorithm.</p>}
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full flex gap-2">
        {Array.from({ length: maxSteps }).map((_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${step === s ? "bg-gray-600 shadow-sm" : "bg-gray-200 hover:bg-gray-300"
              }`}
          />
        ))}
      </div>
      <div className="mt-4 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}
