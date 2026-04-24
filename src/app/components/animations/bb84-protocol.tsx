import React, { useState, useEffect, useMemo, useCallback } from "react";
import { RefreshCw, Pause, Play, ArrowUp, ArrowRight, ArrowUpRight, ArrowDownRight, Check, X } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

// Types
type Basis = "rectilinear" | "diagonal";
type Bit = 0 | 1;

interface PhotonData {
  aliceBit: Bit;
  aliceBasis: Basis;
  bobBasis: Basis;
  bobBit: Bit;
  match: boolean;
}

// Helper to get polarization arrow icon and label
function getPolarization(bit: Bit, basis: Basis) {
  if (basis === "rectilinear") {
    return bit === 0
      ? { icon: ArrowUp, label: "↑", angle: 0, name: "Vertical" }
      : { icon: ArrowRight, label: "→", angle: 90, name: "Horizontal" };
  } else {
    return bit === 0
      ? { icon: ArrowUpRight, label: "↗", angle: 45, name: "45°" }
      : { icon: ArrowDownRight, label: "↘", angle: 135, name: "135°" };
  }
}

function basisSymbol(basis: Basis) {
  return basis === "rectilinear" ? "⊕" : "⊗";
}

// Generate a random BB84 exchange
function generateExchange(numPhotons: number): PhotonData[] {
  const data: PhotonData[] = [];
  for (let i = 0; i < numPhotons; i++) {
    const aliceBit: Bit = Math.random() < 0.5 ? 0 : 1;
    const aliceBasis: Basis = Math.random() < 0.5 ? "rectilinear" : "diagonal";
    const bobBasis: Basis = Math.random() < 0.5 ? "rectilinear" : "diagonal";
    const match = aliceBasis === bobBasis;
    const bobBit: Bit = match ? aliceBit : (Math.random() < 0.5 ? 0 : 1);
    data.push({ aliceBit, aliceBasis, bobBasis, bobBit, match });
  }
  // Ensure at least 2 matches and 1 mismatch for pedagogical value
  const matches = data.filter(d => d.match).length;
  const mismatches = data.filter(d => !d.match).length;
  if (matches < 2 || mismatches < 1) {
    return generateExchange(numPhotons);
  }
  return data;
}

const NUM_PHOTONS = 8;

// Steps:
// 0 = Alice generates random bits
// 1 = Alice chooses random bases
// 2 = Alice encodes photons (shows polarization)
// 3 = Photons travel to Bob (animation)
// 4 = Bob chooses random bases
// 5 = Bob measures photons
// 6 = Basis comparison (sifting)
// 7 = Key extraction
const MAX_STEPS = 8;

const STEP_DESCRIPTIONS = [
  "Step 1: Alice generates a random string of classical bits (0 or 1) for each photon she will send.",
  "Step 2: For each bit, Alice randomly selects a measurement basis — Rectilinear (⊕) or Diagonal (⊗).",
  "Step 3: Alice encodes each bit as a polarized photon according to her chosen basis.",
  "Step 4: Alice transmits the polarized photons to Bob through the quantum channel.",
  "Step 5: Bob independently and randomly selects a basis (⊕ or ⊗) for each incoming photon.",
  "Step 6: Bob measures each photon using his chosen basis. When bases match, the result is deterministic. When they differ, the result is random.",
  "Step 7: Alice and Bob publicly compare only which bases they used (not bit values). Matching-basis bits are kept.",
  "Step 8: The bits where both bases matched form the Sifted Key — identical for both Alice and Bob.",
];

export function BB84ProtocolAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed] = useGlobalAnimationSpeed();
  const [exchangeData, setExchangeData] = useState<PhotonData[]>(() => generateExchange(NUM_PHOTONS));

  const siftedKey = useMemo(
    () => exchangeData.filter((d) => d.match).map((d) => d.aliceBit),
    [exchangeData]
  );

  const regenerate = useCallback(() => {
    setExchangeData(generateExchange(NUM_PHOTONS));
    setStep(0);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % MAX_STEPS);
    }, 4000 / speed);
    return () => clearTimeout(timer);
  }, [isPaused, speed, step]);

  useEffect(() => {
    const handleNext = (e: Event) => {
      if (step < MAX_STEPS - 1) {
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
  }, [step]);

  const togglePause = () => {
    if (isPaused) {
      setStep((prev) => (prev + 1) % MAX_STEPS);
    }
    setIsPaused(!isPaused);
  };

  // Photon travel animation timing
  const travelDuration = 4 / speed;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl border border-gray-200 my-8 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-gray-800 m-0 pt-1">BB84 Quantum Key Distribution</h3>
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
              onClick={regenerate}
              className="flex-1 flex justify-center items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
            >
              <RefreshCw size={14} />
              New
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={4000} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-block"></span> Rectilinear (⊕)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-300 inline-block"></span> Diagonal (⊗)</span>
        <span className="flex items-center gap-1"><Check size={12} className="text-green-600" /> Bases match</span>
        <span className="flex items-center gap-1"><X size={12} className="text-red-500" /> Bases differ</span>
      </div>

      {/* Main table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-2 py-2 text-left text-gray-600 font-semibold w-36">Photon #</th>
              {exchangeData.map((_, idx) => (
                <th key={idx} className="px-2 py-2 text-center text-gray-600 font-medium w-14">
                  {idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Alice's Random Bit */}
            <tr className="border-b border-gray-200 bg-green-50/30">
              <td className="px-2 py-2 font-medium text-green-800 text-xs">Alice&apos;s Bit</td>
              {exchangeData.map((d, idx) => (
                <td key={idx} className="px-2 py-2 text-center">
                  {step >= 0 ? (
                    <span className={`font-mono font-bold text-base transition-all duration-500 ${step === 0 ? "text-green-700 scale-110" : "text-green-700"}`}>
                      {d.aliceBit}
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>

            {/* Alice's Basis */}
            <tr className="border-b border-gray-200 bg-green-50/30">
              <td className="px-2 py-2 font-medium text-green-800 text-xs">Alice&apos;s Basis</td>
              {exchangeData.map((d, idx) => (
                <td key={idx} className="px-2 py-2 text-center">
                  {step >= 1 ? (
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-bold transition-all duration-500 ${
                      d.aliceBasis === "rectilinear"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-purple-100 text-purple-700 border border-purple-300"
                    } ${step === 1 ? "scale-110 shadow-md" : ""}`}>
                      {basisSymbol(d.aliceBasis)}
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>

            {/* Polarization Sent */}
            <tr className="border-b border-gray-200 bg-green-50/30">
              <td className="px-2 py-2 font-medium text-green-800 text-xs">Photon Sent</td>
              {exchangeData.map((d, idx) => {
                const pol = getPolarization(d.aliceBit, d.aliceBasis);
                return (
                  <td key={idx} className="px-2 py-2 text-center">
                    {step >= 2 ? (
                      <div className={`flex flex-col items-center transition-all duration-500 ${step === 2 || step === 3 ? "scale-110" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          d.aliceBasis === "rectilinear"
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-purple-50 border border-purple-200"
                        } ${step === 3 ? "animate-pulse" : ""}`}>
                          <pol.icon size={16} className={`${
                            d.aliceBasis === "rectilinear" ? "text-blue-600" : "text-purple-600"
                          }`} />
                        </div>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>

            {/* Divider - quantum channel */}
            <tr className="h-8">
              <td className="px-2 py-1 text-xs text-gray-400 italic" colSpan={NUM_PHOTONS + 1}>
                {step >= 3 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                    <span className="text-amber-600 font-medium">
                      {step === 3 ? "⚡ Quantum Channel ⚡" : "Quantum Channel"}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                )}
              </td>
            </tr>

            {/* Bob's Basis */}
            <tr className="border-b border-gray-200 bg-sky-50/30">
              <td className="px-2 py-2 font-medium text-sky-800 text-xs">Bob&apos;s Basis</td>
              {exchangeData.map((d, idx) => (
                <td key={idx} className="px-2 py-2 text-center">
                  {step >= 4 ? (
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-bold transition-all duration-500 ${
                      d.bobBasis === "rectilinear"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-purple-100 text-purple-700 border border-purple-300"
                    } ${step === 4 ? "scale-110 shadow-md" : ""}`}>
                      {basisSymbol(d.bobBasis)}
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>

            {/* Bob's Measurement */}
            <tr className="border-b border-gray-200 bg-sky-50/30">
              <td className="px-2 py-2 font-medium text-sky-800 text-xs">Bob&apos;s Result</td>
              {exchangeData.map((d, idx) => {
                const pol = getPolarization(d.bobBit, d.bobBasis);
                return (
                  <td key={idx} className="px-2 py-2 text-center">
                    {step >= 5 ? (
                      <div className={`flex flex-col items-center transition-all duration-500 ${step === 5 ? "scale-110" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          d.bobBasis === "rectilinear"
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-purple-50 border border-purple-200"
                        }`}>
                          <pol.icon size={16} className={`${
                            d.bobBasis === "rectilinear" ? "text-blue-600" : "text-purple-600"
                          }`} />
                        </div>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>

            {/* Bob's Bit */}
            <tr className="border-b border-gray-200 bg-sky-50/30">
              <td className="px-2 py-2 font-medium text-sky-800 text-xs">Bob&apos;s Bit</td>
              {exchangeData.map((d, idx) => (
                <td key={idx} className="px-2 py-2 text-center">
                  {step >= 5 ? (
                    <span className={`font-mono font-bold text-base transition-all duration-500 ${step === 5 ? "text-sky-700 scale-110" : "text-sky-700"}`}>
                      {d.bobBit}
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>

            {/* Divider - classical channel */}
            <tr className="h-8">
              <td className="px-2 py-1 text-xs text-gray-400 italic" colSpan={NUM_PHOTONS + 1}>
                {step >= 6 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
                    <span className="text-indigo-600 font-medium">📡 Public Classical Channel</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                )}
              </td>
            </tr>

            {/* Bases Match? */}
            <tr className="border-b border-gray-200">
              <td className="px-2 py-2 font-semibold text-gray-700 text-xs">Bases Match?</td>
              {exchangeData.map((d, idx) => (
                <td key={idx} className="px-2 py-2 text-center">
                  {step >= 6 ? (
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ${
                      d.match
                        ? "bg-green-100 text-green-700 border-2 border-green-400"
                        : "bg-red-50 text-red-400 border border-red-200"
                    } ${step === 6 ? "scale-110 shadow-md" : ""}`}>
                      {d.match ? <Check size={16} strokeWidth={3} /> : <X size={16} />}
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>

            {/* Final Sifted Key */}
            <tr className="bg-amber-50/50">
              <td className="px-2 py-3 font-bold text-amber-800 text-xs">Sifted Key</td>
              {exchangeData.map((d, idx) => (
                <td key={idx} className="px-2 py-3 text-center">
                  {step >= 7 ? (
                    d.match ? (
                      <span className="font-mono font-bold text-lg text-amber-700 bg-amber-100 w-8 h-8 inline-flex items-center justify-center rounded border-2 border-amber-400 shadow-sm transition-all duration-500 scale-110">
                        {d.aliceBit}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-lg">—</span>
                    )
                  ) : null}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sifted key result */}
      {step >= 7 && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="text-amber-800 font-semibold text-sm">Shared Key:</span>
          <div className="flex gap-1">
            {siftedKey.map((bit, idx) => (
              <span key={idx} className="font-mono font-bold text-lg text-amber-800 bg-white w-8 h-8 inline-flex items-center justify-center rounded border border-amber-300 shadow-sm">
                {bit}
              </span>
            ))}
          </div>
          <span className="text-amber-600 text-xs ml-auto">({siftedKey.length} bits from {NUM_PHOTONS} photons)</span>
        </div>
      )}

      {/* Step description */}
      <div className="mt-4 bg-white p-4 rounded-lg border text-sm text-gray-600 text-center min-h-[3.5rem] flex items-center justify-center shadow-sm">
        <p>{STEP_DESCRIPTIONS[step]}</p>
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full flex gap-2">
        {Array.from({ length: MAX_STEPS }, (_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              step === s ? "bg-gray-600 shadow-sm" : "bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="mt-4 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {MAX_STEPS}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}
