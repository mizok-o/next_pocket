import type { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: boolean;
}

export function Container({
  children,
  maxWidth = "lg",
  padding = true,
  className = "",
  ...props
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  const paddingClasses = padding ? "px-4 py-8" : "";

  return (
    <div
      className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
