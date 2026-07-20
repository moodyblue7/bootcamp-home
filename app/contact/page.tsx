import type { Metadata } from "next";

import PageHeader from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "문의",
  description: "실증·도입·기술협력·투자 문의를 받습니다. (주)부트캠프 · 광주광역시 남구 효덕로 277.",
};

// 정적 사이트라 서버가 없다. 폼 대신 mailto 로 처리한다.
// 문의 유형을 제목에 미리 넣어두면 받는 쪽에서 분류하기 쉽다.
const topics = [
  {
    title: "실증 · 도입",
    body: "공공체육시설, 복지관, 건강생활지원센터에 AI 근육건강 체크존 도입을 검토하시는 경우",
    subject: "[도입문의] AI 근육건강 체크존",
  },
  {
    title: "제조 AX",
    body: "제조 현장 AI 확산, Roll-out 협력, 컨소시엄 참여를 논의하고 싶은 경우",
    subject: "[제조AX] 협력 문의",
  },
  {
    title: "기술 협력 · 공동연구",
    body: "공동연구, 정부 과제 컨소시엄, 기술 이전을 제안하시는 경우",
    subject: "[기술협력] 공동연구 문의",
  },
  {
    title: "그 외",
    body: "투자, 취재, 그 밖의 문의",
    subject: "[일반문의]",
  },
];

const info: [string, string][] = [
  ["회사명", `${company.nameKo} (${company.nameEn})`],
  ["대표", company.ceo],
  ["사업자등록번호", company.bizNo],
  ["주소", company.address],
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="함께 검증해볼 현장을 찾습니다."
        lead="실증, 도입, 기술협력 어느 쪽이든 편하게 연락 주세요. 아래에서 문의 유형을 고르시면 제목이 채워진 메일 창이 열립니다."
      />

      <Section title="문의 유형">
        <ul className="grid gap-4 sm:grid-cols-2">
          {topics.map((t) => (
            <li key={t.title}>
              <a
                href={`mailto:${company.email}?subject=${encodeURIComponent(t.subject)}`}
                className="group flex h-full flex-col rounded-2xl border border-navy-100 p-7 transition-all hover:border-navy-200 hover:shadow-md"
              >
                <span
                  className="brand-gradient inline-block h-1 w-8 rounded-full"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-base font-bold">{t.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-navy-600">{t.body}</p>
                <span className="mt-5 text-xs font-semibold text-brand-blue group-hover:underline">
                  메일 보내기 →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="연락처" tone="gray">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-navy-100 bg-white p-8">
            <dl className="space-y-5">
              <div>
                <dt className="text-xs font-semibold text-navy-400">이메일</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${company.email}`}
                    className="text-lg font-bold hover:text-brand-blue"
                  >
                    {company.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-navy-400">전화</dt>
                <dd className="mt-1">
                  <a href={`tel:${company.tel}`} className="text-lg font-bold hover:text-brand-blue">
                    {company.tel}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-navy-100 bg-white p-8">
            <dl className="space-y-4">
              {info.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold text-navy-400">{k}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-navy-600">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>
    </>
  );
}
