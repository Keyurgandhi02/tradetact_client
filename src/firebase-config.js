import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKoXgjXG18gY6e0Aobt8YjKm8lERR7SKA",
  authDomain: "smk24-6f0bf.firebaseapp.com",
  projectId: "smk24-6f0bf",
  storageBucket: "smk24-6f0bf.appspot.com",
  messagingSenderId: "129236148898",
  appId: "1:129236148898:web:40969edf7238e1a877adfb",
  measurementId: "G-L6D3P58LS5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
