import { expect, test } from "@playwright/test";

test("upstream review registry summarizes append-only decisions", async ({ page }) => {
  await page.goto("/implementations/reviews");

  await expect(page.getByRole("heading", { name: "Review branch movement without rewriting evidence history." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Reviews" })).toHaveAttribute("aria-current", "page");
  const coverage = page.getByRole("region", { name: "Upstream review coverage" });
  await expect(coverage).toContainText("13review revisions");
  await expect(coverage).toContainText("13retain-pin decisions");

  const faissRecord = page.getByRole("article").filter({ hasText: "Faiss" });
  await expect(faissRecord).toContainText("Retain pin");
  await expect(faissRecord).toContainText("No material path change");
  await expect(faissRecord).toContainText("faiss/IndexHNSW.h · unchanged");
  await expect(faissRecord.getByRole("link", { name: /Compare commits/i })).toBeVisible();
  await expect(faissRecord.getByRole("link", { name: /Pinned faiss\/IndexHNSW\.h/i })).toBeVisible();
  await expect(faissRecord.getByRole("link", { name: /Observed faiss\/IndexHNSW\.cpp/i })).toBeVisible();
  await expect(faissRecord.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#faiss-hnsw-r1");

  const phaseRecord = page.getByRole("article").filter({ hasText: "Qiskit Phase Estimation" });
  await expect(phaseRecord).toContainText("Retain pin");
  await expect(phaseRecord).toContainText("qiskit/circuit/library/phase_estimation.py · unchanged");
  await expect(phaseRecord).toContainText("test/python/circuit/library/test_phase_estimation.py · unchanged");
  await expect(phaseRecord.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#qiskit-phase-estimation-r1");

  const qftRecord = page.getByRole("article").filter({ hasText: "Qiskit Quantum Fourier Transform" });
  await expect(qftRecord).toContainText("Retain pin");
  await expect(qftRecord).toContainText("qiskit/circuit/library/basis_change/qft.py · unchanged");
  await expect(qftRecord.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#qiskit-qft-r1");

  const adamwR1 = page.locator("#pytorch-adamw-r1");
  await expect(adamwR1).toContainText("torch/optim/adamw.py · unchanged");
  await expect(adamwR1.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#pytorch-adamw-r1");

  const adamwR2 = page.locator("#pytorch-adamw-r2");
  await expect(adamwR2).toContainText("torch/optim/adamw.py · unchanged");
  await expect(adamwR2).toContainText("b8ef86910433");
  await expect(adamwR2.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#pytorch-adamw-r2");

  const adamwR3 = page.locator("#pytorch-adamw-r3");
  await expect(adamwR3).toContainText("torch/optim/adamw.py · unchanged");
  await expect(adamwR3).toContainText("cf2cd3d06f83");
  await expect(adamwR3.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#pytorch-adamw-r3");

  const adamwR4 = page.locator("#pytorch-adamw-r4");
  await expect(adamwR4).toContainText("torch/optim/adamw.py · unchanged");
  await expect(adamwR4).toContainText("6b3607efa40b");
  await expect(adamwR4.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#pytorch-adamw-r4");

  const attentionR1 = page.locator("#pytorch-multihead-attention-r1");
  await expect(attentionR1).toContainText("torch/nn/modules/activation.py · unchanged");
  await expect(attentionR1.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#pytorch-multihead-attention-r1");

  const attentionR2 = page.locator("#pytorch-multihead-attention-r2");
  await expect(attentionR2).toContainText("torch/nn/modules/activation.py · unchanged");
  await expect(attentionR2).toContainText("b8ef86910433");
  await expect(attentionR2.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#pytorch-multihead-attention-r2");

  const attentionR3 = page.locator("#pytorch-multihead-attention-r3");
  await expect(attentionR3).toContainText("torch/nn/modules/activation.py · unchanged");
  await expect(attentionR3).toContainText("cf2cd3d06f83");
  await expect(attentionR3.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#pytorch-multihead-attention-r3");

  const attentionR4 = page.locator("#pytorch-multihead-attention-r4");
  await expect(attentionR4).toContainText("torch/nn/modules/activation.py · unchanged");
  await expect(attentionR4).toContainText("6b3607efa40b");
  await expect(attentionR4.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#pytorch-multihead-attention-r4");

  const z3Record = page.getByRole("article").filter({ hasText: "Z3 Theorem Prover" });
  await expect(z3Record).toContainText("src/solver/solver.cpp · unchanged");
  await expect(z3Record.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#z3-sat-smt-r1");

  const kalmanRecord = page.getByRole("article").filter({ hasText: "statsmodels Kalman Filter" });
  await expect(kalmanRecord).toContainText("statsmodels/tsa/statespace/kalman_filter.py · unchanged");
  await expect(kalmanRecord).toContainText("LICENSE.txt · unchanged");
  await expect(kalmanRecord.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#statsmodels-kalman-filter-r1");
});

test("upstream review registry filters by decision, material change, and source-path search", async ({ page }) => {
  await page.goto("/implementations/reviews");

  const decision = page.getByRole("combobox", { name: "Filter upstream reviews by decision" });
  const material = page.getByRole("combobox", { name: "Filter upstream reviews by material change" });
  const search = page.getByRole("searchbox", { name: "Search upstream implementation reviews" });

  await decision.selectOption("Needs follow-up");
  await expect(page.getByText("No matching upstream review.")).toBeVisible();

  await decision.selectOption("Retain pin");
  await material.selectOption("Changed");
  await expect(page.getByText("No matching upstream review.")).toBeVisible();

  await material.selectOption("Unchanged");
  await search.fill("IndexHNSW.cpp");
  await expect(page.getByRole("article").filter({ hasText: "Faiss" })).toBeVisible();

  await search.fill("phase_estimation.py");
  await expect(page.getByRole("article").filter({ hasText: "Qiskit Phase Estimation" })).toBeVisible();

  await search.fill("basis_change/qft.py");
  await expect(page.getByRole("article").filter({ hasText: "Qiskit Quantum Fourier Transform" })).toBeVisible();

  await search.fill("adamw.py");
  await expect(page.locator("#pytorch-adamw-r4")).toBeVisible();

  await search.fill("activation.py");
  await expect(page.locator("#pytorch-multihead-attention-r4")).toBeVisible();

  await search.fill("solver.cpp");
  await expect(page.getByRole("article").filter({ hasText: "Z3 Theorem Prover" })).toBeVisible();

  await search.fill("kalman_filter.py");
  await expect(page.getByRole("article").filter({ hasText: "statsmodels Kalman Filter" })).toBeVisible();
});

test("Evidence navigation reaches the upstream review registry", async ({ page }) => {
  await page.goto("/implementations");
  await page.getByRole("link", { name: "Reviews" }).click();
  await expect(page).toHaveURL(/\/implementations\/reviews$/);
  await expect(page.getByRole("heading", { name: "Review branch movement without rewriting evidence history." })).toBeVisible();
});
