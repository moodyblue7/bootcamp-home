import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import Timeline from "@/components/about/Timeline";
import { team, vision } from "@/lib/about";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "부트캠프는 2022년 광주에서 시작한 AI 기술기업입니다. 4년간 고령자 1,000여 명 보행 데이터 수집, KTC 공인시험, 생활체육 현장 실증까지 직접 해왔습니다.",
};

const info: [string, string][] = [
  ["회사명", `${company.nameKo} (${company.nameEn})`],
  ["설립", company.founded],
  ["대표", company.ceo],
  ["사업자등록번호", company.bizNo],
  ["주소", company.address],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title={vision.headline.join(" ")} />

      {/* 비전 본문 */}
      <section className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl space-y-6">
          {vision.body.map((p) => (
            <p key={p.slice(0, 20)} className="text-base leading-[1.9] text-navy-600 sm:text-lg">
              {p}
            </p>
          ))}
        </div>
      </section>

      <Timeline />

      {/* 팀 */}
      <section className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">팀</h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {team.map((m) => (
            <article key={m.name} className="rounded-2xl border border-navy-100 p-8 lg:p-10">
              <span className="brand-gradient inline-block h-1 w-10 rounded-full" aria-hidden="true" />
              <h3 className="mt-6 text-xl font-bold leading-snug">{m.name}</h3>
              <p className="mt-1 text-sm font-semibold text-brand-blue">{m.role}</p>
              <div className="mt-5 space-y-3">
                {m.body.map((p) => (
                  <p key={p.slice(0, 20)} className="text-sm leading-relaxed text-navy-600">
                    {p}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 회사 정보 */}
      <section className="border-t border-navy-100 bg-navy-50">
        <div className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">회사 정보</h2>

          <dl className="mt-10 max-w-3xl divide-y divide-navy-100 border-y border-navy-100">
            {info.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-sm font-semibold">{k}</dt>
                <dd className="text-sm text-navy-600">{v}</dd>
              </div>
            ))}
            <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold">연락처</dt>
              <dd className="text-sm text-navy-600">
                <a href={`tel:${company.tel}`} className="hover:text-navy">
                  {company.tel}
                </a>
                <span className="mx-2 text-navy-200">·</span>
                <a href={`mailto:${company.email}`} className="hover:text-navy">
                  {company.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
