export interface ProjectMeta {
  title: string;
  subtitle?: string;
  date: string;
  category: Category;
  status: Status;
  order: number;
  description: string;
  slug: string;
  project?: string;
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

export const PROJECT_ORDER: string[] = ["tiff", "carrar", "weight-limit"];

export const STANDALONE_CATEGORIES: Category[] = ["cv", "bio", "guide"];

export interface MenuGroup {
  type: "standalone";
  category: Category;
  items: ProjectMeta[];
}

export interface ProjectGroup {
  type: "project";
  projectKey: string;
  items: ProjectMeta[];
}

export type NavSection = MenuGroup | ProjectGroup;

export function buildNavSections(projects: ProjectMeta[]): NavSection[] {
  const sections: NavSection[] = [];

  // Standalone categories first (cv, bio)
  for (const cat of STANDALONE_CATEGORIES) {
    if (cat === "guide") continue; // guide goes at end
    const items = projects
      .filter((p) => p.category === cat && !p.project)
      .sort((a, b) => a.order - b.order);
    if (items.length > 0) {
      sections.push({ type: "standalone", category: cat, items });
    }
  }

  // Project groups
  for (const proj of PROJECT_ORDER) {
    const items = projects
      .filter((p) => p.project === proj)
      .sort((a, b) => a.order - b.order);
    if (items.length > 0) {
      sections.push({ type: "project", projectKey: proj, items });
    }
  }

  // Guide at end
  const guideItems = projects
    .filter((p) => p.category === "guide" && !p.project)
    .sort((a, b) => a.order - b.order);
  if (guideItems.length > 0) {
    sections.push({ type: "standalone", category: "guide", items: guideItems });
  }

  return sections;
}

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
