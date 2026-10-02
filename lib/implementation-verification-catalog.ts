import { foundationsImplementationVerificationAdditions } from "@/lib/implementation-verification-foundations-additions";
import {
  implementationVerificationHistory as coreImplementationVerificationHistory,
  type ImplementationVerificationEntry,
} from "@/lib/implementation-verification-history";

/** Canonical verification catalog. Historical entries remain in their original
 * file while newer domain additions compose here. */
export const implementationVerificationHistory: ImplementationVerificationEntry[] = [
  ...coreImplementationVerificationHistory,
  ...foundationsImplementationVerificationAdditions,
];

export function verificationHistoryForImplementation(implementationId: string) {
  return implementationVerificationHistory
    .filter((entry) => entry.implementationId === implementationId)
    .sort((a, b) => a.revision - b.revision);
}
