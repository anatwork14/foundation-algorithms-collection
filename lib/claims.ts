import { attentionClaimAdditions } from "./claim-attention-additions.ts";
import { generativeClaimAdditions } from "./claim-generative-additions.ts";
import { foundationalClaimAdditions } from "./claim-foundational-additions.ts";
import { quantumClaimAdditions } from "./claim-quantum-additions.ts";
import { searchClaimAdditions } from "./claim-search-additions.ts";
import { claims as baseClaims } from "./claims-base.ts";
import type { ClaimRecord } from "./claims-base.ts";

export type { ClaimKind, ClaimRecord } from "./claims-base.ts";

export const claims: ClaimRecord[] = [...baseClaims, ...attentionClaimAdditions, ...foundationalClaimAdditions, ...generativeClaimAdditions, ...quantumClaimAdditions, ...searchClaimAdditions];

const byId = new Map(claims.map((claim) => [claim.id, claim]));

export function getClaim(id: string) {
  return byId.get(id) ?? null;
}

export function claimsForAlgorithm(algorithmId: string) {
  return claims.filter((claim) => claim.algorithmIds.includes(algorithmId));
}

export function claimsForReference(referenceId: string) {
  return claims.filter((claim) => claim.referenceIds.includes(referenceId));
}

export function claimSearchText(claim: ClaimRecord) {
  return [claim.statement, claim.kind, claim.note, ...claim.algorithmIds, ...claim.referenceIds].join(" ").toLowerCase();
}
