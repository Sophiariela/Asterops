export type ProjectClassification =
  | "CLIENT_PROJECT"
  | "INTERNAL_PRODUCT"
  | "PROTOTYPE"
  | "DEMONSTRATION";
export type ProjectStatus = "LIVE" | "DELIVERED" | "IN_PROGRESS";

export interface PortfolioProjectSummary {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  caseStudy: string | null;
  coverImage: string | null;
  gallery: string[];
  projectUrl: string | null;
  technologies: string[];
  classification: ProjectClassification;
  status: ProjectStatus;
  published: boolean;
  order: number;
}
