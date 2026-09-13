import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

function ActionButton({ label, endpoint, getToken, onUpdate, danger }) {
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      const token = await getToken();
      const updated = await apiRequest(endpoint, { method: "PATCH", token });
      onUpdate(updated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className={`rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 ${
        danger
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      {loading ? "..." : label}
    </button>
  );
}

function AssignButton({ ticket, getToken, onUpdate }) {
  const { t } = useTranslation();
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getToken().then((token) =>
      apiRequest("/users/agents", { token }).then(setAgents),
    );
  }, []);

  async function handle() {
    if (!selected) return;
    setLoading(true);
    try {
      const token = await getToken();
      const updated = await apiRequest(`/tickets/${ticket.id}/assign`, {
        method: "PATCH",
        token,
        body: { agent_id: Number(selected) },
      });
      onUpdate(updated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs text-slate-500">
        {t("ticket.assignTo")}
      </span>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      >
        <option value="">{t("ticket.selectAgent")}</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.full_name}
          </option>
        ))}
      </select>
      <button
        onClick={handle}
        disabled={loading || !selected}
        className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "..." : t("common.save")}
      </button>
    </div>
  );
}

function PriorityButton({ ticket, getToken, onUpdate }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(ticket.priority);
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      const token = await getToken();
      const updated = await apiRequest(`/tickets/${ticket.id}/priority`, {
        method: "PATCH",
        token,
        body: { priority: selected },
      });
      onUpdate(updated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs text-slate-500">
        {t("ticket.priority")}
      </span>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      >
        <option value="low">{t("priority.low")}</option>
        <option value="medium">{t("priority.medium")}</option>
        <option value="high">{t("priority.high")}</option>
        <option value="urgent">{t("priority.urgent")}</option>
      </select>
      <button
        onClick={handle}
        disabled={loading}
        className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "..." : t("common.save")}
      </button>
    </div>
  );
}

function CategoryButton({ ticket, getToken, onUpdate }) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(ticket.category?.id ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getToken().then((token) =>
      apiRequest("/categories", { token }).then((data) =>
        setCategories(data.filter((c) => c.is_active)),
      ),
    );
  }, []);

  async function handle() {
    if (!selected) return;
    setLoading(true);
    try {
      const token = await getToken();
      const updated = await apiRequest(`/tickets/${ticket.id}/category`, {
        method: "PATCH",
        token,
        body: { category_id: Number(selected) },
      });
      onUpdate(updated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs text-slate-500">
        {t("ticket.category")}
      </span>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      >
        <option value="">{t("ticket.select")}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        onClick={handle}
        disabled={loading || !selected}
        className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "..." : t("common.save")}
      </button>
    </div>
  );
}

function TicketDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getToken, profile } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState(null);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const [t, msgs] = await Promise.all([
        apiRequest(`/tickets/${id}`, { token }),
        apiRequest(`/tickets/${id}/messages`, { token }),
      ]);
      setTicket(t);
      setMessages(msgs);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading)
    return (
      <StaffLayout>
        <p className="text-sm text-slate-500">{t("common.loading")}</p>
      </StaffLayout>
    );

  async function handleReply(e) {
    e.preventDefault();
    setReplying(true);
    setReplyError(null);
    try {
      const token = await getToken();
      await apiRequest(`/tickets/${id}/messages`, {
        method: "POST",
        token,
        body: { body: reply, is_internal: isInternal },
      });
      const msgs = await apiRequest(`/tickets/${id}/messages`, { token });
      setMessages(msgs);
      setReply("");
      setIsInternal(false);
    } catch (err) {
      setReplyError(err.message);
    } finally {
      setReplying(false);
    }
  }

  return (
    <StaffLayout>
      <div className="max-w-3xl space-y-6">
        {/* Ticket header */}
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-slate-500">
                {ticket.reference_number}
              </p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">
                {ticket.subject}
              </h2>
            </div>
            <StatusBadge status={ticket.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">{t("ticket.customer")}</p>
              <p className="text-slate-900">{ticket.customer_name}</p>
              <p className="text-xs text-slate-500">{ticket.customer_email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("ticket.category")}</p>
              <p className="text-slate-900">{ticket.category?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("ticket.priority")}</p>
              <p className="text-slate-900">
                {t(`priority.${ticket.priority}`)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("ticket.assignedTo")}</p>
              <p className="text-slate-900">
                {ticket.assigned_to?.full_name ?? t("ticket.unassigned")}
              </p>
            </div>
          </div>

          {ticket.description && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500 mb-1">
                {t("ticket.description")}
              </p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          )}

          <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col gap-2">
            {profile?.role === "admin" && (
              <AssignButton
                ticket={ticket}
                getToken={getToken}
                onUpdate={setTicket}
              />
            )}
            {profile?.role === "admin" && (
              <PriorityButton
                ticket={ticket}
                getToken={getToken}
                onUpdate={setTicket}
              />
            )}
            {profile?.role === "admin" && (
              <CategoryButton
                ticket={ticket}
                getToken={getToken}
                onUpdate={setTicket}
              />
            )}
            {profile?.role === "admin" && ticket.status === "resolved" && (
              <div className="pt-1">
                <ActionButton
                  label={t("ticket.closeTicket")}
                  endpoint={`/tickets/${id}/close`}
                  getToken={getToken}
                  onUpdate={setTicket}
                  danger
                />
              </div>
            )}
            {(profile?.role === "agent"
              ? ticket.assigned_to?.id === profile?.id &&
                ticket.status === "in_progress"
              : ticket.status === "in_progress" ||
                ticket.status === "open") && (
              <ActionButton
                label={t("ticket.markResolved")}
                endpoint={`/tickets/${id}/resolve`}
                getToken={getToken}
                onUpdate={setTicket}
              />
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            {t("ticket.conversation")}
          </h3>
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">{t("common.noMessages")}</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-md border p-4 text-sm ${
                msg.is_internal
                  ? "border-amber-200 bg-amber-50"
                  : msg.sender_type === "customer"
                    ? "border-slate-200 bg-white"
                    : "border-blue-100 bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-700">
                  {msg.sender_name}
                  {msg.is_internal && (
                    <span className="ms-2 text-xs text-amber-700">
                      {t("ticket.internalNoteTag")}
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{msg.body}</p>
            </div>
          ))}
        </div>
      </div>

      {ticket.status !== "closed" && (
        <form
          onSubmit={handleReply}
          className="mt-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm space-y-3"
        >
          <h3 className="text-sm font-semibold text-slate-900">
            {t("ticket.addReply")}
          </h3>
          <textarea
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-slate-300"
              />
              {t("ticket.internalNote")}
            </label>
            {replyError && (
              <ul className="rounded-md border border-red-200 bg-red-50 p-3 space-y-1">
                {replyError.split('\n').map((msg, i) => (
                  <li key={i} className="text-xs text-red-700">• {msg}</li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              disabled={replying || !reply.trim()}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {t("common.send")}
            </button>
          </div>
        </form>
      )}
    </StaffLayout>
  );
}

export default TicketDetail;
