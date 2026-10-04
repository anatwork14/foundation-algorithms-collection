import type { ExperimentHistoryEntry } from "./experiment-history.ts";

export const realTargetExperimentHistoryAdditions = [
  {
    experimentId: "linucb-fuzzing-framed-record-target-pilot",
    revision: 1,
    date: "2026-10-04",
    kind: "Protocol",
    status: "Planned",
    title: "Executed-target pilot defined",
    note: "A bounded follow-up to the synthetic fuzzing scheduler pilot was defined around a committed framed-record parser target, real byte mutations, an evolving retained corpus, and novelty rewards derived from executed target trace features. The scope remains narrower than an AFL++ or external benchmark campaign.",
  },
  {
    experimentId: "linucb-fuzzing-framed-record-target-pilot",
    revision: 2,
    date: "2026-10-04",
    kind: "Artifact",
    status: "Running",
    title: "Parser target and campaign harness committed",
    note: "The deterministic parser target, target-executing scheduler harness, and machine-readable manifest were committed together so the campaign can be reproduced in CI without substituting a synthetic reward generator.",
    artifactLabels: ["Executed parser target", "Deterministic target campaign harness", "Verified target-campaign manifest"],
  },
  {
    experimentId: "linucb-fuzzing-framed-record-target-pilot",
    revision: 3,
    date: "2026-10-04",
    kind: "Result",
    status: "Completed",
    title: "Negative target result accepted",
    note: "The exactly reproducible target-campaign result was accepted without tuning away the failure signal: stationary LinUCB found slightly fewer unique target trace features and fewer novelty-producing inputs than both uniform scheduling and UCB1 on this one parser target/configuration. The archive records this as Negative for the directional hypothesis, not as a general claim about contextual fuzzing.",
    artifactLabels: ["Recorded target-campaign result"],
  },
] satisfies ExperimentHistoryEntry[];
