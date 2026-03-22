import { copyToClipboard } from "@lib/clipboard";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("copyToClipboard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uses navigator.clipboard.writeText when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    const result = await copyToClipboard("test text");
    expect(result).toBe(true);
    expect(writeText).toHaveBeenCalledWith("test text");
  });

  it("returns false when clipboard API fails and fallback fails", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("fail"));
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    document.execCommand = vi.fn().mockReturnValue(false);

    const result = await copyToClipboard("test text");
    expect(result).toBe(false);
  });

  it("uses fallback when clipboard API is not available", async () => {
    vi.stubGlobal("navigator", {});
    document.execCommand = vi.fn().mockReturnValue(true);

    const result = await copyToClipboard("fallback text");
    expect(result).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });

  it("returns false when execCommand throws", async () => {
    vi.stubGlobal("navigator", {});
    document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error("not supported");
    });

    const result = await copyToClipboard("throw text");
    expect(result).toBe(false);
  });

  it("returns false when navigator is undefined", async () => {
    const originalNavigator = globalThis.navigator;
    // @ts-expect-error — testing SSR guard
    delete globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', { value: undefined, writable: true, configurable: true });

    const { copyToClipboard: copy } = await import("@lib/clipboard");
    const result = await copy("test");
    expect(result).toBe(false);

    Object.defineProperty(globalThis, 'navigator', { value: originalNavigator, writable: true, configurable: true });
  });
});
