import type { Lesson } from "../../types";

export const lesson1: Lesson = {
  id: "module-2-lesson-1",
  title: "Problem Statement",
  slides: [
    {
      title: "Problem Statement",
      content: `# Chapter 1: Problem Statement in Detail`
    },
    {
      title: "The Core Communication Problem",
      content: `# The problems of public network communication

      When two parties communicate over the internet (or any pulic channel), their messages pass through dozens of intermediate nodes (switches, routers, servers,...) before reaching their destination.

      None of these intermediate nodes can be fully trusted. Without additional protection, anyone on this route can read or even modify the transmitted data.

      Cryptography therefore seeks to provide mathematical guarantees for:
      - **Confidentiality:** Only authorized parties can read the message.
      - **Integrity:** The message has not been altered during transmission.
      - **Authentication:** Verifying the true identity of the sender.
      - **Non-repudiation:** The sender cannot later deny having sent the message.`,
    },
    {
      title: "Types of Attacks",
      content: `# Different forms of attacks

      Attacks on communication channels fall into two main categories:

      ### Passive attacks
      The attacker only monitors the communication but does not affect it. These are hard to detect.

      ### Active attacks
      The attacker actively interferes with the data stream.
      - **Spoofing:** The attacker pretends to be someone else.
      - **Modification:** Altering data before it reaches the recipient.
      - **Replay Attack:** The attacker intercepts a valid message and later re-transmits it (e.g., repeating a payment transaction).`,
    },
    {
      title: "Naive Approaches",
      content: `# Naive approaches

      There are multiple ways to secure communication. The most straightforward way is to use **encoding**. For example, you could define your own language and hope that the eavesdropper does not understand it.

      Another technique is **steganography** - hiding the message inside another message. For instance, the real message could be composed of the first letters of each word in the plain text. These techniques were widely used in the past and are still used today in some cases.

      ### The flaw of secret methods

      However, the security of both techniques is based solely on the secrecy of the technique used. This leads into an issue - how are both sides going to agree on the communication parameters, when they are communicating only via public channel?

      Even if there was a way, how to agree on the communication scheme, an eavesdropper could still find out about the secret scheme through cryptanalysis or simply by a breach from one of the sides.`,
    },
    {
      title: "Kerckhoffs's Principle",
      content: `# Kerckhoffs's principle

      In 1883, Auguste Kerckhoffs formulated a fundamental rule for the design of modern cryptographic systems:

      - **"A cryptographic system should be secure even if everything about the system, except the key, is public knowledge."**

      Instead of keeping the **algorithm** secret, we only keep the **key** secret.

      ### Why is this approach better?
      - **Peer review:** Public algorithms (like AES or RSA) undergo rigorous analysis by thousands of cryptographers worldwide, ensuring any weaknesses are discovered and fixed.
      - **Easy recovery:** If a key is compromised, a new key is simply generated. There is no need to rewrite or swap out the core software.
      - **Standardization:** Open standards allow for effective hardware acceleration and easy integration across the globe.`,
    }
  ],
};
