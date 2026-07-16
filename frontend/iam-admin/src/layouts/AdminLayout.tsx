import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@timo/brand";
import mark from "@timo/brand/assets/logos/timo-mark-96.png";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-base-200 text-base-content min-h-screen">
      <header className="bg-base-100 border-base-300 border-b">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 text-sm font-medium">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            {/* Decorative: the adjacent text already names the app. */}
            <img src={mark} alt="" className="h-7 w-7" />
            IAM Admin
          </Link>
          <Link to="/" className="hover:text-primary">
            Dashboard
          </Link>
          <Link to="/roles" className="hover:text-primary">
            Roles
          </Link>
          <ThemeToggle className="btn btn-ghost btn-sm ml-auto" />
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
