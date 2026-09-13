import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";
import StaffLayout from "../../components/StaffLayout";

function Categories() {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function load() {
    const token = await getToken();
    const data = await apiRequest("/categories", { token });
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await getToken();
      await apiRequest("/categories", {
        method: "POST",
        token,
        body: form,
      });
      setForm({ name: "" });
      setSuccess(t("categories.created"));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id, is_active) {
    const token = await getToken();
    await apiRequest(`/categories/${id}`, {
      method: "PATCH",
      token,
      body: { is_active },
    });
    await load();
  }

  return (
    <StaffLayout>
      <div className="max-w-3xl space-y-6">
        {/* Create category form */}
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {t("categories.add")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t("common.name")}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
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
            {success && <p className="text-sm text-green-600">{success}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800
  disabled:opacity-50"
            >
              {submitting ? t("categories.creating") : t("categories.createBtn")}
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-400">
            {t("categories.deactivateHint")}
          </p>
        </div>

        {/* Categories table */}
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
                    {t("common.status")}
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">{cat.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs
  font-medium ${
    cat.is_active
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-slate-100 text-slate-600 border-slate-200"
  }`}
                      >
                        {cat.is_active
                          ? t("common.active")
                          : t("common.inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      {cat.is_active ? (
                        <button
                          onClick={() => handleUpdate(cat.id, false)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          {t("common.deactivate")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdate(cat.id, true)}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          {t("common.reactivate")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      {t("categories.empty")}
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

export default Categories;
