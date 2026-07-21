// 사이트 전역에서 쓰는 회사 정보와 카피.
// 출처: docs/01-facts.md (사실 원장), docs/02-copy-home-about.md (승인된 카피)
// 여기 없는 숫자는 페이지에서 만들어 쓰지 않는다.

export const company = {
  nameKo: "주식회사 부트캠프",
  nameShort: "(주)부트캠프",
  nameEn: "BOOTCAMP Co., Ltd.",
  ceo: "김민석",
  founded: "2022년 6월 24일",
  bizNo: "808-88-02526",
  address: "광주광역시 남구 효덕로 277, 인성관 2층 202호 (진월동, 광주대학교)",
  email: "bootcamp.co.ltd@gmail.com",
  tel: "062-674-4911",
  domain: "https://aiwalker.co.kr",
} as const;

export const nav = [
  { href: "/about/", label: "회사소개" },
  { href: "/healthcare/", label: "AI 헬스케어" },
  { href: "/manufacturing/", label: "제조 AX" },
  { href: "/technology/", label: "기술" },
  { href: "/achievements/", label: "성과·인증" },
  { href: "/careers/", label: "채용" },
  { href: "/contact/", label: "문의" },
] as const;

export const hero = {
  headline: ["부트캠프는 센서 데이터를,", "현장이 신뢰하는 AI 서비스로 만듭니다."],
  sub: "사람의 걸음과 생산라인의 데이터를 수집하고 품질을 검증해, 건강관리 신호와 생산 품질 신호로 바꿉니다.",
  note: "AI 헬스케어 4년 · 제조 AX 신규 진출 · 광주광역시",
} as const;

export const businesses = [
  {
    href: "/healthcare/",
    eyebrow: "AI 헬스케어",
    title: "걷기만 하면 되는 근육건강 스크리닝",
    body: "스마트폰과 IMU 센서가 보행을 읽고, 경량 AI가 근육건강 신호를 알려줍니다. 착용도 조작도 없습니다.",
    tags: ["AIWALKER 엔진", "AI 근육건강 체크존", "실버케어링크"],
  },
  {
    href: "/manufacturing/",
    eyebrow: "제조 AX",
    title: "구축이 아니라, 확산까지 책임집니다",
    body: "AI를 공장에 넣는 것보다 어려운 건 여러 거점으로 퍼뜨리고 운영하는 일입니다. 부트캠프는 그 Roll-out을 맡습니다.",
    tags: ["Smart EMS Package", "AAS/OPC-UA 표준연동", "다거점 확산 SOP"],
  },
] as const;

// 근거: docs/01-facts.md. 매출은 게재하지 않는다(CLAUDE.md 결정).
type Stat = { display: string; label: string; note: string };

export const stats: readonly Stat[] = [
  { display: "16.4억원", label: "정부 R&D 과제", note: "누적 직접 기획·수행" },
  { display: "6건", label: "특허", note: "등록 1건 · 출원 5건" },
  { display: "5편", label: "논문", note: "SCI 1편 · KCI 4편" },
  { display: "1,000여명", label: "누적 인체 데이터", note: "4년간 직접 수집" },
  { display: "검증", label: "KTC 공인시험", note: "보행분석 AI 알고리즘" },
  { display: "2개소", label: "공공시설 실증", note: "서구체육회 · K-하이테크플랫폼" },
];

export const trust = {
  headline: "검증된 곳에서만 이야기합니다",
  items: [
    "KTC 공인시험성적서",
    "KCT 성적서",
    "STA 데이터품질검증",
    "기술임치",
    "보건복지부 IRB",
  ],
  partners: [
    "GIST",
    "전남대학교",
    "전남대학교병원",
    "광주대학교",
    "조선대학교",
    "동강대학교",
    "순천대학교",
    "광주테크노파크",
    "광주 서구체육회",
    "광주 서구시설관리공단",
    "광주광역시 스포츠과학연구원",
  ],
} as const;

export const news = [
  {
    date: "2026.02",
    title: "IEEE Internet of Things Journal 논문 게재",
    note: "Location-Aware Deep Learning Models for Smartphone-Based Activity Recognition in Elderly Populations",
  },
  {
    date: "2026.06",
    title: "중기부 신속상용화 과제 착수 — Smart EMS Package 1.0",
    note: "제조 AX 사업 진출",
  },
  {
    date: "2026",
    title: "보행 패턴 분석 특허 등록",
    note: "특허 제10-2929814호",
  },
] as const;
