const { sendSuccess, sendError } = require('../utils/responseHandler');
const { db } = require('../config/firebase');

/**
 * Retrieves the profile data of the logged-in user.
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user is populated by the authMiddleware (req.user.id holds email)
    const userEmail = req.user.id;
    const userSnapshot = await db.collection('users').where('email', '==', userEmail.toLowerCase()).get();
    
    if (userSnapshot.empty) {
      return sendError(res, "User profile not found.", 404);
    }

    const user = userSnapshot.docs[0].data();

    return sendSuccess(res, "Profile retrieved successfully", {
      user: { fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile };
