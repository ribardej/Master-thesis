import type { Lesson } from "../../types";

export const lesson6: Lesson = {
  id: "module-1-lesson-6",
  title: "Quantum Threat",
  slides: [
    {
      title: "Quantum Threat",
      content: `# Chapter 6: Quantum Threat Overview`,
    },
    {
      title: "The Quantum Threat",
      content: `## The three mathematical problems behind assymetric cryptography\n\n\n\n

      - Key distribution and Digital signatures rely on the assumption that the core mathematical problems are practically impossible to solve

      - RSA relies on the hardness of **prime factorization problem**

      - DH/DSA relies on the hardness of **discrete logarithm problem**

      - ECDH/ECDSA relies on the hardness of the **elliptic curve variant** of the **discrete logarithm problem**

      `
    },
    {
      title: "Classic",
      content: `## Is the hardness guaranteed? \n\n\n\n

      - **No**! There is no proof that these problems cannot be solved efficiently even on classical computers.

      - In fact, the hardness of both the **prime factorization problem** and **discrete logarithm problem** was shown to be greatly reduced by the **General Number Field Sieve** (NFS) algorithm.

      - **NFS can not** be used to solve the **ECDH/ECDSA**. That is the reason why RSA and DH/DSA need to use much larger keys to achieve the same level of security as ESDH/ECDSA.
      
      - However it might be the case that an algorithm **easily solving** all these problems on **classical computers** exists.
      -- We simply have not discovered it yet`
    },
    {
      title: "Classic",
      content: `## What about the quantum hardness? \n\n\n\n

      - An algorithm that quickly solves **all the three problems** on a quantum computer already **has been discovered**

      - It is called the **Shor's algorithm**, published in 1994
      -- Effectively breaking **RSA, DH/DSA**
      -- Modified version was later shown to break the **ECDH/ECDSA** as well`
    },
    {
      title: "Quantum Computers",
      content: `## The speedup on Quantum computers \n\n\n\n

      - Quantum computers exploit principles of quantum mechanics like **superposition** and **entanglement** to speed up calculations
      -- However upon measurement the superposition **collapses** into one state

      - They can solve specific class of mathematical problems **exponentially faster** than classical computers
      -- **Some** problems, **not every** problem
      
      - This implies that there also exists a specific class of mathematical problems that **can not be solved** efficiently even on quantum computers.
      -- On these problems relies the **Post Quantum Cryptography (PQC)**`
    },
    {
      title: "Grover's Algorithm",
      content: `## What about symmetric cryptography - Grover's Algorithm\n\n\n\n

      - Symmetric encryption does not rely on hardness of some mathematical problems
      -- It relies on a complex shuffeling process that is unique to each possible key

      - So if the shuffeling process is designed robustly enough to not reveal information about the key, there is no faster way how to recover the key rather than by brute-force

      - The optimal quantum algorithm for brute-force key search is the **Grover's algorithm**
      -- It provides a **quadratic speedup** for general brute-force attacks
      -- It is **mathematically proven to be the optimal algorithm** for general brute-force search`
    },
    {
      title: "Impact of Grover's Algorithm",
      content: `## Practical Impact on AES\n\n\n\n

      - Because the speedup is only quadratic, symmetric ciphers like AES remain practically **secure**

      - However, Grover's algorithm halves the effective bits of security

      - To achieve the same level of security, one simply has to **double the key size**
      -- This means **AES-256** is required to give **128** bits of post-quantum security`
    },
    {
      title: "Summary",
      content: `## Summary of Practical Impact\n\n\n\n

      - **Symmetric Encryption (AES)**: Remains secure, just double the key size

      - **Key Distribution (DH, RSA)**: Completely broken by Shor's algorithm

      - **Digital Signatures (RSA, ECDSA)**: Completely broken by Shor's algorithm`
    },
  ],
};
