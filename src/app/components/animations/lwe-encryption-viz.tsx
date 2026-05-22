import React, { useState, useEffect, useCallback } from "react";
import { RotateCcw } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   LWE Encryption Process Visualization
   Parameters: n=3, q=113, B=2
   ═══════════════════════════════════════════════════════════════ */

const Q = 113;
const N = 3;
const B = 2;
const HQ = Math.round(Q / 2); // 57
const STEPS = 6;

const LABELS = ["1) Key Gen", "2) Obtain PK, select encryption secrets", "3) Encrypt", "4) Decrypt", "5) Expand", "6) Result"];
const DESCS = [
  "b = As + e (mod 113)",
  "Obtain the Public Key (A, b), sample r, z, z\u2032 and scale the message bit",
  "Encryption can be viewed as another instance of the LWE problem (mod 113)",
  "Decrypt: c2 \u2212 s\u1d40 \u00d7 c1 (or visually: bottom \u2212 s\u1d40 \u00d7 top)",
  "s\u1d40A\u1d40 = (b \u2212 e)\u1d40 = b\u1d40 \u2212 e\u1d40",
  "b\u1d40r cancels \u2192 small error E introduced \u2192 Round",
];

/* ── Colors ── */
const CL = {
  A: "#0d9488", Ab: "#ccfbf1",
  b: "#374151", bb: "#f3f4f6",
  s: "#dc2626", sb: "#fee2e2",
  e: "#e11d48", eb: "#ffe4e6",
  r: "#4f46e5", rb: "#e0e7ff",
  z: "#d97706", zb: "#fef3c7",
  m: "#7c3aed", mb: "#ede9fe",
  g: "#059669", gb: "#d1fae5",
  dim: "#94a3b8",
};

/* ═══════════ Math ═══════════ */
const mod = (x: number, m: number) => ((x % m) + m) % m;
const sym = (x: number, q: number) => { const r = mod(x, q); return r > (q - 1) / 2 ? r - q : r; };
const ri = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const rSm = (n: number) => Array.from({ length: n }, () => ri(-B, B));
const rZq = (n: number) => Array.from({ length: n }, () => ri(0, Q - 1));
const rMt = (r: number, c: number) => Array.from({ length: r }, () => rZq(c));
const mv = (A: number[][], v: number[]) => A.map(row => mod(row.reduce((s, a, j) => s + a * v[j], 0), Q));
const dr = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);
const dm = (a: number[], b: number[]) => mod(dr(a, b), Q);
const va = (a: number[], b: number[]) => a.map((v, i) => mod(v + b[i], Q));
const tp = (A: number[][]) => A[0].map((_, j) => A.map(row => row[j]));

/* ═══════════ Values ═══════════ */
interface V {
  A: number[][]; s: number[]; e: number[]; b: number[];
  r: number[]; z: number[]; zp: number; m: number;
  AT: number[][]; ATr: number[]; c1: number[]; bTr: number; c2: number;
  sTc1: number; decS: number;
  sTATr: number; sTz: number; eTr: number; errE: number;
  recovered: number;
}

function gen(m: number): V {
  const A = rMt(N, N), s = rSm(N), e = rSm(N);
  const As = mv(A, s), b = va(As, e);
  const r = rSm(N), z = rSm(N), zp = ri(-B, B);
  return calc({ A, s, e, b, r, z, zp }, m);
}

function calc(base: Pick<V, 'A' | 's' | 'e' | 'b' | 'r' | 'z' | 'zp'>, m: number): V {
  const { A, s, e, b, r, z, zp } = base;
  const AT = tp(A), ATr = mv(AT, r), c1 = va(ATr, z);
  const bTr = dm(b, r);
  const c2 = mod(bTr + zp + m * HQ, Q);
  const sTc1 = dm(s, c1);
  const decS = sym(mod(c2 - sTc1, Q), Q);
  const sTATr = dm(s, ATr), sTz = dr(s, z), eTr = dr(e, r);
  const errE = eTr + zp - sTz;
  const recovered = Math.abs(decS) <= Q / 4 ? 0 : 1;
  return { A, s, e, b, r, z, zp, m, AT, ATr, c1, bTr, c2, sTc1, decS, sTATr, sTz, eTr, errE, recovered };
}

/* ═══════════════════ Visual Helpers ═══════════════════ */

function Bk({ children, color, label, dashed }: {
  children: React.ReactNode; color: string; label?: string; dashed?: boolean;
}) {
  const bs = dashed ? 'dashed' : 'solid';
  return (
    <div className="flex flex-col items-center gap-0.5">
      {label && <span className="text-[11px] tracking-wider" style={{ color }}>{label}</span>}
      <div className="flex items-stretch">
        <div className="w-[5px]" style={{
          borderLeft: `2.5px ${bs} ${color}`, borderTop: `2.5px ${bs} ${color}`, borderBottom: `2.5px ${bs} ${color}`,
          borderTopLeftRadius: 3, borderBottomLeftRadius: 3
        }} />
        <div className="flex flex-col justify-center px-1 py-0.5">{children}</div>
        <div className="w-[5px]" style={{
          borderRight: `2.5px ${bs} ${color}`, borderTop: `2.5px ${bs} ${color}`, borderBottom: `2.5px ${bs} ${color}`,
          borderTopRightRadius: 3, borderBottomRightRadius: 3
        }} />
      </div>
    </div>
  );
}

function Num({ v, color, w = 32 }: { v: number | string; color?: string; w?: number }) {
  return (
    <span className="inline-flex items-center justify-center h-[22px] font-mono text-xs font-semibold"
      style={{ width: w, color: color || '#374151' }}>{v}</span>
  );
}

function OpS({ children }: { children: React.ReactNode }) {
  return <span className="flex items-center justify-center text-gray-400 font-bold text-base px-1 self-center">{children}</span>;
}

function Sep({ color = "#d1d5db" }: { color?: string }) {
  return <div className="my-0.5" style={{ borderTop: `1.5px dashed ${color}`, width: '100%' }} />;
}

function MsgToggle({ m, set }: { m: number; set: (m: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">Choose message:</span>
      {[0, 1].map(v => (
        <button key={v} onClick={() => set(v)}
          className={`px-2.5 py-1 rounded text-xs font-mono font-bold border cursor-pointer transition-all ${m === v ? 'shadow-sm' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
          style={m === v ? { color: CL.m, backgroundColor: CL.mb, borderColor: CL.m + '60' } : undefined}>
          m = {v}
        </button>
      ))}
    </div>
  );
}

/* Reusable rows/cols with labels */
function BtRow({ v, dashed = false }: { v: V; dashed?: boolean }) {
  return (
    <Bk color={CL.b} dashed={dashed} label="bᵀ">
      <div className="flex">{v.b.map((val, j) => <Num key={j} v={val} color={CL.b} w={36} />)}</div>
    </Bk>
  );
}

function StRow({ v, dashed = false }: { v: V; dashed?: boolean }) {
  return (
    <Bk color={CL.s} dashed={dashed} label="sᵀ">
      <div className="flex">{v.s.map((val, j) => <Num key={j} v={val} color={CL.s} w={36} />)}</div>
    </Bk>
  );
}

function EtRow({ v, dashed = false }: { v: V; dashed?: boolean }) {
  return (
    <Bk color={CL.e} dashed={dashed} label="eᵀ">
      <div className="flex">{v.e.map((val, j) => <Num key={j} v={val} color={CL.e} w={36} />)}</div>
    </Bk>
  );
}

function RCol({ v, dashed = false }: { v: V; dashed?: boolean }) {
  return (
    <Bk color={CL.r} dashed={dashed} label="r">
      {v.r.map((val, i) => <div key={i}><Num v={val} color={CL.r} /></div>)}
    </Bk>
  );
}

function ZCol({ v, dashed = false }: { v: V; dashed?: boolean }) {
  return (
    <Bk color={CL.z} dashed={dashed} label="z">
      {v.z.map((val, i) => <div key={i}><Num v={val} color={CL.z} /></div>)}
    </Bk>
  );
}

/* z' + m·HQ group */
function ZpMsg({ v }: { v: V }) {
  return (
    <div className="flex items-center gap-1">
      <Bk color={CL.z} label="z'">
        <Num v={v.zp} color={CL.z} />
      </Bk>
      <OpS>+</OpS>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[11px] tracking-wider" style={{ color: CL.m }}>m·⌈q/2⌋</span>
        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded flex items-center justify-center h-[26px]"
          style={{ color: CL.m, backgroundColor: CL.mb }}>{v.m * HQ}</span>
      </div>
    </div>
  );
}

function Bracket({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch gap-1">
      <div className="text-gray-400 font-light text-[60px] leading-none flex items-center pt-2 pb-1">(</div>
      <div className="flex items-center gap-1.5 py-2">{children}</div>
      <div className="text-gray-400 font-light text-[60px] leading-none flex items-center pt-2 pb-1">)</div>
    </div>
  );
}

/* ═══════════════════ Main Component ═══════════════════ */

export function LWEEncryptionVizAnimation() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<V>(() => gen(1));

  const toggleMsg = useCallback((m: number) => {
    setV(prev => calc(prev, m));
  }, []);

  const regenerate = useCallback(() => {
    setV(prev => gen(prev.m));
    setStep(0);
  }, []);

  useEffect(() => {
    const next = (ev: Event) => { if (step < STEPS - 1) { ev.preventDefault(); setStep(p => p + 1); } };
    const prev = (ev: Event) => { if (step > 0) { ev.preventDefault(); setStep(p => p - 1); } };
    window.addEventListener("slide-next", next);
    window.addEventListener("slide-prev", prev);
    return () => { window.removeEventListener("slide-next", next); window.removeEventListener("slide-prev", prev); };
  }, [step]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm overflow-hidden">
      {/* Header */}
      <div className="flex w-full items-center justify-between mb-2 px-2">
        <h3 className="text-lg font-bold text-gray-800 m-0">Toy Example of LWE Encryption Process (n=3, q=113, B=2)</h3>
        <button onClick={regenerate}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 bg-gray-50 px-3 py-1.5 rounded border shadow-sm cursor-pointer transition-colors">
          <RotateCcw size={14} /> Regenerate
        </button>
      </div>

      {/* Step description */}
      <div className="min-h-[60px] flex flex-col items-center justify-center w-full px-4 mb-4 mt-2">
        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1.5">{LABELS[step]}</span>
        <p className="text-xs text-gray-700 text-center font-mono leading-relaxed max-w-2xl">{DESCS[step]}</p>
      </div>

      {/* Message toggle (step 1 only) */}
      {step === 1 && <div className="mb-3"><MsgToggle m={v.m} set={toggleMsg} /></div>}

      {/* Content */}
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center px-2">
        {step === 0 && <Step0 v={v} />}
        {step === 1 && <Step1 v={v} />}
        {step === 2 && <Step2 v={v} />}
        {step === 3 && <Step3 v={v} />}
        {step === 4 && <Step4 v={v} />}
        {step === 5 && <Step5 v={v} />}
      </div>

      {/* Progress */}
      <div className="mt-4 w-full flex gap-1 px-4">
        {Array.from({ length: STEPS }, (_, i) => {
          const isDecryption = [0, 3, 4, 5].includes(i);
          const activeColor = isDecryption ? "bg-emerald-600 shadow-sm" : "bg-indigo-600 shadow-sm";
          const pastColor = isDecryption ? "bg-emerald-300 hover:bg-emerald-400" : "bg-indigo-300 hover:bg-indigo-400";
          return (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${step === i ? activeColor : i < step ? pastColor : "bg-gray-200 hover:bg-gray-300"}`} />
          );
        })}
      </div>
      <div className="mt-2 w-full flex justify-between items-center text-xs text-gray-400 px-4">
        <span>Step {step + 1} / {STEPS}</span>
        <span>Use arrow keys to navigate</span>
      </div>
    </div>
  );
}

/* ═══════════════════ STEP 0: Key Generation ═══════════════════ */

function Step0({ v }: { v: V }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-1">
        <Bk color={CL.A} label="A (public)">
          {v.A.map((row, i) => (
            <div key={i} className="flex">{row.map((val, j) => <Num key={j} v={val} color={CL.A} w={36} />)}</div>
          ))}
        </Bk>
        <OpS>×</OpS>
        <Bk color={CL.s} label="s (secret)">
          {v.s.map((val, i) => <div key={i}><Num v={val} color={CL.s} /></div>)}
        </Bk>
        <OpS>+</OpS>
        <Bk color={CL.e} label="e (error)">
          {v.e.map((val, i) => <div key={i}><Num v={val} color={CL.e} /></div>)}
        </Bk>
        <OpS>=</OpS>
        <Bk color={CL.b} label="b (public)">
          {v.b.map((val, i) => <div key={i}><Num v={val} color={CL.b} /></div>)}
        </Bk>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 rounded-lg border-2 text-xs font-bold" style={{ color: CL.g, borderColor: CL.g + '60', backgroundColor: CL.gb }}>
          Public key: (A, b)
        </div>
        <div className="px-3 py-1.5 rounded-lg border-2 text-xs font-bold" style={{ color: CL.s, borderColor: CL.s + '60', backgroundColor: CL.sb }}>
          Private key: s
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ STEP 1: Encryption Setup ═══════════════════ */

function Step1({ v }: { v: V }) {
  return (
    <div className="flex items-center gap-8">
      {/* Public Key (Left) */}
      <div className="flex flex-col items-center gap-2 pr-8 border-r-2 border-gray-100 border-dashed">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Public Key</div>
        <div className="flex items-center gap-3">
          <Bk color={CL.A} label="A">
            {v.A.map((row, i) => (
              <div key={i} className="flex">{row.map((val, j) => <Num key={j} v={val} color={CL.A} w={36} />)}</div>
            ))}
          </Bk>
          <Bk color={CL.b} label="b">
            {v.b.map((val, i) => <div key={i}><Num v={val} color={CL.b} /></div>)}
          </Bk>
        </div>
      </div>

      {/* Encryption Secrets (Right) */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Encryption Secrets</div>
        <div className="flex items-center gap-6">
          <Bk color={CL.r} label="r">
            {v.r.map((val, i) => <div key={i}><Num v={val} color={CL.r} /></div>)}
          </Bk>
          <Bk color={CL.z} label="z">
            {v.z.map((val, i) => <div key={i}><Num v={val} color={CL.z} /></div>)}
          </Bk>
          <Bk color={CL.z} label="z&apos;">
            <Num v={v.zp} color={CL.z} />
          </Bk>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[11px] tracking-wider" style={{ color: CL.m }}>m · ⌈q/2⌋</span>
            <span className="font-mono text-sm font-bold px-2 py-1 rounded"
              style={{ color: CL.m, backgroundColor: CL.mb }}>{v.m} · {HQ} = {v.m * HQ}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ STEP 2: Matrix View ═══════════════════ */

function Step2({ v }: { v: V }) {
  return (
    <div className="flex items-center gap-1">
      <Bk color={CL.dim} label="[ Aᵀ | bᵀ ]">
        {v.AT.map((row, i) => (
          <div key={i} className="flex">{row.map((val, j) => <Num key={j} v={val} color={CL.A} w={36} />)}</div>
        ))}
        <Sep color={CL.b + '60'} />
        <div className="flex">{v.b.map((val, j) => <Num key={j} v={val} color={CL.b} w={36} />)}</div>
      </Bk>

      <OpS>×</OpS>
      <RCol v={v} />
      <OpS>+</OpS>

      <Bk color={CL.z} label="[ z | z' ]">
        {v.z.map((val, i) => <div key={i}><Num v={val} color={CL.z} /></div>)}
        <Sep color={CL.z + '60'} />
        <div><Num v={v.zp} color={CL.z} /></div>
      </Bk>

      {/* m·57 aligned at bottom */}
      <div className="flex flex-col justify-end self-stretch">
        <div className="flex items-center gap-0.5 mb-[2px]">
          <OpS>+</OpS>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[11px] tracking-wider" style={{ color: CL.m }}>m · ⌈q/2⌋</span>
            <span className="font-mono text-sm font-bold px-2 py-1 rounded"
              style={{ color: CL.m, backgroundColor: CL.mb }}>{v.m * HQ}</span>
          </div>
        </div>
      </div>

      <OpS>=</OpS>
      <Bk color={CL.g} dashed label="[ c1 | c2' ]">
        {v.c1.map((val, i) => <div key={i}><Num v={val} color={CL.g} w={36} /></div>)}
        <Sep color={CL.g + '60'} />
        <div><Num v={v.c2} color={CL.g} w={36} /></div>
      </Bk>

    </div>
  );
}

/* ═══════════════════ STEP 3: Decryption ═══════════════════ */

function Step3({ v }: { v: V }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Top: bᵀr + z' + m·57 */}
      <div className="flex items-center gap-2">
        <Bracket>
          <div className="flex items-center gap-1">
            <BtRow v={v} />
            <OpS>×</OpS>
            <RCol v={v} />
          </div>
          <OpS>+</OpS>
          <ZpMsg v={v} />
        </Bracket>
      </div>

      {/* Minus bar */}
      <OpS>-</OpS>

      {/* Bottom: sᵀ × ( Aᵀ × r + z ) */}
      <div className="flex items-center gap-2">
        <StRow v={v} />
        <OpS>×</OpS>
        <Bracket>
          <Bk color={CL.A} label="Aᵀ">
            {v.AT.map((row, i) => (
              <div key={i} className="flex">{row.map((val, j) => <Num key={j} v={val} color={CL.A} w={36} />)}</div>
            ))}
          </Bk>
          <OpS>×</OpS>
          <RCol v={v} />
          <OpS>+</OpS>
          <ZCol v={v} />
        </Bracket>
      </div>
    </div>
  );
}

/* ═══════════════════ STEP 4: Expansion ═══════════════════ */

function Step4({ v }: { v: V }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Top: bᵀr + z' + m·57 */}
      <div className="flex items-center gap-2">
        <Bracket>
          <div className="flex items-center gap-1">
            <BtRow v={v} />
            <OpS>×</OpS>
            <RCol v={v} />
          </div>
          <OpS>+</OpS>
          <ZpMsg v={v} />
        </Bracket>
      </div>

      {/* Minus bar */}
      <OpS>-</OpS>

      {/* Bottom: bᵀr  −  eᵀr  +  sᵀz */}
      <div className="flex items-center gap-1.5">
        <Bracket>
          {/* bᵀr */}
          <div className="flex items-center gap-1">
            <BtRow v={v} />
            <OpS>×</OpS>
            <RCol v={v} />
          </div>

          <OpS>-</OpS>

          {/* eᵀr */}
          <div className="flex items-center gap-1">
            <EtRow v={v} />
            <OpS>×</OpS>
            <RCol v={v} />
          </div>

          <OpS>+</OpS>

          {/* sᵀz */}
          <div className="flex items-center gap-1">
            <StRow v={v} />
            <OpS>×</OpS>
            <ZCol v={v} />
          </div>
        </Bracket>
      </div>
    </div>
  );
}

/* ═══════════════════ STEP 5: Cancellation + Result ═══════════════════ */

function Step5({ v }: { v: V }) {
  const total = v.errE + v.m * HQ;
  const totalMods = sym(mod(total, Q), Q);
  const halfRange = (Q - 1) / 2;
  const qQ = Q / 4;
  const markerPos = ((totalMods + halfRange) / (2 * halfRange)) * 100;
  const leftB = (((-qQ) + halfRange) / (2 * halfRange)) * 100;
  const rightB = ((qQ + halfRange) / (2 * halfRange)) * 100;

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl">
      {/* Cancelled equation */}
      <div className="flex flex-col items-center gap-2">
        {/* Top: bᵀr FADED | z' + m·57 bright */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 opacity-[0.12] relative">
            <BtRow v={v} />
            <OpS>×</OpS>
            <RCol v={v} />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-red-500 rounded" />
          </div>
          <Bracket>
            <ZpMsg v={v} />
          </Bracket>
        </div>

        {/* Minus bar */}
        <OpS>-</OpS>

        {/* Bottom: bᵀr FADED | eᵀr + sᵀz bright */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 opacity-[0.12] relative">
            <BtRow v={v} />
            <OpS>×</OpS>
            <RCol v={v} />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-red-500 rounded" />
          </div>

          <Bracket>
            <div className="flex items-center gap-1">

              <OpS>-</OpS>
              <EtRow v={v} />
              <OpS>×</OpS>
              <RCol v={v} />
            </div>

            <OpS>+</OpS>

            <div className="flex items-center gap-1">
              <StRow v={v} />
              <OpS>×</OpS>
              <ZCol v={v} />
            </div>
          </Bracket>
        </div>
      </div>

      {/* Result row */}
      <div className="flex items-center gap-1.5 text-xs font-mono text-gray-600 mt-1">
        <span style={{ color: CL.e }}>E = z' + eᵀr - sᵀz = {v.errE}</span>
        <span className="text-gray-300">→</span>
        <span>E + m·{HQ} = {total}</span>
        <span className="text-gray-300">→</span>
        <span>mods {Q} = <b>{totalMods}</b></span>
      </div>

      {/* Number line */}
      <div className="w-full px-6">
        <div className="relative h-16">
          <div className="absolute left-0 right-0 top-6 h-4 rounded-full bg-gray-100 border border-gray-200" />
          <div className="absolute top-6 h-4 rounded-l-full" style={{ left: '0%', width: `${leftB}%`, backgroundColor: CL.mb }} />
          <div className="absolute top-6 h-4" style={{ left: `${leftB}%`, width: `${rightB - leftB}%`, backgroundColor: CL.gb }} />
          <div className="absolute top-6 h-4 rounded-r-full" style={{ left: `${rightB}%`, width: `${100 - rightB}%`, backgroundColor: CL.mb }} />
          <div className="absolute top-[24px] w-[1.5px] h-6 bg-gray-400" style={{ left: `${leftB}%` }} />
          <div className="absolute top-[24px] w-[1.5px] h-6 bg-gray-400" style={{ left: `${rightB}%` }} />
          <div className="absolute top-[24px] w-[1.5px] h-6 bg-gray-300" style={{ left: '50%' }} />
          {/* Marker */}
          <div className="absolute top-0" style={{ left: `${markerPos}%`, transform: 'translateX(-50%)' }}>
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 text-white rounded px-1.5 py-0.5 text-[10px] font-mono font-bold shadow">{totalMods}</div>
              <div className="w-0.5 h-4 bg-gray-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-800 border-2 border-white shadow" />
            </div>
          </div>
          <div className="absolute top-[50px] left-0 text-[9px] text-gray-400 font-mono">−{Math.floor(halfRange)}</div>
          <div className="absolute top-[50px] text-[9px] text-gray-400 font-mono" style={{ left: '50%', transform: 'translateX(-50%)' }}>0</div>
          <div className="absolute top-[50px] right-0 text-[9px] text-gray-400 font-mono">{Math.floor(halfRange)}</div>
          <div className="absolute top-[60px] text-[8px] font-bold" style={{ left: `${leftB / 2}%`, transform: 'translateX(-50%)', color: CL.m }}>m=1</div>
          <div className="absolute top-[60px] text-[8px] font-bold" style={{ left: `${(leftB + rightB) / 2}%`, transform: 'translateX(-50%)', color: CL.g }}>m=0</div>
          <div className="absolute top-[60px] text-[8px] font-bold" style={{ left: `${(rightB + 100) / 2}%`, transform: 'translateX(-50%)', color: CL.m }}>m=1</div>
        </div>
      </div>

      {/* Result badge */}
      <div className={`px-4 py-1.5 rounded-lg border-2 text-sm font-bold ${v.recovered === v.m
        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
        : 'border-red-400 bg-red-50 text-red-700'}`}>
        {v.recovered === v.m ? `✓  m = ${v.recovered}` : `✗  m = ${v.recovered}`}
      </div>
    </div>
  );
}
