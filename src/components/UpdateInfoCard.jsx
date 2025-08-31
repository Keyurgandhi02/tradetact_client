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
    <ul className="divide-y-[0.3px] divide-gray-500">
      {fetchedData?.map((item) => (
        <li
          key={item?.id}
          className="flex justify-between gap-x-6 py-4 hover:bg-light_hover_color  dark:hover:bg-black-dark-200"
        >
          <div className="container px-2 py-2">
            <div className="p-2">
              <h2 className="text-md font-bold text-black-dark-400 dark:text-whiten">
                {item?.heading}
              </h2>
              <p className="text-gray-600 mt-2 text-xs font-semibold">
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
