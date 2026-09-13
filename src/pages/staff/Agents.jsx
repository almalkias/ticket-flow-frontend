import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";
import StaffLayout from "../../components/StaffLayout";

function Agents() {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function load() {
    const token = await getToken();
    const data = await apiRequest("/users/agents", { token });
    setAgents(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await getToken();
      const { email } = form;
      await apiRequest("/users/agents", {
        method: "POST",
        token,
        body: form,
      });
      await sendPasswordResetEmail(auth, email);
      setForm({ full_name: "", email: "" });
      setSuccess(email);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id, is_active) {
    const token = await getToken();
    await apiRequest(`/users/agents/${id}`, {
      method: "PATCH",
      token,
      body: { is_active },
    });
    await load();
  }

  return (
    <StaffLayout>
      <div className="max-w-3xl space-y-6">
        {/* Create agent form */}
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {t("agents.add")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t("common.fullName")}
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900
  placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
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
            </div>
            {error && (
              <ul className="rounded-md border border-red-200 bg-red-50 p-3 space-y-1">
                {error.split('\n').map((msg, i) => (
                  <li key={i} className="text-xs text-red-700">• {msg}</li>
                ))}
              </ul>
            )}
            {success && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3">
                <p className="text-xs font-medium text-green-700">
                  {t("agents.created", { email: success })}
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800
  disabled:opacity-50"
            >
              {submitting ? t("agents.creating") : t("agents.createBtn")}
            </button>
          </form>
        </div>

        {/* Agents table */}
        {!loading && (
          <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th
                    className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide
  text-slate-500"
                  >
                    {t("common.name")}
                  </th>
                  <th
                    className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide
  text-slate-500"
                  >
                    {t("common.email")}
                  </th>
                  <th
                    className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide
  text-slate-500"
                  >
                    {t("common.status")}
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">
                      {agent.full_name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{agent.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs 
  font-medium ${
    agent.is_active
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-slate-100 text-slate-600 border-slate-200"
  }`}
                      >
                        {agent.is_active
                          ? t("common.active")
                          : t("common.inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      {agent.is_active ? (
                        <button
                          onClick={() => handleUpdate(agent.id, false)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          {t("common.deactivate")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdate(agent.id, true)}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          {t("common.reactivate")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {agents.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      {t("agents.empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

export default Agents;
