export type ClaimKind = "Mechanism" | "Assumption" | "Guarantee" | "Standard" | "Empirical";

export type ClaimRecord = {
  id: string;
  kind: ClaimKind;
  statement: string;
  algorithmIds: string[];
  chapterSlug: string;
  passageContains: string;
  referenceIds: string[];
  note: string;
};

/**
 * Claims are deliberately curated. `passageContains` is a unique literal
 * selector into the generated passage index; build validation rejects selectors
 * that match zero or multiple passages.
 */
export const claims: ClaimRecord[] = [
  {
    id: "linucb-optimistic-contextual-score",
    kind: "Mechanism",
    statement: "LinUCB combines a linear predicted reward with an uncertainty bonus and selects the candidate with the highest optimistic score.",
    algorithmIds: ["linucb"],
    chapterSlug: "08-bandits-contextual-bandits-linucb",
    passageContains: "The algorithm therefore selects actions that have either",
    referenceIds: ["li-2010-contextual-bandit-news"],
    note: "This record describes the mechanism summarized in the collection; the linked paper is the primary LinUCB application/source curated by the archive.",
  },
  {
    id: "hnsw-hierarchical-navigation",
    kind: "Mechanism",
    statement: "HNSW organizes proximity search into multiple graph layers, using sparse upper layers for long-range navigation and denser lower layers for local refinement.",
    algorithmIds: ["hnsw"],
    chapterSlug: "06-representation-similarity-compression-parsing",
    passageContains: "HNSW builds multiple graph layers. Higher layers contain progressively fewer nodes",
    referenceIds: ["malkov-2018-hnsw"],
    note: "The claim is limited to the hierarchy/navigation mechanism; recall/latency performance remains workload- and parameter-dependent.",
  },
  {
    id: "ml-kem-fips203-parameter-sets",
    kind: "Standard",
    statement: "NIST FIPS 203 specifies the standardized ML-KEM-512, ML-KEM-768, and ML-KEM-1024 parameter sets.",
    algorithmIds: ["ml-kem"],
    chapterSlug: "31-post-quantum-cryptography",
    passageContains: "NIST FIPS 203 defines ML-KEM-512, ML-KEM-768, and ML-KEM-1024 parameter sets",
    referenceIds: ["nist-2024-fips203"],
    note: "This is a normative-standard claim and should track FIPS 203 rather than an implementation repository.",
  },
];

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
