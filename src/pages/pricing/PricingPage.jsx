import React, { useEffect, useState } from "react";
import Pricing from "../../components/pricing/Pricing";
import { getRealTimeGeneralFirebaseData } from "../../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import { useNavigate } from "react-router-dom";
import { PRICING_ROUTES } from "../../constants/routesConstants";

function PricingPage() {
  const navigate = useNavigate();
  const [fetchedData, setFetchedData] = useState([]);

  const activatePlanHandler = (planDetails) => {
    localStorage.setItem("subscription_plan", JSON.stringify(planDetails));
    navigate(PRICING_ROUTES.PRICING_CHECKOUT);
  };

  // Use a callback to handle data updates
  const handleDataUpdate = (data) => {
    setFetchedData(data);
  };

  useEffect(() => {
    // Initialize the real-time listener
    const unsubscribe = getRealTimeGeneralFirebaseData(
      FIREBASE_ENDPOINTS.PRICING_DATA,
      handleDataUpdate,
      "createdAt",
      "desc"
    );

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Pricing data={fetchedData} planHandler={activatePlanHandler} />
    </>
  );
}

export default PricingPage;
