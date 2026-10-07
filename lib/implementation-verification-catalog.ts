import { aiImplementationVerificationAdditions } from "./implementation-verification-ai-additions.ts";
import { banditImplementationVerificationAdditions } from "./implementation-verification-bandit-additions.ts";
import { conformalImplementationVerificationAdditions } from "./implementation-verification-conformal-additions.ts";
import { implementationVerificationFreshnessAdditions } from "./implementation-verification-freshness-additions.ts";
import { foundationsImplementationVerificationAdditions } from "./implementation-verification-foundations-additions.ts";
import { foundationalClaimImplementationVerificationAdditions } from "./implementation-verification-foundational-claim-additions.ts";
import { foundationalGapImplementationVerificationAdditions } from "./implementation-verification-foundational-gap-additions.ts";
import { generativeImplementationVerificationAdditions } from "./implementation-verification-generative-additions.ts";
import { qsvtImplementationVerificationAdditions } from "./implementation-verification-qsvt-additions.ts";
import { quantumImplementationVerificationAdditions } from "./implementation-verification-quantum-additions.ts";
import { searchImplementationVerificationAdditions } from "./implementation-verification-search-additions.ts";
import { securityImplementationVerificationAdditions } from "./implementation-verification-security-additions.ts";
import {
  implementationVerificationHistory as coreImplementationVerificationHistory,
  type ImplementationVerificationEntry,
} from "./implementation-verification-history.ts";

/** Canonical verification catalog. Historical entries remain in their original
 * files while newer domain and freshness additions compose here. */
export const implementationVerificationHistory: ImplementationVerificationEntry[] = [
  ...coreImplementationVerificationHistory,
  ...foundationsImplementationVerificationAdditions,
  ...foundationalClaimImplementationVerificationAdditions,
  ...foundationalGapImplementationVerificationAdditions,
  ...generativeImplementationVerificationAdditions,
  ...conformalImplementationVerificationAdditions,
  ...qsvtImplementationVerificationAdditions,
  ...quantumImplementationVerificationAdditions,
  ...searchImplementationVerificationAdditions,
  ...securityImplementationVerificationAdditions,
  ...banditImplementationVerificationAdditions,
  ...aiImplementationVerificationAdditions,
  ...implementationVerificationFreshnessAdditions,
];

export function verificationHistoryForImplementation(implementationId: string) {
  return implementationVerificationHistory
    .filter((entry) => entry.implementationId === implementationId)
    .sort((a, b) => a.revision - b.revision);
}