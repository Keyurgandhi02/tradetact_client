import React, { useContext, useState, useEffect, createContext } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
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
import {
  LOGIN_ERRORS,
  LOGIN_SUCCESS,
  LOGOUT_ERROR,
  LOGOUT_SUCCESS,
  SIGN_UP_ERRORS,
  SIGN_UP_SUCCESS,
} from "../constants/Strings";
import { GENERAL_ROUTES } from "../constants/routesConstants";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";

export function useAuth() {
  return useContext(AuthContext);
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

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
        // 1️⃣ Create user_register/{uid}
        const userDocRef = doc(db, FIREBASE_ENDPOINTS.USER_AUTH, user.uid);
        await setDoc(userDocRef, {
          email: email,
          name: name,
          createdAt: serverTimestamp(),
          mobile: mobile,
          onboardingCompleted: false,
          userID: user.uid,
        });

        // 2️⃣ Create master_data/{uid} (empty doc for subcollections)
        const masterDocRef = doc(db, FIREBASE_ENDPOINTS.MASTER_DATA, user.uid);
        await setDoc(masterDocRef, {
          initializedAt: serverTimestamp(),
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

      // Reload user to get updated emailVerified status
      await user.reload();
      const refreshedUser = auth.currentUser;

      if (!refreshedUser.emailVerified) {
        return { user: refreshedUser, verified: false };
      } else {
        // ✅ Check Firestore onboarding status
        const userDocRef = doc(
          db,
          FIREBASE_ENDPOINTS.USER_AUTH,
          refreshedUser.uid
        );
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (!userData.onboardingCompleted) {
            navigate("/onboarding"); // redirect to onboarding
          } else {
            navigate(GENERAL_ROUTES.HOME_MAIN); // normal dashboard
          }
        }

        localStorage.setItem("user", JSON.stringify(refreshedUser));
        toast.success(LOGIN_SUCCESS);
        return { user: refreshedUser, verified: true };
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
      return { user: null, verified: false };
    }
  };

  // Logout Handler
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      toast.success(LOGOUT_SUCCESS);
      navigate(GENERAL_ROUTES.BLANK, { replace: true });
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

  // Resend Verification Email Handler
  const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        setIsSending(true);
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email sent again!");
      } catch (error) {
        toast.error("Error resending verification email");
      } finally {
        setTimeout(() => setIsSending(false), 5000); // enable after 5s
      }
    } else {
      toast.error("User is either not logged in or already verified");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get Firestore profile
        const userDocRef = doc(db, "user_register", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setCurrentUser({
            ...user,
            ...userDocSnap.data(), // merge firestore fields like onboardingCompleted
          });
        } else {
          // No Firestore doc yet, fallback to just auth user
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signUp,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    resendVerificationEmail,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
