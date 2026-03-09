import type { Module } from "./types";

export const module3: Module = {
  id: "module-3",
  title: "JavaScript Basics",
  lessons: [
    {
      id: "lesson-3-1",
      title: "Introduction to JavaScript",
      slides: [
        {
          title: "Introduction to JavaScript",
          content: `
# Introduction to JavaScript

JavaScript is a programming language that enables interactive web pages. It's an essential part of web applications alongside HTML and CSS.
          `,
        },
        {
          title: "What Can JavaScript Do?",
          content: `
## What Can JavaScript Do?

- Change HTML content
- Modify CSS styles
- Validate form data
- Create interactive features
- Communicate with servers
          `,
        },
        {
          title: "Your First JavaScript",
          content: `
## Your First JavaScript

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## Variables

JavaScript has three ways to declare variables:

\`\`\`javascript
var x = 5;      // Old way (avoid)
let y = 10;     // Modern way (block-scoped)
const z = 15;   // Constant (cannot be reassigned)
\`\`\`
          `,
        },
        {
          title: "Data Types",
          content: `
## Data Types

- **String**: \`"Hello"\`
- **Number**: \`42\`
- **Boolean**: \`true\` or \`false\`
- **Array**: \`[1, 2, 3]\`
- **Object**: \`{name: "John", age: 30}\`
          `,
        },
        {
          title: "Functions",
          content: `
## Functions

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice"));
\`\`\`
          `,
        },
      ],
    },
  ],
};
