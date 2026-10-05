import type { ImplementationRecord } from "./implementations.ts";

export type ImplementationUpstreamReviewDecision = "Retain pin" | "Advance pin" | "Needs follow-up";

export type ImplementationUpstreamReview = {
  implementationId: string;
  revision: number;
  reviewedAt: string;
  observedRef: string;
  observedCommit: string;
  pinnedCommit: string;
  decision: ImplementationUpstreamReviewDecision;
  materialChange: boolean;
  inspectedPaths: Array<{
    path: string;
    pinnedBlob: string;
    upstreamBlob: string;
    changed: boolean;
  }>;
  note: string;
};

export const implementationUpstreamReviews: ImplementationUpstreamReview[] = [
  {
    implementationId: "faiss-hnsw",
    revision: 1,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "b0074a3fa426027d9ff8575b44386d5922859ac9",
    pinnedCommit: "e7c44eb000bebb16f84be38a115caa5d333a8229",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "faiss/IndexHNSW.h",
        pinnedBlob: "ab13715b7be65308911a9e8696da99a2ba12ada4",
        upstreamBlob: "ab13715b7be65308911a9e8696da99a2ba12ada4",
        changed: false,
      },
      {
        path: "faiss/IndexHNSW.cpp",
        pinnedBlob: "424bf7ddeada5c3699f704e8f87b494a23429d16",
        upstreamBlob: "424bf7ddeada5c3699f704e8f87b494a23429d16",
        changed: false,
      },
    ],
    note: "Reviewed Faiss main after it moved two commits beyond the immutable HNSW evidence pin. The intervening work covered cuVS test quarantine and SuperKMeans/fp16 support; direct blob comparison shows IndexHNSW.h and IndexHNSW.cpp are byte-identical to the pinned snapshot. Retain the existing archive pin rather than advancing it solely because main moved.",
  },
  {
    implementationId: "qiskit-phase-estimation",
    revision: 1,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "91895b850b9f8ba466c4d4868af389e249a7c087",
    pinnedCommit: "a1c2c2e796ff265c59a916c49d09942b27eb0e28",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "qiskit/circuit/library/phase_estimation.py",
        pinnedBlob: "bf82f4be9ef4a51cb7aaa4607f4ddfb937ae3a85",
        upstreamBlob: "bf82f4be9ef4a51cb7aaa4607f4ddfb937ae3a85",
        changed: false,
      },
      {
        path: "test/python/circuit/library/test_phase_estimation.py",
        pinnedBlob: "324da96da1aba83eebdc7d9ac4e5b06f011c6c59",
        upstreamBlob: "324da96da1aba83eebdc7d9ac4e5b06f011c6c59",
        changed: false,
      },
    ],
    note: "Reviewed Qiskit main after it advanced two commits beyond the immutable phase-estimation evidence pin. The intervening changes are confined to C-language tests, including memory-leak cleanup, while direct blob comparison confirms both the phase_estimation.py implementation and its Python test suite are byte-identical to the pinned snapshot. Retain the existing archive pin rather than advancing verification for unrelated upstream movement.",
  },
  {
    implementationId: "qiskit-qft",
    revision: 1,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "91895b850b9f8ba466c4d4868af389e249a7c087",
    pinnedCommit: "a1c2c2e796ff265c59a916c49d09942b27eb0e28",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "qiskit/circuit/library/basis_change/qft.py",
        pinnedBlob: "edb42f01975157542287640de56ddd74839df49e",
        upstreamBlob: "edb42f01975157542287640de56ddd74839df49e",
        changed: false,
      },
    ],
    note: "Reviewed Qiskit main after it advanced beyond the immutable QFT evidence pin. Direct blob comparison confirms qft.py is byte-identical at the observed main revision, while the intervening commits are unrelated to this tracked QFT source. Retain the existing archive pin rather than advancing verification solely because the branch head moved.",
  },
  {
    implementationId: "pytorch-adamw",
    revision: 1,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "fc695b3ea18cb62d839658fd919217227a919855",
    pinnedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "torch/optim/adamw.py",
        pinnedBlob: "031f8540357d2c62c82b7111cd8b0924e6041510",
        upstreamBlob: "031f8540357d2c62c82b7111cd8b0924e6041510",
        changed: false,
      },
    ],
    note: "Reviewed PyTorch main after it advanced beyond the immutable AdamW evidence pin. Direct blob comparison confirms torch/optim/adamw.py is byte-identical at the observed main revision, including the explicit decoupled_weight_decay=True behavior tracked by the archive. Retain the existing pin rather than advancing verification for unrelated upstream movement.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 1,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "fc695b3ea18cb62d839658fd919217227a919855",
    pinnedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "torch/nn/modules/activation.py",
        pinnedBlob: "533de4fa590109fe189f05747ee8f8f744819192",
        upstreamBlob: "533de4fa590109fe189f05747ee8f8f744819192",
        changed: false,
      },
    ],
    note: "Reviewed PyTorch main after it advanced beyond the immutable MultiheadAttention evidence pin. The tracked activation.py blob is byte-identical at the observed main revision, so the archive's query/key/value projection and scaled-dot-product-attention implementation evidence has not materially changed. Retain the existing pin rather than advancing verification solely because main moved.",
  },
  {
    implementationId: "z3-sat-smt",
    revision: 1,
    reviewedAt: "2026-10-05",
    observedRef: "master",
    observedCommit: "0f985010a6dd3d263a4c0fc82afeaf5ef12adbc7",
    pinnedCommit: "ce305e38247a7b9c75953a47e5683ab7bd2bce87",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "src/solver/solver.cpp",
        pinnedBlob: "8dd352579fad471522c7aa383b3aa55e6311b9dd",
        upstreamBlob: "8dd352579fad471522c7aa383b3aa55e6311b9dd",
        changed: false,
      },
    ],
    note: "Reviewed Z3 master after it advanced beyond the immutable solver-interface evidence pin. Current upstream work includes optimizer search-bound changes, while direct blob comparison confirms src/solver/solver.cpp—the registry's inspected abstract solver interface—is byte-identical to the pinned snapshot. Retain the existing pin; broader Z3 subsystems may continue changing without implying this tracked interface evidence changed.",
  },
  {
    implementationId: "statsmodels-kalman-filter",
    revision: 1,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "15d85ecd4e9daa67820f7c8318e7c8d578b21d5f",
    pinnedCommit: "cc001c25997351ecbd0b04d2968a08106a04a71f",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "statsmodels/tsa/statespace/kalman_filter.py",
        pinnedBlob: "5b195f874c8344378bbbad74d0203b33480b5d83",
        upstreamBlob: "5b195f874c8344378bbbad74d0203b33480b5d83",
        changed: false,
      },
      {
        path: "LICENSE.txt",
        pinnedBlob: "47cd54eec489af242da0e1a9fe00f1ed15cf2e69",
        upstreamBlob: "47cd54eec489af242da0e1a9fe00f1ed15cf2e69",
        changed: false,
      },
    ],
    note: "Reviewed statsmodels main after it advanced beyond the immutable Kalman-filter evidence pin. The observed upstream changes concern VAR forecast/IRF argument validation; direct blob comparison confirms both the tracked KalmanFilter implementation and repository license are byte-identical to the pinned snapshot. Retain the existing pin rather than advancing verification for unrelated time-series changes.",
  },
  {
    implementationId: "pytorch-adamw",
    revision: 2,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "b8ef86910433c789ad8d22111e51c941283d05d7",
    pinnedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "torch/optim/adamw.py",
        pinnedBlob: "031f8540357d2c62c82b7111cd8b0924e6041510",
        upstreamBlob: "031f8540357d2c62c82b7111cd8b0924e6041510",
        changed: false,
      },
    ],
    note: "Reviewed PyTorch main again after it advanced two commits beyond the prior review head through automated torchtitan and audio dependency-hash updates. Direct blob comparison confirms torch/optim/adamw.py is still byte-identical to the immutable evidence pin. Retain the existing archive pin rather than advancing verification for unrelated repository movement.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 2,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "b8ef86910433c789ad8d22111e51c941283d05d7",
    pinnedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "torch/nn/modules/activation.py",
        pinnedBlob: "533de4fa590109fe189f05747ee8f8f744819192",
        upstreamBlob: "533de4fa590109fe189f05747ee8f8f744819192",
        changed: false,
      },
    ],
    note: "Reviewed PyTorch main again after it advanced two commits beyond the prior review head through automated torchtitan and audio dependency-hash updates. Direct blob comparison confirms torch/nn/modules/activation.py is still byte-identical to the immutable MultiheadAttention evidence pin. Retain the existing archive pin rather than advancing verification for unrelated repository movement.",
  },
];

export function validateImplementationUpstreamReviews(
  reviews: ImplementationUpstreamReview[],
  implementations: ImplementationRecord[],
) {
  const errors: string[] = [];
  const implementationIds = new Set(implementations.map((record) => record.id));
  const grouped = new Map<string, ImplementationUpstreamReview[]>();

  for (const review of reviews) {
    if (!implementationIds.has(review.implementationId)) {
      errors.push(`Upstream review references unknown implementation ${review.implementationId}`);
    }
    if (!Number.isInteger(review.revision) || review.revision < 1) {
      errors.push(`${review.implementationId}: upstream-review revision must be a positive integer`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt)) {
      errors.push(`${review.implementationId} r${review.revision}: reviewedAt must use YYYY-MM-DD`);
    }
    if (!review.observedRef.trim()) {
      errors.push(`${review.implementationId} r${review.revision}: observedRef is required`);
    }
    if (!/^[0-9a-f]{40}$/i.test(review.observedCommit)) {
      errors.push(`${review.implementationId} r${review.revision}: observedCommit must be a full 40-character Git SHA`);
    }
    if (!/^[0-9a-f]{40}$/i.test(review.pinnedCommit)) {
      errors.push(`${review.implementationId} r${review.revision}: pinnedCommit must be a full 40-character Git SHA`);
    }
    if (!review.note.trim()) {
      errors.push(`${review.implementationId} r${review.revision}: review note is required`);
    }
    if (!review.inspectedPaths.length) {
      errors.push(`${review.implementationId} r${review.revision}: at least one inspected path is required`);
    }
    for (const inspected of review.inspectedPaths) {
      if (!inspected.path.trim()) {
        errors.push(`${review.implementationId} r${review.revision}: inspected path is required`);
      }
      if (!/^[0-9a-f]{40}$/i.test(inspected.pinnedBlob) || !/^[0-9a-f]{40}$/i.test(inspected.upstreamBlob)) {
        errors.push(`${review.implementationId} r${review.revision}: inspected blobs must be full 40-character Git SHAs`);
      }
      const actuallyChanged = inspected.pinnedBlob.toLowerCase() !== inspected.upstreamBlob.toLowerCase();
      if (inspected.changed !== actuallyChanged) {
        errors.push(`${review.implementationId} r${review.revision}: ${inspected.path} changed flag does not match blob identity`);
      }
    }

    const entries = grouped.get(review.implementationId) ?? [];
    entries.push(review);
    grouped.set(review.implementationId, entries);
  }

  for (const [implementationId, entries] of grouped) {
    entries.sort((a, b) => a.revision - b.revision);
    for (let index = 0; index < entries.length; index += 1) {
      const expectedRevision = index + 1;
      if (entries[index].revision !== expectedRevision) {
        errors.push(`${implementationId}: upstream-review revisions must be contiguous from 1; expected ${expectedRevision}, found ${entries[index].revision}`);
      }
      if (index > 0 && entries[index - 1].reviewedAt > entries[index].reviewedAt) {
        errors.push(`${implementationId}: upstream-review dates must be nondecreasing by revision`);
      }
    }
  }

  return errors;
}

export function upstreamReviewsForImplementation(implementationId: string) {
  return implementationUpstreamReviews
    .filter((review) => review.implementationId === implementationId)
    .sort((a, b) => a.revision - b.revision);
}

export function latestUpstreamReviewForImplementation(implementationId: string) {
  return upstreamReviewsForImplementation(implementationId).at(-1) ?? null;
}

export function implementationUpstreamReviewSearchText(
  review: ImplementationUpstreamReview,
  implementationName = "",
) {
  return [
    implementationName,
    review.implementationId,
    review.revision.toString(),
    review.decision,
    review.reviewedAt,
    review.observedRef,
    review.observedCommit,
    review.pinnedCommit,
    review.note,
    review.materialChange ? "material change changed" : "no material change unchanged",
    ...review.inspectedPaths.flatMap((item) => [
      item.path,
      item.pinnedBlob,
      item.upstreamBlob,
      item.changed ? "changed" : "unchanged",
    ]),
  ].join(" ").toLowerCase();
}

export function implementationUpstreamReviewState(
  review: ImplementationUpstreamReview | null,
  upstreamCommit: string | null,
) {
  if (!upstreamCommit) return null;
  if (!review || review.observedCommit.toLowerCase() !== upstreamCommit.toLowerCase()) return "Review available";
  if (review.decision === "Retain pin") return "Reviewed — retain pin";
  if (review.decision === "Advance pin") return "Reviewed — advance pin";
  return "Reviewed — needs follow-up";
}
