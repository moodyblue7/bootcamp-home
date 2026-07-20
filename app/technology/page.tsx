import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import { CtaBand, KeyValueList, Punchline, Section } from "@/components/Section";
import { tech as t } from "@/lib/technology";

export const metadata: Metadata = {
  title: "기술",
  description:
    "시계열 센서 데이터를 현장이 신뢰할 수 있는 판단으로 바꾸는 파이프라인. 품질 게이트, 온디바이스 경량 ML, 엣지 아키텍처, AAS·OPC-UA 표준 연동.",
};

export default function TechnologyPage() {
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.h1.join(" ")} lead={t.lead} />

      {/* 두 사업이 공유하는 것 — 이 페이지의 핵심 논지 */}
      <Section title={t.bridge.title}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <thead>
              <tr className="border-y border-navy-200 text-left">
                <th className="w-40 py-3 pr-4 font-semibold text-navy-400" />
                <th className="py-3 pr-6 font-semibold">AI 헬스케어</th>
                <th className="py-3 font-semibold">제조 AX</th>
              </tr>
            </thead>
            <tbody>
              {t.bridge.rows.map((r, i) => {
                const last = i === t.bridge.rows.length - 1;
                return (
                  <tr
                    key={r.axis}
                    className={`border-b border-navy-100 ${last ? "bg-navy-50" : ""}`}
                  >
                    <th className="py-4 pr-4 text-left align-top text-xs font-bold text-navy-400">
                      {r.axis}
                    </th>
                    <td
                      className={`py-4 pr-6 align-top leading-relaxed ${
                        last ? "font-bold" : "text-navy-600"
                      }`}
                    >
                      {r.healthcare}
                    </td>
                    <td
                      className={`py-4 align-top leading-relaxed ${
                        last ? "font-bold" : "text-navy-600"
                      }`}
                    >
                      {r.manufacturing}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Punchline>{t.bridge.close}</Punchline>
      </Section>

      {/* 파이프라인 5단계 */}
      <Section title={t.pipeline.title} lead={t.pipeline.lead} tone="gray">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {t.pipeline.steps.map((s) => (
            <li
              key={s.n}
              className={`rounded-2xl border p-6 ${
                s.emphasis ? "border-brand-blue/40 bg-white ring-1 ring-brand-blue/20" : "border-navy-100 bg-white"
              }`}
            >
              <span className={`text-xs font-bold ${s.emphasis ? "text-brand-blue" : "text-navy-400"}`}>
                {s.n}
              </span>
              <h3 className="mt-3 text-sm font-bold">{s.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-navy-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 품질 게이트 */}
      <Section title={t.gate.title}>
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="max-w-2xl space-y-5">
            {t.gate.body.map((p) => (
              <p key={p.slice(0, 16)} className="text-base leading-[1.9] text-navy-600">
                {p}
              </p>
            ))}
          </div>

          <div className="rounded-2xl border border-navy-100 bg-navy-50 p-7">
            <p className="text-xs font-bold text-brand-blue">{t.gate.proof.label}</p>
            <dl className="mt-5 space-y-5">
              {t.gate.proof.stats.map((s) => (
                <div key={s.k}>
                  <dd className="brand-gradient bg-clip-text text-3xl font-bold text-transparent">
                    {s.v}
                  </dd>
                  <dt className="mt-1 text-xs text-navy-400">{s.k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-navy-200 pt-4 text-xs leading-relaxed text-navy-400">
              {t.gate.proof.note}
            </p>
          </div>
        </div>
      </Section>

      {/* 모델 */}
      <Section title={t.models.title} lead={t.models.body} tone="gray">
        <div className="max-w-3xl">
          <KeyValueList rows={t.models.rows} />
        </div>
      </Section>

      {/* 엣지 아키텍처 */}
      <Section title={t.edge.title} lead={t.edge.lead}>
        <ol className="space-y-3">
          {t.edge.layers.map((l) => (
            <li
              key={l.n}
              className="flex flex-col gap-1 rounded-2xl border border-navy-100 p-6 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="text-xs font-bold text-navy-400 sm:w-8">{l.n}</span>
              <h3 className="text-sm font-bold sm:w-56">{l.name}</h3>
              <p className="text-xs leading-relaxed text-navy-600">{l.body}</p>
            </li>
          ))}
        </ol>
        <Punchline>{t.edge.close}</Punchline>
      </Section>

      {/* 표준 */}
      <Section title={t.standards.title} tone="gray">
        <div className="max-w-3xl">
          <KeyValueList rows={t.standards.rows} />
        </div>
      </Section>

      {/* 보안 */}
      <Section title={t.security.title}>
        <ul className="flex flex-wrap gap-2.5">
          {t.security.items.map((i) => (
            <li
              key={i}
              className="rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-600"
            >
              {i}
            </li>
          ))}
        </ul>
      </Section>

      {/* 연구 기반 */}
      <Section title={t.research.title} lead={t.research.lead} tone="gray">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {t.research.stats.map((s) => (
            <div key={s.k}>
              <dd className="brand-gradient bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                {s.v}
              </dd>
              <dt className="mt-3 text-sm font-semibold">{s.k}</dt>
              <p className="mt-1 text-xs text-navy-400">{s.note}</p>
            </div>
          ))}
        </dl>
      </Section>

      <CtaBand title={t.cta.title} body={t.cta.body} />
    </>
  );
}
