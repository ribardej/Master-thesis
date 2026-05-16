import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowRight } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

type Scenario = "valid" | "attack";

const VALID_STEPS = [
  "1. Your friend samples secret s and error e from the set of small polynomials.",
  "2. Your friend computes b = A·s + e and publishes ek = (A, b). The seed z is kept secret.",
  "3. You generate random message m and derive (K, R) = G(m, H(ek)).",
  "4. Using R as the deterministic seed, you compute ciphertext (c₁, c₂) via Kyber-PKE.",
  "5. You send ciphertext c = (c₁, c₂) to your friend. You already know the shared key K.",
  "6. Your friend decrypts c using secret key s: rounds c₂ - sᵀc₁ to recover m'.",
  "7. Your friend re-derives (K', R') = G(m', H(ek)) and re-encrypts m' → c'.",
  "8. c = c' - Your friend returns K' = K. Both parties share the same key!",
];

const ATTACK_STEPS = [
  "1. Your friend generates keys as before. ek = (A, b) is public, s and z are secret.",
  "2. Your friend publishes the encapsulation key ek = (A, b).",
  "3. Attacker crafts a malicious ciphertext c - NOT using small error polynomials from S_η.",
  "4. Attacker sends the crafted c to your friend, hoping to learn information about s.",
  "5. Your friend decrypts c using s → gets m. The large errors cause wrong decryption.",
  "6. Your friend re-derives (K, R) = G(m, H(ek)) and re-encrypts m → c'.",
  "7. c ≠ c' - the re-encrypted ciphertext doesn't match!",
  "8. Your friend returns K̄ = J(z, c) - a pseudorandom key. Attacker learns nothing about s.",
];

export function KyberKEMFlowAnimation() {
  const [speed] = useGlobalAnimationSpeed();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("valid");

  const steps = scenario === "valid" ? VALID_STEPS : ATTACK_STEPS;
  const maxSteps = steps.length;

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
      if (step < maxSteps - 1) { ev.preventDefault(); setStep((p) => p + 1); }
    };
    const handlePrev = (ev: Event) => {
      if (step > 0) { ev.preventDefault(); setStep((p) => p - 1); }
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

  const reset = () => { setStep(0); setIsPaused(false); };
  const switchScenario = (s: Scenario) => { setScenario(s); setStep(0); setIsPaused(false); };

  const isAttack = scenario === "attack";

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Top Controls */}
      <div className="flex flex-wrap w-full items-center justify-between mb-3 px-2 gap-2">
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
            <RotateCcw size={14} /> Restart
          </button>
          <div className="scale-90 origin-right">
            <AnimationSpeedControl baseTimeMs={5000} />
          </div>
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="flex w-full gap-1 mb-3 px-2">
        <button
          onClick={() => switchScenario("valid")}
          className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border ${!isAttack
            ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
        >
          Valid Protocol
        </button>
        <button
          onClick={() => switchScenario("attack")}
          className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border ${isAttack
            ? "bg-red-50 text-red-700 border-red-300 shadow-sm"
            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
        >
          Chosen Ciphertext Attack
        </button>
      </div>

      {/* Description */}
      <div className="h-8 flex items-center justify-center mb-3 px-2 w-full">
        <h3 className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r text-center ${isAttack ? "from-red-600 to-orange-600" : "from-blue-600 to-indigo-600"
          }`}>
          {steps[step]}
        </h3>
      </div>

      {/* Animation Grid */}
      <div className="flex w-full items-stretch justify-center gap-2 min-h-[400px] relative">

        {/* LEFT COLUMN: Your friend (key holder) */}
        <div className="flex-1 flex flex-col items-center bg-blue-50/50 border border-blue-200 rounded-xl p-3 z-10 w-[30%]">
          <div className="font-bold text-blue-700 text-base mb-3">Your friend</div>
          <div className="flex flex-col gap-2 w-full">

            {/* Secret key */}
            <Card show={step >= 0} border="border-2 border-red-200">
              <Label color="text-red-700">Secret key (private)</Label>
              <Mono>s ∈ S<sub>η<sub>1</sub></sub></Mono>
            </Card>

            {/* Error */}
            <Card show={step >= 0}>
              <Label>Error (small, discarded)</Label>
              <Mono>e ∈ S<sub>η<sub>2</sub></sub></Mono>
            </Card>

            {/* Compute b */}
            <Card show={step >= 1}>
              <Label>Compute public key</Label>
              <Mono size="sm">b = A · s + e</Mono>
              <Detail>Publish ek = (A, b)</Detail>
            </Card>

            {/* Rejection seed */}
            <Card show={step >= 1} border="border-2 border-red-200">
              <Label color="text-red-700">Random rejection seed (secret)</Label>
              <Mono size="sm">z ∈<sub>R</sub> {"{0,1}"}²⁵⁶</Mono>
            </Card>

            {/* Decryption */}
            <Card show={step >= 5} border={isAttack ? "border-orange-200" : "border-green-200"}>
              <Label color={isAttack ? "text-orange-700" : "text-green-700"}>Decrypt</Label>
              <Mono size="sm">{isAttack ? "c₂ − sᵀc₁" : "c₂ − sᵀc₁"}</Mono>
              <Detail>{isAttack ? "= garbled (large errors!)" : "= ⌈q/2⌋·m + small noise"}</Detail>
              <Mono size="sm" bold color={isAttack ? "text-orange-700" : "text-green-700"}>
                Round → {isAttack ? "m" : "m'"}
              </Mono>
            </Card>

            {/* FO Transform */}
            <Card show={step >= 6} border={isAttack ? "border-orange-200" : "border-amber-200"}>
              <Label color={isAttack ? "text-orange-700" : "text-amber-700"}>FO Transform</Label>
              <Detail>{isAttack ? "(K, R) = G(m, H(ek))" : "(K', R') = G(m', H(ek))"}</Detail>
              <Detail>{isAttack ? "c' = Enc(ek, m; R)" : "c' = Enc(ek, m'; R')"}</Detail>
              <Detail>K̄ = J(z, {isAttack ? "c" : "c"})</Detail>
            </Card>

            {/* Result */}
            {!isAttack && (
              <div className={`transition-all duration-500 w-full flex justify-center ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg border-2 border-green-400 font-bold font-mono text-xs shadow-inner">
                  c = c' → return K'
                </div>
              </div>
            )}
            {isAttack && step >= 7 && (
              <div className={`transition-all duration-500 w-full flex flex-col items-center gap-1.5 ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-lg border-2 border-red-400 font-bold font-mono text-xs shadow-inner">
                  c ≠ c'
                </div>
                <div className={`transition-all duration-500 ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg border-2 border-amber-400 font-bold font-mono text-xs shadow-inner">
                    return K̄ = J(z, c)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PUBLIC CHANNEL COLUMN */}
        <div className="flex-1 flex flex-col items-center bg-gray-50 border-x border-gray-200 px-2 py-3 relative w-[40%]">
          <div className="font-bold text-gray-600 text-sm mb-3">Public Channel</div>



          {/* Encapsulation Key */}
          <div className={`transition-opacity duration-500 bg-white border border-blue-300 shadow-sm rounded px-3 py-2 flex flex-col items-center w-full max-w-[180px] mt-2 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
            <span className="text-[10px] uppercase font-bold text-blue-600 border-b border-gray-100 pb-1 mb-1 w-full text-center">Your friend's Encapsulation Key</span>
            <span className="font-mono text-xs font-bold text-blue-800">ek = (A, b)</span>
          </div>

          {/* Flying Cipher */}
          <div className="flex-1 w-full flex flex-col justify-center relative min-h-[100px]">
            {!isAttack ? (
              /* Valid: cipher flies right-to-left (You → Your friend) */
              <div className={`absolute left-0 right-0 flex flex-col items-center gap-1 transition-all duration-700 ease-in-out ${step === 4 ? "top-1/4 opacity-100" : step > 4 ? "top-1/4 opacity-0 scale-90 -translate-x-5" : "top-0 opacity-0 translate-x-5"
                }`}>
                <div className="bg-purple-100 border border-purple-300 text-purple-800 px-3 py-1.5 rounded-full shadow-md font-mono text-xs flex items-center gap-2 font-bold z-20">
                  <ArrowRight size={12} className="text-gray-400 rotate-180" />
                  (c₁, c₂)
                  <ArrowRight size={12} className="text-gray-400 rotate-180" />
                </div>
              </div>
            ) : (
              /* Attack: Eve's cipher flies right-to-left */
              <div className={`absolute left-0 right-0 flex flex-col items-center gap-1 transition-all duration-700 ease-in-out ${step === 3 ? "top-1/4 opacity-100" : step > 3 ? "top-1/4 opacity-0 scale-90 -translate-x-5" : "top-0 opacity-0 translate-x-5"
                }`}>
                <div className="bg-red-100 border border-red-400 text-red-800 px-3 py-1.5 rounded-full shadow-md font-mono text-xs flex items-center gap-2 font-bold z-20">
                  <ArrowRight size={12} className="text-red-400 rotate-180" />
                  c
                  <ArrowRight size={12} className="text-red-400 rotate-180" />
                </div>
              </div>
            )}

            {/* Shared key */}
            {!isAttack && (
              <div className={`absolute left-0 right-0 bottom-2 flex justify-center transition-all duration-500 ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg px-3 py-2 text-center shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-emerald-600 block">Shared Key</span>
                  <span className="font-mono text-xs font-bold text-emerald-800">K</span>
                </div>
              </div>
            )}

            {/* Attack: no shared key, just rejection */}
            {isAttack && (
              <div className={`absolute left-0 right-0 bottom-2 flex justify-center transition-all duration-500 ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg px-3 py-2 text-center shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-red-600 block">No shared key</span>
                  <span className="font-mono text-[10px] text-red-700">Attacker learns nothing about s</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: You (encapsulator) / Eve (attacker) */}
        <div className={`flex-1 flex flex-col items-center rounded-xl p-3 z-10 w-[30%] ${isAttack ? "bg-red-50/50 border border-red-200" : "bg-pink-50/50 border border-pink-200"
          }`}>
          <div className={`font-bold text-base mb-3 ${isAttack ? "text-red-700" : "text-pink-700"}`}>
            {isAttack ? "Attacker" : "You"}
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            {!isAttack ? (
              /* ── Valid scenario: You encapsulate ── */
              <>
                {/* Message */}
                <Card show={step >= 2} border="border-pink-100">
                  <Label>Random message</Label>
                  <Mono bold>m ∈<sub>R</sub> {"{0,1}"}²⁵⁶</Mono>
                </Card>

                {/* Derive K, R */}
                <Card show={step >= 2} border="border-indigo-200">
                  <Label color="text-indigo-700">Derive key & seed</Label>
                  <Mono size="sm">(K, R) = G(m, H(ek))</Mono>
                  <Detail>K is the shared secret</Detail>
                  <Detail>R seeds the encryption</Detail>
                </Card>

                {/* Encrypt */}
                <Card show={step >= 3} border="border-pink-100">
                  <Label>Encrypt (deterministic)</Label>
                  <Mono size="sm" bold color="text-blue-700">c₁ = A<sup>T</sup>r + e₁</Mono>
                  <Mono size="sm" bold color="text-blue-700">c₂ = b<sup>T</sup>r + e₂ + ⌈q/2⌋·m</Mono>
                  <Detail>r, e₁, e₂ derived from seed R</Detail>
                </Card>

                {/* Your key */}
                <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg border-2 border-indigo-300 font-bold font-mono text-xs shadow-inner mt-1">
                    Shared key: K
                  </div>
                </div>
              </>
            ) : (
              /* ── Attack scenario: Eve crafts ciphertext ── */
              <>
                <Card show={step >= 2} border="border-red-200">
                  <Label color="text-red-700">Attacker's goal</Label>
                  <Detail>Learn information about s</Detail>
                  <Detail>by observing decryption behavior</Detail>
                </Card>

                <Card show={step >= 2} border="border-red-200">
                  <Label color="text-red-700">Craft malicious ciphertext</Label>
                  <Mono size="sm" bold color="text-red-700">c₁ ← arbitrary polynomial</Mono>
                  <Mono size="sm" bold color="text-red-700">c₂ ← arbitrary polynomial</Mono>
                  <Detail>NOT using small errors from S<sub>η<sub>1</sub></sub>, S<sub>η<sub>2</sub></sub></Detail>
                </Card>

                <Card show={step >= 3} border="border-red-300">
                  <Label color="text-red-700">Send crafted c</Label>
                  <Detail>Attacker sends c = (c₁, c₂)</Detail>
                  <Detail>to your friend</Detail>
                </Card>

                {/* Attack result */}
                <div className={`transition-all duration-500 w-full mt-auto flex justify-center ${step >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                  <div className="bg-red-100 text-red-800 px-3 py-1.5 rounded-lg border-2 border-red-400 font-bold font-mono text-xs shadow-inner">
                    Attack failed! K̄ is random.
                  </div>
                </div>
              </>
            )}
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
              className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${step === s
                ? isAttack ? "bg-red-500 shadow-sm" : "bg-blue-600 shadow-sm"
                : s < step
                  ? isAttack ? "bg-red-200 hover:bg-red-300" : "bg-indigo-300 hover:bg-indigo-400"
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
    <div className={`transition-all duration-500 w-full bg-white p-2 rounded shadow-sm flex flex-col items-center ${border || "border border-gray-100"} ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
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
