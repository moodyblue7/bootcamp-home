import { trust } from "@/lib/site";

export default function TrustStrip() {
  return (
    <section className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{trust.headline}</h2>

      <ul className="mt-8 flex flex-wrap gap-2.5">
        {trust.items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-600"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-16">
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-400">
          협력 · 실증 기관
        </h3>
        {/* 기관 로고 파일을 아직 못 받아 텍스트로 표기. 로고 확보 시 이미지로 교체. */}
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          {trust.partners.map((p) => (
            <li key={p} className="text-sm text-navy-600">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
