import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-lg transition-all duration-200";

  const variants = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-purple-100 text-purple-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const dotColors = {
    default: "bg-slate-400",
    primary: "bg-blue-500",
    secondary: "bg-purple-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {dot && <span className={`w-2 h-2 rounded-full mr-1.5 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
