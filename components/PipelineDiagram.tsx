import type { Pipeline } from "@/lib/types";

/**
 * 사업 전체를 한 장으로 보여주는 5단 파이프라인 도식.
 *
 * **두 사업(헬스케어 / 제조 AX)이 반드시 같은 컴포넌트를 쓴다.** 그래야 골격이 강제로
 * 일치하고, 두 그림을 나란히 봤을 때 "같은 기술로 다른 산업을 한다"는 이 사이트의 논지가
 * 글이 아니라 형태로 증명된다. 한쪽만 단을 늘리거나 구조를 바꾸면 그 효과가 사라진다.
 *
 * 이미지가 아니라 마크업인 이유: 수치가 바뀌면 텍스트만 고치면 되고, 확대해도 깨지지 않고,
 * 스크린리더가 읽고, 모바일에서 세로로 쌓인다.
 */
export default function PipelineDiagram({ pipeline }: { pipeline: Pipeline }) {
  return (
    <figure className="not-prose">
      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:gap-0">
        {pipeline.stages.map((s, i) => (
          <div key={s.label} className="flex flex-col items-stretch lg:flex-1 lg:flex-row">
            <div
              className={`relative flex-1 overflow-hidden rounded-2xl border p-5 ${
                s.emphasis
                  ? "border-brand-blue/40 bg-white shadow-sm ring-1 ring-brand-blue/25"
                  : "border-navy-100 bg-white"
              }`}
            >
              {/* 강조 단계에만 CI 그라데이션 바를 얹는다 = 이 시스템의 심장 */}
              {s.emphasis && (
                <span
                  aria-hidden="true"
                  className="brand-gradient absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                />
              )}
              <p
                className={`text-[0.65rem] font-bold uppercase tracking-widest ${
                  s.emphasis ? "text-brand-blue" : "text-navy-400"
                }`}
              >
                {s.label}
              </p>
              <h4 className="mt-2 text-sm font-bold leading-snug">{s.title}</h4>
              <ul className="mt-2 space-y-0.5">
                {s.lines.map((l) => (
                  <li key={l} className="text-xs leading-relaxed text-navy-400">
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            {/* 단계 사이 화살표. 데스크톱은 →, 모바일은 ↓ */}
            {i < pipeline.stages.length - 1 && (
              <div
                aria-hidden="true"
                className="flex shrink-0 items-center justify-center py-1 lg:px-1.5 lg:py-0"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="rotate-90 text-navy-200 lg:rotate-0"
                >
                  <path
                    d="M5 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 근거 밴드: 헬스케어는 '증거', 제조는 '실행' */}
      <figcaption className="mt-3 flex flex-col gap-2 rounded-2xl bg-navy-50 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
        <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-widest text-navy-400">
          {pipeline.footer.label}
        </span>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {pipeline.footer.items.map((it) => (
            <li key={it} className="text-xs font-medium text-navy-600">
              {it}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
