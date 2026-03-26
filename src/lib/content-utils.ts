export interface ProjectMeta {
  title: string;
  subtitle?: string;
  date: string;
  category: Category;
  status: Status;
  order: number;
  description: string;
  slug: string;
}

export type Category =
  | "application"
  | "pitch"
  | "cv"
  | "bio"
  | "assessment"
  | "guide";
export type Status = "draft" | "review" | "final";

export const CATEGORY_LABELS: Record<Category, string> = {
  application: "Application",
  pitch: "Pitch",
  cv: "CV",
  bio: "Biography",
  assessment: "Assessment",
  guide: "Guide",
};

export const CATEGORY_ORDER: Category[] = [
  "cv",
  "bio",
  "application",
  "pitch",
  "assessment",
  "guide",
];

export function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match) return match[2].trim();
  return content.trim();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function groupByCategory(
  projects: ProjectMeta[],
): Map<Category, ProjectMeta[]> {
  const groups = new Map<Category, ProjectMeta[]>();

  for (const cat of CATEGORY_ORDER) {
    const items = projects
      .filter((p) => p.category === cat)
      .sort((a, b) => a.order - b.order);
    if (items.length > 0) {
      groups.set(cat, items);
    }
  }

  return groups;
}

export function getCategoryBadgeClass(category: Category): string {
  return `badge badge-${category}`;
}

export function getStatusBadgeClass(status: Status): string {
  return `badge badge-${status}`;
}
