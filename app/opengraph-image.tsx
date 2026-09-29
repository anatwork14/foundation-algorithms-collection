import { ImageResponse } from "next/og";

export const alt = "Foundation Algorithms — Research Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f1ede3",
          color: "#161813",
          padding: "64px 72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1f4d3a",
                color: "#f6f1e7",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              FA
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>Foundation Algorithms</div>
              <div style={{ marginTop: 4, fontSize: 16, color: "#667067", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Living research archive
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid #c7c1b5",
              borderRadius: 999,
              padding: "10px 16px",
              fontSize: 15,
              color: "#536057",
            }}
          >
            Source → Code → Experiment
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: "88%" }}>
          <div style={{ fontSize: 62, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 700 }}>
            Know the foundations.
          </div>
          <div style={{ marginTop: 4, fontSize: 62, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 700, color: "#1f4d3a" }}>
            Find the next combination.
          </div>
          <div style={{ marginTop: 30, fontSize: 23, lineHeight: 1.45, color: "#4d554e", maxWidth: 930 }}>
            Algorithms across computer science, AI/ML, quantum computing, and cybersecurity—indexed with inspectable sources, implementations, hypotheses, and evidence provenance.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #d1cabc", paddingTop: 24 }}>
          <div style={{ display: "flex", gap: 24, fontSize: 16, color: "#626961" }}>
            <span>Archive</span>
            <span>Algorithms</span>
            <span>Atlas</span>
            <span>Lab</span>
            <span>Evidence</span>
          </div>
          <div style={{ fontSize: 15, color: "#747a72" }}>foundation-algorithms-collection</div>
        </div>
      </div>
    ),
    size,
  );
}
