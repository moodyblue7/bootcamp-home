import Link from "next/link";

import { businesses } from "@/lib/site";

export default function BusinessCards() {
  return (
    <section className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
      <h2 className="sr-only">사업영역</h2>

      {/* 두 사업을 동등하게 보여야 하므로 크기·구조를 완전히 동일하게 유지한다. */}
      <div className="grid gap-5 lg:grid-cols-2">
        {businesses.map((b) => (
          <Link
            key={b.href}
            href={b.href}
            className="group relative flex flex-col rounded-2xl border border-navy-100 bg-white p-8 transition-all hover:border-navy-200 hover:shadow-lg lg:p-10"
          >
            <span className="brand-gradient inline-block h-1 w-10 rounded-full" aria-hidden="true" />
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-brand-blue">
              {b.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-bold leading-snug lg:text-[1.75rem]">{b.title}</h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-600">{b.body}</p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {b.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600"
                >
                  {t}
                </li>
              ))}
            </ul>

            <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
              자세히 보기
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
