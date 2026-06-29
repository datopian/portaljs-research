const dms = process.env.NEXT_PUBLIC_DMS;
const mainOrgMatch = dms?.replace(/\/$/, "").match(/\/@([^/]+)$/);

export const envVars = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  dms,
  mainOrg: mainOrgMatch?.[1] ?? "",
  isrRevalidate: Number(process.env.ISR_REVALIDATE ?? "60"),
  i18nDefaultLocale: process.env.NEXT_PUBLIC_I18N_DEFAULT_LOCALE ?? "en",
  i18nSupportedLocales: (process.env.NEXT_PUBLIC_I18N_SUPPORTED_LOCALES ?? "en")
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean),
} as const;
