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
      content: `### In the previous chapter, we showed that key distribution algorithms (RSA / DH) allow two parties to establish a shared secret over a public channel\n\n\n\n

      - However, the key distribution algorithms alone **cannot** verify the identity of the communicating party

      - An active attacker (Man-in-the-Middle) can impersonate your friend and establish separate keys with both of you`
    },
    {
      title: "The Authentication Problem",
      content: `### How do you verify the identity of the person you are communicating with in real life?\n\n\n\n\n

      - One traditional way is through a **handwritten signature** - it is unique to a person and difficult to forge

      - A **digital signature** is the mathematical equivalent, providing the same guarantee in the digital world`
    },
    {
      title: "What Digital Signatures Provide",
      content: `# What does a digital signature guarantee?

      A digital signature provides three critical security properties:

      - **Authentication:** Confirms the true identity of the sender. Only the holder of the private key could have produced the signature.
      - **Integrity:** Any modification to the signed message, even a single bit, will cause the signature verification to fail.
      - **Non-repudiation:** The signer cant later deny having signed the message, since only their private key could have created the signature.`
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
      content: `# But hold on - how do you safely transfer the public key?\n\n\n\n\n

      - This seems exactly like the key distribution problem once again! An attacker could change the **message**, create his **signature**, intercept your friend's public key and swap it for **his public key**.

      - So have we gotten ourselves into a never ending cycle?
      -- **No, dont worry**
      -- There is a difference between the two problems
      
      - The public key that needs to be transfered usually stays valid for years. Unlike the symmetric key, which lasts only during one session.

      - This life-span of the key makes it reasonable for us to create a **Public Key Infrastructure** using **digital certificates** to bind a public key with an identity.`
    },
    {
      title: "How PKI Works",
      content: `## Public Key Infrastructure (PKI)\n\n\n

      - A trusted organization called a **Certificate Authority (CA)** verifies the identity of an entity (like a website or person).

      - The CA takes the entity's **public key** and their **identity** details, and packages them into a **Digital Certificate**.

      - Crucially, the CA then **digitally signs** this certificate using its own private key.

      - When you connect, the entity sends you their certificate. Your device uses the CA's globally known public key, **pre-installed in your OS or browser**, to verify the CA's signature.

      - If the CA's signature is valid, you can safely trust that the public key inside the certificate genuinely belongs to that entity!`

    },
    {
      title: "Public Key Infrastructure",
      content: `
      [COMPONENT: PKIAnimation]`
    },
    {
      title: "Summary",
      content: `## Digital signatures, combined with public key infrastructure, complete the security model for authenticating communication on a public channel\n\n\n\n

      - We have covered all the parts that are necessary for secure communication on a public channel\n\n

      Next, we will look at the full process of establishing a secure connection between two parties ->`
    },
  ],
};
