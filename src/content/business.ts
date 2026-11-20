import data from "@/data/catalog.json";

/**
 * Business facts from mamabee.mn (Zochil shop 8121: shop settings, payment and delivery rules, terms of service, the
 * delivery zone, banner, posts) and the MamaBee Facebook page, read on 2026-11-20. Nothing here is invented; open points
 * are in docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const zone = shop.zone!;

export const business = {
  name: "MamaBee",
  /** The Zochil shop name, word for word. */
  title: shop.name,
  domain: "mamabee.mn",
  /** The home banner's words and the Facebook page's line. */
  tagline: "Love your journey",
  motto: "Тав тухтай ээж, тайван хүүхэд",
  followers: "57,000+",
  phone: { display: "6029-8200", tel: "+97660298200" },
  email: shop.email,
  facebook: shop.facebook,
  instagram: shop.instagram,
  instagramHandle: "@mamabee.shop",
  /** Zochil address: an online shop (no showroom, no pickup point). */
  address: "Онлайн дэлгүүр",

  /** Zochil checkout methods: QPay only. */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө." }],

  /** The one Zochil delivery option, «A бүс». */
  zone: { name: zone.title, area: zone.description, price: zone.price, freeOver: zone.freeOver },

  rules: {
    /** Zochil payment rule, word for word. */
    payment: shop.paymentRule,
    /** Zochil delivery rule, word for word. */
    delivery: shop.deliveryRule,
    /** Zochil terms of service, word for word. */
    terms: shop.terms,
    exchange: "Захиалга хүлээн авснаас хойш 48 цагийн дотор хүргэлтээр размераа солиулах боломжтой.",
    exchangeFee: "Размер солиулахад хүргэлтийн төлбөр болох 6,000₮ нэмж бодогдоно.",
    noReturn: "Буцаалт байхгүй.",
    outside: "A бүсээс гадуур болон орон нутагт хүргүүлэх бол захиалга өгөхөөсөө өмнө утсаар эсвэл чатаар тохирно уу.",
    card: "Захиалга хүргэлтийн компанийн агуулахаас хүргэлтэд гардаг тул мэндчилгээ бичиж явуулах боломжгүйг анхаарна уу.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
    notify: "Захиалга бүртгэгдэх, баталгаажих үед таны утсанд мессеж очно.",
  },
} as const;

export type PaymentId = (typeof business.payments)[number]["id"];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil rule: the zone fee, free when the goods come to more than the zone's limit. */
export function deliveryFee(subtotal: number): number {
  return subtotal > business.zone.freeOver ? 0 : business.zone.price;
}

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Төлбөр хүлээгдэж байна", note: "10 минутын дотор QPay-ээр төлнө" },
  { id: "paid", name: "Баталгаажсан", note: "Төлбөр орсон, таны утсанд мессеж очно" },
  { id: "packing", name: "Савлаж байна", note: "Хүргэлтийн компанийн агуулахад хүлээлгэн өгнө" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "24–48 цагийн дотор хүргэнэ" },
  { id: "delivered", name: "Хүргэгдсэн", note: "48 цагийн дотор размер солиулж болно" },
  { id: "exchange", name: "Размер солих", note: "Хүргэлтээр, 6,000₮ нэмэгдэнэ" },
  { id: "cancelled", name: "Цуцлагдсан", note: "10 минутад төлбөр төлөгдөөгүй" },
] as const;
