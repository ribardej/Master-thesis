# Learning Tool

A lightweight, static frontend learning application built with React, Vite, and Tailwind CSS. Designed to deliver course content with a clean, minimal interface.

## Features

- **Course Navigation**: Sidebar with expandable modules and lessons
- **Markdown-like Content**: Simple, readable lesson content rendering
- **Responsive Design**: Works on desktop and mobile devices
- **Fast & Lightweight**: Minimal dependencies, optimized bundle size
- **TypeScript Support**: Full type safety

## Tech Stack

- **React 18** — UI library
- **React Router 7** — Client-side routing
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **TypeScript** — Type safety
- **Lucide React** — Icon library

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

Run the development server with hot module replacement:

```bash
npm run dev
```

Opens at `http://localhost:5173/`

### Build

Create an optimized production build:

```bash
npm run build
```

Output is in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Root component
│   ├── routes.tsx           # Route definitions
│   ├── components/
│   │   ├── course-sidebar.tsx
│   │   ├── course-navigation.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── course-layout.tsx
│   │   ├── lesson.tsx
│   │   └── ...
│   └── data/
│       └── course-data.ts   # Course content
├── styles/
│   ├── index.css
│   ├── tailwind.css
│   └── theme.css
└── main.tsx                 # Entry point
```

## Adding Content

Edit [src/app/data/course-data.ts](src/app/data/course-data.ts) to add or modify course modules and lessons.

Lesson content supports basic markdown syntax:
- `# Heading` → `<h1>`
- `## Subheading` → `<h2>`
- `- List item` → `<ul>`
- `` `code` `` → inline code
- `` ``` code block ``` `` → code block

## Styling

Tailwind CSS is configured in [src/styles/tailwind.css](src/styles/tailwind.css) and the theme is in [src/styles/theme.css](src/styles/theme.css).

## License

MIT
