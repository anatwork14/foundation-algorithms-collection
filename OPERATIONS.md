# Validation and Deployment Operations Guide

This document describes how the Foundation Algorithms web application is validated, deployed, and accepted without confusing a successful build with research, accessibility, visual, or production acceptance.

## Validation layers

The project deliberately uses multiple gates.

### 1. Markdown integrity

```bash
npm run check:links
```

This checks:

- local Markdown file targets;
- structurally valid external URLs;
- HTTPS policy for research links;
- narrowly documented legacy exceptions.

The check is network-independent so third-party outages do not make CI flaky.

It does not prove that an external source remains available or scientifically appropriate.

### 2. Application source hygiene

```bash
npm run check:source
```

This performs dependency-free static checks over application code for committed debug statements, broad TypeScript suppression, and unsafe `_blank` anchors.

It is intentionally narrower than a full ESLint/accessibility analyzer and should not be presented as one.

### 3. Research utility tests

```bash
npm run test:research
```

The Node test suite covers deterministic research/data behavior including:

- passage ranking and snippets;
- content parsing and source-line accounting;
- heading slugs and math normalization;
- Archive structural filtering and sorting;
- Algorithm/Combination validation;
- Reference/citation validation;
- Claim provenance;
- Implementation commit pinning;
- Experiment rules;
- evidence-stage derivation;
- independent-replication validation.

Tests should stay deterministic and should not depend on live third-party network calls.

### 4. TypeScript

```bash
npm run typecheck
```

Strict typechecking protects schema and UI integration but does not validate research semantics.

### 5. Production build

```bash
npm run build
```

The Next.js build exercises static route generation and the project-wide research-integrity assertions.

A build failure caused by research validation should be fixed in the data or validator logic; do not disable validation to force a build through.

### 6. Production route smoke test

CI launches the production Next.js server and requests representative index/detail/provenance routes.

This proves those server routes answer successfully in the CI environment. It is not a visual, browser-interaction, or accessibility test.

## GitHub Actions

The workflow lives in `.github/workflows/ci.yml` and runs on pushes to `main` and pull requests.

A healthy checkpoint requires the single `web` job to pass all of:

```text
Install dependencies
Check Markdown links
Check source hygiene
Test research utilities
Typecheck
Build
Production route smoke test
```

When diagnosing a failure, inspect the first failed step rather than assuming a later build problem.

## Dependency installation

CI currently uses `npm install` with the committed package metadata.

If dependency reproducibility becomes a release blocker, migrate deliberately to a lockfile-enforced install policy and validate the change in CI. Do not switch installation commands casually during unrelated feature work.

## Upstream evidence verification

External implementation records are verified during authoring, not by hitting upstream repositories on every CI run.

For an implementation update:

1. inspect the upstream repository directly;
2. resolve the exact branch/ref being inspected;
3. capture the full 40-character commit;
4. inspect the relevant code path at that commit;
5. inspect license metadata from the repository itself;
6. update `verifiedRef`, `verifiedCommit`, source paths, and `lastVerified` together;
7. run the local/CI validators.

This makes the archive reproducible without making builds dependent on GitHub availability.

## Vercel deployment model

The intended hosting target is Vercel because the application is a standard Next.js project.

A repository must have its own Vercel project. Do not deploy this code into an unrelated existing project merely to obtain a preview URL.

Once a dedicated project exists, the recommended flow is:

```text
main / pull request
      ↓
GitHub Actions validation
      ↓
Vercel preview deployment
      ↓
real-browser acceptance
      ↓
production promotion/deployment
      ↓
production smoke + visual/accessibility acceptance
```

## Vercel project setup

When creating the dedicated project:

- connect `anatwork14/foundation-algorithms-collection` as the Git repository;
- use the repository root as the project root;
- keep the detected Next.js framework settings unless a documented need requires an override;
- do not add environment variables unless the application actually requires them;
- enable preview deployments for review branches/pull requests;
- document the resulting production URL in the repository.

No Vercel project ID, token, or secret belongs in Git.

## Preview acceptance

A preview deployment should be reviewed in a real browser before marking visual or accessibility tasks complete.

Minimum matrix:

- phone viewport;
- tablet viewport;
- desktop viewport;
- light theme;
- dark theme;
- keyboard-only navigation;
- command palette open/search/close/focus return;
- long equations and wide tables;
- Algorithm, Atlas, Lab, Evidence, Claims, Replications, and chapter-reader routes.

Record acceptance separately from build status.

## Accessibility acceptance

Source-level accessibility precautions are necessary but insufficient.

Before production acceptance, verify:

- logical heading hierarchy;
- visible focus indicators;
- keyboard reachability of all controls;
- modal focus trapping and return focus;
- no keyboard traps outside intentional modal containment;
- sensible accessible names for icon-only controls;
- contrast in light and dark themes;
- reduced-motion behavior;
- table navigation/semantics;
- KaTeX/math screen-reader behavior;
- VoiceOver and/or NVDA behavior on representative routes.

Automated tooling can assist but does not replace the manual walkthrough.

## Visual acceptance

Check rendered behavior rather than only source CSS:

- canonical SVG logo at header and favicon scale;
- typography loading and fallback behavior;
- evidence badges and stage labels in both themes;
- long research titles;
- empty states;
- dense relation/evidence cards;
- search snippets;
- horizontal overflow for code, equations, and tables;
- mobile navigation and Evidence sub-navigation.

Do not remove legacy CSS merely because it looks unused in source; confirm rendered pages before cleanup.

## Production deployment

Production promotion should happen only after:

- GitHub Actions is green on the intended revision;
- preview build succeeds;
- critical browser routes are reviewed;
- blocking accessibility regressions are resolved;
- the production URL/domain is known.

After deployment:

1. request core routes from the public production URL;
2. verify static assets and fonts;
3. inspect runtime/build logs for unexpected errors;
4. repeat key keyboard interactions;
5. record the production URL and accepted revision in project documentation.

## Rollback

If a production release regresses:

- prefer promoting/rolling back to the last accepted deployment rather than patching unvalidated code directly in production;
- reproduce the regression on a preview branch;
- add a regression test when the failure is deterministic and testable;
- keep research-data corrections auditable in Git history.

## Release evidence

A release checkpoint should record at minimum:

```text
Git commit
GitHub Actions run
Preview deployment URL
Production deployment URL
Browser acceptance date
Known open limitations
```

Do not describe a release as “fully accepted” if deployment, browser, screen-reader, contrast, or research-evidence review remains open.

## Current deployment limitation

At the time this guide was added, the connected Vercel account had no dedicated project for this repository. Existing Vercel projects belonged to other applications, so this repository was intentionally **not** attached to an unrelated project.

Until a dedicated project exists, CI build and production-server smoke tests are valid engineering checkpoints, but preview/production and real-browser acceptance remain open.
