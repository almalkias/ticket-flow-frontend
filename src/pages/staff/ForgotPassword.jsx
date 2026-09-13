import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import PublicHeader from "../../components/PublicHeader";

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch {
      setError(t("forgot.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm px-6">
          <h1 className="text-xl font-semibold text-slate-900 text-center mb-6">
            {t("forgot.title")}
          </h1>

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            {sent ? (
              <div className="space-y-3 text-center">
                <p className="text-sm text-slate-700">
                  {t("forgot.sent", { email })}
                </p>
                <p className="text-xs text-slate-500">{t("forgot.spam")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    {t("common.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  {t("forgot.send")}
                </button>
              </form>
            )}
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            <Link
              to="/login"
              className="text-slate-900 font-medium hover:underline"
            >
              {t("forgot.back")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
