
import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
}

const Code = React.forwardRef<HTMLPreElement, CodeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          "px-4 py-3 font-mono text-sm bg-slate-100 dark:bg-slate-800 rounded-md overflow-auto",
          className
        )}
        {...props}
      >
        <code>{children}</code>
      </pre>
    );
  }
);

Code.displayName = "Code";

export { Code };
