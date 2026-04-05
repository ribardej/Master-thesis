import type { Lesson } from "../../types";

export const lesson3: Lesson = {
  id: "module-2-lesson-3",
  title: "Key Distribution Algorithms",
  slides: [
    {
      title: "The Key Distribution Problem",
      content: `# Chapter 3: Key Distribution Algorithms in Detail`

    },
    {
      title: "The Key Distribution Problem",
      content: `# The Key Distribution Problem

While symmetric ciphers like AES ensure robust data confidentiality, their security strictly depends on the assumption that communicating parties already possess an identical, pre-shared key. 

**This introduces a recursive paradox:**
- If the confidentiality of our communication relies entirely on a shared secret key, how do we securely agree on this key over the public, insecure channel?
- We need an encrypted channel to send the key, but we need the key to establish the encrypted channel!

In pre-digital eras, this was solved via physical couriers. In modern digital networks, mathematical solutions - Key Exchange algorithms break this deadlock.`,
    },
    {
      title: "The Key Distribution Problem",
      content: `## There are 3 standardized classical algorithms used for key exchange:\n\n\n\n\n
      
      - ### Diffie-Hellman
      - ### Deffie-Hellman over Elliptic curves
      - ### RSA`

    },
    {
      title: "DH Math Prerequisites I",
      content: `# Diffie-Hellman (DH) - Math Prerequisites I

- **Prime number** ($p$): A natural number $p$ (greater than 1) is a prime number if and only if it can be divided evenly only by 1 and itself.
- **Binary operation** $\\bullet$** over a set **$S$: A function from $(S \\times S)$ back to $S$. (For example, operation $+$ over whole numbers).
- **Greatest common divisor **$gcd(a, b)$: The greatest positive number that divides both $a$ and $b$ without a reminder.
- **Abelian Group **($S$, $\\bullet$): A tuple of a set $S$ and a binary operation $\\bullet$ defined over the set. The tuple is an Abelian group if all of the following conditions hold:
  -- **Associativity**: $\\forall a, b, c \\in S: (a \\bullet b) \\bullet c = a \\bullet (b \\bullet c)$
  -- **Identity element**: $\\exists e \\in S$ such that $\\forall a \\in S: e \\bullet a = a = a \\bullet e$
  -- **Inverse element**: $\\forall a \\in S$ there $\\exists v \\in S: v \\bullet a = e = a \\bullet v$, where $e$ is the identity element
  -- **Commutativity**: $\\forall a, b \\in S: a \\bullet b = b \\bullet a$
- **Cyclic Group **($S$, $\\bullet$): An Abelian group ($S$, $\\bullet$) is cyclic if there exists an element $g \\in S$, such that 
$$ S = \\{g, g \\bullet g, g \\bullet g \\bullet g, \\dots\\} $$`,
    },
    {
      title: "DH Math Prerequisites II",
      content: `# Diffie-Hellman (DH) - Math Prerequisites II

- **Finite multiplicative Group **$\\mathbb{Z}^*_n$: A group given by the binary operation of multiplication and a set of all numbers $a \\in \\{1, 2, \\dots, n-1\\}$, such that $gcd(a, n) = 1$.
- $\\mathbb{Z}^*_p$: For every prime number $p$, $\\mathbb{Z}^*_p$ is a Cyclic Group.
- **Order (size) of a Group**: For a finite group $G$, the order (denoted $|G|$ or $ord(G)$) is the number of elements in the set. For $\\mathbb{Z}^*_p$, the order is always $p-1$.
- **Primitive Root modulo **$p$: A generator $g$ of the group $\\mathbb{Z}^*_p$. Its powers $g^1, \\dots, g^{p-1} \\pmod p$ generate all distinct integers from $1$ to $p-1$.
- **Fermat's Little Theorem**: For any prime $p$ and integer $a$ such that $\\gcd(a, p) = 1$:
  $$ a^{p-1} \\equiv 1 \\pmod p $$
  This implies that in $\\mathbb{Z}^*_p$, the exponents work modulo $p-1$.`,
    },
    {
      title: "Diffie-Hellman Algorithm",
      content: `# Diffie-Hellman: Definition

The Diffie-Hellman protocol relies on the hardness of the **Discrete Logarithm Problem**: computing $g^x \\pmod{p}$ is easy, but finding $x$ knowing only the result is computationally infeasible.

**Step 1: Setup**
You and your friend agree publicly on a large prime $P$ and a generator $g$.

**Step 2: Exchange**
- You pick a random private key $a$ and compute your public part: $s_a = g^a \\pmod{P}$
- Your friend picks a random private key $b$, computes his public part: $s_b = g^b \\pmod{P}$
- You exchange $s_a$ and $s_b$ over the insecure channel.

**Step 3: Shared Secret**
Each of you raise the received public part to your own private key to get the same shared secret:
$$ s = (s_b)^{a} = (g^{b})^a = g^{ba} = (g^{a})^b = (s_a)^{b} \\pmod{P} $$`,
    },
    {
      title: "Diffie-Hellman Demo",
      content: `
[COMPONENT: DHNumericAnimation]`
    },
    {
      title: "ECDH Math Prerequisites I",
      content: `# Elliptic Curve DH (ECDH) - Math Prerequisites I

The principle of ECDH stays the same as in the case of DH, what changes is the cyclic (sub)group:

- **Finite Field** $\\mathbb{F}_p$: A set of integers $\\{0, 1, \\dots, p-1\\}$ where addition, subtraction, multiplication, and division (except by zero) are defined modulo a prime $p$. In ECC, the coordinates of points belong to this field.
- **Elliptic Curve equation (Weierstrass form)**: An equation of the form:
  $$ y^2 \\equiv x^3 + ax + b \\pmod p $$
  where $a, b \\in \\mathbb{F}_p$ are constant coefficients satisfying the non-singularity condition $4a^3 + 27b^2 \\not\\equiv 0 \\pmod p$ (ensuring the curve has no cusps or self-intersections).
- **Point at Infinity** ($\\mathcal{O}$): A special point defined to be the **identity element** of the elliptic curve group. It acts like the number "0" in addition: $P + \\mathcal{O} = P$.
- **The Elliptic Curve Group** $E(\\mathbb{F}_p)$: The set of all pairs $(x, y) \\in \\mathbb{F}_p \\times \\mathbb{F}_p$ that satisfy the curve equation, plus the point at infinity $\\mathcal{O}$.`,
    },
    {
      title: "ECDH Math Prerequisites II",
      content: `# Elliptic Curve DH (ECDH) - Math Prerequisites II

- **Point Addition (The Group Operation)**: A binary operation "$+$" defined geometrically (chord-and-tangent rule) or algebraically. Given two points $P$ and $Q$:
  -- If $P \\neq Q$: The line through $P$ and $Q$ intersects the curve at a third point $R'$. The sum $P+Q$ is the reflection of $R'$ across the x-axis ($R$).
  -- If $P = Q$ (Point Doubling): The tangent line at $P$ intersects the curve at $R'$. The sum $2P$ is the reflection of $R'$.
  -- If $P$ and $Q$ are vertical reflections (e.g., same $x$, opposite $y$): Their sum is the point at infinity $\\mathcal{O}$.
- **Scalar Multiplication**: The operation of adding a point $P$ to itself $k$ times (analogous to exponentiation in standard DH):
  $$ Q = k \\cdot P = \\underbrace{P + P + \\dots + P}_{k \\text{ times}} $$
  Here, $k$ is an integer (the private key), and $Q$ is a point (the public key).
- **Order of the Curve** ($\\#E$): The total number of points on the $E(\\mathbb{F}_p)$ curve (including $\\mathcal{O}$). By Hasse's Theorem, this number is close to the prime $p$: $| \\#E - (p+1) | \\le 2\\sqrt{p}$.
- **Elliptic Curve Discrete Logarithm Problem (ECDLP)**: Given a base point $G$ and a result point $Q = k \\cdot G$, determine the integer $k$.`,
    },
    {
      title: "Point Doubling Example",
      content: `# Example of arithmetics in $E(\\mathbb{F}_{97})$
Let's double a point $P = (3, 6)$ on the following elliptic curve $E(\\mathbb{F}_{97})$:
$$ y^2 \\equiv x^3 + 2x + 3 \\pmod{97} $$
**1. Find the slope ($\\lambda$) of the tangent line:**
$$ \\lambda \\equiv \\frac{3x_P^2 + a}{2y_P} \\equiv \\frac{3(3)^2 + 2}{2(6)} \\equiv \\frac{29}{12} \\pmod{97} $$
To divide by 12, we multiply by its modular inverse ($12^{-1} \\equiv 89 \\pmod{97}$):
$$ \\lambda \\equiv 29 \\cdot 89 \\equiv 2581 \\equiv 59 \\pmod{97} $$
**2. Calculate the new x-coordinate ($x_R$):**
$$ x_R \\equiv \\lambda^2 - 2x_P \\equiv 59^2 - 2(3) \\equiv 3481 - 6 \\equiv 80 \\pmod{97} $$
**3. Calculate the new y-coordinate ($y_R$):**
$$ y_R \\equiv \\lambda(x_P - x_R) - y_P \\equiv 59(3 - 80) - 6 \\equiv -4549 \\equiv 10 \\pmod{97} $$
**Result:** The geometrically doubled point is exactly **$2P = (80, 10)$**.`,
    },
    {
      title: "ECDH Algorithm",
      content: `# ECDH: Definition

ECDH operates on points on the curve $E(\\mathbb{F}_p)$ rather than integers modulo $p$.

**1. Setup:**
Parties agree on curve parameters (prime $p$, coefficients $a,b$) and a base generator point $G$.

**2. Exchange:**
- You pick a random private integer $d_A$ and compute your public point $Q_A = d_A \\cdot G$.
- Your friend picks a random private integer $d_B$ and computes his public point $Q_B = d_B \\cdot G$.
- You exchange public points $Q_A$ and $Q_B$.

**3. Shared Secret Derivation:**
Each party multiplies the received point by their own private scalar:
- You calculate: $S = d_A \\cdot Q_B = d_A \\cdot (d_B \\cdot G)$
- Your friend calculates: $S = d_B \\cdot Q_A = d_B \\cdot (d_A \\cdot G)$

Both of you arrive at the same shared point $S = (x_S, y_S)$. The $x$-coordinate is then typically used to derive a symmetric key (for AES).`,
    },
    {
      title: "Diffie-Hellman Demo",
      content: `
[COMPONENT: ECDHNumericAnimation]`
    },
    {
      title: "RSA: Introduction & Math",
      content: `# Rivest-Shamir-Adleman (RSA)

While Diffie-Hellman allows two parties to establish a shared secret cooperatively, **RSA** is an asymmetric cryptosystem that allows one party to encrypt a message specifically for another. It relies on the practical difficulty of the **Integer Factorization Problem**.

**Mathematical Prerequisites:**
- **Prime Factorization:** Multiplying two large prime numbers $p$ and $q$ is fast. However, finding $p$ and $q$ given only their product $n = p \\cdot q$ is computationally infeasible for large numbers.
- **Euler's Totient Function** $\\phi(n)$: Represents the number of integers up to $n$ that are relatively prime to $n$. For a product of two distinct primes, $\\phi(n) = (p-1)(q-1)$.
- **Modular Multiplicative Inverse:** Finding a number $d$ such that $(e \\cdot d) \\equiv 1 \\pmod{\\phi(n)}$.`
    },
    {
      title: "RSA Key Generation",
      content: `# RSA: Key Generation

The process of generating an RSA public/private key pair operates as follows:

**1. Choose Primes:** Select two distinct, cryptographically secure large prime numbers $p$ and $q$.
**2. Compute Modulus:** Calculate $n = p \\cdot q$. The number $n$ is used as the modulus for both the public and private keys.
**3. Compute Totient:** Calculate $\\phi(n) = (p-1)(q-1)$.
**4. Choose Public Exponent:** Select an integer $e$ such that $1 < e < \\phi(n)$ and $\\gcd(e, \\phi(n)) = 1$. (Commonly, $e = 65537$ is chosen for efficiency and security).
**5. Compute Private Exponent:** Determine $d$ as the modular multiplicative inverse of $e$ modulo $\\phi(n)$, meaning:
$$ d \\cdot e \\equiv 1 \\pmod{\\phi(n)} $$

**The Keys:** 
- **Public Key:** $(e, n)$ - publicly distributed to the world.
- **Private Key:** $(d, n)$ - kept strictly secret by the owner.`
    },
    {
      title: "RSA Encryption & Decryption",
      content: `# RSA: Encryption and Decryption

Once the keys are generated, RSA can be used to securely transmit data. 

**Encryption:**
To send a secret message $m$ to Your friend, you use your friend's **Public Key** $(e, n)$:
$$ c = m^e \\pmod n $$
where $c$ is the resulting ciphertext. It's crucial that message $m$ is represented as an integer such that $0 \\le m < n$.

**Decryption:**
Your friend receives $c$ and recovers the original message $m$ using his **Private Key** $(d, n)$:
$$ m = c^d \\pmod n $$

**Why this works** (Euler's theorem):  
$$ c^d \\equiv (m^e)^d \\equiv m^{ed} \\equiv m^{k\\cdot\\phi(n)+1} \\equiv m^1 \\equiv m \\pmod n $$`
    },
    {
      title: "RSA for Key Distribution",
      content: `# RSA for Key Distribution

RSA involves large numbers, making it computationally expensive and slow compared to symmetric ciphers. Therefore, it is rarely used to encrypt bulk data directly. 

Instead, RSA is an excellent tool for **solving the Key Distribution Problem**:

1. You generate a symmetric key (i.e. 256-bits for AES).
2. You encrypt this symmetric key using your friend's RSA **Public Key**.
3. You send the encrypted symmetric key to your friend over the public channel.
4. Your friend decrypts it using his specifically paired RSA **Private Key**.

Because only your friend possesses his private key, only he can decrypt and read the symmetric key. Now you both share an identical symmetric key securely and can switch to the extremely fast symmetric cipher for the remainder of your session.`
    },
    {
      title: "RSA Demo",
      content: `
[COMPONENT: RSANumericAnimation]`
    },
    {
      title: "Comparison: RSA vs. DH vs. ECDH",
      content: `# Comparing Key Distribution Algorithms

While all three algorithms can be used to distribute keys, their approaches and efficiencies differ significantly.

**RSA** relies on the difficulty of the integer factorization problem.

Both **Diffie-Hellman (DH)** and **Elliptic-Curve Diffie-Hellman (ECDH)** anonymously establish a shared secret using the Discrete Logarithm Problem (DLP). 

The best known algorithm attacking both traditional DH and RSA (the General Number Field Sieve) runs with sub-exponential complexity. However, **no sub-exponential algorithm exists for breaking the Elliptic Curve version (ECDLP)**.

Because of this, ECDH requires much smaller keys to achieve the exact same security level. 

**NIST Recommended Key Equivalencies:**
- **80-bit security:** RSA / DH = 1024 bits | ECDH = 160 bits
- **128-bit security:** RSA / DH = 3072 bits | ECDH = 256 bits
- **256-bit security:** RSA / DH = 15360 bits | ECDH = 512 bits

This means that ECDH produces dramatically lower bandwidth overhead and faster computations. That is why it is the most used algorithm out of the three.`
    },
    {
      title: "Further Reading",
      content: `# Further Reading
      
- [Diffie-Hellman onriginal publication (1976)](https://ee.stanford.edu/~hellman/publications/24.pdf)

- [A Method for Obtaining Digital Signatures and Public-Key Cryptosystems (RSA-1978)](https://people.csail.mit.edu/rivest/Rsapaper.pdf)

- [Use of Elliptic Curves in Cryptography (ECDH-1985)](https://link.springer.com/chapter/10.1007/3-540-39799-X_31)

- [The Development of the Number Field Sieve](https://www.cs.umd.edu/~gasarch/TOPICS/factoring/1993_Book_TheDevelopmentOfTheNumberField.pdf)

- [Applied Cryptography by Bruce Schneier, Second Edition](https://mrajacse.wordpress.com/wp-content/uploads/2012/01/applied-cryptography-2nd-ed-b-schneier.pdf)
-- Chapters 3, 19, 22`
    },
  ],
};
