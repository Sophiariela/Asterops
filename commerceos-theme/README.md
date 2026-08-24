# ASTER (Shopify theme)

> **Relationship to this repo:** this directory is a standalone Shopify Liquid theme —
> a separate deliverable from the Next.js app that makes up the rest of this repository
> (`src/`). It is kept here, undeployed and unbuilt against the Next.js app, as the
> concrete Shopify-side artifact for CommerceOS engagements that run on Shopify rather
> than a fully custom storefront. It has its own install/preview flow (below) and does
> not share code, config, or tooling with `src/`. Nothing in `src/` imports from or
> depends on this directory, and nothing here should — keep the boundary explicit if
> either side grows.

A premium Shopify Online Store 2.0 theme built to flex across Fashion, Jewelry, Beauty, Handmade, and Luxury verticals through merchant-editable settings rather than hardcoded styling. Mobile-first, JSON-templated, fully schema-driven, ready to sell out of the box.

## Install / preview

```
shopify theme dev --store your-store.myshopify.com
```

or upload the `commerceos-theme` folder as a .zip via Shopify Admin → Online Store → Themes → Add theme → Upload zip.

## Structure

- `layout/theme.liquid` — document shell, global JS/CSS includes, cart drawer + quick-add modal mount points.
- `sections/header-group.json`, `sections/footer-group.json` — OS 2.0 section groups (announcement bar + header; footer).
- `sections/*.liquid` — one section per homepage block, plus `main-*` sections for collection/product/cart/page/search/404/wishlist.
- `templates/*.json` — Home, Collection, Product, Cart, About (`page.json`), Contact (`page.contact.json`), Wishlist (`page.wishlist.json`), Search, 404.
- `snippets/*.liquid` — reusable partials: product card, price, color swatches, rating stars, cart line items/summary, icons (inline SVG, no icon font), meta tags/JSON-LD.
- `assets/base.css` — single mobile-first stylesheet driven by CSS custom properties set in `snippets/css-variables.liquid` from theme settings.
- `assets/*.js` — no build step, no framework. Each file is self-guarding (checks for its target elements before doing anything), so they're safe to load globally.
- `config/settings_schema.json` — every merchant-facing setting (colors, typography, layout, buttons, product cards, cart behavior, wishlist, social links, favicon).
- `locales/en.default.json` + `en.default.schema.json` — all storefront and admin-editor strings.

## What merchants can edit from Admin (Theme Editor)

- **Colors** — background, text, primary/secondary accents, borders, sale/success/star colors (theme-wide).
- **Typography** — heading + body font pickers (any Shopify font), size scale, letter case.
- **Layout** — page width, grid gutter, section spacing, corner radius (sharp/soft/rounded).
- **Buttons** — solid / outline / text-link style, letter case.
- **Product cards** — image ratio, hover-swap image, vendor, rating, quick add, wishlist, swatches, sale badge — each independently toggleable.
- **Cart** — drawer vs. page, gift note toggle, free-shipping progress bar threshold.
- **Wishlist** — on/off, target page URL.
- **Homepage** — every section (hero slideshow, featured collections, product grid, image+text, collection list, testimonials, FAQ, Instagram grid, newsletter) is addable/removable/reorderable with its own blocks.
- **Header** — logo + width, sticky toggle, menu, and a repeatable "mega menu panel" block that binds a rich flyout (columns + feature image) to any top-level menu label; menu items without a matching block still get an auto-generated simple dropdown if they have sub-links.
- **Footer** — newsletter toggle/copy, up to N link-list or rich-text columns, payment icons, copyright line.
- **Analytics** — optional Google Analytics 4 Measurement ID (Theme Settings → Analytics).

## Feature notes

- **Mega menu** — `sections/header.liquid` + `assets/mega-menu.js`. Add a "Mega menu panel" block and set its label to match a top-level menu item exactly to enable a rich flyout; otherwise nested menu items render as a plain dropdown automatically.
- **Quick add** — each product card ships a hidden `<template>` with a self-contained variant form; `assets/quick-add.js` clones it into a shared modal (`snippets/quick-add-modal.liquid`) and posts to `/cart/add.js`.
- **Filtering/sorting** — `sections/main-collection-product-grid.liquid` uses native Shopify filters (`collection.filters`) with a slide-out drawer; `assets/collection-filters.js` re-fetches just that section via the Section Rendering API on every change, no full page reload.
- **Wishlist** — client-side only (`assets/wishlist.js`, `localStorage`), so it works without an app. Create a page at `/pages/wishlist` using the "page.wishlist" template (or update the URL in Theme Settings → Wishlist) to give it a dedicated page.
- **Product recommendations** — `sections/product-recommendations.liquid` is a custom element that calls Shopify's native `routes.product_recommendations_url` and removes itself if there are no results.
- **Announcement bar** — repeatable message blocks with optional auto-rotate and social icons.
- **Instagram section** — editorial (image blocks you upload + link), not tied to a live API/app.
- **Cart** — Ajax add/update/remove throughout (drawer and page share the same snippets), with a free-shipping progress bar and optional gift note.

## Ready-to-sell additions

- **FAQ section** (`sections/faq.liquid`) — schema-driven, repeatable "Question" blocks rendered as accessible `<details>/<summary>` accordions (reuses the existing `.accordion` styles). Ships on the homepage (`templates/index.json`) with 4 default e-commerce FAQs and is fully editable/removable/addable from the Theme Editor via its `presets`.
- **Google Analytics 4** (`snippets/google-analytics.liquid`) — injects `gtag.js` only when a Measurement ID is set in Theme Settings → Analytics (`settings.ga4_measurement_id`). No ID is hardcoded; the snippet renders nothing until a merchant fills the field in, and it's included conditionally from `layout/theme.liquid`.
- **Social share on product pages** (`snippets/social-share.liquid`, wired into the `share` block of `sections/main-product.liquid`) — direct WhatsApp, Facebook and Pinterest share links (`wa.me`, `facebook.com/sharer/sharer.php`, `pinterest.com/pin/create`) built from `shop.url`, `product.url`, `product.title` and `product.featured_image`, plus a native Web Share API / clipboard-copy fallback button. No external SDK or app dependency.
- **Cart discount code field** (`snippets/cart-summary.liquid` + `assets/cart.js`) — Shopify does not expose a public Ajax endpoint to apply a discount to the cart itself; discounts are only ever validated on the Shopify-hosted checkout. The field therefore sends the shopper to Shopify's native `/discount/{code}?redirect=/checkout` route (the same URL Admin → Discounts → "Share link" generates), which validates the code and applies it to the checkout session before landing on `/checkout`. This is clearly explained in the on-page hint text so merchants and shoppers aren't misled about an Ajax-applied discount that doesn't exist.
- **Payment method badges** (`sections/footer.liquid`) — already used the native `shop.enabled_payment_types | payment_type_svg_tag` output, so the footer automatically shows the icons for whatever gateways are enabled in Shopify Admin → Settings → Payments. No gateway is hardcoded.

## Extending

- New homepage section: add a `sections/your-section.liquid` with a `{% schema %}` block, then add it to `templates/index.json` (or let merchants add it via "Add section" in the editor if you include a `presets` key).
- New icon: add a `{%- when 'your-icon' -%}` case in `snippets/icon.liquid`.
- Color mapping for swatches: extend the `case` statement in `snippets/color-swatches.liquid`.

## Browser support

Evergreen browsers (Chrome, Safari, Firefox, Edge). Uses `<dialog>`-style drawers via CSS transforms, `fetch`, `URLSearchParams`, custom elements, and optional chaining — no IE11 support.
