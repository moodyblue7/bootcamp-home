import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "채용",
  description: "부트캠프는 상시로 지원을 받습니다. 센서 데이터, 머신러닝, 엣지 디바이스, 현장 운영에 관심 있는 분을 찾습니다.",
};

// 카피 출처: docs/02-copy-home-about.md (승인 완료 — 상시 지원 방식)
const interests = [
  "센서 데이터",
  "머신러닝",
  "엣지 디바이스",
  "데이터 파이프라인",
  "현장 운영",
];

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="현장까지 따라가는 사람을 찾습니다."
        lead="부트캠프의 일은 모델을 만드는 데서 끝나지 않습니다. 어르신이 실제로 걷는 체육관에 장비를 설치하고, 데이터 품질을 확인하고, 안 되면 다시 고칩니다. 그 과정을 지루해하지 않는 분과 함께하고 싶습니다."
      />

      <Section title="상시 지원">
        <div className="max-w-2xl">
          <p className="text-base leading-[1.9] text-navy-600">
            정해진 공고 없이 상시로 지원을 받습니다. 아래 어느 쪽이든 관심 있는 분이라면 편하게
            연락 주세요.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {interests.map((i) => (
              <li
                key={i}
                className="rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-600"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="지원 방법" tone="gray">
        <div className="max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 lg:p-10">
          <p className="text-base leading-relaxed text-navy-600">
            자유 형식 이력서를 아래 주소로 보내주세요. 검토 후 개별적으로 연락드립니다.
          </p>
          <a
            href={`mailto:${company.email}?subject=${encodeURIComponent("[지원] 부트캠프 상시 지원")}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-900"
          >
            {company.email}
          </a>
        </div>
      </Section>
    </>
  );
}
