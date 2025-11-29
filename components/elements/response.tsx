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
          "prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 break-words",
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
                      "bg-muted px-1 py-0.5 rounded-sm font-mono text-sm",
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
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  code={String(children).replace(/\n$/, "")}
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
