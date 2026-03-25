import type { Lesson } from "../../types";

export const lesson2: Lesson = {
  id: "module-1-lesson-2",
  title: "Symmetric Encryption",
  slides: [
    {
      title: "Symmetric Encryption",
      content: `## Symmetric Encryption ensures that if an attacker is able to intercept your conversation, he will not be able to read the messages.\n\n
      - ### The same key has to be used for both encryption and decryption (therefore "symmetric")
      - ### It is much faster than assymetric encryption (more on that later)`
    },
    {
      title: "Visualizing the Flow",
      content: `
      [COMPONENT: SymmetricEncryption]`
    },
    {
      title: "Summary",
      content: `## But if the confidentiality of the communication relies entirely on a shared secret key, how can the parties agree on this key using only the insecure channel they wish to protect? 

      ### The answer is Key Distribution Algorithms ->`
    }
  ],
};
