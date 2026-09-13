import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicHeader from "../../components/PublicHeader";

function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            {t("landing.welcome")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{t("landing.tagline")}</p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/register"
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 text-center"
            >
              {t("landing.createOrg")}
            </Link>
            <Link
              to="/login"
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
            >
              {t("landing.signIn")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
