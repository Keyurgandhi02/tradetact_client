import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import "./AddJournalForm.css";
import GlobalInput from "./GlobalInput";

function QueueStocks() {
  const initialState = {
    scriptName: "",
    stockPrice: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [fetchedData, setFetchedData] = useState([]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addData(formData);
    setFormData(initialState);
  };

  const addData = async (newData) => {
    const ref = collection(db, "queue_stocks_data");
    await addDoc(ref, newData);
    alert("Data Added Successfully!");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const ref = collection(db, "queue_stocks_data");
    const snapshot = await getDocs(ref);
    const dataArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFetchedData(dataArray);
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit} className="forms">
          <h2 className="title">Add Queue Stocks</h2>
          <div className="subContainer">
            <GlobalInput
              inputType="text"
              placeholder="Script Name"
              isValue={formData?.scriptName}
              name="scriptName"
              onChangeHandler={(name, value) => handleChange(name, value)}
            />
            <GlobalInput
              inputType="number"
              placeholder="Stock Price"
              isValue={formData?.stockPrice}
              onChangeHandler={(name, value) => handleChange(name, value)}
              name="stockPrice"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>

      <div>
        {fetchedData.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid black",
              width: "150px",
              height: "120px",
              padding: "20px",
            }}
          >
            <h3>Trade : {index + 1}</h3>
            <h4>{item?.scriptName}</h4>
            <h4>{item?.stockPrice}</h4>
          </div>
        ))}
      </div>
    </>
  );
}

export default QueueStocks;
