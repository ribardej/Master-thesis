import type { Lesson } from "../../types";

export const lesson7: Lesson = {
  id: "module-2-lesson-7",
  title: "ML-KEM",
  slides: [
    {
      title: "ML-KEM",
      content: `# Chapter 7: ML-KEM in Detail`
    },
    {
      title: "LWE: Math Prerequisites",
      content: `# Learning with Errors — Mathematical Prerequisites

- **Integers modulo $q$** ($\\mathbb{Z}_q$): The ring of integers $\\{0, 1, \\dots, q-1\\}$ with arithmetic performed modulo $q$

- **Vector space** $\\mathbb{Z}_q^n$: Column vectors of dimension $n$ with entries in $\\mathbb{Z}_q$

- **Symmetric mod $q$** (mods): For odd $q \\ge 3$ and $r \\in \\mathbb{Z}_q$:

$$ r \\text{ mods } q = \\begin{cases} r, & \\text{if } r \\le \\frac{(q-1)}{2} \\\\ r-q, & \\text{if } r > \\frac{(q-1)}{2} \\end{cases} $$

This maps $r$ into the range $[-\\frac{(q-1)}{2}, \\frac{(q-1)}{2}]$.
For example with $q=17$:
- $5 \\text{ mods } 17 = 5$ 
- $14 \\text{ mods } 17 = -3$

- $\\in_R$ denotes **sampling uniformly at random** from a set`
    },
    {
      title: "LWE: Definition",
      content: `# Learning with Errors (LWE)

First introduced by Oded Regev in 2005. 18 of 49 first-round NIST PQC submissions for key exchange were LWE-based.

**LWE**$(m, n, q, B)$: Let $s \\in_R \\mathbb{Z}_q^n$ and $e \\in_R [-B, B]^m$.

Given $A \\in_R \\mathbb{Z}_q^{m \\times n}$ and $b = As + e \\pmod{q}$, find $s$.

$$\\underbrace{\\begin{bmatrix} & & \\\\\\\\ & A & \\\\\\\\ & & \\end{bmatrix}}_{m \\times n} \\times \\underbrace{\\begin{bmatrix} \\\\\\ s \\\\\\ \\end{bmatrix}}_{n \\times 1} + \\underbrace{\\begin{bmatrix} \\\\\\\\ e \\\\\\\\\\ \\end{bmatrix}}_{m \\times 1} = \\underbrace{\\begin{bmatrix} \\\\\\\\\ b \\\\\\\\\\ \\end{bmatrix}}_{m \\times 1} \\pmod{q}$$

Without the error $e$, this is just a system of linear equations — solvable by Gaussian elimination. The small error $e$ makes the problem **computationally hard**.`
    },
    {
      title: "LWE: Gaussian Elimination",
      content: `
[COMPONENT: LWEGaussianElimination]`
    },
    {
      title: "LWE-based PKE",
      content: `# LWE-based Public Key Encryption

Introduced by Lindner-Peikert (2010). **Encrypts just one bit** Parameters: $(n, q, B)$

**Key Generation (Alice):**
1. Select $s \\in_R [-B, B]^n$, $e \\in_R [-B, B]^n$, $A \\in_R \\mathbb{Z}_q^{n \\times n}$
2. Compute $b = As + e \\pmod{q}$
3. **Public key**: $(A, b)$; **Private key**: $s$

**Encryption (Bob):** To encrypt $m \\in \\{0,1\\}$:
1. Select $r, z \\in_R [-B, B]^n$ and $z' \\in_R [-B, B]$
2. Compute $c_1 = A^T r + z$ and $c_2 = b^T r + z' + m \\lceil q/2 \\rfloor$
3. Send $c = (c_1, c_2)$ to Alice

**Decryption (Alice):**
1. Compute $m = \\text{Round}_q(c_2 - s^T c_1)$

Where $\\text{Round}_q(x) = \\begin{cases} 0, & \\text{if } -q/4 \\le x \\text{ mods } q \\le  q/4\\\\ 1, & else \\end{cases} $`
    },
    {
      title: "Motivation for Ring-LWE",
      content: `# From LWE to Ring-LWE

The basic LWE-based PKE has a fundamental **practical limitation**:

- It can only encrypt **one bit per ciphertext**
- The matrix $A$ is completely **unstructured** — requiring $O(n^2)$ storage and computation

Cryptographers explored **structured variants** of LWE:
- **Ring-LWE**: Replace $\\mathbb{Z}_q$ with a polynomial ring $R_q$
-- Allows encryption of **$n$ bits** at a time
-- Matrix $A$ gains algebraic structure → more efficient

- **Module-LWE (MLWE)**: A middle ground — vectors of polynomials
-- Flexible security levels by changing vector dimension $k$
-- Keeps $n$ and $q$ fixed → efficient implementation

No known attacks leverage the additional structure of Ring-LWE or MLWE — the problems remain believed to be hard.`
    },
    {
      title: "Ring-LWE: Polynomial Ring",
      content: `# Polynomial Ring $R_q$

Introduced by Lyubashevsky, Peikert, and Regev in 2010.

The polynomial ring $R_q$ is defined as the quotient ring:
$$ R_q = \\mathbb{Z}_q[x] / (x^n + 1) $$

Elements of $R_q$ are polynomials of degree less than $n$ with coefficients in $\\mathbb{Z}_q$.

**Addition** is performed coefficient-wise modulo $q$. Example with $n=4$, $q=17$:

$a(x) = 4 + 15x^2 + 2x^3$, $\\quad b(x) = 14 + 3x + 5x^2 + 9x^3$

$a + b = (4{+}14) + (0{+}3)x + (15{+}5)x^2 + (2{+}9)x^3 = 18 + 3x + 20x^2 + 11x^3$

Reducing mod $17$: $\\quad 1 + 3x + 3x^2 + 11x^3$

**Vector notation:** Polynomials are stored as coefficient vectors:
$$\\mathbf{a} = \\begin{bmatrix} 4 \\\\\\ 0 \\\\\\ 15 \\\\\\ 2 \\end{bmatrix}, \\quad \\mathbf{b} = \\begin{bmatrix} 14 \\\\\\ 3 \\\\\\ 5 \\\\\\ 9 \\end{bmatrix}, \\quad \\mathbf{a+b} \\equiv \\begin{bmatrix} 1 \\\\\\ 3 \\\\\\ 3 \\\\\\ 11 \\end{bmatrix} \\pmod{17}$$`
    },
    {
      title: "Ring-LWE: Multiplication in R_q",
      content: `# Multiplication in $R_q$

Multiplication is a two-step process: polynomial product, then reduction modulo $(x^n + 1)$.

**Example** ($n=4$, $q=17$): $a(x) = 4 + 15x^2 + 2x^3$, $b(x) = 14 + 3x + 5x^2 + 9x^3$

**Step 1 — Classical polynomial product:**
$$s(x) = a(x) \\times b(x) \\equiv 5 + 12x + 9x^2 + 7x^3 + 13x^4 + 9x^5 + x^6 \\pmod{17}$$

**Step 2 — Reduction by** $(x^n + 1)$: Since $x^n \\equiv -1 \\pmod{x^n+1}$:
- $x^4 \\to -1$, $\\quad x^5 \\to -x$, $\\quad x^6 \\to -x^2$

$$s(x) \\bmod (x^4+1) = (5-13) + (12-9)x + (9-1)x^2 + 7x^3$$
$$= 9 + 3x + 8x^2 + 7x^3 \\pmod{17}$$`
    },
    {
      title: "Anti-circulant Matrix Representation",
      content: `# Polynomial Multiplication via Anti-circulant Matrices

Polynomial multiplication in $R_q$ can be expressed as a **matrix-vector product**. Multiplying by $x$ in $R_q$ corresponds to a right cyclic shift with negation of the wrapped element.

If $c(x) = a(x) \\times b(x)$ in $R_q$, then:
$$\\begin{bmatrix} c_0 \\\\\\ c_1 \\\\\\ \\vdots \\\\\\ c_{n-1} \\end{bmatrix} = \\underbrace{\\begin{bmatrix} a_0 & -a_{n-1} & \\cdots & -a_1 \\\\\\ a_1 & a_0 & \\cdots & -a_2 \\\\\\ \\vdots & \\vdots & & \\vdots \\\\\\ a_{n-1} & a_{n-2} & \\cdots & a_0 \\end{bmatrix}}_{\\overline{\\text{circ}}(a)} \\begin{bmatrix} b_0 \\\\\\ b_1 \\\\\\ \\vdots \\\\\\ b_{n-1} \\end{bmatrix}$$

**Example** ($n=4$, $q=17$, $a(x) = 4 + 15x^2 + 2x^3$):
$$\\overline{\\text{circ}}(a) = \\begin{bmatrix} 4 & 15 & 2 & 0 \\\\\\ 0 & 4 & 15 & 2 \\\\\\ 15 & 0 & 4 & 15 \\\\\\ 2 & 15 & 0 & 4 \\end{bmatrix} \\pmod{17}$$

This matrix structure is the key to understanding **why Ring-LWE is a special case of LWE** with a structured matrix $A$.`
    },
    {
      title: "Norms and Small Polynomials",
      content: `# Size of Integers, Polynomials, and Small Polynomial Sets

**Size (infinity norm) of an integer:** For $r \\in \\mathbb{Z}_q$ (odd $q \\ge 3$):
$$\\|r\\|_\\infty = |r \\text{ mods } q|$$
So $0 \\le \\|r\\|_\\infty \\le (q-1)/2$. For $q=17$: $\\|5\\|_\\infty = 5$ and $\\|14\\|_\\infty = 3$

**Size of a polynomial:** For $f(x) = f_0 + f_1 x + \\cdots + f_{n-1}x^{n-1} \\in R_q$:
$$\\|f\\|_\\infty = \\max_i \\|f_i\\|_\\infty$$

**Set of small polynomials** $S_\\xi$: For a positive integer $\\xi$ small compared to $q/2$:
$$S_\\xi = \\{f \\in R_q \\mid \\|f\\|_\\infty \\le \\xi\\}$$

These definitions are crucial for ML-KEM — the **secret key** and **error polynomials** are always sampled from $S_\\xi$ with small $\\xi$, ensuring that decryption errors remain bounded.`
    },
    {
      title: "Ring-LWE: Definition",
      content: `# Ring-LWE Definition

**Ring-LWE**$(n, k, q, B)$: Let $s \\in_R R_q$ and $e_1, \\dots, e_k \\in_R S_B$ where $B \\ll q/2$.

Let $a_1, \\dots, a_k \\in_R R_q$ and $b_i = a_i s + e_i \\in R_q$ for $i = 1, \\dots, k$.

Given the $a_i$ and $b_i$, determine $s$.

This is equivalent to solving a **special case of LWE** where the matrix $A$ has anti-circulant block structure:

$$\\underbrace{\\begin{bmatrix} \\overline{\\text{circ}}(a_1) \\\\\\ \\vdots \\\\\\ \\overline{\\text{circ}}(a_k) \\end{bmatrix}}_{kn \\times n} \\times \\underbrace{\\begin{bmatrix} s \\end{bmatrix}}_{n \\times 1} + \\underbrace{\\begin{bmatrix} e_1 \\\\\\ \\vdots \\\\\\ e_k \\end{bmatrix}}_{kn \\times 1} = \\underbrace{\\begin{bmatrix} b_1 \\\\\\ \\vdots \\\\\\ b_k \\end{bmatrix}}_{kn \\times 1}$$

The structured matrix makes Ring-LWE **more efficient** than standard LWE, while no known attacks exploit this structure.`
    },
    {
      title: "Ring-LWE based PKE",
      content: `# Ring-LWE based PKE

Introduced by Lindner-Peikert (2010). Parameters: $(n, q, B)$

**Key Generation (Alice):**
1. Select $s \\in_R S_B$, $a \\in_R R_q$, and $e \\in_R S_B$
2. Compute $b = as + e \\in R_q$
3. **Public key**: $(a, b)$; **Private key**: $s$

**Encryption (Bob):** To encrypt $m \\in \\{0,1\\}^n$:
1. Select $r, z, z' \\in_R S_B$
2. Compute $c_1 = ar + z$ and $c_2 = br + z' + m\\lceil q/2 \\rfloor$
3. Send $c = (c_1, c_2)$ to Alice — both $c_1, c_2 \\in R_q$

**Decryption (Alice):**
1. Compute $m = \\text{Round}_q(c_2 - s \\cdot c_1)$

The Ring-LWE PKE encrypts **$n$ bits at a time** (the degree of the reduction polynomial), a major improvement over the 1-bit LWE PKE.`
    },
    {
      title: "Module-LWE: Prerequisites",
      content: `# Module-LWE — Mathematical Prerequisites

**The Module $R_q^k$**: Column vectors of dimension $k$ where each entry is a polynomial from $R_q$:

$$\\mathbf{p} = \\begin{bmatrix} p_1(x) \\\\\\ p_2(x) \\\\\\ \\vdots \\\\\\ p_k(x) \\end{bmatrix} \\in R_q^k$$

**Addition in $R_q^k$**: Performed component-wise (each polynomial component is added in $R_q$).

**Inner product in $R_q^k$**: For $\\mathbf{a}, \\mathbf{b} \\in R_q^k$:

$$\\mathbf{a} \\cdot \\mathbf{b} = a_1 b_1 + a_2 b_2 + \\cdots + a_k b_k \\in R_q$$

The result is a **single polynomial** in $R_q$ — each $a_i b_i$ is a polynomial multiplication in $R_q$, and the products are summed.`
    },
    {
      title: "Module-LWE: Definition",
      content: `# Module-LWE (MLWE) Definition

**MLWE**$(n, k, \\ell, q, B)$: Let $s \\in_R R_q^\\ell$ and $e \\in_R S_B^k$ where $k > \\ell$ and $B \\ll q/2$.

Let $a_1, \\dots, a_k \\in_R R_q^\\ell$ and $b_i = a_i^T s + e_i \\in R_q$.

Given the $a_i$ and $b_i$, find $s$.

$$\\underbrace{\\begin{bmatrix} \\overline{\\text{circ}}(a_{11}) & \\cdots & \\overline{\\text{circ}}(a_{\\ell 1}) \\\\\\ \\vdots & & \\vdots \\\\\\ \\overline{\\text{circ}}(a_{1k}) & \\cdots & \\overline{\\text{circ}}(a_{\\ell k}) \\end{bmatrix}}_{kn \\times \\ell n} \\times \\underbrace{\\begin{bmatrix} s_1 \\\\\\ \\vdots \\\\\\ s_\\ell \\end{bmatrix}}_{\\ell n \\times 1} + \\underbrace{\\begin{bmatrix} e_1 \\\\\\ \\vdots \\\\\\ e_k \\end{bmatrix}}_{kn \\times 1} = \\underbrace{\\begin{bmatrix} b_1 \\\\\\ \\vdots \\\\\\ b_k \\end{bmatrix}}_{kn \\times 1}$$

- Setting $\\ell = 1$ gives **Ring-LWE**
- Setting $n = 1$ (replacing $R_q$ with $\\mathbb{Z}_q$) gives standard **LWE**
- The practical advantage: **fix $n$ and $q$** for efficient arithmetic, vary $\\ell$ for different security levels`
    },
    {
      title: "Relation to Lattices",
      content: `# Relation to Lattices

LWE, Ring-LWE, and MLWE are fundamentally **geometric problems** — the most efficient approaches to solve them are geometric. That is why ML-KEM is classified as **lattice-based**.

Finding the secret $s$ given noisy equations is equivalent to the **Bounded Distance Decoding** (BDD) problem on a lattice:

- **LWE → Standard ($q$-ary) Lattices:** The matrix $A$ generates a lattice $\\mathcal{L}(A)$. The vector $b = As + e$ is a point **close to** the lattice point $As$. Recovering $s$ means finding the nearest lattice point.

- **Ring-LWE → Ideal Lattices:** The ring $R_q$ corresponds to lattices with **rotational symmetry** — shifting a polynomial by $x$ keeps it in the lattice. Fast multiplication, but security relies on this structured lattice class.

- **MLWE → Module Lattices:** A middle ground — **less structure** than ideal lattices (stronger security assurance), **more structure** than standard lattices (maintains efficiency). This trade-off is why MLWE was chosen for ML-KEM.

Security relies on the conjecture that finding the shortest or closest vector in high-dimensional lattices is infeasible for both **classical and quantum** computers.`
    },
    {
      title: "Kyber-PKE (K-PKE)",
      content: `# Kyber-PKE (Module-LWE based encryption scheme)

The core building block of ML-KEM. Input parameters: $q, n, k, \\eta_1, \\eta_2$.

**Key Generation (Alice):**
1. Select $A \\in_R R_q^{k \\times k}$, $s \\in_R S_{\\eta_1}^k$, $e \\in_R S_{\\eta_1}^k$
2. Compute $t = As + e$
3. **Public key**: $(A, t)$; **Private key**: $s$

**Encryption (Bob):** To encrypt $m \\in \\{0, 1\\}^n$:
1. Select $r \\in_R S_{\\eta_1}^k$, $e_1 \\in_R S_{\\eta_2}^k$, $e_2 \\in_R S_{\\eta_2}$
2. Compute $u = A^T r + e_1$ and $v = t^T r + e_2 + \\lceil q/2 \\rfloor \\cdot m$
3. Output ciphertext $c = (u, v)$

**Decryption (Alice):**
1. Compute $m = \\text{Round}_q(v - s^T u)$`
    },
    {
      title: "Kyber-PKE: Correctness and Security",
      content: `# Kyber-PKE: Decryption Correctness & Security

**Why decryption works:** Expanding $v - s^T u$:

$$v - s^T u = (t^T r + e_2 + \\lceil q/2 \\rfloor m) - s^T(A^T r + e_1)$$

Substituting $t^T = s^T A^T + e^T$:

$$= e^T r + e_2 - s^T e_1 + \\lceil q/2 \\rfloor m$$

Decryption succeeds if every coefficient $E_i$ of the error polynomial $E(x) = e^T r + e_2 - s^T e_1$ satisfies $\\|E_i\\|_\\infty < q/4$.

**CPA Security:** Kyber-PKE is secure against **chosen-plaintext attacks** — an attacker learns nothing about $s$ from encrypting messages with the public key.

**CCA Vulnerability:** However, it is **not secure** against **chosen-ciphertext attacks**. An active attacker could craft malicious ciphertexts (not using small error polynomials) that cause decryption failures, leaking information about $s$.`
    },
    {
      title: "Key Encapsulation Mechanism",
      content: `# Why a Key Encapsulation Mechanism (KEM)?

Since Kyber-PKE is vulnerable to **chosen-ciphertext attacks**, a security improvement is needed.

A **KEM** wraps the PKE to produce a shared secret key instead of encrypting arbitrary messages:
- The sender **encapsulates**: generates a random message, encrypts it, and derives a shared key
- The receiver **decapsulates**: decrypts to recover the message and derives the same shared key

**The Fujisaki-Okamoto (FO) Transform** converts Kyber-PKE into Kyber-KEM by:
1. Making encryption **deterministic** — the randomness is derived from a hash of the message
2. Adding **implicit rejection** — if a ciphertext is tampered with, a pseudorandom key is returned instead of failing
3. Enabling **re-encryption check** — the receiver can verify ciphertext authenticity

This ensures **plaintext awareness**: an attacker cannot create a valid ciphertext without knowing the underlying message.`
    },
    {
      title: "Kyber-KEM",
      content: `# Kyber-KEM

Domain parameters: $n=256, q, k, \\eta_1, \\eta_2$, hash functions $G, H, J$.

**Key Generation (Alice):**
1. Generate Kyber-PKE keys: encryption key $(A, t)$, decryption key $s$
2. Select $z \\in_R \\{0,1\\}^{256}$
3. **Encapsulation key**: $ek = (A, t)$; **Decapsulation key**: $dk = (s, ek, H(ek), z)$

**Encapsulation (Bob):**
1. Select $m \\in_R \\{0,1\\}^{256}$
2. Compute $(K, R) = G(m, H(ek))$
3. Encrypt $m$ with Kyber-PKE using $R$ as the deterministic seed → ciphertext $c$
4. Output shared key $K$ and ciphertext $c$

**Decapsulation (Alice):**
1. Decrypt $c$ using Kyber-PKE → plaintext $m'$
2. Compute $(K', R') = G(m', H(ek))$ and $\\overline{K} = J(z, c)$
3. **Re-encrypt** $m'$ using $R'$ → ciphertext $c'$
4. If $c \\neq c'$: return $\\overline{K}$ (implicit rejection)
5. If $c = c'$: return $K'$ (valid shared key)`
    },
    {
      title: "Kyber-KEM Flow",
      content: `
[COMPONENT: KyberKEMFlow]`
    },
    {
      title: "ML-KEM (FIPS 203)",
      content: `# ML-KEM Standard (FIPS 203)

The official ML-KEM standard is derived from CRYSTALS-Kyber with standardizing refinements:

- **Symmetric primitives:** Exclusively uses FIPS 202 **Keccak**-based functions (SHA3-256, SHA3-512, SHAKE-128, SHAKE-256). The "90s variant" using AES/SHA-2 is excluded.
- **Serialization:** Rigorous **ByteEncode/ByteDecode** routines for strict interoperability.
- **Input validation:** Explicit checks that decoded coefficients lie in $[0, q-1]$.

**Parameter Sets:**

| | $n$ | $q$ | $k$ | $\\eta_1$ | $\\eta_2$ | Security |
|---|---|---|---|---|---|---|
| **ML-KEM-512** | 256 | 3329 | 2 | 3 | 2 | 128-bit |
| **ML-KEM-768** | 256 | 3329 | 3 | 2 | 2 | 192-bit |
| **ML-KEM-1024** | 256 | 3329 | 4 | 2 | 2 | 256-bit |

Note how $n=256$ and $q=3329$ are **fixed** across all levels — only $k$ changes, demonstrating the practical advantage of the MLWE construction.`
    },
    {
      title: "Further Reading",
      content: `# Further Reading

- [On Lattices, Learning with Errors, and Cryptographic Constructions (Regev, 2005)](https://arxiv.org/abs/2401.03703)
-- The foundational paper introducing the LWE problem.

- [On Ideal Lattices and Learning with Errors Over Rings (Lyubashevsky, Peikert, Regev, 2010)](https://eprint.iacr.org/2012/230)
-- Introduces Ring-LWE and proves its hardness.

- [Better Key Sizes (and Attacks) for LWE-Based Encryption (Lindner, Peikert, 2011)](https://eprint.iacr.org/2010/613)
-- The LWE and Ring-LWE based PKE schemes discussed in this chapter.

- [FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard](https://csrc.nist.gov/pubs/fips/203/final)
-- The official ML-KEM standard.

- [SIKE is broken (Castryck, Decru, 2022)](https://eprint.iacr.org/2022/975)
-- The paper that broke SIKE in minutes on a single core.

- [Handbook of Applied Cryptography, Chapter 1 (Menezes et al.)](https://cacr.uwaterloo.ca/hac/)
-- Reference for polynomial arithmetic and anti-circulant matrix representation.`
    },
  ],
};
