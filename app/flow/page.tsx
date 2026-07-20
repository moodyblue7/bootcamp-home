import type { Metadata } from "next";

import FlowDeck from "@/components/flow/FlowDeck";

// 원페이지(2D 격자) 프로토타입. 기존 8개 페이지와 별개 경로(/flow).
// FlowDeck 이 fixed inset-0 z-[60] 로 화면을 덮으므로 RootLayout 의 Header/Footer 위에 올라온다.
// 인터랙션이 확정되면 route group 으로 레이아웃을 깔끔히 분리한다.

export const metadata: Metadata = {
  title: "부트캠프 — 원페이지 뷰",
  description: "세로로 사업을 둘러보고, 각 사업은 오른쪽으로 넘겨 자세히 보는 원페이지 뷰입니다.",
};

export default function FlowPage() {
  return <FlowDeck />;
}
