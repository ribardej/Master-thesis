import type { Module } from "./types";

export const module2: Module = {
  id: "module-2",
  title: "Introduction to CSS",
  lessons: [
    {
      id: "lesson-2-1",
      title: "What is CSS?",
      slides: [
        {
          title: "What is CSS?",
          content: `
# What is CSS?

CSS (Cascading Style Sheets) is used to style and layout web pages. It allows you to control the color, font, spacing, and positioning of HTML elements.
          `,
        },
        {
          title: "Why Use CSS?",
          content: `
## Why Use CSS?

- **Separation of Concerns**: Keep styling separate from HTML structure
- **Reusability**: Write styles once and apply to multiple elements
- **Maintainability**: Easier to update and manage your website's appearance
          `,
        },
        {
          title: "CSS Syntax",
          content: `
## CSS Syntax

\`\`\`css
selector {
  property: value;
}
\`\`\`

## Example

\`\`\`css
h1 {
  color: blue;
  font-size: 24px;
  text-align: center;
}
\`\`\`
          `,
        },
        {
          title: "Ways to Add CSS",
          content: `
## Ways to Add CSS

1. **Inline**: Using the style attribute
2. **Internal**: Using a \`<style>\` tag in the HTML document
3. **External**: Linking to an external CSS file (recommended)
          `,
        },
      ],
    },
    {
      id: "lesson-2-2",
      title: "CSS Selectors",
      slides: [
        {
          title: "CSS Selectors",
          content: `
# CSS Selectors

Selectors are patterns used to select the elements you want to style.
          `,
        },
        {
          title: "Basic Selectors",
          content: `
## Basic Selectors

### Element Selector
Selects all elements of a given type:
\`\`\`css
p {
  color: red;
}
\`\`\`

### Class Selector
Selects all elements with a specific class:
\`\`\`css
.highlight {
  background-color: yellow;
}
\`\`\`

### ID Selector
Selects an element with a specific id:
\`\`\`css
#header {
  background-color: navy;
}
\`\`\`
          `,
        },
        {
          title: "Combining Selectors",
          content: `
## Combining Selectors

### Descendant Selector
\`\`\`css
div p {
  color: blue;
}
\`\`\`

### Multiple Selectors
\`\`\`css
h1, h2, h3 {
  font-family: Arial, sans-serif;
}
\`\`\`
          `,
        },
        {
          title: "Practice",
          content: `
## Practice

Try experimenting with different selectors to style your HTML page!
          `,
        },
      ],
    },
  ],
};
