import { team, teamSection } from "@/lib/about";

export default function Leadership({ className }: { className: string }) {
  return (
    <div className={className}>
      <p className="flow-label">{teamSection.label}</p>
      <h2 className="flow-section-title mt-4">{teamSection.headline}</h2>
      <p className="flow-lead mt-5 whitespace-pre-line">{teamSection.lead}</p>

      <section
        aria-label="핵심 리더십"
        className="mt-8 max-w-[56rem] overflow-hidden rounded-2xl border border-navy-100 bg-white"
      >
        <div className="grid divide-y divide-navy-100">
          {team.map((m) => (
            <article key={m.name} className="p-6 sm:p-7 lg:p-8">
              <div className="grid gap-6 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-10">
                <div className="relative">
                  <p className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-brand-blue">
                    {m.role}
                  </p>
                  <h3 className="mt-2 font-display text-heading-card font-extrabold text-navy">
                    {m.name}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] font-semibold leading-relaxed text-navy">
                    {m.focus}
                  </p>
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-1 h-2 w-2 rounded-full bg-brand-blue"
                  />
                </div>
                <div>
                  <p className="text-base leading-relaxed text-navy-600">{m.description}</p>
                  <ul className="mt-5 grid gap-2 border-t border-navy-100 pt-4 sm:grid-cols-3 md:grid-cols-1">
                    {m.facts.map((fact) => (
                      <li
                        key={fact}
                        className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-navy-600"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue"
                        />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="mt-4 max-w-[56rem] rounded-2xl bg-navy px-6 py-5 text-white sm:px-7">
        <p className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-brand-cyan">
          {teamSection.executionTitle}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {teamSection.executionItems.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.875rem] font-medium text-white/85"
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
