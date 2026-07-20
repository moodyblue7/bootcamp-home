import { stats } from "@/lib/site";

export default function Stats() {
  return (
    <section className="border-y border-navy-100 bg-navy-50">
      <div className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">숫자로 보는 부트캠프</h2>
        <p className="mt-3 text-sm text-navy-400">
          모든 수치는 공인시험성적서·특허원부·과제협약 등 문서로 확인된 것만 표기합니다.
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="brand-gradient bg-clip-text text-4xl font-bold tracking-tight text-transparent lg:text-5xl">
                {s.display}
              </dd>
              <dt className="mt-3 text-sm font-semibold">{s.label}</dt>
              <p className="mt-1 text-xs leading-relaxed text-navy-400">{s.note}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
