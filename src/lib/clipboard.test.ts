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
});
