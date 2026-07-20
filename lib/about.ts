// 회사소개 페이지 콘텐츠.
// 출처: docs/02-copy-home-about.md (승인 완료), docs/01-facts.md (사실 원장)
//
// 주의:
//  - 비전 헤드라인은 제품소개서 원문 그대로다. 임의로 손대지 않는다.
//  - 대표 프로필은 B안(역량 서사형) 확정본이다.
//  - 겸임교수 직함은 표기하지 않는다. CTO의 조선대 조교수는 표기한다.

export const vision = {
  headline: ["모바일 하나로 만드는 고령자의 건강관리 습관,", "건강한 사회를 준비합니다."],
  body: [
    "부트캠프는 2022년 광주에서 시작했습니다.",
    "우리는 논문이나 시제품에서 멈추지 않는 것을 원칙으로 삼았습니다. 4년간 고령자 1,000여 명의 보행데이터를 직접 모았고, 그 데이터로 만든 알고리즘을 공인시험기관을 통해 성적서로 확인하고, 지금은 실제 생활체육시설에 장비를 통해 검증하고 있습니다.",
    "이 과정에서 얻은 것은 보행 알고리즘 하나가 아니라, 센서 데이터를 현장이 신뢰할 수 있는 서비스로 바꾸는 방법 자체였습니다. 그래서 우리는 그 역량을 제조 현장으로 넓히고 있습니다. 고령자의 걸음을 읽던 기술은, 공장 설비의 신호를 읽는 일과 뿌리가 같습니다. 데이터로 움직이는 제조 현장 또한, 우리가 같은 기술로 준비하는 일입니다.",
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

export const team = [
  {
    name: "김민석",
    role: "대표이사",
    body: [
      "26년간 소프트웨어를 만들고, 그 소프트웨어가 어디로 가야 하는지를 기획해 왔습니다.",
      "가전·전기전자 산업의 개발 현장과 기술기획을 오가며 쌓은 역량입니다. GIST 연구원을 거쳐 2022년 부트캠프를 설립했고, 약 16.4억 원 규모의 정부 R&D 과제를 직접 기획하고 총괄했습니다.",
    ],
  },
  {
    name: "Lismer Andres Caceres Najarro",
    role: "CTO",
    body: [
      "GIST 전기전자컴퓨터공학 박사. 조선대학교 조교수를 겸하고 있으며, 머신러닝 분야 SCI 논문을 다수 발표했습니다.",
      "부트캠프의 AI 알고리즘 설계를 총괄합니다.",
    ],
  },
] as const;
