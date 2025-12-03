import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";

export const Response = memo(
  ({ children, className }: { children: string; className?: string }) => {
    return (
      <div
        className={cn(
          "prose dark:prose-invert max-w-none break-words prose-pre:p-0 prose-p:leading-relaxed",
          className
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
                      className
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
          {children}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
