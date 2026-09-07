import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-base font-semibold text-slate-900">
          Maintenance Requests
        </h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Facility Maintenance
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Submit a maintenance request or track an existing one.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800
  text-center"
            >
              Submit a request
            </Link>
            <Link
              to="/track"
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium 
  text-slate-700 hover:bg-slate-50 text-center"
            >
              Track my request
            </Link>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              Staff login →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
