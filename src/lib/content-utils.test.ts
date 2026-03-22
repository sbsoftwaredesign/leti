import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  getCategoryBadgeClass,
  getStatusBadgeClass,
  groupByCategory,
  slugify,
  stripFrontmatter,
  type ProjectMeta,
} from "@lib/content-utils";
import { describe, expect, it } from "vitest";

describe("stripFrontmatter", () => {
  it("removes YAML frontmatter from content", () => {
    const input = "---\ntitle: Test\n---\n# Hello\n\nBody text";
    expect(stripFrontmatter(input)).toBe("# Hello\n\nBody text");
  });

  it("returns content unchanged when no frontmatter", () => {
    const input = "# Just a heading\n\nSome text";
    expect(stripFrontmatter(input)).toBe(input);
  });

  it("handles empty content after frontmatter", () => {
    const input = "---\ntitle: Empty\n---\n";
    expect(stripFrontmatter(input)).toBe("");
  });

  it("handles Windows line endings", () => {
    const input = "---\r\ntitle: Test\r\n---\r\n# Content";
    expect(stripFrontmatter(input)).toBe("# Content");
  });

  it("preserves content with --- inside body", () => {
    const input = "---\ntitle: Test\n---\nBefore\n\n---\n\nAfter";
    expect(stripFrontmatter(input)).toBe("Before\n\n---\n\nAfter");
  });
});

describe("slugify", () => {
  it("converts text to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("CV & Filmography!")).toBe("cv-filmography");
  });

  it("collapses multiple spaces/underscores", () => {
    expect(slugify("a   b___c")).toBe("a-b-c");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("-hello-")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("groupByCategory", () => {
  const mockProjects: ProjectMeta[] = [
    {
      title: "Bio",
      slug: "bio",
      category: "bio",
      status: "final",
      order: 1,
      date: "2026-01-01",
      description: "A bio",
    },
    {
      title: "CV",
      slug: "cv",
      category: "cv",
      status: "final",
      order: 1,
      date: "2026-01-01",
      description: "A CV",
    },
    {
      title: "Pitch",
      slug: "pitch",
      category: "pitch",
      status: "draft",
      order: 1,
      date: "2026-01-01",
      description: "A pitch",
    },
    {
      title: "Assessment",
      slug: "assessment",
      category: "assessment",
      status: "review",
      order: 1,
      date: "2026-01-01",
      description: "An assessment",
    },
  ];

  it("groups projects by category", () => {
    const grouped = groupByCategory(mockProjects);
    expect(grouped.size).toBe(4);
    expect(grouped.get("cv")).toHaveLength(1);
    expect(grouped.get("bio")).toHaveLength(1);
  });

  it("maintains CATEGORY_ORDER", () => {
    const grouped = groupByCategory(mockProjects);
    const keys = Array.from(grouped.keys());
    expect(keys).toEqual(["cv", "bio", "pitch", "assessment"]);
  });

  it("omits empty categories", () => {
    const grouped = groupByCategory([mockProjects[0]]);
    expect(grouped.size).toBe(1);
    expect(grouped.has("application")).toBe(false);
  });

  it("sorts items by order within category", () => {
    const projects: ProjectMeta[] = [
      {
        title: "Second",
        slug: "b",
        category: "cv",
        status: "final",
        order: 2,
        date: "2026-01-01",
        description: "",
      },
      {
        title: "First",
        slug: "a",
        category: "cv",
        status: "final",
        order: 1,
        date: "2026-01-01",
        description: "",
      },
    ];
    const grouped = groupByCategory(projects);
    const cv = grouped.get("cv")!;
    expect(cv[0].title).toBe("First");
    expect(cv[1].title).toBe("Second");
  });
});

describe("CATEGORY_LABELS", () => {
  it("has labels for all categories", () => {
    for (const cat of CATEGORY_ORDER) {
      expect(CATEGORY_LABELS[cat]).toBeDefined();
      expect(typeof CATEGORY_LABELS[cat]).toBe("string");
    }
  });
});

describe("getCategoryBadgeClass", () => {
  it("returns correct badge class", () => {
    expect(getCategoryBadgeClass("cv")).toBe("badge badge-cv");
    expect(getCategoryBadgeClass("bio")).toBe("badge badge-bio");
    expect(getCategoryBadgeClass("application")).toBe(
      "badge badge-application",
    );
  });
});

describe("getStatusBadgeClass", () => {
  it("returns correct status badge class", () => {
    expect(getStatusBadgeClass("draft")).toBe("badge badge-draft");
    expect(getStatusBadgeClass("review")).toBe("badge badge-review");
    expect(getStatusBadgeClass("final")).toBe("badge badge-final");
  });
});
