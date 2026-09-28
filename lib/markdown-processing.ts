import GithubSlugger from "github-slugger";

export function cleanInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function tocFrom(content: string) {
  const slugger = new GithubSlugger();
  return [...content.matchAll(/^(#|##|###)\s+(.+)$/gm)].map((match) => {
    const label = cleanInlineMarkdown(match[2]);
    return {
      id: slugger.slug(label),
      label,
      level: match[1].length,
    };
  });
}

/**
 * The corpus intentionally stores familiar LaTeX delimiters (\(...\) and
 * \[...\]). remark-math expects dollar delimiters, so normalize only the
 * rendered copy and leave fenced code blocks untouched.
 */
export function normalizeMathForRendering(markdown: string) {
  return markdown
    .split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g)
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return part
        .replace(/\\\[/g, () => "$$")
        .replace(/\\\]/g, () => "$$")
        .replace(/\\\(/g, () => "$")
        .replace(/\\\)/g, () => "$");
    })
    .join("");
}
