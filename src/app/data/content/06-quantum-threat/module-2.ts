import type { Lesson } from "../../types";

export const lesson6: Lesson = {
  id: "module-2-lesson-6",
  title: "Quantum Threat",
  slides: [
    {
      title: "Quantum Threat in Detail",
      content: `# Chapter 6: Quantum Threat in Detail`
    },
    {
      title: "Architecture of Quantum Computers",
      content: `# Architecture of Quantum Computers

Classical computers operate on **bits** that exist in one of two distinct states: $0$ or $1$.

Quantum computers utilize **quantum bits (qubits)**, which exploit two fundamental principles of quantum mechanics:

- **Superposition** - A qubit can exist in a combination of both $|0\\rangle$ and $|1\\rangle$ simultaneously
- **Entanglement** - Multiple qubits can form a unified quantum system with non-classical correlations

These two properties are the foundation of all quantum computational advantage.`
    },
    {
      title: "The Qubit and Superposition",
      content: `# The Qubit and Superposition

Physically, a qubit can be realized by any **two-level quantum system** (e.g., electron spin, photon polarization). Mathematically, while a classical bit is a scalar, a qubit is a **vector in a 2D complex vector space**.

Using Dirac notation, a general qubit state $|\\psi\\rangle$ is:

$$ |\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle $$

where $\\alpha$ and $\\beta$ are **complex probability amplitudes** satisfying the normalization condition:

$$ |\\alpha|^2 + |\\beta|^2 = 1 $$

Upon **measurement**, the superposition collapses:
- Result is $0$ with probability $|\\alpha|^2$
- Result is $1$ with probability $|\\beta|^2$

The outcome is inherently **probabilistic** - it is not determined until the moment of measurement.`
    },
    {
      title: "Entanglement",
      content: `# Entanglement

When two or more qubits become **entangled**, they form a single quantum system described by a **unified wavefunction**. The state of each qubit **cannot** be described independently of the others.

A **Bell state** is a maximally entangled state of two qubits:

$$ |\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle) $$

If one measures the first qubit and observes $0$, the second qubit is **guaranteed** to be $0$ as well - regardless of the physical distance separating them.

This non-classical correlation allows quantum computers to manipulate $2^n$ amplitudes simultaneously using only $n$ qubits.`
    },
    {
      title: "Quantum Algorithms and Interference",
      content: `# Quantum Algorithms: The Role of Interference

A common myth is that quantum computers simply "try every answer at once" via quantum parallelism. While superposition does allow processing all inputs simultaneously, a direct measurement would return a **random** result.

The true power lies in **quantum interference**:

- **Constructive Interference:** When phases align, amplitudes **add together**, increasing the probability of a desired state
- **Destructive Interference:** When phases oppose, amplitudes **cancel out**, decreasing the probability of an undesired state

The goal of a quantum algorithm is to choreograph operations so that:
-- **Wrong answers** interfere destructively → probabilities approach **zero**
-- **Correct answers** interfere constructively → probabilities approach **one**

Upon the final measurement, the probability of observing the correct solution is maximized.`
    },
    {
      title: "Grover's Algorithm: Problem Statement",
      content: `# Grover's Algorithm: The Problem

Grover's algorithm addresses the **unstructured search problem**. Given a black-box function (Oracle):

$$ f: \\{0, 1\\}^n \\to \\{0, 1\\} $$

The goal is to find an input $x$ such that $f(x) = 1$ among $N = 2^n$ possibilities.

**Classically:** Requires checking inputs one by one → $N/2$ queries on average, $N$ in the worst case.

### Connection to Cryptography
This abstract "database search" maps directly to **function inversion**:
- **AES:** $f(x)$ checks if a candidate key $x$ encrypts a known plaintext to a specific ciphertext
- **DH / ECDH:** $f(x)$ searches for the private key corresponding to a known public key

While DH/ECDH have more efficient quantum attacks (Shor's), Grover's defines the **fundamental lower bound** for any cryptographic function.`
    },
    {
      title: "BBBV Theorem: Limits of Quantum Search",
      content: `# BBBV Theorem: Limits of Quantum Search

In 1994, Bennett, Bernstein, Brassard, and Vazirani (BBBV) proved a fundamental lower bound on quantum search.

### The Result
For searching a single solution in an unsorted space of $N$ possibilities, **no quantum algorithm** can solve the problem in fewer than $O(\\sqrt{N})$ queries.

### Implications
- Quantum computers offer a significant advantage over the classical $O(N)$ requirement
- But an **exponential speedup is impossible** for unstructured search
- This sets a **hard limit** on the weakening of symmetric cryptography:
-- Key sizes must be **doubled** to maintain equivalent security against a quantum adversary
-- But the systems are **not broken entirely**

Grover's algorithm achieves this theoretical limit exactly - making it **provably optimal**.`
    },
    {
      title: "Grover's Algorithm: The Steps",
      content: `# Grover's Algorithm (1996)

Lov K. Grover demonstrated that the $O(\\sqrt{N})$ limit is achievable with an iterative process called **amplitude amplification**:

**1. Initialization:**
Prepare a uniform superposition of all $N$ possible states - every key has **equal** probability amplitude.

**2. Oracle Query:**
A quantum oracle **marks** the correct state by flipping the phase of its amplitude (from $+$ to $-$).

**3. Diffusion Operator:**
An inversion-about-the-mean operation **amplifies** the marked state (constructive interference) and **dampens** incorrect states (destructive interference).

By repeating steps 2 and 3 approximately $\\frac{\\pi}{4}\\sqrt{N}$ times, the probability of measuring the correct solution approaches $1$.

### Practical Impact
A brute-force attack on **AES-256** with Grover's algorithm requires effort comparable to attacking **AES-128** classically.`
    },
    {
      title: "Shor's Algorithm: Overview",
      content: `# Shor's Algorithm for Discrete Logarithm Problem

While Grover's offers a generic quadratic speedup, **Shor's algorithm** poses an **existential threat** to public-key cryptography.

### The Core Insight
Problems like the Discrete Logarithm Problem contain a **hidden periodic structure**. Shor's algorithm exploits this by:

1. Constructing a **periodic function** that incorporates the unknown secret $x$
2. Using the **Quantum Fourier Transform (QFT)** to efficiently find the period
3. Recovering $x$ from the period using classical computation

This converts the hard problem of finding a discrete logarithm into a **tractable period-finding problem** - solved with an **exponential speedup**.

### The Scenario
Eve knows public parameters $(p, g)$ and intercepts the part secrets $s = g^x, s_b = g^y$. She needs to find $x$ or $y$ to compute the shared secret.`
    },
    {
      title: "Shor's Algorithm: The Periodic Function",
      content: `# Shor's Algorithm: Constructing the Periodic Function

The key idea is to construct a function whose **period reveals the secret** $x$. The function used is:

$$ f(a, b) = g^a s^{-b} \\pmod{p} = g^{a - bx} \\pmod{p} $$

where $g$, $s$, and $p$ are constants for the problem instance.

### Finding the Period
We seek values $c$ and $d$ such that $f(a, b) \\equiv f(a+c, b+d)$:

$$ g^{(a+c) - (b+d)x} \\equiv g^{a - bx} \\pmod{p} $$

Since $g$ is a generator of $\\mathbb{Z}^*_p$, the exponents must be equivalent modulo $p-1$:

$$ (a+c) - (b+d)x \\equiv a - bx \\pmod{p-1} $$

After simplification:

$$ c - dx \\equiv 0 \\pmod{p-1} $$

Once we measure $c$ and $d$, this equation is solvable in **polynomial time** on a classical computer.`
    },
    {
      title: "Shor's Algorithm: Steps",
      content: `# Shor's Algorithm: Specific Steps

1. Put the inputs $p$, $g$, and $s$ into the memory of a quantum computer

2. Uniformly initialize two quantum registers for numbers $a$ and $b$, each between $0$ and $p-2$

3. Reversibly compute $g^as^{-b} \\pmod{p}$ on a third register. The machine state becomes:
$$ \\frac{1}{p-1}\\sum_{a=0}^{p-2}\\sum_{b=0}^{p-2}|a, b, g^as^{-b} \\pmod{p}\\rangle $$

4. Apply a **Quantum Fourier Transform (QFT)** to the first two registers, transforming $a \\to c$ and $b \\to d$:
$$ \\frac{1}{(p-1)^2}\\sum_{a,b,c,d=0}^{p-2} e^{\\frac{2\\pi i}{p-1}(ac+bd)}|c, d, g^as^{-b} \\pmod{p}\\rangle $$

5. **Measure** the state to obtain values of $c$ and $d$

6. Compute $x$ on a classical computer by solving $c - dx \\equiv 0 \\pmod{p-1}$`
    },
    {
      title: "Quantum Fourier Transform",
      content: `# The Quantum Fourier Transform (QFT)

The QFT is the quantum analogue of the classical **Discrete Fourier Transform (DFT)**. It is the key ingredient that makes Shor's algorithm efficient.

### Classical FFT (Fast Fourier Transform)
- Computes the DFT of $N$ values
- Complexity: $O(N \\log N)$ operations
- Processes values **sequentially**

### Quantum Fourier Transform
- Acts on $n$ qubits encoding $N = 2^n$ amplitudes
- Complexity: $O(n^2) = O(\\log^2 N)$ quantum gates
- Exploits **superposition** to process all amplitudes simultaneously

For Shor's algorithm, the QFT efficiently extracts the **period** of the modular function from the quantum state - a task that would require exponential time classically.

Note: The algorithm works exactly when $p-1$ is 2-smooth ($p-1 = 2^k$). For the general case, the QFT size is $q$ where $p < q < 2p$ and $q$ is smooth. Shor proved that with additional techniques (continued fractions), $x$ can still be found with constant measurements.`
    },
    {
      title: "FFT vs QFT Comparison",
      content: `
      [COMPONENT: FFTvsQFTComparison]`
    },
    {
      title: "Shor's Algorithm for ECDLP",
      content: `# Modified Shor's Algorithm for ECDLP

Shor's original 1994 paper focused on finite field DLP. In 1995, Boneh and Lipton proved any cryptosystem based on a "hidden linear form" can be broken in quantum polynomial time. In 2004, Proos and Zalka provided a specific analysis for elliptic curves, notably showing that breaking **ECC requires fewer qubits** than RSA for equivalent security.

### Setup
Eve knows the curve parameters $a, b$, prime $p$, generator point $G$ of order $n$, and intercepts the public key $Q = x \\cdot G$. She must find $x$.

### The Periodic Function
$$ f(a, b) = [a]G + [b]Q = [a + xb]G $$

Seeking a period $(c, d)$ such that $f(a,b) = f(a+c, b+d)$:

$$ [a + xb]G = [(a+c) + x(b+d)]G $$

Since $G$ has order $n$: $\\quad a + xb \\equiv a + c + xb + xd \\pmod{n}$

Simplified: $\\quad c + xd \\equiv 0 \\pmod{n}$

As with DLP, after measuring $c$ and $d$, this is solvable in polynomial time.`
    },
    {
      title: "Shor's Algorithm for RSA",
      content: `# Shor's Algorithm for RSA: Factoring
      
In the case of RSA, security relies on the hardness of **integer factorization** ($N = p \\cdot q$). Shor's algorithm attacks this by converting the factorization problem into a **period-finding problem**.

### The Reduction
Classically, if one can find the order (period) $r$ of a random integer $a$ modulo $N$, one can efficiently factor $N$.
The **order** $r$ is the smallest positive integer such that:

$$ a^r \\equiv 1 \\pmod{N} $$

The periodic function we construct is simply the modular exponentiation sequence:

$$ f(x) = a^x \\pmod{N} $$

The sequence $f(0), f(1), f(2), \\dots$ repeats with period $r$. Finding this period $r$ classically is intractable for cryptographic sizes, but a quantum computer can find it in polynomial time.`
    },
    {
      title: "Shor's Algorithm for RSA: Quantum Steps",
      content: `# Shor's Algorithm for RSA: The Quantum Steps
      
The quantum portion of the algorithm extracts the period $r$ using the QFT. Let $Q$ be a large power of 2 such that $2N^2 \\le Q < 4N^2$.

**1. Initialization:**
Prepare two quantum registers. The first is in a uniform superposition of states from $0$ to $Q-1$.

**2. Modular Exponentiation:**
Reversibly compute $f(x) = a^x \\pmod{N}$ into the second register:

$$ \\frac{1}{\\sqrt{Q}}\\sum_{x=0}^{Q-1}|x, a^x \\pmod{N}\\rangle $$

**3. Quantum Fourier Transform:**
Apply the QFT to the first register. Because the states in the superposition are periodic (with period $r$), the QFT creates **constructive interference** at states $c$ that are close to multiples of $Q/r$, and destructive interference everywhere else.

**4. Measurement:**
Measure the first register. The resulting state $c$ has a high probability of satisfying $\\frac{c}{Q} \\approx \\frac{k}{r}$ for some integer $k$.`
    },
    {
      title: "Shor's Algorithm for RSA: Classical Steps",
      content: `# Shor's Algorithm for RSA: Classical Extraction
      
Once the quantum computer provides the measurement $c$, we return to a classical computer to finish breaking RSA.

**1. Continued Fractions:**
Since $\\frac{c}{Q} \\approx \\frac{k}{r}$, we use the classical **Continued Fraction Algorithm** on the known fraction $\\frac{c}{Q}$. This efficiently estimates the unknown denominator $r$ (the period).
Note that this is the reason we constrained $Q$ to be between $2N^2$ and $4N^2$. This ensures that we can obtain the the correct and unique $r$ with the continued fraction algorithm.

**2. Factoring N:**
If the period $r$ is even, and $a^{r/2} \\not\\equiv -1 \\pmod{N}$, we can find the prime factors of $N$ using the greatest common divisor (GCD) via the Euclidean algorithm:

$$ p, q = \\gcd(a^{r/2} \\pm 1, N) $$

If the conditions for $r$ are not met, the process is simply repeated with a new random $a$. The probability of success on each attempt is high (> 50%), meaning RSA is fundamentally broken in polynomial time.`
    },
    {
      title: "Store Now, Decrypt Later",
      content: `# Store Now, Decrypt Later (SNDL)

One of the most pressing implications of the quantum threat is the **"Harvest Now, Decrypt Later"** attack vector.

### The Strategy
Adversaries (e.g., nation-states) are **currently intercepting and storing** encrypted traffic, even though they lack the computational power to break the encryption **today**.

### The Objective
Retain the data until a sufficiently powerful quantum computer becomes available to run Shor's algorithm. The stored ciphertext can then be **retroactively decrypted**.

### The Implication
- Any data encrypted today with classical public-key methods has **no long-term security guarantee**
- Data that must remain confidential for **decades** (state secrets, medical records, financial data) is already at risk
- This motivates the urgent development and deployment of **post-quantum cryptography**
-- We must transition **before** large-scale quantum computers exist, not after`
    },
    {
      title: "Summary",
      content: `# Summary

- **Qubits** exploit superposition and entanglement to manipulate $2^n$ amplitudes with $n$ qubits

- **Grover's algorithm** provides a **quadratic speedup** ($O(\\sqrt{N})$) for brute-force search
-- It is **provably optimal** (BBBV theorem)
-- Symmetric ciphers survive by **doubling key sizes** (AES-128 → AES-256)

- **Shor's algorithm** provides an **exponential speedup** for the DLP
-- Uses the **Quantum Fourier Transform** to extract periods from modular functions
-- **Completely breaks** DH, RSA, DSA, and their elliptic curve variants

- The **Store Now, Decrypt Later** threat means data encrypted today with classical algorithms is already at risk

- The next chapters will cover the solutions: **Post-Quantum Cryptography (PQC)** and **Quantum Key Distribution (QKD)**`
    },
    {
      title: "Further Reading",
      content: `# Further Reading

- [Algorithms for Quantum Computation (Shor, 1994)](https://cc.ee.ntu.edu.tw/~rbwu/rapid_content/course/QC/Shor1994.pdf)
-- The original paper by Peter Shor introducing the quantum algorithm for discrete logarithms and factoring.

- [A Fast Quantum Mechanical Algorithm for Database Search (Grover, 1996)](https://arxiv.org/pdf/quant-ph/9605043)
-- Lov Grover's original paper on quantum search with quadratic speedup.

- [Strengths and Weaknesses of Quantum Computing (BBBV, 1997)](https://arxiv.org/pdf/quant-ph/9701001)
-- The formal proof of the lower bound for quantum black-box search.

- [An Improved Quantum Algorithm for Shor's Algorithm Applied to ECC (Proos & Zalka, 2004)](https://arxiv.org/abs/quant-ph/0301141)
-- Analysis of Shor's algorithm adapted for elliptic curves.`
    },
  ],
};
