import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import { CtaBand, Section } from "@/components/Section";
import {
  certifications,
  papers,
  patents,
  press,
  projects,
  techTransfer,
} from "@/lib/achievements";

export const metadata: Metadata = {
  title: "성과·인증",
  description:
    "특허 등록 1건·출원 5건, 논문 5편(SCI 1편·KCI 4편), KTC 공인시험 검증, 기술이전, 정부 R&D 누적 수행 규모 약 37.6억 원.",
};

const summary = [
  { v: "37.6억원", k: "R&D 수행 규모", note: "누적 주관·참여 과제 기준" },
  { v: "6건", k: "특허", note: "등록 1건 · 출원 5건" },
  { v: "5편", k: "논문", note: "SCI 1편 · KCI 4편" },
  { v: "1건", k: "기술이전", note: "광주대학교 통상실시권" },
];

export default function AchievementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Achievements"
        title="문서로 남은 것만 적었습니다."
        lead="아래 항목은 특허원부, 공인시험성적서, 과제 협약, 학술지 게재로 확인되는 것들입니다."
      />

      {/* 요약 */}
      <Section tone="gray">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {summary.map((s) => (
            <div key={s.k}>
              <dd className="brand-gradient bg-clip-text text-4xl font-bold tracking-tight text-transparent lg:text-5xl">
                {s.v}
              </dd>
              <dt className="mt-3 text-sm font-semibold">{s.k}</dt>
              <p className="mt-1 text-xs text-navy-400">{s.note}</p>
            </div>
          ))}
        </dl>
      </Section>

      {/* 특허 */}
      <Section title="특허">
        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-blue">등록</h3>
        <ul className="mt-5 space-y-3">
          {patents.registered.map((p) => (
            <li key={p.no} className="rounded-2xl border border-navy-100 p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
                  등록
                </span>
                <span className="text-sm font-bold">{p.no}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{p.title}</p>
              <p className="mt-2 text-xs text-navy-400">
                출원번호 {p.appNo} · {p.date}
              </p>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 text-xs font-bold uppercase tracking-widest text-navy-400">출원</h3>
        <ul className="mt-5 divide-y divide-navy-100 border-y border-navy-100">
          {patents.applied.map((p) => (
            <li key={p.no} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <div className="text-xs text-navy-400">
                <span className="font-semibold text-navy-600">{p.no}</span>
                <br />
                {p.date}
              </div>
              <p className="text-sm leading-relaxed text-navy-600">{p.title}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 논문 */}
      <Section title="논문" tone="gray">
        <ul className="space-y-3">
          {papers.map((p) => (
            <li key={p.title} className="rounded-2xl border border-navy-100 bg-white p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                    p.grade === "SCI"
                      ? "bg-navy text-white"
                      : "border border-navy-200 text-navy-400"
                  }`}
                >
                  {p.grade}
                </span>
                <span className="text-xs text-navy-400">
                  {p.journal} · {p.year} · {p.role}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold leading-relaxed">{p.title}</h3>
              {"doi" in p && p.doi && (
                <a
                  href={`https://doi.org/${p.doi}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-block text-xs font-medium text-brand-blue hover:underline"
                >
                  DOI: {p.doi} ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* 인증·검증 */}
      <Section title="인증 · 검증">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c) => (
            <li key={c.name} className="rounded-2xl border border-navy-100 p-7">
              <h3 className="text-base font-bold">{c.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-navy-600">{c.body}</p>
              {c.org && <p className="mt-3 text-xs text-navy-400">{c.org}</p>}
              {c.date && <p className="text-xs text-navy-400">{c.date}</p>}
            </li>
          ))}
        </ul>

        <h3 className="mt-14 text-lg font-bold">기술이전</h3>
        <ul className="mt-5 space-y-3">
          {techTransfer.map((t) => (
            <li
              key={t.name}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-2xl border border-navy-100 p-6"
            >
              <span className="text-sm font-bold">{t.name}</span>
              <span className="text-xs text-navy-400">
                {t.from} · {t.date}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 수행 과제 */}
      <Section
        title="주요 수행 과제"
        lead="설립 이후 주관·참여한 주요 정부 R&D 과제입니다. 누적 수행 규모는 약 37.6억 원입니다."
        tone="gray"
      >
        <ul className="divide-y divide-navy-100 border-y border-navy-100">
          {projects.map((p) => (
            <li key={p.name} className="grid gap-1 py-5 sm:grid-cols-[5rem_1fr] sm:gap-6">
              <span className="text-sm font-bold text-brand-blue">{p.year}</span>
              <div>
                <p className="text-sm font-semibold leading-relaxed">{p.name}</p>
                {p.note && <p className="mt-1 text-xs text-navy-400">{p.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 언론보도 — 원문 링크로만 */}
      <Section title="언론보도">
        <ul className="space-y-3">
          {press.map((p) => (
            <li key={p.url}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group block rounded-2xl border border-navy-100 p-7 transition-colors hover:border-navy-200"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-brand-blue">{p.outlet}</span>
                  <time className="text-xs text-navy-400">{p.date}</time>
                </div>
                <h3 className="mt-3 text-sm font-bold leading-relaxed group-hover:underline">
                  {p.title} ↗
                </h3>
                <p className="mt-2 text-xs text-navy-400">{p.note}</p>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="더 궁금한 점이 있으신가요?" body="성과 자료와 상세 실적은 문의 주시면 안내해 드립니다." />
    </>
  );
}
