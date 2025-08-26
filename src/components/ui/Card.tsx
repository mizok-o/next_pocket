import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "default", padding = "md", hover = false, className = "", children, ...props },
    ref
  ) => {
    const baseStyles = "rounded-2xl transition-all duration-300";

    const variants = {
      default: "bg-white/80 backdrop-blur-sm border border-slate-200/60",
      elevated: "bg-white shadow-xl shadow-slate-500/10",
      outlined: "bg-transparent border-2 border-slate-200",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hover
      ? "hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300/60 hover:-translate-y-1"
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
