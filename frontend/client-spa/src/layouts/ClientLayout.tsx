import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@timo/brand";
import mark from "@timo/brand/assets/logos/timo-mark-96.png";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="bg-base-200 text-base-content min-h-screen">
      <header className="bg-base-100 border-base-300 border-b">
        <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 text-sm font-medium">
          {/* Sole brand identifier here, so it carries the name. */}
          <Link to="/" className="flex items-center">
            <img src={mark} alt="TIMO" className="h-7 w-7" />
          </Link>
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <Link to="/users" className="hover:text-primary">
            Users
          </Link>
          <ThemeToggle className="btn btn-ghost btn-sm ml-auto" />
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
