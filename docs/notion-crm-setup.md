# Notion CRM Setup — Aster Contact Form

The Aster contact form ([src/components/contact/contact-form.tsx](../src/components/contact/contact-form.tsx)) submits to `POST /api/contact` ([src/app/api/contact/route.ts](../src/app/api/contact/route.ts)), which validates the payload and writes each submission as a new row (page) in a Notion database via [src/lib/notion.ts](../src/lib/notion.ts).

This guide covers creating the database, creating the integration, obtaining credentials, and connecting everything to the site.

## 1. Create the Notion database

1. In Notion, create a new page (e.g. "Aster Leads") and add a **Table — Full page** database to it.
2. Rename the default `Name` property (keep it — it's the page title) and add the following properties, matching these names and types exactly (the integration writes to these exact property names):

   | Property name      | Type      | Notes                                      |
   | ------------------ | --------- | ------------------------------------------- |
   | `Name`              | Title     | Default title property — just rename it.    |
   | `Email`              | Email     |                                              |
   | `Company`            | Text      |                                              |
   | `Product Interest`   | Select    | Add one option per product (see below).     |
   | `Message`            | Text      |                                              |
   | `Created At`         | Date      |                                              |
   | `Status`             | Select    | Add a `New Lead` option (see below).        |

3. For **Product Interest**, add a select option for each Aster solution plus a catch-all: `Aster Foundation`, `Aster Automation`, `Aster Intelligence`, `Not sure yet`. These match `productInterestOptions` in [src/config/contact.ts](../src/config/contact.ts) — if you rename or add solutions there later, add matching options here.
4. For **Status**, add at least a `New Lead` option. This is the default value the API sets on every new submission; add whatever other statuses your sales process needs (e.g. `Contacted`, `Qualified`, `Closed`) — the integration never writes those, they're for your team to update manually as leads progress.
5. Copy the database URL from the browser or the "Copy link" option in the `•••` menu — you'll extract the database ID from it in step 3.

## 2. Create the Notion integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) while logged into the Notion workspace that owns the database above.
2. Click **New integration**.
3. Set:
   - **Name**: `Aster Contact Form` (or similar)
   - **Associated workspace**: the workspace containing your leads database
   - **Type**: Internal
4. Under **Capabilities**, make sure **Insert content** is enabled (read access is optional — the integration only needs to create pages). Save.

## 3. Obtain API credentials

You need two values:

- **`NOTION_API_KEY`** — on the integration's page (from step 2), go to the **Secrets** tab and copy the **Internal Integration Secret**. It starts with `secret_` (or `ntn_` on newer integrations).
- **`NOTION_DATABASE_ID`** — from the database URL you copied in step 1, e.g.:

  ```
  https://www.notion.so/myworkspace/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d?v=...
                                     └──────────── this 32-char string ────────────┘
  ```

  That 32-character string (with or without dashes) is the database ID.

Then, **share the database with the integration** — this step is easy to miss and causes `object_not_found` errors even with correct credentials:

1. Open the database in Notion.
2. Click **•••** (top right) → **Connections** → **Connect to** → select `Aster Contact Form`.

## 4. Connect the database to the Aster website

### Local development

1. Copy the example env file and fill in the values from step 3:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   `.env.local` is already covered by `.gitignore` — never commit real credentials.

2. Run `npm run dev` and submit the form at `/contact`. A new row should appear in the Notion database within a few seconds.

### Production (Vercel or similar)

1. In your hosting provider's dashboard, add the same two environment variables (`NOTION_API_KEY`, `NOTION_DATABASE_ID`) as **server-side** secrets (do not prefix them with `NEXT_PUBLIC_` — they must never reach the browser).
2. Redeploy so the new environment variables take effect.
3. Submit a test lead through the live `/contact` page and confirm it lands in Notion.

## How it behaves

- On submit, the API validates the payload (name, email, product interest, message) with Zod. Invalid input returns a `400` and the form shows field-level errors.
- On success, a new page is created in the Notion database with `Status` defaulted to `New Lead` and `Created At` set to the submission time. The visitor sees:

  > Thank you. Your request has been received. We will contact you within one business day.

- If the Notion API call fails for any reason (bad credentials, database not shared with the integration, Notion outage, network error), the server logs the error and returns a `502` with a generic message; the form displays a friendly error instead of crashing or losing the visitor's input.
