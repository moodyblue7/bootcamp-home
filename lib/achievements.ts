// 성과·인증 페이지 콘텐츠.
// 출처: docs/01-facts.md (사실 원장). **여기 없는 항목은 절대 추가하지 않는다.**
//
// ⚠️ 게재 규정 (CLAUDE.md):
//  - 특허 명칭 3·4번에 "진단"이 들어가지만 이는 특허 원문이다. 원문 그대로 표기하되,
//    서비스 설명 카피에서는 "진단"을 쓰지 않는다.
//  - 신속상용화 SW개발비 등 예산 세부 수치는 게재 금지.
//  - 언론보도는 스캔본 재게재 금지. 원문 링크로만 연결한다.
//  - ISMS-P·ISO 27001 은 미보유. 인증 목록에 넣지 않는다.

export const patents = {
  registered: [
    {
      no: "제10-2929814호",
      title:
        "고령자의 보행 패턴 분석 방법, 그리고 분석된 보행 패턴을 이용한 보행 보조 장치, 방법 및 시스템",
      appNo: "10-2022-0144219",
      date: "2022.11.02 출원",
    },
  ],
  applied: [
    {
      no: "10-2023-0137831",
      title: "인공지능 학습모델을 이용하여 근육 감소량을 정량화할 수 있는 정량화 장치 및 시스템",
      date: "2023.10.16",
    },
    { no: "10-2025-0002187", title: "근감소증을 진단하는 시스템 및 방법", date: "2025.01.07" },
    { no: "10-2025-0008457", title: "근감소증을 진단하는 장치 및 그 방법", date: "2025.01.21" },
    {
      no: "10-2025-0182544",
      title:
        "온디바이스 AI 및 개인 운동 기록 표준 플랫폼을 이용한 개인 맞춤형 근감소증 예측 및 예방 관리 시스템과 그 방법",
      date: "2025.11.26",
    },
    { no: "10-2026-0020262", title: "AI 기반의 낙상 예방 시스템 및 낙상 예방 방법", date: "2026.02.02" },
  ],
} as const;

export const papers = [
  {
    title:
      "Location-Aware Deep Learning Models for Smartphone-Based Activity Recognition in Elderly Populations",
    journal: "IEEE Internet of Things Journal",
    year: "2026",
    role: "공동",
    grade: "SCI",
    topic: "행동인식",
    doi: "10.1109/JIOT.2025.3636271",
  },
  {
    title: "Skeletal Muscle Ratio Estimation from Gait Signals using a Compact Universal Residual Architecture (CURA)",
    titleKo: "컴팩트 범용 잔차 구조(CURA)를 이용한 보행 신호 기반 골격근 비율 추정",
    authors: "Jae-Bum Seo, Min-Seok Kim, Lismer Andres Caceres-Najarro",
    journal: "한국정보기술학회논문지",
    year: "2026",
    role: "공동연구",
    grade: "KCI",
    topic: "근육건강",
    pages: "p. 239",
    doi: "10.14801/jkiit.2026.24.6.239",
  },
  {
    title:
      "Multi-Position Smartphone Sensor-based Elderly Gait Analysis and Low-Latency Fall Detection Bi-LSTM Model Development",
    journal: "한국정보기술학회논문지",
    year: "2025",
    role: "주저자",
    grade: "KCI",
    topic: "보행·낙상",
  },
  {
    title: "A Lightweight Machine Learning Model for Fall Detection using Feature Vectors",
    journal: "한국정보기술학회논문지",
    year: "2025",
    role: "공동",
    grade: "KCI",
    topic: "낙상감지",
  },
  {
    title: "보행속도에 따른 고령자 건강지표 설계",
    journal: "한국융합과학회지",
    year: "2023",
    role: "교신",
    grade: "KCI",
    topic: "보행·건강지표",
  },
  {
    title:
      "A fall detection Algorithm for thigh mounted smartphone using random forest and feature selection Techniques",
    journal: "ICET (국제학술대회)",
    year: "2022",
    role: "공동",
    grade: "학술대회",
    topic: "낙상감지",
  },
] as const;

// org/date 는 확인된 것만 채운다. 비어 있으면 화면에 표시하지 않는다.
// ("—" 같은 센티널을 쓰면 타입이 꼬이고, 화면에도 빈 줄이 남는다.)
type Certification = { name: string; body: string; org?: string; date?: string };

export const certifications: readonly Certification[] = [
  {
    name: "KTC 시험성적서",
    body: "AIWALKER 보행분석 AI 알고리즘 모델 · 판정 합격",
    org: "한국기계전기전자시험연구원",
    date: "2024.08",
  },
  { name: "KCTL 시험성적서", body: "스코어보드 제품 · 방송통신기자재(전자파적합성) 시험성적" },
  { name: "기술임치", body: "핵심 기술자료 임치" },
  { name: "보건복지부 IRB", body: "인체 대상 연구 승인", org: "보건복지부" },
];

export const techTransfer = [
  {
    name: "낙상 예방 특허 통상실시권 이전",
    from: "광주대학교",
    date: "2025",
  },
] as const;

// ⚠️ 게재 방침 (사용자 지시, 2026-07-17):
//  1) 시제품 제작 지원사업과 RISE 사업은 목록에서 뺀다.
//     → AICA AI제품·서비스 제작지원, 조선대학교 RISE 사업 제외.
//  2) **과제 제목은 싣지 않고 사업명 + 사업분야까지만 적는다.**
//     이유: 26년에 동시 수행 중인 과제들(콜라보 / 창업도약 / 창업실증)이 정량목표를 일부
//     공유해, 과제 제목을 나란히 노출하면 사업 중복성 문제로 읽힐 소지가 있다.
//     사업분야 수준으로만 적으면 실적은 보이되 그 리스크가 사라진다.
//  3) 카운터는 과제 "건수"를 쓰지 않고 누적 R&D 수행 규모 "약 37.6억 원"만 표기한다(사용자 지시 2026-07-22).
//     근거: 기존 1,638,188천원에서 신속상용화 부트캠프 수행분 476,660천원을 제외하고
//     24개월 컨소시엄 전체 과제비 2,595,000천원을 반영한 3,756,528천원. 목록은 "주요"로 한정한다.
type Project = { year: string; name: string; note?: string };

export const projects: readonly Project[] = [
  { year: "2022", name: "예비창업패키지", note: "EMS 모듈 개발" },
  { year: "2023", name: "창업성장기술개발 디딤돌", note: "AI 헬스케어 · GIST 협력 · 1.3억 원" },
  { year: "2024", name: "초기창업패키지", note: "AI 헬스케어 · 순천대학교 주관 · 1.2억 원" },
  {
    year: "2024",
    name: "산학연 Collabo R&D",
    note: "AI 헬스케어 · 3.16억 원 · 파크골프장 현장 데이터 수집 완료",
  },
  { year: "2026", name: "창업도약패키지", note: "AI 헬스케어 · 수행 중" },
  {
    year: "2026",
    name: "광주테크노파크 창업기업 제품실증지원사업",
    note: "AI 헬스케어 실증 · 수행 중",
  },
  {
    year: "2026",
    name: "중소벤처기업부 신속상용화 기술개발",
    note: "제조 AX · Roll-out Kit SW 개발 주도 · 2026.06 ~ 2028.06",
  },
];

// 스캔본 재게재 금지. 반드시 원문 링크로만.
export const press = [
  {
    outlet: "한경 JOB&JOY",
    date: "2024.10.24",
    title:
      "[순천대학교 2024년 초기창업패키지 선정기업] 고령자용 스마트폰 센서 기반 보행분석 서비스를 제공하는 '부트캠프'",
    note: "대표 인터뷰 단독 기사",
    url: "https://magazine.hankyung.com/job-joy/article/202410247903d",
  },
  {
    outlet: "머니투데이",
    date: "2024.11.11",
    title: "스타트업·공공기관 협력으로 사회 혁신, 2024 K-혁신프로젝트 오픈이노베이션 개최",
    note: "스타트폴리오·국민연금공단 주최 · 참여 스타트업 18개사 중 하나로 참여",
    url: "https://n.news.naver.com/article/008/0005112929?sid=101",
  },
  {
    outlet: "캐어유뉴스",
    date: "2024.11.09",
    title: "2024 K-혁신 프로젝트 오픈 이노베이션 개최 예정",
    note: "「시니어 건강혁신 프로젝트」 참여기업으로 소개",
    url: "https://www.careyounews.org/news/articleView.html?idxno=462",
  },
] as const;
