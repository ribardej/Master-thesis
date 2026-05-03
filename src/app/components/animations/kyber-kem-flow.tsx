import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowRight } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function KyberKEMFlowAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const maxSteps = 9;

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
    const handleNext = (ev: Event) => {
      if (step < maxSteps - 1) {
        ev.preventDefault();
        setStep((prev) => prev + 1);
      }
    };
    const handlePrev = (ev: Event) => {
      if (step > 0) {
        ev.preventDefault();
        setStep((prev) => prev - 1);
      }
    };
    const handleSpace = (ev: Event) => {
      ev.preventDefault();
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
      case 0: return "1. Key Gen: Alice samples secret s and small error e from the set of small polynomials S_η.";
      case 1: return "2. Key Gen: Alice computes public key t = A·s + e and publishes (A, t). She keeps s secret.";
      case 2: return "3. Encapsulate: Bob generates random message m and samples randomness r, e₁, e₂ from S_η.";
      case 3: return "4. Encapsulate: Bob computes ciphertext c₁ = Aᵀr + e₁  and  c₂ = tᵀr + e₂ + ⌈q/2⌋·m.";
      case 4: return "5. Transmission: Bob sends ciphertext (c₁, c₂) to Alice and derives shared key K = G(m, H(ek)).";
      case 5: return "6. Decapsulate: Alice computes c₂ − sᵀc₁ = ⌈q/2⌋·m + small error, and rounds to recover m'.";
      case 6: return "7. FO Transform: Alice re-derives (K', R') = G(m', H(ek)) and re-encrypts m' to produce c'.";
      case 7: return "8. Valid: c = c' ✓ → Alice returns K'. Both parties now share the same key K.";
      case 8: return "9. Rejection: If c ≠ c', Alice returns K̄ = J(z, c) — a pseudorandom key. Attacker learns nothing.";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Top Controls Row */}
      <div className="flex flex-wrap w-full items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 m-0">Kyber-KEM Protocol</h3>
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
      <div className="flex w-full items-stretch justify-center gap-2 min-h-[380px] relative">

        {/* ALICE COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-pink-50/50 border border-pink-200 rounded-xl p-3 z-10 w-[30%]">
          <div className="font-bold text-pink-700 text-base mb-3">Alice</div>

          <div className="flex flex-col gap-2.5 w-full">
            {/* Secret key */}
            <Card show={step >= 0} border="border-2 border-red-200">
              <Label color="text-red-700">Secret Key (private)</Label>
              <Mono>s ∈ S<sub>η</sub></Mono>
            </Card>

            {/* Error */}
            <Card show={step >= 0}>
              <Label>Error (small, discarded)</Label>
              <Mono>e ∈ S<sub>η</sub></Mono>
            </Card>

            {/* Compute t */}
            <Card show={step >= 1}>
              <Label>Compute public key</Label>
              <Mono size="sm">t = A · s + e</Mono>
              <Detail>Publish ek = (A, t)</Detail>
            </Card>

            {/* Decryption */}
            <Card show={step >= 5} border="border-green-200">
              <Label color="text-green-700">Decrypt</Label>
              <Mono size="sm">c₂ − s<sup>T</sup>c₁</Mono>
              <Detail>= ⌈q/2⌋·m + <em>small noise</em></Detail>
              <Mono size="sm" bold color="text-green-700">Round → m'</Mono>
            </Card>

            {/* FO Transform */}
            <Card show={step >= 6} border="border-amber-200">
              <Label color="text-amber-700">FO Transform</Label>
              <Detail>(K', R') = G(m', H(ek))</Detail>
              <Detail>c' = Enc(ek, m'; R')</Detail>
              <Detail>K̄ = J(z, c)</Detail>
            </Card>

            {/* Valid result */}
            <div className={`transition-all duration-500 w-full flex justify-center ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
              <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg border-2 border-green-400 font-bold font-mono text-xs shadow-inner">
                c = c' → return K'
              </div>
            </div>

            {/* Rejection result */}
            <div className={`transition-all duration-500 w-full flex justify-center ${step >= 8 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
              <div className="bg-red-100 text-red-800 px-3 py-1.5 rounded-lg border-2 border-red-400 font-bold font-mono text-xs shadow-inner">
                c ≠ c' → return K̄
              </div>
            </div>
          </div>
        </div>

        {/* PUBLIC CHANNEL COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-gray-50 border-x border-gray-200 px-2 py-3 relative w-[40%]">
          <div className="font-bold text-gray-600 text-sm mb-3">Public Channel</div>

          {/* Public parameter A */}
          <div className={`transition-opacity duration-500 bg-white border border-gray-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[180px] ${step >= 0 ? "opacity-100" : "opacity-0"}`}>
            <span className="text-[9px] uppercase font-bold text-gray-500 border-b border-gray-100 pb-1 mb-1 w-full text-center">Public Parameter</span>
            <span className="font-mono text-xs font-bold text-gray-700">A ∈ R<sub>q</sub><sup>k×k</sup></span>
          </div>

          {/* Public Key */}
          <div className={`transition-opacity duration-500 bg-white border border-blue-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[180px] mt-2 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
            <span className="text-[10px] uppercase font-bold text-blue-600 border-b border-gray-100 pb-1 mb-1 w-full text-center">Alice's Public Key</span>
            <span className="font-mono text-xs font-bold text-blue-800">ek = (A, t)</span>
          </div>

          {/* Flying Cipher */}
          <div className="flex-1 w-full flex flex-col justify-center relative min-h-[100px]">
            <div className={`absolute left-0 right-0 flex flex-col items-center gap-1 transition-all duration-700 ease-in-out ${step === 4 ? "top-1/4 opacity-100" : step > 4 ? "top-1/4 opacity-0 scale-90 -translate-x-5" : "top-0 opacity-0 translate-x-5"}`}>
              <div className="bg-purple-100 border border-purple-300 text-purple-800 px-3 py-1.5 rounded-full shadow-md font-mono text-xs flex items-center gap-2 font-bold z-20">
                <ArrowRight size={12} className="text-gray-400 rotate-180" />
                (c₁, c₂)
                <ArrowRight size={12} className="text-gray-400 rotate-180" />
              </div>
            </div>

            {/* Shared key */}
            <div className={`absolute left-0 right-0 bottom-2 flex justify-center transition-all duration-500 ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg px-3 py-2 text-center shadow-sm">
                <span className="text-[9px] uppercase font-bold text-emerald-600 block">Shared Key</span>
                <span className="font-mono text-xs font-bold text-emerald-800">K</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOB COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-blue-50/50 border border-blue-200 rounded-xl p-3 z-10 w-[30%]">
          <div className="font-bold text-blue-700 text-base mb-3">Bob</div>

          <div className="flex flex-col gap-2.5 w-full">
            {/* Message */}
            <Card show={step >= 2} border="border-blue-100">
              <Label>Random message</Label>
              <Mono bold>m ∈<sub>R</sub> {"{0,1}"}²⁵⁶</Mono>
            </Card>

            {/* Randomness */}
            <Card show={step >= 2} border="border-blue-100">
              <Label>Sample randomness</Label>
              <Mono size="sm">r, e₁, e₂ ∈ S<sub>η</sub></Mono>
            </Card>

            {/* Compute c₁ */}
            <Card show={step >= 3} border="border-blue-100">
              <Label>Encrypt c₁</Label>
              <Mono size="sm" bold color="text-blue-700">c₁ = A<sup>T</sup>r + e₁</Mono>
            </Card>

            {/* Compute c₂ */}
            <Card show={step >= 3} border="border-blue-100">
              <Label>Encrypt c₂</Label>
              <Mono size="sm" bold color="text-blue-700">c₂ = t<sup>T</sup>r + e₂ + ⌈q/2⌋·m</Mono>
            </Card>

            {/* Derive K */}
            <Card show={step >= 4} border="border-indigo-200">
              <Label color="text-indigo-700">Derive shared key</Label>
              <Mono size="sm">(K, R) = G(m, H(ek))</Mono>
              <Detail>K is the shared secret</Detail>
              <Detail>R seeds the encryption</Detail>
            </Card>

            {/* Bob's key */}
            <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg border-2 border-indigo-300 font-bold font-mono text-xs shadow-inner mt-1">
                Shared key: K
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tiles */}
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
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}

/* ── Shared helper components ── */

function Card({ show, border, children }: { show: boolean; border?: string; children: React.ReactNode }) {
  return (
    <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm flex flex-col items-center ${border || "border border-pink-100"} ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
      {children}
    </div>
  );
}

function Label({ children, color }: { children: React.ReactNode; color?: string }) {
  return <span className={`text-[9px] uppercase font-bold ${color || "text-gray-500"}`}>{children}</span>;
}

function Mono({ children, size, bold, color }: { children: React.ReactNode; size?: "sm" | "xs"; bold?: boolean; color?: string }) {
  const sz = size === "xs" ? "text-[10px]" : size === "sm" ? "text-xs" : "text-sm";
  return <span className={`font-mono ${sz} ${bold ? "font-semibold" : ""} ${color || "text-gray-700"}`}>{children}</span>;
}

function Detail({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] text-gray-500 font-mono">{children}</span>;
}
