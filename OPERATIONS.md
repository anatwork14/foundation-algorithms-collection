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

### 3. Canonical UI contract

```bash
npm run check:ui
```

This protects the shared visual/accessibility system at source level, including:

- canonical typography/theme/control contracts;
- the final `research-ui.css` cascade position;
- removal of deprecated visual layers;
- theme-control integration;
- header and Atlas accessibility semantics;
- long-equation containment;
- AA-capable metadata contrast tokens;
- the single-column tablet Research-fields index that prevents the legacy two-column card layout from returning.

This check catches deterministic source drift, but it is not a rendered-browser test.

### 4. Research utility tests

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

### 5. TypeScript

```bash
npm run typecheck
```

Strict typechecking protects schema and UI integration but does not validate research semantics.

### 6. Production build

```bash
npm run build
```

The Next.js build exercises static route generation and the project-wide research-integrity assertions.

A build failure caused by research validation should be fixed in the data or validator logic; do not disable validation to force a build through.

### 7. Chromium browser acceptance

```bash
npm run test:acceptance
```

Playwright starts the production Next.js server and runs Chromium against the built application. The acceptance suite currently checks:

- representative routes at desktop, tablet, and phone widths;
- both explicit light and dark themes;
- page-level horizontal overflow;
- long equation/table/code containment;
- command-palette keyboard operation and focus restoration;
- mobile navigation state/current-page/Escape behavior;
- automated axe WCAG A/AA checks on representative routes;
- representative full-page visual-review snapshots.

The viewport matrix intentionally includes the 820px tablet band because a legacy two-column Research-fields rule previously produced a 1102px document width there. That regression is now covered by both browser acceptance and the source-level UI contract.

Automated Chromium acceptance is a release gate, but it does **not** replace physical-device testing or real screen-reader testing.

### 8. Production route smoke test

CI launches the production Next.js server and requests representative index/detail/provenance routes.

This proves those server routes answer successfully in the CI environment. It complements, rather than replaces, the browser suite.

## GitHub Actions

The workflow lives in `.github/workflows/ci.yml` and runs on pushes to `main` and pull requests.

A healthy checkpoint requires the single `web` job to pass all of:

```text
Install dependencies
Install Chromium
Check Markdown links
Check source hygiene
Check UI consistency
Test research utilities
Typecheck
Build
Browser acceptance
Production route smoke test
```

The browser step produces an HTML Playwright report and representative visual snapshots. CI retains `playwright-report/` and `test-results/` as a `browser-acceptance` artifact for 14 days on both successful and failed runs so rendered evidence can be reviewed after the job completes.

When diagnosing a failure, inspect the first failed step rather than assuming a later build problem. Browser overflow failures report the largest DOM elements extending outside the viewport, which makes layout regressions directly actionable.

## Dependency installation

CI currently uses `npm install` with the committed lockfile/package metadata and provisions Chromium through Playwright.

If dependency reproducibility becomes a release blocker, migrate deliberately to a stricter lockfile-enforced install policy and validate the change in CI. Do not switch installation commands casually during unrelated feature work.

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

The repository has its own Vercel project:

- project: `foundation-algorithms-collection`;
- framework: Next.js;
- production alias: `https://foundation-algorithms-collection.vercel.app`.

Pushes to `main` create production deployments through the repository integration. GitHub Actions remains an independent validation gate; a Vercel `READY` deployment is not by itself evidence that research, interaction, or accessibility acceptance passed.

The practical flow is now:

```text
main / pull request
      ↓
GitHub Actions static + research validation
      ↓
production Next.js build
      ↓
Chromium responsive/theme/a11y acceptance
      ↓
Vercel deployment
      ↓
runtime-error check + manual AT/device review when required
```

No Vercel project ID, token, or secret belongs in Git.

## Browser acceptance matrix

Automated Chromium acceptance covers:

- desktop: 1440 × 1000;
- tablet: 820 × 1180;
- phone: 390 × 844;
- light theme;
- dark theme;
- homepage, long-form chapter, Algorithm detail, Atlas, and Evidence as representative responsive routes;
- all major index/workspace routes for desktop page-level overflow;
- keyboard-driven command palette and mobile navigation;
- long equations, wide tables, and technical scrollers;
- axe WCAG A/AA checks on representative routes.

Representative full-page screenshots are attached to the retained CI artifact for:

- homepage in light/dark at desktop/tablet/phone;
- LinUCB chapter at desktop light and phone dark;
- Atlas at desktop light and phone dark;
- Evidence at desktop light and phone dark.

These snapshots are review evidence, not pixel-diff baselines. If the visual language stabilizes enough to justify strict screenshot regression testing, add baselines deliberately rather than treating normal text rendering differences as failures.

## Accessibility acceptance

Source-level precautions and automated axe scans are necessary but insufficient.

Automated coverage now verifies visible browser structure, keyboard interactions, focus return, responsive containment, and common WCAG A/AA rule violations. Before declaring accessibility fully accepted, still perform representative manual checks for:

- VoiceOver and/or NVDA announcements;
- mathematical expression reading behavior;
- complex Atlas relationship navigation with assistive technology;
- table semantics with a screen reader;
- physical-device zoom/text scaling where relevant;
- any interaction whose meaning depends on timing or spatial context.

## Visual acceptance

Rendered behavior is now exercised continuously in Chromium and representative screenshots are retained from CI. Review those artifacts for:

- canonical SVG logo at header scale;
- Fraunces / Source Sans 3 / JetBrains Mono role consistency;
- light/dark surface balance;
- long research titles;
- empty states;
- dense relationship/evidence surfaces;
- search snippets;
- responsive Research-fields editorial index;
- horizontal containment for code, equations, and tables;
- mobile navigation and Evidence sub-navigation.

Physical-device visual review remains useful for OS font rendering, touch ergonomics, browser chrome, and viewport behavior that headless Chromium cannot model perfectly.

## Production deployment

A production checkpoint should require:

- GitHub Actions green on the intended revision;
- Chromium acceptance green;
- Vercel deployment `READY`;
- no blocking runtime errors;
- unresolved manual AT/device limitations documented rather than silently treated as passed.

After deployment:

1. confirm the production alias resolves to the intended revision;
2. inspect Vercel runtime errors/logs when relevant;
3. use retained browser artifacts for rendered review;
4. repeat manual screen-reader/physical-device checks for major interaction or design changes;
5. record accepted revision and remaining limitations in project documentation.

## Rollback

If a production release regresses:

- prefer promoting/rolling back to the last accepted deployment rather than patching unvalidated code directly in production;
- reproduce the regression in the Playwright acceptance matrix when possible;
- add a deterministic regression assertion before fixing the source;
- keep research-data corrections auditable in Git history.

## Release evidence

A release checkpoint should record at minimum:

```text
Git commit
GitHub Actions run
Vercel deployment/revision
Browser acceptance result
Visual artifact availability
Known manual AT/device limitations
```

Do not describe a release as “fully accessibility accepted” if VoiceOver/NVDA or required physical-device review remains open. Automated browser and axe success are strong engineering evidence, but they are not substitutes for assistive-technology evaluation.
