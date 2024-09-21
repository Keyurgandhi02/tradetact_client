import React, { useState, useEffect } from "react";
import { getRealTimeGeneralFirebaseData } from "../config/firestoreOperations";
import { formatDateToDDMMYY } from "../config/helper";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";

function UpdateInfoCard() {
  const [fetchedData, setFetchedData] = useState([]);

  // Use a callback to handle data updates
  const handleDataUpdate = (data) => {
    setFetchedData(data);
  };

  useEffect(() => {
    // Initialize the real-time listener
    const unsubscribe = getRealTimeGeneralFirebaseData(
      FIREBASE_ENDPOINTS.MARKET_UPDATES_DATA,
      handleDataUpdate,
      "createdAt",
      "desc"
    );

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <ul className="p-1 divide-y divide-black-dark-300">
      {fetchedData?.map((item) => (
        <li key={item?.id} className="flex justify-between gap-x-6 py-2">
          <div className="container px-2 py-2">
            <div className="p-2">
              <h2 className="text-md font-bold text-whiten">{item?.heading}</h2>
              <p className="text-gray-500 mt-2 text-xs">
                {item?.icon === "positive" ? (
                  <span className="text-green-400">Positive</span>
                ) : (
                  <span className="text-red-400">Negative</span>
                )}
                {" - "}
                {formatDateToDDMMYY(item?.createdAt.toDate())}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default UpdateInfoCard;
