import React, { useEffect, useState } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/mantine";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import GlobalInput from "./GlobalInput";
import "../index.css";

function Journals() {
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
  const [isVisible, setVisible] = useState(false);
  const [nodes, setFetchedData] = useState([]);
  const [positiveTotal, setPositiveTotal] = useState(0);
  const [negativeTotal, setNegativeTotal] = useState(0);
  const [combinedTotal, setCombinedTotal] = useState(0);

  const mantineTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme(mantineTheme);

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
    const ref = collection(db, "journal_data");
    await addDoc(ref, newData);
    alert("Data Added Successfully!");
  };

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

    let positiveSum = 0;
    let negativeSum = 0;

    dataArray.forEach((item) => {
      const price = parseFloat(item.profitLossPrice);
      if (!isNaN(price)) {
        if (price > 0) {
          positiveSum += price;
        } else {
          negativeSum += price;
        }
      }
    });

    setPositiveTotal(positiveSum);
    setNegativeTotal(negativeSum);
    setCombinedTotal(positiveSum + negativeSum);
  };

  const COLUMNS = [
    {
      label: "Script Name",
      renderCell: (item) => item.scriptName,
    },
    {
      label: "Buy Date",
      renderCell: (item) => item.buyDate,
    },
    {
      label: "Strategy Name",
      renderCell: (item) => item.strategyName,
    },
    {
      label: "Entry Price",
      renderCell: (item) => item.entryPrice,
    },
    {
      label: "SL Price",
      renderCell: (item) => item.slPrice,
    },
    {
      label: "Target Price",
      renderCell: (item) => item.targetPrice,
    },
    {
      label: "Quantity",
      renderCell: (item) => item.quantity,
    },
    {
      label: "Exit Price",
      renderCell: (item) => item.exitPrice,
    },
    {
      label: "Profit Loss Price",
      renderCell: (item) => Math.floor(item.profitLossPrice),
    },
    {
      label: "Emotions When Enter",
      renderCell: (item) => item.emotionsWhenEnter,
    },
    {
      label: "Emotions When Exit",
      renderCell: (item) => item.emotionsWhenExit,
    },
    {
      label: "Learning",
      renderCell: (item) => item.learning,
    },
    {
      label: "Mistake",
      renderCell: (item) => item.mistake,
    },
    {
      label: "Rating",
      renderCell: (item) => item.rating,
    },
    {
      label: "Chart",
      renderCell: (item) => item.chart,
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
            Add Journal Data
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
                    className="form-control"
                    inputType="text"
                    placeholder="Script Name"
                    isValue={formData?.scriptName}
                    name="scriptName"
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label for="inputPassword4">Buy Date</label>
                  <GlobalInput
                    inputType="date"
                    className="form-control"
                    placeholder="Buy Date"
                    isValue={formData?.buyDate}
                    name="buyDate"
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Strategy Name</label>
                  <GlobalInput
                    inputType="text"
                    className="form-control"
                    placeholder="Strategy Name"
                    isValue={formData?.strategyName}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="strategyName"
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>Entry Price</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="Entry Price"
                    isValue={formData?.entryPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="entryPrice"
                  />
                </div>
              </div>

              <div className="form-row">
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

                <div className="form-group col-md-6">
                  <label>Target Price</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="Target Price"
                    isValue={formData?.targetPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="targetPrice"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Quantity</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="Quantity"
                    isValue={formData?.quantity}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="quantity"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Exit Price</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="Exit Price"
                    isValue={formData?.exitPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="exitPrice"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Profit/Loss Price</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="Profit/Loss Price"
                    isValue={formData?.profitLossPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="profitLossPrice"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Emotions When Enter</label>
                  <GlobalInput
                    inputType="text"
                    className="form-control"
                    placeholder="Emotions When Enter"
                    isValue={formData?.emotionsWhenEnter}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="emotionsWhenEnter"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Emotions When Exit</label>
                  <GlobalInput
                    inputType="text"
                    className="form-control"
                    placeholder="Emotions When Exit"
                    isValue={formData?.emotionsWhenExit}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="emotionsWhenExit"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Learning</label>
                  <GlobalInput
                    inputType="text"
                    className="form-control"
                    placeholder="Learning"
                    isValue={formData?.learning}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="learning"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Mistake</label>
                  <GlobalInput
                    inputType="text"
                    className="form-control"
                    placeholder="Mistake"
                    isValue={formData?.mistake}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="mistake"
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>Rating</label>
                  <GlobalInput
                    inputType="number"
                    className="form-control"
                    placeholder="Rating out of 5"
                    isValue={formData?.rating}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="rating"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Chart Type</label>
                  <GlobalInput
                    inputType="text"
                    className="form-control"
                    placeholder="Chart"
                    isValue={formData?.chart}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="chart"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-5">
        {data && <CompactTable columns={COLUMNS} data={data} theme={theme} />}
        <div className="d-flex flex-row justify-content-center align-items-center mt-5">
          <h4 style={{ marginRight: "10px" }}>
            Total Profit (Rs): {Math.floor(positiveTotal)}
          </h4>
          <h4 style={{ marginRight: "10px" }}>
            Total Loss (Rs): {Math.floor(negativeTotal)}
          </h4>
          <h4>Total Amount (Rs): {Math.floor(combinedTotal)}</h4>
        </div>
      </div>
    </div>
  );
}

export default Journals;
