export default function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy-100">
      <div
        aria-hidden="true"
        className="brand-gradient pointer-events-none absolute -right-40 -top-48 h-[28rem] w-[28rem] rounded-full opacity-[0.06] blur-3xl"
      />
      <div className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-[1.3] tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.25]">
          {title}
        </h1>
        {lead && <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-600">{lead}</p>}
      </div>
    </section>
  );
}
