import Image from "next/image";
import Link from "next/link";

import { company, nav } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-50">
      <div className="mx-auto max-w-content px-5 py-14 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div>
            <Image
              src="/logo/bootcamp-logo-ko.svg"
              alt="(주)부트캠프"
              width={196}
              height={53}
              className="h-8 w-auto"
            />
            <dl className="mt-6 space-y-1 text-sm text-navy-400">
              <div className="flex gap-2">
                <dt className="sr-only">주소</dt>
                <dd>{company.address}</dd>
              </div>
              <div className="flex gap-4">
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
              <div className="flex gap-2 pt-1">
                <dt>사업자등록번호</dt>
                <dd>{company.bizNo}</dd>
              </div>
            </dl>
          </div>

          <nav aria-label="푸터">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-navy-400 hover:text-navy">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-navy-100 pt-6 text-xs text-navy-400">
          © {new Date().getFullYear()} {company.nameKo}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
