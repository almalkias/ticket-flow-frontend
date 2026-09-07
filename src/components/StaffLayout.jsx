import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StaffLayout({ children }) {
  const { user, logout, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function navItem(label, path) {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        className={`block rounded-md px-3 py-2 text-sm font-medium ${
          active
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-slate-200">
          <h1 className="text-base font-semibold text-slate-900">
            Maintenance
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItem("Dashboard", "/dashboard")}
          {profile?.role === "admin" && navItem("Agents", "/agents")}
          {profile?.role === "admin" && navItem("Categories", "/categories")}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className="px-3 py-2 text-xs text-slate-500 truncate">
            {profile?.full_name}
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-700">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/agents" && "Agents"}
            {location.pathname === "/categories" && "Categories"}
            {location.pathname.startsWith("/tickets/") && "Ticket Detail"}
          </h2>
          <button className="text-slate-500 hover:text-slate-700 text-sm">
            🔔
          </button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default StaffLayout;
