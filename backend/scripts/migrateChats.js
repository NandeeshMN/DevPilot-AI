const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Load service account configuration
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../firebase-service-account.json';
const serviceAccount = require(path.resolve(__dirname, '..', serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
  console.log("Starting conversations database migration to subcollections...");
  
  // Use Collection Group query to fetch all 'conversations' subcollections across all users
  const oldConvsSnap = await db.collectionGroup('conversations').get();
  console.log(`Found ${oldConvsSnap.size} old conversations to process.`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const oldDoc of oldConvsSnap.docs) {
    const conversationId = oldDoc.id;
    
    // Extract userId (which is the lowercase email document ID)
    const userId = oldDoc.ref.parent.parent.id;
    if (!userId) {
      console.warn(`Could not extract userId for document ${conversationId}. Skipping.`);
      skippedCount++;
      continue;
    }

    const chatDocRef = db.collection('chats').doc(conversationId);
    const chatDocSnap = await chatDocRef.get();

    // Skip if already migrated to prevent duplicates
    if (chatDocSnap.exists) {
      console.log(`Chat ${conversationId} already exists in chats collection. Skipping.`);
      skippedCount++;
      continue;
    }

    const oldData = oldDoc.data();
    const messages = oldData.messages || [];

    console.log(`Migrating conversation ${conversationId} for user ${userId} (${messages.length} messages)...`);

    // 1. Create the chats/{conversationId} parent document
    await chatDocRef.set({
      userId: userId.toLowerCase(),
      title: oldData.title || "AI Chat Thread",
      createdAt: oldData.createdAt || new Date().toISOString(),
      updatedAt: oldData.updatedAt || new Date().toISOString()
    });

    // 2. Create message documents inside chats/{conversationId}/messages subcollection
    for (const [index, msg] of messages.entries()) {
      let msgTimestamp;
      if (msg.timestamp) {
        msgTimestamp = msg.timestamp;
      } else {
        // Offset each message by an incremental second to preserve ordering sequence on import
        const baseDate = new Date(oldData.createdAt || new Date());
        baseDate.setSeconds(baseDate.getSeconds() + index);
        msgTimestamp = admin.firestore.Timestamp.fromDate(baseDate);
      }

      await chatDocRef.collection('messages').add({
        role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content || "",
        model: msg.model || (msg.role === 'model' || msg.role === 'assistant' ? 'gemini' : null),
        timestamp: msgTimestamp
      });
    }

    migratedCount++;
    console.log(`✅ Migrated conversation ${conversationId} successfully.`);
  }

  console.log(`\nMigration completed successfully!`);
  console.log(`Migrated: ${migratedCount}`);
  console.log(`Skipped/Already Migrated: ${skippedCount}`);
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration script failed with error:", err);
  process.exit(1);
});
