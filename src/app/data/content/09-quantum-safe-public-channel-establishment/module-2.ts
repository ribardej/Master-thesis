import type { Lesson } from "../../types";

export const lesson9: Lesson = {
  id: "module-2-lesson-9",
  title: "Quantum-Safe Public Channel Establishment",
  slides: [
    {
      title: "Quantum-Safe Public Channel in Detail",
      content: `# Chapter 9: Quantum-Safe Public Channel in Detail`
    },
    {
      title: "The Transition Challenge",
      content: `# The Transition Challenge

Migrating the entire internet from classical to post-quantum cryptography is one of the largest infrastructure challenges in the history of computing.

### Why It's Hard
- TLS is embedded in **billions of devices** - browsers, servers, IoT devices, embedded systems
- A protocol change requires updates to both **client and server** software
- ML-KEM ciphertexts and public keys are **significantly larger** than ECDH parameters
-- ML-KEM-768 public key: **1,184 bytes** vs. ECDH: **32 bytes**
-- This increases handshake latency and bandwidth consumption

### The Hybrid Solution
Rather than a hard cutover, the industry is adopting a **gradual transition** using hybrid key exchange:
- Combine a **classical** (e.g., ECDH) and **post-quantum** (e.g., ML-KEM-768) key exchange in a single handshake
- The shared secret is derived from **both** results
- This ensures security even if one of the two algorithms is broken`
    },
    {
      title: "Hybrid Key Exchange: Mechanism",
      content: `# Hybrid Key Exchange: How It Works

In a hybrid scheme, the client and server perform **two independent key exchanges** simultaneously:

### Classical Component (ECDH)
1. Client generates ephemeral ECDH key pair: $(sk_c, pk_c)$
2. Server generates ephemeral ECDH key pair: $(sk_s, pk_s)$
3. Shared secret: $SS_1 = ECDH(sk_c, pk_s) = ECDH(sk_s, pk_c)$

### Post-Quantum Component (ML-KEM-768)
1. Client generates ML-KEM key pair: $(dk_c, ek_c)$
2. Server encapsulates: $(SS_2, ct) = \\text{Encaps}(ek_c)$
3. Client decapsulates: $SS_2 = \\text{Decaps}(dk_c, ct)$

### Combined Secret
The final shared secret is derived by concatenating and hashing both:
$$ SS_{\\text{hybrid}} = \\text{KDF}(SS_1 \\| SS_2) $$

If either $SS_1$ or $SS_2$ remains secret, the combined $SS_{\\text{hybrid}}$ is secure.`
    },
    {
      title: "Hybrid TLS 1.3 Handshake",
      content: `# Hybrid TLS 1.3 Handshake

The hybrid handshake extends the standard TLS 1.3 flow by including **both** key exchange parameters:

**1. ClientHello →**
Client sends: supported cipher suites, and a **combined key_share** containing both an ECDH public key and an ML-KEM-768 encapsulation key.

**2. ← ServerHello**
Server responds with: selected cipher suite, its ECDH public key, and the ML-KEM ciphertext (encapsulated shared secret).

**3. Key Derivation**
Both parties independently derive two shared secrets - one from ECDH, one from ML-KEM - and combine them via HKDF.

**4. Encrypted Handshake**
From this point, the handshake is encrypted. Server sends its certificate, signature (ML-DSA or ECDSA), and Finished message.

**5. Secure Channel**
Client verifies the certificate chain and signature, sends its Finished message. Application keys are derived from the hybrid shared secret.`
    },
    {
      title: "Hybrid TLS Handshake Animation",
      content: `
[COMPONENT: HybridTLSHandshakeAnimation]`
    },
    {
      title: "Hybrid Signatures",
      content: `# Hybrid Signatures and Certificates

Authentication can also be hybridized. A hybrid certificate contains **two public keys** and **two signatures**:

### Hybrid Certificate Structure
- Subject's classical public key (e.g., ECDSA P-256)
- Subject's post-quantum public key (e.g., ML-DSA-65)
- CA's classical signature over the certificate
- CA's post-quantum signature over the certificate

### Verification
The verifier checks **both** signatures. The certificate is accepted only if both are valid.

### Current State
- Hybrid certificates are still being standardized (IETF drafts)
- In practice, many deployments currently use **hybrid key exchange** with **classical-only signatures**
-- This is because Shor's algorithm breaks key exchange retroactively (Store-Now-Decrypt-Later), but signature forgery requires a quantum computer **at the time of attack**
-- Authentication is less urgent to upgrade than key exchange`
    },
    {
      title: "Real-World Deployments",
      content: `# Real-World Hybrid Deployments

The hybrid transition is already underway:

### Google Chrome (2024)
- Enabled **X25519Kyber768** (now X25519MLKEM768) by default for all TLS connections
- Uses hybrid key exchange combining ECDH + ML-KEM-768

### Cloudflare (2024)
- Deployed hybrid PQ key exchange across its entire CDN
- Supports both X25519Kyber768Draft00 and X25519MLKEM768

### Signal Protocol (2023)
- Added post-quantum protection with **PQXDH** (Post-Quantum Extended Diffie-Hellman)
- Combines ECDH with a KEM (Kyber/ML-KEM) for initial key agreement

### AWS (2024)
- AWS Key Management Service supports hybrid TLS with ML-KEM
- Available for S2N-TLS (AWS's TLS implementation)

### OpenSSL 3.5 (2025)
- Native support for ML-KEM and hybrid key exchange
- All major web servers (Apache, Nginx) gain PQ support through OpenSSL`
    },
    {
      title: "Comparing the Three Approaches",
      content: `# Comparing the Three Approaches

| Criterion | Pure PQC | QKD | Hybrid |
|-----------|----------|-----|--------|
| Security basis | Lattice hardness | Laws of physics | Both classical + PQ |
| Authentication | ML-DSA | Requires classical crypto | ECDSA + ML-DSA |
| Hardware | Existing infrastructure | Dedicated fiber + detectors | Existing infrastructure |
| Range | Unlimited (internet) | ~100-200 km | Unlimited (internet) |
| Deployment | Software update | Physical installation | Software update |
| Maturity | Standardized 2024 | Experimental / niche | Deployed in production |
| Recommended by | NIST, NSA | Niche research labs | NIST, NSA, BSI, industry |

The **hybrid scheme** is the clear winner for practical, large-scale deployment during the transition period.`
    },
    {
      title: "The Road Ahead",
      content: `# PQC adoption plan

### Short Term (2024–2030)
- Deploy **hybrid key exchange** (ECDH + ML-KEM) in TLS, SSH, IPsec
- Begin issuing **hybrid certificates** as standards mature
- Inventory and prioritize systems for migration

### Medium Term (2030–2035)
- As confidence in PQ algorithms grows, consider **pure PQC** deployments
- Retire classical-only key exchange from critical systems
- QKD may become viable for **high-security point-to-point** links (government, military)

### Long Term (2035+)
- Full transition to post-quantum cryptography
- Classical algorithms (ECDH, ECDSA, RSA) deprecated for security-critical use
- Quantum networks may enable broader QKD deployment`
    },
    {
      title: "Summary",
      content: `# Summary

- The quantum threat requires replacing **ECDH** (key exchange) and **ECDSA** (authentication) in TLS

- **Hybrid key exchange** (e.g., ECDH + ML-KEM) is the recommended transition strategy
-- Provides defense-in-depth: secure if **either** algorithm holds
-- Already deployed by Google, Cloudflare, Signal, and AWS

- The hybrid TLS 1.3 handshake extends the classical flow by including **both** classical and PQ key shares

- **QKD** remains a niche solution for ultra-high-security point-to-point links

- The transition is a multi-year effort requiring coordination across the entire internet infrastructure`
    },
    {
      title: "Further Reading",
      content: `# Further Reading

- [NIST SP 800-227: Recommendations for Transition to Post-Quantum Cryptography](https://csrc.nist.gov/pubs/sp/800/227/final)
-- NIST's official migration guidance, including hybrid recommendations.

- [RFC 9180: Hybrid Public Key Encryption (HPKE)](https://datatracker.ietf.org/doc/html/rfc9180)
-- The framework for combining multiple KEM schemes.

- [Cloudflare: The state of post-quantum TLS deployments](https://blog.cloudflare.com/pq-2024/)
-- Practical insights from one of the largest PQ deployments.

- [Signal: PQXDH Key Agreement Protocol](https://signal.org/docs/specifications/pqxdh/)
-- Signal's specification for post-quantum key agreement.

- [Google Security Blog: Protecting Chrome Traffic with Hybrid Kyber KEM](https://security.googleblog.com/2023/08/protecting-chrome-traffic-with-hybrid.html)
-- Google's approach to deploying hybrid PQ in Chrome.`
    },
  ],
};
