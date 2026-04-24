import type { Lesson } from "../../types";

export const lesson5: Lesson = {
  id: "module-1-lesson-5",
  title: "Securing Public Channel Classically",
  slides: [
    {
      title: "Securing the Public Channel",
      content: `# Chapter 5: Securing the Public Channel Clasically`,
    },
    {
      title: "All the Building Blocks",
      content: `### Now lets see how all the pieces fit together\n\n\n\n

      - **Symmetric Encryption (AES)** - Scrambles messages so only the key holder can read them
      - **Key Distribution (DH / ECDH / RSA)** - Allows two parties to agree on a shared secret key over a public channel
      - **Digital Signatures (DSA / ECDSA / RSA)** - Prove the identity of the sender and ensure the message was not tampered with
      - **Public Key Infrastructure (PKI)** - Binds public keys to real-world identities using certificates signed by trusted authorities`
    },
    {
      title: "Where Does This Happen?",
      content: `## These building blocks are combined into protocols that secure virtually all digital communication\n\n\n


      - ### TLS / HTTPS - Web Browsing
      -- Every time you see a padlock icon in your browser, TLS is encrypting your connection
      -- Use cases: internet banking, email, e-shops, social media, or any other website

      - ### SSH - Remote Access
      -- Securely connecting to and managing remote servers over the internet
      -- Use cases: system administrators managing servers, developers deploying code

      - ### IPsec / VPN - Network Layer Security
      -- Encrypts **all** traffic at the network level, regardless of the application
      -- Use cases: corporate VPNs, connecting to your office network from home, site-to-site connections`
    },
    {
      title: "What About Messaging?",
      content: `## What About Messaging?\n\n\n\n

      - Apps like **Signal**, **WhatsApp**, and **iMessage** use the **Signal Protocol** for end-to-end encryption

      - The key difference is that in TLS, you trust the **server** (e.g., your bank). In the Signal Protocol, even the server operator **cannot** read your messages - only you and your friend hold the keys`
    },
    {
      title: "TLS - The Most Important Protocol",
      content: `## Transport Layer Security (TLS)\n\n\n\n

      - Originally developed as **SSL** (Secure Sockets Layer) by Netscape in 1995

      - Renamed to **TLS** and standardized by the IETF. The current version is **TLS 1.3** (RFC 8446, 2018)

      - TLS sits between the application layer (HTTP, SMTP, etc.) and the transport layer (TCP), providing a transparent secure channel

      - The core process: **Handshake** - using all our building blocks to establish a shared key, then **Data Transfer** - using that key for symmetric encryption`
    },
    {
      title: "The TLS Handshake - Overview",
      content: `# TLS Handshake\n\n\n

      - The client and server first **negotiate** which algorithms to use (cipher suite)

      - The server proves its identity by sending a **certificate** (verified via PKI)

      - Both parties perform a **key exchange** (ECDH) to derive a shared secret

      - The server **signs** the exchange to authenticate itself (ECDSA)

      - Both sides derive **symmetric keys** (AES) and switch to encrypted communication`
    },
    {
      title: "TLS Handshake - Animation",
      content: `
      [COMPONENT: TLSHandshakeBasic]`
    },
    {
      title: "Summary",
      content: `## Summary\n\n\n\n

      - **TLS** secures web traffic, **SSH** secures remote access, **IPsec** secures networks, and the **Signal Protocol** secures messaging

      - The TLS handshake demonstrates how symmetric encryption, key exchange, digital signatures, and PKI work together in a single protocol

      - If it were not for the threat of large Quantum Computers, this would be the last slide
      -- In the next chapter, we will see what a large Quantum Computer would be capable of ->`
    },
  ],
};
