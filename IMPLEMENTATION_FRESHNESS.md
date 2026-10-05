# Implementation Freshness Policy

Implementation records in Foundation Algorithms are **immutable evidence snapshots**. A record points to the exact upstream commit that was inspected when the evidence was curated.

Freshness monitoring answers a different question:

> Has the upstream branch/ref moved since that snapshot was verified?

It does **not** answer whether the pinned implementation is correct, obsolete, insecure, better, or worse.

## States

The report uses three descriptive states:

- **Current** — the configured upstream `verifiedRef` still resolves to the exact `verifiedCommit` stored in the record.
- **Upstream moved** — the branch/ref now resolves to another commit. The existing pin remains valid historical evidence; a human may choose to inspect the newer revision and add/update evidence deliberately.
- **Unavailable** — the upstream ref could not be resolved during that check. This is an operational/network state, not evidence about the implementation.

## Immutable-pin rule

Automation must never rewrite `verifiedCommit`, `sourcePaths`, `verifiedRef`, or `lastVerified` merely because an upstream branch changed.

A new pin requires direct human/research review of:

1. the upstream repository and intended branch/ref;
2. the relevant implementation paths;
3. license/repository metadata where it materially changed;
4. whether the implementation still operationalizes the linked Algorithm(s);
5. any materially changed interfaces or implementation notes.

Only after that review should the registry be updated to a new exact commit.

## Verification-history rule

Every current implementation pin must also be the latest entry in `lib/implementation-verification-history.ts`.

The verification history is append-only provenance. Each revision stores:

- implementation ID;
- sequential revision number;
- verification date;
- inspected branch/ref;
- full verified commit SHA;
- the exact source-path URLs inspected at that commit;
- a concise note describing what was verified.

Build-time validation requires the live `ImplementationRecord` to match the latest verification revision exactly for ref, commit, date, and source paths.

When a re-review accepts a newer upstream snapshot:

1. keep every older verification revision unchanged;
2. append the next sequential verification revision with the new exact pin and source paths;
3. update the current `ImplementationRecord` to match that new latest revision;
4. update `lastVerified` to the new review date;
5. run the research and browser acceptance suites.

This means the product can show the current inspected state while preserving the complete sequence of earlier inspected snapshots without relying only on Git history.

## Upstream-review ledger rule

Upstream movement can be reviewed without changing the evidence pin. Those decisions live separately in `lib/implementation-upstream-reviews.ts`.

Each upstream-review revision stores:

- implementation ID and sequential review revision;
- review date and observed branch/ref;
- the exact observed upstream commit;
- the immutable pinned commit that was compared;
- an explicit decision: **Retain pin**, **Advance pin**, or **Needs follow-up**;
- whether the inspected implementation paths contain a material change;
- per-path pinned and upstream blob identities plus a changed/unchanged flag;
- a concise note explaining the decision.

Review revisions are append-only and do not mutate verification history. A **Retain pin** decision records that upstream movement was inspected and the existing snapshot remains the intended evidence pin. An **Advance pin** decision is still only a review decision until a new verification-history revision and matching `ImplementationRecord` update are committed. **Needs follow-up** preserves uncertainty rather than silently selecting a new snapshot.

The Implementation registry exposes this ledger directly: records can be filtered by upstream-review state, review notes and inspected paths participate in registry search, and implementation detail pages show observed commits, compare links, per-path pinned/observed blobs, material-change status, and the full review note.

## Automation

`npm run report:freshness`:

1. reads `lib/implementations.ts`;
2. parses each canonical public GitHub repository URL;
3. resolves the declared `verifiedRef` through the GitHub API;
4. compares the current upstream commit with the immutable `verifiedCommit`;
5. matches moved refs against the latest append-only upstream-review revision;
6. writes `test-results/implementation-freshness.json` with freshness and review state;
7. writes a compact table and moved-ref review summary to the GitHub Actions step summary when available.

The normal validation workflow runs this report as **non-blocking** because network/API availability must not determine whether the research hub builds correctly.

A dedicated scheduled workflow (`.github/workflows/implementation-freshness.yml`) runs every Monday and can also be started manually. Its JSON report is retained as a workflow artifact for 30 days.

## Review workflow

When a record is reported as **Upstream moved**:

1. compare the pinned commit with the new upstream ref;
2. inspect only relevant implementation paths first;
3. append an upstream-review revision with the observed commit, inspected blob identities, material-change result, and explicit decision;
4. if the decision is **Retain pin**, keep the Implementation record and verification history unchanged;
5. if the decision is **Advance pin**, perform a full implementation verification, append the next verification-history revision, and update the live record to that exact commit/source-path/date snapshot;
6. if the decision is **Needs follow-up**, preserve the existing pin until the unresolved change is reviewed;
7. let validation confirm both ledgers remain internally consistent.

Do not interpret frequent upstream movement as lower quality. Active projects naturally move more often than stable ones.

## Why the report is not shown as an evidence score

Freshness and scientific/engineering evidence are orthogonal. A six-month-old pinned implementation can be perfectly reproducible evidence for a mechanism, while a branch updated five minutes ago can still require review before the archive should point to it.

For that reason, freshness remains an operational provenance signal and does not change Algorithm evidence stage automatically.