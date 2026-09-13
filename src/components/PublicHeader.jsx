import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function PublicHeader({ backTo = "/" }) {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
      <Link
        to={backTo}
        className="text-base font-semibold text-slate-900 hover:text-slate-600"
      >
        TicketFlow
      </Link>
      <button
        onClick={toggleLanguage}
        className="text-xs font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded px-2 py-1"
      >
        {lang === "en" ? "ع" : "EN"}
      </button>
    </header>
  );
}

export default PublicHeader;
