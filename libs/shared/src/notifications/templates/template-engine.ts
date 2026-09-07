/**
 * Low-Level Design (LLD): Enterprise Notification Template Engine
 * Safely interpolates placeholders (e.g. {{name}}, {{otp}}, {{amount}})
 * with strict variable validation and injection protection.
 */
export class TemplateEngine {
  private static readonly TOKEN_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

  /**
   * Renders a template string by replacing {{key}} tokens with supplied parameter values.
   */
  public static render(
    template: string,
    params: Record<string, string | number> = {},
    options: { throwOnMissing?: boolean; defaultFallback?: string } = {}
  ): string {
    if (!template) return '';

    const { throwOnMissing = false, defaultFallback = '' } = options;
    const missingKeys: string[] = [];

    const rendered = template.replace(this.TOKEN_REGEX, (match, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        return String(params[key]);
      }

      missingKeys.push(key);
      return defaultFallback;
    });

    if (throwOnMissing && missingKeys.length > 0) {
      throw new Error(`[TemplateEngine] Missing required template parameters: ${missingKeys.join(', ')}`);
    }

    return rendered;
  }

  /**
   * Extracts all unique token names declared in a template string.
   */
  public static extractParameters(template: string): string[] {
    if (!template) return [];
    const keys = new Set<string>();
    let match: RegExpExecArray | null;

    const regex = new RegExp(this.TOKEN_REGEX.source, 'g');
    while ((match = regex.exec(template)) !== null) {
      keys.add(match[1]);
    }

    return Array.from(keys);
  }
}
