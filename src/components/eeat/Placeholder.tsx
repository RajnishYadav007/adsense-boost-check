import { isMissing } from "@/config/eeat";

/**
 * Renders the value when present, or a visible [LABEL] tag highlighting what
 * the site owner still needs to fill in. Never invents data.
 */
export function Placeholder({
  value,
  label,
  as: As = "span",
  className = "",
}: {
  value: string | undefined | null;
  label: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  if (isMissing(value)) {
    return (
      <As
        className={`inline-block px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono text-[0.85em] ${className}`}
        title="Fill this in src/config/eeat.ts"
      >
        [{label}]
      </As>
    );
  }
  return <As className={className}>{value}</As>;
}

/** Block-level banner shown when an entire section has no data yet. */
export function MissingSectionNotice({ what }: { what: string }) {
  return (
    <div className="my-4 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 text-sm">
      <strong className="text-amber-600 dark:text-amber-400">
        Action needed:
      </strong>{" "}
      <span className="text-muted-foreground">
        Add {what} in <code className="text-xs">src/config/eeat.ts</code>. This
        notice only appears until you fill it in.
      </span>
    </div>
  );
}
