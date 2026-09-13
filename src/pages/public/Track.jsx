import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../api/client";
import PublicHeader from "../../components/PublicHeader";

function Track() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orgUuid = searchParams.get("org");
  const [form, setForm] = useState({ email: "", reference: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const statusStyles = {
    open: "bg-blue-50 text-blue-700 border-blue-200",
    in_progress: "bg-amber-50 text-amber-800 border-amber-200",
    resolved: "bg-green-50 text-green-700 border-green-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  function StatusBadge({ status }) {
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium 
  ${statusStyles[status]}`}
      >
        {t(`status.${status}`)}
      </span>
    );
  }

  async function lookup(email, reference, isRestore = false) {
    setSubmitting(true);
    setError(null);
    try {
      const found = await apiRequest(
        `/tickets/track?email=${encodeURIComponent(email)}&reference=${encodeURIComponent(reference)}&org=${orgUuid}`,
      );
      const msgs = await apiRequest(`/tickets/${found.id}/messages`);
      setTicket(found);
      setMessages(msgs);
      sessionStorage.setItem(
        `track_${orgUuid}`,
        JSON.stringify({ email, reference }),
      );
    } catch (err) {
      if (isRestore) {
        sessionStorage.removeItem(`track_${orgUuid}`);
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleLookup(e) {
    e.preventDefault();
    lookup(form.email, form.reference);
  }

  function handleReset() {
    sessionStorage.removeItem(`track_${orgUuid}`);
    setTicket(null);
    setMessages([]);
    setForm({ email: "", reference: "" });
    setError(null);
  }

  useEffect(() => {
    if (!orgUuid) return;
    const saved = sessionStorage.getItem(`track_${orgUuid}`);
    if (saved) {
      const { email, reference } = JSON.parse(saved);
      setForm({ email, reference });
      lookup(email, reference, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgUuid]);

  async function handleReply(e) {
    e.preventDefault();
    setReplying(true);
    try {
      await apiRequest(`/tickets/${ticket.id}/messages`, {
        method: "POST",
        body: {
          body: reply,
          customer_email: form.email,
          reference_number: form.reference,
        },
      });
      const msgs = await apiRequest(`/tickets/${ticket.id}/messages`);
      setMessages(msgs);
      setReply("");
    } catch (err) {
      setError(err.message);
    } finally {
      setReplying(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader backTo={orgUuid ? `/portal?org=${orgUuid}` : "/"} />

      <main className="mx-auto max-w-lg px-6 py-8">
        {!ticket ? (
          <>
            <h2 className="text-xl font-semibold text-slate-900">
              {t("track.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t("track.subtitle")}</p>

            <form
              className="mt-6 space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              onSubmit={handleLookup}
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("common.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900
  placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {t("track.emailHint")}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("track.reference")}
                </label>
                <input
                  type="text"
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  placeholder="TKT-20260907-0001"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 
  placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800
  disabled:opacity-50"
              >
                {t("track.find")}
              </button>
            </form>
          </>
        ) : (
          <>
            <button
              onClick={handleReset}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <svg
                className="h-4 w-4 rtl:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {t("track.another")}
            </button>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-slate-500">
                  {ticket.reference_number}
                </p>
                <h2 className="mt-0.5 text-xl font-semibold text-slate-900">
                  {ticket.subject}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {ticket.category?.name}
                </p>
              </div>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="mt-6 space-y-2">
              {messages.map((msg) => {
                const isCustomer = msg.sender_type === "customer";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        isCustomer
                          ? "bg-blue-100 text-slate-800"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      <div className="mb-0.5">
                        <span
                          className={`text-xs font-medium ${
                            isCustomer ? "text-slate-500" : "text-slate-500"
                          }`}
                        >
                          {msg.sender_name}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.body}</p>
                      <span
                        className={`mt-1 block text-[10px] ${
                          isCustomer ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}

              {messages.length === 0 && (
                <p className="text-sm text-slate-500">{t("common.noMessages")}</p>
              )}
            </div>


            {ticket.status !== "closed" ? (
              <form className="mt-6 space-y-3" onSubmit={handleReply}>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("track.addReply")}
                </label>
                <textarea
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400
  focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={replying || !reply.trim()}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 
  disabled:opacity-50"
                >
                  {t("track.sendReply")}
                </button>
              </form>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                {t("track.closedNote")}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Track;
