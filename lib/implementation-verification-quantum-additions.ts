import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification history for quantum error-correction implementations. */
export const quantumImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "lange-gnn-surface-code-decoder",
    revision: 1,
    verifiedAt: "2026-10-07",
    verifiedRef: "main",
    verifiedCommit: "15d8443bedf7862ef72ec1b5239ecd01163eb8d6",
    sourcePaths: [
      { label: "Decoder training and simulation", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/src/decoder.py" },
      { label: "GNN model", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/src/gnn_models.py" },
      { label: "Syndrome sampling", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/src/graph_representation.py" },
      { label: "Distance-3 surface-code config", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/config_surface_codes_3_3.yaml" },
      { label: "Distance-9 surface-code config", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/config_surface_codes_9_3.yaml" },
      { label: "Training entrypoint", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/train_nn.py" },
      { label: "Circuit-level distance-3 checkpoint", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/models/circuit_level_noise/d3/d3_d_t_3.pt" },
      { label: "Repository README", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/README.md" },
      { label: "Repository license", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/LICENSE" },
    ],
    note: "Initial executable-evidence snapshot for the authors' GNN surface-code decoder. Direct inspection confirms Stim-generated rotated surface-code detector samples, explicit conversion of detection events into k-nearest-neighbor PyTorch Geometric graphs with inverse-distance edge weights, a GraphConv/global-pooling logical-class classifier, YAML-driven training and testing, persistence/reload paths, and shipped circuit-level model checkpoints. The repository is MIT-licensed but does not expose a standalone automated test suite at the pinned head, so this record is classified Research/prototyping and does not treat the paper's reported logical-error performance as independently reproduced by the archive.",
  },
  {
    implementationId: "qiskit-amplitude-estimation",
    revision: 1,
    verifiedAt: "2026-10-07",
    verifiedRef: "main",
    verifiedCommit: "bcb7ded3594dac02e14acce7f59f05976916d39d",
    sourcePaths: [
      { label: "Canonical amplitude-estimation implementation", url: "https://github.com/qiskit-community/qiskit-algorithms/blob/bcb7ded3594dac02e14acce7f59f05976916d39d/qiskit_algorithms/amplitude_estimators/ae.py" },
      { label: "Estimation problem and Grover-operator construction", url: "https://github.com/qiskit-community/qiskit-algorithms/blob/bcb7ded3594dac02e14acce7f59f05976916d39d/qiskit_algorithms/amplitude_estimators/estimation_problem.py" },
      { label: "Amplitude-estimator tests", url: "https://github.com/qiskit-community/qiskit-algorithms/blob/bcb7ded3594dac02e14acce7f59f05976916d39d/test/test_amplitude_estimators.py" },
      { label: "Repository license", url: "https://github.com/qiskit-community/qiskit-algorithms/blob/bcb7ded3594dac02e14acce7f59f05976916d39d/LICENSE.txt" },
    ],
    note: "Initial Qiskit Algorithms canonical amplitude-estimation evidence snapshot. Direct inspection confirms PhaseEstimation is constructed from the EstimationProblem Grover operator, state preparation is composed into the circuit, and the evaluation register is measured when requested. EstimationProblem can synthesize the Grover operator from objective qubits and state preparation. Canonical tests cover finite-shot Bernoulli estimates and manually reconstruct controlled Grover powers plus inverse QFT before asserting unitary equality with the generated QAE circuit. The shared suite also tests iterative/likelihood variants, but this record is deliberately scoped to the canonical phase-estimation-based AmplitudeEstimation class and does not claim practical quantum advantage.",
  },
];
