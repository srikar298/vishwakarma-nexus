/**
 * PhoneNumber Value Object
 * Handles normalization and validation of phone numbers.
 */
export class PhoneNumber {
  private readonly value: string;

  constructor(phoneNumber: string) {
    this.value = this.normalize(phoneNumber);
    this.validate();
  }

  private normalize(phone: string): string {
    // Remove non-numeric characters except '+'
    let normalized = phone.replace(/[^\d+]/g, "");
    
    // Auto-prepend +91 if length is 10 and no country code (Assuming primary target is India)
    if (normalized.length === 10 && !normalized.startsWith("+")) {
      normalized = `+91${normalized}`;
    }
    
    return normalized;
  }

  private validate(): void {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 standard
    if (!phoneRegex.test(this.value)) {
      throw new Error(`Invalid phone number format: ${this.value}`);
    }
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.toString();
  }
}
