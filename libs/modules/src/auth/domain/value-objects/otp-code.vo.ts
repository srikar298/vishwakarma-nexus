import { createHash } from "crypto";

/**
 * OtpCode Value Object
 * Encapsulates OTP logic, including hashing for secure storage.
 */
export class OtpCode {
  private readonly rawValue: string;
  private readonly hashedValue: string;

  private constructor(code: string) {
    this.rawValue = code;
    this.hashedValue = this.hash(code);
    this.validate(code);
  }

  /**
   * Create a new random OTP
   */
  public static generate(length: number = 6): OtpCode {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return new OtpCode(code);
  }

  /**
   * Reconstruct from a known raw value
   */
  public static fromRaw(code: string): OtpCode {
    return new OtpCode(code);
  }

  private hash(code: string): string {
    return createHash("sha256").update(code).digest("hex");
  }

  private validate(code: string): void {
    if (!/^\d{6}$/.test(code)) {
      throw new Error("OTP must be exactly 6 digits");
    }
  }

  public getRaw(): string {
    return this.rawValue;
  }

  public getHash(): string {
    return this.hashedValue;
  }

  public verify(hashedCode: string): boolean {
    return this.hashedValue === hashedCode;
  }
}
