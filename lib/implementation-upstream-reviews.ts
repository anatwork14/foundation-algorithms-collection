import type { ImplementationRecord } from "./implementations.ts";
import {
  implementationUpstreamReviews as baseImplementationUpstreamReviews,
} from "./implementation-upstream-reviews-base.ts";
import type { ImplementationUpstreamReview } from "./implementation-upstream-reviews-base.ts";
import { implementationUpstreamReviewFollowups } from "./implementation-upstream-review-followups.ts";

export type {
  ImplementationUpstreamReview,
  ImplementationUpstreamReviewDecision,
} from "./implementation-upstream-reviews-base.ts";

export const implementationUpstreamReviews: ImplementationUpstreamReview[] = [
  ...baseImplementationUpstreamReviews,
  ...implementationUpstreamReviewFollowups,
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
