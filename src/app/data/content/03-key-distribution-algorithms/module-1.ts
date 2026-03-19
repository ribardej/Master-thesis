import type { Lesson } from "../../types";

export const lesson3: Lesson = {
  id: "module-1-lesson-3",
  title: "Key Distribution Algorithms",
  slides: [
    {
      title: "Key Distribution Algorithms",
      content: `## But what about the symmetric key? 
       - To transmit the key securely, you essentially need an existing encrypted channel
       - However, to establish that encrypted channel, you first need the key
       - In pre-digital eras, this deadlock was resolved via physical couriers or trusted meetings
       - For digital communication over the internet, a mathematical solution is required to break the cycle`,
    },
    {
      title: "RSA Key Distribution",
      content: `## Option 1 - Asymmetric Encryption (RSA)
      - One way to solve the key distribution problem is to use a pair of mathematically linked keys (a Public Key and a Private Key). 
      - The Public Key can safely be used to encrypt our Symmetric Key, while only the Private Key can decrypt it.
      `
    },
    {
      title: "Visualizing RSA",
      content: `
      [COMPONENT: RSAKeyDistribution]`,
    },
    {
      title: "Diffie-Hellman Key Exchange",
      content: `## Option 2 - Key Exchange (Diffie-Hellman)\n\n
      - Unlike RSA which transports a locked key, Diffie-Hellman allows both parties to independently mathematically build the exact same shared key without ever sending the key itself over the internet
      - The famous "Color Mixing" analogy is often used to visually represent the irreversible modular arithmetic happening in the background`
    },
    {
      title: "Visualizing DH",
      content: `
      [COMPONENT: DHKeyDistribution]`,
    },
  ],
};
