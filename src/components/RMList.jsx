import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";

function RMList() {
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const ref = collection(db, "rm_data");
    const snapshot = await getDocs(ref);
    const dataArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFetchedData(dataArray);
  };
  console.log("fetchedData", fetchedData);
  return (
    <div>
      {fetchedData.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid black",
            width: "150px",
            height: "340px",
            padding: "20px",
          }}
        >
          <h3>Trade : {index + 1}</h3>
          <h5>Capital: {item?.capital_per_trade}</h5>
          <h5>Risk(%): {item?.risk_per_trade}</h5>
          <h5>Stop Loss/share: {item?.sl_per_share}</h5>
          <h5>Entry Price: {item?.entryPrice}</h5>
          <h5>Target Price: {item?.target_trade}</h5>
          <h5>Exit Price: {item?.exit_price}</h5>
          <h5>Stop Loss Price: {item?.slPrice}</h5>
          <h5>Qty: {item?.qty_trade}</h5>
        </div>
      ))}
    </div>
  );
}

export default RMList;
