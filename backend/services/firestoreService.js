const { db } = require('../config/firebase');

/**
 * Reusable service handling Firestore transactions and document references.
 */
class FirestoreService {
  /**
   * Fetches a single document from a collection.
   * @param {string} collection 
   * @param {string} docId 
   * @returns {Promise<any>}
   */
  async getDocument(collection, docId) {
    try {
      const docRef = db.collection(collection).doc(docId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return null;
      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
      console.error(`Firestore getDocument Error (${collection}/${docId}):`, error.message);
      throw error;
    }
  }

  /**
   * Creates or updates a document in a collection with a specific ID.
   * @param {string} collection 
   * @param {string} docId 
   * @param {object} data 
   * @returns {Promise<boolean>}
   */
  async setDocument(collection, docId, data) {
    try {
      const docRef = db.collection(collection).doc(docId);
      await docRef.set({
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error(`Firestore setDocument Error (${collection}/${docId}):`, error.message);
      throw error;
    }
  }

  /**
   * Adds a new document to a collection with an auto-generated ID.
   * @param {string} collection 
   * @param {object} data 
   * @returns {Promise<string>} Document ID
   */
  async addDocument(collection, data) {
    try {
      const docRef = await db.collection(collection).add({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Firestore addDocument Error (${collection}):`, error.message);
      throw error;
    }
  }

  /**
   * Queries documents matching a criteria.
   * @param {string} collection 
   * @param {string} field 
   * @param {string} op 
   * @param {any} value 
   * @returns {Promise<any[]>} Matches
   */
  async queryDocuments(collection, field, op, value) {
    try {
      const colRef = db.collection(collection).where(field, op, value);
      const snapshot = await colRef.get();
      const docs = [];
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      return docs;
    } catch (error) {
      console.error(`Firestore queryDocuments Error (${collection} where ${field} ${op}):`, error.message);
      throw error;
    }
  }
}

module.exports = new FirestoreService();
