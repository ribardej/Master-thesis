import type { Module } from "./types";

export const module1: Module = {
  id: "module-1",
  title: "Getting Started with HTML",
  lessons: [
    {
      id: "lesson-1-1",
      title: "What is HTML?",
      slides: [
        {
          title: "What is HTML?",
          content: `
# What is HTML?

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page semantically and originally included cues for the appearance of the document.
          `,
        },
        {
          title: "Key Concepts",
          content: `
## Key Concepts

- **Elements**: Building blocks of HTML pages
- **Tags**: Define how content should be structured
- **Attributes**: Provide additional information about elements
          `,
        },
        {
          title: "Basic Structure",
          content: `
## Basic Structure

Every HTML document follows a basic structure:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
</html>
\`\`\`
          `,
        },
        {
          title: "Practice Exercise",
          content: `
## Practice Exercise

Try creating your first HTML page using the structure above!
          `,
        },
      ],
    },
    {
      id: "lesson-1-2",
      title: "HTML Elements and Tags",
      slides: [
        {
          title: "HTML Elements and Tags",
          content: `
# HTML Elements and Tags

HTML elements are the building blocks of HTML pages. An element usually consists of a start tag and end tag, with content in between.
          `,
        },
        {
          title: "Headings & Text Formatting",
          content: `
## Common HTML Elements

### Headings
- \`<h1>\` to \`<h6>\` - Define headings (h1 is largest, h6 is smallest)

### Text Formatting
- \`<p>\` - Paragraph
- \`<strong>\` - Bold text
- \`<em>\` - Italic text
- \`<br>\` - Line break
          `,
        },
        {
          title: "Lists, Links and Images",
          content: `
### Lists
- \`<ul>\` - Unordered list
- \`<ol>\` - Ordered list
- \`<li>\` - List item

### Links and Images
- \`<a href="url">\` - Hyperlink
- \`<img src="image.jpg" alt="description">\` - Image
          `,
        },
        {
          title: "Self-Closing Tags",
          content: `
## Self-Closing Tags

Some tags don't need a closing tag:
- \`<br>\`
- \`<img>\`
- \`<input>\`
- \`<hr>\`
          `,
        },
      ],
    },
    {
      id: "lesson-1-3",
      title: "HTML Attributes",
      slides: [
        {
          title: "HTML Attributes",
          content: `
# HTML Attributes

Attributes provide additional information about HTML elements. They are always specified in the start tag and usually come in name/value pairs.
          `,
        },
        {
          title: "id & class Attributes",
          content: `
## Common Attributes

### The id Attribute
Used to specify a unique id for an HTML element:
\`\`\`html
<div id="header">Header Content</div>
\`\`\`

### The class Attribute
Used to specify one or more class names for an element:
\`\`\`html
<p class="important">This is important text.</p>
\`\`\`
          `,
        },
        {
          title: "href, src & alt Attributes",
          content: `
### The href Attribute
Specifies the URL for a link:
\`\`\`html
<a href="https://www.example.com">Visit Example</a>
\`\`\`

### The src Attribute
Specifies the path to an image:
\`\`\`html
<img src="image.jpg" alt="Description">
\`\`\`

### The alt Attribute
Provides alternative text for an image:
\`\`\`html
<img src="photo.jpg" alt="A beautiful sunset">
\`\`\`
          `,
        },
        {
          title: "Best Practices",
          content: `
## Best Practices

- Always use lowercase for attribute names
- Always quote attribute values
- Use descriptive id and class names
          `,
        },
      ],
    },
  ],
};
