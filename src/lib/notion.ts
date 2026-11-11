import { Client } from "@notionhq/client";

export interface InquirySubmission {
  name: string;
  email: string;
  businessName?: string;
  service?: string;
  budget?: string;
  message: string;
  timeline?: string;
}

let client: Client | null = null;

function getClient(): Client {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("NOTION_API_KEY is not set.");
  }
  if (!client) {
    client = new Client({ auth: apiKey });
  }
  return client;
}

export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
}

/**
 * Optional secondary export: mirrors an inquiry into the Notion CRM database.
 * The database is the source of truth (see `Inquiry` in prisma/schema.prisma)
 * — this is best-effort and never blocks a submission from succeeding.
 */
export async function mirrorInquiryToNotion(submission: InquirySubmission): Promise<void> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set.");
  }

  await getClient().pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: submission.name } }] },
      Email: { email: submission.email },
      Company: { rich_text: submission.businessName ? [{ text: { content: submission.businessName } }] : [] },
      Service: { select: submission.service ? { name: submission.service } : null },
      Message: { rich_text: [{ text: { content: submission.message } }] },
      "Created At": { date: { start: new Date().toISOString() } },
      Status: { select: { name: "New" } },
    },
  });
}
