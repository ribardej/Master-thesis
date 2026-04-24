import type { Lesson } from "../../types";

export const lesson8: Lesson = {
  id: "module-1-lesson-8",
  title: "Quantum Key Distribution",
  slides: [
    {
      title: "Quantum Key Distribution",
      content: `# Chapter 8: Quantum Key Distribution Overview`,
    },
    {
      title: "Two Approaches to Quantum-Safe Key Exchange",
      content: `## The main difference between PQC and QKD\n\n\n\n

      - In Chapter 7, we saw **Post-Quantum Cryptography (PQC)**: algorithms running on classical hardware, secured by hard mathematical problems (e.g., lattice problems)
      -- These hard math problems are not yet broken, but it is not proven that they won't be broken in the future

      - **Quantum Key Distribution (QKD)** takes a fundamentally different approach
      -- It derives security from the **laws of physics**, not mathematical hardness
      -- In theory, QKD is unconditionally secure, meaning it is secure regardless of the adversary's computational power
      -- However, in practice, QKD has several limitations that make it less practical than PQC in many scenarios
      `
    },
    {
      title: "The Core Idea",
      content: `## How can physics guarantee security?\n\n\n\n

      - QKD encodes key bits into **quantum states** (e.g., polarized photons)

      - Two fundamental principles of quantum mechanics protect the key:

      - **No-Cloning Theorem**: It is physically impossible to create an exact copy of an unknown quantum state
      -- An eavesdropper **cannot** copy the photons to read them later

      - **Measurement Disturbance**: Measuring a quantum state inevitably **disturbs** it
      -- Any eavesdropping attempt **leaves detectable traces**

      - Together, these principles mean that it can be detected if anyone intercepted the key exchange`
    },
    {
      title: "Limitations of QKD",
      content: `## Practical limitations (per NSA)\n\n\n\n

      - **Partial solution only**: QKD provides key exchange but **not authentication**
      -- Still needs classical cryptography to verify identities

      - **Special hardware required**: Relies on physical photon manipulation
      -- Cannot be deployed as a simple software update

      - **Limited range**: Requires direct fiber or line-of-sight connections
      -- "Trusted relays" introduce new security risks

      - **Implementation vulnerabilities**: Real hardware has imperfections

      - **Denial of Service**: The sensitivity to eavesdropping is also a weakness
      -- An adversary can disrupt key exchange simply by adding noise`
    },
    {
      title: "Summary",
      content: `## Summary\n\n\n\n

      - **QKD** offers security based on the **laws of physics** rather than mathematical assumptions

      - Eavesdropping is **physically detectable** thanks to the No-Cloning Theorem and measurement disturbance

      - However, QKD has significant **practical limitations**: special hardware, limited range, no authentication, and vulnerability to denial of service

      - Due to the limitations, NSA currently favors **PQC over QKD** as the more practical quantum-safe solution`
    },
  ],
};
