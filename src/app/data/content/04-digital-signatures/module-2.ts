import type { Lesson } from "../../types";

export const lesson4: Lesson = {
  id: "module-2-lesson-4",
  title: "Digital Signatures",
  slides: [
    {
      title: "Digital Signatures",
      content: `# Chapter 4: Digital Signatures in Detail`
    },
    {
      title: "Digital Signatures Recap",
      content: `# Digital Signatures

A digital signature is a mathematical scheme for verifying the authenticity and integrity of a digital message or document.

**The general process:**
1. The signer computes a signature $s$ from a message $m$ and their **private key** $d$.
2. The verifier checks the signature $s$ against the message $m$ using the signer's **public key** $e$.
3. The verification outputs either **valid** or **invalid**.

A secure signature scheme must satisfy:
- **Correctness:** A legitimately generated signature always passes verification.
- **Unforgeability:** Without the private key, it is computationally infeasible to produce a valid signature.`
    },
    {
      title: "Hash Functions",
      content: `# Cryptographic Hash Functions

Before exploring signature algorithms, we need to understand **hash functions** - a core building block.

A cryptographic hash function $H$ maps an input of arbitrary length to a fixed-length output (the **digest** or **hash**):
$$ H: \\{0,1\\}^* \\rightarrow \\{0,1\\}^n $$

For example, SHA-256 always produces a 256-bit digest regardless of whether the input is 1 byte or 1 terabyte.

### Why hash before signing?
- Signature algorithms operate on **fixed-size inputs**. Hashing reduces any message to a fixed-length digest.
- Signing the hash is dramatically **faster** than signing the entire message directly.
- The hash acts as a unique **fingerprint** of the message.`
    },
    {
      title: "Hash Function Properties",
      content: `# Required Properties of Cryptographic Hash Functions

A hash function $H$ must satisfy three security properties:

### 1. Pre-image Resistance (One-way)
Given a hash $h$, it is computationally infeasible to find any input $m$ such that $H(m) = h$.

### 2. Second Pre-image Resistance
Given an input $m_1$, it is infeasible to find a different input $m_2 \\neq m_1$ such that $H(m_1) = H(m_2)$.

### 3. Collision Resistance
It is infeasible to find **any** pair of distinct inputs $m_1 \\neq m_2$ such that $H(m_1) = H(m_2)$.

Collision resistance is the strongest property. Due to the **birthday paradox**, a hash with $n$-bit output only provides $n/2$ bits of collision resistance (e.g., SHA-256 provides $2^{128}$ collision security).`
    },
    {
      title: "The SHA Family",
      content: `# Secure Hash Algorithm (SHA) Family

The most widely used hash functions are standardized by NIST:

### SHA-1 (160-bit output)
Designed in 1995. **Broken** - practical collision attacks were demonstrated in 2017 (the SHAttered attack by Google). No longer considered secure.

### SHA-2 Family
Published in 2001. Includes **SHA-224**, **SHA-256**, **SHA-384**, and **SHA-512**. As of 2026, SHA-2 remains **unbroken** and is the most popular hash function for digital signatures.

### SHA-3 (Keccak)
Selected through a NIST competition in 2012 as a backup standard. Uses an entirely different internal structure (the sponge construction) from SHA-2. Provides an additional layer of algorithm diversity.`
    },
    {
      title: "The Hash-then-Sign Paradigm",
      content: `# Hash-then-Sign

All modern signature schemes follow the **hash-then-sign** paradigm:

**Signing:**
1. Compute the hash digest: $h = H(m)$
2. Apply the signature algorithm to $h$ using the private key $d$: $s = \\text{Sign}(h, d)$
3. Send the pair $(m, s)$

**Verification:**
1. Recompute the hash: $h' = H(m)$
2. Check the signature against $h'$ using the public key $e$: $\\text{Verify}(h', s, e) \\stackrel{?}{=} \\text{valid}$

This ensures that any modification to the message $m$ changes the digest $h$, causing signature verification to fail. The hash function thus guarantees the **integrity** of the signed message.`
    },
    {
      title: "RSA Signatures",
      content: `# RSA Digital Signatures

RSA signatures use the same key pair $(e, n)$ and $(d, n)$ as RSA encryption (covered in Chapter 3), but the operations are **reversed**.

**Key Generation:** Identical to RSA encryption - choose primes $p, q$, compute $n = p \\cdot q$, $\\phi(n) = (p-1)(q-1)$, choose public exponent $e$, compute private exponent $d$.

**Signing** (using private key):
$$ s = h^d \\pmod{n} $$
where $h = H(m)$ is the hash of the message.

**Verification** (using public key):
$$ h' = s^e \\pmod{n} $$
The verifier checks whether $h' = H(m)$. If they match, the signature is valid.

**Why this works** (Euler's theorem):
$$ s^e = (h^d)^e = h^{de} = h^{k \\cdot \\phi(n) + 1} \\equiv h \\pmod{n} $$`
    },
    {
      title: "RSA Signature Example",
      content: `
      [COMPONENT: RSASignatureNumeric]`
    },
    {
      title: "DSA: Introduction",
      content: `# Digital Signature Algorithm (DSA)

DSA was proposed by NIST in 1991 and standardized as **FIPS 186** in 1994. Unlike RSA signatures, DSA is a **dedicated** signature scheme - it cannot be used for encryption and similarly to the DH algorithm it relies on the discrete logarithm problem.

DSA operates within a **prime-order subgroup** of $\\mathbb{Z}^*_p$:

### Domain Parameters $(p, q, g)$
- $p$: A large prime (2048 or 3072 bits) defining the group $\\mathbb{Z}^*_p$
- $q$: A prime divisor of $(p-1)$, typically 256 bits, defining the subgroup order
- $g$: A generator of the subgroup of order $q$, computed as:
$$ g = h^{(p-1)/q} \\pmod{p} $$
where $h$ is any integer $1 < h < p-1$ such that $g \\neq 1$.

These parameters can be **shared** among multiple users.`
    },
    {
      title: "DSA: Key Generation",
      content: `# DSA: Key Generation

Given domain parameters $(p, q, g)$:

**Private Key:**
- Choose a random integer $x$ such that $0 < x < q$

**Public Key:**
- Compute $y = g^x \\pmod{p}$

The security relies on the **Discrete Logarithm Problem**: given $g$, $p$, and $y$, finding $x$ is computationally infeasible.

Note: The private key $x$ is a single number in the range $[1, q-1]$, making it significantly smaller than an RSA private key. This is one of the efficiency advantages of DSA.`
    },
    {
      title: "DSA: Signing",
      content: `# DSA: Signing Algorithm

To sign a message $m$ using private key $x$ and parameters $(p, q, g)$:

**1.** Compute the message hash: $h = H(m)$

**2.** Choose a random per-message secret $k$ such that $0 < k < q$

**3.** Compute the signature pair $(r, s)$:
$$ r = (g^k \\pmod{p}) \\pmod{q} $$
$$ s = k^{-1}(h + x \\cdot r) \\pmod{q} $$

**4.** The signature is the pair $(r, s)$

### Critical requirement:
The value $k$ must be **truly random** and **never reused**. If the same $k$ is used for two different messages, the private key $x$ can be trivially recovered. This exact flaw led to the famous **PlayStation 3 private key extraction** in 2010.`
    },
    {
      title: "DSA: Verification",
      content: `# DSA: Signature verification

To verify signature $(r, s)$ on message $m$ using public key $y$ and parameters $(p, q, g)$:
**1.** Verify that $0 < r < q$ and $0 < s < q$
**2.** Compute the message hash: $h = H(m)$
**3.** Compute the modular inverse of $s$:
$$ w = s^{-1} \\pmod{q} $$
**4.** Compute two intermediate values:
$$ u_1 = h \\cdot w \\pmod{q} $$
$$ u_2 = r \\cdot w \\pmod{q} $$
**5.** Compute the verification value:
$$ v = (g^{u_1} \\cdot y^{u_2} \\pmod{p}) \\pmod{q} $$
**6.** The signature is **valid** if and only if $v = r$.
The mathematical proof relies on the fact that substituting the signing equations into the verification recovers the original $r$ value.`
    },
    {
      title: "Why DSA Works",
      content: `# Why DSA Verification Works

Given message hash $h$, signature $(r, s)$, and public key $y$, verification mathematically proves the signing equation $s \\equiv k^{-1}(h + x \\cdot r) \\pmod{q}$.

**Proof of Correctness:**
$$
\\begin{aligned}
s &\\equiv k^{-1}(h + x \\cdot r) \\pmod{q} \\\\
k &\\equiv s^{-1}(h + x \\cdot r) \\pmod{q} \\\\
k &\\equiv s^{-1}h + (s^{-1}r)x \\pmod{q} \\\\
k &\\equiv u_1 + u_2x \\pmod{q}
\\end{aligned}
$$

By treating this as an exponent of the generator $g$:
$$
\\begin{aligned}
g^k &\\equiv g^{u_1 + u_2x} \\pmod{p} \\\\
g^k &\\equiv g^{u_1} \\cdot g^{x \\cdot u_2} \\pmod{p} \\\\
g^k &\\equiv g^{u_1} \\cdot (g^x)^{u_2} \\pmod{p}
\\end{aligned}
$$

Substitute the public key $y \\equiv g^x \\pmod{p}$:
$$
g^k \\equiv g^{u_1} \\cdot y^{u_2} \\pmod{p}
$$

The verification value $v$ evaluates this exact exponentiation modulo $p$, and matches it against the modulo $q$ reduction:
$$
\\begin{aligned}
v &= (g^{u_1} \\cdot y^{u_2} \\pmod{p}) \\pmod{q} \\\\
v &= (g^k \\pmod{p}) \\pmod{q} \\\\
v &= r
\\end{aligned}
$$`
    },
    {
      title: "DSA Example",
      content: `
      [COMPONENT: DSANumeric]`
    },
    {
      title: "ECDSA: Introduction",
      content: `# Elliptic Curve Digital Signature Algorithm (ECDSA)

ECDSA is the elliptic curve variant of DSA. It provides the **same security** as DSA but with **significantly smaller** key and signature sizes, using the elliptic curve mathematics covered in Chapter 3.

### Domain Parameters
- An elliptic curve $E$ over $\\mathbb{F}_p$ (e.g., the NIST P-256 curve)
- A base point $G$ of **prime** order $n$ on the curve
- The order $n$ (number of points generated by $G$)

### Key Generation
- **Private key:** A random integer $d$ such that $1 \\le d \\le n-1$
- **Public key:** The point $Q = d \\cdot G$ on the curve

The security relies on the **Elliptic Curve Discrete Logarithm Problem (ECDLP)**: given $G$ and $Q$, finding $d$ is computationally infeasible.`
    },
    {
      title: "ECDSA: Signing",
      content: `# ECDSA: Signing Algorithm

To sign a message $m$ with private key $d$:
**1.** Compute the hash: $e = H(m)$
**2.** Choose a random per-message secret $k$ such that $1 \\le k \\le n-1$
**3.** Compute the curve point:
$$ (x_1, y_1) = k \\cdot G $$
**4.** Compute $r$:
$$ r = x_1 \\pmod{n} $$
**5.** Compute $s$:
$$ s = k^{-1}(e + d \\cdot r) \\pmod{n} $$
**6.** The signature is the pair $(r, s)$
Note the structural similarity to DSA - the key difference is that the operation $g^k \\pmod{p}$ is replaced by **scalar multiplication** $k \\cdot G$ on the elliptic curve, and modular arithmetic is performed modulo the curve order $n$ instead of the subgroup order $q$.`
    },
    {
      title: "ECDSA: Verification",
      content: `# ECDSA: Verification Algorithm

To verify signature $(r, s)$ on message $m$ using public key $Q$:
**1.** Verify that $1 \\le r, s \\le n-1$
**2.** Compute the hash: $e = H(m)$
**3.** Compute:
$$ 
\\begin{aligned}
w &= s^{-1} \\pmod{n} \\\\
u_1 &= e \\cdot w \\pmod{n} \\\\
u_2 &= r \\cdot w \\pmod{n} \\\\
\\end{aligned} 
$$
**4.** Compute the curve point:
$$ (x_1, y_1) = u_1 \\cdot G + u_2 \\cdot Q $$
**5.** The signature is **valid** if and only if $r \\equiv x_1 \\pmod{n}$
ECDSA is the most widely used signature algorithm today. It is the default in **TLS**, **SSH**, or cryptocurrencies like **Bitcoin**, or **Ethereum**.`
    },
    {
      title: "Why ECDSA Works",
      content: `# Why ECDSA Verification Works

Given message hash $e$, signature $(r, s)$, and public key $Q$, verification mathematically proves the signing equation $s \\equiv k^{-1}(e + d \\cdot r) \\pmod{n}$.

**Proof of Correctness:**
$$
\\begin{aligned}
s &\\equiv k^{-1}(e + d \\cdot r) \\pmod{n} \\\\
k &\\equiv s^{-1}(e + d \\cdot r) \\pmod{n} \\\\
k &\\equiv s^{-1}e + (s^{-1}r)d \\pmod{n} \\\\
k &\\equiv u_1 + u_2d \\pmod{n}
\\end{aligned}
$$

By treating this as a scalar and multiplying the base point $G$:
$$
\\begin{aligned}
k \\cdot G &= (u_1 + u_2d) \\cdot G \\\\
k \\cdot G &= u_1 \\cdot G + u_2 \\cdot (d \\cdot G)
\\end{aligned}
$$

Substitute the public key $Q = d \\cdot G$:
$$
\\begin{aligned}
k \\cdot G &= u_1 \\cdot G + u_2 \\cdot Q \\\\
k \\cdot G &= V
\\end{aligned}
$$

The signer's original point $R = k \\cdot G$ is equal to the verifier's calculated point $V$. Since the points are equivalent, their x-coordinates match ($x(R) = x(V)$), yielding:
$$
\\begin{aligned}
x(R) \\pmod{n} &= x(V) \\pmod{n} \\\\
r &= v
\\end{aligned}
$$`
    },
    {
      title: "ECDSA Example",
      content: `
      [COMPONENT: ECDSANumeric]`
    },
    {
      title: "Comparison: RSA vs DSA vs ECDSA",
      content: `# Comparing Signature Algorithms

While all three algorithms provide equivalent security guarantees, their efficiency differs significantly.

**RSA** relies on the difficulty of integer factorization.
**DSA** relies on the discrete logarithm problem in $\\mathbb{Z}^*_p$.
**ECDSA** relies on the elliptic curve discrete logarithm problem (ECDLP).

Since no sub-exponential algorithm exists for solving ECDLP (unlike factorization and standard DLP), ECDSA achieves the same security with much smaller parameters. **DSA is no longer approved** for use by NIST (since 2023). 

**NIST Recommended Equivalencies (security level → key size):**
- **80-bit:** RSA = 1024 bits | DSA = 1024/160 bits | ECDSA = 160 bits
- **128-bit:** RSA = 3072 bits | DSA = 3072/256 bits | ECDSA = 256 bits
- **256-bit:** RSA = 15360 bits | DSA = 15360/512 bits | ECDSA = 512 bits

ECDSA signatures are also much **shorter** - a 256-bit ECDSA signature is only 64 bytes, compared to 256+ bytes for RSA-2048.`
    },
    {
      title: "Digital Certificates",
      content: `# Digital Certificates (X.509)

A digital signature can verify that a message was signed by a specific **private key**. But how do we know that the corresponding **public key** actually belongs to the person we think it does?

A **digital certificate** solves this by binding a public key to an identity. The most widely used format is **X.509**, which contains:

- **Subject:** The identity of the key owner (e.g., domain name, organization)
- **Subject's Public Key:** The public key being certified
- **Issuer:** The Certificate Authority (CA) that issued the certificate
- **Validity Period:** Start and expiration dates
- **Serial Number:** A unique identifier
- **Signature Algorithm:** The algorithm used by the CA to sign the certificate
- **Digital Signature:** The CA's signature over all the above fields

The CA's signature is the **guarantee** - it means the CA has verified that the subject truly owns the stated public key.`
    },
    {
      title: "Public Key Infrastructure",
      content: `# Public Key Infrastructure (PKI)

PKI is the system of roles, policies, and procedures needed to create, manage, and verify digital certificates.

### Certificate Authorities (CAs)
A CA is a trusted third party that issues digital certificates. There are two levels:
- **Root CAs:** Self-signed certificates pre-installed in your operating system and browser. They form the **trust anchors**.
- **Intermediate CAs:** Certified by Root CAs. They issue the actual end-entity certificates.

### Chain of Trust
When you receive a certificate, you verify it by following the chain:
1. The end-entity certificate is signed by an Intermediate CA
2. The Intermediate CA's certificate is signed by a Root CA (or another Intermediate CA -> repeat step 2)
3. The Root CA's certificate is in your device's trusted store

If every signature in the chain is valid and no certificate is expired or revoked, the public key is **trusted**.`
    },
    {
      title: "PKI in Practice: TLS/HTTPS",
      content: `# PKI in Practice: TLS/HTTPS

Every time you visit a website with a padlock icon, PKI is at work:

**1.** Your browser connects to the server and receives its **X.509 certificate** containing the server's public key.

**2.** The browser verifies the **certificate chain** up to a trusted Root CA.

**3.** The browser uses the server's certified public key to authenticate a **key exchange** (typically ECDHE - Elliptic Curve Diffie-Hellman Ephemeral).

**4.** The server **signs** the key exchange parameters with its private key (typically using ECDSA or RSA-PSS).

**5.** Both parties derive a shared symmetric key and switch to **AES** for the rest of the session.`
    },
    {
      title: "Further Reading",
      content: `# Further Reading

- [FIPS 186-5: Digital Signature Standard (DSS)](https://csrc.nist.gov/publications/detail/fips/186/5/final)
-- The official NIST standard for RSA, DSA, and ECDSA signatures.

- [A Method for Obtaining Digital Signatures and Public-Key Cryptosystems (RSA-1978)](https://people.csail.mit.edu/rivest/Rsapaper.pdf)
-- The original RSA paper, which also introduced the concept of RSA signatures.

- [PKCS#1 v2.2: RSA Cryptography Standard (RFC 8017)](https://datatracker.ietf.org/doc/html/rfc8017)
-- Specifies RSA-PSS and PKCS#1 v1.5 signature padding.

- [SEC 1: Elliptic Curve Cryptography](https://www.secg.org/sec1-v2.pdf)
-- The foundational standard for ECDSA.

- [Applied Cryptography by Bruce Schneier, Second Edition](https://mrajacse.wordpress.com/wp-content/uploads/2012/01/applied-cryptography-2nd-ed-b-schneier.pdf)
-- Chapters 2, 20

- [RFC 5280: Internet X.509 PKI Certificate Profile](https://datatracker.ietf.org/doc/html/rfc5280)
-- The specification for X.509 certificates and PKI.`
    },
  ],
};
