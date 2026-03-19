import type { Lesson } from "../../types";

export const lesson2: Lesson = {
  id: "module-1-lesson-2",
  title: "Symmetric Encryption",
  slides: [
    {
      title: "Symmetric Encryption",
      content: `## Symmetric Encryption ensures that if an attacker is able to intercept your conversation, he will not be able to read the messages.\n\n
      It is called symmetric, because the same key has to be used for both encryption and decryption.`,
    },
    {
      title: "Visualizing the Flow",
      content: `
      [COMPONENT: SymmetricEncryption]`,
    }
  ],
};
