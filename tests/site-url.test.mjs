import test from "node:test";
import assert from "node:assert/strict";
import { siteUrlFromEnvironment } from "../lib/site-url.ts";

test("explicit public site URL wins and trailing slash is normalized", () => {
  assert.equal(siteUrlFromEnvironment({
    NEXT_PUBLIC_SITE_URL: "https://algorithms.example.com/",
    VERCEL_PROJECT_PRODUCTION_URL: "production.vercel.app",
    VERCEL_URL: "preview.vercel.app",
  }), "https://algorithms.example.com");
});

test("Vercel production host takes precedence over preview host", () => {
  assert.equal(siteUrlFromEnvironment({
    VERCEL_PROJECT_PRODUCTION_URL: "foundation-algorithms.vercel.app",
    VERCEL_URL: "foundation-algorithms-git-feature.vercel.app",
  }), "https://foundation-algorithms.vercel.app");
});

test("Vercel preview host is used when no production host is present", () => {
  assert.equal(siteUrlFromEnvironment({
    VERCEL_URL: "foundation-algorithms-git-feature.vercel.app",
  }), "https://foundation-algorithms-git-feature.vercel.app");
});

test("local builds fall back to localhost rather than a repository URL", () => {
  assert.equal(siteUrlFromEnvironment({}), "http://localhost:3000");
});
