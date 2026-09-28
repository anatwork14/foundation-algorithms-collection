type FoundationMarkProps = {
  size?: number;
  className?: string;
};

export function FoundationMark({ size = 38, className = "" }: FoundationMarkProps) {
  return (
    <img
      src="/foundation-algorithms-mark.svg"
      width={size}
      height={size}
      className={`brand-mark-image ${className}`.trim()}
      alt=""
      aria-hidden="true"
    />
  );
}
