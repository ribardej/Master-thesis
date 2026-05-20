# Quantum-Safe Cryptography Learning Tool

[ribardej.github.io/Master-thesis/](https://ribardej.github.io/Master-thesis/)

An interactive, educational platform designed to teach and visualize classical, quantum, and quantum-safe (post-quantum) cryptographic concepts. Developed as part of a Master's Thesis.

---

## Key Highlights

### 1. 30 Interactive React Visualization Modules
The platform is powered by an extensive suite of bespoke simulation modules, allowing learners to physically interact with cryptographic operations:
*   **Classical Ciphers**: Caesar Cipher (interactive shift wheel), Transposition Cipher (visual grid routing).
*   **Symmetric Encryption**: Interactive AES Round-by-Round Animation
*   **Asymmetric Key Exchange**: Diffie-Hellman Key Exchange (visual paint-mixing & math), MITM DH Simulation, RSA Key Distribution Flow, Elliptic Curve DH (ECDH).
*   **Digital Signatures**: Digital Signature Fundamentals, RSA Signatures, DSA & ECDSA Numeric Signatures.
*   **Classical Trust Infrastructures**: Public Key Infrastructure (PKI) Authority Flow, TLS 1.3 Handshake (Basic & Detailed).
*   **The Quantum Threat**: FFT vs. QFT (Quantum Fourier Transform) Visual Comparison.
*   **Post-Quantum Cryptography (PQC)**: Lattice-Based Cryptography (LWE Gaussian Elimination), Kyber KEM (Key Encapsulation Mechanism) Protocol Flow, BDD (Bounded Distance Decoding) Lattice Visual.
*   **Quantum Key Distribution (QKD)**: BB84 Protocol Simulator (polarization states, bases, and eavesdropping).
*   **Quantum-Safe Channels**: Pure PQC Channel, Pure QKD Channel, and Hybrid Classical-PQC TLS Handshake.

### 2. Double-Module Structured Curriculum
Content is divided into two distinct pedagogical tracks to serve different learning depths:
*   **Module 1: Overview**: Concept-first summaries focusing on intuition, flowcharts, and high-level design.
*   **Module 2: Detailed Explanation**: Math-intensive walkthroughs, detailed operations, formal proofs, and granular algorithms.

### 3. Integrated Math Engine
Complex algorithms are supplemented with standard mathematical notation. The platform utilizes **KaTeX** to render complex mathematical equations fluently on the client-side for both inline formulas (e.g., $g^a \pmod p$) and full block proofs.

---

## Tech Stack

*   **Framework**: [React 18](https://react.dev/) — Declarative component-based UI
*   **Build Tool & Dev Server**: [Vite 6](https://vite.dev/) — Fast HMR (Hot Module Replacement) and bundling
*   **Routing**: [React Router 7](https://reactrouter.com/) — Single Page App client-side routing
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first, high-performance styling engine
*   **Language**: [TypeScript](https://www.typescriptlang.org/) — End-to-end type safety and code predictability
*   **Math Rendering**: [KaTeX](https://katex.org/) & [React-KaTeX](https://github.com/talyssonoc/react-katex) — Fast math typesetting
*   **Icons**: [Lucide React](https://lucide.dev/) — Consistent, responsive vector iconography

---

## Quick Start

### Prerequisites
*   Node.js 18+ and npm installed

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Development
Run the local development server with hot module replacement:
```bash
npm run dev
```
Open your browser to `http://localhost:5173/` (or the port specified in terminal output).

### 3. Production Build
Create an optimized production bundle:
```bash
npm run build
```
The output directory will be `dist/`, containing highly-optimized HTML, JS, and CSS static files, ideal for hosting on GitHub Pages, Netlify, or Vercel.

### 4. Preview Production
Verify the production build locally:
```bash
npm run preview
```

---

## Project Architecture

```text
src/
├── app/
│   ├── App.tsx                   # Root component
│   ├── routes.tsx                # Client-side route declarations (Hash Routing)
│   ├── components/               # Shareable layouts & rendering
│   │   ├── course-navigation.tsx # Slide control buttons (Previous / Next)
│   │   ├── course-sidebar.tsx    # Expandable modules & lessons drawer
│   │   ├── slide-content.tsx     # Custom MD + LaTeX + Component Parser Engine
│   │   └── animations/           # 30 interactive cryptographic modules
│   │       ├── caesar-cipher.tsx
│   │       ├── aes-round-animation.tsx
│   │       ├── dh-key-distribution.tsx
│   │       ├── bb84-protocol.tsx
│   │       ├── kyber-kem-flow.tsx
│   │       └── ...
│   ├── pages/                    # Main page views
│   │   ├── course-layout.tsx     # Structural wrapping (Sidebar + Main Content)
│   │   ├── lesson.tsx            # Orchestrator for loading lessons/slides
│   │   └── ...
│   └── data/                     # Content management
│       ├── types.ts              # Core types (Course, Module, Lesson, Slide)
│       ├── course-data.ts        # Main aggregator of course routes
│       ├── module-1.ts           # Module 1 (Overview) chapters mapping
│       ├── module-2.ts           # Module 2 (Detailed) chapters mapping
│       └── content/              # Chapters divided into standalone directories
│           ├── 01-problem-statement/
│           ├── 02-symmetric-encryption/
│           ├── 03-key-distribution-algorithms/
│           ├── 04-digital-signatures/
│           ├── 05-securing-public-channel-classically/
│           ├── 06-quantum-threat/
│           ├── 07-post-quantum-cryptography/
│           ├── 08-quantum-key-distribution/
│           └── 09-quantum-safe-public-channel-establishment/
└── styles/                       # Base and custom themes
    ├── index.css                 # Standard application layout
    ├── tailwind.css              # Tailwind imports
    ├── theme.css                 # Color scheme and design system tokens
    └── fonts.css                 # Typography rules
```

---

## Curriculum Outline

The tool contains a comprehensive course structured into **9 Interactive Chapters**:

| # | Chapter / Topic | Key Visual Animations Included | Module 1 (Overview) | Module 2 (Detailed) |
|---|---|---|---|---|
| **01** | **Problem Statement** | Communication channels, Alice/Bob scenario | `01-problem-statement/module-1` | `01-problem-statement/module-2` |
| **02** | **Symmetric Encryption** | Caesar cipher, Transposition wheel, AES Matrix | `02-symmetric-encryption/module-1` | `02-symmetric-encryption/module-2` |
| **03** | **Key Distribution** | DH paint mixing, DH numerical, RSA flow, ECDH | `03-key-distribution-algorithms/module-1` | `03-key-distribution-algorithms/module-2` |
| **04** | **Digital Signatures** | Signature signing flow, RSA, DSA, ECDSA math | `04-digital-signatures/module-1` | `04-digital-signatures/module-2` |
| **05** | **Classical Public Channel** | CA hierarchies, TLS 1.3 Handshake flows | `05-securing-public-channel-classically/module-1` | `05-securing-public-channel-classically/module-2` |
| **06** | **Quantum Threat** | Shor's Algorithm QFT visualizer, Grover's steps | `06-quantum-threat/module-1` | `06-quantum-threat/module-2` |
| **07** | **Post-Quantum Cryptography** | LWE matrix steps, BDD visual, Kyber KEM flow | `07-post-quantum-cryptography/module-1` | `07-post-quantum-cryptography/module-2` |
| **08** | **Quantum Key Distribution** | Photon polarizers, BB84 protocol + Eve eavesdrop | `08-quantum-key-distribution/module-1` | `08-quantum-key-distribution/module-2` |
| **09** | **Quantum-Safe Channels** | PQC, QKD, and Hybrid TLS Handshake models | `09-quantum-safe-public-channel-establishment/module-1` | `09-quantum-safe-public-channel-establishment/module-2` |

---

## Extending Content & Adding Lessons

The platform uses a custom compilation engine defined in `src/app/components/slide-content.tsx` that processes raw content strings. This allows educators and contributors to build high-quality slides using a custom markdown dialect.

### 1. Slide Formatting Dialect

#### Headings
```markdown
# Big Chapter Header (h1)
## Standard Section Header (h2)
### Small Subsection Header (h3)
```

#### Bold & Lists
```markdown
This is **bold text**
- Bullet list item
-- Indented nested bullet item
```

#### Mathematical Notation (KaTeX)
*   **Inline Math**: Wrap inside single `$` symbols:
    `For parameters $p$ and $g$, Alice computes $A = g^a \pmod p$.`
*   **Block Math**: Wrap inside double `$$` symbols:
    `$$a \equiv g^b \pmod p$$`

#### Tables
Construct standard markdown grids separated by pipes:
```markdown
| Key size (bits) | RSA Security Level | AES Equivalent |
|-----------------|--------------------|----------------|
| 1024            | 80-bit             | -              |
| 2048            | 112-bit            | -              |
| 3072            | 128-bit            | 128-bit        |
```

#### Dynamic React Component Embeds
To insert any of the interactive React animations anywhere on a slide, use the custom `[COMPONENT: Name]` tag:
```markdown
Here is the interactive Caesar Cipher wheel simulation:
[COMPONENT: CaesarCipher]
```

### 2. Creating a New Lesson
1.  Add/modify lesson slides in the appropriate directory (e.g., `src/app/data/content/07-post-quantum-cryptography/module-1.ts`).
2.  Define the slides inside the `Lesson` object structure:
    ```typescript
    import type { Lesson } from "../../types";

    export const lesson7: Lesson = {
      id: "module-1-lesson-7",
      title: "Post-Quantum Cryptography",
      slides: [
        {
          title: "Introduction",
          content: `# My Custom Slide Title\nThis is math $E = mc^2$ and here is the Kyber flow:\n[COMPONENT: KyberKEMFlow]`,
        }
      ]
    };
    ```

### 3. Registering New Animation Components
To register a new interactive simulation element:
1.  Build your interactive React element inside `src/app/components/animations/`.
2.  Open `src/app/components/slide-content.tsx`.
3.  Import your React component at the top of the file:
    ```typescript
    import { MyNewAnimation } from "./animations/my-new-animation";
    ```
4.  Scroll down to the `[COMPONENT: ` parsing block and register your component tag:
    ```typescript
    } else if (componentName === "MyNewAnimationTag") {
      elements.push(<MyNewAnimation key={key++} />);
    }
    ```
5.  You can now call it inside any slide markdown with `[COMPONENT: MyNewAnimationTag]`.

---

## License & Thesis Attribution

This project was built as a software artifact for my Master's Thesis. 

Licensed under the [MIT License](LICENSE).
