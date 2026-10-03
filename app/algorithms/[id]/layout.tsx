import Link from "next/link";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { variantsForAlgorithm } from "@/lib/algorithm-variants";

export default async function AlgorithmEntityLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const algorithm = getAlgorithm(id);
  const variants = variantsForAlgorithm(id);

  if (!algorithm || variants.length === 0) return children;

  return (
    <>
      <nav className="shell algorithm-variant-nav" aria-label={`${algorithm.name} variant navigation`}>
        <span>Variant family</span>
        <Link href={`/algorithms/${algorithm.id}`}>Overview</Link>
        {variants.map((variant) => (
          <Link key={variant.id} href={`/algorithms/${algorithm.id}/variants/${variant.id}`}>
            {variant.name}
          </Link>
        ))}
        <Link href="/variants">All variants</Link>
      </nav>
      {children}
    </>
  );
}
