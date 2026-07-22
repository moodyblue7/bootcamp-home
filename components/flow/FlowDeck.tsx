"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Leadership from "@/components/about/Leadership";
import { timeline, vision } from "@/lib/about";
import { certifications, papers, patents, press, projects, techTransfer } from "@/lib/achievements";
import { flowRows } from "@/lib/flow";
import { hcCss } from "@/lib/hcContent.generated";
import { mfgCss } from "@/lib/mfgContent.generated";
import { company } from "@/lib/site";
import { tech } from "@/lib/technology";

/**
 * 2D 격자 원페이지 뷰. (레퍼런스: whereisrussell.com)
 *
 * 세로 = 대주제(row), 가로 = 세부(panel). CSS scroll-snap 중첩.
 *  - 세로: 마우스 휠·터치·좌측 인덱스로 대주제 이동.
 *  - 가로: **화면 좌클릭**으로 다음 세부로 이동. 맨 끝에서 클릭하면 첫 세부로 순환.
 *          세부가 더 있으면 커서가 손 모양(cursor-pointer)으로 바뀐다. 별도 버튼 없음.
 *  - panel 내부는 세로 overflow-auto 라 내용이 길면 그 안에서 스크롤된다.
 *
 * 좌클릭이 이동이라, 링크·버튼 등 상호작용 요소 클릭은 이동에서 제외한다(아래 onClick 참조).
 * 텍스트 드래그 선택도 이동으로 오인되지 않게 처리한다.
 */
export default function FlowDeck() {
  const vScrollRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]); // <section> = HTMLElement
  const [activeRow, setActiveRow] = useState(0);
  const [activeCols, setActiveCols] = useState<number[]>(() => flowRows.map(() => 0));
  // 터치 기기(모바일) 감지. 서브화면 세로 잠금은 데스크톱(마우스 휠)에서만 적용하고,
  // 모바일에서는 세로 스크롤이 항상 동작하게 둔다 — 중첩 스크롤과 잠금이 터치와 충돌해
  // 스크롤이 끊기던 문제를 없앤다.
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const idx = flowRows.findIndex((r) => r.id === id);
    if (idx > 0) {
      rowRefs.current[idx]?.scrollIntoView({ behavior: "auto" });
      setActiveRow(idx);
    }
  }, []);

  const onVScroll = useCallback(() => {
    const el = vScrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setActiveRow((prev) => {
      if (prev !== idx && flowRows[idx]) {
        const id = flowRows[idx].id;
        history.replaceState(null, "", id === "home" ? "#" : `#${id}`);
      }
      return idx;
    });
  }, []);

  // 가로 이동은 "스크롤"이 아니라 상태 + transform 으로 한다.
  //  → 가로 스크롤 컨테이너가 없어지므로, iOS(WebKit)에서 가로가 세로 스크롤을 잡아먹던
  //    축 충돌이 원천적으로 사라진다. 세로는 계속 네이티브 스크롤을 쓴다.
  const setCol = useCallback((rowIdx: number, updater: (cur: number, total: number) => number) => {
    setActiveCols((prev) => {
      const total = flowRows[rowIdx].panels.length;
      if (total <= 1) return prev;
      const cur = prev[rowIdx] ?? 0;
      const next = updater(cur, total);
      if (next === cur) return prev;
      const arr = [...prev];
      arr[rowIdx] = next;
      return arr;
    });
  }, []);

  // 좌클릭(데스크톱): 다음 세부로. 끝이면 첫 세부로 순환.
  const cycleCol = useCallback(
    (rowIdx: number) => setCol(rowIdx, (cur, total) => (cur >= total - 1 ? 0 : cur + 1)),
    [setCol],
  );

  // 특정 대주제(row id)로 세로 이동. 내부 메뉴·로고·랜딩의 해시 링크가 쓴다.
  const goToRow = useCallback((id: string) => {
    const idx = flowRows.findIndex((r) => r.id === id);
    const el = vScrollRef.current;
    if (idx < 0 || !el) return;
    el.style.overflowY = "scroll"; // 세로 잠금을 잠시 풀어 이동 가능하게
    rowRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
    setActiveRow(idx);
  }, []);

  // 모바일: 좌우 스와이프로 세부 이동. 세로 제스처는 건드리지 않아(preventDefault 없음)
  // 네이티브 세로 스크롤이 그대로 동작한다.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const s = touchStart.current;
      touchStart.current = null;
      if (!s) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      // 가로로 충분히(50px 이상), 그리고 세로보다 뚜렷하게 움직였을 때만 세부 이동
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      setCol(activeRow, (cur, total) =>
        dx < 0 ? Math.min(cur + 1, total - 1) : Math.max(cur - 1, 0),
      );
    },
    [activeRow, setCol],
  );

  // 세로로 새 대주제에 진입하면 그 대주제는 항상 첫 화면(col 0)부터 연다.
  useEffect(() => {
    setActiveCols((cols) =>
      cols[activeRow] === 0 ? cols : cols.map((c, i) => (i === activeRow ? 0 : c)),
    );
  }, [activeRow]);

  // 좌우 화살표키로도 세부 이동 (접근성 보조)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") cycleCol(activeRow);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeRow, cycleCol]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        // 해시 링크(#healthcare, #contact 등)는 flow 의 해당 대주제 화면으로 보낸다.
        // (랜딩페이지의 도입 문의·협업 문의, 회사정보의 바로가기 메뉴 모두 여기로 처리)
        const link = (e.target as HTMLElement).closest("a");
        if (link) {
          const href = link.getAttribute("href") ?? "";
          if (href.startsWith("#")) {
            const id = href.slice(1) || "home"; // "#" 만 있으면 첫 화면
            if (flowRows.some((r) => r.id === id)) {
              e.preventDefault();
              goToRow(id);
            }
          }
          return; // 그 외 링크(옛 페이지 경로 등)는 기본 동작 존중
        }
        // 버튼·아코디언(details/summary) 등 상호작용 요소 클릭은 존중하고 이동하지 않는다
        if (
          (e.target as HTMLElement).closest("button,input,textarea,select,label,summary,details")
        )
          return;
        // 텍스트를 드래그해 선택 중이면 이동하지 않는다
        if (window.getSelection()?.toString()) return;
        // 모바일(터치)은 세로 스크롤로만 이동한다 — 탭으로 가로 넘김은 데스크톱 전용
        if (isTouch) return;
        cycleCol(activeRow);
      }}
    >
      {/* 랜딩페이지 섹션용 스코프 CSS (.hc = 헬스케어, .mfg = 제조 AX) */}
      <style dangerouslySetInnerHTML={{ __html: hcCss }} />
      <style dangerouslySetInnerHTML={{ __html: mfgCss }} />
      {/* 상단 오버레이 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToRow("home");
          }}
          className="pointer-events-auto"
          aria-label="첫 화면으로"
        >
          <img src="/logo/bootcamp-logo-ko.svg" alt="(주)부트캠프" className="h-7 w-auto" />
        </button>
      </div>

      {/* 좌측 세로 인덱스 */}
      <nav
        aria-label="대주제"
        className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
      >
        <ul className="space-y-3">
          {flowRows.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => rowRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
                className="group flex items-center gap-2.5"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    activeRow === i ? "brand-gradient w-5" : "bg-navy-200 group-hover:bg-navy-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-colors ${
                    activeRow === i ? "text-navy" : "text-navy-400 group-hover:text-navy-600"
                  }`}
                >
                  {r.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 세로 스냅 컨테이너 — 세로는 네이티브 스크롤(모바일·데스크톱 공통).
          가로는 스크롤이 아니라 transform 이라 축 충돌이 없다.
          데스크톱에서는 세부(col ≥ 1)에서 세로를 잠가 화면 끝에서 멈추게 한다(마우스 휠 기준). */}
      <div
        ref={vScrollRef}
        onScroll={onVScroll}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-none"
        style={
          isTouch ? undefined : { overflowY: (activeCols[activeRow] ?? 0) > 0 ? "hidden" : "scroll" }
        }
      >
        {flowRows.map((row, ri) => {
          const multi = row.panels.length > 1;
          return (
            <section
              key={row.id}
              id={row.id}
              ref={(el) => {
                rowRefs.current[ri] = el;
              }}
              className="relative h-full snap-start overflow-hidden"
            >
              {/* 가로 트랙 — 스크롤 컨테이너가 아니라 transform 으로 이동한다.
                  각 패널이 폭 100% 이므로 col 당 -100% 씩 밀면 된다. */}
              <div
                data-htrack
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${(activeCols[ri] ?? 0) * 100}%)` }}
              >
                {row.panels.map((p, pi) => (
                  <article
                    key={pi}
                    // items-[safe_center]: 콘텐츠가 화면보다 크면 위쪽부터 정렬(스크롤로 접근),
                    //   작으면 세로 중앙. 그냥 items-center 면 긴 콘텐츠의 위가 잘린다.
                    // 세부가 여러 개인 대주제에서는 커서를 손 모양으로 = 넘길 수 있다는 힌트.
                    className={`relative flex h-full w-full shrink-0 items-[safe_center] overflow-y-auto ${
                      multi ? "lg:cursor-pointer" : ""
                    }`}
                  >
                    {p.variant === "hc" ? (
                      // AIWalker 섹션을 직접 렌더. .hc 스코프 CSS 가 디자인을 격리한다.
                      <div
                        // lg:pl-32 로 좌측 인덱스 공간 확보(AIWalker 자체 레이아웃 위에 얹힘)
                        className="hc min-h-full w-full lg:pl-32"
                        dangerouslySetInnerHTML={{ __html: p.html ?? "" }}
                      />
                    ) : p.variant === "mfg" ? (
                      // 제조 AX 섹션을 직접 렌더. .mfg 스코프 CSS 로 격리.
                      <div
                        className="mfg min-h-full w-full lg:pl-32"
                        dangerouslySetInnerHTML={{ __html: p.html ?? "" }}
                      />
                    ) : p.variant === "contact" ? (
                      <CompanyPanel title={p.title} kicker={p.kicker} />
                    ) : p.variant === "hero" ? (
                      <HeroPanel />
                    ) : p.variant === "vision" ? (
                      <VisionPanel />
                    ) : p.variant === "timeline" ? (
                      <TimelinePanel />
                    ) : p.variant === "team" ? (
                      <TeamPanel />
                    ) : p.variant === "tech" ? (
                      <TechPanel section={p.techKey ?? "intro"} />
                    ) : p.variant === "ach" ? (
                      <AchievementsPanel section={p.achKey ?? "patents"} />
                    ) : p.variant === "careers" ? (
                      <CareersPanel />
                    ) : (
                      <div className="mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12">
                        {p.kicker && (
                          <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">
                            {p.kicker}
                          </p>
                        )}
                        <h2 className="mt-5 whitespace-pre-line text-3xl font-bold leading-[1.25] tracking-tight sm:text-4xl lg:text-5xl">
                          {p.title}
                        </h2>
                        {p.body && (
                          <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-600 sm:text-lg">
                            {p.body}
                          </p>
                        )}
                        {p.points && (
                          <ul className="mt-8 space-y-2">
                            {p.points.map((pt) => (
                              <li
                                key={pt}
                                className="flex items-start gap-2.5 text-sm text-navy-600"
                              >
                                <span
                                  className="brand-gradient mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                  aria-hidden="true"
                                />
                                {pt}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {/* 세부 위치 인디케이터(점). 클릭 버튼은 없앴다 — 이동은 우클릭. */}
              {multi && (
                <div className="pointer-events-none absolute bottom-8 right-6 z-20 flex items-center gap-3 lg:right-10">
                  <span className="text-[0.65rem] font-medium text-navy-400">
                    <span className="lg:hidden">옆으로 밀어 넘기기</span>
                    <span className="hidden lg:inline">클릭으로 넘기기</span>
                  </span>
                  <div className="flex gap-1.5">
                    {row.panels.map((_, pi) => (
                      <span
                        key={pi}
                        className={`h-1.5 rounded-full transition-all ${
                          activeCols[ri] === pi ? "brand-gradient w-5" : "w-1.5 bg-navy-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** 첫 화면 — 상단(회사명+헤드라인) / 중앙(이미지) / 하단(안내) 3단 구성.
 *  타이포: 회사명·본문·안내 = Freesentation(font-sans), 헤드라인 = S-Core Dream(font-display). */
function HeroPanel() {
  return (
    <div className="flow-panel flex min-h-full flex-col justify-between">
      {/* 상단: 헤드라인 + 설명 */}
      <div>
        <h1 className="flow-hero-title">
          <span className="text-brand-blue">부트캠프는</span> 센서 데이터를,
          <br />
          현장이 신뢰하는 AI 서비스로 만듭니다.
        </h1>
        <p className="flow-body mt-6">
          사람의 걸음과 생산라인의 데이터를 수집하고 품질을 검증해,
          <br />
          건강관리 신호와 생산 품질 신호로 바꿉니다.
        </p>
      </div>

      {/* 중앙: 대표 이미지 (사용자 제작 예정 — public/images/hero-main.jpg 로 교체) */}
      <div className="my-10">
        <div className="relative aspect-[16/7] overflow-hidden rounded-3xl border border-navy-100 bg-navy-50">
          {/* 뒤: 이미지 없을 때 보이는 안내 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-navy-400">
            <span className="text-mid">🖼️</span>
            <span className="text-small font-semibold">대표 이미지 자리</span>
            <span className="text-xs">public/images/hero-main.jpg</span>
          </div>
          {/* 앞: 이미지 로드 성공 시 안내를 덮는다. 실패하면 스스로 사라진다. */}
          <img
            src="/images/hero-main.jpg"
            alt="고령자 보행 데이터와 SMT 생산라인 데이터를 AI로 연결하는 부트캠프"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* 하단: 이용 안내 2문장 */}
      <div className="space-y-1.5">
        <p className="text-small text-navy-600">↓ 아래로 스크롤해 사업을 둘러보세요</p>
        <p className="text-small text-navy-600">→ 각 사업의 세부내용은 오른쪽으로 넘겨 자세히 보세요(마우스 클릭)</p>
      </div>
    </div>
  );
}

/** 회사소개 · 비전 — 헤드라인 + 본문 문단들 (데이터: lib/about)
 *  타이포: 헤드라인 = S-Core Dream(font-display), 본문 = Freesentation(font-sans).
 *  위계: 리드 문단 24(text-mid) 강조 / 상세 문단 18(text-small). */
function VisionPanel() {
  const [lead, ...rest] = vision.body;
  return (
    <div className="flow-panel">
      <p className="flow-label">About</p>
      <h2 className="flow-section-title mt-4 whitespace-pre-line">
        {vision.headline.join("\n")}
      </h2>
      <div className="mt-8 max-w-copy space-y-5">
        <p className="flow-lead">{lead}</p>
        {rest.map((p) => (
          <p key={p.slice(0, 16)} className="flow-body">
            {p}
          </p>
        ))}
        <a
          href="#achievements"
          className="flow-link"
        >
          성과와 검증 근거 보기
          <span aria-hidden="true" className="text-brand-blue">
            →
          </span>
        </a>
      </div>
    </div>
  );
}

/** 회사소개 · 연혁 — 연도별 타임라인 (데이터: lib/about)
 *  최근(2026)이 맨 위. 타이포: 제목·연도 = S-Core Dream(font-display), 항목 = Freesentation. */
function TimelinePanel() {
  const years = [...timeline].reverse(); // 최근이 위로
  return (
    <div className="flow-panel">
      <p className="flow-label">About · 연혁</p>
      <h2 className="flow-section-title mt-4">
        센서 AI의 검증에서,
        <br />
        제조 AX의 확장까지.
      </h2>
      <p className="flow-body mt-5">
        2022년 설립 이후 연구·특허·공인시험·현장 실증을 축적하며, 센서 데이터를 현장에서
        작동하는 AI 서비스로 연결해 왔습니다.
      </p>

      <ol className="mt-8 max-w-[56rem] space-y-4">
        {years.map((y, yearIndex) => (
          <li
            key={y.year}
            className={`rounded-2xl border px-5 py-5 sm:px-6 lg:grid lg:grid-cols-[6rem_minmax(0,1fr)] lg:gap-6 ${
              yearIndex === 0 ? "border-brand-blue/15 bg-navy-50" : "border-navy-100 bg-white"
            }`}
          >
            <h3
              className={`font-display text-heading-card font-extrabold tracking-tight ${
                yearIndex === 0 ? "text-brand-blue" : "text-navy"
              }`}
            >
              {y.year}
            </h3>
            <ul className="mt-4 space-y-4 border-l border-navy-200 pl-5 lg:mt-0">
              {y.items.map((it) => (
                <li key={it.title} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[1.55rem] top-[0.65rem] h-2 w-2 rounded-full ring-4 ${
                      it.key
                        ? "bg-brand-blue ring-navy-50"
                        : yearIndex === 0
                          ? "bg-navy-200 ring-navy-50"
                          : "bg-navy-200 ring-white"
                    }`}
                  />
                  <p
                    className={`text-body-base leading-[1.55] ${
                      it.key ? "font-semibold text-navy" : "text-navy-600"
                    }`}
                  >
                    {it.month && (
                      <span className="mr-2 inline-block min-w-9 text-[0.875rem] font-semibold tabular-nums text-navy-400">
                        {it.month}월
                      </span>
                    )}
                    {it.title}
                  </p>
                  {it.note && <p className="mt-1 text-[0.9375rem] leading-relaxed text-navy-400">{it.note}</p>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 회사소개 · 팀 (데이터: lib/about)
 *  타이포: 제목·이름 = S-Core Dream(font-display), 본문 = Freesentation(font-sans). */
function TeamPanel() {
  return <Leadership className="flow-panel" />;
}

/** 기술 대주제 — 섹션별 렌더 (데이터: lib/technology)
 *  타이포: 제목 = S-Core Dream(font-display), 본문 = Freesentation, 크기 토큰 사용. */
const TECH_WRAP = "mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12";

function TechPanel({ section }: { section: string }) {
  if (section === "intro") {
    return (
      <div className="mx-auto w-full max-w-content px-6 py-12 md:px-10 md:py-16 lg:pl-44 lg:pr-12">
        <p className="flow-label">01 · 공통 AI 기술</p>
        <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
          {tech.h1[0]}
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">
            {tech.h1[1]}
            {"\n"}
            {tech.h1[2]}
          </span>
        </h2>
        <p className="mt-5 max-w-4xl whitespace-pre-line text-body-lead text-navy-600">{tech.lead}</p>

        <figure className="mt-7 max-w-[66rem] overflow-hidden rounded-[22px] bg-[#10243A] p-4 shadow-[0_22px_54px_rgba(23,35,46,0.18)] md:mt-8 md:p-5">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <p className="text-[0.7rem] font-bold tracking-[0.14em] text-brand-cyan">
                부트캠프 · 공통 AI 파이프라인
              </p>
              <h3 className="mt-1 font-display text-[1.05rem] font-extrabold text-white md:text-[1.15rem]">
                현장 데이터를 신뢰 가능한 AI 신호로 전환
              </h3>
            </div>
            <p className="hidden text-[0.72rem] font-semibold text-white/45 md:block">
              SOURCES → COMMON CORE → FIELD OUTPUTS
            </p>
          </div>

          <div className="mt-3 grid gap-2.5 md:grid-cols-[7rem_1rem_minmax(0,1fr)_1rem_7rem] md:items-stretch">
            <div className="rounded-xl border border-white/10 bg-[#17314B] p-3">
              <p className="text-[0.67rem] font-bold tracking-[0.1em] text-white/55">INPUT DATA</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 md:grid-cols-1">
                <div className="rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 px-2 py-2 text-center text-[0.82rem] font-bold leading-snug text-[#8EEAF8]">
                  {tech.introFlow.inputs[0]}
                </div>
                <div className="rounded-lg border border-[#6185FF]/30 bg-brand-blue/20 px-2 py-2 text-center text-[0.82rem] font-bold leading-snug text-[#B8C8FF]">
                  {tech.introFlow.inputs[1]}
                </div>
              </div>
            </div>

            <span className="hidden items-center justify-center text-xl font-bold text-brand-cyan md:flex" aria-hidden="true">
              →
            </span>

            <div className="rounded-xl border border-[#2C5479] bg-[#14304B] p-3">
              <p className="text-[0.67rem] font-bold tracking-[0.1em] text-white/55">COMMON AI CORE</p>
              <ol className="mt-2 grid grid-cols-2 gap-1.5 md:grid-cols-4">
                {tech.introFlow.stages.map((stage, index) => {
                  const emphasis = index === 1;
                  return (
                    <li
                      key={stage}
                      className={`flex min-h-[4.25rem] flex-col justify-center rounded-lg border px-2.5 py-2.5 ${
                        emphasis
                          ? "border-brand-cyan/60 bg-brand-blue text-white shadow-[0_8px_20px_rgba(11,63,216,0.3)]"
                          : "border-white/10 bg-[#1B3D5B] text-white"
                      }`}
                    >
                      <span className={`text-[0.68rem] font-bold ${emphasis ? "text-[#A8F2FF]" : "text-brand-cyan"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong className="mt-1 font-display text-[0.92rem] font-extrabold leading-snug md:text-[0.98rem]">
                        {stage}
                      </strong>
                    </li>
                  );
                })}
              </ol>
            </div>

            <span className="hidden items-center justify-center text-xl font-bold text-brand-cyan md:flex" aria-hidden="true">
              →
            </span>

            <div className="rounded-xl border border-white/10 bg-[#17314B] p-3">
              <p className="text-[0.67rem] font-bold tracking-[0.1em] text-white/55">FIELD OUTPUT</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 md:grid-cols-1">
                <div className="rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 px-2 py-2 text-center text-[0.82rem] font-bold leading-snug text-[#8EEAF8]">
                  {tech.introFlow.outputs[0]}
                </div>
                <div className="rounded-lg border border-[#6185FF]/30 bg-brand-blue/20 px-2 py-2 text-center text-[0.82rem] font-bold leading-snug text-[#B8C8FF]">
                  {tech.introFlow.outputs[1]}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#0B3FD8] px-3 py-2 text-[0.78rem] font-semibold leading-snug text-white md:text-[0.82rem]">
            <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[0.62rem] font-extrabold tracking-[0.08em] text-brand-blue">
              KEY POINT
            </span>
            <span>{tech.introFlow.keypoint}</span>
          </div>

          <figcaption className="sr-only">
            보행 데이터와 설비·공정 데이터가 수집, 품질검증, AI 분석, 현장 실증을 거쳐 건강관리 신호와
            생산 품질 신호로 바뀌는 부트캠프의 공통 AI 파이프라인
          </figcaption>
        </figure>
      </div>
    );
  }

  if (section === "bridge") {
    return (
      <div className="mx-auto w-full max-w-content px-6 py-12 md:px-10 md:py-16 lg:pl-44 lg:pr-12">
        <p className="flow-label">02 · 기술 역량의 확장</p>
        <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
          {tech.bridge.flowTitle[0]}
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">{tech.bridge.flowTitle[1]}</span>
        </h2>

        <div className="mt-6 max-w-[66rem] rounded-2xl border border-navy-100 bg-navy-50 p-2.5 shadow-[0_12px_32px_rgba(23,35,46,0.06)] md:mt-7 md:p-3">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="hidden items-center justify-center rounded-xl bg-navy px-3 py-2 text-[0.72rem] font-bold tracking-[0.1em] text-white/65 md:flex">
              공통 과정
            </div>
            <div className="rounded-xl border border-brand-cyan/25 bg-brand-cyan/10 px-3 py-2.5 text-center text-[0.92rem] font-extrabold text-[#007E94]">
              AI 헬스케어
            </div>
            <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/10 px-3 py-2.5 text-center text-[0.92rem] font-extrabold text-brand-blue">
              제조 AX
            </div>
          </div>

          <div className="mt-2 grid gap-2">
            {tech.bridge.rows.map((row) => (
              <div
                key={row.axis}
                className="grid grid-cols-2 gap-2 md:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1fr)]"
              >
                <div className="col-span-2 flex items-center rounded-lg bg-navy px-3 py-1.5 text-[0.76rem] font-bold tracking-[0.04em] text-white md:col-span-1 md:justify-center md:py-2.5 md:text-center">
                  {row.axis}
                </div>
                <div className="flex min-h-12 items-center rounded-lg border border-brand-cyan/20 bg-white px-3 py-2.5 text-[0.9rem] font-semibold leading-[1.45] text-navy-600 md:text-[0.96rem]">
                  {row.healthcare}
                </div>
                <div className="flex min-h-12 items-center rounded-lg border border-brand-blue/15 bg-white px-3 py-2.5 text-[0.9rem] font-semibold leading-[1.45] text-navy-600 md:text-[0.96rem]">
                  {row.manufacturing}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 max-w-[66rem] rounded-r-xl border-l-4 border-brand-blue bg-navy-50 px-5 py-3.5 text-body-base font-semibold text-navy md:mt-6">
          {tech.bridge.close}
        </p>
      </div>
    );
  }

  if (section === "pipeline") {
    return (
      <div className="mx-auto w-full max-w-content px-6 py-12 md:px-10 md:py-16 lg:pl-44 lg:pr-12">
        <p className="flow-label">03 · AI 서비스화 파이프라인</p>
        <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
          {tech.pipeline.flowTitle[0]}
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">{tech.pipeline.flowTitle[1]}</span>
        </h2>
        <p className="mt-4 max-w-[66rem] text-body-lead text-navy-600">{tech.pipeline.lead}</p>

        <div className="relative mt-7 max-w-[66rem] md:mt-8">
          <div
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] top-[2.75rem] hidden h-px bg-navy-200 md:block"
          />
          <ol className="relative grid gap-2.5 md:grid-cols-5">
            {tech.pipeline.steps.map((s) => (
              <li
                key={s.n}
                className={`relative z-10 flex min-h-[10.5rem] flex-col rounded-2xl border p-4 shadow-[0_10px_26px_rgba(23,35,46,0.06)] md:min-h-[13rem] ${
                  s.emphasis
                    ? "border-brand-blue bg-brand-blue text-white shadow-[0_14px_30px_rgba(11,63,216,0.2)]"
                    : "border-navy-100 bg-white text-navy"
                }`}
              >
                <span
                  className={`text-[0.76rem] font-bold tracking-[0.08em] ${
                    s.emphasis ? "text-[#A8F2FF]" : "text-brand-blue"
                  }`}
                >
                  {s.n}
                </span>
                <h3 className="mt-2 font-display text-[1.05rem] font-extrabold leading-[1.35] md:text-[1.12rem]">
                  {s.name}
                </h3>
                <p
                  className={`mt-2 text-[0.88rem] font-medium leading-[1.55] md:text-[0.92rem] ${
                    s.emphasis ? "text-white/85" : "text-navy-600"
                  }`}
                >
                  {s.body}
                </p>
                <div className={`mt-auto border-t pt-2.5 ${s.emphasis ? "border-white/20" : "border-navy-100"}`}>
                  <span className={`text-[0.68rem] font-bold ${s.emphasis ? "text-white/60" : "text-navy-400"}`}>
                    주요 산출물
                  </span>
                  <strong className="mt-0.5 block text-[0.82rem] font-extrabold leading-snug">{s.output}</strong>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  if (section === "gate") {
    return (
      <div className="mx-auto w-full max-w-content px-6 py-12 md:px-10 md:py-16 lg:pl-44 lg:pr-12">
        <p className="flow-label">04 · 데이터 품질검증</p>
        <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
          {tech.gate.flowTitle[0]}
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">{tech.gate.flowTitle[1]}</span>
        </h2>
        <p className="mt-4 max-w-[66rem] text-body-lead text-navy-600">{tech.gate.lead}</p>

        <div className="mt-6 grid max-w-[66rem] gap-3 md:grid-cols-[minmax(0,1.45fr)_minmax(14rem,0.55fr)] md:items-stretch">
          <div className="rounded-2xl border border-navy-100 bg-navy-50 p-3.5 shadow-[0_12px_30px_rgba(23,35,46,0.06)]">
            <p className="text-[0.72rem] font-bold tracking-[0.08em] text-brand-blue">품질 확인 항목</p>
            <ol className="mt-2.5 grid gap-2 md:grid-cols-3">
              {tech.gate.checks.map((check) => (
                <li key={check.n} className="rounded-xl border border-navy-100 bg-white p-3">
                  <span className="text-[0.7rem] font-bold tracking-[0.08em] text-brand-blue">{check.n}</span>
                  <h3 className="mt-1 font-display text-[0.94rem] font-extrabold leading-snug text-navy">
                    {check.name}
                  </h3>
                  <p className="mt-1.5 text-[0.88rem] font-medium leading-[1.5] text-navy-600">{check.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-brand-blue px-3 py-2.5 text-white">
                <span className="text-[0.68rem] font-bold text-[#A8F2FF]">{tech.gate.decision.pass.label}</span>
                <strong className="mt-0.5 block text-[0.88rem] font-extrabold leading-snug">
                  {tech.gate.decision.pass.body}
                </strong>
              </div>
              <div className="rounded-xl border border-[#DFC98A] bg-[#FFF9E9] px-3 py-2.5 text-navy">
                <span className="text-[0.68rem] font-bold text-[#8A6A1F]">{tech.gate.decision.retry.label}</span>
                <strong className="mt-0.5 block text-[0.88rem] font-extrabold leading-snug">
                  {tech.gate.decision.retry.body}
                </strong>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl bg-[#10243A] p-4 text-white shadow-[0_16px_36px_rgba(16,36,58,0.16)]">
            <p className="text-[0.68rem] font-bold leading-[1.45] tracking-[0.08em] text-brand-cyan">
              {tech.gate.proof.label}
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-1 md:gap-2.5">
              {tech.gate.proof.stats.map((stat) => (
                <div key={stat.k} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <dd className="font-display text-[1.45rem] font-extrabold leading-none text-white">{stat.v}</dd>
                  <dt className="mt-1 text-[0.72rem] font-semibold leading-snug text-white/65">{stat.k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-3 border-t border-white/10 pt-3 text-[0.76rem] font-medium leading-[1.5] text-white/65">
              {tech.gate.proof.note}
            </p>
          </aside>
        </div>
      </div>
    );
  }

  if (section === "arch") {
    return (
      <div className="mx-auto w-full max-w-content px-6 py-12 md:px-10 md:py-16 lg:pl-44 lg:pr-12">
        <p className="flow-label">05 · 현장 적용 아키텍처</p>
        <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
          {tech.architecture.flowTitle[0]}
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">{tech.architecture.flowTitle[1]}</span>
        </h2>
        <p className="mt-4 max-w-[66rem] text-body-lead text-navy-600">{tech.architecture.lead}</p>

        <div className="mt-6 max-w-[66rem] rounded-[22px] bg-[#10243A] p-4 shadow-[0_20px_48px_rgba(16,36,58,0.16)] md:p-5">
          <p className="text-[0.72rem] font-bold tracking-[0.1em] text-brand-cyan">현장 적용 구조</p>
          <ol className="mt-3 grid gap-2 md:grid-cols-4">
            {tech.architecture.layers.map((layer, index) => (
              <li
                key={layer.n}
                className={`relative rounded-xl border p-3.5 ${
                  index === 2
                    ? "border-brand-cyan/50 bg-brand-blue text-white"
                    : "border-white/10 bg-[#17314B] text-white"
                }`}
              >
                <span className={`text-[0.7rem] font-bold ${index === 2 ? "text-[#A8F2FF]" : "text-brand-cyan"}`}>
                  {layer.n}
                </span>
                <h3 className="mt-1 font-display text-[1rem] font-extrabold leading-snug">{layer.name}</h3>
                <p className={`mt-1.5 text-[0.88rem] font-medium leading-[1.5] md:text-[0.9rem] ${index === 2 ? "text-white/85" : "text-white/65"}`}>
                  {layer.body}
                </p>
                {index < tech.architecture.layers.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[0.7rem] top-1/2 z-10 hidden -translate-y-1/2 text-base font-bold text-brand-cyan md:block"
                  >
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-3 grid max-w-[66rem] gap-2 md:grid-cols-3">
          {tech.architecture.principles.map((principle) => (
            <article key={principle.name} className="rounded-xl border border-navy-100 bg-navy-50 px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-[0.98rem] font-extrabold text-navy">{principle.name}</h3>
                {"status" in principle && principle.status && (
                  <span className="rounded-full bg-brand-blue/10 px-2 py-1 text-[0.65rem] font-bold text-brand-blue">
                    {principle.status}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[0.88rem] font-medium leading-[1.5] text-navy-600 md:text-[0.9rem]">
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // research
  return (
    <div className="mx-auto w-full max-w-content px-6 py-12 md:px-10 md:py-16 lg:pl-44 lg:pr-12">
      <p className="flow-label">06 · 연구·검증 기반</p>
      <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
        {tech.research.flowTitle[0]}
        {"\n"}
        <span className="brand-gradient bg-clip-text text-transparent">{tech.research.flowTitle[1]}</span>
      </h2>
      <p className="mt-4 max-w-[66rem] text-body-lead text-navy-600">{tech.research.lead}</p>

      <dl className="mt-6 grid max-w-[66rem] gap-3 md:grid-cols-2 xl:grid-cols-4">
        {tech.research.stats.map((s) => (
          <div
            key={s.n}
            className="rounded-2xl border border-navy-100 bg-navy-50 p-4 shadow-[0_12px_30px_rgba(23,35,46,0.05)] md:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <dt className="font-display text-[0.94rem] font-extrabold text-navy">{s.k}</dt>
              <span className="text-[0.7rem] font-bold tracking-[0.1em] text-brand-blue">{s.n}</span>
            </div>
            <dd className="brand-gradient mt-5 whitespace-nowrap bg-clip-text font-display text-[1.55rem] font-extrabold leading-none tracking-tight text-transparent md:text-[1.75rem] xl:text-[1.62rem] 2xl:text-[1.75rem]">
              {s.v}
            </dd>
            <p className="mt-3 border-t border-navy-100 pt-3 text-[0.84rem] font-medium leading-[1.5] text-navy-500 md:text-[0.88rem]">
              {s.note}
            </p>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex max-w-[66rem] flex-col gap-3 rounded-2xl bg-[#10243A] px-5 py-4 text-white shadow-[0_16px_36px_rgba(16,36,58,0.14)] md:flex-row md:items-center md:justify-between md:px-6">
        <p className="max-w-[48rem] text-[0.9rem] font-semibold leading-[1.55] text-white/85 md:text-[0.94rem]">
          {tech.research.bridge}
        </p>
        <span className="shrink-0 self-start rounded-full border border-brand-cyan/35 bg-brand-cyan/10 px-3 py-2 text-[0.72rem] font-bold text-brand-cyan md:self-auto">
          {tech.research.status}
        </span>
      </div>
    </div>
  );
}

/** 맨 아래 회사정보 화면 — 예전 푸터와 동일한 정보 구성
 *  타이포: 제목 = S-Core Dream(font-display), 본문 = Freesentation(font-sans). */
/** 성과·인증 — 특허 / 논문·기술이전 / 인증·수행과제·언론 (데이터: lib/achievements) */
function AchievementsPanel({ section }: { section: string }) {
  if (section === "patents") {
    return (
      <div className="mx-auto w-full max-w-content px-6 py-10 md:px-10 lg:pl-44 lg:pr-12">
        <p className="flow-label">성과·인증 · 특허</p>
        <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
          보행·근육건강·낙상예방 기술을,
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">특허 포트폴리오로 축적했습니다.</span>
        </h2>
        <p className="mt-3 max-w-[66rem] text-body-lead text-navy-600">
          4년간의 연구개발 결과를 등록 1건·출원 5건의 지식재산 포트폴리오로 구축했습니다.
        </p>

        <div className="mt-3 flex max-w-[66rem] flex-wrap gap-2">
          <span className="rounded-full bg-brand-blue px-3 py-1.5 text-[0.76rem] font-bold text-white">총 6건</span>
          <span className="rounded-full bg-brand-blue/10 px-3 py-1.5 text-[0.76rem] font-bold text-brand-blue">
            등록 1건 · 출원 5건
          </span>
          {(["보행분석", "근육건강", "낙상예방"] as const).map((field) => (
            <span key={field} className="rounded-full border border-navy-100 bg-navy-50 px-3 py-1.5 text-[0.76rem] font-semibold text-navy-600">
              {field}
            </span>
          ))}
        </div>

        <div className="mt-4 grid max-w-[66rem] gap-3 md:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]">
          <section className="rounded-[22px] bg-[#10243A] p-5 text-white shadow-[0_18px_42px_rgba(16,36,58,0.16)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-[1rem] font-extrabold">등록특허</h3>
              <span className="rounded-full border border-brand-cyan/35 bg-brand-cyan/10 px-2.5 py-1 text-[0.68rem] font-bold text-brand-cyan">
                등록 1건
              </span>
            </div>
            {patents.registered.map((p) => (
              <article key={p.no} className="mt-4">
                <p className="text-[0.78rem] font-bold tracking-[0.04em] text-brand-cyan">{p.no}</p>
                <p className="mt-2.5 font-display text-[1.02rem] font-extrabold leading-[1.55] text-white">
                  {p.title}
                </p>
                <p className="mt-4 border-t border-white/10 pt-3 text-[0.78rem] font-medium leading-relaxed text-white/55">
                  출원번호 {p.appNo} · {p.date}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-[22px] border border-navy-100 bg-navy-50 p-4 shadow-[0_12px_30px_rgba(23,35,46,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-[1rem] font-extrabold text-navy">출원특허</h3>
              <span className="text-[0.72rem] font-bold text-brand-blue">출원 5건</span>
            </div>
            <ol className="mt-2 divide-y divide-navy-100">
              {patents.applied.map((p, index) => (
                <li key={p.no} className="grid grid-cols-[1.6rem_minmax(0,1fr)] gap-2.5 py-2">
                  <span className="pt-0.5 text-[0.68rem] font-bold tracking-[0.08em] text-brand-blue">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[0.76rem] font-semibold text-navy-400">
                      {p.no} · {p.date}
                    </p>
                    <p className="mt-1 text-[0.88rem] font-semibold leading-[1.45] text-navy-700">{p.title}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <p className="mt-3 max-w-[66rem] text-[0.74rem] font-medium text-navy-400">
          ※ 특허 명칭은 등록·출원 원문을 그대로 표기했습니다.
        </p>
      </div>
    );
  }

  if (section === "papers") {
    return (
      <div className="mx-auto w-full max-w-content px-6 py-14 md:px-10 md:py-8 lg:pl-44 lg:pr-12">
        <p className="flow-label">성과·인증 · 논문·기술이전</p>
        <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
          센서 데이터 연구를,
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">논문과 기술이전으로 이어왔습니다.</span>
        </h2>
        <p className="mt-3 max-w-[66rem] text-body-lead text-navy-600">
          스마트폰 센서 기반 행동·보행·낙상 연구를 골격근 비율 추정까지 확장하고, 낙상예방 특허의
          통상실시권을 확보했습니다.
        </p>

        <div className="mt-2 flex max-w-[66rem] flex-wrap gap-2">
          {[
            "논문 6편",
            "SCI 1편",
            "KCI 4편",
            "국제학술대회 1편",
            "기술이전 1건",
          ].map((item, index) => (
            <span
              key={item}
              className={`rounded-full px-3 py-1.5 text-[0.74rem] font-bold ${
                index === 0 ? "bg-brand-blue text-white" : "border border-navy-100 bg-navy-50 text-navy-600"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-3 grid max-w-[66rem] gap-3 md:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          <section className="rounded-[22px] bg-[#10243A] p-4 text-white shadow-[0_18px_42px_rgba(16,36,58,0.16)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-[1rem] font-extrabold">2026 최신 연구</h3>
              <span className="text-[0.7rem] font-bold text-brand-cyan">SCI · KCI</span>
            </div>
            <div className="mt-3 grid gap-2.5 xl:grid-cols-2 xl:items-stretch">
              {papers.slice(0, 2).map((p, index) => (
                <article
                  key={p.title}
                  className={`flex flex-col rounded-xl border p-3.5 ${
                    index === 1 ? "border-brand-cyan/40 bg-brand-blue" : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-bold">
                    <span className={index === 1 ? "text-[#A8F2FF]" : "text-brand-cyan"}>{p.topic}</span>
                    <span className="text-white/45">{p.grade} · {p.year} · {p.role}</span>
                  </div>
                  {"titleKo" in p && p.titleKo ? (
                    <>
                      <p className="mt-2 font-display text-[0.92rem] font-extrabold leading-[1.45] text-white">
                        {p.titleKo}
                      </p>
                      <p className="mt-1 text-[0.72rem] font-medium leading-[1.4] text-white/60">{p.title}</p>
                    </>
                  ) : (
                    <p className="mt-2 text-[0.88rem] font-bold leading-[1.45] text-white">{p.title}</p>
                  )}
                  <p className="mt-2 text-[0.7rem] font-medium leading-[1.4] text-white/50">
                    {p.journal}
                    {"pages" in p && p.pages ? ` · ${p.pages}` : ""}
                  </p>
                  {"authors" in p && p.authors && (
                    <p className="mt-1 text-[0.68rem] font-medium leading-[1.35] text-white/50">{p.authors}</p>
                  )}
                  {"doi" in p && p.doi && (
                    <a
                      href={`https://doi.org/${p.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-auto inline-flex pt-1.5 text-[0.68rem] font-bold ${
                        index === 1 ? "text-[#A8F2FF]" : "text-brand-cyan"
                      }`}
                    >
                      DOI {p.doi} ↗
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-navy-100 bg-navy-50 p-4 shadow-[0_12px_30px_rgba(23,35,46,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-[1rem] font-extrabold text-navy">연구 축적</h3>
              <span className="text-[0.7rem] font-bold text-brand-blue">2022 — 2025</span>
            </div>
            <ol className="mt-2 divide-y divide-navy-100">
              {papers.slice(2).map((p) => (
                <li key={p.title} className="grid grid-cols-[2.8rem_minmax(0,1fr)] gap-2.5 py-2.5">
                  <span className="pt-0.5 text-[0.7rem] font-bold text-brand-blue">{p.year}</span>
                  <div>
                    <p className="text-[0.78rem] font-semibold leading-[1.42] text-navy-700">{p.title}</p>
                    <p className="mt-1 text-[0.68rem] font-semibold text-navy-400">
                      {p.topic} · {p.grade} · {p.role}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-3 flex max-w-[66rem] flex-col gap-2 rounded-xl border border-brand-blue/15 bg-brand-blue/5 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-blue px-2.5 py-1 text-[0.68rem] font-bold text-white">기술이전 1건</span>
            <strong className="text-[0.84rem] font-extrabold text-navy">{techTransfer[0].name}</strong>
          </div>
          <p className="text-[0.74rem] font-semibold text-navy-500">
            {techTransfer[0].from} · {techTransfer[0].date}
          </p>
        </div>
      </div>
    );
  }

  if (section === "certs") {
    const supportingEvidence = [
      { kind: "연구 절차", item: certifications[3] },
      { kind: "기술 보호", item: certifications[2] },
      { kind: "제품 시험", item: certifications[1] },
    ];

    return (
      <div className="mx-auto w-full max-w-content px-6 py-14 md:px-10 md:py-10 lg:pl-44 lg:pr-12">
        <p className="flow-label">성과·인증 · 시험·검증</p>
        <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
          기술의 신뢰를,
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">문서와 절차로 남겼습니다.</span>
        </h2>
        <p className="mt-3 max-w-[66rem] text-body-lead text-navy-600">
          공인시험으로 알고리즘 성능을 확인하고, 연구 승인과 기술임치로 데이터 수집과 기술 보호 절차를
          갖췄습니다.
        </p>

        <section className="mt-5 max-w-[66rem] rounded-[22px] bg-[#10243A] p-5 text-white shadow-[0_18px_42px_rgba(16,36,58,0.16)]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-brand-cyan/35 bg-brand-cyan/10 px-2.5 py-1 text-[0.68rem] font-bold text-brand-cyan">
                  공인시험
                </span>
                <span className="text-[0.7rem] font-bold text-white/45">기흥2024-00399</span>
              </div>
              <h3 className="mt-3 font-display text-[1.35rem] font-extrabold">KTC 시험성적서</h3>
              <p className="mt-2 text-[0.88rem] font-medium leading-[1.55] text-white/65">
                AIWALKER 보행분석 AI 알고리즘 · 한국기계전기전자시험연구원 · 2024.08
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-2.5">
              {tech.gate.proof.stats.map((stat) => (
                <div key={stat.k} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3.5 text-center">
                  <dd className="font-display text-[1.65rem] font-extrabold leading-none text-brand-cyan">{stat.v}</dd>
                  <dt className="mt-2 text-[0.72rem] font-semibold leading-snug text-white/60">{stat.k}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="mt-3 grid max-w-[66rem] gap-3 md:grid-cols-3">
          {supportingEvidence.map(({ kind, item }) => (
            <article key={item.name} className="rounded-2xl border border-navy-100 bg-navy-50 p-4 shadow-[0_10px_26px_rgba(23,35,46,0.04)]">
              <span className="text-[0.68rem] font-bold tracking-[0.08em] text-brand-blue">{kind}</span>
              <h3 className="mt-2 font-display text-[1rem] font-extrabold text-navy">{item.name}</h3>
              <p className="mt-2 text-[0.86rem] font-medium leading-[1.5] text-navy-600">{item.body}</p>
              {(item.org || item.date) && (
                <p className="mt-2 text-[0.72rem] font-semibold text-navy-400">
                  {[item.org, item.date].filter(Boolean).join(" · ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    );
  }

  // projects: 주요 수행과제 · 언론
  return (
    <div className="mx-auto w-full max-w-content px-6 py-14 md:px-10 md:py-12 lg:pl-44 lg:pr-12 xl:py-6">
      <p className="flow-label">성과·인증 · 수행과제·언론</p>
      <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
        연구개발을 현장에서 실행하고,
        {"\n"}
        <span className="brand-gradient bg-clip-text text-transparent">외부 기록으로 남겼습니다.</span>
      </h2>
      <p className="mt-3 max-w-[66rem] text-body-lead text-navy-600">
        2022년부터 AI 헬스케어 연구·실증을 이어왔고, 현재 제조 AX의 개발·상용화 과제로 확장하고
        있습니다.
      </p>

      <div className="mt-3 flex max-w-[66rem] flex-wrap gap-2">
        <span className="rounded-full bg-brand-blue px-3 py-1.5 text-[0.74rem] font-bold text-white">
          누적 R&amp;D 수행 규모 약 37.6억원
        </span>
        <span className="rounded-full border border-navy-100 bg-navy-50 px-3 py-1.5 text-[0.74rem] font-bold text-navy-600">
          AI 헬스케어
        </span>
        <span className="rounded-full border border-navy-100 bg-navy-50 px-3 py-1.5 text-[0.74rem] font-bold text-navy-600">
          제조 AX
        </span>
      </div>

      <div className="mt-3 grid max-w-[66rem] gap-3 md:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
        <section className="rounded-[22px] border border-navy-100 bg-navy-50 p-3.5 shadow-[0_12px_30px_rgba(23,35,46,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-[1rem] font-extrabold text-navy">주요 수행과제</h3>
            <span className="text-[0.7rem] font-bold text-brand-blue">2022 — 2028</span>
          </div>
          <ol className="mt-2 divide-y divide-navy-100">
            {projects.map((project) => (
              <li key={project.year + project.name} className="grid grid-cols-[4.8rem_minmax(0,1fr)] gap-2.5 py-1.5">
                <span className="pt-0.5 text-[0.68rem] font-bold text-brand-blue">{project.year}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-[0.82rem] font-extrabold leading-[1.4] text-navy-700">{project.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.62rem] font-bold ${
                        project.track === "제조 AX"
                          ? "bg-brand-blue text-white"
                          : project.track === "AI 헬스케어"
                            ? "bg-brand-cyan/12 text-[#087E91]"
                            : "bg-navy-100 text-navy-500"
                      }`}
                    >
                      {project.track}
                    </span>
                  </div>
                  {project.note && <p className="mt-1 text-[0.7rem] font-medium text-navy-400">{project.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-[22px] bg-[#10243A] p-4 text-white shadow-[0_18px_42px_rgba(16,36,58,0.14)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-[1rem] font-extrabold">언론 기록</h3>
            <span className="text-[0.7rem] font-bold text-brand-cyan">원문 링크</span>
          </div>
          <ul className="mt-2 divide-y divide-white/10">
            {press.map((article) => (
              <li key={article.url} className="py-3">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <p className="text-[0.7rem] font-bold text-brand-cyan">
                    {article.outlet} · {article.date}
                  </p>
                  <p className="mt-1.5 text-[0.84rem] font-bold leading-[1.45] text-white group-hover:text-brand-cyan">
                    {article.title}
                  </p>
                  <p className="mt-1 text-[0.68rem] font-medium text-white/45">{article.note} ↗</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/** 채용 — 일하는 방식 + 관심 분야 + 상시 인재 제안 */
function CareersPanel() {
  const values = [
    {
      no: "01",
      title: "현장을 이해하는 개발",
      body: "사용자와 생산현장의 운영 조건을 이해하고 기술 선택에 반영합니다.",
    },
    {
      no: "02",
      title: "데이터에 대한 책임",
      body: "좋은 모델 이전에 신뢰할 수 있는 데이터와 검증 절차를 중요하게 생각합니다.",
    },
    {
      no: "03",
      title: "끝까지 이어가는 실행",
      body: "기획·개발·시험·실증 사이에서 생기는 문제를 자기 일처럼 해결합니다.",
    },
  ];
  const interests = ["센서 데이터", "AI·머신러닝", "웹·앱 서비스", "엣지·설비 연동", "현장 실증"];

  return (
    <div className="mx-auto w-full max-w-content px-6 py-14 md:px-10 md:py-12 lg:pl-44 lg:pr-12 xl:py-8">
      <p className="flow-label">채용 · 함께할 사람</p>
      <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
        기술을 만들고,
        {"\n"}
        <span className="brand-gradient bg-clip-text text-transparent">현장에서 작동할 때까지 함께합니다.</span>
      </h2>
      <p className="mt-3 max-w-[66rem] text-body-lead text-navy-600">
        부트캠프는 센서 데이터 수집부터 AI 모델 설계, 서비스 개발과 현장 실증까지 하나의 흐름으로
        연결합니다. 역할의 경계를 넘어 문제를 끝까지 해결하고 싶은 동료와 함께하고자 합니다.
      </p>

      <div className="mt-5 grid max-w-[66rem] gap-3 md:grid-cols-3">
        {values.map((value) => (
          <article
            key={value.no}
            className="rounded-[22px] border border-navy-100 bg-white p-5 shadow-[0_12px_30px_rgba(23,35,46,0.06)]"
          >
            <span className="text-[0.72rem] font-extrabold tracking-[0.12em] text-brand-blue">{value.no}</span>
            <h3 className="mt-2 font-display text-[1.05rem] font-extrabold text-navy">{value.title}</h3>
            <p className="mt-2 text-[0.82rem] font-medium leading-[1.6] text-navy-500">{value.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid max-w-[66rem] gap-4 rounded-[22px] bg-[#10243A] p-5 text-white md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6">
        <div>
          <p className="font-display text-[1.05rem] font-extrabold">상시 인재 제안</p>
          <p className="mt-2 max-w-[43rem] text-[0.82rem] font-medium leading-[1.6] text-white/65">
            정해진 채용공고가 없더라도 부트캠프의 기술과 사업 방향에 관심 있는 분의 제안을 열어두고
            있습니다. 자유 형식의 이력서나 포트폴리오를 보내주세요.
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {interests.map((interest) => (
              <li
                key={interest}
                className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[0.68rem] font-bold text-white/75"
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
        <a
          href={`mailto:${company.email}?subject=${encodeURIComponent("[인재 제안] 부트캠프 지원")}`}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-cyan px-5 py-3 text-[0.78rem] font-extrabold text-navy transition-transform hover:-translate-y-0.5"
        >
          이력서·포트폴리오 보내기
        </a>
      </div>
    </div>
  );
}

function CompanyPanel({ title, kicker }: { title: string; kicker?: string }) {
  const inquiryTypes = [
    { title: "AI 헬스케어 도입·실증", body: "체육·복지시설, 지자체와 실증기관" },
    { title: "제조 AX 협력", body: "제조기업, 설비·솔루션 기업과 컨소시엄" },
    { title: "공동연구·R&D 협력", body: "대학, 연구기관, 공인시험기관과 공동과제" },
  ];

  return (
    <div className="mx-auto w-full max-w-content px-6 py-14 md:px-10 md:py-12 lg:pl-44 lg:pr-12 xl:py-8">
      {kicker && (
        <p className="flow-label">{kicker}</p>
      )}
      <h2 className="mt-4 max-w-[66rem] whitespace-pre-line font-display text-display-section font-extrabold">
        현장 적용과 확산을 위한
        {"\n"}
        <span className="brand-gradient bg-clip-text text-transparent">{title}</span>
      </h2>
      <p className="mt-3 max-w-[66rem] text-body-lead text-navy-600">
        AI 헬스케어 실증, 제조 AX 도입, 공동연구와 과제 컨소시엄 등 협력 목적에 맞춰 필요한 범위부터
        함께 검토합니다.
      </p>

      <div className="mt-5 grid max-w-[66rem] gap-3 md:grid-cols-3">
        {inquiryTypes.map((item, index) => (
          <article key={item.title} className="rounded-[20px] border border-navy-100 bg-navy-50 p-4.5">
            <span className="text-[0.68rem] font-extrabold tracking-[0.12em] text-brand-blue">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-display text-[0.98rem] font-extrabold text-navy">{item.title}</h3>
            <p className="mt-1.5 text-[0.76rem] font-medium leading-[1.55] text-navy-500">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid max-w-[66rem] gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-[22px] bg-[#10243A] p-5 text-white shadow-[0_18px_42px_rgba(16,36,58,0.14)]">
          <p className="text-[0.7rem] font-extrabold tracking-[0.12em] text-brand-cyan">COOPERATION</p>
          <h3 className="mt-2 font-display text-[1.05rem] font-extrabold">협력 문의</h3>
          <p className="mt-2 text-[0.8rem] font-medium leading-[1.6] text-white/65">
            사업·실증·공동연구 목적과 검토 중인 현장을 간단히 알려주시면 담당자가 확인 후 연락드립니다.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${company.email}?subject=${encodeURIComponent("[협력 문의] 부트캠프")}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-cyan px-5 py-3 text-[0.78rem] font-extrabold text-navy transition-transform hover:-translate-y-0.5"
            >
              협력 문의하기
            </a>
            <a href={`tel:${company.tel}`} className="text-[0.78rem] font-bold text-white/70 hover:text-white">
              {company.tel}
            </a>
          </div>
        </section>

        <section className="rounded-[22px] border border-navy-100 bg-white p-5 shadow-[0_12px_30px_rgba(23,35,46,0.05)]">
          <img src="/logo/bootcamp-logo-ko.svg" alt="(주)부트캠프" className="h-7 w-auto" />
          <dl className="mt-4 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-[0.76rem] leading-[1.5]">
            <dt className="font-bold text-navy-400">회사명</dt>
            <dd className="font-semibold text-navy-700">{company.nameKo}</dd>
            <dt className="font-bold text-navy-400">대표이사</dt>
            <dd className="font-semibold text-navy-700">{company.ceo}</dd>
            <dt className="font-bold text-navy-400">주소</dt>
            <dd className="font-semibold text-navy-700">{company.address}</dd>
            <dt className="font-bold text-navy-400">이메일</dt>
            <dd>
              <a href={`mailto:${company.email}`} className="font-semibold text-brand-blue hover:underline">
                {company.email}
              </a>
            </dd>
            <dt className="font-bold text-navy-400">사업자등록번호</dt>
            <dd className="font-semibold text-navy-700">{company.bizNo}</dd>
          </dl>
        </section>
      </div>

      <p className="mt-4 max-w-[66rem] border-t border-navy-100 pt-3 text-[0.68rem] text-navy-400">
        © {new Date().getFullYear()} {company.nameKo}. All rights reserved.
      </p>
    </div>
  );
}
