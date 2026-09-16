import { describe, it, expect, vi, beforeEach } from "vitest";
import { DigitalIdService } from "./digital-id.service";
import { cacheProvider } from "@vishwakarma-k-c/shared";

vi.mock("@vishwakarma-k-c/shared", async (importOriginal) => {
  const actual = await importOriginal<any>();
  let seq = 0;
  return {
    ...actual,
    cacheProvider: {
      increment: vi.fn(async () => {
        seq++;
        return seq;
      }),
    },
  };
});

describe("DigitalIdService", () => {
  it("should generate monotonically increasing Digital IDs without collision", async () => {
    const id1 = await DigitalIdService.nextId(2026);
    const id2 = await DigitalIdService.nextId(2026);
    const id3 = await DigitalIdService.nextId(2026);

    expect(id1).toBe("VKC-2026-100001");
    expect(id2).toBe("VKC-2026-100002");
    expect(id3).toBe("VKC-2026-100003");
  });
});
