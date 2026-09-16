import QRCode from "qrcode";

export interface CardData {
  digitalId: string;
  fullName: string;
  kula: string;
  trade: string;
  district: string;
  state: string;
  assemblyConstituency?: string | null;
  parliamentaryConstituency?: string | null;
  joinedYear?: number;
  isVerified?: boolean;
}

/**
 * DigitalIdCardService
 * Generates an in-memory, high-fidelity vector SVG Community Digital Pass (< 3 KB).
 * Completely zero-S3 storage cost, with embedded vector QR code and print-ready resolution.
 */
export class DigitalIdCardService {
  private static readonly BASE_VERIFY_URL = "https://nexus.vkc.org/verify";

  /**
   * Generates crisp vector SVG markup for the member's community pass.
   */
  public static async generateCardSvg(data: CardData): Promise<string> {
    const {
      digitalId,
      fullName,
      kula,
      trade,
      district,
      state,
      assemblyConstituency,
      joinedYear = new Date().getFullYear(),
      isVerified = false,
    } = data;

    const verifyUrl = `${this.BASE_VERIFY_URL}/${encodeURIComponent(digitalId)}`;

    // Generate inline SVG QR code without borders for embedding
    const rawQrSvg = await QRCode.toString(verifyUrl, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#f9fafb", // White QR modules for dark background
        light: "#00000000", // Transparent background
      },
    });

    // Extract the inner SVG path/content from rawQrSvg to embed cleanly
    const qrInnerContent = rawQrSvg
      .replace(/<\?xml.*?\?>/i, "")
      .replace(/<svg[^>]*>/i, "")
      .replace(/<\/svg>/i, "");

    const badgeLabel = isVerified ? "OFFICIAL MEMBER" : "PROVISIONAL COMMUNITY PASS";
    const badgeColor = isVerified ? "#10b981" : "#f59e0b"; // Green vs Amber/Gold

    const constituencyDisplay = assemblyConstituency ? `AC: ${assemblyConstituency}` : `${district} Region`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 856 540" width="856" height="540" style="background:#090d16; border-radius:24px; font-family:'Segoe UI',Roboto,Helvetica,sans-serif; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.6);">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b132b"/>
      <stop offset="50%" stop-color="#1c2541"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>

    <!-- Gold Accent Gradient -->
    <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d4af37"/>
      <stop offset="50%" stop-color="#f3e5ab"/>
      <stop offset="100%" stop-color="#aa771c"/>
    </linearGradient>

    <!-- Badge Glow Filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Base Card Rectangle with Border -->
  <rect x="6" y="6" width="844" height="528" rx="20" fill="url(#cardBg)" stroke="url(#goldAccent)" stroke-width="2"/>

  <!-- Decorative Sacred Geometric Mandala Motifs (Watermark) -->
  <g opacity="0.06" stroke="#d4af37" stroke-width="1.5" fill="none">
    <circle cx="700" cy="270" r="180"/>
    <circle cx="700" cy="270" r="130"/>
    <circle cx="700" cy="270" r="80"/>
    <polygon points="700,90 855,360 545,360"/>
    <polygon points="700,450 855,180 545,180"/>
  </g>

  <!-- Top Brand Banner -->
  <g transform="translate(48, 48)">
    <!-- Vishwakarma Artisan Symbol (Hammer & Chisel / Divine Compass Stylized) -->
    <circle cx="28" cy="28" r="26" fill="url(#goldAccent)"/>
    <text x="28" y="36" text-anchor="middle" font-size="24" font-weight="900" fill="#0b132b">VKC</text>

    <!-- Header Text -->
    <text x="70" y="24" font-size="24" font-weight="800" fill="#f8fafc" letter-spacing="1.5">VISHWAKARMA NEXUS</text>
    <text x="70" y="44" font-size="12" font-weight="600" fill="#d4af37" letter-spacing="2">POWERED BY VISHWAKARMA KNOWLEDGE CENTRE</text>
  </g>

  <!-- Status / Tier Badge -->
  <g transform="translate(560, 48)">
    <rect x="0" y="0" width="248" height="34" rx="8" fill="${badgeColor}" fill-opacity="0.15" stroke="${badgeColor}" stroke-width="1.5"/>
    <circle cx="18" cy="17" r="5" fill="${badgeColor}" filter="url(#glow)"/>
    <text x="32" y="23" font-size="12" font-weight="800" fill="${badgeColor}" letter-spacing="1">${badgeLabel}</text>
  </g>

  <!-- Divider Line -->
  <line x1="48" y1="110" x2="808" y2="110" stroke="url(#goldAccent)" stroke-width="1" opacity="0.4"/>

  <!-- Member Primary Details (Left Column) -->
  <g transform="translate(48, 140)">
    <!-- Member Name -->
    <text x="0" y="32" font-size="32" font-weight="800" fill="#ffffff" letter-spacing="0.5">${fullName}</text>

    <!-- Digital ID Badge -->
    <g transform="translate(0, 52)">
      <rect x="0" y="0" width="280" height="42" rx="8" fill="#1e293b" stroke="#d4af37" stroke-width="1.5"/>
      <text x="16" y="27" font-size="18" font-family="'Courier New', monospace" font-weight="800" fill="#f3e5ab" letter-spacing="1">${digitalId}</text>
    </g>

    <!-- Community Details Grid -->
    <!-- Kula (Branch) -->
    <g transform="translate(0, 130)">
      <text x="0" y="0" font-size="12" font-weight="700" fill="#94a3b8" letter-spacing="1">KULA / SUB-CASTE</text>
      <text x="0" y="24" font-size="18" font-weight="700" fill="#e2e8f0">${kula}</text>
    </g>

    <!-- Craft / Trade -->
    <g transform="translate(190, 130)">
      <text x="0" y="0" font-size="12" font-weight="700" fill="#94a3b8" letter-spacing="1">CRAFT / PROFESSION</text>
      <text x="0" y="24" font-size="18" font-weight="700" fill="#e2e8f0">${trade}</text>
    </g>

    <!-- District & State -->
    <g transform="translate(0, 195)">
      <text x="0" y="0" font-size="12" font-weight="700" fill="#94a3b8" letter-spacing="1">DISTRICT &amp; STATE</text>
      <text x="0" y="24" font-size="16" font-weight="600" fill="#cbd5e1">${district}, ${state}</text>
    </g>

    <!-- Constituency -->
    <g transform="translate(190, 195)">
      <text x="0" y="0" font-size="12" font-weight="700" fill="#94a3b8" letter-spacing="1">CONSTITUENCY</text>
      <text x="0" y="24" font-size="16" font-weight="600" fill="#cbd5e1">${constituencyDisplay}</text>
    </g>
  </g>

  <!-- QR Code Section (Right Side) -->
  <g transform="translate(610, 150)">
    <!-- QR Card Container -->
    <rect x="0" y="0" width="198" height="230" rx="16" fill="#131d31" stroke="#334155" stroke-width="1.5"/>

    <!-- Embedded Vector QR Code (Zero External Images) -->
    <g transform="translate(19, 15) scale(0.85)">
      ${qrInnerContent}
    </g>

    <!-- Scan Verification Text -->
    <text x="99" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="0.5">SCAN TO VERIFY PASS</text>
  </g>

  <!-- Bottom Bar: Microprint Security & Validity Year -->
  <g transform="translate(48, 490)">
    <text x="0" y="0" font-size="11" font-weight="600" fill="#64748b" letter-spacing="1.5">MEMBER SINCE ${joinedYear} • DIGITAL ARTISAN IDENTITY</text>
    <text x="760" y="0" text-anchor="end" font-size="11" font-weight="700" fill="#d4af37">NEXUS.VKC.ORG</text>
  </g>
</svg>`;
  }

  /**
   * Constructs pre-formatted viral WhatsApp sharing link for community members.
   */
  public static getWhatsAppShareUrl(digitalId: string, fullName: string): string {
    const shareMessage = `🙏 Greetings! I have registered as a verified member of the Vishwakarma Community on Vishwakarma Nexus.\n\n🪪 *My Digital ID:* ${digitalId}\n👤 *Name:* ${fullName}\n\nJoin our community directory and get your Community Pass at:\nhttps://nexus.vkc.org/verify/${digitalId}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  }
}
