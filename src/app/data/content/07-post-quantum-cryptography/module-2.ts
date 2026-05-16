import type { Lesson } from "../../types";

export const lesson7: Lesson = {
  id: "module-2-lesson-7",
  title: "Post Quantum Cryptography",
  slides: [
    {
      title: "ML-KEM",
      content: `# Chapter 7: Post Quantum Cryptography in Detail`
    },
    {
      title: "ML-KEM",
      content: `# Overview
      
      As explained in the Overview section, Post Quantum Cryptography is a set of **classical protocols** that are believed to be resistant against attackers with **quantum computers**, however without a guarantee.
      -- Similarly, there **was not a guarantee** that RSA or (EC)DH would be resistant against attackers with classical computers at the time they were introduced.

      In this chapter, we will focus on the **ML-KEM protocol**, that is categorized as lattice-based since the best known attack works by reducing it to a certain lattice problem.
      - The protocol itself is based on the **Learning With Errors** problem, which is not a lattice problem by definition.

      Other protocols such as HQC or post quantum digital signature schemes are not covered in this detailed chapter since my thesis topic is the ML-KEM protocol.
      `
    },
    {
      title: "LWE: Math Prerequisites",
      content: `# Learning with Errors - math prerequisites

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

Without the error $e$, this is just a system of linear equations - solvable by Gaussian elimination. The small error $e$ makes the problem **computationally hard**.`
    },
    {
      title: "LWE: Gaussian Elimination",
      content: `
[COMPONENT: LWEGaussianElimination]`
    },
    {
      title: "Lattices",
      content: `## Lattices

A **lattice** $\\mathcal{L}$ is a discrete additive subgroup of $\\mathbb{R}^n$. Equivalently, given linearly independent vectors $\\mathbf{b}_1, \\dots, \\mathbf{b}_d \\in \\mathbb{R}^n$, the lattice they generate is:

$$\\mathcal{L}(\\mathbf{b}_1, \\dots, \\mathbf{b}_d) = \\left\\{ \\sum_{i=1}^{d} z_i \\mathbf{b}_i \\;\\middle|\\; z_i \\in \\mathbb{Z} \\right\\}$$

The vectors $\\mathbf{b}_1, \\dots, \\mathbf{b}_d$ form a **basis** of the lattice. A lattice can have many different bases, but the set of lattice points is always the same.

**Example** ($d = 2$, $n = 2$): Let $\\mathbf{b}_1 = \\begin{bmatrix} 2 \\\\\\ 1 \\end{bmatrix}$, $\\mathbf{b}_2 = \\begin{bmatrix} 0 \\\\\\ 3 \\end{bmatrix}$. The lattice $\\mathcal{L}(\\mathbf{b}_1, \\mathbf{b}_2)$ consists of all points $z_1 \\begin{bmatrix} 2 \\\\\\ 1 \\end{bmatrix} + z_2 \\begin{bmatrix} 0 \\\\\\ 3 \\end{bmatrix}$ for $z_1, z_2 \\in \\mathbb{Z}$.

Two fundamental hard problems on lattices:
- **Shortest Vector Problem (SVP)**: Find the shortest non-zero vector in the lattice
- **Bounded Distance Decoding (BDD)**: Given a target point **close** to a lattice point, find that nearest lattice point`
    },
    {
      title: "LWE: Gaussian Elimination",
      content: `## How to solve LWE using lattices
      - An LWE instance can be viewed as a specific **lattice problem**. Namely, the **Bounded Distance Decoding**
      
      - The fastest way to solve BDD (and also LWE) is to consequently convert it to the **Shortest Vector Problem** (SVP), which can be solved more efficiently.
      -- This way of solving LWE is called the Primal attack using a Kannan embedding
      -- Time complexity is **exponential**, namely $2^{0.292n}$, where $n$ is dimension of the secret vector
      `
    },
    {
      title: "LWE via BDD",
      content: `## LWE as Bounded Distance Decoding

**LWE lattice:** Given the public matrix $A \\in \\mathbb{Z}_q^{m \\times n}$, the associated $q$-ary lattice is:

$$L_A = \\{ y \\in \\mathbb{Z}^m : As = y \\pmod{q} \\text{ for some } s \\in \\mathbb{Z}^n \\} \\subseteq \\mathbb{R}^m$$

For an LWE instance $(A, b, s, e)$, where $y = As \\bmod q \\in L_A$

**Bounded Distance Decoding** (BDD$_\\alpha$):
- Given a lattice $L = L(D) \\subseteq \\mathbb{R}^m$ and $b \\in \\mathbb{R}^m$ with the guarantee that there is a unique $y \\in L$ within distance $\\alpha$ of $b$, find $y$.
-- The observation $b$ is the noisy vector $As + e$
-- The target lattice point $y = As \\bmod q$ is the closest point in $L_A$
-- The distance $\\alpha = \\|e\\|_2$ is small by construction`
    },
    {
      title: "LWE Lattice Visualization",
      content: `## Analogy for the LWE associated $q$-ary Lattice in 2D

[COMPONENT: BDDLatticeImage]

The lattice $L_A$ is periodic modulo $q$ in every coordinate - the blue box. The point $b$ (red) lies close to the lattice point $y$ (black) - recovering $y$ solves BDD and reveals $s$.`
    },

    {
      title: "LWE-based PKE",
      content: `# LWE-based Public Key Encryption

Introduced by Lindner-Peikert (2011). **Encrypts just one bit** Parameters: $(n, q, B)$

**Key Generation (You):**
1. Select $s \\in_R [-B, B]^n$, $e \\in_R [-B, B]^n$, $A \\in_R \\mathbb{Z}_q^{n \\times n}$
2. Compute $b = As + e \\pmod{q}$
3. **Public key**: $(A, b)$; **Private key**: $s$

**Encryption (Your friend):** To encrypt $m \\in \\{0,1\\}$:
1. Select $r, z \\in_R [-B, B]^n$ and $z' \\in_R [-B, B]$
2. Compute $c_1 = A^T r + z$ and $c_2 = b^T r + z' + m \\lceil q/2 \\rfloor$
3. Send $c = (c_1, c_2)$ to You

**Decryption (You):**
1. Compute $m = \\text{Round}_q(c_2 - s^T c_1)$

Where $\\text{Round}_q(x) = \\begin{cases} 0, & \\text{if } -q/4 \\le x \\text{ mods } q \\le  q/4\\\\ 1, & else \\end{cases} $`
    },
    {
      title: "LWE-based PKE: The Idea",
      content: `## The idea behind the encryption scheme

- The message bit $m$ is **scaled** by $\\lceil q/2 \\rfloor$ to "separate" it from the noise.

- All secret vectors and errors are **small** (bounded by $B$), so their products remain small.

- **Extra noise** in form of $b^T r = s^T A^T r$ and $A^T r$ is added to the ciphertexts so it is indistinguishable from random.
-- This "big" noise is why the ciphertexts appear random modulo $q$
-- The noise **cancels out** in the decryption process.

- After decryption the remaining noise consisits from only products of small vectors
-- The rounding function can then distinguish between $0$ and $\\lceil q/2 \\rfloor$.`
    },
    {
      title: "LWE-based PKE: The Idea",
      content: `## Mathematical proof

Expand the decryption expression $c_2 - s^T c_1$:

$$c_2 - s^T c_1 = (b^T r + z' + m \\lceil q/2 \\rfloor) - s^T(A^T r + z)$$

Substitute $b = As + e$, so $b^T = s^T A^T + e^T$:

$$= s^T A^T r + e^T r + z' + m \\lceil q/2 \\rfloor - s^T A^T r - s^T z$$

The terms $s^T A^T r$ cancel:

$$= \\underbrace{e^T r + z' - s^T z}_{\\text{small error } E} + m \\lceil q/2 \\rfloor$$

Since $s, e, r, z, z'$ are all bounded by $B$, the total error $E$ satisfies $|E| \\le nB^2 + B + nB^2 = 2nB^2 + B$.
-- Decryption succeeds when $|E| < q/4$, which holds for appropriate parameter choices
-- If $m=0$: the result is close to $0$ → $\\text{Round}_q$ outputs $0$
-- If $m=1$: the result is close to $\\lceil q/2 \\rfloor$ → $\\text{Round}_q$ outputs $1$`
    },
    {
      title: "Motivation for Ring-LWE",
      content: `# From LWE to Ring and Module LWE

The basic LWE-based PKE has fundamental **practical limitations**:

- It can only encrypt **one bit per ciphertext**
- The matrix $A$ is completely **unstructured** - requiring $O(n^2)$ storage and computation

Cryptographers explored **structured variants** of LWE:
- **Ring-LWE**: Replace $\\mathbb{Z}_q$ with a polynomial ring $R_q$
-- Allows encryption of **$n$ bits** at a time
-- Matrix $A$ gains algebraic structure → more efficient

- **Module-LWE (MLWE)**: A middle ground - vectors of polynomials
-- Flexible security levels by changing vector dimension $k$
-- Keeps $n$ and $q$ fixed → efficient implementation

No known attacks leverage the additional structure of Ring-LWE or MLWE - the problems remain believed to be equally hard as LWE.`
    },
    {
      title: "Ring-LWE: Polynomial Ring",
      content: `## Polynomial-Ring Learning With Errors (RLWE) - math prerequisites

Introduced by Lyubashevsky, Peikert, and Regev in 2010. Instead of a secret vector $s \\in \\mathbb{Z}_q^n $ Uses anti-cyclic polynomial rings

The anti-cyclic polynomial ring $R_q$ is defined as the quotient ring:
$$ R_q = \\mathbb{Z}_q[x] / (x^n + 1) $$

Elements of $R_q$ are polynomials of degree less than $n$ with coefficients in $\\mathbb{Z}_q$.

`
    },
    {
      title: "Norms and Small Polynomials",
      content: `## Size of Integers and Polynomials

**Size (infinity norm) of an integer:** For $r \\in \\mathbb{Z}_q$ (odd $q \\ge 3$):
$$\\|r\\|_\\infty = |r \\text{ mods } q|$$
So $0 \\le \\|r\\|_\\infty \\le (q-1)/2$. For $q=17$: $\\|5\\|_\\infty = 5$ and $\\|14\\|_\\infty = 3$

**Size of a polynomial:** For $f(x) = f_0 + f_1 x + \\cdots + f_{n-1}x^{n-1} \\in R_q$:
$$\\|f\\|_\\infty = \\max_i \\|f_i\\|_\\infty$$

**Set of small polynomials** $S_\\xi$: For a positive integer $\\xi$ small compared to $q/2$:
$$S_\\xi = \\{f \\in R_q \\mid \\|f\\|_\\infty \\le \\xi\\}$$

LWE based encryption schemes use small integers/polynomials to ensure the decryption error is negligably small.`
    },
    {
      title: "Ring-LWE: Multiplication in R_q",
      content: `# Arithmetics in $R_q$

**Addition** is performed coefficient-wise modulo $q$. Example in $ R_{17} = \\mathbb{Z}_{17}[x] / (x^4 + 1) $:

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

**Step 1 - Classical polynomial product:**
$$s(x) = a(x) \\times b(x) \\equiv 5 + 12x + 9x^2 + 7x^3 + 13x^4 + 9x^5 + x^6 \\pmod{17}$$

**Step 2 - Reduction by** $(x^n + 1)$: Since $x^n \\equiv -1 \\pmod{x^n+1}$:
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
$$\\overline{\\text{circ}}(a) = \\begin{bmatrix} 4 & -2 & -15 & 0 \\\\\\ 0 & 4 & -2 & -15 \\\\\\ 15 & 0 & 4 & -2 \\\\\\ 2 & 15 & 0 & 4 \\end{bmatrix} = \\begin{bmatrix} 4 & 15 & 2 & 0 \\\\\\ 0 & 4 & 15 & 2 \\\\\\ 15 & 0 & 4 & 15 \\\\\\ 2 & 15 & 0 & 4 \\end{bmatrix} \\pmod{17}$$`
    },
    {
      title: "Ring-LWE: Matrix Multiplication Example",
      content: `# Polynomial Multiplication via Anti-circulant Matrices

The product $a(x) \\times b(x)$:
$$a(x) \\times b(x) = \\begin{bmatrix} 4 & 15 & 2 & 0 \\\\\\ 0 & 4 & 15 & 2 \\\\\\ 15 & 0 & 4 & 15 \\\\\\ 2 & 15 & 0 & 4 \\end{bmatrix} \\times \\begin{bmatrix} 14 \\\\\\ 3 \\\\\\ 5 \\\\\\ 9 \\end{bmatrix} = \\begin{bmatrix} 9 \\\\\\ 3 \\\\\\ 8 \\\\\\ 7 \\end{bmatrix} \\pmod{17}$$

This matrix structure shows **why Ring-LWE is a special case of LWE** with a structured matrix $A$.`
    },
    {
      title: "Ring-LWE: Definition",
      content: `# Ring-LWE Definition

**Ring-LWE**$(n, k, q, B)$: Let $s \\in_R R_q$ and $e_1, \\dots, e_k \\in_R S_B$ where $B \\ll q/2$.

Let $a_1, \\dots, a_k \\in_R R_q$ and $b_i = a_i s + e_i \\in R_q$ for $i = 1, \\dots, k$.

Given the $a_i$ and $b_i$, determine $s$.

This is equivalent to solving a **special case of LWE** where the matrix $A$ has anti-circulant block structure:

$$\\underbrace{\\begin{bmatrix} \\overline{\\text{circ}}(a_1) \\\\\\\\ \\vdots \\\\\\\\ \\overline{\\text{circ}}(a_k) \\end{bmatrix}}_{kn \\times n} \\times \\underbrace{\\begin{bmatrix} \\\\ s \\\\\\ \\end{bmatrix}}_{n \\times 1} + \\underbrace{\\begin{bmatrix} e_1 \\\\\\\\ \\vdots \\\\\\\\ e_k \\end{bmatrix}}_{kn \\times 1} = \\underbrace{\\begin{bmatrix} b_1 \\\\\\\\ \\vdots \\\\\\\\ b_k \\end{bmatrix}}_{kn \\times 1}$$

The structured matrix makes Ring-LWE **more efficient** than standard LWE, while no known attacks exploit this structure.`
    },
    {
      title: "Ring-LWE: Concrete Example",
      content: `# Ring-LWE example

Parameters: $n=4$, $k=2$, $q=17$, $B=1$. Ring: $R_{17} = \\mathbb{Z}_{17}[x]/(x^4+1)$.

Sample $s(x) = 1 + x - x^3$ ($\\|s\\|_\\infty = 1$, i.e. **small**), and $a_1, a_2 \\in_R R_{17}$, $e_1, e_2 \\in_R S_1$:

$a_1(x) = 5 + 3x + 12x^2 + 7x^3$, $\\quad e_1(x) = 1 - x^2$

$a_2(x) = 9 + 14x + 2x^2 + 11x^3$, $\\quad e_2(x) = -1 + x$

Compute $b_i = a_i \\cdot s + e_i$ in $R_{17}$. 

This can be viewed as a **LWE instance** with structured $A$:

$$\\underbrace{\\begin{bmatrix} \\ \\boxed{\\begin{smallmatrix} 5 & 10 & 5 & 14 \\\\\\ 3 & 5 & 10 & 5 \\\\\\ 12 & 3 & 5 & 10 \\\\\\ 7 & 12 & 3 & 5 \\end{smallmatrix} } \\ \\\\\\ \\boxed{\\begin{smallmatrix} 9 & 6 & 15 & 3 \\\\\\ 14 & 9 & 6 & 15 \\\\\\ 2 & 14 & 9 & 6 \\\\\\ 11 & 2 & 14 & 9 \\end{smallmatrix} } \\ \\end{bmatrix}}_{\\text{two anti-circulant blocks}} \\times \\begin{bmatrix} 1 \\\\\\ 1 \\\\\\ 0 \\\\\\ -1 \\end{bmatrix} + \\begin{bmatrix} 1 \\\\\\ 0 \\\\\\ -1 \\\\\\ 0 \\\\\\ -1 \\\\\\ 1 \\\\\\ 0 \\\\\\ 1 \\end{bmatrix} = \\begin{bmatrix} b_1 \\\\\\ b_2 \\end{bmatrix} \\pmod{17}$$

Each $\\overline{\\text{circ}}(a_i)$ block is fully determined by a **single polynomial** $a_i$ - this structure is what makes Ring-LWE efficient while the problem remains believed to be as hard as general LWE.`
    },
    {
      title: "Module-LWE: Prerequisites",
      content: `# Module-LWE - math prerequisites

**The Module $R_q^k$**: Column vectors of dimension $k$ where each entry is a polynomial from $R_q$:

$$\\mathbf{p} = \\begin{bmatrix} p_1(x) \\\\\\ p_2(x) \\\\\\ \\vdots \\\\\\ p_k(x) \\end{bmatrix} \\in R_q^k$$

**Addition in $R_q^k$**: Performed component-wise (each polynomial component is added in $R_q$).

**Inner product in $R_q^k$**: For $\\mathbf{a}, \\mathbf{b} \\in R_q^k$:

$$\\mathbf{a} \\cdot \\mathbf{b} = a_1 b_1 + a_2 b_2 + \\cdots + a_k b_k \\in R_q$$

The result is a **single polynomial** in $R_q$ - each $a_i b_i$ is a polynomial multiplication in $R_q$, and the products are summed.`
    },
    {
      title: "Module-LWE: Definition",
      content: `# Module-LWE (MLWE) Definition

**MLWE**$(n, k, \\ell, q, B)$: Let $s \\in_R R_q^\\ell$ and $e \\in_R S_B^k$ where $k > \\ell$ and $B \\ll q/2$.

Let $a_1, \\dots, a_k \\in_R R_q^\\ell$ and $b_i = a_i^T s + e_i \\in R_q$.

Given the $a_i$ and $b_i$, find $s$.

$$\\underbrace{\\begin{bmatrix} \\overline{\\text{circ}}(a_{11}) & \\cdots & \\overline{\\text{circ}}(a_{\\ell 1}) \\\\\\\\\ \\vdots & & \\vdots \\\\\\\\\ \\overline{\\text{circ}}(a_{1k}) & \\cdots & \\overline{\\text{circ}}(a_{\\ell k}) \\end{bmatrix}}_{kn \\times \\ell n} \\times \\underbrace{\\begin{bmatrix} s_1 \\\\\\ \\vdots \\\\\\ s_\\ell \\end{bmatrix}}_{\\ell n \\times 1} + \\underbrace{\\begin{bmatrix} e_1 \\\\\\\\\ \\vdots \\\\\\\\\ e_k \\end{bmatrix}}_{kn \\times 1} = \\underbrace{\\begin{bmatrix} b_1 \\\\\\\\\ \\vdots \\\\\\\\\ b_k \\end{bmatrix}}_{kn \\times 1}$$

- Setting $\\ell = 1$ gives **Ring-LWE**
- Setting $n = 1$ (replacing $R_q$ with $\\mathbb{Z}_q$) gives standard **LWE**
- The practical advantage: **fix $n$ and $q$** for efficient arithmetic, vary $\\ell$ for different security levels`
    },
    {
      title: "Module-LWE: Concrete Example",
      content: `# Module-LWE example

Parameters: $n=4$, $k=3$, $\\ell=2$, $q=17$, $B=1$. The secret is a **vector** of polynomials $\\mathbf{s} = (s_1, s_2) \\in R_{17}^2$.

$s_1(x) = 1 - x^2$, $\\quad s_2(x) = x + x^3$ (both with $\\|\\cdot\\|_\\infty \\le 1$)

The matrix $A \\in R_{17}^{3 \\times 2}$ has $k \\cdot \\ell = 6$ polynomial entries. Each $a_{ij}$ generates an anti-circulant block. The expanded system $\\mathbf{b} = A\\mathbf{s} + \\mathbf{e}$ becomes once again just a **structured LWE** instance:

$$\\underbrace{\\begin{bmatrix} \\ \\boxed{\\overline{\\text{circ}}(a_{11})} & \\boxed{\\overline{\\text{circ}}(a_{21})} \\ \\\\\\ \\boxed{\\overline{\\text{circ}}(a_{12})} & \\boxed{\\overline{\\text{circ}}(a_{22})} \\ \\\\\\ \\boxed{\\overline{\\text{circ}}(a_{13})} & \\boxed{\\overline{\\text{circ}}(a_{23})} \\ \\end{bmatrix}}_{12 \\times 8} \\times \\underbrace{\\begin{bmatrix} s_1 \\\\\\ s_2 \\end{bmatrix}}_{8 \\times 1} + \\underbrace{\\begin{bmatrix} e_1 \\\\\\ e_2 \\\\\\ e_3 \\end{bmatrix}}_{12 \\times 1} = \\underbrace{\\begin{bmatrix} b_1 \\\\\\ b_2 \\\\\\ b_3 \\end{bmatrix}}_{12 \\times 1} \\pmod{17}$$

The $12 \\times 8$ matrix consists of a $3 \\times 2$ **grid of anti-circulant blocks**, each of size $4 \\times 4$.
- Each block is generated by a single random polynomial → efficient storage and multiplication
- Compared to Ring-LWE ($\\ell=1$, single column of blocks), MLWE has **less structure** 
-- stronger security assurance`
    },
    {
      title: "Kyber-PKE (K-PKE)",
      content: `# Kyber-PKE (Module-LWE based encryption scheme)

The core building block of ML-KEM. Input parameters: $q, n, k, \\eta_1, \\eta_2$.

**Key Generation (You):**
1. Select $A \\in_R R_q^{k \\times k}$, $s \\in_R S_{\\eta_1}^k$, $e \\in_R S_{\\eta_2}^k$
2. Compute $b = As + e$
3. **Public key**: $(A, b)$; **Private key**: $s$

**Encryption (Your friend):** To encrypt $m \\in \\{0, 1\\}^n$:
1. Select $r \\in_R S_{\\eta_1}^k$, $e_1 \\in_R S_{\\eta_2}^k$, $e_2 \\in_R S_{\\eta_2}$
2. Compute $u = A^T r + e_1$ and $v = b^T r + e_2 + \\lceil q/2 \\rfloor \\cdot m$
3. Output ciphertext $c = (u, v)$

**Decryption (You):**
1. Compute $m = \\text{Round}_q(v - s^T u)$`
    },
    {
      title: "Kyber-PKE: Correctness and Security",
      content: `# Kyber-PKE: decryption correctness and security

**Why decryption works:** Expanding $v - s^T u$:

$$v - s^T u = (b^T r + e_2 + \\lceil q/2 \\rfloor m) - s^T(A^T r + e_1)$$

Substituting $b^T = s^T A^T + e^T$ (to cancel out $s^T A^T r$):

$$= e^T r + e_2 - s^T e_1 + \\lceil q/2 \\rfloor m$$

Decryption succeeds if every coefficient $E_i$ of the error polynomial $E(x) = e^T r + e_2 - s^T e_1$ satisfies $\\|E_i\\|_\\infty < q/4$.

**CPA Security:** Kyber-PKE is secure against **chosen-plaintext attacks** - an attacker learns nothing about $s$ from encrypting messages with the public key.

**CCA Vulnerability:** However, it is **not secure** against **chosen-ciphertext attacks**. An active attacker could craft malicious ciphertexts (not using small error polynomials) that cause decryption failures, potentialy leaking information about $s$.`
    },
    {
      title: "Key Encapsulation Mechanism",
      content: `# Key Encapsulation Mechanism (KEM)

Since Kyber-PKE is vulnerable to **chosen-ciphertext attacks**, a security improvement is needed.

A **KEM** wraps the PKE to produce a shared secret key instead of encrypting arbitrary messages:
- The sender **encapsulates**: generates a random message, encrypts it, and derives a shared key
-- The random encryption parameters are seeded from a hash of the message
- The receiver **decapsulates**: decrypts to recover the message and derives the same shared key

**The general Fujisaki-Okamoto (FO) Transform** converts Kyber-PKE into Kyber-KEM by:
1. Making encryption **deterministic**
2. Adding **implicit rejection** - if a ciphertext is tampered with, a pseudorandom key is returned instead of failing
3. Enabling **re-encryption check** - the receiver can verify ciphertext authenticity

This ensures that an attacker **cannot create a valid** ciphertext without knowing the underlying message.
-- In principle, this is the same as the use of HMAC in symmetric encryption
-- However do not confuse this mechanism with proper identity authentication`
    },
    {
      title: "Kyber-KEM",
      content: `# Kyber-KEM

Domain parameters: $n=256, q, k, \\eta_1, \\eta_2$, hash functions $G$ (512-bit output), $H$ and $J$ (256-bit outputs).

**Key Generation (You):**
1. Generate Kyber-PKE keys: encryption key $(A, b)$, decryption key $s$
2. Select $z \\in_R \\{0,1\\}^{256}$
3. **Encapsulation key**: $ek = (A, b)$; **Decapsulation key**: $dk = (s, ek, H(ek), z)$

**Encapsulation (Your friend):**
1. Select $m \\in_R \\{0,1\\}^{256}$
2. Compute $(K, R) = G(m, H(ek))$
3. Encrypt $m$ with Kyber-PKE using $R$ as the deterministic seed → ciphertext $c$
4. Output shared key $K$ and ciphertext $c$

**Decapsulation (You):**
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

The official ML-KEM standard is derived from CRYSTALS-Kyber with refinements.

**Parameter Sets:**

| | $n$ | $q$ | $k$ | $\\eta_1$ | $\\eta_2$ | Security |
|---|---|---|---|---|---|---|
| **ML-KEM-512** | 256 | 3329 | 2 | 3 | 2 | 128-bit |
| **ML-KEM-768** | 256 | 3329 | 3 | 2 | 2 | 192-bit |
| **ML-KEM-1024** | 256 | 3329 | 4 | 2 | 2 | 256-bit |

Note how $n=256$ and $q=3329$ are **fixed** across all levels - only $k$ changes, demonstrating the practical advantage of the MLWE construction.

**Performance optimizations not covered in this chapter:**
- **Number Theoretic Transform (NTT)** - polynomial multiplication in $O(n \\log n)$ instead of $O(n^2)$. The choice of $q = 3329$ is specifically because $3329 \\equiv 1 \\pmod{256}$, enabling a 256-point NTT
- **Ciphertext compression** - coefficients are rounded to fewer bits ($d_u$, $d_v$ parameters) to reduce ciphertext size at the cost of slightly more decryption noise
- **Centered Binomial Distributions (CBD)** - efficient sampling of small error polynomials from $S_{\\eta}$ using random bytes
- **Keccak-based primitives** - exclusively uses FIPS 202 functions (SHA3, SHAKE) for hashing and pseudorandom generation`
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
