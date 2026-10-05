import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification history for attention-system implementations. */
export const attentionImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "dao-flash-attention-2",
    revision: 1,
    verifiedAt: "2026-10-05",
    verifiedRef: "main",
    verifiedCommit: "3451a2a67a24eeed8af54d3c5b8d219577113797",
    sourcePaths: [
      { label: "FA2 package exports", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/flash_attn/__init__.py" },
      { label: "FA2 public interface", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/flash_attn/flash_attn_interface.py" },
      { label: "FA2 canonical tests", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/tests/test_flash_attn.py" },
      { label: "Repository README", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/README.md" },
      { label: "Repository license", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/LICENSE" },
    ],
    note: "Initial FlashAttention-2 evidence snapshot. The pinned v2.8.4 package exports dense, packed-QKV/KV, variable-length, and KV-cache interfaces; direct inspection of the public interface confirms GPU-kernel dispatch with causal/local masking, softmax scaling, soft-capping, dropout, and ALiBi options where supported. The canonical pinned tests build a PyTorch reference attention and exercise exported interfaces, masks, padding, shapes, gradients, and inference-oriented paths on supported GPU configurations. This snapshot is explicitly scoped to FlashAttention-2 rather than the repository's separate FlashAttention-3/4 paths, and preserves the documented PyTorch, CUDA/ROCm, GPU-family, dtype, and backend-specific support constraints together with the BSD-3-Clause license.",
  },
];