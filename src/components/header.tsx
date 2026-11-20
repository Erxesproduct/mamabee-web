import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Logo } from "./brand";
import { CartButton, HeartsButton, MobileMenu } from "./header-tools";
import { SearchIcon } from "./icons";

export const NAV = [
  { href: "/shop?g=mama", label: "Ээжид" },
  { href: "/shop?g=nursing", label: "Хөхүүл үе" },
  { href: "/shop?g=baby", label: "Хүүхдэд" },
  { href: "/shop?g=sets", label: "Бэлгийн багц" },
  { href: "/size", label: "Размер туслах" },
  { href: "/journal", label: "Зөвлөгөө" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="h-9 truncate bg-sage-d px-4 text-center text-[13px] leading-9 font-medium text-white">
        <span className="sm:hidden">24–48 цагт хүргэнэ · {formatPrice(business.zone.freeOver)}-өөс дээш үнэгүй</span>
        <span className="hidden sm:inline">
          A бүсэд 24–48 цагт хүргэнэ · {formatPrice(business.zone.freeOver)}-өөс дээш захиалгад хүргэлт үнэгүй
        </span>
      </div>
      <div className="border-b border-line/70 bg-milk/90 backdrop-blur-md">
        <div className="wrap flex h-[68px] items-center gap-4 md:h-[78px]">
          <MobileMenu items={NAV} />
          <Link href="/" className="shrink-0" aria-label="MamaBee: нүүр хуудас">
            <Logo priority className="h-9 w-auto md:h-11" />
          </Link>
          <nav aria-label="Үндсэн цэс" className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-full px-3.5 py-2 text-[15px] font-medium text-ink-2 transition hover:bg-cloud hover:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/shop#search" className="grid h-11 w-11 place-items-center rounded-full hover:bg-cloud" aria-label="Хайх">
              <SearchIcon size={21} />
            </Link>
            <HeartsButton />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
