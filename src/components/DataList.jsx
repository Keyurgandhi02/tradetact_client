import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import "./DataList.css";

function DataList({ data }) {
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const ref = collection(db, "journal_data");
    const snapshot = await getDocs(ref);
    const dataArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFetchedData(dataArray);
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <table className="table-fill">
        <thead>
          <tr>
            <th className="text-left">Script Name</th>
            <th>Buy Date</th>
            <th>Strategy Name</th>
            <th>Entry Price</th>
            <th>SL Price</th>
            <th>Target Price</th>
            <th>Quantity</th>
            <th>Exit Price</th>
            <th>Profit Loss Price</th>
            <th>Emotions When Enter</th>
            <th>Emotions When Exit</th>
            <th>Learning</th>
            <th>Mistake</th>
            <th>Rating</th>
            <th>Chart</th>
          </tr>
        </thead>
        <tbody className="table-hover">
          {fetchedData.map((item, index) => (
            <tr key={index}>
              <td className="text-left">{item.scriptName}</td>
              <td className="text-left">{item.buyDate}</td>
              <td className="text-left">{item.strategyName}</td>
              <td className="text-left">{item.entryPrice}</td>
              <td className="text-left">{item.slPrice}</td>
              <td className="text-left">{item.targetPrice}</td>
              <td className="text-left">{item.quantity}</td>
              <td className="text-left">{item.exitPrice}</td>
              <td className="text-left">{item.profitLossPrice}</td>
              <td className="text-left">{item.emotionsWhenEnter}</td>
              <td className="text-left">{item.emotionsWhenExit}</td>
              <td className="text-left">{item.learning}</td>
              <td className="text-left">{item.mistake}</td>
              <td className="text-left">{item.rating}</td>
              <td className="text-left">{item.chart}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataList;
