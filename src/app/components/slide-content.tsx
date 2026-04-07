import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { SymmetricEncryptionAnimation } from "./animations/symmetric-encryption";
import { RSAKeyDistributionAnimation } from "./animations/rsa-key-distribution";
import { DHKeyDistributionAnimation } from "./animations/dh-key-distribution";
import { MITMDHKeyDistributionAnimation } from "./animations/mitm-dh-key-distribution";
import { ProblemStatementAnimation } from "./animations/problem-statement";
import { CaesarCipherAnimation } from "./animations/caesar-cipher";
import { TranspositionCipherAnimation } from "./animations/transposition-cipher";
import { AESImage } from "./animations/aes-image";
import { AESRoundAnimation } from "./animations/aes-round-animation";
import { DHNumericAnimation } from "./animations/dh-numeric";
import { RSANumericAnimation } from "./animations/rsa-numeric";
import { ECDHNumericAnimation } from "./animations/ecdh-numeric";
import { DigitalSignatureBasicAnimation } from "./animations/digital-signature-basic";
import { PKIAnimationComponent } from "./animations/pki-animation";
import { RSASignatureNumericAnimation } from "./animations/rsa-signature-numeric";
import { DSANumericAnimation } from "./animations/dsa-numeric";
import { ECDSANumericAnimation } from "./animations/ecdsa-numeric";
import { TLSHandshakeBasicAnimation } from "./animations/tls-handshake-basic";
import { TLSHandshakeDetailedAnimation } from "./animations/tls-handshake-detailed";

export function SlideContent({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: JSX.Element[] = [];
  let currentCodeBlock: string[] = [];
  let currentMathBlock: string[] = [];
  let inCodeBlock = false;
  let inMathBlock = false;
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

  const flushMathBlock = () => {
    if (currentMathBlock.length > 0) {
      elements.push(
        <div key={key++} className="py-2">
          <BlockMath math={currentMathBlock.join("\n")} />
        </div>
      );
      currentMathBlock = [];
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

    if (line.trim() === "$$") {
      if (inMathBlock) {
        flushMathBlock();
        inMathBlock = false;
      } else {
        inMathBlock = true;
      }
      continue;
    }

    if (inMathBlock) {
      currentMathBlock.push(rawLine);
      continue;
    }

    if (line.trim().startsWith("$$") && line.trim().endsWith("$$") && line.trim() !== "$$") {
      elements.push(<div key={key++} className="py-2"><BlockMath math={line.trim().slice(2, -2)} /></div>);
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-3xl font-bold mt-8 mb-4">
          {renderInlineCode(line.slice(2))}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-semibold mt-6 mb-3">
          {renderInlineCode(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-semibold mt-4 mb-2">
          {renderInlineCode(line.slice(4))}
        </h3>
      );
    } else if (line.match(/^\d+\.\s/)) {
      // Support for numbered lists
      const listItems: string[] = [line.replace(/^\d+\.\s/, "")];
      let startNumber = parseInt(line.match(/^(\d+)\.\s/)?.[1] || "1", 10);
      while (i + 1 < lines.length && lines[i + 1].trimStart().match(/^\d+\.\s/)) {
        i++;
        listItems.push(lines[i].trimStart().replace(/^\d+\.\s/, ""));
      }
      elements.push(
        <ol key={key++} start={startNumber} className="list-decimal list-outside ml-6 my-3 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="pl-1 text-gray-800">
              {renderInlineCode(item)}
            </li>
          ))}
        </ol>
      );
    } else if (line.startsWith("- ") || line.startsWith("-- ")) {
      const isNested = line.startsWith("-- ");
      const prefix = isNested ? "-- " : "- ";
      const listItems: { text: string; isNested: boolean }[] = [{ text: line.slice(prefix.length), isNested }];

      while (i + 1 < lines.length && (lines[i + 1].trimStart().startsWith("- ") || lines[i + 1].trimStart().startsWith("-- "))) {
        i++;
        const nextLine = lines[i].trimStart();
        const nextIsNested = nextLine.startsWith("-- ");
        const nextPrefix = nextIsNested ? "-- " : "- ";
        listItems.push({ text: nextLine.slice(nextPrefix.length), isNested: nextIsNested });
      }

      elements.push(
        <ul key={key++} className="flex flex-col pl-2 my-3 space-y-1">
          {listItems.map((item, idx) => {
            const trimmedItem = item.text.trimStart();
            let content;
            if (trimmedItem.startsWith("### ")) {
              content = <h3 className="text-l font-semibold my-2">{renderInlineCode(trimmedItem.slice(4))}</h3>;
            } else if (trimmedItem.startsWith("## ")) {
              content = <h2 className="text-xl font-semibold my-2">{renderInlineCode(trimmedItem.slice(3))}</h2>;
            } else if (trimmedItem.startsWith("# ")) {
              content = <h1 className="text-2xl font-bold my-2">{renderInlineCode(trimmedItem.slice(2))}</h1>;
            } else if (trimmedItem.startsWith("@ ")) {
              content = <h1 className="text-3xl font-bold my-2">{renderInlineCode(trimmedItem.slice(2))}</h1>;
            } else {
              content = <span>{renderInlineCode(item.text)}</span>;
            }
            return (
              <li key={idx} className={`flex items-center ${item.isNested ? "ml-8" : ""}`}>
                {item.isNested ? (
                  <div className="w-1.5 h-1.5 rounded-full border border-gray-500 mr-4 flex-shrink-0"></div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-4 flex-shrink-0"></div>
                )}
                <div className="flex-1">{content}</div>
              </li>
            );
          })}
        </ul>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={key++} className="font-semibold my-2">
          {renderInlineCode(line.slice(2, -2))}
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
        } else if (componentName === "MITMDHKeyDistribution") {
          elements.push(<MITMDHKeyDistributionAnimation key={key++} />);
        } else if (componentName === "ProblemStatement") {
          elements.push(<ProblemStatementAnimation key={key++} />);
        } else if (componentName === "CaesarCipher") {
          elements.push(<CaesarCipherAnimation key={key++} />);
        } else if (componentName === "TranspositionCipher") {
          elements.push(<TranspositionCipherAnimation key={key++} />);
        } else if (componentName === "AESImage") {
          elements.push(<AESImage key={key++} />);
        } else if (componentName === "AESRoundAnimation") {
          elements.push(<AESRoundAnimation key={key++} />);
        } else if (componentName === "DHNumericAnimation") {
          elements.push(<DHNumericAnimation key={key++} />);
        } else if (componentName === "RSANumericAnimation") {
          elements.push(<RSANumericAnimation key={key++} />);
        } else if (componentName === "ECDHAnimation") {
          elements.push(<ECDHNumericAnimation key={key++} />);
        } else if (componentName === "ECDHNumericAnimation") {
          elements.push(<ECDHNumericAnimation key={key++} />);
        } else if (componentName === "DigitalSignatureBasic") {
          elements.push(<DigitalSignatureBasicAnimation key={key++} />);
        } else if (componentName === "PKIAnimation") {
          elements.push(<PKIAnimationComponent key={key++} />);
        } else if (componentName === "RSASignatureNumeric") {
          elements.push(<RSASignatureNumericAnimation key={key++} />);
        } else if (componentName === "DSANumeric") {
          elements.push(<DSANumericAnimation key={key++} />);
        } else if (componentName === "ECDSANumeric") {
          elements.push(<ECDSANumericAnimation key={key++} />);
        } else if (componentName === "TLSHandshakeBasic") {
          elements.push(<TLSHandshakeBasicAnimation key={key++} />);
        } else if (componentName === "TLSHandshakeDetailed") {
          elements.push(<TLSHandshakeDetailedAnimation key={key++} />);
        }
        // Additional components can be registered here in the future
      }
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-1" aria-hidden="true"></div>);
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
  flushMathBlock();

  return <>{elements}</>;
}

function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)|\`[^`]+\`|\$[^$]+\$)/g);
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
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={idx}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {match[1]}
          </a>
        );
      }
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold">
          {renderInlineCode(part.slice(2, -2))}
        </strong>
      );
    }
    if (part.startsWith("$") && part.endsWith("$") && part !== "$$") {
      return <InlineMath key={idx} math={part.slice(1, -1)} />;
    }
    return part;
  });
}
