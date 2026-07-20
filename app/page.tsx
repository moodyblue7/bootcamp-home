import type { Metadata } from "next";

import FlowDeck from "@/components/flow/FlowDeck";

// 첫 접속 화면(루트)을 원페이지(2D 격자) flow 로 한다.
// FlowDeck 이 fixed inset-0 z-[60] 로 화면을 덮으므로 RootLayout 의 Header/Footer 위에 올라온다.
// (기존 다중 페이지 /about, /healthcare … 는 그대로 남아 직접 URL 로 접근 가능)

export const metadata: Metadata = {
  title: "(주)부트캠프 — 센서 데이터를 검증된 AI 서비스로",
  description:
    "AI 헬스케어에서 4년간 쌓은 수집·품질검증·알고리즘·공인시험·실증 역량을 제조 AX로 확장하는 AI 기술기업. 세로로 사업을 둘러보고, 각 사업은 오른쪽으로 넘겨 자세히 보세요.",
};

export default function HomePage() {
  return <FlowDeck />;
}
