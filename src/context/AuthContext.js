import React, { useContext, useState, useEffect, createContext } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import db from "../utils/firebase-config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import {
  LOGIN_ERRORS,
  LOGIN_SUCCESS,
  LOGOUT_ERROR,
  LOGOUT_SUCCESS,
  SIGN_UP_ERRORS,
  SIGN_UP_SUCCESS,
} from "../constants/Strings";
import { GENERAL_ROUTES } from "../constants/routesConstants";

export function useAuth() {
  return useContext(AuthContext);
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // Register Handler
  const signUp = async (name, email, password, mobile, subscription_status) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send Verification to user email
      await sendEmailVerification(user);

      // Update Default User Profile
      await updateProfile(user, { displayName: name });

      if (user) {
        const docRef = doc(db, FIREBASE_ENDPOINTS.USER_AUTH, user?.uid);

        // Set the document with the data
        await setDoc(docRef, {
          email: email,
          name: name,
          createdAt: serverTimestamp(),
          mobile: mobile,
          subscription_status: subscription_status,
        });
      }
      toast.success(SIGN_UP_SUCCESS);
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error(SIGN_UP_ERRORS.alreadyRegister);
          break;
        case "auth/invalid-email":
          toast.error(SIGN_UP_ERRORS.invalidEmail);
          break;
        case "auth/operation-not-allowed":
          toast.error(SIGN_UP_ERRORS.operationNotAllowed);
          break;
        case "auth/weak-password":
          toast.error(SIGN_UP_ERRORS.weakPassword);
          break;
        default:
          toast.error(SIGN_UP_ERRORS.other);
          break;
      }
    }
  };

  // Login Handler
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error(LOGIN_ERRORS.verifyUser);
      } else {
        navigate(GENERAL_ROUTES.HOME_MAIN);
        toast.success(LOGIN_SUCCESS);
      }
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          toast.error(LOGIN_ERRORS.noUserFound);
          break;
        case "auth/user-disabled":
          toast.error(LOGIN_ERRORS.userDisabled);
          break;
        case "auth/invalid-credential":
          toast.error(LOGIN_ERRORS.invalidCredential);
          break;
        case "auth/wrong-password":
          toast.error(LOGIN_ERRORS.wrongPassword);
          break;
        case "auth/invalid-email":
          toast.error(LOGIN_ERRORS.invalidEmial);
          break;
        default:
          toast.error(LOGIN_ERRORS.other);
          break;
      }
    }
  };

  // Logout Handler
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      toast.success(LOGOUT_SUCCESS);
    } catch (error) {
      toast.error(LOGOUT_ERROR);
    }
  };

  // Password Reset Handler
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      toast.error(LOGOUT_ERROR);
    }
  };

  // Update Email Handler
  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  // Update Password Handler
  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    currentUser,
    login,
    signUp,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
