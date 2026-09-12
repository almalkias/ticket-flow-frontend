import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";
import StaffLayout from "../../components/StaffLayout";

function Categories() {
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
      setSuccess("Category created.");
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
            Add category
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900
  placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800
  disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create category"}
            </button>
          </form>
        </div>

        {/* Categories table */}
        {!loading && (
          <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide
  text-slate-500"
                  >
                    Name
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide
  text-slate-500"
                  >
                    Status
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
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {cat.is_active ? (
                        <button
                          onClick={() => handleUpdate(cat.id, false)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdate(cat.id, true)}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Reactivate
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
                      No categories yet.
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
