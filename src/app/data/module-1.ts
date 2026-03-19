import type { Module } from "./types";
import { lesson1 } from "./content/01-problem-statement/module-1";
import { lesson2 } from "./content/02-symmetric-encryption/module-1";
import { lesson3 } from "./content/03-key-distribution-algorithms/module-1";
import { lesson4 } from "./content/04-digital-signatures/module-1";
import { lesson5 } from "./content/05-securing-public-channel-classically/module-1";
import { lesson6 } from "./content/06-quantum-threat/module-1";
import { lesson7 } from "./content/07-post-quantum-cryptography/module-1";
import { lesson8 } from "./content/08-quantum-key-distribution/module-1";
import { lesson9 } from "./content/09-quantum-safe-public-channel-establishment/module-1";

export const module1: Module = {
  id: "module-1",
  title: "Overview",
  lessons: [
    lesson1,
    lesson2,
    lesson3,
    lesson4,
    lesson5,
    lesson6,
    lesson7,
    lesson8,
    lesson9,
  ],
};
