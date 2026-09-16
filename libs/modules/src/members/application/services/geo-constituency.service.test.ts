import { describe, it, expect } from "vitest";
import { GeoConstituencyService } from "./geo-constituency.service";

describe("GeoConstituencyService", () => {
  describe("resolveFromMandal", () => {
    it("should resolve exact Assembly and Parliamentary Constituency for Karimnagar/Vemulawada", () => {
      const result = GeoConstituencyService.resolveFromMandal("Karimnagar", "Vemulawada");
      expect(result.assemblyConstituency).toBe("Vemulawada");
      expect(result.parliamentaryConstituency).toBe("Karimnagar");
      expect(result.geoConfidence).toBe("MANDAL_RESOLVED");
    });

    it("should resolve exact Assembly Constituency for Warangal/Hanamkonda", () => {
      const result = GeoConstituencyService.resolveFromMandal("Warangal", "Hanamkonda");
      expect(result.assemblyConstituency).toBe("Warangal West");
      expect(result.parliamentaryConstituency).toBe("Warangal");
      expect(result.geoConfidence).toBe("MANDAL_RESOLVED");
    });

    it("should resolve exact Assembly Constituency for Hyderabad/Charminar", () => {
      const result = GeoConstituencyService.resolveFromMandal("Hyderabad", "Charminar");
      expect(result.assemblyConstituency).toBe("Charminar");
      expect(result.parliamentaryConstituency).toBe("Hyderabad");
      expect(result.geoConfidence).toBe("MANDAL_RESOLVED");
    });

    it("should gracefully fall back to district default if mandal is not listed", () => {
      const result = GeoConstituencyService.resolveFromMandal("Nalgonda", "UnknownVillageMandal");
      expect(result.assemblyConstituency).toBe("Nalgonda Urban");
      expect(result.parliamentaryConstituency).toBe("Nalgonda");
      expect(result.geoConfidence).toBe("DISTRICT_DEFAULT");
    });
  });

  describe("refineFromCoordinates", () => {
    it("should refine constituency from GPS coordinates for Karimnagar", () => {
      const result = GeoConstituencyService.refineFromCoordinates(18.4386, 79.1288);
      expect(result).not.toBeNull();
      expect(result!.assemblyConstituency).toBe("Karimnagar");
      expect(result!.parliamentaryConstituency).toBe("Karimnagar");
      expect(result!.geoConfidence).toBe("GPS_REFINED");
    });

    it("should return null for invalid or distant coordinates", () => {
      const result = GeoConstituencyService.refineFromCoordinates(51.5074, -0.1278); // London
      expect(result).toBeNull();
    });

    it("should return null for NaN inputs", () => {
      const result = GeoConstituencyService.refineFromCoordinates(NaN, NaN);
      expect(result).toBeNull();
    });
  });
});
