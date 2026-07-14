import { Link, Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="border-b bg-gray-900 text-white">
        <nav className="mx-auto flex max-w-6xl gap-4 px-4 py-3 text-sm font-medium">
          <span className="font-semibold">IAM Admin</span>
          <Link to="/" className="hover:text-blue-300">
            Dashboard
          </Link>
          <Link to="/roles" className="hover:text-blue-300">
            Roles
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
