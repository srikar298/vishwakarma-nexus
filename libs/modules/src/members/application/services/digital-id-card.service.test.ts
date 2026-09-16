import { describe, it, expect } from "vitest";
import { DigitalIdCardService } from "./digital-id-card.service";

describe("DigitalIdCardService", () => {
  const sampleCard = {
    digitalId: "VKC-2026-100042",
    fullName: "Suresh Achary",
    kula: "Shilpi",
    trade: "Temple Sthapathi",
    district: "Karimnagar",
    state: "Telangana",
    assemblyConstituency: "Vemulawada",
    parliamentaryConstituency: "Karimnagar",
    joinedYear: 2026,
    isVerified: false,
  };

  it("should generate crisp in-memory vector SVG containing all required card elements", async () => {
    const svg = await DigitalIdCardService.generateCardSvg(sampleCard);

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 856 540"');
    expect(svg).toContain("VISHWAKARMA NEXUS");
    expect(svg).toContain("VKC-2026-100042");
    expect(svg).toContain("Suresh Achary");
    expect(svg).toContain("Shilpi");
    expect(svg).toContain("Temple Sthapathi");
    expect(svg).toContain("Karimnagar, Telangana");
    expect(svg).toContain("AC: Vemulawada");
    expect(svg).toContain("PROVISIONAL COMMUNITY PASS");
    expect(svg).toContain("NEXUS.VKC.ORG");
    // Verify QR code path was embedded
    expect(svg).toContain("path");
    expect(svg).toContain("SCAN TO VERIFY PASS");
  });

  it("should generate verified badge when isVerified is true", async () => {
    const svg = await DigitalIdCardService.generateCardSvg({
      ...sampleCard,
      isVerified: true,
    });

    expect(svg).toContain("OFFICIAL MEMBER");
    expect(svg).toContain("#10b981");
  });

  it("should generate properly formatted and encoded WhatsApp share URL", () => {
    const shareUrl = DigitalIdCardService.getWhatsAppShareUrl(sampleCard.digitalId, sampleCard.fullName);

    expect(shareUrl).toContain("https://api.whatsapp.com/send?text=");
    expect(shareUrl).toContain("VKC-2026-100042");
    expect(shareUrl).toContain("Suresh%20Achary");
    expect(shareUrl).toContain(encodeURIComponent("https://nexus.vkc.org/verify/VKC-2026-100042"));
  });
});
