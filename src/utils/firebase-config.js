import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase Config
const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
export const auth = getAuth(app);
export default db;

async function migrateData() {
  const masterDataRef = db.collection("master_data");
  const usersSnapshot = await masterDataRef.get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;

    // 1. Get old trades
    const oldTradesRef = db
      .collection("master_data")
      .doc(userId)
      .collection("user_trade_journal");
    const oldTradesSnapshot = await oldTradesRef.get();

    for (const tradeDoc of oldTradesSnapshot.docs) {
      const newTradeRef = db
        .collection("users")
        .doc(userId)
        .collection("trades")
        .doc(tradeDoc.id);
      await newTradeRef.set(tradeDoc.data());
    }

    // 2. Get old watchlist
    const oldWatchlistRef = db
      .collection("master_data")
      .doc(userId)
      .collection("user_watchlist");
    const oldTradesSnapshot1 = await oldWatchlistRef.get();

    for (const tradeDoc of oldTradesSnapshot1.docs) {
      const newTradeRef = db
        .collection("users")
        .doc(userId)
        .collection("watchlists")
        .doc(tradeDoc.id);
      await newTradeRef.set(tradeDoc.data());
    }
  }

  console.log("✅ Migration completed");
}

migrateData().catch(console.error);
