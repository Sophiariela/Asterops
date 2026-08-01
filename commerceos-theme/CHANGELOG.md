# Changelog

All notable changes to this theme are documented here.

## 1.1.0 — 2026-07-30

### Rebrand
- Renamed the theme from "CommerceOS - Luxe" to **ASTER** across `config/settings_schema.json` (`theme_info`), `README.md`, and the top-of-file comments in every `assets/*.js` file and `assets/base.css`.
- Renamed the shared front-end JS namespace `window.CommerceOS` to `window.ASTER` (and the wishlist `localStorage` key from `commerceos:wishlist` to `aster:wishlist`) for full internal consistency. Purely an internal rename — no behavior change.
- Visual identity (colors, typography, layout tokens) was intentionally left untouched — the theme was already fully merchant-editable via Theme Settings, so no hardcoded palette needed rebuilding.

### Added
- **FAQ section** (`sections/faq.liquid`) — schema-driven, repeatable question/answer blocks rendered as accessible `<details>/<summary>` accordions. Added to the homepage (`templates/index.json`) with 4 default e-commerce FAQs (shipping, returns, payments, tracking), and available from "Add section" in the Theme Editor.
- **Google Analytics 4** (`snippets/google-analytics.liquid`) — conditionally injects `gtag.js`, gated by a new `settings.ga4_measurement_id` text field under a new "Analytics" settings group in `config/settings_schema.json`. Renders nothing when the field is blank. Included from `layout/theme.liquid`.
- **Product page social sharing** (`snippets/social-share.liquid`) — WhatsApp, Facebook and Pinterest share links using each platform's native share URL scheme (`wa.me`, `sharer.php`, `pin/create`), plus a Web Share API / clipboard fallback. Wired into the existing `share` block in `sections/main-product.liquid`. Added a `whatsapp` icon case to `snippets/icon.liquid`.
- **Cart discount code field** (`snippets/cart-summary.liquid`, `assets/cart.js`) — lets shoppers enter a code in the cart and routes them through Shopify's native `/discount/{code}?redirect=/checkout` link, which validates and applies the discount on the Shopify-hosted checkout. A visible hint clarifies the code is validated at checkout, since there is no public Ajax endpoint to apply discounts to the cart itself.

### Confirmed (no change needed)
- Payment method badges in `sections/footer.liquid` already used Shopify's native `shop.enabled_payment_types | payment_type_svg_tag`, which renders icons for whichever gateways are enabled in Shopify Admin → Settings → Payments, without hardcoding any specific provider.

### Known technical limitations (by Shopify design, not a theme gap)
- **No native/custom checkout.** Shopify checkout is hosted and managed entirely by Shopify (Shopify Admin / Shopify Plus checkout extensibility); a theme's Liquid/JS code cannot implement or replace it. The theme only links to `routes.cart_url` / `/checkout`, which is the correct and only supported approach.
- **No Ajax "apply discount to cart" endpoint.** Shopify does not expose a public API to validate/apply a discount code against the cart object before checkout. The only supported native mechanism is the `/discount/{code}` redirect route (or a `?discount=` param appended directly to the checkout URL), both of which require a full navigation to Shopify's checkout — implemented here via the cart discount field.
