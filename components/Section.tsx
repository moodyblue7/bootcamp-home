import Link from "next/link";

export function Section({
  title,
  lead,
  tone = "white",
  children,
}: {
  title?: string;
  lead?: string;
  tone?: "white" | "gray";
  children: React.ReactNode;
}) {
  const bg = tone === "gray" ? "border-y border-navy-100 bg-navy-50" : "";
  return (
    <section className={bg}>
      <div className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        {title && <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>}
        {lead && <p className="mt-3 max-w-2xl text-sm text-navy-400">{lead}</p>}
        <div className={title ? "mt-12" : ""}>{children}</div>
      </div>
    </section>
  );
}

/** 문단 끝에서 논지를 못박는 강조 문장 */
export function Punchline({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-10 border-l-2 border-brand-blue pl-5 text-base font-semibold leading-relaxed sm:text-lg">
      {children}
    </p>
  );
}

export function KeyValueList({ rows }: { rows: readonly { k: string; v: string }[] }) {
  return (
    <dl className="divide-y divide-navy-100 border-y border-navy-100">
      {rows.map((r) => (
        <div key={r.k} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
          <dt className="text-sm font-semibold">{r.k}</dt>
          <dd className="text-sm leading-relaxed text-navy-600">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 text-sm text-navy-200 sm:text-base">{body}</p>
          </div>
          <Link
            href="/contact/"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-navy-100"
          >
            문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}
