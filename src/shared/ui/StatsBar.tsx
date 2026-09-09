type Stat = { value: string; label: string };

type StatsBarProps = {
  stats: Stat[];
  className?: string;
};

/**
 * A row of big-number / label pairs used to build quick credibility right
 * below a hero (e.g. "60+ tools already integrated"). Purely presentational —
 * every number rendered here must already be verified against real data
 * (see the integration pages' data files); never fabricate a stat here.
 */
const StatsBar = ({ stats, className }: StatsBarProps) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section className={`px-landing py-10 lg:py-14 bg-white${className ? ` ${className}` : ''}`}>
      <div className="max-w-[88.875rem] mx-auto flex flex-wrap items-start justify-center gap-x-12 gap-y-8 text-center">
        {stats.map(({ value, label }, i) => (
          <div key={i} className="flex min-w-[140px] max-w-[220px] flex-col items-center gap-1">
            <span className="text-h2 text-purple-accents">{value}</span>
            <span className="text-smallTag text-dark-medium uppercase tracking-widest">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
