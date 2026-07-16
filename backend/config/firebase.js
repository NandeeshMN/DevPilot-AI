const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let db;

try {
  // Read service account path from env variables (relative to root)
  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const serviceAccountPath = envPath 
    ? path.resolve(process.cwd(), envPath) 
    : path.join(__dirname, '../firebase-service-account.json');

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Firebase service account file not found at path: ${serviceAccountPath}`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  // Ensure Firebase is initialized only once
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized successfully.");
  }

  db = admin.firestore();

  // Verify connection to Firestore during startup
  db.listCollections()
    .then(() => {
      console.log("Firestore connection verified successfully. Ready for CRUD operations.");
    })
    .catch((err) => {
      console.error("Firestore connection verification failed on startup:", err.message);
    });

} catch (error) {
  console.error("Firebase Admin SDK initialization failed:", error.message);
  throw error;
}

module.exports = { admin, db };
