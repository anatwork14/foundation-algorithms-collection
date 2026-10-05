import type { ImplementationRecord } from "./implementations.ts";

/** Attention-system implementation records kept modular from the historical registry. */
export const attentionImplementationAdditions: ImplementationRecord[] = [
  {
    id: "dao-flash-attention-2",
    name: "FlashAttention-2",
    repository: "https://github.com/Dao-AILab/flash-attention",
    homepage: "https://github.com/Dao-AILab/flash-attention",
    algorithmIds: ["transformer-attention"],
    language: "Python / CUDA / ROCm",
    interfaces: ["Python API", "flash_attn_func", "Packed QKV/KV", "Variable-length attention", "KV-cache inference"],
    license: "BSD-3-Clause",
    maturity: "Established open-source",
    summary: "The official FlashAttention package exposes FlashAttention-2 exact-attention kernels through dense, packed, variable-length, and KV-cache Python APIs backed by CUDA or supported ROCm implementations.",
    implementationNotes: [
      "The pinned package identifies itself as version 2.8.4 and exports flash_attn_func together with packed-QKV/KV, variable-length, and KV-cache interfaces from the FlashAttention-2 implementation surface.",
      "The public interface dispatches exact attention to GPU kernels while preserving options such as causal masking, local windows, softmax scaling, soft-capping, dropout, and ALiBi slopes where supported; this record is scoped to the FA2 package surface rather than the separate FlashAttention-3 or FlashAttention-4 paths in the repository.",
      "The pinned canonical test suite constructs a PyTorch reference-attention implementation and exercises the exported dense, packed, variable-length, and KV-cache APIs across shapes, masks, padding, causal/local behavior, and gradients on supported GPU configurations.",
      "Hardware and toolchain support is implementation-specific: the pinned README documents PyTorch 2.2+, CUDA or ROCm toolchains, CUDA 12+ for FA2 on supported Ampere/Ada/Hopper GPUs, and ROCm 6+ with backend-specific AMD GPU and feature support. Those constraints are preserved rather than generalized into a universal attention guarantee.",
      "Dao et al. 2022 remains the primary IO-aware exact-attention method source and Dao 2024 the FlashAttention-2 work-partitioning extension; this executable snapshot does not treat benchmark speedups from either paper as guaranteed on arbitrary hardware or workloads.",
    ],
    sourcePaths: [
      { label: "FA2 package exports", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/flash_attn/__init__.py" },
      { label: "FA2 public interface", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/flash_attn/flash_attn_interface.py" },
      { label: "FA2 canonical tests", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/tests/test_flash_attn.py" },
      { label: "Repository README", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/README.md" },
      { label: "Repository license", url: "https://github.com/Dao-AILab/flash-attention/blob/3451a2a67a24eeed8af54d3c5b8d219577113797/LICENSE" },
    ],
    verifiedRef: "main",
    verifiedCommit: "3451a2a67a24eeed8af54d3c5b8d219577113797",
    lastVerified: "2026-10-05",
  },
];