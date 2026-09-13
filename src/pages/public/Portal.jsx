import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicHeader from "../../components/PublicHeader";

function Portal() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orgUuid = searchParams.get("org");

  if (!orgUuid) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicHeader />
        <main className="mx-auto max-w-lg px-6 py-8">
          <p className="text-sm text-red-600">{t("common.invalidLink")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader backTo={`/portal?org=${orgUuid}`} />

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            {t("portal.title")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{t("portal.subtitle")}</p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to={`/submit?org=${orgUuid}`}
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 text-center"
            >
              {t("portal.submit")}
            </Link>
            <Link
              to={`/track?org=${orgUuid}`}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
            >
              {t("portal.track")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Portal;
