import { Client } from "@notionhq/client";

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  productInterest: string;
  message: string;
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

/**
 * Creates a new page (row) in the Notion CRM database for a contact form submission.
 * Field names below must match the Notion database properties exactly —
 * see the setup guide for how the database is expected to be structured.
 */
export async function createLeadInNotion(submission: ContactSubmission): Promise<void> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set.");
  }

  await getClient().pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: submission.name } }],
      },
      Email: {
        email: submission.email,
      },
      Company: {
        rich_text: submission.company ? [{ text: { content: submission.company } }] : [],
      },
      "Product Interest": {
        select: { name: submission.productInterest },
      },
      Message: {
        rich_text: [{ text: { content: submission.message } }],
      },
      "Created At": {
        date: { start: new Date().toISOString() },
      },
      Status: {
        select: { name: "New Lead" },
      },
    },
  });
}
