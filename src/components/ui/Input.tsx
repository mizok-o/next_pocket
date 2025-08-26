import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { variant = "default", size = "md", error, label, helperText, className = "", ...props },
    ref
  ) => {
    const baseStyles =
      "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      default:
        "border border-slate-200 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500",
      filled: "border-0 bg-slate-100 rounded-lg focus:ring-blue-500 focus:bg-white",
      outlined:
        "border-2 border-slate-200 bg-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    const errorStyles = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${errorStyles} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="text-sm text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
