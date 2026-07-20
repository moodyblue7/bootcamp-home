"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { team, timeline, vision } from "@/lib/about";
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
    <div className="mx-auto flex min-h-full w-full max-w-content flex-col justify-between px-6 py-24 lg:pl-44 lg:pr-12 lg:py-28">
      {/* 상단: 헤드라인 + 설명 */}
      <div>
        <h1 className="font-display text-big font-extrabold leading-[1.2] tracking-tight sm:text-huge">
          <span className="text-brand-blue">부트캠프는</span> 센서가 만든 데이터를,
          <br />
          <span className="brand-gradient bg-clip-text text-transparent">
            현장이 믿는 AI 서비스로.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-mid text-navy-600">
          사람의 걸음에서 근육건강 신호를, 공장의 설비에서 품질 신호를 읽습니다.
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
            alt="부트캠프 대표 이미지"
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
    <div className="mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12">
      <p className="text-small font-bold uppercase tracking-[0.2em] text-brand-blue">About</p>
      <h2 className="mt-5 whitespace-pre-line font-display text-big font-extrabold leading-[1.3] tracking-tight sm:text-huge">
        {vision.headline.join("\n")}
      </h2>
      <div className="mt-10 max-w-3xl space-y-6">
        <p className="text-mid font-semibold leading-relaxed text-navy">{lead}</p>
        {rest.map((p) => (
          <p key={p.slice(0, 16)} className="text-small leading-[1.9] text-navy-600">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

/** 회사소개 · 연혁 — 연도별 타임라인 (데이터: lib/about)
 *  최근(2026)이 맨 위. 타이포: 제목·연도 = S-Core Dream(font-display), 항목 = Freesentation. */
function TimelinePanel() {
  const years = [...timeline].reverse(); // 최근이 위로
  return (
    <div className="mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12">
      <p className="text-small font-bold uppercase tracking-[0.2em] text-brand-blue">
        About · 연혁
      </p>
      <h2 className="mt-5 font-display text-big font-extrabold tracking-tight sm:text-huge">
        걸어온 길
      </h2>

      <ol className="mt-10 space-y-8">
        {years.map((y) => (
          <li key={y.year} className="lg:grid lg:grid-cols-[7rem_1fr] lg:gap-6">
            <h3 className="brand-gradient bg-clip-text font-display text-mid font-extrabold tracking-tight text-transparent">
              {y.year}
            </h3>
            <ul className="mt-3 space-y-3 border-l border-navy-200 pl-5 lg:mt-1">
              {y.items.map((it) => (
                <li key={it.title} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[1.55rem] top-[0.5rem] h-1.5 w-1.5 rounded-full ring-4 ring-white ${
                      it.key ? "brand-gradient" : "bg-navy-200"
                    }`}
                  />
                  <p className={`text-small leading-snug ${it.key ? "font-bold" : "text-navy-600"}`}>
                    {it.month && (
                      <span className="mr-2 text-[0.9rem] font-semibold text-navy-400">
                        {it.month}월
                      </span>
                    )}
                    {it.title}
                  </p>
                  {it.note && <p className="mt-0.5 text-[0.95rem] text-navy-400">{it.note}</p>}
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
  return (
    <div className="mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12">
      <p className="text-small font-bold uppercase tracking-[0.2em] text-brand-blue">About · 팀</p>
      <h2 className="mt-5 font-display text-big font-extrabold tracking-tight sm:text-huge">
        만드는 사람과 방향을 정하는 사람
      </h2>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {team.map((m) => (
          <article key={m.name} className="rounded-2xl border border-navy-100 p-8">
            <span className="brand-gradient inline-block h-1 w-10 rounded-full" aria-hidden="true" />
            <h3 className="mt-6 font-display text-mid font-extrabold leading-snug">{m.name}</h3>
            <p className="mt-1 text-small font-semibold text-brand-blue">{m.role}</p>
            <div className="mt-5 space-y-3">
              {m.body.map((p) => (
                <p key={p.slice(0, 16)} className="text-small leading-relaxed text-navy-600">
                  {p}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** 기술 대주제 — 섹션별 렌더 (데이터: lib/technology)
 *  타이포: 제목 = S-Core Dream(font-display), 본문 = Freesentation, 크기 토큰 사용. */
const TECH_WRAP = "mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12";

function TechPanel({ section }: { section: string }) {
  if (section === "intro") {
    return (
      <div className={TECH_WRAP}>
        <p className="text-small font-bold uppercase tracking-[0.2em] text-brand-blue">
          {tech.eyebrow}
        </p>
        <h2 className="mt-5 whitespace-pre-line font-display text-big font-extrabold leading-[1.2] tracking-tight sm:text-huge">
          {tech.h1[0]}
          {"\n"}
          <span className="brand-gradient bg-clip-text text-transparent">{tech.h1[1]}</span>
        </h2>
        <p className="mt-8 max-w-2xl text-mid leading-relaxed text-navy-600">{tech.lead}</p>
      </div>
    );
  }

  if (section === "bridge") {
    return (
      <div className={TECH_WRAP}>
        <h2 className="font-display text-big font-extrabold tracking-tight sm:text-huge">
          {tech.bridge.title}
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-small">
            <thead>
              <tr className="border-y border-navy-200 text-left">
                <th className="w-36 py-3 pr-4 font-semibold text-navy-400" />
                <th className="py-3 pr-6 font-bold">AI 헬스케어</th>
                <th className="py-3 font-bold">제조 AX</th>
              </tr>
            </thead>
            <tbody>
              {tech.bridge.rows.map((r, i) => {
                const last = i === tech.bridge.rows.length - 1;
                return (
                  <tr key={r.axis} className={`border-b border-navy-100 ${last ? "bg-navy-50" : ""}`}>
                    <th className="py-4 pr-4 text-left align-top text-[0.95rem] font-bold text-navy-400">
                      {r.axis}
                    </th>
                    <td className={`py-4 pr-6 align-top leading-relaxed ${last ? "font-bold" : "text-navy-600"}`}>
                      {r.healthcare}
                    </td>
                    <td className={`py-4 align-top leading-relaxed ${last ? "font-bold" : "text-navy-600"}`}>
                      {r.manufacturing}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-8 max-w-3xl border-l-2 border-brand-blue pl-5 text-mid font-semibold leading-relaxed">
          {tech.bridge.close}
        </p>
      </div>
    );
  }

  if (section === "pipeline") {
    return (
      <div className={TECH_WRAP}>
        <h2 className="font-display text-big font-extrabold tracking-tight sm:text-huge">
          {tech.pipeline.title}
        </h2>
        <p className="mt-4 max-w-2xl text-small text-navy-600">{tech.pipeline.lead}</p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tech.pipeline.steps.map((s) => (
            <li
              key={s.n}
              className={`rounded-2xl border p-6 ${
                s.emphasis ? "border-brand-blue/40 ring-1 ring-brand-blue/20" : "border-navy-100"
              }`}
            >
              <span className={`text-[0.9rem] font-bold ${s.emphasis ? "text-brand-blue" : "text-navy-400"}`}>
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-mid font-extrabold">{s.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-navy-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (section === "gate") {
    return (
      <div className={TECH_WRAP}>
        <h2 className="font-display text-big font-extrabold leading-tight tracking-tight sm:text-huge">
          {tech.gate.title}
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="max-w-2xl space-y-5">
            {tech.gate.body.map((p) => (
              <p key={p.slice(0, 16)} className="text-small leading-[1.9] text-navy-600">
                {p}
              </p>
            ))}
          </div>
          <div className="rounded-2xl border border-navy-100 bg-navy-50 p-7">
            <p className="text-[0.9rem] font-bold text-brand-blue">{tech.gate.proof.label}</p>
            <dl className="mt-5 space-y-5">
              {tech.gate.proof.stats.map((s) => (
                <div key={s.k}>
                  <dd className="brand-gradient bg-clip-text font-display text-big font-extrabold text-transparent">
                    {s.v}
                  </dd>
                  <dt className="mt-1 text-[0.95rem] text-navy-400">{s.k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-navy-200 pt-4 text-[0.9rem] leading-relaxed text-navy-400">
              {tech.gate.proof.note}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (section === "arch") {
    return (
      <div className={TECH_WRAP}>
        <h2 className="font-display text-big font-extrabold tracking-tight sm:text-huge">
          모델과 아키텍처
        </h2>

        {/* 모델 */}
        <h3 className="mt-10 font-display text-mid font-extrabold">{tech.models.title}</h3>
        <p className="mt-2 text-small text-navy-600">{tech.models.body}</p>
        <dl className="mt-5 max-w-3xl divide-y divide-navy-100 border-y border-navy-100">
          {tech.models.rows.map((r) => (
            <div key={r.k} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-small font-semibold">{r.k}</dt>
              <dd className="text-[0.95rem] leading-relaxed text-navy-600">{r.v}</dd>
            </div>
          ))}
        </dl>

        {/* 엣지 4계층 */}
        <h3 className="mt-12 font-display text-mid font-extrabold">{tech.edge.title}</h3>
        <p className="mt-2 text-small text-navy-600">{tech.edge.lead}</p>
        <ol className="mt-5 space-y-2.5">
          {tech.edge.layers.map((l) => (
            <li
              key={l.n}
              className="flex flex-col gap-1 rounded-xl border border-navy-100 p-5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="text-[0.85rem] font-bold text-navy-400 sm:w-8">{l.n}</span>
              <h4 className="text-small font-bold sm:w-52">{l.name}</h4>
              <p className="text-[0.95rem] leading-relaxed text-navy-600">{l.body}</p>
            </li>
          ))}
        </ol>

        {/* 표준 */}
        <h3 className="mt-12 font-display text-mid font-extrabold">{tech.standards.title}</h3>
        <dl className="mt-5 max-w-3xl divide-y divide-navy-100 border-y border-navy-100">
          {tech.standards.rows.map((r) => (
            <div key={r.k} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-small font-semibold">{r.k}</dt>
              <dd className="text-[0.95rem] leading-relaxed text-navy-600">{r.v}</dd>
            </div>
          ))}
        </dl>

        {/* 보안 */}
        <h3 className="mt-12 font-display text-mid font-extrabold">{tech.security.title}</h3>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {tech.security.items.map((i) => (
            <li
              key={i}
              className="rounded-full border border-navy-200 px-4 py-1.5 text-[0.95rem] font-medium text-navy-600"
            >
              {i}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // research
  return (
    <div className={TECH_WRAP}>
      <h2 className="font-display text-big font-extrabold tracking-tight sm:text-huge">
        {tech.research.title}
      </h2>
      <p className="mt-4 max-w-2xl text-small text-navy-600">{tech.research.lead}</p>
      <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {tech.research.stats.map((s) => (
          <div key={s.k}>
            <dd className="brand-gradient bg-clip-text font-display text-huge font-extrabold tracking-tight text-transparent">
              {s.v}
            </dd>
            <dt className="mt-3 text-small font-semibold">{s.k}</dt>
            <p className="mt-1 text-[0.9rem] text-navy-400">{s.note}</p>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** 맨 아래 회사정보 화면 — 예전 푸터와 동일한 정보 구성
 *  타이포: 제목 = S-Core Dream(font-display), 본문 = Freesentation(font-sans). */
/** 성과·인증 — 특허 / 논문·기술이전 / 인증·수행과제·언론 (데이터: lib/achievements) */
function AchievementsPanel({ section }: { section: string }) {
  const WRAP = "mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12";
  const Kicker = () => (
    <p className="text-small font-bold uppercase tracking-[0.2em] text-brand-blue">성과·인증</p>
  );

  if (section === "patents") {
    return (
      <div className={WRAP}>
        <Kicker />
        <h2 className="mt-5 font-display text-big font-extrabold tracking-tight sm:text-huge">특허</h2>
        <h3 className="mt-10 font-display text-mid font-extrabold">등록</h3>
        <ul className="mt-4 space-y-4">
          {patents.registered.map((p) => (
            <li key={p.no} className="rounded-2xl border border-navy-100 p-6">
              <p className="text-[0.9rem] font-bold text-brand-blue">{p.no}</p>
              <p className="mt-2 text-small leading-relaxed">{p.title}</p>
              <p className="mt-2 text-[0.9rem] text-navy-400">{p.date}</p>
            </li>
          ))}
        </ul>
        <h3 className="mt-10 font-display text-mid font-extrabold">출원</h3>
        <ul className="mt-4 divide-y divide-navy-100 border-y border-navy-100">
          {patents.applied.map((p) => (
            <li key={p.no} className="grid gap-1 py-4 sm:grid-cols-[1fr_9rem] sm:gap-6">
              <p className="text-[0.95rem] leading-relaxed text-navy-600">{p.title}</p>
              <p className="text-[0.9rem] text-navy-400 sm:text-right">{p.date}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section === "papers") {
    return (
      <div className={WRAP}>
        <Kicker />
        <h2 className="mt-5 font-display text-big font-extrabold tracking-tight sm:text-huge">
          논문 · 기술이전
        </h2>
        <ul className="mt-10 divide-y divide-navy-100 border-y border-navy-100">
          {papers.map((p) => (
            <li key={p.title} className="py-5">
              <p className="text-small font-semibold leading-relaxed">{p.title}</p>
              <p className="mt-1.5 text-[0.9rem] text-navy-400">
                {p.journal} · {p.year} · {p.grade} · {p.role}
              </p>
            </li>
          ))}
        </ul>
        <h3 className="mt-10 font-display text-mid font-extrabold">기술이전</h3>
        <ul className="mt-4 space-y-2">
          {techTransfer.map((t) => (
            <li key={t.name} className="text-small text-navy-600">
              {t.name} — {t.from} · {t.date}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // certs: 인증 · 수행과제 · 언론
  return (
    <div className={WRAP}>
      <Kicker />
      <h2 className="mt-5 font-display text-big font-extrabold tracking-tight sm:text-huge">
        인증 · 수행과제 · 언론
      </h2>

      <h3 className="mt-10 font-display text-mid font-extrabold">인증</h3>
      <dl className="mt-4 max-w-3xl divide-y divide-navy-100 border-y border-navy-100">
        {certifications.map((c) => (
          <div key={c.name} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
            <dt className="text-small font-semibold">{c.name}</dt>
            <dd className="text-[0.95rem] leading-relaxed text-navy-600">
              {c.body}
              {c.org && <span className="text-navy-400"> · {c.org}</span>}
              {c.date && <span className="text-navy-400"> · {c.date}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-10 font-display text-mid font-extrabold">주요 수행과제</h3>
      <ul className="mt-4 divide-y divide-navy-100 border-y border-navy-100">
        {projects.map((pr) => (
          <li key={pr.year + pr.name} className="grid gap-1 py-4 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="text-[0.9rem] font-bold text-navy-400">{pr.year}</span>
            <span className="text-[0.95rem] leading-relaxed">
              <b className="font-semibold">{pr.name}</b>
              {pr.note && <span className="text-navy-400"> — {pr.note}</span>}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-10 font-display text-mid font-extrabold">언론</h3>
      <ul className="mt-4 space-y-3">
        {press.map((a) => (
          <li key={a.url}>
            <a href={a.url} target="_blank" rel="noopener noreferrer" className="group block">
              <span className="text-small font-semibold group-hover:text-brand-blue">{a.title}</span>
              <span className="mt-1 block text-[0.9rem] text-navy-400">
                {a.outlet} · {a.date}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 채용 — 인재상 + 상시지원 + 관심분야 + 지원 이메일 */
function CareersPanel() {
  const interests = ["센서 데이터", "머신러닝", "엣지 디바이스", "데이터 파이프라인", "현장 운영"];
  return (
    <div className="mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12">
      <p className="text-small font-bold uppercase tracking-[0.2em] text-brand-blue">Careers</p>
      <h2 className="mt-5 font-display text-big font-extrabold leading-[1.25] tracking-tight sm:text-huge">
        현장까지 따라가는 사람을 찾습니다.
      </h2>
      <p className="mt-8 max-w-2xl text-mid leading-relaxed text-navy-600">
        부트캠프의 일은 모델을 만드는 데서 끝나지 않습니다. 어르신이 실제로 걷는 체육관에 장비를
        설치하고, 데이터 품질을 확인하고, 안 되면 다시 고칩니다. 그 과정을 지루해하지 않는 분과
        함께하고 싶습니다.
      </p>

      <h3 className="mt-12 font-display text-mid font-extrabold">상시 지원</h3>
      <p className="mt-3 max-w-2xl text-small leading-relaxed text-navy-600">
        정해진 공고 없이 상시로 지원을 받습니다. 아래 어느 쪽이든 관심 있는 분이라면 편하게 연락
        주세요.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2.5">
        {interests.map((i) => (
          <li
            key={i}
            className="rounded-full border border-navy-200 px-4 py-1.5 text-[0.95rem] font-medium text-navy-600"
          >
            {i}
          </li>
        ))}
      </ul>

      <div className="mt-12 max-w-2xl rounded-2xl border border-navy-100 bg-navy-50 p-8">
        <p className="text-small leading-relaxed text-navy-600">
          자유 형식 이력서를 아래 주소로 보내주세요. 검토 후 개별적으로 연락드립니다.
        </p>
        <a
          href={`mailto:${company.email}?subject=${encodeURIComponent("[지원] 부트캠프 상시 지원")}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-small font-semibold text-white transition-colors hover:bg-navy-900"
        >
          {company.email}
        </a>
      </div>
    </div>
  );
}

// 회사정보 화면의 바로가기 메뉴. 모두 flow 내부 화면으로 해시(#) 연결한다.
// (해시 링크는 상단 컨테이너 onClick 이 가로채 해당 대주제로 이동시킨다)
const flowNav = [
  { href: "#", label: "회사소개" }, // 첫 화면(상단)
  { href: "#healthcare", label: "AI 헬스케어" },
  { href: "#manufacturing", label: "제조 AX" },
  { href: "#technology", label: "기술" },
  { href: "#achievements", label: "성과·인증" },
  { href: "#careers", label: "채용" },
  { href: "#contact", label: "문의" },
];

function CompanyPanel({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="mx-auto w-full max-w-content px-6 py-24 lg:pl-44 lg:pr-12">
      {kicker && (
        <p className="text-small font-bold uppercase tracking-[0.2em] text-brand-blue">{kicker}</p>
      )}
      <h2 className="mt-5 whitespace-pre-line font-display text-big font-extrabold leading-[1.25] tracking-tight sm:text-huge">
        {title}
      </h2>

      <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:justify-between">
        <div>
          <img
            src="/logo/bootcamp-logo-ko.svg"
            alt="(주)부트캠프"
            className="h-9 w-auto"
          />
          <dl className="mt-6 space-y-2 text-small text-navy-600">
            <div>
              <dt className="sr-only">주소</dt>
              <dd>{company.address}</dd>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <dt className="sr-only">전화</dt>
              <dd>
                <a href={`tel:${company.tel}`} className="hover:text-navy">
                  {company.tel}
                </a>
              </dd>
              <dt className="sr-only">이메일</dt>
              <dd>
                <a href={`mailto:${company.email}`} className="hover:text-navy">
                  {company.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-2 pt-1 text-[0.95rem] text-navy-400">
              <dt>사업자등록번호</dt>
              <dd>{company.bizNo}</dd>
            </div>
          </dl>
        </div>

        <nav aria-label="바로가기">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-small">
            {flowNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-navy-400 hover:text-navy">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mt-12 border-t border-navy-100 pt-6 text-[0.95rem] text-navy-400">
        © {new Date().getFullYear()} {company.nameKo}. All rights reserved.
      </p>
    </div>
  );
}
