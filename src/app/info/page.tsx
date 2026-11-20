import type { Metadata } from "next";
import { Bee } from "@/components/brand";
import { ChatIcon, GiftIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, QrIcon, TruckIcon } from "@/components/icons";
import { business, ORDER_STATUSES } from "@/content/business";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, размер солих",
  description: `${business.zone.name}: ${formatPrice(business.zone.price)}, 24–48 цагт. QPay. 48 цагийн дотор размер солих.`,
  alternates: { canonical: "/info" },
};

export default function InfoPage() {
  const blocks = [
    {
      id: "delivery",
      Icon: TruckIcon,
      tone: "bg-sage-l",
      title: "Хүргэлт",
      items: [
        `${business.zone.name}: ${formatPrice(business.zone.price)}. Барааны дүн ${formatPrice(business.zone.freeOver)}-өөс давбал үнэгүй.`,
        business.zone.area,
        business.rules.delivery,
        business.rules.outside,
      ],
    },
    { id: "payment", Icon: QrIcon, tone: "bg-honey-l", title: "Төлбөр", items: [business.rules.payment, "QPay: аль ч банкны аппаар QR уншуулж төлнө.", business.rules.ebarimt] },
    { id: "terms", Icon: ChatIcon, tone: "bg-blush-l", title: "Размер солих, буцаалт", items: [business.rules.terms] },
    { id: "gift", Icon: GiftIcon, tone: "bg-sky", title: "Бэлэг, мэндчилгээний карт", items: [business.rules.card] },
  ];
  return (
    <div className="wrap pt-10 pb-28 md:pt-14 md:pb-16">
      <p className="kicker">
        <Bee size={18} /> Мэдээлэл
      </p>
      <h1 className="mt-3 text-[38px] md:text-[54px]">
        Хүргэлт, төлбөр, <span className="soft text-sage-d">размер солих</span>
      </h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {blocks.map(({ id, Icon, tone, title, items }) => (
          <section key={id} id={id} className={`scroll-mt-36 rounded-[28px] p-6 md:p-8 ${tone}`}>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
              <Icon size={22} />
            </span>
            <h2 className="mt-4 text-[26px]">{title}</h2>
            <ul className="mt-3 space-y-2 text-ink-2">
              {items.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-3" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="panel mt-6 p-6 md:p-8" aria-labelledby="flow">
        <h2 id="flow" className="text-[26px]">
          Захиалгын <span className="soft text-sage-d">явц</span>
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER_STATUSES.map((s, i) => (
            <li key={s.id} className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage-l text-[14px] font-semibold text-sage-d">{i + 1}</span>
              <span>
                <b className="block font-semibold">{s.name}</b>
                <span className="text-[14px] text-ink-2">{s.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Холбоо барих">
        {[
          { href: `tel:${business.phone.tel}`, Icon: PhoneIcon, v: business.phone.display },
          { href: `mailto:${business.email}`, Icon: MailIcon, v: business.email },
          { href: business.facebook, Icon: FacebookIcon, v: "MamaBee" },
          { href: business.instagram, Icon: InstagramIcon, v: business.instagramHandle },
        ].map(({ href, Icon, v }) => (
          <a key={v} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-3 rounded-[22px] bg-white p-4 ring-1 ring-line hover:ring-sage">
            <Icon size={20} />
            <b className="truncate font-semibold">{v}</b>
          </a>
        ))}
      </section>
    </div>
  );
}
