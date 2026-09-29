type SiteEnvironment = Record<string, string | undefined>;

function normalizeAbsoluteUrl(value: string) {
  const url = new URL(value);
  return url.toString().replace(/\/$/, "");
}

function vercelHostUrl(value: string) {
  const host = value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return normalizeAbsoluteUrl(`https://${host}`);
}

/**
 * Resolve the public origin used by Next metadata. Explicit configuration wins,
 * then Vercel's production/preview hosts, with localhost only as a build/dev
 * fallback. This prevents deployed social/canonical URLs from pointing at GitHub.
 */
export function siteUrlFromEnvironment(environment: SiteEnvironment) {
  if (environment.NEXT_PUBLIC_SITE_URL) {
    return normalizeAbsoluteUrl(environment.NEXT_PUBLIC_SITE_URL);
  }
  if (environment.VERCEL_PROJECT_PRODUCTION_URL) {
    return vercelHostUrl(environment.VERCEL_PROJECT_PRODUCTION_URL);
  }
  if (environment.VERCEL_URL) {
    return vercelHostUrl(environment.VERCEL_URL);
  }
  return "http://localhost:3000";
}
