import fs from "node:fs";
import path from "node:path";
import { claims } from "../lib/claims.ts";
import { implementations } from "../lib/implementations.ts";
import { references } from "../lib/references.ts";
import { relationProvenance } from "../lib/relation-provenance.ts";
import { replications } from "../lib/replications.ts";

const progressPath = path.join(process.cwd(), "PROGRESS.md");
const progress = fs.readFileSync(progressPath, "utf8");

const expected = [
  { label: "curated passage-backed Claims", count: claims.length },
  { label: "curated References", count: references.length },
  { label: "implementation records", count: implementations.length },
  { label: "independent Replication/Evaluation records", count: replications.length },
  { label: "source-backed Atlas relations", count: relationProvenance.length },
];

const errors = [];
for (const { label, count } of expected) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`\\b${count}\\s+(?:\\*\\*)?${escaped}`, "i");
  if (!matcher.test(progress)) {
    errors.push(`PROGRESS.md must report ${count} ${label}`);
  }
}

if (errors.length) {
  console.error("Progress consistency check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Progress consistency passed: ${claims.length} claims, ${references.length} references, ${implementations.length} implementations, ${replications.length} replications, ${relationProvenance.length} source-backed Atlas relations.`,
);
