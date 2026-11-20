import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Bee, CloudEdge, Logo } from "./brand";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, TruckIcon } from "./icons";

export function Footer() {
  const cards = [
    { href: `tel:${business.phone.tel}`, Icon: PhoneIcon, k: "Утас", v: business.phone.display, tone: "bg-honey-l" },
    { href: `mailto:${business.email}`, Icon: MailIcon, k: "Имэйл", v: business.email, tone: "bg-blush-l" },
    { href: business.facebook, Icon: FacebookIcon, k: "Facebook", v: "MamaBee", tone: "bg-sky" },
    { href: business.instagram, Icon: InstagramIcon, k: "Instagram", v: business.instagramHandle, tone: "bg-sage-l" },
  ];
  return (
    <footer id="contact" className="mt-16 pb-28 md:pb-0">
      <CloudEdge color="var(--color-milk)" className="bg-cloud" />
      <div className="bees bg-cloud pt-10 pb-12 [--bee-opacity:.035]">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <Logo className="h-12 w-auto" />
              <p className="soft mt-5 text-[24px] leading-snug text-sage-d">{business.motto}</p>
              <p className="mt-3 max-w-sm text-[15px] text-ink-2">
                {business.title}. {business.address}, A бүсэд хүргэнэ.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cards.map(({ href, Icon, k, v, tone }) => (
                <a key={k} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-[22px] bg-white p-4 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-sage">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone} transition group-hover:scale-105`}>
                    <Icon size={21} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] text-ink-3">{k}</span>
                    <b className="block truncate text-[16px] font-semibold">{v}</b>
                  </span>
                </a>
              ))}
              <div className="flex items-start gap-4 rounded-[22px] bg-white p-4 ring-1 ring-line sm:col-span-2">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cloud">
                  <TruckIcon size={21} />
                </span>
                <span className="text-[14.5px] text-ink-2">
                  <b className="block text-[16px] font-semibold text-ink">
                    {business.zone.name}: {formatPrice(business.zone.price)}, 24–48 цаг
                  </b>
                  {business.zone.area}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 text-[14px] text-ink-2">
            <Link href="/shop" className="hover:text-ink">
              Бүх бараа
            </Link>
            <Link href="/size" className="hover:text-ink">
              Размер туслах
            </Link>
            <Link href="/info" className="hover:text-ink">
              Хүргэлт, төлбөр, размер солих
            </Link>
            <Link href="/journal" className="hover:text-ink">
              Зөвлөгөө
            </Link>
            <span className="ml-auto flex items-center gap-2 text-ink-3">
              <Bee size={18} /> © {new Date().getFullYear()} MamaBee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
