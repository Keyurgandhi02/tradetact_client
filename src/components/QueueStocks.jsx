import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import GlobalInput from "./GlobalInput";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/mantine";

function QueueStocks() {
  const initialState = {
    scriptName: "",
    stockPrice: "",
    strategyName: "",
    status: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isVisible, setVisible] = useState(false);
  const [nodes, setFetchedData] = useState([]);

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

  const COLUMNS = [
    {
      label: "Script Name",
      renderCell: (item) => item.scriptName,
    },
    {
      label: "Strategy Name",
      renderCell: (item) => item.strategyName,
    },
    {
      label: "Stock Price",
      renderCell: (item) => item.stockPrice,
    },
    {
      label: "Status",
      renderCell: (item) => item.status,
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
                    inputType="text"
                    placeholder="Script Name"
                    className="form-control"
                    isValue={formData?.scriptName}
                    name="scriptName"
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label for="inputPassword4">Strategy Name</label>
                  <GlobalInput
                    inputType="text"
                    placeholder="Strategy Name"
                    className="form-control"
                    isValue={formData?.strategyName}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="strategyName"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Stock Price</label>
                  <GlobalInput
                    inputType="number"
                    placeholder="Stock Price"
                    className="form-control"
                    isValue={formData?.stockPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="stockPrice"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label for="inputPassword4">Status</label>
                  <GlobalInput
                    inputType="text"
                    placeholder="Status"
                    className="form-control"
                    isValue={formData?.status}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="status"
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
      </div>
    </div>
  );
}

export default QueueStocks;
