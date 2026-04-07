import type { Lesson } from "../../types";

export const lesson5: Lesson = {
  id: "module-2-lesson-5",
  title: "Securing Public Channel Classically",
  slides: [
    {
      title: "Securing the Public Channel",
      content: `# Chapter 5: Securing the Public Channel in Detail`
    },
    {
      title: "Combining the Primitives",
      content: `# From Building Blocks to Protocols

A secure communication protocol must solve **four problems simultaneously:**

1. **Confidentiality:** Encrypt data so eavesdroppers cannot read it → **AES** (symmetric cipher)
2. **Key Agreement:** Establish a shared secret over a public channel → **ECDH** (key exchange)
3. **Authentication:** Verify the identity of the communicating party → **ECDSA** or RSA signatures + **PKI**
4. **Integrity:** Detect any tampering with the transmitted data → **SHA** (hash functions) + **HMAC/AEAD**

No single primitive solves all four. Protocols like TLS, SSH, and IPsec define the precise **order**, **format**, and **rules** for combining these primitives into a single secure channel.`
    },
    {
      title: "TLS 1.3 Overview",
      content: `# Transport Layer Security (TLS) v1.3

TLS is the most widely deployed security protocol on the internet. Its evolution:

- **SSL 2.0 / 3.0** (1995–1996): The original Secure Sockets Layer by Netscape. Both versions are now **broken** and deprecated.
- **TLS 1.0 / 1.1** (1999–2006): Incremental improvements. Deprecated in 2021 due to known attacks
- **TLS 1.2** (2008): Major overhaul. Still widely used but permits legacy algorithms and complex configurations
- **TLS 1.3** (2018, RFC 8446): A new redesign

### Improvements in TLS v1.3
- Removed all legacy and insecure algorithms (RSA key exchange, CBC mode, etc.)
- Reduced the handshake from **2 round trips** to just **1 round trip**
- Encrypts the certificate — server identity is now hidden from eavesdroppers
- Mandates **forward secrecy** with ephemeral key exchange (ECDHE)`
    },
    {
      title: "TLS 1.3 Cipher Suites",
      content: `# TLS v1.3 Cipher Suites

A **cipher suite** defines the exact combination of algorithms used for a TLS session. TLS v1.3 dramatically simplified this — only **5 suites** are permitted:

- \`TLS_AES_256_GCM_SHA384\`
- \`TLS_AES_128_GCM_SHA256\`
- \`TLS_CHACHA20_POLY1305_SHA256\`
- \`TLS_AES_128_CCM_SHA256\`
- \`TLS_AES_128_CCM_8_SHA256\`

### Reading a cipher suite name:
- **AES_256_GCM** → The encryption algorithm: AES with 256-bit key in GCM mode
- **SHA384** → The hash function used for key derivation and handshake integrity

Note: In TLS 1.3, key exchange is **always ECDHE** (or DHE) and the signature algorithm is negotiated separately. This is why they are not in the suite name. Compare this with TLS 1.2 where you could still see \`TLS_RSA_WITH_AES_128_CBC_SHA\` (RSA for key distribution).`
    },
    {
      title: "Modes of Operation",
      content: `# Block Cipher Modes of Operation

AES encrypts **one 128-bit block** at a time. Real-world data consists of many blocks. A **mode of operation** defines how the cipher processes multiple blocks. The choice of mode dramatically affects both security and performance.

### ECB (Electronic Codebook) — Insecure
Each block is encrypted independently using the same key. **Identical plaintext blocks produce identical ciphertext blocks**, leaking patterns. It is insecure.

### CBC (Cipher Block Chaining)
Each plaintext block is XORed with the **previous ciphertext block** before encryption. Requires an Initialization Vector (**IV**) for the first block. 
-- Blocks must be processed **sequentially** (slow) and requires **padding** for non-aligned data. Used in older TLS 1.2 suites but **removed** from TLS 1.3.

### CTR (Counter Mode)
Converts the block cipher into a **stream cipher**: a counter value is encrypted, and the result is XORed with the plaintext. Blocks can be processed **in parallel** (fast). No padding needed.`
    },
    {
      title: "GCM and AEAD",
      content: `# GCM — Used in TLS v1.3

### GCM (Galois/Counter Mode)
GCM combines **CTR mode** for encryption with a **Galois field multiplication** for authentication. It produces both the ciphertext and an **authentication tag** in a single operation.

$$ \\text{GCM}(K, IV, P, A) \\rightarrow (C, T) $$

Where $K$ is the key, $IV$ is the initialization vector, $P$ is the plaintext, $A$ is associated data (e.g., headers), $C$ is the ciphertext, and $T$ is the authentication tag.

### AEAD (Authenticated Encryption with Associated Data)
GCM is an example of an **AEAD** mode of operation. AEAD schemes provide **both** confidentiality and integrity. All modes of operation in TLS v1.3 are examles of AEAD.

- An attacker might not be able to read the data, but they could still **flip bits** or **reorder blocks** 
-- The receiver would have no way to detect this, digital signatures are not used to sign each message, it would be slow 
- AEAD ciphers solve this by producing a tag that verifies both the ciphertext and any unencrypted headers (the "associated data")`
    },
    {
      title: "The TLS 1.3 Handshake",
      content: `# TLS 1.3 Handshake — Step by Step

**1. ClientHello →**
Client sends: supported cipher suites, supported groups (curves), its **ECDHE key share** ($Q_A = d_A \\cdot G$), and a random nonce.

**2. ← ServerHello**
Server selects: cipher suite and its **ECDHE key share** ($Q_B = d_B \\cdot G$). At this point, both parties can compute the shared secret $S = d_A \\cdot Q_B = d_B \\cdot Q_A$.

**3. Handshake Keys Derived**
Both sides use **HKDF** (HMAC-based Key Derivation Function) to derive handshake encryption keys from the shared secret and the transcript hash.

- **At this point encryption begins with the handshake keys**

**4. ← EncryptedExtensions, Certificate, CertificateVerify, Finished**
Server sends its certificate, signs the handshake transcript to prove its identity, and sends a Finished message with a MAC.

**5. Client Finished →**
Client verifies the certificate chain, the signature, and the Finished MAC, then sends its own Finished message. Application keys are derived.`
    },
    {
      title: "TLS 1.3 Handshake — Detailed Animation",
      content: `
      [COMPONENT: TLSHandshakeDetailed]`
    },
    {
      title: "Forward Secrecy",
      content: `# Forward Secrecy

In older protocols (TLS 1.2 with RSA key exchange), the server's **long-term private key** was used directly to decrypt the session key. If this key was ever compromised (stolen, leaked, or seized by a court order), an attacker could decrypt **all past recorded sessions**.

That is why TLS 1.3 mandates **ephemeral** Diffie-Hellman key exchange (ECDHE):
- Each session generates **fresh, random** ECDH key pairs
- The shared secret is derived from these ephemeral keys
- After the handshake, the ephemeral private keys are **immediately deleted**

So even if the server's **long-term private key** is compromised years later, past sessions **cannot** be decrypted
- The attacker would need the ephemeral private keys, which no longer exist`
    },
    {
      title: "SSH Protocol",
      content: `# SSH (Secure Shell)

SSH secures remote access to servers. Its handshake follows the same general pattern as TLS but differs in how authentication works.

### SSH Handshake Phases
**1. Protocol Negotiation:** Client and server exchange supported algorithm lists (key exchange, encryption, MAC, compression)
**2. Key Exchange:** Typically uses **ECDH** (curve25519) or classical DH. Both parties derive a shared secret and compute a session ID.
**3. Server Authentication:** The server proves its identity using its **host key** (usually Ed25519 or ECDSA). Unlike TLS, SSH does **not** use Certificate Authorities — the client maintains a local \`known_hosts\` file. On first connection, the user manually verifies the server's fingerprint.
**4. User Authentication:** After the secure channel is established, the client authenticates using:
-- **Password** — encrypted by the session key (less secure)
-- **Signature** — the client signs a challenge with their private key (more secure)
**5. Encrypted Session:** All subsequent data (shell commands, file transfers) is encrypted with AES.`
    },
    {
      title: "IPsec Protocol",
      content: `# IPsec (Internet Protocol Security)

IPsec operates at the **network layer** (Layer 3), encrypting IP packets themselves. This makes it transparent to applications — unlike TLS (which protects individual connections), IPsec protects **all traffic** between two network endpoints.

### Two Modes
- **Transport Mode:** Encrypts only the **payload** of each IP packet. Used for host-to-host communication.
- **Tunnel Mode:** Encrypts the **entire original IP packet** and wraps it in a new IP header. Used for **VPN tunnels** between networks.

### Key Components
- **IKE (Internet Key Exchange):** Establishes the security parameters and performs key exchange (uses DH/ECDH and certificates or Pre-Shared-Key).
- **ESP (Encapsulating Security Payload):** Provides encryption (AES-GCM) and integrity for the actual data packets.

### Use Cases
IPsec is the foundation of most **VPN** solutions (corporate VPNs, site-to-site tunnels). When you connect to your company's VPN, IKE performs a handshake similar to TLS, then ESP encrypts all your traffic.`
    },
    {
      title: "Further Reading",
      content: `# Further Reading

- [RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
-- The official TLS 1.3 specification.

- [NIST SP 800-38D: Recommendation for GCM Mode](https://csrc.nist.gov/publications/detail/sp/800-38d/final)
-- The official NIST specification for Galois/Counter Mode.

- [RFC 4253: The Secure Shell (SSH) Transport Layer Protocol](https://datatracker.ietf.org/doc/html/rfc4253)
-- The SSH transport protocol specification.

- [RFC 7296: Internet Key Exchange Protocol Version 2 (IKEv2)](https://datatracker.ietf.org/doc/html/rfc7296)
-- The IKEv2 specification used by IPsec.

- [Applied Cryptography by Bruce Schneier, Second Edition](https://mrajacse.wordpress.com/wp-content/uploads/2012/01/applied-cryptography-2nd-ed-b-schneier.pdf)
-- Chapters 4, 16, 17, 18, 24, 25`
    },
  ],
};
