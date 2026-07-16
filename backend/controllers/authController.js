const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const emailService = require('../services/emailService');
const otpService = require('../services/otpService');
const { db } = require('../config/firebase');

/**
 * Handles user account registration.
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, "Invalid email format", 400);
    }

    if (password.length < 6) {
      return sendError(res, "Password must be at least 6 characters", 400);
    }

    // Query Firestore by email
    const userSnapshot = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (!userSnapshot.empty) {
      return sendError(res, "Email is already registered", 400);
    }

    const hashedPassword = hashPassword(password);
    const newUser = {
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      photoURL: "",
      bio: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to Firestore
    await db.collection('users').doc(email.toLowerCase()).set(newUser);

    const token = generateToken(email.toLowerCase());

    return sendSuccess(res, "Registration successful", { 
      token, 
      user: { fullName, email: email.toLowerCase() } 
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles credentials authentication check.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Query Firestore by email
    const userSnapshot = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (userSnapshot.empty) {
      return sendError(res, "Invalid email credentials", 401);
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Verify bcrypt hash comparison
    if (!comparePassword(password, user.password)) {
      return sendError(res, "Invalid email credentials", 401);
    }

    const token = generateToken(email.toLowerCase());

    return sendSuccess(res, "Login successful", { 
      token, 
      user: { fullName: user.fullName, email: user.email } 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Initiates the forgot password flow, generating and emailing an OTP reset code.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const genericMessage = "If an account exists with this email, an OTP has been sent.";

    // Query Firestore by email to check existence
    const userSnapshot = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (userSnapshot.empty) {
      return sendSuccess(res, genericMessage);
    }

    const otp = otpService.generateOTP(email.toLowerCase());
    await emailService.sendOtp(email.toLowerCase(), otp);

    return sendSuccess(res, genericMessage);
  } catch (error) {
    if (error.message.includes("wait")) {
      return sendError(res, error.message, 429);
    }
    next(error);
  }
};

/**
 * Validates the entered OTP code.
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = otpService.verifyOTP(email.toLowerCase(), otp);

    if (!result.valid) {
      return sendError(res, result.message, 400);
    }

    return sendSuccess(res, "OTP verified successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Saves a new hashed password after a successful OTP confirmation.
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (newPassword.length < 6) {
      return sendError(res, "Password must be at least 6 characters", 400);
    }

    if (!otpService.isOTPVerified(email.toLowerCase())) {
      return sendError(res, "OTP verification session invalid or expired.", 400);
    }

    // Query Firestore by email
    const userSnapshot = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (userSnapshot.empty) {
      return sendError(res, "User account not found.", 404);
    }

    const userDoc = userSnapshot.docs[0];
    const hashedPassword = hashPassword(newPassword);

    // Update password in Firestore
    await userDoc.ref.update({
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    });

    otpService.invalidateOTP(email.toLowerCase());

    return sendSuccess(res, "Password updated successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword
};
