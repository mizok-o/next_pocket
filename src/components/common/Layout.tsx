import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Layout({ children, header, sidebar, footer, maxWidth = "lg" }: LayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {header && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
          {header}
        </header>
      )}

      <div className="flex">
        {sidebar && (
          <aside className="w-64 min-h-screen bg-white/50 backdrop-blur-sm border-r border-slate-200/60 p-6">
            {sidebar}
          </aside>
        )}

        <main className={`flex-1 ${maxWidthClasses[maxWidth]} mx-auto px-4 py-8`}>{children}</main>
      </div>

      {footer && (
        <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 p-6">
          {footer}
        </footer>
      )}
    </div>
  );
}
