import type { Lesson } from "../../types";

export const lesson4: Lesson = {
  id: "module-1-lesson-4",
  title: "Digital Signatures",
  slides: [
    {
      title: "Digital Signatures",
      content: `# Chapter 4: Digital Signatures Overview`,
    },
    {
      title: "The Authentication Problem",
      content: `### In the previous chapter, we showed that key distribution algorithms (RSA / D-H) allow two parties to establish a shared secret over a public channel\n\n\n\n

      - However, the key distribution algorithms alone **cannot** verify the identity of the communicating party

      - An active attacker (Man-in-the-Middle) can impersonate your friend and establish separate keys with both of you`
    },
    {
      title: "The Authentication Problem",
      content: `### How do you verify the identity of the person you are communicating with in real life?\n\n\n\n\n

      - One traditional way is through a **handwritten signature** — it is unique to a person and difficult to forge

      - A **digital signature** is the mathematical equivalent, providing the same guarantee in the digital world`
    },
    {
      title: "What Digital Signatures Provide",
      content: `# What does a digital signature guarantee?

      A digital signature provides three critical security properties:

      - **Authentication:** Confirms the true identity of the sender. Only the holder of the private key could have produced the signature.
      - **Integrity:** Any modification to the signed message, even a single bit, will cause the signature verification to fail.
      - **Non-repudiation:** The signer cannot later deny having signed the message, since only their private key could have created the signature.`
    },
    {
      title: "How Digital Signatures Work",
      content: `# The Basic Principle\n\n\n

      - Digital signatures use the **same asymmetric key pair** concept as RSA encryption, but in **reverse**

      - Instead of encrypting with the public key, the signer uses their **private key** to produce a signature

      - Anyone with the signer's **public key** can then verify the authenticity of the signature

      - Since only the owner knows the private key, a valid signature is mathematical proof of their identity`
    },
    {
      title: "Signing and Verification Flow",
      content: `
      [COMPONENT: DigitalSignatureBasic]`
    },
    {
      title: "Solving the MITM Problem",
      content: `## How Signatures prevent the active Man-in-the-Middle attack\n\n\n

      - Recall that in the MITM attack, the attacker intercepts the key exchange and substitutes his own keys

      - With digital signatures, each party **signs** their key exchange parameters with their private key

      - When you receive your friend's public key or DH parameters, you **verify** the attached signature

      - The attacker cannot forge a valid signature because he does not possess your friend's private key

      - Therefore, any substitution attempt is **immediately detected**`
    },
    {
      title: "The Trust Problem",
      content: `### But wait — how do you obtain your friend's genuine public key in the first place?\n\n\n\n\n

      - If an attacker can replace DH parameters, he could also replace the **public key** used for signature verification

      - This is where **certificates** and **Public Key Infrastructure (PKI)** come in — a trusted third party vouches for the binding between a public key and its owner
      
      - The certificate binds the **identity** of the owner to their **public key**, this is crucial so I mentioned it twice.
       -- It does not include information about the **private key**!`
    },
    {
      title: "Public Key Infrastructure",
      content: `
      [COMPONENT: PKIAnimation]`
    },
    {
      title: "Summary",
      content: `## Digital signatures, combined with public key infrastructure, complete the security model for authenticating communication on a public channel\n\n\n\n

      - We have covered all the parts that are necessary for secure communication on a public channel
      Next, we will look at the full process of establishing a secure connection between two parties ->`
    },
  ],
};
