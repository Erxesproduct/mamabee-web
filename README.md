# MamaBee web store

Next.js 16 storefront that replaces the Zochil shop at mamabee.mn: maternity and nursing wear, nursing pillows,
carriers, baby hats and gift sets for mothers. «Тав тухтай ээж, тайван хүүхэд.»

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (no erxes needed)
npm run export:erxes   # docs/erxes/mamabee-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (+ `lite.json` for the cart), built from Zochil shop 8121 on 2026-11-20. Photos in
  `public/img/<hash>.webp`.
- Business rules (A zone 6,000₮, free over 500,000₮, 24–48 h, QPay within 10 minutes, 48 h size exchange):
  `src/content/business.ts`.
- Orders go to erxes (form submission → Sales card), QPay through the erxes payment plugin. Until the `ERXES_*`
  variables (`.env.example`) are set, `/api/orders` answers `503 not_configured` and the checkout shows the phone.
- Manual erxes steps and open questions: `docs/erxes/MANUAL-STEPS.md`.

Look «Honey Cloud»: the MamaBee one-line bee and the banner's sage «Love your journey», milk / cloud / blush / honey,
cloud-shaped frames, Lora + Noto Sans (Mongolian Ө/Ү checked). Pages: home, shop (group, size XS–XL, baby age,
sale, last sizes, search), product (fit card from the shop's model notes), size helper `/size`, cart / checkout,
order status, saved items, journal (the shop's posts), info.
