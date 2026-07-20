import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { company } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.domain),
  title: {
    default: "(주)부트캠프 — 센서 데이터를 검증된 AI 서비스로",
    template: "%s | (주)부트캠프",
  },
  description:
    "부트캠프는 보행 센서 데이터 기반 근육건강 스크리닝(AI 헬스케어)과 제조 현장 AX를 함께 수행하는 AI 기술기업입니다. 수집·품질검증·알고리즘·공인시험·현장 실증까지 직접 해냅니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: company.nameShort,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
