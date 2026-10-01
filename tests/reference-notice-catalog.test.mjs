import test from "node:test";
import assert from "node:assert/strict";
import { getReference, references } from "../lib/references.ts";

test("every curated reference exposes an explicit lifecycle notice collection", () => {
  for (const reference of references) {
    assert.ok(Array.isArray(reference.notices), `${reference.id} must expose notices[]`);
  }
});

test("FIPS 203 preserves final-version and authoritative errata provenance", () => {
  const reference = getReference("nist-2024-fips203");
  assert.ok(reference);

  const version = reference.notices.find((notice) => notice.kind === "Version");
  const errata = reference.notices.find((notice) => notice.kind === "Errata");

  assert.ok(version, "FIPS 203 must retain a verified final-version notice");
  assert.ok(errata, "FIPS 203 must retain NIST's potential-update/errata notice");
  assert.match(version.url, /^https:\/\/csrc\.nist\.gov\//);
  assert.match(errata.url, /^https:\/\/csrc\.nist\.gov\//);
  assert.match(version.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(errata.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(errata.note, /future update\/revision/i);
});
