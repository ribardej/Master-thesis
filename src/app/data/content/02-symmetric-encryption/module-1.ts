import type { Lesson } from "../../types";

export const lesson2: Lesson = {
  id: "module-1-lesson-2",
  title: "Symmetric Encryption",
  slides: [
    {
      title: "Symmetric Encryption",
      content: `# Chapter 2: Symmetric Encryption Overview`,
    },
    {
      title: "Symmetric Encryption",
      content: `## The core idea
      
      - Symmetric Encryption protects your communication by **scrambling** messages so that even if an attacker intercepts them, they **cannot read** the contents.

      - It uses the **exact same key** for both encryption and decryption (hence the name "symmetric").

      - It is **highly efficient** and significantly faster than asymmetric encryption (which we will cover later).`
    },
    {
      title: "Visualizing the Flow",
      content: `
      [COMPONENT: SymmetricEncryption]`
    },
    {
      title: "Summary",
      content: `## But there is a catch 
      \n\n\n\n\n\n\n\n\n
      - If the confidentiality of the communication relies **entirely** on a **shared** secret key, how can the parties **agree on this key** using only the **insecure** channel they wish to protect?

      -- The answer: **Key Distribution Algorithms** ->`
    }
  ],
};
