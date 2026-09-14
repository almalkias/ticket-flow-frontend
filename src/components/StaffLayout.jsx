import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { apiRequest } from "../api/client";

function StaffLayout({ children }) {
  const { t } = useTranslation();
  const { logout, user, profile, getToken } = useAuth();
  const { lang, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    async function loadNotifications() {
      const token = await getToken();
      const data = await apiRequest("/notifications", { token });
      setNotifications(data);
    }
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function handleNotificationClick(notification) {
    const token = await getToken();
    await apiRequest(`/notifications/${notification.id}/read`, {
      method: "PATCH",
      token,
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
    );
    setBellOpen(false);
    navigate(`/tickets/${notification.ticket.id}`);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  function mobileNavItem(label, path) {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        className={`whitespace-nowrap py-1 text-sm font-medium ${
          active ? "text-slate-900" : "text-slate-500"
        }`}
      >
        {label}
      </Link>
    );
  }

  const pageTitle =
    location.pathname === "/dashboard"
      ? t("layout.dashboard")
      : location.pathname === "/agents"
        ? t("layout.agents")
        : location.pathname === "/categories"
          ? t("layout.categories")
          : location.pathname.startsWith("/tickets/")
            ? t("layout.ticketDetail")
            : "";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-slate-200 bg-white flex-col">
        <div className="px-4 py-4 border-b border-slate-200">
          <h1 className="text-base font-semibold text-slate-900">
            {t("layout.appName")}
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItem(t("layout.dashboard"), "/dashboard")}
          {profile?.role === "admin" && navItem(t("layout.agents"), "/agents")}
          {profile?.role === "admin" &&
            navItem(t("layout.categories"), "/categories")}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className="px-3 py-2 text-xs text-slate-500 truncate">
            {profile?.full_name}
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full rounded-md px-3 py-2 text-start text-sm font-medium text-red-600 hover:bg-red-50"
          >
            {t("layout.signOut")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-900">
              {t("layout.appName")}
            </h1>
            {profile?.full_name && (
              <p className="text-xs text-slate-500">{profile.full_name}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded px-2 py-1"
            >
              {lang === "en" ? "ع" : "EN"}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600"
            >
              {t("layout.signOut")}
            </button>
          </div>
        </div>

        {/* Mobile nav links */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-4 overflow-x-auto">
          {mobileNavItem(t("layout.dashboard"), "/dashboard")}
          {profile?.role === "admin" &&
            mobileNavItem(t("layout.agents"), "/agents")}
          {profile?.role === "admin" &&
            mobileNavItem(t("layout.categories"), "/categories")}
        </div>

        {/* Desktop top bar */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-6 py-3 items-center justify-between">
          <h2 className="text-sm font-medium text-slate-700">{pageTitle}</h2>
          <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded px-2 py-1"
          >
            {lang === "en" ? "ع" : "EN"}
          </button>
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setBellOpen((o) => !o)}
              className="relative p-1.5 text-slate-500 hover:text-slate-700"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -inset-e-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <div className="absolute inset-e-0 top-full mt-1 w-80 rounded-md border border-slate-200 bg-white z-50">
                <div className="border-b border-slate-200 px-4 py-2.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t("layout.notifications")}
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                      {t("layout.noNotifications")}
                    </p>
                  ) : (
                    notifications.slice(0, 20).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 ${
                          !n.is_read ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            !n.is_read ? "bg-blue-600" : "bg-transparent"
                          }`}
                        />
                        <div>
                          <p className="text-sm text-slate-800">{n.message}</p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {new Date(n.created_at).toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          </div>
        </header>

        {user?.email === "demo@ticketflow.app" && (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-xs text-amber-800">
            {t("layout.demoBanner")}
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default StaffLayout;
