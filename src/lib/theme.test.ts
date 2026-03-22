import { getTheme, initTheme, setTheme } from "@lib/theme";
import { beforeEach, describe, expect, it } from "vitest";

describe("getTheme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns stored theme from localStorage", () => {
    localStorage.setItem("writer-factory-theme", "dark");
    expect(getTheme()).toBe("dark");
  });

  it('returns "light" when stored value is "light"', () => {
    localStorage.setItem("writer-factory-theme", "light");
    expect(getTheme()).toBe("light");
  });

  it("falls back to prefers-color-scheme when no stored value", () => {
    // happy-dom defaults to light
    expect(getTheme()).toBe("light");
  });

  it("ignores invalid stored values", () => {
    localStorage.setItem("writer-factory-theme", "invalid");
    expect(getTheme()).toBe("light");
  });
});

describe("setTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("stores theme in localStorage", () => {
    setTheme("dark");
    expect(localStorage.getItem("writer-factory-theme")).toBe("dark");
  });

  it("adds dark class when theme is dark", () => {
    setTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when theme is light", () => {
    document.documentElement.classList.add("dark");
    setTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("initTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("applies stored dark theme on init", () => {
    localStorage.setItem("writer-factory-theme", "dark");
    initTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("does not add dark class for light theme", () => {
    localStorage.setItem("writer-factory-theme", "light");
    initTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
