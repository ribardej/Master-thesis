import React, { useState, useEffect } from "react";
import { User, Shield, KeyRound, Lock, Hash, CheckCircle2, XCircle, RefreshCw, Pause, Play, Send } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function KyberKEMFlowAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed] = useGlobalAnimationSpeed();
  const maxSteps = 10;

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 5000 / speed);
    return () => clearTimeout(timer);
  }, [isPaused, speed, step]);

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
  }, [step]);

  const reset = () => {
    setStep(0);
    setIsPaused(true);
  };

  const togglePause = () => {
    if (isPaused) {
      setStep((prev) => (prev + 1) % maxSteps);
    }
    setIsPaused(!isPaused);
  };

  const descriptions: Record<number, React.ReactNode> = {
    0: <p><strong>Key Generation:</strong> Alice runs <strong>K-PKE.KeyGen</strong> to create a Kyber-PKE encryption key (A, t) and a decryption key s.</p>,
    1: <p><strong>Key Generation:</strong> Alice samples a random <strong>z ∈ &#123;0,1&#125;²⁵⁶</strong> for implicit rejection and assembles the decapsulation key dk = (s, ek, H(ek), z).</p>,
    2: <p><strong>Encapsulation:</strong> Bob obtains Alice&apos;s encapsulation key <strong>ek = (A, t)</strong> and generates a random message <strong>m ∈ &#123;0,1&#125;²⁵⁶</strong>.</p>,
    3: <p><strong>Encapsulation:</strong> Bob computes <strong>(K, R) = G(m, H(ek))</strong>. K is the shared key; R is the deterministic seed for encryption — this makes the process <strong>reproducible</strong>.</p>,
    4: <p><strong>Encapsulation:</strong> Bob encrypts m using K-PKE.Enc with the deterministic seed R. The ciphertext c is sent to Alice along with output key K.</p>,
    5: <p><strong>Decapsulation:</strong> Alice decrypts the ciphertext c using her private key s to recover <strong>m&apos;</strong>.</p>,
    6: <p><strong>Decapsulation:</strong> Alice computes <strong>(K&apos;, R&apos;) = G(m&apos;, H(ek))</strong> and a rejection key <strong>K̄ = J(z, c)</strong>.</p>,
    7: <p><strong>Re-encryption Check:</strong> Alice re-encrypts m&apos; using R&apos; to produce c&apos;. She then compares <strong>c vs c&apos;</strong> to verify authenticity.</p>,
    8: <p><strong>Valid Ciphertext (c = c&apos;):</strong> The re-encryption matches! Alice returns <strong>K&apos;</strong> — the legitimate shared secret. Both parties now share K.</p>,
    9: <p><strong>Invalid Ciphertext (c ≠ c&apos;):</strong> If re-encryption doesn&apos;t match, the ciphertext was tampered with. Alice returns <strong>K̄ = J(z, c)</strong> — a pseudorandom rejection key that reveals nothing about s.</p>,
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-5 bg-gray-50 rounded-xl border border-gray-200 my-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 m-0">Kyber-KEM Protocol Flow</h3>
          <p className="text-xs text-gray-500 mt-0.5">Fujisaki-Okamoto transform: K-PKE → ML-KEM</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              onClick={togglePause}
              className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors bg-white px-2.5 py-1 rounded-md border shadow-sm cursor-pointer"
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              {isPaused ? "Play" : "Pause"}
            </button>
            <button
              onClick={reset}
              className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors bg-white px-2.5 py-1 rounded-md border shadow-sm cursor-pointer"
            >
              <RefreshCw size={12} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={5000} />
        </div>
      </div>

      {/* Protocol diagram */}
      <div className="relative">
        {/* Alice and Bob headers */}
        <div className="flex justify-between mb-3">
          <div className="flex items-center gap-2 w-36">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-500 ${
              step >= 8 ? "bg-emerald-100 border-emerald-300" : "bg-pink-100 border-pink-300"
            }`}>
              <User size={18} className={step >= 8 ? "text-emerald-600" : "text-pink-600"} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-xs">Alice</p>
              <p className="text-[10px] text-gray-500">Key owner</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-36 justify-end">
            <div>
              <p className="font-bold text-gray-800 text-xs text-right">Bob</p>
              <p className="text-[10px] text-gray-500 text-right">Sender</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-500 ${
              step >= 8 ? "bg-emerald-100 border-emerald-300" : "bg-blue-100 border-blue-300"
            }`}>
              <User size={18} className={step >= 8 ? "text-emerald-600" : "text-blue-600"} />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mx-5">
          <div className="absolute left-[68px] top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="absolute right-[68px] top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="flex flex-col gap-1 py-2">

            {/* Phase: KEY GENERATION */}
            <PhaseLabel text="KEY GENERATION" active={step <= 1} />

            {/* Step 0: K-PKE.KeyGen */}
            <ActionRow
              active={step === 0}
              done={step > 0}
              side="left"
              label="K-PKE.KeyGen"
              icon={<KeyRound size={11} />}
              details="Generate (A, t) and s"
              color="pink"
            />

            {/* Step 1: Assemble dk */}
            <ActionRow
              active={step === 1}
              done={step > 1}
              side="left"
              label="Assemble Keys"
              icon={<Shield size={11} />}
              details="ek = (A,t), dk = (s, ek, H(ek), z)"
              color="pink"
            />

            {/* Phase: ENCAPSULATION */}
            <PhaseLabel text="ENCAPSULATION" active={step >= 2 && step <= 4} />

            {/* Step 2: Bob gets ek, generates m */}
            <ActionRow
              active={step === 2}
              done={step > 2}
              side="right"
              label="Sample m"
              icon={<Hash size={11} />}
              details="m ∈ᵣ {0,1}²⁵⁶"
              color="blue"
            />

            {/* Step 3: Derive K, R */}
            <ActionRow
              active={step === 3}
              done={step > 3}
              side="right"
              label="Hash"
              icon={<Hash size={11} />}
              details="(K, R) = G(m, H(ek))"
              color="blue"
            />

            {/* Step 4: Encrypt + send */}
            <MessageRow
              active={step === 4}
              done={step > 4}
              direction="left"
              label="Ciphertext c"
              icon={<Send size={11} className="rotate-180" />}
              details="c = K-PKE.Enc(ek, m; R)"
              color="indigo"
            />

            {/* Phase: DECAPSULATION */}
            <PhaseLabel text="DECAPSULATION" active={step >= 5 && step <= 9} />

            {/* Step 5: Decrypt */}
            <ActionRow
              active={step === 5}
              done={step > 5}
              side="left"
              label="Decrypt"
              icon={<Lock size={11} />}
              details="m' = K-PKE.Dec(s, c)"
              color="pink"
            />

            {/* Step 6: Re-derive */}
            <ActionRow
              active={step === 6}
              done={step > 6}
              side="left"
              label="Re-derive"
              icon={<Hash size={11} />}
              details="(K', R') = G(m', H(ek)),  K̄ = J(z, c)"
              color="pink"
            />

            {/* Step 7: Re-encrypt and compare */}
            <ActionRow
              active={step === 7}
              done={step > 7}
              side="left"
              label="Re-encrypt"
              icon={<Shield size={11} />}
              details="c' = K-PKE.Enc(ek, m'; R')  →  c =? c'"
              color="amber"
            />

            {/* Step 8: Accept - c == c' */}
            <div className={`flex items-center justify-center py-1 transition-all duration-500 ${step >= 8 ? "opacity-100" : "opacity-20"} ${step === 8 ? "scale-[1.02]" : ""}`}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all duration-500 ${
                step === 8 ? "bg-emerald-50 border-emerald-400 shadow-md" : step > 8 ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
              }`}>
                <CheckCircle2 size={14} className="text-emerald-600" />
                <div className="text-[10px]">
                  <span className="font-bold text-emerald-800">c = c&apos; → return K&apos;</span>
                  <span className="text-emerald-600 ml-2">Both parties share the key K</span>
                </div>
              </div>
            </div>

            {/* Step 9: Reject - c != c' */}
            <div className={`flex items-center justify-center py-1 transition-all duration-500 ${step >= 9 ? "opacity-100" : "opacity-20"} ${step === 9 ? "scale-[1.02]" : ""}`}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all duration-500 ${
                step === 9 ? "bg-red-50 border-red-400 shadow-md" : "bg-gray-50 border-gray-200"
              }`}>
                <XCircle size={14} className="text-red-600" />
                <div className="text-[10px]">
                  <span className="font-bold text-red-800">c ≠ c&apos; → return K̄ = J(z, c)</span>
                  <span className="text-red-600 ml-2">Implicit rejection — attacker learns nothing</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 bg-white p-3 rounded-lg border text-sm text-gray-600 text-center min-h-[3rem] flex items-center justify-center shadow-sm">
        {descriptions[step]}
      </div>

      {/* Progress tiles */}
      <div className="mt-3 w-full flex gap-1.5">
        {Array.from({ length: maxSteps }, (_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              step === s ? "bg-indigo-600 shadow-sm" : s < step ? "bg-indigo-300" : "bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex w-full justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {maxSteps}</span>
        <span>Use Space to pause, arrows to step</span>
      </div>
    </div>
  );
}

/* Helper Components */

function PhaseLabel({ text, active }: { text: string; active: boolean }) {
  return (
    <div className={`flex items-center justify-center py-0.5 transition-all duration-500 ${active ? "opacity-100" : "opacity-40"}`}>
      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full border transition-all duration-500 ${
        active ? "bg-gray-100 text-gray-700 border-gray-300" : "bg-gray-50 text-gray-400 border-gray-200"
      }`}>
        {text}
      </span>
    </div>
  );
}

function ActionRow({
  active,
  done,
  side,
  label,
  icon,
  details,
  color,
}: {
  active: boolean;
  done: boolean;
  side: "left" | "right";
  label: string;
  icon: React.ReactNode;
  details: string;
  color: string;
}) {
  const visible = active || done;
  const isLeft = side === "left";
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-300" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-300" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-300" },
  };
  const c = colorClasses[color] || colorClasses.indigo;

  return (
    <div className={`flex items-center py-0.5 transition-all duration-500 ${visible ? "opacity-100" : "opacity-20"} ${active ? "scale-[1.01]" : ""}`}>
      {/* Left label */}
      <div className="w-[68px] flex justify-end pr-2">
        {isLeft && visible && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
            active ? `${c.bg} ${c.text} border ${c.border} shadow-sm` : `${c.text} opacity-60`
          }`}>
            {icon} {label}
          </span>
        )}
      </div>
      {/* Center detail */}
      <div className="flex-1 flex items-center justify-center">
        {visible && (
          <span className={`text-[10px] px-2 py-0.5 rounded border transition-all duration-300 font-mono ${
            active ? `${c.bg} ${c.border} ${c.text} shadow-sm font-medium` : "bg-white border-gray-100 text-gray-500"
          }`}>
            {details}
          </span>
        )}
      </div>
      {/* Right label */}
      <div className="w-[68px] flex justify-start pl-2">
        {!isLeft && visible && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
            active ? `${c.bg} ${c.text} border ${c.border} shadow-sm` : `${c.text} opacity-60`
          }`}>
            {label} {icon}
          </span>
        )}
      </div>
    </div>
  );
}

function MessageRow({
  active,
  done,
  direction,
  label,
  icon,
  details,
  color,
}: {
  active: boolean;
  done: boolean;
  direction: "left" | "right";
  label: string;
  icon: React.ReactNode;
  details: string;
  color: string;
}) {
  const visible = active || done;
  const arrowRight = direction === "right";
  const colorClasses: Record<string, { text: string; border: string; bg: string }> = {
    indigo: { text: "text-indigo-700", border: "border-indigo-300", bg: "bg-indigo-50" },
    pink: { text: "text-pink-700", border: "border-pink-300", bg: "bg-pink-50" },
    blue: { text: "text-blue-700", border: "border-blue-300", bg: "bg-blue-50" },
  };
  const c = colorClasses[color] || colorClasses.indigo;

  return (
    <div className={`flex items-center py-0.5 transition-all duration-500 ${visible ? "opacity-100" : "opacity-20"} ${active ? "scale-[1.02]" : ""}`}>
      {/* Left label */}
      <div className="w-[68px] flex justify-end pr-2">
        {!arrowRight && visible && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
            active ? `${c.bg} ${c.text} border ${c.border} shadow-sm` : `${c.text} opacity-60`
          }`}>
            {label}
          </span>
        )}
      </div>
      {/* Arrow */}
      <div className="flex-1 flex items-center px-1">
        <div className={`flex-1 relative h-6 flex items-center ${!visible ? "opacity-30" : ""}`}>
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className={`w-full h-px bg-indigo-300`} />
          </div>
          <div className={`absolute ${arrowRight ? "right-0" : "left-0"} text-indigo-400`}>
            {arrowRight ? "▶" : "◀"}
          </div>
          {visible && (
            <div className={`absolute inset-0 flex items-center ${arrowRight ? "justify-start pl-3" : "justify-end pr-3"}`}>
              <span className={`text-[9px] bg-white px-1.5 py-0.5 rounded border transition-all duration-300 ${c.border} ${c.text} ${active ? "shadow-sm font-medium" : ""}`}>
                {icon} {details}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Right label */}
      <div className="w-[68px] flex justify-start pl-2">
        {arrowRight && visible && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
            active ? `${c.bg} ${c.text} border ${c.border} shadow-sm` : `${c.text} opacity-60`
          }`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
