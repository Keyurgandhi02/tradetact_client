import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import {
  GENERAL_ADD_ERROR,
  GENERAL_ADD_SUCCESS,
  GENERAL_DELETE_ERROR,
  GENERAL_DELETE_SUCCESS,
  GENERAL_FETCH_ERROR,
  GENERAL_UPDATE_ERROR,
  GENERAL_UPDATE_SUCCESS,
} from "../constants/Strings";
import db from "../firebase-config";

const handleLoading = (startLoading, stopLoading, isLoading) => {
  if (isLoading) startLoading();
  else stopLoading();
};

// Optimized add data function
export const addFirebaseData = async (
  first_collection,
  userId,
  second_collection,
  formData
) => {
  try {
    // Add a createdAt timestamp to the formData
    const dataWithTimestamp = {
      ...formData,
      doc_created_At: serverTimestamp(),
    };

    // Add document to Firestore
    const docRef = await addDoc(
      collection(db, first_collection, userId, second_collection),
      dataWithTimestamp
    );
    toast.success(GENERAL_ADD_SUCCESS);
    return docRef.id;
  } catch (error) {
    toast.error(GENERAL_ADD_ERROR);
  }
};

// Optimized get data function
export const getFirebaseData = async (
  first_collection,
  userId,
  second_collection,
  startLoading,
  stopLoading,
  order,
  orderName
) => {
  handleLoading(startLoading, stopLoading, true);

  try {
    const q = query(
      collection(db, first_collection, userId, second_collection),
      orderBy(orderName, order)
    );

    const querySnapshot = await getDocs(q);

    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    handleLoading(startLoading, stopLoading, false);
    return docs;
  } catch (error) {
    toast.error(GENERAL_FETCH_ERROR);
    handleLoading(startLoading, stopLoading, false);
    return [];
  }
};

// Optimized get data by ID function
export const getFirebaseDataById = async (
  first_collection,
  userId,
  second_collection,
  docId
) => {
  try {
    const docRef = doc(db, first_collection, userId, second_collection, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      toast.error("No such data!");
    }
  } catch (error) {
    toast.error(GENERAL_FETCH_ERROR);
  }
};

// Optimized update data function
export const updateFirebaseData = async (
  first_collection,
  userId,
  second_collection,
  docId,
  updatedData
) => {
  try {
    const dataWithTimestamp = {
      ...updatedData,
      doc_updated_At: serverTimestamp(),
    };
    const docRef = doc(db, first_collection, userId, second_collection, docId);
    await updateDoc(docRef, dataWithTimestamp);
    toast.success(GENERAL_UPDATE_SUCCESS);
  } catch (error) {
    toast.error(GENERAL_UPDATE_ERROR);
  }
};

// Optimized delete data function
export const deleteFirebaseData = async (
  first_collection,
  userId,
  second_collection,
  docId,
  startLoading,
  stopLoading
) => {
  handleLoading(startLoading, stopLoading, true);

  try {
    const docRef = doc(db, first_collection, userId, second_collection, docId);
    await deleteDoc(docRef);
    toast.success(GENERAL_DELETE_SUCCESS);
    handleLoading(startLoading, stopLoading, false);
  } catch (error) {
    toast.error(GENERAL_DELETE_ERROR);
    handleLoading(startLoading, stopLoading, false);
  }
};

// Optimized get user by email function
export const getUserByEmail = async (email) => {
  try {
    const q = query(
      collection(db, FIREBASE_ENDPOINTS.USER_AUTH),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

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

// Optimized general get data function
export const getGeneralFirebaseData = async (first_collection) => {
  try {
    const docSnapshot = await getDocs(collection(db, first_collection));
    const docs = docSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return docs;
  } catch (error) {
    toast.error(GENERAL_FETCH_ERROR);
  }
};

// Optimized general get data function Real Time Listner
export const getRealTimeGeneralFirebaseData = (
  collectionName,
  callback,
  orderName,
  order
) => {
  try {
    const collectionRef = collection(db, collectionName);

    // Create a query with ordering and limiting
    const q = query(collectionRef, orderBy(orderName, order));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(docs);
      },
      (error) => {
        toast.error(GENERAL_FETCH_ERROR);
      }
    );

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  } catch (error) {
    toast.error(GENERAL_FETCH_ERROR);
  }
};

export const fetchPaginatedData = async (
  first_collection,
  userId,
  second_collection,
  pageSize,
  lastVisible,
  order,
  orderName
) => {
  const q = lastVisible
    ? query(
        collection(db, first_collection, userId, second_collection),
        orderBy(orderName, order),
        startAfter(lastVisible),
        limit(pageSize)
      )
    : query(
        collection(db, first_collection, userId, second_collection),
        orderBy(orderName, order),
        limit(pageSize)
      );

  const querySnapshot = await getDocs(q);
  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { data, lastDoc };
};

// export const updateAllDocumentsToLowercase = async (
//   firstCollection,
//   userId,
//   secondCollection
// ) => {
//   console.log("firstCollection", firstCollection);
//   const q = query(collection(db, firstCollection, userId, secondCollection));

//   const snapshot = await getDocs(q);
//   console.log("snapshot", snapshot);
//   const batch = writeBatch(db); // Using batch to update multiple documents

//   snapshot.forEach((doc) => {
//     const data = doc.data();
//     // Assuming 'name' is the field you want to normalize
//     if (data.scriptName) {
//       const lowerCaseName = data.scriptName.toLowerCase();
//       batch.update(doc.ref, { scriptName: lowerCaseName });
//     }
//   });

//   // Commit the batch update
//   await batch.commit();
//   console.log("All documents updated to lowercase.");
// };



// Search functionality (case-insensitive)
// const handleSearch = async (searchQuery) => {
//   handleLoading(startLoading, stopLoading, true);
//   setItems([]);
//   setSearchMode(true);

//   if (!searchQuery) {
//     setSearchMode(false);
//     setLastVisible(null);
//     fetchItems();
//     return;
//   }

//   try {
//     // Convert search query to lowercase
//     const lowerCaseQuery = searchQuery.toLowerCase();

//     const q = query(
//       collection(db, firstCollection, userId, secondCollection),
//       orderBy(searchOrderByField),
//       orderBy(orderByField, order),
//       startAt(lowerCaseQuery),
//       endAt(lowerCaseQuery + "\uf8ff")
//     );

//     const snapshot = await getDocs(q);

//     const data = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     setItems(data);
//   } catch (error) {
//     console.error("Error executing search query:", error);
//   } finally {
//     handleLoading(startLoading, stopLoading, false);
//   }
// };