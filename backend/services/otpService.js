const generateOTP = require('../utils/generateOTP');

/**
 * Dedicated OTP Service to handle generation, validation, and rate limiting of reset keys.
 */
class OTPService {
  constructor() {
    // In-memory key store
    // Key: email -> Value: { code, expiresAt, verified, lastRequestedAt }
    this.otpStore = new Map();
  }

  /**
   * Generates a 6-digit numeric OTP and stores it securely with a 10-minute expiry. Enforces a 60s resend limit.
   * @param {string} email 
   * @returns {string} The generated OTP
   */
  generateOTP(email) {
    const now = Date.now();
    const existing = this.otpStore.get(email);

    // Enforce OTP resend limit of 60 seconds
    if (existing && (now - existing.lastRequestedAt < 60000)) {
      const waitTime = Math.ceil((60000 - (now - existing.lastRequestedAt)) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before requesting a new OTP.`);
    }

    // Generate OTP code
    const code = generateOTP();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes

    this.otpStore.set(email, {
      code,
      expiresAt,
      verified: false,
      lastRequestedAt: now
    });

    return code;
  }

  /**
   * Verifies the entered OTP code.
   * @param {string} email 
   * @param {string} code 
   * @returns {{ valid: boolean, message?: string }}
   */
  verifyOTP(email, code) {
    const record = this.otpStore.get(email);
    const now = Date.now();

    if (!record) {
      return { valid: false, message: "Incorrect or expired OTP." };
    }

    if (record.expiresAt < now) {
      this.otpStore.delete(email);
      return { valid: false, message: "OTP has expired." };
    }

    if (record.code !== code) {
      return { valid: false, message: "Incorrect OTP code." };
    }

    if (record.verified) {
      return { valid: false, message: "OTP has already been used/verified." };
    }

    // Mark as verified
    record.verified = true;
    this.otpStore.set(email, record);

    return { valid: true };
  }

  /**
   * Verifies if the email has a fully verified OTP session, allowing password updates.
   * @param {string} email 
   * @returns {boolean}
   */
  isOTPVerified(email) {
    const record = this.otpStore.get(email);
    return !!(record && record.verified && record.expiresAt > Date.now());
  }

  /**
   * Instantly invalidates/deletes the OTP.
   * @param {string} email 
   */
  invalidateOTP(email) {
    this.otpStore.delete(email);
  }
}

module.exports = new OTPService();
