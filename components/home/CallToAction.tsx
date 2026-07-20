import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-content px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              함께 검증해볼 현장을 찾습니다
            </h2>
            <p className="mt-4 text-sm text-navy-200 sm:text-base">
              실증 · 도입 · 기술협력 문의를 기다립니다.
            </p>
          </div>

          <Link
            href="/contact/"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-navy-100"
          >
            문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}
