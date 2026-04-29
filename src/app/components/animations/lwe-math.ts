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

  for (let col = 0; col < N && col < M - 1; col++) {
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

// Back-substitution attempt: given error guess, subtract from b, solve A·s = b-e mod q
// Returns s if solvable, null otherwise
export function trySolve(A: number[][], b: number[], eGuess: number[]): number[] | null {
  // Subtract guessed error from b
  const bAdj = b.map((v, i) => mod(v - eGuess[i], Q));

  // Build augmented matrix [A | bAdj] for first 3 rows (3×3 system)
  const aug = A.slice(0, N).map((row, i) => [...row, bAdj[i]]);

  // Forward elimination
  for (let col = 0; col < N; col++) {
    // Find pivot
    let pivotRow = -1;
    for (let r = col; r < N; r++) {
      if (aug[r][col] !== 0) { pivotRow = r; break; }
    }
    if (pivotRow === -1) return null;
    if (pivotRow !== col) [aug[col], aug[pivotRow]] = [aug[pivotRow], aug[col]];

    const inv = modInverse(aug[col][col], Q);
    if (inv === 0) return null;

    // Scale pivot row
    for (let j = 0; j <= N; j++) aug[col][j] = mod(aug[col][j] * inv, Q);

    // Eliminate
    for (let r = 0; r < N; r++) {
      if (r === col) continue;
      const f = aug[r][col];
      for (let j = 0; j <= N; j++) aug[r][j] = mod(aug[r][j] - f * aug[col][j], Q);
    }
  }

  const s = aug.map(row => row[N]);

  // Verify against ALL rows (including row 4)
  for (let i = 0; i < M; i++) {
    const lhs = mod(A[i].reduce((sum, a, j) => sum + a * s[j], 0), Q);
    if (lhs !== bAdj[i]) return null;
  }

  return s;
}
