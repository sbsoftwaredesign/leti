import {
  buildNavSections,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  getCategoryBadgeClass,
  getStatusBadgeClass,
  groupByCategory,
  PROJECT_ORDER,
  slugify,
  STANDALONE_CATEGORIES,
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

describe("buildNavSections", () => {
  const mixedProjects: ProjectMeta[] = [
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
      title: "Bio",
      slug: "bio",
      category: "bio",
      status: "final",
      order: 1,
      date: "2026-01-01",
      description: "A bio",
    },
    {
      title: "TIFF App",
      slug: "tiff-app",
      category: "application",
      status: "final",
      order: 1,
      date: "2026-01-01",
      description: "TIFF app",
      project: "tiff",
    },
    {
      title: "TIFF Assessment",
      slug: "tiff-assessment",
      category: "assessment",
      status: "final",
      order: 3,
      date: "2026-01-01",
      description: "Assessment",
      project: "tiff",
    },
    {
      title: "Carrar",
      slug: "carrar",
      category: "pitch",
      status: "draft",
      order: 1,
      date: "2026-01-01",
      description: "Carrar pitch",
      project: "carrar",
    },
    {
      title: "Weight Limit",
      slug: "weight-limit",
      category: "pitch",
      status: "final",
      order: 1,
      date: "2026-01-01",
      description: "WL pitch",
      project: "weight-limit",
    },
    {
      title: "Guide",
      slug: "guide",
      category: "guide",
      status: "final",
      order: 1,
      date: "2026-01-01",
      description: "Guide",
    },
  ];

  it("returns standalone sections before projects", () => {
    const sections = buildNavSections(mixedProjects);
    expect(sections[0].type).toBe("standalone");
    if (sections[0].type === "standalone") {
      expect(sections[0].category).toBe("cv");
    }
    expect(sections[1].type).toBe("standalone");
    if (sections[1].type === "standalone") {
      expect(sections[1].category).toBe("bio");
    }
  });

  it("groups project items together", () => {
    const sections = buildNavSections(mixedProjects);
    const projectSections = sections.filter((s) => s.type === "project");
    expect(projectSections).toHaveLength(3);
  });

  it("follows PROJECT_ORDER for project sections", () => {
    const sections = buildNavSections(mixedProjects);
    const projectSections = sections.filter((s) => s.type === "project");
    expect(
      projectSections[0].type === "project" && projectSections[0].projectKey,
    ).toBe("tiff");
    expect(
      projectSections[1].type === "project" && projectSections[1].projectKey,
    ).toBe("carrar");
    expect(
      projectSections[2].type === "project" && projectSections[2].projectKey,
    ).toBe("weight-limit");
  });

  it("places guide at the end", () => {
    const sections = buildNavSections(mixedProjects);
    const last = sections[sections.length - 1];
    expect(last.type).toBe("standalone");
    if (last.type === "standalone") {
      expect(last.category).toBe("guide");
    }
  });

  it("sorts items by order within each project", () => {
    const sections = buildNavSections(mixedProjects);
    const tiff = sections.find(
      (s) => s.type === "project" && s.projectKey === "tiff",
    );
    expect(tiff).toBeDefined();
    if (tiff) {
      expect(tiff.items[0].order).toBeLessThanOrEqual(tiff.items[1].order);
    }
  });

  it("omits empty project groups", () => {
    const onlyCv: ProjectMeta[] = [mixedProjects[0]];
    const sections = buildNavSections(onlyCv);
    expect(sections).toHaveLength(1);
    expect(sections[0].type).toBe("standalone");
  });
});

describe("PROJECT_ORDER", () => {
  it("contains expected projects", () => {
    expect(PROJECT_ORDER).toContain("tiff");
    expect(PROJECT_ORDER).toContain("carrar");
    expect(PROJECT_ORDER).toContain("weight-limit");
  });
});

describe("STANDALONE_CATEGORIES", () => {
  it("contains cv, bio, guide", () => {
    expect(STANDALONE_CATEGORIES).toContain("cv");
    expect(STANDALONE_CATEGORIES).toContain("bio");
    expect(STANDALONE_CATEGORIES).toContain("guide");
  });

  it("does not contain project-based categories", () => {
    expect(STANDALONE_CATEGORIES).not.toContain("application");
    expect(STANDALONE_CATEGORIES).not.toContain("pitch");
    expect(STANDALONE_CATEGORIES).not.toContain("assessment");
  });
});
