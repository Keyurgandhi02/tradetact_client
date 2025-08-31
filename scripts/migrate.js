// migrate.js
const admin = require("firebase-admin");

// Load your service account key JSON file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const userId = process.argv[2];

if (!userId) {
  console.error("❌ Please provide a userId. Example: node migrate.js USER123");
  process.exit(1);
}

async function migrateBrokers() {
  try {
    console.log("🚀 Starting broker migration...");

    // Example: old brokers are under "master_brokers"
    const oldBrokersSnap = await db.collection("master_brokers").get();

    if (oldBrokersSnap.empty) {
      console.log("⚠️ No brokers found in old collection.");
      return;
    }

    for (const doc of oldBrokersSnap.docs) {
      const brokerData = doc.data();

      // Add type field → default (since these are system brokers)
      const newBrokerData = {
        ...brokerData,
        type: "default",
        migratedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection("brokers").doc(doc.id).set(newBrokerData);
      console.log(`✅ Migrated broker: ${doc.id}`);
    }

    console.log("🎉 Broker migration complete.");
  } catch (err) {
    console.error("❌ Migration error:", err);
  }
}

migrateBrokers();
