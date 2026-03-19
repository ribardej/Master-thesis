import React from "react";
import { SymmetricEncryptionAnimation } from "./animations/symmetric-encryption";
import { RSAKeyDistributionAnimation } from "./animations/rsa-key-distribution";
import { DHKeyDistributionAnimation } from "./animations/dh-key-distribution";

export function SlideContent({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: JSX.Element[] = [];
  let currentCodeBlock: string[] = [];
  let inCodeBlock = false;
  let key = 0;

  const flushCodeBlock = () => {
    if (currentCodeBlock.length > 0) {
      elements.push(
        <pre
          key={key++}
          className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"
        >
          <code>{currentCodeBlock.join("\n")}</code>
        </pre>
      );
      currentCodeBlock = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trimStart();

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentCodeBlock.push(rawLine);
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-3xl font-bold mt-8 mb-4">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-semibold mt-6 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-semibold mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const listItems: string[] = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith("- ")) {
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
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={key++} className="font-semibold my-2">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith("[COMPONENT: ")) {
      // Extract component name from [COMPONENT: Name]
      const match = line.match(/\[COMPONENT:\s*([a-zA-Z0-9_]+)\s*\]/);
      if (match && match[1]) {
        const componentName = match[1];
        if (componentName === "SymmetricEncryption") {
          elements.push(<SymmetricEncryptionAnimation key={key++} />);
        } else if (componentName === "RSAKeyDistribution") {
          elements.push(<RSAKeyDistributionAnimation key={key++} />);
        } else if (componentName === "DHKeyDistribution") {
          elements.push(<DHKeyDistributionAnimation key={key++} />);
        }
        // Additional components can be registered here in the future
      }
    } else if (line.trim() === "") {
      continue;
    } else {
      elements.push(
        <p key={key++} className="my-3 leading-relaxed">
          {renderInlineCode(line)}
        </p>
      );
    }
  }

  flushCodeBlock();

  return <>{elements}</>;
}

function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-pink-600"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
