import React, { useState } from "react";
import "./AddJournalForm.css";
import GlobalInput from "./GlobalInput";
import { useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";

function RiskMangeMent() {
  const initialState = {
    slPrice: undefined,
    capital_per_trade: undefined,
    risk_per_trade: undefined,
    entryPrice: undefined,
    active_candle_size: undefined,
    target_candle_size: undefined,
  };

  const [formData, setFormData] = useState(initialState);
  const [isRiskPer, setRiskPer] = useState(0);
  const [isSLPerShare, setSLPerShare] = useState(0);
  const [isQty, setQty] = useState(0);
  const [isTarget, setTarget] = useState(0);

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
    const request_data = {
      ...newData,
      risk_per_trade: isRiskPer,
      sl_per_share: isSLPerShare,
      qty_trade: isQty,
      target_trade: isTarget,
      exit_price: Number(formData?.entryPrice) + isTarget,
    };

    const ref = collection(db, "rm_data");
    await addDoc(ref, request_data);
    alert("Data Added Successfully!");
  };

  useEffect(() => {
    if (formData?.capital_per_trade && formData?.risk_per_trade) {
      let result =
        (formData?.risk_per_trade / formData?.capital_per_trade) * 100;
      setRiskPer(result);
    }
    if (formData?.entryPrice && formData?.slPrice) {
      let result = formData?.entryPrice - formData?.slPrice;
      setSLPerShare(result);
    }
    if (formData?.capital_per_trade && formData?.entryPrice) {
      let result = formData?.capital_per_trade / formData?.entryPrice;
      setQty(result);
    }
    if (formData?.active_candle_size && formData?.target_candle_size) {
      let result = formData?.active_candle_size * formData?.target_candle_size;
      setTarget(Math.floor(result));
    }
  }, [formData]);

  return (
    <div className="container">
      <div className="forms">
        <h2 className="title">Risk Management</h2>
        <div className="subContainer">
          <GlobalInput
            inputType="number"
            placeholder="Capital Per Trade"
            isValue={formData?.capital_per_trade}
            name="capital_per_trade"
            onChangeHandler={(name, value) => handleChange(name, value)}
          />
          <GlobalInput
            inputType="number"
            placeholder="Risk Per Trade"
            isValue={formData?.risk_per_trade}
            name="risk_per_trade"
            onChangeHandler={(name, value) => handleChange(name, value)}
          />
        </div>

        <div className="subContainer">
          <GlobalInput
            inputType="number"
            placeholder="Entry Price"
            isValue={formData?.entryPrice}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="entryPrice"
          />

          <GlobalInput
            inputType="number"
            placeholder="SL Price"
            isValue={formData?.slPrice}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="slPrice"
          />
        </div>
        <div className="subContainer">
          <GlobalInput
            inputType="number"
            placeholder="Active Candle Size"
            isValue={formData?.active_candle_size}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="active_candle_size"
          />

          <GlobalInput
            inputType="number"
            placeholder="Target Candle Size (Ex. 1:2)"
            isValue={formData?.target_candle_size}
            onChangeHandler={(name, value) => handleChange(name, value)}
            name="target_candle_size"
          />
        </div>
        <span className="results">Qty Trade: {Math.floor(isQty)}</span>
        <hr></hr>
        <span className="results">Stop Loss/Share: {isSLPerShare}</span>
        <hr></hr>
        <span className="results">Target Price/Qty: {isTarget}</span>
        <hr></hr>
        <span className="results">
          Exit Price/Share: {Number(formData?.entryPrice) + isTarget}
        </span>
        <hr></hr>
        <span className="results">Risk: {Math.floor(isRiskPer)} %</span>
        <hr></hr>
        <span className="results">
          Total Investment: {formData?.capital_per_trade}
        </span>
        <hr></hr>
        <span className="results">
          Total Profit:{" "}
          {Number(formData?.capital_per_trade) +
            Number(isTarget * Math.floor(isQty))}
        </span>
        <button type="button" onClick={(e) => handleSubmit(e)}>
          Save Data
        </button>
      </div>
    </div>
  );
}

export default RiskMangeMent;
