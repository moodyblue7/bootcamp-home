import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import PipelineDiagram from "@/components/PipelineDiagram";
import { CtaBand, KeyValueList, Punchline, Section } from "@/components/Section";
import { manufacturing as m, manufacturingPipeline } from "@/lib/business";

export const metadata: Metadata = {
  title: "제조 AX",
  description:
    "AI 시스템의 현장 안착과 다거점 확산을 담당하는 Roll-out 전문 SW 역량. 중기부 신속상용화 Smart EMS Package 1.0, AAS·OPC-UA 국제표준 연동.",
};

export default function ManufacturingPage() {
  return (
    <>
      <PageHeader eyebrow={m.eyebrow} title={m.h1.join(" ")} lead={m.lead} />

      {/* 사업 전체 도식 — 헬스케어 페이지와 같은 골격. 단 이름이 일치해야 논지가 산다 */}
      <Section
        title="한눈에 보기"
        lead="AI 헬스케어와 같은 다섯 단계입니다. 산업이 달라도 구조는 같습니다."
      >
        <PipelineDiagram pipeline={manufacturingPipeline} />
      </Section>

      {/* 문제 정의 */}
      <Section title={m.problem.title}>
        <p className="text-base text-navy-600">{m.problem.intro}</p>
        <ul className="mt-8 space-y-4 border-l border-navy-200 pl-6">
          {m.problem.items.map((i) => (
            <li key={i.slice(0, 16)} className="text-sm leading-relaxed text-navy-600">
              {i}
            </li>
          ))}
        </ul>
        <Punchline>{m.problem.close}</Punchline>
      </Section>

      {/* 우리의 접근 */}
      <Section title={m.approach.title} tone="gray">
        <p className="max-w-2xl text-base text-navy-600">{m.approach.intro}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {m.approach.items.map((i) => (
            <div key={i.k} className="rounded-2xl border border-navy-100 bg-white p-7">
              <span className="brand-gradient inline-block h-1 w-8 rounded-full" aria-hidden="true" />
              <h3 className="mt-5 text-base font-bold">{i.k}</h3>
              <p className="mt-2 text-xs leading-relaxed text-navy-600">{i.v}</p>
            </div>
          ))}
        </div>
        {/* 두 사업을 잇는 다리. 헬스케어 4년 실적이 제조 AX의 근거가 된다. */}
        <Punchline>{m.approach.close}</Punchline>
      </Section>

      {/* 대표 과제 */}
      <Section title="대표 과제">
        <h3 className="text-xl font-bold">{m.project.title}</h3>
        <div className="mt-6 max-w-3xl">
          <KeyValueList rows={m.project.rows} />
        </div>
      </Section>

      {/* 확장 영역 */}
      <Section title={m.expansion.title} tone="gray">
        <div className="grid gap-4 lg:grid-cols-3">
          {m.expansion.items.map((i) => (
            <div key={i.k} className="rounded-2xl border border-navy-100 bg-white p-7">
              <h3 className="text-base font-bold">{i.k}</h3>
              <p className="mt-2 text-xs leading-relaxed text-navy-600">{i.v}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 왜 부트캠프인가 */}
      <Section title={m.why.title}>
        <div className="max-w-3xl space-y-5">
          {m.why.body.map((p) => (
            <p key={p.slice(0, 16)} className="text-base leading-[1.9] text-navy-600">
              {p}
            </p>
          ))}
        </div>
      </Section>

      <CtaBand title={m.cta.title} body={m.cta.body} />
    </>
  );
}
