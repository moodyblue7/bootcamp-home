import { timeline } from "@/lib/about";

export default function Timeline() {
  return (
    <section className="border-y border-navy-100 bg-navy-50">
      <div className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">연혁</h2>
        <p className="mt-3 text-sm text-navy-400">
          과제 협약, 특허 출원·등록, 시험성적서, 논문 게재 기록에 근거한 내용입니다.
        </p>

        <ol className="mt-14 space-y-14">
          {timeline.map((y) => (
            <li key={y.year} className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
              <h3 className="brand-gradient bg-clip-text text-3xl font-bold tracking-tight text-transparent lg:text-4xl">
                {y.year}
              </h3>

              {/* 세로선 + 점으로 시간의 흐름을 만든다 */}
              <ul className="mt-5 space-y-5 border-l border-navy-200 pl-6 lg:mt-2">
                {y.items.map((it) => (
                  <li key={it.title} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1.8rem] top-[0.45rem] h-2 w-2 rounded-full ring-4 ring-navy-50 ${
                        it.key ? "brand-gradient" : "bg-navy-200"
                      }`}
                    />
                    <p
                      className={`text-[0.95rem] leading-snug ${
                        it.key ? "font-bold" : "font-medium text-navy-600"
                      }`}
                    >
                      {it.month && (
                        <span className="mr-2 text-xs font-semibold text-navy-400">
                          {it.month}월
                        </span>
                      )}
                      {it.title}
                    </p>
                    {it.note && <p className="mt-1 text-xs text-navy-400">{it.note}</p>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
