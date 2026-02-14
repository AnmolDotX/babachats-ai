import { memo, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";

export const Response = memo(
  ({
    children,
    className,
    isStreaming = false,
  }: {
    children: string;
    className?: string;
    isStreaming?: boolean;
  }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      // If not streaming or text is empty, show all text immediately
      if (!isStreaming || !children) {
        setDisplayedText(children);
        setIsComplete(true);
        return;
      }

      // Reset state when children changes significantly (new message)
      if (children.length < displayedText.length) {
        setDisplayedText("");
        setIsComplete(false);
      }

      // If content hasn't changed or we're already showing it all, skip
      if (displayedText === children) {
        setIsComplete(true);
        return;
      }

      // Character-by-character streaming effect
      const charsToAdd = children.slice(displayedText.length);

      if (charsToAdd.length === 0) {
        setIsComplete(true);
        return;
      }

      // Add characters in chunks for smoother performance
      const chunkSize = Math.max(1, Math.ceil(charsToAdd.length / 50));
      let currentIndex = displayedText.length;

      const interval = setInterval(() => {
        if (currentIndex >= children.length) {
          setIsComplete(true);
          clearInterval(interval);
          return;
        }

        const nextChunk = children.slice(0, currentIndex + chunkSize);
        setDisplayedText(nextChunk);
        currentIndex += chunkSize;
      }, 10); // 10ms interval for smooth streaming effect

      return () => clearInterval(interval);
    }, [children, isStreaming, displayedText]);

    return (
      <div
        className={cn(
          "prose dark:prose-invert max-w-none break-words prose-pre:p-0 prose-p:leading-relaxed",
          className,
        )}
      >
        <ReactMarkdown
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !match && !String(children).includes("\n");

              if (isInline) {
                return (
                  <code
                    className={cn(
                      "rounded-sm bg-muted px-1 py-0.5 font-mono text-sm",
                      className,
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  key={Math.random()}
                  language={match?.[1] || ""}
                  {...props}
                />
              );
            },
          }}
          remarkPlugins={[remarkGfm]}
        >
          {displayedText}
        </ReactMarkdown>
        {/* Cursor effect while streaming */}
        {isStreaming && !isComplete && (
          <span className="inline-block h-4 w-1 animate-pulse bg-foreground ml-0.5" />
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.isStreaming === nextProps.isStreaming,
);

Response.displayName = "Response";
