import {
  getLocaleDateFormat,
  LOCALE_LABELS,
  localeFromSlug,
  LOCALES,
  projectPath,
  stripLocalePrefix,
  t,
} from "@lib/i18n";
import { describe, expect, it } from "vitest";

describe("LOCALES", () => {
  it("contains en and es", () => {
    expect(LOCALES).toEqual(["en", "es"]);
  });
});

describe("LOCALE_LABELS", () => {
  it("maps en to EN", () => {
    expect(LOCALE_LABELS.en).toBe("EN");
  });

  it("maps es to ES", () => {
    expect(LOCALE_LABELS.es).toBe("ES");
  });
});

describe("t", () => {
  it("returns English translation by default", () => {
    expect(t("home")).toBe("Home");
  });

  it("returns English translation for locale en", () => {
    expect(t("home", "en")).toBe("Home");
  });

  it("returns Spanish translation for locale es", () => {
    expect(t("home", "es")).toBe("Inicio");
  });

  it("returns the key when translation is missing", () => {
    expect(t("nonexistent_key")).toBe("nonexistent_key");
  });

  it("returns the key when translation is missing for es", () => {
    expect(t("nonexistent_key", "es")).toBe("nonexistent_key");
  });

  it("translates category keys", () => {
    expect(t("category_cv", "en")).toBe("CV");
    expect(t("category_bio", "es")).toBe("Biografía");
    expect(t("category_pitch", "es")).toBe("Pitch");
    expect(t("category_assessment", "es")).toBe("Evaluación");
    expect(t("category_application", "es")).toBe("Solicitud");
    expect(t("category_guide", "en")).toBe("Guide");
    expect(t("category_guide", "es")).toBe("Guía");
  });

  it("translates status keys", () => {
    expect(t("status_draft", "en")).toBe("Draft");
    expect(t("status_draft", "es")).toBe("Borrador");
    expect(t("status_review", "es")).toBe("Revisión");
    expect(t("status_final", "es")).toBe("Final");
  });

  it("translates documents key", () => {
    expect(t("documents", "en")).toBe("Documents");
    expect(t("documents", "es")).toBe("Documentos");
  });

  it("translates download keys", () => {
    expect(t("download_pdf", "en")).toBe("PDF");
    expect(t("download_markdown", "es")).toBe("Markdown");
  });

  it("translates footer_rights", () => {
    expect(t("footer_rights", "es")).toBe("Todos los derechos reservados");
  });

  it("translates skip_to_content", () => {
    expect(t("skip_to_content", "es")).toBe("Ir al contenido");
  });

  it("translates search_placeholder", () => {
    expect(t("search_placeholder", "es")).toBe("Buscar documentos…");
  });

  it("translates navigation labels", () => {
    expect(t("open_nav", "es")).toBe("Abrir menú de navegación");
    expect(t("close_nav", "es")).toBe("Cerrar menú de navegación");
  });
});

describe("getLocaleDateFormat", () => {
  it("returns en-AU for en locale", () => {
    expect(getLocaleDateFormat("en")).toBe("en-AU");
  });

  it("returns es-AR for es locale", () => {
    expect(getLocaleDateFormat("es")).toBe("es-AR");
  });
});

describe("localeFromSlug", () => {
  it("returns es for slug starting with es/", () => {
    expect(localeFromSlug("es/biography")).toBe("es");
  });

  it("returns en for slug without es/ prefix", () => {
    expect(localeFromSlug("biography")).toBe("en");
  });

  it("returns en for slug with es in the name but not prefix", () => {
    expect(localeFromSlug("espresso-doc")).toBe("en");
  });
});

describe("stripLocalePrefix", () => {
  it("strips es/ prefix", () => {
    expect(stripLocalePrefix("es/biography")).toBe("biography");
  });

  it("returns slug unchanged when no prefix", () => {
    expect(stripLocalePrefix("biography")).toBe("biography");
  });

  it("only strips leading es/", () => {
    expect(stripLocalePrefix("es/cv-filmography")).toBe("cv-filmography");
  });

  it("does not strip es from non-prefix position", () => {
    expect(stripLocalePrefix("test-es/doc")).toBe("test-es/doc");
  });
});

describe("projectPath", () => {
  it("returns /projects/slug/ for en locale", () => {
    expect(projectPath("biography", "en")).toBe("/projects/biography/");
  });

  it("returns /es/projects/slug/ for es locale", () => {
    expect(projectPath("biography", "es")).toBe("/es/projects/biography/");
  });

  it("handles slugs with hyphens", () => {
    expect(projectPath("cv-filmography", "es")).toBe(
      "/es/projects/cv-filmography/",
    );
  });
});
