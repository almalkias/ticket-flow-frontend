import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../../api/client";
import PublicHeader from "../../components/PublicHeader";

function Submit() {
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
      const created = await apiRequest("/tickets", {
        method: "POST",
        body: { ...form, category_id: Number(form.category_id), org_uuid: orgUuid },
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
          <p className="text-sm text-red-600">Invalid link. Please use the link provided by your support team.</p>
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
              Request submitted
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Save this reference number — you will need it to track your
              request:
            </p>
            <p className="mt-3 font-mono text-lg text-slate-900">
              {ticket.reference_number}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-slate-900">
              Submit a Request
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Describe the issue and we will get back to you.
            </p>

            <form
              className="mt-6 space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Full name
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
                  Email
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
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Category
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Submit request
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

export default Submit;
