import { useParams } from "react-router";
import { getLessonById, getAllLessons } from "../data/course-data";

export function Lesson() {
  const { lessonId } = useParams();
  
  // If no lessonId, show the first lesson
  const targetLessonId = lessonId || getAllLessons()[0]?.id;
  
  if (!targetLessonId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No lessons available</h2>
          <p className="text-gray-600">There are no lessons in this course.</p>
        </div>
      </div>
    );
  }

  const lesson = getLessonById(targetLessonId);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Lesson not found</h2>
          <p className="text-gray-600">The lesson you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <LessonContent content={lesson.content} />
        </div>
      </div>
    </div>
  );
}

function LessonContent({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.trim().split('\n');
  const elements: JSX.Element[] = [];
  let currentCodeBlock: string[] = [];
  let inCodeBlock = false;
  let key = 0;

  const flushCodeBlock = () => {
    if (currentCodeBlock.length > 0) {
      elements.push(
        <pre key={key++} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
          <code>{currentCodeBlock.join('\n')}</code>
        </pre>
      );
      currentCodeBlock = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentCodeBlock.push(line);
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-2xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-xl font-semibold mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ')) {
      // Look ahead to gather all list items
      const listItems: string[] = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) {
        i++;
        listItems.push(lines[i].slice(2));
      }
      elements.push(
        <ul key={key++} className="list-disc pl-6 my-3 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineCode(item)}</li>
          ))}
        </ul>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={key++} className="font-semibold my-2">{line.slice(2, -2)}</p>);
    } else if (line.trim() === '') {
      // Skip empty lines
      continue;
    } else {
      elements.push(<p key={key++} className="my-3 leading-relaxed">{renderInlineCode(line)}</p>);
    }
  }

  flushCodeBlock();

  return <>{elements}</>;
}

function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-pink-600">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}