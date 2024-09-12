import React, { useEffect, useState } from "react";
import GlobalInput from "./GlobalInput";
import "../index.css";
import GlobalDropdown from "./GlobalDropdown";
import { TRADE_TYPE_DROPDOWNS } from "../constants/Columns";
import { toast, Toaster } from "react-hot-toast";
import GlobalTextArea from "./GlobalTextArea";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import FloatButton from "./FloatButton";
import { LIST_FLOAT_SVG } from "../UI/GlobalSVG";
import { useNavigate, useParams } from "react-router-dom";
import {
  GENERAL_FETCH_ERROR,
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
  TRADE_PAGE_STRINGS,
  TRADE_SETTINGS_NO_ERROR,
} from "../constants/Strings";
import { useAuth } from "../store/AuthContext";
import {
  addFirebaseData,
  getFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../config/firestoreOperations";
import { useLoading } from "../store/LoadingContext";
import PageHeading from "./PageHeading";
import GlobalButton from "./GlobalButton";
import { validateAllFields } from "../config/validationUtils";
import { tradeJournalValidationRules } from "../config/validations";
import GloablInfo from "./GloablInfo";

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
  trade_type: "",
  broker: "",
  dematUser: "",
};

function CreateEditTradeJournal() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [formData, setFormData] = useState(initialState);
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewModal, setViewModal] = useState(false);
  const [isDisable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsEditMode(true);
      try {
        const fetchedTasks = await getFirebaseDataById(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_TRADE_JOURNAL,
          id
        );
        setFormData(fetchedTasks);
      } catch (error) {
        toast.error("Error fetching data");
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Input Change Handler
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Dropdown Select Handler
  const selectDropDownHandler = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Form Submit Handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const modifiedData = {};
    let hasChanges = false;

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialState[key]) {
        modifiedData[key] = formData[key];
        hasChanges = true;
      }
    });

    const validationErrors = validateAllFields(
      isEditMode ? modifiedData : formData,
      tradeJournalValidationRules
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(GENERAL_FORM_VALIDATIONS_ERROR);
      return;
    }

    try {
      if (isEditMode && hasChanges) {
        await updateFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_TRADE_JOURNAL,
          id,
          modifiedData
        );
      } else if (!isEditMode) {
        await addFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_TRADE_JOURNAL,
          formData
        );
      }
      setFormData(initialState);
      navigate("/all_trade_journal");
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate("/all_trade_journal");
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedOptions = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
        );

        const fetchedOptions1 = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_DEMAT,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
        );

        const fetchedOptions2 = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
        );

        if (
          fetchedOptions.length === 0 ||
          fetchedOptions1.length === 0 ||
          fetchedOptions2.length === 0
        ) {
          setViewModal(true);
          setDisable(true);
        } else {
          setOptions(fetchedOptions);
          setOptions1(fetchedOptions1);
          setOptions2(fetchedOptions2);
          setViewModal(false);
        }
      } catch (error) {
        setDisable(true);
        toast.error(GENERAL_FETCH_ERROR);
      }
    };

    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.uid]);

  return (
    <div className="md:mb-0 mb-12">
      {!isViewModal && (
        <div className="flex flex-col gap-9 p-8">
          <PageHeading
            title={
              isEditMode
                ? TRADE_PAGE_STRINGS?.editTransactions
                : TRADE_PAGE_STRINGS?.addTransactions
            }
          />
          <div className="rounded-lg bg-black-dark-200 shadow-xl">
            {/* <span
            className="text-whiten font-semibold float-right p-5"
            onClick={() => updateSubscriptionStatus()}
          >
            AutoFill Form
          </span> */}
            <form onSubmit={handleSubmit}>
              <div className="p-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <GlobalInput
                    inputType="text"
                    placeholder="Script Name"
                    isValue={formData?.scriptName}
                    name="scriptName"
                    errors={errors?.scriptName}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />
                  <GlobalInput
                    inputType="date"
                    placeholder="Transaction Date"
                    isValue={formData?.buyDate}
                    name="buyDate"
                    errors={errors?.buyDate}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <GlobalDropdown
                    options={options}
                    formData={formData?.broker}
                    errors={errors?.broker}
                    selectDropDownHandler={selectDropDownHandler}
                    name="broker"
                    label="Select Broker"
                  />

                  <GlobalDropdown
                    options={options2}
                    formData={formData?.strategyName}
                    errors={errors?.strategyName}
                    selectDropDownHandler={selectDropDownHandler}
                    name="strategyName"
                    label="Select Strategy"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <GlobalDropdown
                    options={options1}
                    formData={formData?.dematUser}
                    errors={errors?.dematUser}
                    selectDropDownHandler={selectDropDownHandler}
                    name="dematUser"
                    label="Select Demat User"
                  />
                  <GlobalDropdown
                    options={TRADE_TYPE_DROPDOWNS}
                    formData={formData?.trade_type}
                    errors={errors?.trade_type}
                    selectDropDownHandler={selectDropDownHandler}
                    name="trade_type"
                    label="Trade Type"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <GlobalInput
                    inputType="number"
                    placeholder="Entry Price"
                    isValue={formData?.entryPrice}
                    errors={errors?.entryPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="entryPrice"
                  />

                  <GlobalInput
                    inputType="number"
                    placeholder="Stop Loss Price"
                    isValue={formData?.slPrice}
                    errors={errors?.slPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="slPrice"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <GlobalInput
                    inputType="number"
                    placeholder="Target Price"
                    isValue={formData?.targetPrice}
                    errors={errors?.targetPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="targetPrice"
                  />

                  <GlobalInput
                    inputType="number"
                    placeholder="Exit Price"
                    isValue={formData?.exitPrice}
                    errors={errors?.exitPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="exitPrice"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <GlobalInput
                    inputType="number"
                    placeholder="Qty/Lot"
                    isValue={formData?.quantity}
                    errors={errors?.quantity}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="quantity"
                  />

                  <GlobalInput
                    inputType="number"
                    placeholder="Total Profit/Loss"
                    isValue={formData?.profitLossPrice}
                    errors={errors?.profitLossPrice}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="profitLossPrice"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <GlobalInput
                    inputType="text"
                    placeholder="Emotions When Enter"
                    isValue={formData?.emotionsWhenEnter}
                    errors={errors?.emotionsWhenEnter}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="emotionsWhenEnter"
                  />

                  <GlobalInput
                    inputType="text"
                    placeholder="Emotions When Exit"
                    isValue={formData?.emotionsWhenExit}
                    errors={errors?.emotionsWhenExit}
                    onChangeHandler={(name, value) => handleChange(name, value)}
                    name="emotionsWhenExit"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <GlobalTextArea
                    row="4"
                    label=""
                    placeholder="Learning"
                    isValue={formData?.learning}
                    errors={errors?.learning}
                    name="learning"
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />

                  <GlobalTextArea
                    row="4"
                    label=""
                    placeholder="Mistake"
                    isValue={formData?.mistake}
                    errors={errors?.mistake}
                    name="mistake"
                    onChangeHandler={(name, value) => handleChange(name, value)}
                  />
                </div>

                <GlobalInput
                  inputType="number"
                  placeholder="Rating out of 5"
                  isValue={formData?.rating}
                  errors={errors?.rating}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                  name="rating"
                />

                <GlobalButton
                  btnTitle={isEditMode ? "Update" : "Submit"}
                  disabled={isDisable}
                  type="submit"
                  onButtonClickHandler={handleSubmit}
                  bgColor="bg-primary-500"
                />
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster position="top-right" reverseOrder={true} />

      {isViewModal && (
        <GloablInfo
          firstTitle="Oopss!!"
          secondTitle="Trade Setting Required"
          desc={TRADE_SETTINGS_NO_ERROR}
          linktitle="Go to Console"
          link="/console/create_user_strategy"
        />
      )}

      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<LIST_FLOAT_SVG />}
      />
    </div>
  );
}

export default CreateEditTradeJournal;
