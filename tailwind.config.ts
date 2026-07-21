import type { Config } from "tailwindcss";

// 색상은 CI 원본에서 추출한 값이다. docs/01-facts.md 참조.
//   심볼 그라데이션: cyan #00FFFF -> blue #0000FF (PDF ShadingType 2 원본값)
//   워드마크: #17232E
// 웹에서는 원본 그대로 쓰면 채도가 너무 높아 눈이 아프므로,
// 그라데이션 양 끝을 살짝 눌러 brand.cyan/brand.blue 로 쓴다.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#17232E",
          50: "#F4F6F8",
          100: "#E4E8EC",
          200: "#C7CFD7",
          400: "#6B7A88",
          600: "#3A4956",
          900: "#0E161E",
        },
        brand: {
          cyan: "#00CFF0",
          blue: "#0B3FD8",
          deep: "#0026E6",
        },
      },
      fontFamily: {
        // 본문 기본. 작은/중간 글자는 이걸 쓴다.
        sans: [
          "Freesentation",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Malgun Gothic",
          "맑은 고딕",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
        // 큰 제목용. font-display 로 지정.
        display: [
          "S-Core Dream",
          "Freesentation",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
      },
      // 사용자 지정 타이포 스케일: 작은 18+ / 중간 24 / 큰 36·48
      fontSize: {
        small: ["1.125rem", { lineHeight: "1.7" }], // 18
        mid: ["1.5rem", { lineHeight: "1.5" }], // 24
        big: ["2.25rem", { lineHeight: "1.25" }], // 36
        huge: ["3rem", { lineHeight: "1.2" }], // 48
        // 홈페이지 공통 타이포그래피. 화면별 임의 크기 대신 역할 기준으로 사용한다.
        "display-hero": [
          "clamp(2.5rem, 4.4vw, 3.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.035em" },
        ],
        "display-section": [
          "clamp(2rem, 3.6vw, 3rem)",
          { lineHeight: "1.25", letterSpacing: "-0.03em" },
        ],
        "heading-card": [
          "1.5rem",
          { lineHeight: "1.4", letterSpacing: "-0.02em" },
        ],
        "body-lead": [
          "clamp(1.125rem, 1.7vw, 1.375rem)",
          { lineHeight: "1.7", letterSpacing: "-0.01em" },
        ],
        "body-base": [
          "clamp(1rem, 1.2vw, 1.125rem)",
          { lineHeight: "1.85" },
        ],
        label: [
          "0.875rem",
          { lineHeight: "1.5", letterSpacing: "0.18em" },
        ],
      },
      maxWidth: {
        content: "72rem",
        copy: "48rem",
      },
    },
  },
  plugins: [],
};

export default config;
