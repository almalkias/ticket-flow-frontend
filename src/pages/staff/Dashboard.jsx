import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";
import StaffLayout from "../../components/StaffLayout";

const statusStyles = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-800 border-amber-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const priorityDot = {
  low: "bg-slate-400",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

function StatusBadge({ status }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {t(`status.${status}`)}
    </span>
  );
}

function PriorityDot({ priority }) {
  const { t } = useTranslation();
  return (
    <span className="flex items-center gap-1.5 text-sm text-slate-600">
      <span className={`h-2 w-2 rounded-full ${priorityDot[priority]}`} />
      {t(`priority.${priority}`)}
    </span>
  );
}

function Dashboard() {
  const { t } = useTranslation();
  const { getToken, profile } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const data = await apiRequest("/tickets", { token });
      setTickets(data);
      setLoading(false);
    }
    load();
  }, []);

  const orgUuid = profile?.organization?.uuid;
  const portalLink = orgUuid
    ? `${window.location.origin}/portal?org=${orgUuid}`
    : null;

  if (loading)
    return (
      <StaffLayout>
        <p className="text-sm text-slate-500">{t("common.loading")}</p>
      </StaffLayout>
    );

  return (
    <StaffLayout>
      {portalLink && (
        <div className="mb-6 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            {t("dashboard.share")}
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-slate-700 truncate flex-1">
              {portalLink}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(portalLink)}
              className="shrink-0 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
            >
              {t("common.copy")}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {t("dashboard.shareHint")}
          </p>
        </div>
      )}

      {tickets.length === 0 &&
        (profile?.role === "admin" ? (
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              {t("dashboard.gettingStarted")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("dashboard.gsIntro")}
            </p>
            <ol className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                  1
                </span>
                <div>
                  <p className="text-sm text-slate-700">{t("dashboard.gs1")}</p>
                  <Link
                    to="/categories"
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {t("dashboard.gs1Link")}
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                  2
                </span>
                <div>
                  <p className="text-sm text-slate-700">{t("dashboard.gs2")}</p>
                  <Link
                    to="/agents"
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {t("dashboard.gs2Link")}
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                  3
                </span>
                <p className="text-sm text-slate-700">{t("dashboard.gs3")}</p>
              </li>
            </ol>
          </div>
        ) : (
          <p className="text-sm text-slate-500">{t("dashboard.noTickets")}</p>
        ))}

      {tickets.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t("dashboard.reference")}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t("dashboard.subject")}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t("dashboard.category")}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t("dashboard.priority")}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t("common.status")}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t("dashboard.submitted")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {ticket.reference_number}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {ticket.subject}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {ticket.category?.name}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityDot priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-slate-500">
                      {ticket.reference_number}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-900 truncate">
                      {ticket.subject}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {ticket.category?.name}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <PriorityDot priority={ticket.priority} />
                  <span className="text-xs text-slate-400">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </StaffLayout>
  );
}

export default Dashboard;
