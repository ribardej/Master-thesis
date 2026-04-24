import type { Lesson } from "../../types";

export const lesson9: Lesson = {
  id: "module-1-lesson-9",
  title: "Quantum-Safe Public Channel Establishment",
  slides: [
    {
      title: "Quantum-Safe Public Channel Establishment",
      content: `# Chapter 9: Quantum-Safe Public Channel Establishment`,
    },
    {
      title: "Recall: Classical Approach",
      content: `## In Chapter 5 we saw how the public channel is established classically\n\n\n\n

      - **Key Exchange (ECDH)**: Establishes a shared secret between two parties
      - **Digital Signatures (ECDSA)**: Authenticates the server's identity
      - **Certificates (PKI)**: Binds public keys to real-world identities
      - **Symmetric Encryption (AES)**: Encrypts the actual data using the shared secret

      - All of this is orchestrated by a specific protocol (TLS, SSH, etc.)

      - However, the key exchange and authentication rely on ECDH and ECDSA - both **broken by Shor's algorithm**
      -- We need quantum-safe replacements for these two components`
    },
    {
      title: "Three Approaches",
      content: `## Three approaches to establish a quantum-safe channel\n\n\n\n

      - ### Option 1: Pure PQC
      -- Replace ECDH with **ML-KEM** and ECDSA with **ML-DSA**
      -- Runs on existing classical hardware as a software update
      -- Relies on unproven hardness of lattice problems

      - ### Option 2: QKD + dedicated channel
      -- Use **QKD** (e.g., BB84) for key distribution via a dedicated optical fiber (or satellite link)
      -- Provides unconditional security for key exchange (for short distances)
      -- Does **not** provide authentication or signatures
      -- Requires specialized hardware

      - ### Option 3: Hybrid scheme
      -- Combine **classical** and **post-quantum** algorithms together
      -- If either algorithm remains secure, the overall scheme remains secure
      -- This is the **recommended transition strategy** by NIST and major vendors`
    },
    {
      title: "Option 1: Pure PQC",
      content: `## Option 1: Pure PQC Channel\n\n\n\n

      - Replace the quantum-vulnerable algorithms in TLS with their post-quantum counterparts:
      -- **ML-KEM** (FIPS 203) replaces ECDH for key distribution
      -- **ML-DSA** (FIPS 204) replaces ECDSA for digital signatures

      - The rest of the protocol stays the same:
      -- AES-256-GCM for symmetric encryption (already quantum-safe with doubled key)
      -- PKI / Certificate chain for identity binding

      - **Advantage**: Easy replacement, works over existing internet infrastructure
      - **Disadvantage**: Security relies on unproven hardness of lattice problems`
    },
    {
      title: "PQC Channel Animation",
      content: `
[COMPONENT: PQCChannelAnimation]`
    },
    {
      title: "Option 2: QKD Channel",
      content: `## Option 2: QKD via Dedicated Channel\n\n\n\n

      - Use **Quantum Key Distribution** (e.g., BB84) to establish a shared symmetric key
      -- Requires a **dedicated optical fiber** between the two parties
      -- Provides **unconditional security** - no mathematical assumptions needed

      - However, QKD provides **only key exchange**:
      -- No authentication - vulnerable to man-in-the-middle attacks
      -- No digital signatures - cannot verify message integrity
      -- Requires pre-shared keys or classical crypto for authentication

      - **Advantage**: Security based on laws of physics, not math
      - **Disadvantage**: Requires specialized hardware, limited range, no authentication`
    },
    {
      title: "QKD Channel Animation",
      content: `
[COMPONENT: QKDChannelAnimation]`
    },
    {
      title: "Option 3: Hybrid Scheme",
      content: `## Option 3: Hybrid Scheme (Recommended)\n\n\n\n

      - Combine a **classical** algorithm (e.g., ECDH) with a **post-quantum** algorithm (e.g., ML-KEM) in the same handshake

      - Both key exchanges are performed independently, and the final shared secret is derived from **both** results
      -- If the classical algorithm is broken -> the PQ algorithm still protects
      -- If the PQ algorithm is broken -> the classical algorithm still protects

      - This is the **recommended transition strategy**:
      -- NIST, NSA, BSI, and major tech companies (Google, Cloudflare, Mozilla) all recommend hybrid schemes
      -- Google Chrome already uses a hybrid **X25519 + ML-KEM** key exchange

      - Similarly, signatures can be hybridized: a certificate carries **both** an ECDSA and an ML-DSA signature`
    },
    {
      title: "Why Hybrid?",
      content: `## Why not just switch to Pure PQC directly?\n\n\n\n

      - PQC algorithms are relatively **new** - ML-KEM was standardized only in 2024
      -- Classical algorithms like ECDH have been tested in practice for **decades**

      - Lattice-based problems are **believed** to be hard, but there is no mathematical proof
      -- A breakthrough could invalidate the security overnight

      - Hybrid schemes provide **robustness**:
      -- They are at least as secure as the **strongest** component
      -- They allow a gradual, low-risk transition to post-quantum cryptography

      - **NIST** recommends hybrid key exchange during the transition period`
    },
    {
      title: "Summary",
      content: `## Summary\n\n\n\n

      - The quantum threat to TLS comes from **key exchange** (ECDH) and **authentication** (ECDSA) - both broken by Shor's algorithm

      - **Pure PQC**: Replaces ECDH -> ML-KEM and ECDSA -> ML-DSA, software-only deployment

      - **QKD**: Provides unconditional key exchange security via dedicated fiber, but lacks authentication and is impractical for most use cases

      - **Hybrid scheme**: Combines classical + PQ crypto for defense in depth - the recommended transition strategy`
    },
    {
      title: "Summary",
      content: `# End of the Overview\n\n\n\n
      
      Make sure you understand all the concepts from overview (**why** we use what) before moving to the detailed module.
      
      `
    },
  ],
};
