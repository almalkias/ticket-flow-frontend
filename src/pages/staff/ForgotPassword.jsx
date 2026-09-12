import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import PublicHeader from "../../components/PublicHeader";

function ForgotPassword() {
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
      setError("Something went wrong. Please try again.");
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
            Reset your password
          </h1>

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            {sent ? (
              <div className="space-y-3 text-center">
                <p className="text-sm text-slate-700">
                  If an account exists for{" "}
                  <span className="font-medium">{email}</span>, you'll receive a
                  reset link shortly.
                </p>
                <p className="text-xs text-slate-500">
                  Check your spam folder if you don't see it.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  Send reset link
                </button>
              </form>
            )}
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            <Link
              to="/login"
              className="text-slate-900 font-medium hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
