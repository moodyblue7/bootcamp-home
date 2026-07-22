// 회사소개 페이지 콘텐츠.
// 출처: docs/02-copy-home-about.md (승인 완료), docs/01-facts.md (사실 원장)
//
// 주의:
//  - 비전 카피는 2026-07-22 사용자 승인본이다.
//  - 대표 프로필은 B안(역량 서사형) 확정본이다.
//  - 겸임교수 직함은 표기하지 않는다. CTO의 조선대 조교수는 표기한다.

export const vision = {
  headline: ["헬스케어에서 검증한 센서 AI,", "제조 현장으로 확장합니다."],
  body: [
    "㈜부트캠프는 센서 데이터의 수집·품질검증부터 AI 모델 설계·공인시험·현장 실증까지 하나의 파이프라인으로 수행하는 AI 기술기업입니다.",
    "2022년 광주에서 설립된 이후, 4년간 고령자 1,000여 명의 보행 데이터를 직접 수집했습니다. AIWALKER 알고리즘의 KTC 공인시험 성적서를 확보하고, 생활체육 현장에서 데이터 수집과 통합 분석까지 수행하며 연구 결과를 실제 서비스로 연결해 왔습니다.",
    "이 과정에서 축적한 핵심은 보행 알고리즘 하나가 아니라, 센서 데이터를 현장이 신뢰할 수 있는 판단 신호로 바꾸는 방법입니다. 같은 기술 코어를 SMT 생산라인의 설비·검사 데이터에 적용해 생산 품질과 운영 효율을 관리하는 제조 AX로 확장하고 있습니다.",
  ],
} as const;

type TimelineItem = { month?: string; title: string; note?: string; key?: boolean };
type TimelineYear = { year: string; items: TimelineItem[] };

// key: true 는 그 해의 분기점. 강조 표시된다.
export const timeline: readonly TimelineYear[] = [
  {
    year: "2022",
    items: [
      { month: "06", title: "(주)부트캠프 설립", note: "광주광역시 남구", key: true },
      { title: "예비창업패키지 선정(창업진흥원)", note: "EMS 모듈 시제품 개발" },
      { month: "11", title: "「고령자의 보행 패턴 분석 방법」 특허 출원" },
      { title: "국제학술대회(ICET) 논문 발표", note: "스마트폰 기반 낙상 감지 알고리즘" },
    ],
  },
  {
    year: "2023",
    items: [
      { title: "창업성장기술개발 디딤돌 사업 선정(중소벤처기업부)" },
      { month: "10", title: "「근육 감소량 정량화 장치」 특허 출원" },
      {
        month: "11",
        title: "한국융합과학회지 논문 게재",
        note: "보행속도에 따른 고령자 건강지표 설계",
      },
    ],
  },
  {
    year: "2024",
    items: [
      { title: "초기창업패키지 사업 선정(창업진흥원)" },
      { title: "산학연 Collabo R&D 예비과제 선정 「근감소증 AI 플랫폼」 착수" },
      { title: "인체 대상 데이터 수집 본격화", note: "보건복지부 공용 IRB 확보" },
      {
        month: "08",
        title: "KTC 공인시험성적",
        note: "AIWALKER 보행분석 AI 알고리즘 신뢰성 확보",
        key: true,
      },
      { title: "AI Walker 앱 구글 플레이스토어 등록" },
    ],
  },
  {
    year: "2025",
    items: [
      {
        month: "04",
        title: "산학연 Collabo R&D 본 사업 선정(중소벤처기업부)",
      },
      { title: "광주대학교 낙상 예방 특허 통상실시권 기술이전" },
      { title: "근감소증 스크리닝 관련 특허 3건 출원" },
      { title: "한국정보기술학회논문지 논문 2편 게재" },
    ],
  },
  {
    year: "2026",
    items: [
      { month: "02", title: "IEEE Internet of Things Journal 논문 게재", key: true },
      { title: "「고령자의 보행 패턴 분석 방법」 특허 등록", note: "제10-2929814호" },
      {
        month: "04",
        title: "창업도약패키지 사업 선정(창업진흥원)",
        key: true,
      },
      {
        month: "06",
        title: "중기부 신속상용화 과제 착수 — Smart EMS Package 1.0",
        note: "제조 AX 사업 진출",
        key: true,
      },
      {
        title: "생활체육 현장 실증 — 파크골프장 데이터 수집",
        note: "고령자 300명 규모 · 서구체육회 등 확산 준비",
      },
    ],
  },
];

export const teamSection = {
  label: "About · Leadership",
  headline: "기술을 설계하고, 현장까지 책임지는 리더십",
  lead: "부트캠프는 소프트웨어 개발·R&D 사업화 경험과 센서 데이터 분석·AI 모델 설계 역량을 중심으로,\n대학·공인시험기관·실증기관·제조 컨소시엄과 함께 기술을 현장 서비스로 완성합니다.",
  executionTitle: "협력으로 확장하는 실행 체계",
  executionItems: [
    "대학 연구 협력",
    "KTC 공인시험",
    "생활체육 현장 실증",
    "제조 컨소시엄 공동 수행",
  ],
} as const;

export const team = [
  {
    name: "김민석",
    role: "대표이사",
    focus: "기술기획 · 제품화 · 현장 실행",
    description:
      "26년간의 소프트웨어 개발·기술기획 경험을 바탕으로 정부 R&D 기획부터 제품화, 공인시험, 현장 실증과 제조 AX 확장을 총괄합니다.",
    facts: [
      "소프트웨어 개발·기술기획 26년",
      "약 16.4억원 규모 정부 R&D 기획·총괄",
      "GIST 연구원 출신",
    ],
  },
  {
    name: "Lismer Andres Caceres Najarro",
    role: "CTO",
    focus: "센서 데이터 분석 · AI 모델 설계 · 기술 검증",
    description:
      "스마트폰과 설비에서 수집되는 센서 데이터를 분석하고 현장에 적용할 AI 모델을 설계·검증하며, AIWALKER를 비롯한 부트캠프의 AI 알고리즘 개발을 총괄합니다.",
    facts: [
      "GIST 전기전자컴퓨터공학 박사",
      "조선대학교 조교수",
      "머신러닝 분야 SCI 논문 다수",
    ],
  },
] as const;
