import type { Module } from "./types";

const lessonTitles = [
  "Problem Statement",
  "Symmetric Encryption",
  "Key Distribution Algorithms",
  "Digital Signatures",
  "Securing Public Channel Classically",
  "Quantum Threat",
  "Post-Quantum Cryptography",
  "Quantum Key Distribution",
  "Quantum-Safe Public Channel Establishment",
];

const createLessons = (moduleId: string) =>
  lessonTitles.map((title, idx) => ({
    id: `${moduleId}-lesson-${idx + 1}`,
    title,
    slides: [
      {
        title,
        content: `# ${title}\n\nContent placeholder for "${title}".`,
      },
      {
        title: "Key Points",
        content: `## Key Points\n\nKey points placeholder for "${title}".`,
      },
      {
        title: "Summary",
        content: `## Summary\n\nSummary placeholder for "${title}".`,
      },
    ],
  }));

export const module3: Module = {
  id: "module-3",
  title: "Detailed Explanation",
  lessons: createLessons("module-3"),
};
