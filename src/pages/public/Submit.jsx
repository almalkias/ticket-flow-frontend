import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../api/client";
import PublicHeader from "../../components/PublicHeader";

function Submit() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orgUuid = searchParams.get("org");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
    category_id: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [ticket, setTicket] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = { ...form, org_uuid: orgUuid };
      if (form.category_id) body.category_id = Number(form.category_id);
      else delete body.category_id;
      const created = await apiRequest("/tickets", {
        method: "POST",
        body,
      });
      setTicket(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (orgUuid) {
      apiRequest(`/categories/public?org=${orgUuid}`).then(setCategories);
    }
  }, [orgUuid]);

  if (!orgUuid) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicHeader backTo="/" />
        <main className="mx-auto max-w-lg px-6 py-8">
          <p className="text-sm text-red-600">{t("common.invalidLink")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader backTo={`/portal?org=${orgUuid}`} />

      <main className="mx-auto max-w-lg px-6 py-8">
        {ticket ? (
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm text-center">
            <h2 className="text-base font-semibold text-slate-900">
              {t("submit.successTitle")}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {t("submit.successNote")}
            </p>
            <p className="mt-3 font-mono text-lg text-slate-900">
              {ticket.reference_number}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-slate-900">
              {t("submit.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t("submit.subtitle")}</p>

            <form
              className="mt-6 space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("submit.fullName")}
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("common.email")}
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={form.customer_email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("submit.subject")}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    {t("submit.category")}{" "}
                    <span className="font-normal text-slate-400">
                      ({t("submit.optional")})
                    </span>
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">{t("submit.selectCategory")}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("submit.description")}
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {error && (
                <ul className="rounded-md border border-red-200 bg-red-50 p-3 space-y-1">
                  {error.split('\n').map((msg, i) => (
                    <li key={i} className="text-xs text-red-700">• {msg}</li>
                  ))}
                </ul>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {t("submit.submitBtn")}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

export default Submit;
