/**
 * Reusable EmailService for handling DevPilot AI transactional mailings.
 */
class EmailService {
  /**
   * Dispatches an OTP verification code using the Brevo SMTP API.
   * @param {string} toEmail 
   * @param {string} otp 
   * @returns {Promise<any>}
   */
  async sendOtp(toEmail, otp) {
    const apiKey = process.env.BREVO_API_KEY;
    const fromName = process.env.BREVO_FROM_NAME || 'DevPilot AI';
    const fromEmail = process.env.BREVO_FROM_EMAIL || 'nandeeshmn5900@gmail.com';

    if (!apiKey) {
      throw new Error("Missing BREVO_API_KEY in environment variables.");
    }

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your DevPilot AI Password Reset OTP</title>
  <style>
    body {
      background-color: #0B1120;
      color: #F9FAFB;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 40px 20px;
    }
    .card {
      background-color: #111827;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      max-width: 500px;
      margin: 0 auto;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 16px;
    }
    .logo {
      font-size: 20px;
      font-weight: 800;
      color: #4F8CFF;
      margin-bottom: 8px;
    }
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #F9FAFB;
    }
    .greeting {
      font-size: 15px;
      color: #F9FAFB;
      margin-bottom: 16px;
    }
    .body-text {
      font-size: 14px;
      color: #9CA3AF;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .otp-container {
      text-align: center;
      margin: 28px 0;
    }
    .otp-box {
      background-color: #050811;
      border: 1px solid #4F8CFF;
      border-radius: 12px;
      color: #00F2FE;
      display: inline-block;
      font-family: 'Courier New', Courier, monospace;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 6px;
      padding: 16px 32px;
      box-shadow: 0 0 15px rgba(79, 140, 255, 0.2);
    }
    .security-note {
      background-color: rgba(239, 68, 68, 0.08);
      border: 1px dashed rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #F87171;
      font-size: 12px;
      padding: 12px;
      margin-top: 24px;
      text-align: center;
    }
    .footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: 32px;
      padding-top: 16px;
      text-align: center;
      font-size: 12px;
      color: #6B7280;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">DevPilot AI</div>
      <div class="title">🔐 Password Reset Verification</div>
    </div>
    
    <div class="greeting">Hello,</div>
    
    <div class="body-text">
      We received a request to reset the password for your DevPilot AI account.<br>
      Use the following One-Time Password (OTP) to continue:
    </div>
    
    <div class="otp-container">
      <div class="otp-box">${otp}</div>
    </div>
    
    <div class="body-text">
      This OTP is valid for 10 minutes.<br><br>
      If you did not request a password reset, you can safely ignore this email. Your account remains secure.
    </div>
    
    <div class="security-note">
      <strong>Security Note:</strong> Never share this OTP with anyone. DevPilot AI will never ask for your OTP.
    </div>
    
    <div class="footer">
      <strong>DevPilot AI</strong><br>
      Your AI-Powered Software Engineering Workspace
    </div>
  </div>
</body>
</html>`;

    const requestBody = {
      sender: { name: fromName, email: fromEmail },
      to: [{ email: toEmail }],
      subject: "Your DevPilot AI Password Reset OTP",
      htmlContent
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo HTTP Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }
}

module.exports = new EmailService();
