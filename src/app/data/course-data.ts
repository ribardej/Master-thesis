export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export const courseData: Course = {
  id: "intro-to-web-dev",
  title: "Introduction to Web Development",
  description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript",
  modules: [
    {
      id: "module-1",
      title: "Getting Started with HTML",
      lessons: [
        {
          id: "lesson-1-1",
          title: "What is HTML?",
          duration: "15 min",
          content: `
# What is HTML?

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page semantically and originally included cues for the appearance of the document.

## Key Concepts

- **Elements**: Building blocks of HTML pages
- **Tags**: Define how content should be structured
- **Attributes**: Provide additional information about elements

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

## Practice Exercise

Try creating your first HTML page using the structure above!
          `
        },
        {
          id: "lesson-1-2",
          title: "HTML Elements and Tags",
          duration: "20 min",
          content: `
# HTML Elements and Tags

HTML elements are the building blocks of HTML pages. An element usually consists of a start tag and end tag, with content in between.

## Common HTML Elements

### Headings
- \`<h1>\` to \`<h6>\` - Define headings (h1 is largest, h6 is smallest)

### Text Formatting
- \`<p>\` - Paragraph
- \`<strong>\` - Bold text
- \`<em>\` - Italic text
- \`<br>\` - Line break

### Lists
- \`<ul>\` - Unordered list
- \`<ol>\` - Ordered list
- \`<li>\` - List item

### Links and Images
- \`<a href="url">\` - Hyperlink
- \`<img src="image.jpg" alt="description">\` - Image

## Self-Closing Tags

Some tags don't need a closing tag:
- \`<br>\`
- \`<img>\`
- \`<input>\`
- \`<hr>\`
          `
        },
        {
          id: "lesson-1-3",
          title: "HTML Attributes",
          duration: "18 min",
          content: `
# HTML Attributes

Attributes provide additional information about HTML elements. They are always specified in the start tag and usually come in name/value pairs.

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

## Best Practices

- Always use lowercase for attribute names
- Always quote attribute values
- Use descriptive id and class names
          `
        }
      ]
    },
    {
      id: "module-2",
      title: "Introduction to CSS",
      lessons: [
        {
          id: "lesson-2-1",
          title: "What is CSS?",
          duration: "12 min",
          content: `
# What is CSS?

CSS (Cascading Style Sheets) is used to style and layout web pages. It allows you to control the color, font, spacing, and positioning of HTML elements.

## Why Use CSS?

- **Separation of Concerns**: Keep styling separate from HTML structure
- **Reusability**: Write styles once and apply to multiple elements
- **Maintainability**: Easier to update and manage your website's appearance

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

## Ways to Add CSS

1. **Inline**: Using the style attribute
2. **Internal**: Using a \`<style>\` tag in the HTML document
3. **External**: Linking to an external CSS file (recommended)
          `
        },
        {
          id: "lesson-2-2",
          title: "CSS Selectors",
          duration: "25 min",
          content: `
# CSS Selectors

Selectors are patterns used to select the elements you want to style.

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

## Practice

Try experimenting with different selectors to style your HTML page!
          `
        }
      ]
    },
    {
      id: "module-3",
      title: "JavaScript Basics",
      lessons: [
        {
          id: "lesson-3-1",
          title: "Introduction to JavaScript",
          duration: "22 min",
          content: `
# Introduction to JavaScript

JavaScript is a programming language that enables interactive web pages. It's an essential part of web applications alongside HTML and CSS.

## What Can JavaScript Do?

- Change HTML content
- Modify CSS styles
- Validate form data
- Create interactive features
- Communicate with servers

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

## Data Types

- **String**: \`"Hello"\`
- **Number**: \`42\`
- **Boolean**: \`true\` or \`false\`
- **Array**: \`[1, 2, 3]\`
- **Object**: \`{name: "John", age: 30}\`

## Functions

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice"));
\`\`\`
          `
        }
      ]
    }
  ]
};

// Helper function to get all lessons in order
export function getAllLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  courseData.modules.forEach(module => {
    lessons.push(...module.lessons);
  });
  return lessons;
}

// Helper function to find lesson by id
export function getLessonById(id: string): Lesson | undefined {
  const allLessons = getAllLessons();
  return allLessons.find(lesson => lesson.id === id);
}

// Helper function to get next lesson
export function getNextLesson(currentLessonId: string): Lesson | null {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
  if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1];
  }
  return null;
}

// Helper function to get previous lesson
export function getPreviousLesson(currentLessonId: string): Lesson | null {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
  if (currentIndex > 0) {
    return allLessons[currentIndex - 1];
  }
  return null;
}
