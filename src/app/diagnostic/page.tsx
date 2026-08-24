import type { Metadata } from "next";

import { DiagnosticFlow } from "@/components/diagnostic/diagnostic-flow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Find your growth system",
  description:
    "Nine business questions. One rules-based recommendation for which Aster system — and which service tier — fits where your business is today.",
  path: "/diagnostic",
});

export default function DiagnosticPage() {
  return <DiagnosticFlow />;
}
