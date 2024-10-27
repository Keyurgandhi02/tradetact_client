import React, { useState } from "react";
import GlobalDropdown from "../../components/GlobalDropdown";
import GlobalInput from "../../components/GlobalInput";
import GlobalButton from "../../components/GlobalButton";
import { validateAllFields } from "../../config/validationUtils";
import { reportConsoleValidationRules } from "../../config/validations";
import {
  GENERAL_FETCH_ERROR,
  GENERAL_FORM_VALIDATIONS_ERROR,
} from "../../constants/Strings";
import { toast } from "react-toastify";
import db from "../../utils/firebase-config";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import { useAuth } from "../../context/AuthContext";
import * as firestore from "firebase/firestore";
import { handleExport } from "../../components/ExportCSVButton";

const initialState = {
  report_type: "",
  from_date: "",
  to_date: "",
};

function ConsoleReportsPage() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [options] = useState([
    {
      id: 1,
      label: "Trades",
    },
    // {
    //   id: 2,
    //   label: "Watchlist",
    // },
    // {
    //   id: 3,
    //   label: "Returns",
    // },
  ]);

  // Dropdown Select Handler
  const selectDropDownHandler = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Input Change Handler
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toLowerCase(),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateAllFields(
      formData,
      reportConsoleValidationRules
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(GENERAL_FORM_VALIDATIONS_ERROR);
      return;
    }

    try {
      handleFetchTrades();
    } catch (error) {}
  };

  const handleFetchTrades = async () => {
    if (formData?.from_date && formData?.to_date) {
      try {
        const q = firestore.query(
          firestore.collection(
            db,
            FIREBASE_ENDPOINTS.MASTER_DATA,
            currentUser.uid,
            FIREBASE_ENDPOINTS.USER_TRADE_JOURNAL
          ),
          firestore.where("buyDate", ">=", formData?.from_date),
          firestore.where("buyDate", "<=", formData?.to_date)
        );

        const querySnapshot = await firestore.getDocs(q);

        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (docs.length > 0) {
          downloadHandler(docs, formData?.from_date, formData?.to_date);
          setFormData(initialState);
        } else {
          toast.error("No Trades");
        }
      } catch (error) {
        toast.error(GENERAL_FETCH_ERROR);
      }
    }
  };

  // Export CSV Handler
  const downloadHandler = (data, fromDate, toDate) => {
    handleExport(data, `Trade Journal Report - ${fromDate} - ${toDate}`);
  };

  return (
    <div className="flex flex-col gap-9 p-14 mt-5 mb-5">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlobalDropdown
            formData={formData?.report_type}
            label="Report Type"
            errors={errors?.report_type}
            children={
              <select
                className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                onChange={(e) =>
                  selectDropDownHandler("report_type", e.target.value)
                }
                value={formData?.report_type}
              >
                <option value="" disabled>
                  Select Report Type
                </option>
                {options?.map((item) => (
                  <option
                    key={item.id}
                    value={item.label}
                    className="dark:text-whiten text-black-dark-400"
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            }
          />

          <GlobalInput
            inputType="date"
            placeholder="From Date"
            isValue={formData?.from_date}
            name="from_date"
            errors={errors?.from_date}
            onChangeHandler={(name, value) => handleChange(name, value)}
          />

          <GlobalInput
            inputType="date"
            placeholder="To Date"
            isValue={formData?.to_date}
            name="to_date"
            errors={errors?.to_date}
            onChangeHandler={(name, value) => handleChange(name, value)}
          />
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
        <GlobalButton
          btnTitle="Download"
          type="submit"
          onButtonClickHandler={handleSubmit}
          bgColor="bg-main_color"
        />
      </div>
    </div>
  );
}

export default ConsoleReportsPage;
