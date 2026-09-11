import { Link } from "react-router-dom";

function PublicHeader({ backTo = "/" }) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <Link
        to={backTo}
        className="text-base font-semibold text-slate-900 hover:text-slate-600"
      >
        TicketFlow
      </Link>
    </header>
  );
}

export default PublicHeader;
