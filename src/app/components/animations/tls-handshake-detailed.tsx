import React, { useState, useEffect } from "react";
import { Monitor, Server, RefreshCw, Pause, Play, Shield, KeyRound, Lock, FileCheck, CheckCircle2, Send, Hash, Layers, Eye, EyeOff } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function TLSHandshakeDetailedAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed] = useGlobalAnimationSpeed();
  const maxSteps = 9;

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 6000 / speed);
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

    window.addEventListener('slide-next', handleNext);
    window.addEventListener('slide-prev', handlePrev);
    window.addEventListener('slide-space', handleSpace);

    return () => {
      window.removeEventListener('slide-next', handleNext);
      window.removeEventListener('slide-prev', handlePrev);
      window.removeEventListener('slide-space', handleSpace);
    };
  }, [step]);

  const reset = () => {
    setStep(0);
    setIsPaused(false);
  };
  const togglePause = () => {
    if (isPaused) {
      setStep((prev) => (prev + 1) % maxSteps);
    }
    setIsPaused(!isPaused);
  };

  const isHandshakeEncrypted = step >= 3;
  const isAppEncrypted = step >= 9;

  return (
    <div className="w-full max-w-4xl mx-auto p-5 bg-gray-50 rounded-xl border border-gray-200 my-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 m-0">TLS 1.3 Handshake — Full Process</h3>
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
              <RefreshCw size={12} className={step === maxSteps - 1 && !isPaused ? "animate-spin" : ""} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={6000} />
        </div>
      </div>

      {/* Timeline-based layout */}
      <div className="relative">
        {/* Client and Server headers */}
        <div className="flex justify-between mb-3">
          <div className="flex items-center gap-2 w-36">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-500 ${
              isAppEncrypted ? "bg-emerald-100 border-emerald-300" : "bg-sky-100 border-sky-300"
            }`}>
              <Monitor size={18} className={isAppEncrypted ? "text-emerald-600" : "text-sky-600"} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-xs">Client</p>
              <p className="text-[10px] text-gray-500">Browser</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-36 justify-end">
            <div>
              <p className="font-bold text-gray-800 text-xs text-right">Server</p>
              <p className="text-[10px] text-gray-500 text-right">example.com</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-500 ${
              isAppEncrypted ? "bg-emerald-100 border-emerald-300" : "bg-violet-100 border-violet-300"
            }`}>
              <Server size={18} className={isAppEncrypted ? "text-emerald-600" : "text-violet-600"} />
            </div>
          </div>
        </div>

        {/* Vertical timeline lines */}
        <div className="relative mx-5">
          <div className="absolute left-[68px] top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="absolute right-[68px] top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Encrypted zone indicator */}
          {isHandshakeEncrypted && (
            <div className="absolute left-[78px] right-[78px] bg-emerald-50 border-l-2 border-r-2 border-emerald-300 transition-all duration-700"
              style={{
                top: '0px',
                bottom: '0px',
                opacity: 0.5,
              }}
            />
          )}

          {/* Message rows */}
          <div className="flex flex-col gap-1.5 py-2">

            {/* Row 0: ClientHello */}
            <MessageRow
              active={step === 0}
              done={step > 0}
              direction="right"
              label="ClientHello"
              icon={<Send size={11} />}
              details="cipher suites, key_share (Qₐ = dₐ·G), random"
              color="sky"
              encrypted={false}
            />

            {/* Row 1: ServerHello */}
            <MessageRow
              active={step === 1}
              done={step > 1}
              direction="left"
              label="ServerHello"
              icon={<Send size={11} className="rotate-180" />}
              details="selected suite, key_share (Qₛ = dₛ·G), random"
              color="violet"
              encrypted={false}
            />

            {/* Row 2: Key derivation */}
            <div className={`flex items-center justify-center py-1.5 transition-all duration-1000 ${step >= 2 ? "opacity-100" : "opacity-20"} ${step === 2 ? "scale-105" : ""}`}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all duration-1000 ${
                step === 2 ? "bg-amber-50 border-amber-300 shadow-md" : step > 2 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"
              }`}>
                <KeyRound size={14} className="text-amber-600" />
                <div className="text-[10px]">
                  <span className="font-bold text-amber-800">Shared Secret Derived</span>
                  <span className="text-amber-600 ml-1">S = dₐ · Qₛ = dₛ · Qₐ</span>
                </div>
                <span className="text-gray-400 mx-1">→</span>
                <div className="text-[10px]">
                  <span className="text-amber-600 ml-1">handshake keys</span>
                </div>
              </div>
            </div>

            {/* Row 3: Encryption boundary */}
            <div className={`flex items-center justify-center transition-all duration-1000 ${step >= 3 ? "opacity-100" : "opacity-20"}`}>
              <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-bold border transition-all duration-1000 ${
                step >= 3 ? "bg-emerald-100 text-emerald-800 border-emerald-400 shadow-sm" : "bg-gray-100 text-gray-400 border-gray-300"
              }`}>
                <Lock size={10} />
                ENCRYPTED FROM HERE — handshake keys active
              </div>
            </div>

            {/* Row 4: EncryptedExtensions + Certificate */}
            <MessageRow
              active={step === 4}
              done={step > 4}
              direction="left"
              label="Certificate"
              icon={<FileCheck size={11} />}
              details="X.509 cert (now hidden from eavesdroppers)"
              color="amber"
              encrypted={true}
            />

            {/* Row 5: CertificateVerify */}
            <MessageRow
              active={step === 5}
              done={step > 5}
              direction="left"
              label="CertificateVerify"
              icon={<Shield size={11} />}
              details="ECDSA signature over entire handshake transcript (authentication)"
              color="violet"
              encrypted={true}
            />

            {/* Row 6: Server Finished */}
            <MessageRow
              active={step === 6}
              done={step > 6}
              direction="left"
              label="Finished"
              icon={<Hash size={11} />}
              details="HMAC of handshake transcript (integrity proof)"
              color="indigo"
              encrypted={true}
            />

            {/* Row 7: Client verification + Finished */}
            <MessageRow
              active={step === 7}
              done={step > 7}
              direction="right"
              label="Finished"
              icon={<CheckCircle2 size={11} />}
              details="client verifies cert chain, signature, HMAC → sends Finished"
              color="sky"
              encrypted={true}
            />

            {/* Row 8: Application key derivation */}
            <div className={`flex items-center justify-center py-1.5 transition-all duration-500 ${step >= 8 ? "opacity-100" : "opacity-20"} ${step === 8 ? "scale-105" : ""}`}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all duration-500 ${
                step === 8 ? "bg-emerald-50 border-emerald-300 shadow-md" : step > 8 ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
              }`}>
                <KeyRound size={14} className="text-emerald-600" />
                <div className="text-[10px]">
                  <span className="font-bold text-emerald-800">Encryption Keys Derived</span>
                </div>
                <span className="text-gray-400 mx-1">→</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-emerald-700 border border-emerald-200">AES-256-GCM key</span>
                  <span className="text-gray-400">+</span>
                  <span className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-emerald-700 border border-emerald-200">IV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* State explanations */}
      <div className="mt-3 bg-white p-3 rounded-lg border text-sm text-gray-600 text-center min-h-[3.5rem] flex items-center justify-center shadow-sm">
        {step === 0 && <p><strong>ClientHello:</strong> The client sends supported <strong>cipher suites</strong>, <strong>key share</strong> groups (e.g., x25519), and its <strong>ECDHE public value</strong> Qₐ — all in the very first message.</p>}
        {step === 1 && <p><strong>ServerHello:</strong> The server selects a cipher suite (e.g., TLS_AES_256_GCM_SHA384), and sends back its <strong>ECDHE key share</strong> Q_B. Both can now compute the shared secret.</p>}
        {step === 2 && <p><strong>Key Derivation:</strong> Both parties compute the <strong>ECDHE shared secret</strong> S = dₐ · Q_B = d_B · Qₐ, then use <strong>HKDF</strong> (HMAC-based Extract-and-Expand) to derive handshake encryption keys.</p>}
        {step === 3 && <p><strong>Encryption boundary:</strong> From this point, all handshake messages are encrypted with the derived handshake keys. <strong>Eavesdroppers can no longer see any content</strong> — including the server's identity!</p>}
        {step === 4 && <p><strong>Certificate:</strong> The server sends its <strong>X.509 certificate, encrypted within the handshake tunnel</strong>. In TLS 1.2, this was sent in plaintext — exposing the server's identity to passive attackers.</p>}
        {step === 5 && <p><strong>CertificateVerify:</strong> The server <strong>signs the entire handshake transcript</strong> using its private key (ECDSA). This proves it owns the certificate's public key and prevents replay attacks.</p>}
        {step === 6 && <p><strong>Server Finished:</strong> The server sends an <strong>HMAC</strong> over the entire handshake transcript, providing integrity proof that nothing was tampered with.</p>}
        {step === 7 && <p><strong>Client Finished:</strong> The client verifies the <strong>certificate chain (PKI)</strong>, the <strong>ECDSA signature</strong>, and the <strong>Finished MAC</strong>. If all checks pass, it sends its own Finished message.</p>}
        {step === 8 && <p><strong>Encryption Keys:</strong> Both parties derive final <strong>AES-256-GCM</strong> session keys and IVs from the shared secret. <strong>Ephemeral ECDHE private keys are deleted</strong>. The encrypted channel is now safely established and authenticated.</p>}
      </div>

      {/* Progress tiles */}
      <div className="mt-3 w-full flex gap-1.5">
        {Array.from({ length: maxSteps }, (_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              step === s ? "bg-gray-600 shadow-sm" : "bg-gray-200 hover:bg-gray-300"
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

/* Helper components */

function MessageRow({
  active,
  done,
  direction,
  label,
  icon,
  details,
  color,
  encrypted,
  encryptedNote,
}: {
  active: boolean;
  done: boolean;
  direction: "left" | "right";
  label: string;
  icon: React.ReactNode;
  details: string;
  color: string;
  encrypted: boolean;
  encryptedNote?: string;
}) {
  const visible = active || done;
  const arrowRight = direction === "right";

  return (
    <div className={`flex items-center py-1 transition-all duration-500 ${visible ? "opacity-100" : "opacity-20"} ${active ? "scale-[1.02]" : ""}`}>
      {/* Left side label (Client) */}
      <div className="w-[68px] flex justify-end pr-2">
        {arrowRight && visible && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
            active ? `bg-${color}-100 text-${color}-700 border border-${color}-300 shadow-sm` : `text-${color}-500`
          }`}>
            {label}
          </span>
        )}
      </div>

      {/* Arrow line */}
      <div className="flex-1 flex items-center px-1">
        <div className={`flex-1 relative h-6 flex items-center ${!visible ? "opacity-30" : ""}`}>
          {/* The line */}
          <div className={`absolute inset-y-0 left-0 right-0 flex items-center`}>
            <div className={`w-full h-px transition-all duration-500 ${
              encrypted
                ? `bg-gradient-to-${arrowRight ? 'r' : 'l'} from-emerald-300 via-emerald-400 to-emerald-300`
                : `bg-${color}-300`
            }`} />
          </div>
          {/* Arrow head */}
          <div className={`absolute ${arrowRight ? "right-0" : "left-0"} text-${color}-400`}>
            {arrowRight ? "▶" : "◀"}
          </div>
          {/* Details text */}
          {visible && (
            <div className={`absolute inset-0 flex items-center ${arrowRight ? "justify-start pl-3" : "justify-end pr-3"}`}>
              <span className={`text-[9px] bg-white px-1.5 py-0.5 rounded border transition-all duration-300 max-w-[260px] truncate ${
                encrypted ? "border-emerald-200 text-emerald-700" : `border-${color}-200 text-${color}-600`
              } ${active ? "shadow-sm font-medium" : ""}`}>
                {encrypted && <Lock size={8} className="inline mr-0.5 text-emerald-500" />}
                {details}
              </span>
            </div>
          )}
          {/* Encrypted note */}
          {active && encryptedNote && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[8px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                <EyeOff size={7} /> {encryptedNote}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right side label (Server) */}
      <div className="w-[68px] flex justify-start pl-2">
        {!arrowRight && visible && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
            active ? `bg-${color}-100 text-${color}-700 border border-${color}-300 shadow-sm` : `text-${color}-500`
          }`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

function ConceptBadge({
  label,
  description,
  active,
}: {
  label: string;
  description: string;
  active: boolean;
}) {
  return (
    <div className={`flex items-start gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] transition-all duration-500 ${
      active
        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
        : "bg-gray-50 border-gray-200 text-gray-400"
    }`}>
      <span className="mt-0.5 flex-shrink-0"></span>
      <div>
        <p className="font-bold">{label}</p>
        <p className={`${active ? "text-emerald-600" : "text-gray-400"}`}>{description}</p>
      </div>
    </div>
  );
}
