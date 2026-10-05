import { aiImplementationVerificationAdditions } from "./implementation-verification-ai-additions.ts";
import { banditImplementationVerificationAdditions } from "./implementation-verification-bandit-additions.ts";
import { conformalImplementationVerificationAdditions } from "./implementation-verification-conformal-additions.ts";
import { implementationVerificationFreshnessAdditions } from "./implementation-verification-freshness-additions.ts";
import { foundationsImplementationVerificationAdditions } from "./implementation-verification-foundations-additions.ts";
import { qsvtImplementationVerificationAdditions } from "./implementation-verification-qsvt-additions.ts";
import {
  implementationVerificationHistory as coreImplementationVerificationHistory,
  type ImplementationVerificationEntry,
} from "./implementation-verification-history.ts";

/** Canonical verification catalog. Historical entries remain in their original
 * files while newer domain and freshness additions compose here. */
export const implementationVerificationHistory: ImplementationVerificationEntry[] = [
  ...coreImplementationVerificationHistory,
  ...foundationsImplementationVerificationAdditions,
  ...conformalImplementationVerificationAdditions,
  ...qsvtImplementationVerificationAdditions,
  ...banditImplementationVerificationAdditions,
  ...aiImplementationVerificationAdditions,
  ...implementationVerificationFreshnessAdditions,
];

export function verificationHistoryForImplementation(implementationId: string) {
  return implementationVerificationHistory
    .filter((entry) => entry.implementationId === implementationId)
    .sort((a, b) => a.revision - b.revision);
}