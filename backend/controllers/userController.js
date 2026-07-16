const { sendSuccess, sendError } = require('../utils/responseHandler');
const { db } = require('../config/firebase');

/**
 * Retrieves the profile data of the logged-in user.
 */
const getProfile = async (req, res, next) => {
  try {
    const userEmail = req.user.id;
    const userSnapshot = await db.collection('users').where('email', '==', userEmail.toLowerCase()).get();
    
    if (userSnapshot.empty) {
      return sendError(res, "User profile not found.", 404);
    }

    const user = userSnapshot.docs[0].data();

    return sendSuccess(res, "Profile retrieved successfully", {
      user: {
        fullName: user.fullName,
        email: user.email,
        bio: user.bio || "",
        photoURL: user.photoURL || "",
        createdAt: user.createdAt || "",
        updatedAt: user.updatedAt || ""
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates profile fields for the logged-in user.
 */
const updateProfile = async (req, res, next) => {
  try {
    const userEmail = req.user.id;
    const { fullName, bio, photoURL } = req.body;

    const userSnapshot = await db.collection('users').where('email', '==', userEmail.toLowerCase()).get();
    
    if (userSnapshot.empty) {
      return sendError(res, "User profile not found.", 404);
    }

    const userDocRef = userSnapshot.docs[0].ref;
    const updatedAt = new Date().toISOString();

    await userDocRef.update({
      fullName,
      bio: bio || "",
      photoURL: photoURL || "",
      updatedAt
    });

    return sendSuccess(res, "Profile updated successfully", {
      user: {
        fullName,
        email: userEmail.toLowerCase(),
        bio: bio || "",
        photoURL: photoURL || "",
        updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
