import React, { useState } from "react";
import GlobalInput from "./GlobalInput";
import { useEffect } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/mantine";

function RiskMangeMent() {
  const initialState = {
    slPrice: "",
    capital_per_trade: "",
    risk_per_trade: "",
    entryPrice: "",
    active_candle_size: "",
    target_candle_size: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isRiskPer, setRiskPer] = useState(0);
  const [isVisible, setVisible] = useState(false);
  const [isSLPerShare, setSLPerShare] = useState(0);
  const [isQty, setQty] = useState(0);
  const [isTarget, setTarget] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [nodes, setFetchedData] = useState([]);

  const mantineTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme(mantineTheme);

  useEffect(() => {
    fetchData();
  }, []);

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
    setVisible(false);
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
      setShowDetails(true);
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

  const fetchData = async () => {
    const ref = collection(db, "rm_data");
    const snapshot = await getDocs(ref);
    const dataArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFetchedData(dataArray);
  };

  const COLUMNS = [
    {
      label: "Total Capital (Rs)",
      renderCell: (item) => item.capital_per_trade,
    },
    {
      label: "Risk (%)",
      renderCell: (item) => Math.floor(item.risk_per_trade),
    },
    {
      label: "Stop Loss/share",
      renderCell: (item) => Math.floor(item.sl_per_share),
    },
    {
      label: "Entry Price",
      renderCell: (item) => Math.floor(item.entryPrice),
    },
    {
      label: "Target Price",
      renderCell: (item) => Math.floor(item.target_trade),
    },
    {
      label: "Exit Price",
      renderCell: (item) => Math.floor(item.exit_price),
    },
    {
      label: "SL Price",
      renderCell: (item) => Math.floor(item.slPrice),
    },
    {
      label: "Qty",
      renderCell: (item) => Math.floor(item.qty_trade),
    },
  ];

  const data = { nodes };

  return (
    <div className="p-3">
      <div className="row">
        <div className="col"></div>
        <div className="col-auto mt-3">
          <button
            className="btn btn-primary"
            onClick={() => setVisible(!isVisible)}
          >
            Add RM Data
          </button>
        </div>
      </div>
      {isVisible && (
        <div className="row ">
          <div className="col-sm-12 col-sm-offset-2">
            <form onSubmit={handleSubmit} className="pad-bg">
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Script Name</label>
                  <GlobalInput
                    inputType="number"
                    placeholder="Capital Per Trade"
                    isValue={formData?.capital_per_trade}
                    name="capital_per_trade"
                    className="form-control"
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Risk Per Trade</label>
                  <GlobalInput
                    inputType="number"
                    placeholder="Risk Per Trade"
                    isValue={formData?.risk_per_trade}
                    name="risk_per_trade"
                    className="form-control"
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Entry Price</label>
                  <GlobalInput
                    inputType="number"
                    placeholder="Entry Price"
                    className="form-control"
                    isValue={formData?.entryPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="entryPrice"
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>SL Price</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="SL Price"
                    isValue={formData?.slPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="slPrice"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Active Candle Size</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="Active Candle Size"
                    isValue={formData?.active_candle_size}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="active_candle_size"
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>Target Candle Size</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="Target Candle Size (Ex. 1:2)"
                    isValue={formData?.target_candle_size}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="target_candle_size"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100">
                Save
              </button>
            </form>
            {showDetails && (
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">
                    Qty: {Math.floor(isQty)}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Stop Loss/Share: {isSLPerShare}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Target Price/Qty: {isTarget}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Exit Price/Share: {Number(formData?.entryPrice) + isTarget}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Risk: {Math.floor(isRiskPer)} %
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Total Investment: {formData?.capital_per_trade}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Total Profit:
                    {Number(formData?.capital_per_trade) +
                      Number(isTarget * Math.floor(isQty))}
                  </h6>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-5">
        {data && <CompactTable columns={COLUMNS} data={data} theme={theme} />}
      </div>
    </div>
  );
}

export default RiskMangeMent;
