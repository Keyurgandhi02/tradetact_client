import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OnboardingPage from "../pages/OnboardingPage";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/" />;

  if (!currentUser.onboardingCompleted) {
    return <OnboardingPage userId={currentUser.uid} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
