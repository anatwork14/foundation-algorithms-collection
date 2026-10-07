import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification history for foundational implementation-gap anchors. */
export const foundationalGapImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "fplll-lattice-reduction",
    revision: 1,
    verifiedAt: "2026-10-07",
    verifiedRef: "master",
    verifiedCommit: "a48096bbd19792eed4267025f924b5095f079e29",
    sourcePaths: [
      { label: "LLL implementation", url: "https://github.com/fplll/fplll/blob/a48096bbd19792eed4267025f924b5095f079e29/fplll/lll.cpp" },
      { label: "BKZ implementation", url: "https://github.com/fplll/fplll/blob/a48096bbd19792eed4267025f924b5095f079e29/fplll/bkz.cpp" },
      { label: "LLL tests", url: "https://github.com/fplll/fplll/blob/a48096bbd19792eed4267025f924b5095f079e29/tests/test_lll.cpp" },
      { label: "BKZ tests", url: "https://github.com/fplll/fplll/blob/a48096bbd19792eed4267025f924b5095f079e29/tests/test_bkz.cpp" },
      { label: "Repository license", url: "https://github.com/fplll/fplll/blob/a48096bbd19792eed4267025f924b5095f079e29/COPYING" },
    ],
    note: "Initial fplll lattice-reduction evidence snapshot. Direct inspection covers LLL and BKZ implementation paths plus their dedicated tests and LGPL-2.1-or-later license. The snapshot supports executable lattice-reduction mechanics and research/attack-cost tooling; it does not convert a reduction run into a security conclusion for a particular cryptographic parameter set.",
  },
  {
    implementationId: "galois-classical-codes",
    revision: 1,
    verifiedAt: "2026-10-07",
    verifiedRef: "main",
    verifiedCommit: "0243840b44e39713dec1f9d48d4faa7581306b3d",
    sourcePaths: [
      { label: "BCH implementation", url: "https://github.com/mhostetter/galois/blob/0243840b44e39713dec1f9d48d4faa7581306b3d/src/galois/_codes/_bch.py" },
      { label: "Reed–Solomon implementation", url: "https://github.com/mhostetter/galois/blob/0243840b44e39713dec1f9d48d4faa7581306b3d/src/galois/_codes/_reed_solomon.py" },
      { label: "BCH tests", url: "https://github.com/mhostetter/galois/blob/0243840b44e39713dec1f9d48d4faa7581306b3d/tests/codes/test_bch.py" },
      { label: "Reed–Solomon tests", url: "https://github.com/mhostetter/galois/blob/0243840b44e39713dec1f9d48d4faa7581306b3d/tests/codes/test_reed_solomon.py" },
      { label: "Repository license", url: "https://github.com/mhostetter/galois/blob/0243840b44e39713dec1f9d48d4faa7581306b3d/LICENSE" },
    ],
    note: "Initial galois classical-coding evidence snapshot. The pinned BCH and Reed–Solomon modules implement algebraic finite-field codes with dedicated encode/decode tests, shortened/systematic variants, and parameter validation. The snapshot is scoped to classical algebraic coding and does not stand in for quantum surface-code decoding or every coding family represented by the archive.",
  },
];
