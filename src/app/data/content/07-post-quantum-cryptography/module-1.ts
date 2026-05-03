import type { Lesson } from "../../types";

export const lesson7: Lesson = {
  id: "module-1-lesson-7",
  title: "Post-Quantum Cryptography",
  slides: [
    {
      title: "Post-Quantum Cryptography",
      content: `# Chapter 7: Post Quantum Cryptography Overview`,
    },
    {
      title: "Post-Quantum Cryptography",
      content: `# The core idea behind Post-Quantum Cryptography (PQC)

- In the previous chapter, we saw that **Shor's algorithm** breaks RSA and (EC)DH by exploiting the **hidden periodic structure** of their underlying mathematical problems using the Quantum Fourier Transform

- PQC algorithms are designed around mathematical problems that are believed to **lack any exploitable periodic structure**
-- Without a period to find, Shor's algorithm offers **no advantage**
-- The best known quantum attacks against these problems are **generic search** (Grover's), providing at most a **quadratic speedup**
-- However it is **not proven** that there can not be efficient quantum, or even classical, algorithms that break the problems.

- PQC algorithms run on **classical hardware** — no quantum computer is needed
-- They are designed as **drop-in replacements** for existing algorithms like RSA, DH, and ECDSA`
    },
    {
      title: "Post-Quantum Cryptography",
      content: `# The NIST Post-Quantum Standardization Process

NIST (National Institute of Standards and Technology) launched a **public, international competition** in 2016 to identify and standardize quantum-resistant cryptographic algorithms:

- **2016**: Call for proposals issued
- **2017 (Round 1)**: 69 valid submissions received (26 KEMs + 23 signature schemes + 20 eliminated)
- **2019 (Round 2)**: Narrowed to 26 candidates
- **2020 (Round 3)**: 7 finalists + 8 alternates selected for final evaluation
- **2022**: Winners announced — ML-KEM + 3 signature schemes selected
- **2024**: Official standards published as **FIPS 203, 204, 205**
- **2025**: NIST selected HQC as a backup algorithm for ML-KEM

The process was deliberately **open and transparent** — all submissions, public comments, and cryptanalysis results were published, allowing the global cryptography community to scrutinize each candidate`
    },
    {
      title: "Post-Quantum Cryptography",
      content: `# Key Distribution — Standardized Algorithms

## ML-KEM (FIPS 203) — Primary Standard
- Based on the **Module Learning with Errors (MLWE)** problem
- Classified as a **lattice-based** scheme
- Evolved from the CRYSTALS-Kyber submission
- Offers three security levels: ML-KEM-512, ML-KEM-768, ML-KEM-1024
- **Efficient** — small key sizes and fast operations compared to other PQC families

## HQC — Backup Standard (under standardization)
- Based on the **Hamming Quasi-Cyclic** code decoding problem
- Classified as a **code-based** scheme
- Provides an alternative based on a **fundamentally different** hard problem
-- If a breakthrough attack is discovered against lattice problems, HQC should not be affected`
    },
    {
      title: "Post-Quantum Cryptography",
      content: `# Digital Signatures — Standardized Algorithms

## ML-DSA (FIPS 204) — Primary Standard
- Based on the **Module Learning with Errors (MLWE)** problem (same family as ML-KEM)
- Classified as a **lattice-based** scheme
- Evolved from the CRYSTALS-Dilithium submission
- Offers three security levels: ML-DSA-44, ML-DSA-65, ML-DSA-87

## SLH-DSA / SPHINCS+ (FIPS 205) — Backup Standard
- Based on the security of **hash functions** (e.g., SHA-256, SHAKE)
- Classified as a **hash-based** scheme — the most conservative assumption in PQC
- Larger signatures and slower, but relies on **minimal cryptographic assumptions**
-- If hash functions remain secure, SLH-DSA remains secure

## FN-DSA (under standardization)
- Based on the **NTRU lattice** problem
- Evolved from the FALCON submission — offers very **compact signatures**`
    },
    {
      title: "Post-Quantum Cryptography",
      content: `# Why the Public Selection Process Matters

A transparent, adversarial review process is essential because **proprietary cryptographic designs hide vulnerabilities**.

## The Case of SIKE
- **SIKE** (Supersingular Isogeny Key Encapsulation) was a promising **Round 3** alternate candidate
- Based on the **Supersingular Isogeny Diffie-Hellman (SIDH)** problem
- It had the **smallest key sizes** of all PQC candidates — very attractive for deployment
- Then, in **2022**, Wouter Castryck and Thomas Decru published a **classical attack** that broke SIKE in **under an hour on a single CPU core**
-- This was not a quantum attack — it was a **purely classical** mathematical breakthrough
-- **All public key encryption** algorithms (RSA, DH, ECDH, ML-KEM, HQC) rely on math problems with **unproven** hardness. 

## The Lesson
- Without open scrutiny, SIKE could have been **deployed worldwide** before anyone discovered the flaw
- The NIST process ensured that this weakness was found **before** standardization, not after`
    },
    {
      title: "Post-Quantum Cryptography",
      content: `# Summary
      
      - Post Quantum Cryptography is the **most practical** solution against quantum computers
      -- Generally a software drop-in replacement, no need for specialized hardware

      - However the security is **conditional** - based on the unproven hardness of the underlying math problems
      
      - Regarding the **key distribution** problem, there exists an **alternative: Quantum Key Distribution** ->
      -- Regarding **digital signatures**, there is **no alternative** to PQC`,
    },
  ],
};
