import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicHeader from "../../components/PublicHeader";

function Landing() {
  const { t } = useTranslation();

  const steps = [1, 2, 3].map((n) => ({
    title: t(`landing.step${n}Title`),
    text: t(`landing.step${n}Text`),
  }));

  const features = [1, 2, 3, 4, 5].map((n) => ({
    title: t(`landing.feat${n}Title`),
    text: t(`landing.feat${n}Text`),
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

      {/* Hero */}
      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold text-slate-900">
            {t("landing.heroTitle")}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="w-full rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800 sm:w-auto"
            >
              {t("landing.createOrg")}
            </Link>
            <Link
              to="/login"
              className="w-full rounded-md border border-slate-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              {t("landing.signIn")}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-semibold text-slate-900">
            {t("landing.howTitle")}
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-semibold text-slate-900">
            {t("landing.featuresTitle")}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{t("landing.ctaText")}</p>
          <Link
            to="/register"
            className="mt-6 inline-block rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            {t("landing.createOrg")}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
