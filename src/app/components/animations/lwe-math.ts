// LWE(m=4, n=3, q=17, B=2) math utilities

export const Q = 17;
export const M = 4;
export const N = 3;
export const B = 2;

export function mod(x: number, m: number): number {
  return ((x % m) + m) % m;
}

// Extended Euclidean algorithm → modular inverse
export function modInverse(a: number, m: number): number {
  a = mod(a, m);
  if (a === 0) return 0;
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) return x;
  }
  return 0;
}

// Matrix-vector multiply mod q: A (m×n) × s (n×1) → result (m×1)
export function matVecMul(A: number[][], s: number[], q: number): number[] {
  return A.map(row =>
    mod(row.reduce((sum, a, j) => sum + a * s[j], 0), q)
  );
}

// Add two vectors mod q
export function vecAdd(a: number[], b: number[], q: number): number[] {
  return a.map((v, i) => mod(v + b[i], q));
}

// Random integer in [lo, hi] inclusive
export function randInt(lo: number, hi: number): number {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

// Generate random error vector e ∈ [-B, B]^m
export function randomError(): number[] {
  return Array.from({ length: M }, () => randInt(-B, B));
}

// Generate random matrix A ∈ Z_q^{m×n}
export function randomMatrix(): number[][] {
  return Array.from({ length: M }, () =>
    Array.from({ length: N }, () => randInt(0, Q - 1))
  );
}

// Generate random secret s ∈ Z_q^n
export function randomSecret(): number[] {
  return Array.from({ length: N }, () => randInt(0, Q - 1));
}

// --- Gaussian elimination with symbolic error tracking ---

export interface EqRow {
  coeffs: number[];       // n coefficients mod q
  rhs: number;            // right-hand side mod q
  errCoeffs: number[];    // m coefficients for e₁..eₘ (NOT reduced mod q — exact integers)
}

// Build initial system: row i is A[i] · s = b[i] - eᵢ
// We track: coeffs·s + errCoeffs·e ≡ rhs (mod q)
// Initially errCoeffs[i][i] = 1, rest 0
export function buildSystem(A: number[][], b: number[]): EqRow[] {
  return A.map((row, i) => ({
    coeffs: row.map(v => mod(v, Q)),
    rhs: mod(b[i], Q),
    errCoeffs: Array.from({ length: M }, (_, j) => (j === i ? 1 : 0)),
  }));
}

// One elimination step: eliminate column `col` from rows below `pivotRow`
// Returns new system (immutable) or null if pivot is zero
export function eliminateColumn(
  system: EqRow[],
  col: number,
  pivotRow: number
): EqRow[] | null {
  const pivot = system[pivotRow].coeffs[col];
  if (pivot === 0) {
    // Try to swap with a lower row that has nonzero in this column
    const swapIdx = system.findIndex((r, i) => i > pivotRow && r.coeffs[col] !== 0);
    if (swapIdx === -1) return null;
    const swapped = [...system];
    [swapped[pivotRow], swapped[swapIdx]] = [swapped[swapIdx], swapped[pivotRow]];
    return eliminateColumn(swapped, col, pivotRow);
  }

  return system.map((row, i) => {
    if (i <= pivotRow) return row;
    const factor = row.coeffs[col];
    if (factor === 0) return row;
    // newRow = pivot * row - factor * pivotRow  (mod q for coeffs/rhs, exact for errCoeffs)
    return {
      coeffs: row.coeffs.map((c, j) =>
        mod(pivot * c - factor * system[pivotRow].coeffs[j], Q)
      ),
      rhs: mod(pivot * row.rhs - factor * system[pivotRow].rhs, Q),
      errCoeffs: row.errCoeffs.map((c, j) =>
        pivot * c - factor * system[pivotRow].errCoeffs[j]
      ),
    };
  });
}

// Run full elimination, returning each intermediate system
export function fullElimination(A: number[][], b: number[]): EqRow[][] {
  const stages: EqRow[][] = [];
  let sys = buildSystem(A, b);
  stages.push(sys);

  for (let col = 0; col < N - 1 && col < M - 1; col++) {
    const next = eliminateColumn(sys, col, col);
    if (!next) break;
    sys = next;
    stages.push(sys);
  }
  return stages;
}

// Format error coefficient vector as symbolic string like "6e₂ − 5e₁"
const SUB = ["₁", "₂", "₃", "₄"];
export function formatErrExpr(errCoeffs: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < errCoeffs.length; i++) {
    const c = errCoeffs[i];
    if (c === 0) continue;
    const sign = c > 0 ? (parts.length > 0 ? " + " : "") : (parts.length > 0 ? " − " : "−");
    const absC = Math.abs(c);
    const coefStr = absC === 1 ? "" : `${absC}`;
    parts.push(`${sign}${coefStr}e${SUB[i]}`);
  }
  return parts.length === 0 ? "0" : parts.join("");
}

// Compute error range from errCoeffs given each eᵢ ∈ [-B, B]
export function errorRange(errCoeffs: number[]): [number, number] {
  let lo = 0, hi = 0;
  for (const c of errCoeffs) {
    if (c > 0) { hi += c * B; lo -= c * B; }
    else { hi -= c * B; lo += c * B; }
  }
  return [lo, hi];
}

export interface ElimStepLog {
  type: "eq34" | "eq2" | "eq1" | "conflict" | "success";
  text: string;
  math?: string;
}

export interface ElimSolveResult {
  success: boolean;
  s: number[] | null;
  logs: ElimStepLog[];
}

export function solveFromElimination(sys: EqRow[], eGuess: number[]): ElimSolveResult {
  const logs: ElimStepLog[] = [];
  
  // Calculate targets for all equations
  const errVals = sys.map(row => row.errCoeffs.reduce((sum, c, i) => sum + c * eGuess[i], 0));
  const targets = sys.map((row, i) => mod(row.rhs - errVals[i], Q));

  // Solve s_3 from Eq 3 (index 2)
  const c3_eq3 = sys[2].coeffs[2];
  if (c3_eq3 === 0) {
    logs.push({ type: "conflict", text: "Eq 3 has no s_3 coefficient, cannot solve." });
    return { success: false, s: null, logs };
  }
  const s3_val3 = mod(targets[2] * modInverse(c3_eq3, Q), Q);
  logs.push({ 
    type: "eq34", 
    text: "Plugging e into Eq 3:", 
    math: `${c3_eq3}·s₃ = ${sys[2].rhs} − (${errVals[2]}) ≡ ${targets[2]}  ⇒  s₃ = ${s3_val3}` 
  });

  // Solve s_3 from Eq 4 (index 3)
  const c3_eq4 = sys[3].coeffs[2];
  let s3_val4 = -1;
  if (c3_eq4 !== 0) {
    s3_val4 = mod(targets[3] * modInverse(c3_eq4, Q), Q);
    logs.push({ 
      type: "eq34", 
      text: "Plugging e into Eq 4:", 
      math: `${c3_eq4}·s₃ = ${sys[3].rhs} − (${errVals[3]}) ≡ ${targets[3]}  ⇒  s₃ = ${s3_val4}` 
    });
    
    if (s3_val3 !== s3_val4) {
      logs.push({ type: "conflict", text: `Conflict! Eq 3 gives s₃=${s3_val3}, but Eq 4 gives s₃=${s3_val4}. Error guess is incorrect.` });
      return { success: false, s: null, logs };
    }
  } else {
    // If c3_eq4 is 0, target[3] must be 0
    if (targets[3] !== 0) {
      logs.push({ type: "eq34", text: "Plugging e into Eq 4:", math: `0 = ${targets[3]}` });
      logs.push({ type: "conflict", text: "Conflict! Eq 4 is impossible (0 ≠ target). Error guess is incorrect." });
      return { success: false, s: null, logs };
    }
  }

  const s3 = s3_val3;
  
  // Solve s_2 from Eq 2 (index 1)
  const c2_eq2 = sys[1].coeffs[1];
  const c3_eq2 = sys[1].coeffs[2];
  if (c2_eq2 === 0) {
    logs.push({ type: "conflict", text: "Eq 2 has no s_2 coefficient." });
    return { success: false, s: null, logs };
  }
  const lhs2 = mod(targets[1] - c3_eq2 * s3, Q);
  const s2 = mod(lhs2 * modInverse(c2_eq2, Q), Q);
  logs.push({ 
    type: "eq2", 
    text: "Back-substituting s₃ into Eq 2:", 
    math: `${c2_eq2}·s₂ + ${c3_eq2}(${s3}) ≡ ${targets[1]}  ⇒  s₂ = ${s2}` 
  });

  // Solve s_1 from Eq 1 (index 0)
  const c1_eq1 = sys[0].coeffs[0];
  const c2_eq1 = sys[0].coeffs[1];
  const c3_eq1 = sys[0].coeffs[2];
  if (c1_eq1 === 0) {
    logs.push({ type: "conflict", text: "Eq 1 has no s_1 coefficient." });
    return { success: false, s: null, logs };
  }
  const lhs1 = mod(targets[0] - c2_eq1 * s2 - c3_eq1 * s3, Q);
  const s1 = mod(lhs1 * modInverse(c1_eq1, Q), Q);
  logs.push({ 
    type: "eq1", 
    text: "Back-substituting s₂, s₃ into Eq 1:", 
    math: `${c1_eq1}·s₁ + ${c2_eq1}(${s2}) + ${c3_eq1}(${s3}) ≡ ${targets[0]}  ⇒  s₁ = ${s1}` 
  });

  logs.push({ type: "success", text: "All equations satisfied!" });
  return { success: true, s: [s1, s2, s3], logs };
}
