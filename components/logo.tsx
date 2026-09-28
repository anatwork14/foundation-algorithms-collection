export function FoundationMark({ size = 38 }: { size?: number }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <span className="brand-orbit brand-orbit-a" />
      <span className="brand-orbit brand-orbit-b" />
      <span className="brand-core" />
      <span className="brand-node brand-node-a" />
      <span className="brand-node brand-node-b" />
    </span>
  );
}
