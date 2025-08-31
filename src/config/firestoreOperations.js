import * as firestore from "firebase/firestore";
import toast from "react-hot-toast";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import * as Strings from "../constants/Strings";
import db from "../utils/firebase-config";
import { getAuth } from "firebase/auth";

const auth = getAuth();

// Handler Global Loader
const handleLoading = (startLoading, stopLoading, isLoading) => {
  if (isLoading) startLoading();
  else stopLoading();
};

// Create Firebase API
export const addFirebaseData = async (
  first_collection,
  second_collection,
  formData
) => {
  if (!auth.currentUser) {
    toast.error("Unauthorized create attempt");
    return;
  }

  const userId = auth.currentUser.uid;

  try {
    // Add a createdAt timestamp to the formData
    const dataWithTimestamp = {
      ...formData,
      doc_created_At: firestore.serverTimestamp(),
    };

    // Add document to Firestore
    const docRef = await firestore.addDoc(
      firestore.collection(db, first_collection, userId, second_collection),
      dataWithTimestamp
    );
    toast.success(Strings.GENERAL_ADD_SUCCESS);
    return docRef.id;
  } catch (error) {
    toast.error(Strings.GENERAL_ADD_ERROR);
  }
};

// Get Firebase API
export const getFirebaseData = async (
  first_collection,
  second_collection,
  startLoading,
  stopLoading,
  order,
  orderName,
  isLoadingVisible
) => {
  if (!auth.currentUser) {
    toast.error("Unauthorized read attempt");
    return [];
  }

  const userId = auth.currentUser.uid;

  isLoadingVisible && handleLoading(startLoading, stopLoading, true);

  try {
    const q = firestore.query(
      firestore.collection(db, first_collection, userId, second_collection),
      firestore.orderBy(orderName, order)
    );

    const querySnapshot = await firestore.getDocs(q);

    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    isLoadingVisible && handleLoading(startLoading, stopLoading, false);
    return docs;
  } catch (error) {
    toast.error(Strings.GENERAL_FETCH_ERROR);
    isLoadingVisible && handleLoading(startLoading, stopLoading, false);
    return [];
  }
};

// Get Firebase By Id API
export const getFirebaseDataById = async (
  first_collection,
  second_collection,
  docId
) => {
  if (!auth.currentUser) {
    toast.error("Unauthorized read attempt");
    return [];
  }

  const userId = auth.currentUser.uid;

  try {
    const docRef = firestore.doc(
      db,
      first_collection,
      userId,
      second_collection,
      docId
    );
    const docSnap = await firestore.getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      toast.error("No such data!");
    }
  } catch (error) {
    toast.error(Strings.GENERAL_FETCH_ERROR);
  }
};

// Update Firebase API
export const updateFirebaseData = async (
  first_collection,
  second_collection,
  docId,
  updatedData
) => {
  if (!auth.currentUser) {
    toast.error("Unauthorized update attempt");
    return;
  }
  const userId = auth.currentUser.uid;
  try {
    const dataWithTimestamp = {
      ...updatedData,
      doc_updated_At: firestore.serverTimestamp(),
    };
    const docRef = firestore.doc(
      db,
      first_collection,
      userId,
      second_collection,
      docId
    );
    await firestore.updateDoc(docRef, dataWithTimestamp);
    toast.success(Strings.GENERAL_UPDATE_SUCCESS);
  } catch (error) {
    toast.error(Strings.GENERAL_UPDATE_ERROR);
  }
};

// Delete Firebase API
export const deleteFirebaseData = async (
  first_collection,
  second_collection,
  docId,
  startLoading,
  stopLoading
) => {
  if (!auth.currentUser) {
    toast.error("Unauthorized delete attempt");
    return;
  }

  handleLoading(startLoading, stopLoading, true);
  const userId = auth.currentUser.uid;
  try {
    const docRef = firestore.doc(
      db,
      first_collection,
      userId,
      second_collection,
      docId
    );
    await firestore.deleteDoc(docRef);
    toast.success(Strings.GENERAL_DELETE_SUCCESS);
    handleLoading(startLoading, stopLoading, false);
  } catch (error) {
    toast.error(Strings.GENERAL_DELETE_ERROR);
    handleLoading(startLoading, stopLoading, false);
  }
};

// Get User By Email API
export const getUserByEmail = async (email) => {
  try {
    const q = firestore.query(
      firestore.collection(db, FIREBASE_ENDPOINTS.USER_AUTH),
      firestore.where("email", "==", email)
    );
    const querySnapshot = await firestore.getDocs(q);

    if (querySnapshot.empty) {
      return null;
    } else {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
  } catch (error) {
    throw error;
  }
};

// Get General Data Real Time Listner
export const getRealTimeGeneralFirebaseData = (
  collectionName,
  callback,
  orderName,
  order
) => {
  try {
    const collectionRef = firestore.collection(db, collectionName);

    // Create a query with ordering and limiting
    const q = firestore.query(
      collectionRef,
      firestore.orderBy(orderName, order)
    );

    // Set up a real-time listener
    const unsubscribe = firestore.onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(docs);
      },
      (error) => {
        toast.error(Strings.GENERAL_FETCH_ERROR);
      }
    );

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  } catch (error) {
    toast.error(Strings.GENERAL_FETCH_ERROR);
  }
};

// Get Paginated Data API
export const fetchPaginatedData = async (
  first_collection,
  second_collection,
  pageSize,
  lastVisible,
  order,
  orderName
) => {
  if (!auth.currentUser) {
    toast.error("Unauthorized pagination attempt");
    return { data: [], lastDoc: null };
  }
  const userId = auth.currentUser.uid;
  const q = lastVisible
    ? firestore.query(
        firestore.collection(db, first_collection, userId, second_collection),
        firestore.orderBy(orderName, order),
        firestore.startAfter(lastVisible),
        firestore.limit(pageSize)
      )
    : firestore.query(
        firestore.collection(db, first_collection, userId, second_collection),
        firestore.orderBy(orderName, order),
        firestore.limit(pageSize)
      );

  const querySnapshot = await firestore.getDocs(q);
  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { data, lastDoc };
};
