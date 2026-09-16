import { logger } from "@vishwakarma-k-c/shared";

export interface ConstituencyResult {
  assemblyConstituency: string;
  parliamentaryConstituency: string;
  geoConfidence: "MANDAL_RESOLVED" | "GPS_REFINED" | "DISTRICT_DEFAULT";
}

interface ConstituencyCentroid {
  ac: string;
  pc: string;
  lat: number;
  lng: number;
}

/**
 * GeoConstituencyService
 * Translates grassroots administrative inputs (District + Mandal) and GPS coordinates
 * into precise Assembly and Parliamentary Constituencies for confidential representation intelligence.
 */
export class GeoConstituencyService {
  // Canonical Mandal to Assembly (AC) & Parliamentary (PC) Mapping
  private static readonly MANDAL_MAP: Record<string, { ac: string; pc: string }> = {
    // Karimnagar District
    "karimnagar:karimnagar": { ac: "Karimnagar", pc: "Karimnagar" },
    "karimnagar:manakondur": { ac: "Manakondur", pc: "Karimnagar" },
    "karimnagar:huzurabad": { ac: "Huzurabad", pc: "Karimnagar" },
    "karimnagar:jammikunta": { ac: "Huzurabad", pc: "Karimnagar" },
    "karimnagar:vemulawada": { ac: "Vemulawada", pc: "Karimnagar" },
    "karimnagar:choppadandi": { ac: "Choppadandi", pc: "Karimnagar" },
    "karimnagar:gangadhara": { ac: "Choppadandi", pc: "Karimnagar" },
    "karimnagar:timmapur": { ac: "Manakondur", pc: "Karimnagar" },

    // Warangal & Hanamkonda
    "warangal:warangal": { ac: "Warangal East", pc: "Warangal" },
    "warangal:hanamkonda": { ac: "Warangal West", pc: "Warangal" },
    "warangal:kazipet": { ac: "Warangal West", pc: "Warangal" },
    "warangal:wardhannapet": { ac: "Wardhannapet", pc: "Warangal" },
    "warangal:parkal": { ac: "Parkal", pc: "Warangal" },
    "warangal:narsampet": { ac: "Narsampet", pc: "Mahabubabad" },

    // Hyderabad
    "hyderabad:charminar": { ac: "Charminar", pc: "Hyderabad" },
    "hyderabad:amberpet": { ac: "Amberpet", pc: "Secunderabad" },
    "hyderabad:khairatabad": { ac: "Khairatabad", pc: "Secunderabad" },
    "hyderabad:jubilee hills": { ac: "Jubilee Hills", pc: "Secunderabad" },
    "hyderabad:chandrayangutta": { ac: "Chandrayangutta", pc: "Hyderabad" },
    "hyderabad:yakutpura": { ac: "Yakutpura", pc: "Hyderabad" },
    "hyderabad:bahadurpura": { ac: "Bahadurpura", pc: "Hyderabad" },
    "hyderabad:secunderabad": { ac: "Secunderabad", pc: "Secunderabad" },
    "hyderabad:musheerabad": { ac: "Musheerabad", pc: "Secunderabad" },
    "hyderabad:sanathnagar": { ac: "Sanathnagar", pc: "Secunderabad" },

    // Medchal-Malkajgiri & Rangareddy
    "medchal-malkajgiri:malkajgiri": { ac: "Malkajgiri", pc: "Malkajgiri" },
    "medchal-malkajgiri:kukatpally": { ac: "Kukatpally", pc: "Malkajgiri" },
    "medchal-malkajgiri:uppal": { ac: "Uppal", pc: "Malkajgiri" },
    "medchal-malkajgiri:quthbullapur": { ac: "Quthbullapur", pc: "Malkajgiri" },
    "medchal-malkajgiri:medchal": { ac: "Medchal", pc: "Malkajgiri" },
    "rangareddy:serilingampally": { ac: "Serilingampally", pc: "Chevella" },
    "rangareddy:rajendranagar": { ac: "Rajendranagar", pc: "Chevella" },
    "rangareddy:chevella": { ac: "Chevella", pc: "Chevella" },
    "rangareddy:ibrahimpatnam": { ac: "Ibrahimpatnam", pc: "Bhongir" },
    "rangareddy:maheshwaram": { ac: "Maheshwaram", pc: "Chevella" },

    // Nizamabad & Kamareddy
    "nizamabad:nizamabad": { ac: "Nizamabad Urban", pc: "Nizamabad" },
    "nizamabad:nizamabad urban": { ac: "Nizamabad Urban", pc: "Nizamabad" },
    "nizamabad:nizamabad rural": { ac: "Nizamabad Rural", pc: "Nizamabad" },
    "nizamabad:armoor": { ac: "Armoor", pc: "Nizamabad" },
    "nizamabad:bodhan": { ac: "Bodhan", pc: "Nizamabad" },
    "nizamabad:banswada": { ac: "Banswada", pc: "Zahirabad" },
    "kamareddy:kamareddy": { ac: "Kamareddy", pc: "Zahirabad" },
    "kamareddy:yellareddy": { ac: "Yellareddy", pc: "Zahirabad" },

    // Medak & Siddipet & Sangareddy
    "medak:medak": { ac: "Medak", pc: "Medak" },
    "medak:narsapur": { ac: "Narsapur", pc: "Medak" },
    "siddipet:siddipet": { ac: "Siddipet", pc: "Medak" },
    "siddipet:gajwel": { ac: "Gajwel", pc: "Medak" },
    "siddipet:dubbak": { ac: "Dubbak", pc: "Medak" },
    "siddipet:husnabad": { ac: "Husnabad", pc: "Karimnagar" },
    "sangareddy:sangareddy": { ac: "Sangareddy", pc: "Medak" },
    "sangareddy:patancheru": { ac: "Patancheru", pc: "Medak" },
    "sangareddy:zaheerabad": { ac: "Zahirabad", pc: "Zahirabad" },

    // Nalgonda, Suryapet & Yadadri Bhongir
    "nalgonda:nalgonda": { ac: "Nalgonda", pc: "Nalgonda" },
    "nalgonda:miryalaguda": { ac: "Miryalaguda", pc: "Nalgonda" },
    "nalgonda:devarakonda": { ac: "Devarakonda", pc: "Nalgonda" },
    "nalgonda:nakrekal": { ac: "Nakrekal", pc: "Bhongir" },
    "suryapet:suryapet": { ac: "Suryapet", pc: "Nalgonda" },
    "suryapet:kodad": { ac: "Kodad", pc: "Nalgonda" },
    "suryapet:huzurnagar": { ac: "Huzurnagar", pc: "Nalgonda" },
    "yadadri bhongir:bhongir": { ac: "Bhongir", pc: "Bhongir" },
    "yadadri bhongir:alair": { ac: "Alair", pc: "Bhongir" },
    "nalgonda:munugode": { ac: "Munugode", pc: "Bhongir" },

    // Khammam & Bhadradri Kothagudem
    "khammam:khammam": { ac: "Khammam", pc: "Khammam" },
    "khammam:palair": { ac: "Palair", pc: "Khammam" },
    "khammam:madhira": { ac: "Madhira", pc: "Khammam" },
    "khammam:wyra": { ac: "Wyra", pc: "Khammam" },
    "khammam:sathupalli": { ac: "Sathupalli", pc: "Khammam" },
    "bhadradri kothagudem:kothagudem": { ac: "Kothagudem", pc: "Mahabubabad" },
    "bhadradri kothagudem:bhadrachalam": { ac: "Bhadrachalam", pc: "Mahabubabad" },
    "bhadradri kothagudem:yellandu": { ac: "Yellandu", pc: "Mahabubabad" },

    // Mahabubnagar, Nagarkurnool, Wanaparthy, Jogulamba Gadwal
    "mahabubnagar:mahabubnagar": { ac: "Mahabubnagar", pc: "Mahabubnagar" },
    "mahabubnagar:jadcherla": { ac: "Jadcherla", pc: "Mahabubnagar" },
    "mahabubnagar:devarkadra": { ac: "Devarkadra", pc: "Mahabubnagar" },
    "nagarkurnool:nagarkurnool": { ac: "Nagarkurnool", pc: "Nagarkurnool" },
    "nagarkurnool:achampet": { ac: "Achampet", pc: "Nagarkurnool" },
    "nagarkurnool:kalwakurthy": { ac: "Kalwakurthy", pc: "Nagarkurnool" },
    "wanaparthy:wanaparthy": { ac: "Wanaparthy", pc: "Nagarkurnool" },
    "jogulamba gadwal:gadwal": { ac: "Gadwal", pc: "Nagarkurnool" },
    "jogulamba gadwal:alampur": { ac: "Alampur", pc: "Nagarkurnool" },

    // Adilabad, Nirmal, Mancherial, Kumuram Bheem Asifabad
    "adilabad:adilabad": { ac: "Adilabad", pc: "Adilabad" },
    "adilabad:boath": { ac: "Boath", pc: "Adilabad" },
    "nirmal:nirmal": { ac: "Nirmal", pc: "Adilabad" },
    "nirmal:mudhole": { ac: "Mudhole", pc: "Adilabad" },
    "nirmal:khanapur": { ac: "Khanapur", pc: "Adilabad" },
    "mancherial:mancherial": { ac: "Mancherial", pc: "Peddapalle" },
    "mancherial:bellampalli": { ac: "Bellampalli", pc: "Peddapalle" },
    "mancherial:chennur": { ac: "Chennur", pc: "Peddapalle" },
    "kumuram bheem asifabad:asifabad": { ac: "Asifabad", pc: "Adilabad" },
    "kumuram bheem asifabad:sirpur": { ac: "Sirpur", pc: "Adilabad" },
  };

  // Geographic Centroids for Coordinate Nearest-Neighbor Resolution
  private static readonly CONSTITUENCY_CENTROIDS: ConstituencyCentroid[] = [
    { ac: "Karimnagar", pc: "Karimnagar", lat: 18.4386, lng: 79.1288 },
    { ac: "Vemulawada", pc: "Karimnagar", lat: 18.4682, lng: 78.8687 },
    { ac: "Huzurabad", pc: "Karimnagar", lat: 18.1925, lng: 79.3972 },
    { ac: "Manakondur", pc: "Karimnagar", lat: 18.3150, lng: 79.1850 },
    { ac: "Warangal East", pc: "Warangal", lat: 17.9784, lng: 79.6000 },
    { ac: "Warangal West", pc: "Warangal", lat: 17.9950, lng: 79.5600 },
    { ac: "Charminar", pc: "Hyderabad", lat: 17.3616, lng: 78.4747 },
    { ac: "Secunderabad", pc: "Secunderabad", lat: 17.4399, lng: 78.4983 },
    { ac: "Malkajgiri", pc: "Malkajgiri", lat: 17.4474, lng: 78.5284 },
    { ac: "Kukatpally", pc: "Malkajgiri", lat: 17.4933, lng: 78.3914 },
    { ac: "Serilingampally", pc: "Chevella", lat: 17.4851, lng: 78.3247 },
    { ac: "Nizamabad Urban", pc: "Nizamabad", lat: 18.6725, lng: 78.0941 },
    { ac: "Siddipet", pc: "Medak", lat: 18.1018, lng: 78.8520 },
    { ac: "Medak", pc: "Medak", lat: 18.0461, lng: 78.2612 },
    { ac: "Nalgonda", pc: "Nalgonda", lat: 17.0575, lng: 79.2684 },
    { ac: "Khammam", pc: "Khammam", lat: 17.2473, lng: 80.1514 },
    { ac: "Mahabubnagar", pc: "Mahabubnagar", lat: 16.7488, lng: 77.9856 },
    { ac: "Adilabad", pc: "Adilabad", lat: 19.6641, lng: 78.5320 },
  ];

  /**
   * Primary Step 1: Resolves Assembly and Parliamentary Constituency
   * from District and Mandal during registration with zero friction.
   */
  public static resolveFromMandal(
    district: string,
    mandal?: string | null,
    state: string = "Telangana"
  ): ConstituencyResult {
    const cleanDistrict = (district || "").trim().toLowerCase();
    const cleanMandal = (mandal || "").trim().toLowerCase();

    const lookupKey = `${cleanDistrict}:${cleanMandal}`;
    if (cleanMandal && this.MANDAL_MAP[lookupKey]) {
      return {
        assemblyConstituency: this.MANDAL_MAP[lookupKey].ac,
        parliamentaryConstituency: this.MANDAL_MAP[lookupKey].pc,
        geoConfidence: "MANDAL_RESOLVED",
      };
    }

    // Default fallback based on district name
    const formattedDistrict = district.trim();
    const capitalizedDistrict =
      formattedDistrict.charAt(0).toUpperCase() + formattedDistrict.slice(1);

    return {
      assemblyConstituency: `${capitalizedDistrict} Urban`,
      parliamentaryConstituency: capitalizedDistrict,
      geoConfidence: "DISTRICT_DEFAULT",
    };
  }

  /**
   * Progressive Step 2: Refines constituency precision from GPS coordinates
   * provided via the post-registration in-app modal.
   */
  public static refineFromCoordinates(lat: number, lng: number): ConstituencyResult | null {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

    let closest: ConstituencyCentroid = this.CONSTITUENCY_CENTROIDS[0];
    let minDistance = Infinity;

    for (const c of this.CONSTITUENCY_CENTROIDS) {
      // Euclidean approximation is highly accurate for state-level distances
      const d = Math.sqrt(Math.pow(c.lat - lat, 2) + Math.pow(c.lng - lng, 2));
      if (d < minDistance) {
        minDistance = d;
        closest = c;
      }
    }

    // Maximum distance threshold (~1.5 degrees ≈ 160km)
    if (minDistance > 1.5) {
      return null;
    }

    return {
      assemblyConstituency: closest.ac,
      parliamentaryConstituency: closest.pc,
      geoConfidence: "GPS_REFINED",
    };
  }
}
