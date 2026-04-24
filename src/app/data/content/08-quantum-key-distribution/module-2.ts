import type { Lesson } from "../../types";

export const lesson8: Lesson = {
  id: "module-2-lesson-8",
  title: "Quantum Key Distribution",
  slides: [
    {
      title: "Quantum Key Distribution in Detail",
      content: `# Chapter 8: Quantum Key Distribution in Detail`
    },
    {
      title: "PQC vs QKD: Two Philosophies",
      content: `# The idea behind QKD 

Post-Quantum Cryptography (PQC) and Quantum Key Distribution (QKD) both aim to protect against quantum adversaries, but their security foundations are fundamentally different.

**Post-Quantum Cryptography (PQC):**
- Runs on **classical hardware** (software-only deployment)
- Security relies on the **computational hardness** of mathematical problems (e.g., Module-LWE for ML-KEM)
- These hardness assumptions are **unproven** - a future breakthrough could invalidate them
- Provides key exchange **and** digital signatures

**Quantum Key Distribution (QKD):**
- Requires **specialized quantum hardware** (photon sources, detectors, quantum channels)
- Security derives from the **fundamental laws of quantum mechanics**
- It is **unconditionally secure** - unbreakable regardless of computational power
- Provides **only key exchange** - no digital signatures`
    },
    {
      title: "Photon Polarization",
      content: `# QKD: encoding information

In QKD, information is encoded in the **polarization state** of single photons. Polarization describes the orientation of a photon's electromagnetic oscillation.

A photon's polarization can be measured along a chosen **basis** - a pair of orthogonal directions:

- **Rectilinear basis** ($\\oplus$): Vertical ($\\uparrow$, 0°) and Horizontal ($\\rightarrow$, 90°)
- **Diagonal basis** ($\\otimes$): Diagonal ($\\nearrow$, 45°) and Anti-diagonal ($\\searrow$, 135°)

### The Crucial Quantum Property
If a photon is prepared in one basis and measured in the **same** basis, the result is **deterministic** (100% correct).

If measured in the **wrong** basis, the result is completely **random** (50/50 chance). Furthermore, the original polarization state is **destroyed** by this incompatible measurement`
    },
    {
      title: "BB84: The Protocol",
      content: `# The BB84 Protocol

Proposed by Charles Bennett and Gilles Brassard in 1984, BB84 is the first and most widely known QKD scheme. It allows two parties (You your friend) to establish a shared secret key by transmitting polarized photons.

### Encoding Convention
You encode classical bits into photon polarizations depending on her randomly chosen basis:

| Bit Value | Rectilinear ($\\oplus$) | Diagonal ($\\otimes$) |
|-----------|----------------------|---------------------|
| 0         | $\\uparrow$ (Vertical)     | $\\nearrow$ (45°)         |
| 1         | $\\rightarrow$ (Horizontal)  | $\\searrow$ (135°)        |

For each bit she wants to send, you:
1. Generate a **random bit** (0 or 1)
2. Choose a **random basis** ($\\oplus$ or $\\otimes$)
3. Prepare a photon in the corresponding polarization state
4. Send the photon to your friend through a **quantum channel** (dedicated optical fiber)`
    },
    {
      title: "BB84: Transmission and Measurement",
      content: `# BB84: step-by-step

### Your Side (Transmission)
For each bit, you randomly select a basis and prepare the photon accordingly. Neither the bit value nor the basis choice follows any pattern - both are **uniformly random**.

### Your Friend's Side (Measurement)
Your friend does **not** know which basis you used. For each incoming photon, he **independently** and **randomly selects** a basis ($\\oplus$ or $\\otimes$) and measures the photon. If he chooses:
- **The same basis:** your friend gets the **correct bit** with certainty (deterministic)
- **A different basis:** your friend gets a **random result** (50% chance of 0 or 1)

### Why Different Bases Give Random Results
A vertically polarized photon ($\\uparrow$, encoding bit 0 in $\\oplus$) measured in the diagonal basis ($\\otimes$) has equal probability of being detected as $\\nearrow$ (0) or $\\searrow$ (1).

The photon's quantum state is **projected** onto the measurement basis - and if the bases are incompatible, the outcome is fundamentally unpredictable.`
    },
    {
      title: "BB84: Sifting",
      content: `# BB84: Basis Reconciliation (Sifting)

After all photons have been transmitted and measured, you and your friend switch to a **classical public channel** (e.g., an authenticated internet connection).

### The Sifting Process
1. For each photon, you announce **which basis** you used ($\\oplus$ or $\\otimes$)
2. Your friend compares your basis to the basis he used for measurement
3. You **keep** only the bits where your bases matched
4. You **discard** all bits where your bases differed

### Key Properties of Sifting
- Only the **bases** are revealed publicly, **never** the bit values
- On average, you and your friend will agree on bases for **~50%** of the transmitted photons
- The remaining bits form the **Sifted Key** - identical for both parties (assuming no noise or eavesdropping)

An eavesdropper monitoring the public channel learns which bases were used, but this information is useless without the actual photon measurements.`
    },
    {
      title: "BB84: Interactive Demo",
      content: `
[COMPONENT: BB84ProtocolAnimation]`
    },
    {
      title: "Eavesdropping Detection",
      content: `# Eavesdropping detection

The critical security feature of BB84 is the ability to detect eavesdropping **after** the sifted key is established.

### How an Attacker Attacks
If an attacker intercepts a photon, he must **measure** it (he cannot copy it due to the No-Cloning Theorem). He then resends a new photon to your friend. But since an attacker doesn't know your basis:
- He picks a **random basis** to measure
- With **50% probability**, he picks the wrong basis and **destroys** the original polarization
- He resends a photon based on his (possibly incorrect) measurement

### The Error Rate
When an attacker uses the wrong basis, he introduces a detectable error:
- He gets the wrong bit with 50% probability (wrong basis)
- Your friend then has a 50% chance of measuring this corrupted photon incorrectly

Overall, an attacker's interception causes a **25% error rate** on the bits he intercepted (probability: $\\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$).

### Verification
You and your friend publicly compare a random subset of $n$ sifted-key bits. If the error rate exceeds a threshold, you abort. The probability of an attacker escaping detection is at most $\\left(\\frac{3}{4}\\right)^n$.`
    },
    {
      title: "Eve's Intercept-Resend Attack",
      content: `# Detecting an intercept-resend attack

Consider a single photon where you send $\\uparrow$ (bit 0) in the rectilinear basis ($\\oplus$):

### Case 1: Attacker picks the correct basis ($\\oplus$)
- Attacker measures $\\uparrow$ - gets bit 0 (correct)
- Attacker resends $\\uparrow$ to your friend
- Your friend's measurement is **unaffected** - no error introduced

### Case 2: Attacker picks the wrong basis ($\\otimes$)
- Attacker measures $\\uparrow$ in the diagonal basis -> gets $\\nearrow$ or $\\searrow$ with equal probability
- Suppose the attacker gets $\\nearrow$ (bit 0) and resends $\\nearrow$
- If your friend measures in $\\oplus$ (matching you): He gets $\\uparrow$ or $\\rightarrow$ with 50/50 probability
-- 50% chance of **wrong result** - detectable error!

### Overall Detection Probability (per intercepted bit)
$$ P(\\text{error}) = P(\\text{attacker wrong basis}) \\times P(\\text{friend wrong result}) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4} $$

For $n$ verification bits, the probability that the attacker goes undetected:
$$ P(\\text{undetected}) = \\left(\\frac{3}{4}\\right)^n $$

With just $n = 50$ verification bits: $P \\approx 5.7 \\times 10^{-7}$`
    },
    {
      title: "QKD Limitations: Partial Solution",
      content: `# Limitation 1: QKD is only a partial solution

QKD addresses **only** the key distribution problem. It provides a shared secret key, but it does **not** provide:

- **Authentication**: QKD cannot verify the identity of the communicating parties
-- Without authentication, QKD is vulnerable to active **man-in-the-middle attack**
-- Since QKD requires a dedicated channel, the attack is difficult to perform but still possible

- **Digital Signatures**: QKD offers no mechanism for non-repudiation or message integrity verification

### The Authentication Problem
To authenticate the classical channel used for sifting, you and your friend must rely on:
- **Pre-shared symmetric keys** (requires prior secure contact), or
- **Classical asymmetric cryptography** (which may be quantum-vulnerable)

This means QKD **does not eliminate the need** for classical cryptographic infrastructure. In practice, QKD systems often bootstrap authentication using post-quantum signature schemes like **ML-DSA** (FIPS 204).`
    },
    {
      title: "QKD Limitations: Hardware",
      content: `# Limitation 2: Special-purpose hardware

Unlike PQC, which can be deployed as a **software update**, QKD requires dedicated physical infrastructure.

### Hardware Requirements
- **Single-photon sources**: Devices that emit exactly one photon at a time (imperfect sources are a major attack vector)
- **Quantum channel**: Dedicated optical fiber or free-space line-of-sight link
- **Single-photon detectors**: Extremely sensitive devices operating near absolute zero
- **Quantum random number generators**: For basis selection

### Practical Consequences
- Cannot be integrated into existing network hardware or software stacks
- Hardware-centric nature makes **security patching difficult**
-- A vulnerability requires physical replacement, not a software update
- Each link requires its own dedicated quantum hardware
- Current technology limits transmission rates to **kilobits per second** (vs. gigabits for classical encryption)`
    },
    {
      title: "QKD Limitations: Infrastructure and Range",
      content: `# Limitation 3: Infrastructure cost and limited range

### The range problem
Photons are absorbed by optical fiber. After approximately **100–200 km**, the signal loss becomes too severe for reliable key exchange. Unlike classical signals, quantum states **cannot be amplified** (No-Cloning Theorem prevents quantum repeaters from simply copying the signal).

### Trusted Relays
To extend range, QKD networks use **trusted relay nodes**:
1. You establish a key $K_1$ with Relay 1
2. Relay 1 establishes a key $K_2$ with Relay 2 (or your friend)
3. The relay decrypts with $K_1$ and re-encrypts with $K_2$

### Security Implications
- Each relay has **full access** to the plaintext key material
- Relays must be housed in **physically secure facilities**
- A compromised relay breaks the entire chain
- This **negates the information-theoretic security** that makes QKD attractive

### Cost
Building and maintaining a QKD network with trusted relays is **orders of magnitude more expensive** than deploying PQC algorithms on existing infrastructure.`
    },
    {
      title: "QKD Limitations: Implementation Attacks",
      content: `# Limitation 4: Implementation vs. theoretical security

While the **physics** of BB84 is provably secure, the **engineering** introduces real vulnerabilities. Several attacks exploit hardware imperfections:

### Detector blinding attack
An adversary shines a bright laser at your friend's single-photon detectors, forcing them into a **linear mode** where they behave classically. The attacker can then control which detector "clicks" - effectively choosing your friend's measurement results without detection.

### Photon Number Splitting (PNS) attack
Real photon sources occasionally emit **multiple photons** per pulse. The attacker can split off the extra photon, measure it, and learn your bit - all without disturbing the photon that reaches your friend.

### Time-Shift attack
Exploiting timing differences between your friend's detectors, the attacker shifts the arrival time of photons to bias which detector responds, gaining partial information about the key.

### The fundamental issue
Theoretical security proofs assume **ideal hardware**. Real-world devices always have imperfections, and the tolerance for error is extremely low. Every new hardware platform requires extensive security analysis.`
    },
    {
      title: "QKD Limitations: Denial of Service",
      content: `# Limitation 5: Denial of Service Vulnerability

The very feature that makes QKD secure - its **extreme sensitivity to interference** - is also its greatest operational weakness.

### The attack
An adversary does not need to break the encryption. They simply need to **introduce noise** on the quantum channel:
- Tapping into the optical fiber
- Shining light into the channel
- Physically disturbing the fiber

### The effect
You and your friend detect a high error rate and **abort the protocol** - exactly as designed. But the result is that no key is ever established, effectively a **Denial of Service (DoS)**.

### Why This Matters
- The adversary gains nothing (no information), but **neither do you and your friend**
- Classical encrypted channels can still function under interference (with degraded performance)
- A QKD channel under attack produces **zero throughput**
- This makes QKD unsuitable for **mission-critical** applications where availability is paramount`
    },
    {
      title: "NSA's Position on QKD",
      content: `# NSA's Position on QKD

The National Security Agency (NSA) does **not** currently recommend QKD for use in National Security Systems (NSS). Their official position, published in the Post-Quantum Cybersecurity Resources, summarizes the five limitations:

1. **Partial solution** - does not provide authentication or signatures
2. **Special hardware** - cannot leverage existing network infrastructure
3. **Trusted relays** - introduce insider threat risks and negate theoretical security
4. **Implementation gaps** - hardware vulnerabilities undermine provable security
5. **DoS vulnerability** - extreme sensitivity to interference is operationally unacceptable

### NSA's Recommendation
The NSA views **post-quantum cryptographic algorithms** (PQC) as the more:
- **Cost-effective** solution (software deployment on existing hardware)
- **Flexible** solution (supports signatures, authentication, and key exchange)
- **Reliable** solution (decades of cryptanalysis methodology for algorithm validation)

Unless the significant engineering and infrastructure limitations are overcome, the NSA does not anticipate certifying QKD products for national security use.`
    },
    {
      title: "Summary",
      content: `# Summary

- **QKD** uses quantum mechanics (photon polarization, No-Cloning Theorem) to establish keys with **information-theoretic security**

- The **BB84 protocol** encodes bits in random polarization bases; basis mismatch causes eavesdropping to introduce a detectable **25% error rate**

- **Post-processing** (error correction + privacy amplification) produces a provably secure final key from the noisy sifted key

- **Practical limitations** severely constrain real-world deployment:
-- No authentication (needs classical crypto)
-- Requires expensive, dedicated quantum hardware
-- Limited range (~100-200 km without trusted relays)
-- Hardware vulnerabilities (detector blinding, PNS attacks)
-- Inherent DoS vulnerability

- The **NSA recommends PQC over QKD** as the practical path to quantum-safe cryptography

- In the next chapter, we explore how PQC and QKD can be **combined** to establish a quantum-safe public channel`
    },
    {
      title: "Further Reading",
      content: `# Further Reading

- [Quantum Cryptography: Public Key Distribution and Coin Tossing (Bennett & Brassard, 1984)](https://arxiv.org/abs/2003.06557)
-- The original BB84 paper that launched the field of quantum key distribution.

- [A Single Quantum Cannot Be Cloned (Wootters & Zurek, 1982)](https://www.nature.com/articles/299802a0)
-- The proof of the No-Cloning Theorem, foundational to QKD security.

- [Quantum Key Distribution: A Networking Perspective (Elkouss et al., 2013)](https://doi.org/10.1145/2480730.2480735)
-- Comprehensive overview of QKD protocols, implementations, and network architectures.

- [NSA Quantum Computing and Post-Quantum Cybersecurity FAQ](https://media.defense.gov/2021/Aug/04/2002821837/-1/-1/1/Quantum_FAQs_20210804.PDF)
-- The NSA's official position on QKD limitations and recommendations for PQC.

- [Quantum Hacking: Experimental Demonstration of Attacks on Commercial QKD Systems (Lydersen et al., 2010)](https://www.nature.com/articles/nphoton.2010.214)
-- Demonstrates the detector blinding attack on real-world QKD hardware.`
    },
  ],
};
