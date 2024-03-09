import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import "./AddJournalForm.css";
import GlobalInput from "./GlobalInput";

function AddJournalForm() {
  const initialState = {
    scriptName: "",
    buyDate: "",
    strategyName: "",
    entryPrice: "",
    slPrice: "",
    targetPrice: "",
    quantity: "",
    exitPrice: "",
    profitLossPrice: "",
    emotionsWhenEnter: "",
    emotionsWhenExit: "",
    learning: "",
    mistake: "",
    rating: "",
    chart: "",
  };

  const [formData, setFormData] = useState(initialState);

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
    const ref = collection(db, "journal_data");
    await addDoc(ref, newData);
    alert("Data Added Successfully!");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="forms">
        <h2 className="title">Add Journal Data</h2>
        <div className="subContainer">
          <GlobalInput
            inputType="text"
            placeholder="Script Name"
            isValue={formData?.scriptName}
            name="scriptName"
            onChangeHandler={(name, value) => handleChange(name, value)}
          />
          <GlobalInput
            inputType="date"
            placeholder="Buy Date"
            isValue={formData?.buyDate}
            name="buyDate"
            onChangeHandler={(name, value) => handleChange(name, value)}
          />
        </div>
        <div className="subContainer">
          <GlobalInput
            inputType="text"
            placeholder="Strategy Name"
            isValue={formData?.strategyName}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="strategyName"
          />
          <GlobalInput
            inputType="number"
            placeholder="Entry Price"
            isValue={formData?.entryPrice}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="entryPrice"
          />
        </div>
        <div className="subContainer">
          <GlobalInput
            inputType="number"
            placeholder="SL Price"
            isValue={formData?.slPrice}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="slPrice"
          />
          <GlobalInput
            inputType="number"
            placeholder="Target Price"
            isValue={formData?.targetPrice}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="targetPrice"
          />
        </div>
        <div className="subContainer">
          <GlobalInput
            inputType="number"
            placeholder="Quantity"
            isValue={formData?.quantity}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="quantity"
          />
          <GlobalInput
            inputType="number"
            placeholder="Exit Price"
            isValue={formData?.exitPrice}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="exitPrice"
          />
        </div>
        <div className="subContainer">
          <GlobalInput
            inputType="number"
            placeholder="Profit/Loss Price"
            isValue={formData?.profitLossPrice}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="profitLossPrice"
          />
          <GlobalInput
            inputType="text"
            placeholder="Emotions When Enter"
            isValue={formData?.emotionsWhenEnter}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="emotionsWhenEnter"
          />
        </div>
        <div className="subContainer">
          <GlobalInput
            inputType="text"
            placeholder="Emotions When Exit"
            isValue={formData?.emotionsWhenExit}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="emotionsWhenExit"
          />
          <GlobalInput
            inputType="text"
            placeholder="Learning"
            isValue={formData?.learning}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="learning"
          />
        </div>
        <div className="subContainer">
          <GlobalInput
            inputType="text"
            placeholder="Mistake"
            isValue={formData?.mistake}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="mistake"
          />
          <GlobalInput
            inputType="number"
            placeholder="Rating out of 5"
            isValue={formData?.rating}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="rating"
          />
        </div>
        <GlobalInput
          inputType="text"
          placeholder="Chart"
          isValue={formData?.chart}
          onChangeHandler={(name, value) => handleChange(name, value)}
          name="chart"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddJournalForm;
