# MamaBee: erxes manual steps

Owner of every step below: **Terbish**, with MamaBee for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → mamabee-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for MamaBee yet ("erxes 3.0: NOT SET"). Create the workspace first.

> **Security warning.** The public Zochil shop API for mamabee.mn returns the shop's **Pocket client id / client
> secret / terminal id** to anyone who opens the site. They were never copied into this repository and were never
> used. Ask MamaBee to **rotate the Pocket credentials** (Pocket merchant portal) and ask Zochil to stop exposing them.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 49 products, 130 size / colour variants, 4 groups + sub-categories, MNT prices and sale prices, photos | import the CSVs (1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: A zone 6,000₮, free over 500,000₮, 24–48 h, size exchange rule, status list | delivery products, pipeline stages (1.4) |
| [1.5] Full journey test | validation verified (`npm run test:order`, 33 checks) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: mamabee.mn (Zochil shop 8121), read 2026-11-20: **49 enabled products**, **130 variants** (Размер XS–XL,
baby ages 0–3 сар … 2–4 нас, set sizes and colours, card colours), MNT prices 7,000₮–337,000₮, up to 8 photos per
product, the home banner, logo, 4 posts. Facebook page: the line «Тав тухтай ээж, тайван хүүхэд».

- Groups = the shop's Zochil tree: **Ээжид** (Maternity, 17), **Хөхүүл үе** (Nursing: Comfy huggy, Baby pouch, Хөхүүл
  дэр, 6), **Хүүхдэд** (Baby: малгай, Lovey, 20), **Бэлгийн багц** (Багц, 5). «Last sizes» (6) is a filter and a badge.
  The greeting card (listed in every Zochil category) is offered in the cart as an add-on.
- Sale prices: 12 products (Comfy huggy, linen bonnets, two robes, two sale hats).
- The shop writes the photo model's height / weight and the size she wore («Размер сонголт»): it is shown as a fit
  card on 16 products and powers `/size` (compare yourself with the models). No size rule is invented.
- Hat sizes are baby ages: `/shop?age=0-3` etc. show only hats that come in that size.
- Stock: Zochil counts stock per product only. A counted product at 0 is sold out (8 products); others are not capped
  (open question 4).
- Old Zochil URLs (`/products/<category>/<id>`, category pages, `/posts`, `/about`, …) redirect to the new pages.

Steps:

1. Run `npm run export:erxes` (already run; files in `docs/erxes/`).
2. **Products & Services → Categories → Import**: `mamabee-categories.csv` (MB → groups → sub-categories → MB-DELIVERY).
3. **Products & Services → Import**: `mamabee-products.csv`. One row per variant, code `MB-<productId>-<variantId>`
   (the same id the website sends with every order line), unit price and price before sale in MNT.
4. Spot-check 10 products (price, size) against mamabee.mn.

## 1.2 Payment (QPay)

Zochil rule, word for word: «Захиалга хийснээс хойш 10 минутын дотор төлбөрөө төлсөнөөр захиалга баталгаажна.» The only
Zochil checkout method is QPay (merchant `Z_MAMABEE`, through Zochil). The website:

- records the order in erxes first, then creates a QPay invoice with the erxes payment plugin (`generateInvoiceUrl`,
  public). The customer pays on the erxes payment page and returns to `/order/<reference>`, which asks `invoicesCheck`
  every 5 s.
- never asks for money for an order staff cannot see. Bank transfer is not offered (no transfer rule on Zochil).

Steps:

1. Get MamaBee's own QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`). The Zochil merchant
   `Z_MAMABEE` belongs to Zochil's QPay account; ask QPay for a merchant of MamaBee's own (open question 3).
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`.
4. Invoice expiry: set the QPay invoice lifetime to 10 minutes if the shop keeps the 10-minute rule.
5. **Not yet tested** against a real QPay merchant. Do not call payments working until step 2 and 1.5 pass.

## 1.3 eBarimt

The website never makes a receipt. The checkout asks «Хувь хүн» or «Байгууллага» (7-digit registry number, checked on
the server) and writes it on the order. The receipt is issued in erxes by staff after payment.

1. Collect from MamaBee: company or person name and TIN (Zochil `regno` is empty), district code, VAT status,
   product classification codes (clothing, textiles, baby goods).
2. Register for **PosAPI 3.0** (ebarimt.mn) and install the PosAPI service.
3. **Settings → eBarimt**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.
4. For every paid order: issue the receipt once (goods + delivery fee if charged) and send the lottery number.

## 1.4 Delivery zones, fees and order statuses

Website (done), from the Zochil delivery option, delivery rule and terms:

| Zochil | Website |
| --- | --- |
| Option «A бүс», 6,000₮, `delivery_price_limit` 500,000₮ | 6,000₮; free when the goods are **over** 500,000₮ (Zochil rule) |
| «Урагшаа Зайсан, Нисэх хойшоо 7 буудал, зүүн тийшээ Таван шар, баруун тийшээ Ботаник хүртэл» | shown at checkout; the customer ticks «Миний хаяг A бүсэд багтана» (checked on the server) |
| «Хүргэлт 24-48 цагийн дотор хүргэгдэнэ.» | everywhere |
| Countryside switch on, but no option or fee | not offered online; the site asks to call first (open question 1) |
| «48 цагийн дотор хүргэлтээр размераа солиулах … 6000 нэмж бодогдоно. Буцаалт байхгүй.» | required checkbox at checkout; /info |
| Greeting card: no message can be written | shown next to the card |

- Fees and rules live in `src/content/business.ts`; change them there and in the erxes delivery products.

erxes:

1. Import `docs/erxes/mamabee-delivery.csv` (`MB-DELIVERY-A` 6,000₮, `MB-EXCHANGE` 6,000₮).
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages (as on the website):
   Төлбөр хүлээгдэж байна → Баталгаажсан → Савлаж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus Размер солих and
   Цуцлагдсан (not paid within 10 minutes).
3. **Frontline → Forms → (order form) → Settings**: create a sales card in «Төлбөр хүлээгдэж байна» for every
   submission. Staff move it to «Баталгаажсан» when the QPay invoice shows paid.
4. SMS templates: Zochil sends «Tani zahialga burtgegdlee…» and «…amjilttai batalgaajlaa» (order_sms_template_1/2).
   Recreate them in erxes (Automations → SMS) for «registered» and «paid».

## 1.5 Test order from cart to receipt

**Verified on a local production build:** `npm run test:order -- http://localhost:3123`: **all 33 checks passed**:
empty cart, unknown product, numeric id, the card alone refused / with goods priced, sold-out refused, stock limit,
6,000₮ fee, free over 500,000₮, a variant priced by its own id, terms required, A zone required, district / khoroo /
address, QPay accepted, transfer and unknown payment refused, company registry, phone, email, quantity limit, the
browser's price ignored, same checkout key → same reference, honeypot, payment check 400 / 503. Without erxes the API
answers `503 not_configured`; the checkout then shows the phone number and keeps the cart. `--send` was **not run**
(env vars not set). No payment was made.

Steps for the real test (authorized credentials only):

1. **Frontline → Forms → Create** «Вэбсайт захиалга» with fields Нэр, Утас, Имэйл, Захиалга; copy the form id and the
   field ids into `ERXES_ORDER_FORM_ID` / `ERXES_ORDER_FIELD_IDS`. Set `ERXES_API_URL`, `ERXES_PAYMENT_IDS`. Redeploy.
2. `npm run test:order -- https://<production url> --send`: one order, two items.
3. Pay the invoice only with QPay's test merchant or with explicit authorization for a real charge; check that
   `/order/<reference>` shows «Төлбөр төлөгдлөө», move the card, issue the eBarimt, mark delivered, void the test.

## Permissions (erxes)

- Staff who handle orders: Sales (cards), Forms (submissions), Payments (view invoices), eBarimt (issue).
- Only the owner: Settings → Payments, Settings → eBarimt, product import.
- The website uses only public erxes mutations; it needs no admin token.

---

## Open questions for MamaBee

1. **Outside A zone / countryside**: the Zochil countryside switch is on, but there is only the A zone option. Fee and
   carrier for other districts and aimags?
2. **Free delivery**: Zochil's limit is 500,000₮ (free when the goods are over it). Is that still the rule?
3. **QPay merchant**: Zochil's `Z_MAMABEE` is not usable from erxes. MamaBee's own QPay merchant?
4. **Stock**: Zochil counts stock per product, not per size. 8 products are at 0 (shown sold out); others are not
   capped. Real stock per size?
5. **Size exchange fee** (6,000₮): paid to the courier or by QPay?
6. **Comfy huggy gift hat**: the product text says to pick a free hat and write it in the order note. Still running?
7. **TIN / PosAPI** for eBarimt.
8. **Domain**: point mamabee.mn at the new site when ready.
9. **Exposed credentials**: rotate the Pocket credentials (see the warning at the top).
10. **Blue comfort set**: the text says «Үндсэн үнэ 238.000 / Багцын үнэ 208.000», but Zochil has no «before» price;
    the site shows 208,000₮ only. Add 238,000₮ as the before-sale price?
