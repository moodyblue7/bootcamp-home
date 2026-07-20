import { news } from "@/lib/site";

export default function News() {
  return (
    <section className="border-t border-navy-100 bg-navy-50">
      <div className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">최신 소식</h2>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {news.map((n) => (
            <li
              key={n.title}
              className="flex flex-col rounded-2xl border border-navy-100 bg-white p-7"
            >
              <time className="text-xs font-semibold tracking-wide text-brand-blue">{n.date}</time>
              <h3 className="mt-3 text-base font-bold leading-snug">{n.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-navy-400">{n.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
