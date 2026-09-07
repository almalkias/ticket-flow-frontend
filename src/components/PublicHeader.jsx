import { Link } from "react-router-dom";

function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <Link
        to="/"
        className="text-base font-semibold text-slate-900 hover:text-slate-600"
      >
        Maintenance Requests
      </Link>
    </header>
  );
}

export default PublicHeader;
