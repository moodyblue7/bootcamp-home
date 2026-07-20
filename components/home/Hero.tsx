import Link from "next/link";

import { hero } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-navy-100">
      {/* CI 그라데이션을 아주 옅게 깐 배경. 사진이 저해상도뿐이라 이미지 대신 도형으로 처리. */}
      <div
        aria-hidden="true"
        className="brand-gradient pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full opacity-[0.07] blur-3xl"
      />
      <div className="mx-auto max-w-content px-5 py-24 lg:px-8 lg:py-32">
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.2]">
          {hero.headline[0]}
          <br />
          <span className="brand-gradient bg-clip-text text-transparent">{hero.headline[1]}</span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-600 sm:text-lg">
          {hero.sub}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/healthcare/"
            className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-900"
          >
            사업영역 보기
          </Link>
          <Link
            href="/technology/"
            className="rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            기술 자세히
          </Link>
        </div>

        <p className="mt-12 text-xs font-medium tracking-wide text-navy-400">{hero.note}</p>
      </div>
    </section>
  );
}
