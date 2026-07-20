import type { Metadata } from "next";
import Image from "next/image";

import PageHeader from "@/components/PageHeader";
import PipelineDiagram from "@/components/PipelineDiagram";
import { CtaBand, Punchline, Section } from "@/components/Section";
import { healthcare as h, healthcarePipeline } from "@/lib/business";

export const metadata: Metadata = {
  title: "AI 헬스케어",
  description:
    "스마트폰과 IMU 센서로 보행을 읽어 근육건강 신호를 알려주는 스크리닝 서비스입니다. KTC 공인시험 검증, 파크골프장 현장 실증 완료.",
};

export default function HealthcarePage() {
  return (
    <>
      <PageHeader eyebrow={h.eyebrow} title={h.h1.join(" ")} lead={h.lead} />

      {/* 사업 전체 도식 — 제조 AX 페이지와 같은 골격을 쓴다 */}
      <Section title="한눈에 보기" lead="현장에서 결과가 나오기까지, 부트캠프가 직접 하는 다섯 단계입니다.">
        <PipelineDiagram pipeline={healthcarePipeline} />
      </Section>

      {/* 문제 정의 */}
      <Section title={h.problem.title}>
        <dl className="divide-y divide-navy-100 border-y border-navy-100">
          {h.problem.rows.map((r) => (
            <div key={r.way} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
              <dt className="text-base font-bold">{r.way}</dt>
              <dd className="text-sm leading-relaxed text-navy-600">{r.limit}</dd>
            </div>
          ))}
        </dl>
        <Punchline>{h.problem.close}</Punchline>
      </Section>

      {/* 우리의 접근 */}
      <Section title={h.approach.title} tone="gray">
        <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <div className="max-w-2xl space-y-5">
              {h.approach.body.map((p) => (
                <p key={p.slice(0, 16)} className="text-base leading-[1.9] text-navy-600">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {h.approach.columns.map((c) => (
                <div key={c.who} className="rounded-2xl border border-navy-100 bg-white p-6">
                  <h3 className="text-sm font-bold text-brand-blue">{c.who}</h3>
                  <ul className="mt-3 space-y-2">
                    {c.points.map((pt) => (
                      <li key={pt} className="text-xs leading-relaxed text-navy-600">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 초상권: 얼굴 식별되지 않는 컷만 사용 (scripts/export_photos.py 참조) */}
          <figure className="lg:pt-2">
            <Image
              src="/photos/gait-measurement.jpg"
              alt="지정 보행 구간을 걷는 참여자 뒷모습"
              width={658}
              height={1600}
              className="w-full rounded-2xl object-cover lg:h-[26rem]"
            />
            <figcaption className="mt-3 text-xs text-navy-400">
              파크골프장 실증 현장. 참여자는 평소처럼 걷기만 합니다.
            </figcaption>
          </figure>
        </div>

        {/* 의료 오인 방지 필수 고지 — 절대 제거 금지 */}
        <p className="mt-14 rounded-xl bg-white px-5 py-4 text-xs leading-relaxed text-navy-600 ring-1 ring-navy-100">
          {h.disclaimer}
        </p>
      </Section>

      {/* 작동 방식 */}
      <Section title={h.how.title}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {h.how.steps.map((s) => (
            <li
              key={s.n}
              className={`rounded-2xl border p-7 ${
                s.emphasis ? "border-brand-blue/40 bg-navy-50" : "border-navy-100"
              }`}
            >
              <span
                className={`text-xs font-bold ${s.emphasis ? "text-brand-blue" : "text-navy-400"}`}
              >
                {s.n}
              </span>
              <h3 className="mt-3 text-base font-bold">{s.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-navy-600">{s.body}</p>
            </li>
          ))}
        </ol>
        <Punchline>{h.how.close}</Punchline>
      </Section>

      {/* 제품 라인 */}
      <Section title="제품 라인" tone="gray">
        <div className="grid gap-4 sm:grid-cols-2">
          {h.products.map((p) => (
            <div key={p.name} className="rounded-2xl border border-navy-100 bg-white p-7">
              <div className="flex items-baseline gap-3">
                <h3 className="text-lg font-bold">{p.name}</h3>
                <span className="text-xs font-medium text-navy-400">{p.kind}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 검증 */}
      <Section title="주장하지 않고, 증명합니다">
        {/* ① KTC 공인시험 */}
        <div>
          <h3 className="text-lg font-bold">{h.ktc.title}</h3>
          <p className="mt-2 text-xs text-navy-400">{h.ktc.note}</p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr className="border-y border-navy-200 text-left">
                  <th className="py-3 pr-4 font-semibold">시험 항목</th>
                  <th className="py-3 pr-4 font-semibold text-navy-400">기준</th>
                  <th className="py-3 font-semibold">결과</th>
                </tr>
              </thead>
              <tbody>
                {h.ktc.rows.map((r) => (
                  <tr key={r.item} className="border-b border-navy-100">
                    <td className="py-3 pr-4 text-navy-600">{r.item}</td>
                    <td className="py-3 pr-4 text-navy-400">{r.target}</td>
                    <td className="py-3 font-bold">{r.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ② 데이터 */}
        <div className="mt-16">
          <h3 className="text-lg font-bold">데이터</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy-600">
            4년간 1,000여 명의 인체 데이터를 직접 수집했습니다. 최근 생활체육 현장(파크골프장)에서는
            고령자 300명 규모를 보행·근력·근육량 등 78종 지표로, 보건복지부 IRB 승인 아래 정밀 수집했습니다.
          </p>
        </div>

        {/* ③ 파크골프장 실증 — 완료 */}
        <div className="mt-16">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold">{h.fieldDone.title}</h3>
            <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
              {h.fieldDone.status}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy-600">{h.fieldDone.body}</p>

          <dl className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {h.fieldDone.stats.map((s) => (
              <div key={s.k} className="rounded-2xl border border-navy-100 p-6">
                <dd className="brand-gradient bg-clip-text text-2xl font-bold text-transparent lg:text-3xl">
                  {s.v}
                </dd>
                <dt className="mt-2 text-xs text-navy-400">{s.k}</dt>
              </div>
            ))}
          </dl>
          <Punchline>{h.fieldDone.close}</Punchline>
        </div>

        {/* ④ 다음 실증 — 준비 중 (진행 중으로 쓰지 말 것) */}
        <div className="mt-16 rounded-2xl border border-dashed border-navy-200 p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold">{h.fieldNext.title}</h3>
            <span className="rounded-full border border-navy-200 px-3 py-1 text-xs font-semibold text-navy-400">
              {h.fieldNext.status}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy-600">{h.fieldNext.body}</p>
        </div>

        {/* ⑤ 개인정보 */}
        <div className="mt-16">
          <h3 className="text-lg font-bold">{h.privacy.title}</h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {h.privacy.items.map((i) => (
              <li
                key={i}
                className="rounded-full border border-navy-200 px-4 py-1.5 text-xs font-medium text-navy-600"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand title={h.cta.title} body={h.cta.body} />
    </>
  );
}
