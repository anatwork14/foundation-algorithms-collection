import type { AlgorithmEntity } from "@/lib/algorithms";

/** Quantum-algorithm entities that extend the historical core catalog. */
export const quantumAlgorithmAdditions: AlgorithmEntity[] = [
  {
    id: "amplitude-estimation",
    name: "Quantum Amplitude Estimation",
    aliases: ["Amplitude Estimation", "QAE", "Canonical amplitude estimation"],
    fields: ["Quantum"],
    families: ["Quantum estimation", "Amplitude methods", "Monte Carlo"],
    chapterSlugs: ["21-quantum-search-fourier-phase-estimation"],
    summary: "Estimate a target success probability encoded as a quantum amplitude by applying phase estimation to an amplitude-amplification operator.",
    motivation: "Naive sampling needs many independent repetitions to resolve small additive errors, while coherent quantum queries can encode the target probability in an eigenphase.",
    contribution: "Canonical amplitude estimation combines amplitude amplification with quantum phase estimation to obtain a quadratic query-complexity improvement over classical Monte Carlo under idealized state-preparation and oracle assumptions.",
    assumptions: [
      "A coherent state-preparation circuit encodes the target probability in designated good states",
      "The associated Grover/amplitude-amplification operator and controlled powers can be implemented",
      "Coherent depth and fault-tolerant resources are sufficient for the desired precision",
    ],
    complexity: {
      note: "Canonical QAE reaches additive error on the order of ε with O(1/ε) uses of the amplitude-amplification operator in the idealized query model, versus O(1/ε²) classical sampling; state preparation, oracle synthesis, and fault tolerance can dominate end-to-end cost.",
    },
    maturity: "Established foundation",
    implementation: [
      "Prepare the state A|0⟩ whose good-state probability is the target amplitude",
      "Construct the Grover/amplitude-amplification operator Q from state preparation and good-state reflections",
      "Run phase estimation on Q using an evaluation register and controlled powers of Q",
      "Apply inverse-QFT or equivalent phase readout",
      "Map the measured phase to an amplitude estimate, optionally refining it with likelihood-based post-processing",
    ],
    failureModes: [
      "Deep controlled powers make canonical QAE expensive on noisy or early fault-tolerant hardware",
      "State-preparation and oracle costs can erase the abstract query advantage",
      "Finite phase grids introduce discretization error before post-processing",
      "Modern iterative or likelihood-based variants change the circuit-depth/shot tradeoff and should not inherit canonical-resource claims automatically",
    ],
    relations: [
      {
        target: "grover-search",
        type: "depends-on",
        note: "Canonical amplitude estimation applies phase estimation to a Grover/amplitude-amplification operator built from the state preparation and good-state reflection.",
      },
      {
        target: "quantum-phase-estimation",
        type: "depends-on",
        note: "Canonical QAE uses phase estimation to recover the eigenphase whose sine-squared value encodes the target amplitude.",
      },
    ],
    tags: ["quantum", "amplitude-estimation", "qae", "phase-estimation", "grover", "monte-carlo"],
    openQuestions: [
      "Which amplitude-estimation variants minimize total fault-tolerant spacetime cost rather than oracle-query count alone?",
      "When do state preparation and readout overhead eliminate the theoretical Monte Carlo advantage?",
    ],
  },
];
