import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GlobalInput from "../GlobalInput";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import FloatButton from "../FloatButton";
import { LIST_FLOAT_SVG } from "../../assets/svgIcons";
import {
  GENERAL_FETCH_ERROR,
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
  TRADE_PAGE_STRINGS,
  TRADE_SETTINGS_NO_ERROR,
} from "../../constants/Strings";
import { useAuth } from "../../context/AuthContext";
import {
  addFirebaseData,
  getFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../../config/firestoreOperations";
import GlobalButton from "../GlobalButton";
import PageHeading from "../PageHeading";
import { useLoading } from "../../context/LoadingContext";
import { validateAllFields } from "../../config/validationUtils.js";
import { tradeJournalValidationRules } from "../../config/validations.js";
import { TRADE_JOURNAL_ROUTES } from "../../constants/routesConstants.js";
import GlobalDropdown from "../GlobalDropdown.jsx";
import { TRADE_TYPE_DROPDOWNS } from "../../constants/Columns.js";
import GlobalTextArea from "../GlobalTextArea";
import GloablInfo from "../GloablInfo";

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
  const [options2, setOptions2] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewModal, setViewModal] = useState(false);
  const [isDisable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedDematUser, setSelectedDematUser] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [selectedTradeType, setSelectedTradeType] = useState("");
  const [selectedConsoleData, setSelectedConsoleData] = useState("");
  const [consoleDataOptions, setConsoleDataOptions] = useState([]);
  const [isBrokerCount, setBrokerCount] = useState(0);

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

        const fetchedOptions = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
        );

        setFormData(fetchedTasks);
        setSelectedDematUser(fetchedTasks?.dematUser);
        setSelectedConsoleData(fetchedTasks?.broker);
        setSelectedStrategy(fetchedTasks?.strategyName);
        setSelectedTradeType(fetchedTasks?.trade_type);

        const user = fetchedOptions.find(
          (item) => item?.dematUser === fetchedTasks?.dematUser
        );
        setConsoleDataOptions(user?.consoleData);
      } catch (error) {
        toast.error(GENERAL_FETCH_ERROR);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Input Change Handler
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toLowerCase(),
    }));
  };

  // Demat Dropdown Handler
  const handleDematUserChange = (selectedUser) => {
    setSelectedDematUser(selectedUser);
    const user = options.find((item) => item.dematUser === selectedUser);
    if (user) {
      setConsoleDataOptions(user.consoleData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        dematUser: selectedUser,
      }));
    }
  };

  // Broker Dropdown Handler
  const handleConsoleDataChange = (consoleData) => {
    setSelectedConsoleData(consoleData);
    setFormData((prevFormData) => ({
      ...prevFormData,
      broker: consoleData,
    }));
  };

  // Strategy Dropdown Handler
  const handleStrategyChange = (strategyData) => {
    setSelectedStrategy(strategyData);
    setFormData((prevFormData) => ({
      ...prevFormData,
      strategyName: strategyData,
    }));
  };

  // Trade Type Dropdown Handler
  const handleTradeTypeChange = (tradeTyeData) => {
    setSelectedTradeType(tradeTyeData);
    setFormData((prevFormData) => ({
      ...prevFormData,
      trade_type: tradeTyeData,
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
      navigate(TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_ALL);
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_ALL);
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

        setBrokerCount(fetchedOptions.length);

        const fetchedOptions2 = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
        );

        if (fetchedOptions.length === 0 || fetchedOptions2.length === 0) {
          setViewModal(true);
          setDisable(true);
        } else {
          setOptions(fetchedOptions);
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
        <div className="flex flex-col gap-9 p-4 mt-5 mb-5">
          <PageHeading
            title={
              isEditMode
                ? TRADE_PAGE_STRINGS?.editTransactions
                : TRADE_PAGE_STRINGS?.addTransactions
            }
          />

          <form onSubmit={handleSubmit}>
            <div className="p-4">
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
                  formData={formData?.dematUser}
                  errors={errors?.dematUser}
                  label="Select Demat User"
                  children={
                    <select
                      className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                      onChange={(e) => handleDematUserChange(e.target.value)}
                      value={selectedDematUser}
                    >
                      <option value="" disabled>
                        Select Demat User
                      </option>
                      {options?.map((item) => (
                        <option
                          key={item.id}
                          value={item.dematUser}
                          className="text-whiten"
                        >
                          {item.dematUser}
                        </option>
                      ))}
                    </select>
                  }
                />

                <GlobalDropdown
                  formData={formData?.broker}
                  errors={errors?.broker}
                  label="Select Broker"
                  children={
                    <select
                      className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                      onChange={(e) => handleConsoleDataChange(e.target.value)}
                      value={selectedConsoleData}
                    >
                      <option value="" disabled>
                        Select Broker
                      </option>
                      {consoleDataOptions?.map((item) => (
                        <option
                          key={item.id}
                          value={item.label}
                          className="text-whiten"
                        >
                          {item.label}
                        </option>
                      ))}
                    </select>
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <GlobalDropdown
                  formData={formData?.strategyName}
                  errors={errors?.strategyName}
                  label="Select Strategy"
                  children={
                    <select
                      className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                      onChange={(e) => handleStrategyChange(e.target.value)}
                      value={selectedStrategy}
                    >
                      <option value="" disabled>
                        Select Strategy
                      </option>
                      {options2?.map((item) => (
                        <option
                          key={item.id}
                          value={item.label}
                          className="text-whiten"
                        >
                          {item.label}
                        </option>
                      ))}
                    </select>
                  }
                />

                <GlobalDropdown
                  formData={formData?.trade_type}
                  errors={errors?.trade_type}
                  label="Trade Type"
                  children={
                    <select
                      className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                      onChange={(e) => handleTradeTypeChange(e.target.value)}
                      value={selectedTradeType}
                    >
                      <option value="" disabled>
                        Select Trade Type
                      </option>
                      {TRADE_TYPE_DROPDOWNS?.map((item) => (
                        <option
                          key={item.id}
                          value={item.label}
                          className="text-whiten"
                        >
                          {item.label}
                        </option>
                      ))}
                    </select>
                  }
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
                  placeholder="Target Price"
                  isValue={formData?.targetPrice}
                  errors={errors?.targetPrice}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                  name="targetPrice"
                />

                <GlobalInput
                  inputType="number"
                  placeholder="S/L Price"
                  isValue={formData?.slPrice}
                  errors={errors?.slPrice}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                  name="slPrice"
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

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
                <GlobalInput
                  inputType="number"
                  placeholder="Rating out of 5"
                  isValue={formData?.rating}
                  errors={errors?.rating}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                  name="rating"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-5">
                <GlobalButton
                  btnTitle={isEditMode ? "Update Trade" : "Create New Trade"}
                  disabled={isDisable}
                  type="submit"
                  onButtonClickHandler={handleSubmit}
                  bgColor="bg-main_color"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {isViewModal && (
        <GloablInfo
          firstTitle="Oopss!!"
          secondTitle="Trade Setting Required"
          desc={`${TRADE_SETTINGS_NO_ERROR} ${
            isBrokerCount === 0
              ? "select Demant & Broker"
              : "Select Trading Strategy"
          } option to add your first one.`}
          linktitle={
            isBrokerCount === 0
              ? "Go to Demant & Broker Account"
              : "Go to Strategy"
          }
          link={
            isBrokerCount === 0 ? "/all_broker_accounts" : "/all_user_strategy"
          }
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
