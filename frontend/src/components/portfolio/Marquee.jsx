export const Marquee = ({ items }) => {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-[#0b0d15] py-4" aria-hidden="true" data-testid="skills-marquee">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {doubled.map((it, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            {it}
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ember)]" />
          </span>
        ))}
      </div>
    </div>
  );
};
