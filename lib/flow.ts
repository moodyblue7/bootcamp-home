// 원페이지(2D 격자) 뷰의 구조 정의.
//
// 구조: 세로 = 대주제(row), 가로 = 각 대주제의 세부(panel).
//   - 세로 스크롤로 대주제 이동 (회사소개 → 헬스케어 → 제조 AX → 기술 …)
//   - 각 대주제 안에서 오른쪽으로 세부 패널 이동
//   - row.id 는 섹션별 딥링크(URL 해시)로 쓴다. /flow#healthcare 로 바로 이동.
//
// ⚠️ 지금은 인터랙션 뼈대 프로토타입이다. 패널 본문은 최소 텍스트만 넣었고,
//    실제 콘텐츠(KTC 표, 파이프라인 도식 등) 이식은 인터랙션 승인 후에 한다.
//    기존 8개 페이지(app/about, app/healthcare …)는 그대로 보존한다.

import { hcSections } from "./hcContent.generated";
import { mfgSections } from "./mfgContent.generated";

export type FlowPanel = {
  // variant:
  //   (없음)     — 기본 텍스트 패널(kicker/title/body/points)
  //   "contact"  — 회사정보 전용 레이아웃(예전 푸터와 동일)
  //   "hc"       — AIWalker 랜딩페이지의 한 섹션(자체 CSS 를 .hc 로 스코프해 직접 렌더)
  //   "mfg"      — 제조 AX 랜딩페이지의 한 섹션(자체 CSS 를 .mfg 로 스코프해 직접 렌더)
  //   "vision"   — 회사소개 비전(헤드라인 + 여러 문단). lib/about 의 vision 사용
  //   "timeline" — 회사소개 연혁. lib/about 의 timeline 사용
  //   "team"     — 회사소개 팀. lib/about 의 team 사용
  //   "hero"     — 첫 화면. 상단(회사명+헤드라인) / 중앙(이미지) / 하단(안내) 3단 구성
  //   "tech"     — 기술 대주제의 한 섹션. techKey 로 어떤 섹션인지 지정. lib/technology 사용
  variant?:
    | "contact"
    | "hc"
    | "mfg"
    | "vision"
    | "timeline"
    | "team"
    | "hero"
    | "tech"
    | "ach"
    | "careers";
  techKey?: "intro" | "bridge" | "pipeline" | "gate" | "arch" | "research";
  achKey?: "patents" | "papers" | "certs" | "projects"; // variant "ach"
  html?: string; // variant "hc" / "mfg" 일 때 섹션 마크업
  kicker?: string;
  title: string;
  body?: string;
  points?: string[];
};

export type FlowRow = {
  id: string;
  label: string; // 좌측 세로 인덱스에 표시
  panels: FlowPanel[]; // [0] = 대주제 첫 화면
};

export const flowRows: FlowRow[] = [
  {
    id: "home",
    label: "부트캠프",
    panels: [{ variant: "hero", title: "" }],
  },
  {
    id: "about",
    label: "회사소개",
    // 비전 → 연혁 → 팀. 데이터는 lib/about (기존 /about 페이지와 동일 출처).
    panels: [
      { variant: "vision", title: "비전" },
      { variant: "timeline", title: "연혁" },
      { variant: "team", title: "팀" },
    ],
  },
  {
    id: "healthcare",
    label: "AI 헬스케어",
    // AIWalker 랜딩페이지의 각 섹션을 한 화면씩 가로 패널로. (scripts/build_hc_sections.py 생성)
    // hero → 기능 4개 → 검증 → 걸어온 길 → FAQ → 도입 문의. 좌클릭으로 오른쪽 넘김.
    panels: hcSections.map((s) => ({ variant: "hc" as const, html: s.html, title: s.label })),
  },
  {
    id: "manufacturing",
    label: "제조 AX",
    // 제조 AX 랜딩페이지의 각 섹션을 한 화면씩 가로 패널로. (scripts/build_mfg_sections.py 생성)
    // hero → 전환 → 기술 5개 → 부트캠프 역할 → 컨소시엄 → 과제 → 사업화 → 협업 문의.
    panels: mfgSections.map((s) => ({ variant: "mfg" as const, html: s.html, title: s.label })),
  },
  {
    id: "technology",
    label: "기술",
    // 인트로 → 두 사업 비교 → 파이프라인 → 품질 게이트 → 아키텍처 → 연구 기반.
    // 데이터는 lib/technology (기존 /technology 페이지와 동일 출처).
    panels: [
      { variant: "tech", techKey: "intro", title: "" },
      { variant: "tech", techKey: "bridge", title: "" },
      { variant: "tech", techKey: "pipeline", title: "" },
      { variant: "tech", techKey: "gate", title: "" },
      { variant: "tech", techKey: "arch", title: "" },
      { variant: "tech", techKey: "research", title: "" },
    ],
  },
  {
    id: "achievements",
    label: "성과·인증",
    // 특허 → 논문·기술이전 → 시험·검증 → 수행과제·언론. 데이터는 lib/achievements.
    panels: [
      { variant: "ach", achKey: "patents", title: "" },
      { variant: "ach", achKey: "papers", title: "" },
      { variant: "ach", achKey: "certs", title: "" },
      { variant: "ach", achKey: "projects", title: "" },
    ],
  },
  {
    id: "careers",
    label: "채용",
    panels: [{ variant: "careers", title: "" }],
  },
  {
    // 맨 아래 화면 = 회사정보(예전 푸터와 동일). FlowDeck 에서 variant 로 특수 렌더.
    id: "contact",
    label: "회사정보",
    panels: [
      {
        variant: "contact",
        kicker: "회사정보 · 문의",
        title: "협력을 시작합니다.",
      },
    ],
  },
];
