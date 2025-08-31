import React, { useEffect, useState } from "react";
import PageHeading from "../../components/PageHeading";
import GlobalInput from "../../components/GlobalInput";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import {
  addFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../../config/firestoreOperations";
import toast from "react-hot-toast";
import {
  GENERAL_FETCH_ERROR,
  GENERAL_SUBMIT_ERROR,
} from "../../constants/Strings";
import GlobalButton from "../../components/GlobalButton";
import { useNavigate, useParams } from "react-router-dom";
import { RISK_ROUTES } from "../../constants/routesConstants";

const initialState = {
  scriptName: "",
  account: "",
  risk: "",
  entry: "",
  target: "",
  stop: "",
};

const RiskManagementCalculator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch existing record if edit mode
  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsEditMode(true);
      try {
        const fetchedData = await getFirebaseDataById(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          FIREBASE_ENDPOINTS.RISK_MANAGE_DATA,
          id
        );
        setFormData(fetchedData || initialState);
      } catch (error) {
        toast.error(GENERAL_FETCH_ERROR);
      }
    }
    fetchData();
  }, [id]);

  // Input Change Handler
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Extract + Convert safely
  const account = parseFloat(formData.account) || 0;
  const risk = parseFloat(formData.risk) || 0;
  const entry = parseFloat(formData.entry) || 0;
  const stop = parseFloat(formData.stop) || 0;
  const target = parseFloat(formData.target) || 0;

  // Calculations
  const riskAmount = (account * risk) / 100;
  const stopLossPerShare = Math.abs(entry - stop);
  const positionSize =
    stopLossPerShare > 0 ? Math.floor(riskAmount / stopLossPerShare) : 0;
  const riskRewardRatio =
    stopLossPerShare > 0 ? ((target - entry) / stopLossPerShare).toFixed(2) : 0;

  // Form Submit Handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    const rmData = {
      ...formData,
      account,
      risk,
      entry,
      stop,
      target,
      riskAmount: riskAmount.toFixed(2),
      positionSize,
      riskRewardRatio,
    };

    try {
      if (isEditMode) {
        await updateFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          FIREBASE_ENDPOINTS.RISK_MANAGE_DATA,
          id,
          rmData
        );
      } else {
        await addFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          FIREBASE_ENDPOINTS.RISK_MANAGE_DATA,
          rmData
        );
      }
      toast.success("Risk data saved successfully!");
      navigate(RISK_ROUTES.RISK_ALL);
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  return (
    <div className="md:mb-0 mb-12">
      <div className="flex flex-col gap-9 p-2 mt-5 mb-5">
        <PageHeading title={"Risk Management"} />
      </div>

      <form className="p-4" onSubmit={handleSubmit}>
        {/* Script & Capital */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <GlobalInput
            inputType="text"
            placeholder="Script Name *"
            isValue={formData.scriptName}
            name="scriptName"
            errors={errors?.scriptName}
            onChangeHandler={handleChange}
          />
          <GlobalInput
            inputType="number"
            placeholder="Fund Available For Trading (₹)"
            isValue={formData.account}
            name="account"
            errors={errors?.account}
            onChangeHandler={handleChange}
          />
        </div>

        {/* Risk % & Entry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <GlobalInput
            inputType="number"
            placeholder="Risk % per Trade *"
            isValue={formData.risk}
            name="risk"
            errors={errors?.risk}
            onChangeHandler={handleChange}
          />
          <GlobalInput
            inputType="number"
            placeholder="Entry Price *"
            isValue={formData.entry}
            name="entry"
            errors={errors?.entry}
            onChangeHandler={handleChange}
          />
        </div>

        {/* Target & StopLoss */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <GlobalInput
            inputType="number"
            placeholder="Target Price *"
            isValue={formData.target}
            name="target"
            errors={errors?.target}
            onChangeHandler={handleChange}
          />
          <GlobalInput
            inputType="number"
            placeholder="Stop Loss Price *"
            isValue={formData.stop}
            name="stop"
            errors={errors?.stop}
            onChangeHandler={handleChange}
          />
        </div>

        {/* Live Summary */}
        {account > 0 && risk > 0 && entry > 0 && stop > 0 && target > 0 && (
          <div
            className={`mt-6 p-6 border-[1.5px] rounded-xl shadow-md transition-all duration-300 ${
              positionSize > 0
                ? "border-main_color bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Risk Management Summary
            </h2>

            <div className="grid grid-cols-2 gap-4 text-left text-gray-700 dark:text-gray-300">
              <p>
                <strong>Account Size:</strong> ₹{account}
              </p>
              <p>
                <strong>Risk %:</strong> {risk}%
              </p>
              <p>
                <strong>Entry Price:</strong> ₹{entry}
              </p>
              <p>
                <strong>Stop Loss:</strong> ₹{stop}
              </p>
              <p>
                <strong>Target Price:</strong> ₹{target}
              </p>
              <p>
                <strong>Risk Amount:</strong> ₹{riskAmount.toFixed(2)}
              </p>
              <p>
                <strong>Position Size:</strong> {positionSize} Shares
              </p>
              <p>
                <strong>Risk-Reward Ratio:</strong> {riskRewardRatio} : 1
              </p>
            </div>

            {/* Save Button */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
              <GlobalButton
                btnTitle="Save"
                type="submit"
                disabled={false}
                bgColor="bg-main_color"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RiskManagementCalculator;
