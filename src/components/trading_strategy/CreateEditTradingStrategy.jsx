import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Activity,
  GitMerge,
  CircleDot,
  Minus,
  ArrowUpDown,
  BarChart3,
  Settings,
} from "lucide-react";
import GlobalInput from "../GlobalInput";
import "../../index.css";
import { toast } from "react-toastify";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import FloatButton from "../FloatButton";
import { LIST_FLOAT_SVG } from "../../assets/svgIcons";
import { useNavigate, useParams } from "react-router-dom";
import {
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
  STRATEGY_PAGE_STRINGS,
} from "../../constants/Strings";
import { useAuth } from "../../context/AuthContext";
import {
  addFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../../config/firestoreOperations";
import PageHeading from "../PageHeading";
import GlobalButton from "../GlobalButton";
import { validateAllFields } from "../../config/validationUtils";
import { strategyValidationRules } from "../../config/validations";
import { TRADING_STRATEGY_ROUTES } from "../../constants/routesConstants";
import GlobalDropdown from "../GlobalDropdown";
import {
  STRATEGY_TYPE_DROPDOWNS,
  TRADE_TIME_INTERVAL_DROPDOWNS,
} from "../../constants/Columns";
import GlobalTextArea from "../GlobalTextArea";
import SelectCard from "../SelectCard";

const initialState = {
  strategy_name: "",
  strategy_type: "",
  trade_time_interval: "",
  entry_criteria: "",
  exit_criteria: "",
};

function CreateEditTradingStrategy() {
  const { id } = useParams();
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedStrategyType, setSelectedStrategyType] = useState("");
  const [selectedTradeTimeInterval, setSelectedTimeInterval] = useState("");
  const [errors, setErrors] = useState({});
  const [cards] = useState([
    {
      id: "moving_average",
      label: "Moving Average",
      icon1: <TrendingUp className="w-18 h-18 text-prime2 mt-4" />,
    },
    {
      id: "rsi",
      label: "RSI",
      icon1: <Activity className="w-18 h-18 text-prime2 mt-4" />,
    },
    {
      id: "macd",
      label: "MACD",
      icon1: <GitMerge className="w-18 h-18 text-prime2 mt-4" />,
    },

    {
      id: "bollinger_bands",
      label: "Bollinger Bands",
      icon1: <CircleDot className="w-18 h-18 text-prime2 mt-4" />,
    },

    {
      id: "vwap",
      label: "VWAP",
      icon1: <Minus className="w-18 h-18 text-prime2 mt-4" />,
    },

    {
      id: "supertrend",
      label: "Supertrend",
      icon1: <ArrowUpDown className="w-18 h-18 text-prime2 mt-4" />,
    },
    {
      id: "price_action",
      label: "Price Action",
      icon1: <BarChart3 className="w-18 h-18 text-prime2 mt-4" />,
    },
    {
      id: "other",
      label: "Other",
      icon1: <Settings className="w-18 h-18 text-prime2 mt-4" />,
    },
  ]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsEditMode(true);
      try {
        const fetchedTasks = await getFirebaseDataById(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          id
        );
        setFormData(fetchedTasks);

        // ✅ pre-fill selected indicators
        if (fetchedTasks?.indicators) {
          setSelectedItems(fetchedTasks.indicators);
        }

        // ✅ pre-fill dropdowns
        if (fetchedTasks?.strategy_type) {
          setSelectedStrategyType(fetchedTasks.strategy_type);
        }
        if (fetchedTasks?.trade_time_interval) {
          setSelectedTimeInterval(fetchedTasks.trade_time_interval);
        }
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

  // Trade Type Dropdown Handler
  const handleTradeTimeIntervalChange = (interval) => {
    setSelectedTimeInterval(interval);
    setFormData((prevFormData) => ({
      ...prevFormData,
      trade_time_interval: interval,
    }));
  };

  // Trade Type Dropdown Handler
  const handleTradeTypeChange = (interval) => {
    setSelectedStrategyType(interval);
    setFormData((prevFormData) => ({
      ...prevFormData,
      strategy_type: interval,
    }));
  };

  // Select Card Handler
  const handleSelect = (item) => {
    const cleanItem = { id: item.id, label: item.label };
    setSelectedItems((prevSelected) => {
      if (prevSelected.some((i) => i.id === item.id)) {
        return prevSelected.filter((i) => i.id !== item.id);
      } else {
        return [...prevSelected, cleanItem];
      }
    });
  };

  // Form Submit Handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const modifiedData = {};
    let hasChanges = false;

    // attach selectedItems into formData
    const allData = {
      ...formData,
      indicators: selectedItems,
    };

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialState[key]) {
        modifiedData[key] = formData[key];
        hasChanges = true;
      }
    });

    const validationErrors = validateAllFields(
      isEditMode ? modifiedData : formData,
      strategyValidationRules
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(GENERAL_FORM_VALIDATIONS_ERROR);
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Please select at least one indicator");
      return;
    }

    try {
      if (isEditMode && hasChanges) {
        await updateFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          id,
          allData
        );
      } else if (!isEditMode) {
        await addFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          allData
        );
      }
      setFormData(initialState);
      setSelectedItems([]);
      navigate(TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_ALL);
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_ALL);
  };

  return (
    <>
      <div className="flex flex-col gap-9 p-4 mt-5 mb-5">
        <PageHeading
          title={
            isEditMode
              ? STRATEGY_PAGE_STRINGS?.editStrategy
              : STRATEGY_PAGE_STRINGS?.addStrategy
          }
        />

        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
              <GlobalInput
                inputType="text"
                placeholder="Strategy Name *"
                isValue={formData?.strategy_name}
                name="strategy_name"
                errors={errors?.strategy_name}
                onChangeHandler={(name, value) => handleChange(name, value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <GlobalDropdown
                formData={formData?.strategy_type}
                label="Strategy Type *"
                errors={errors?.strategy_type}
                children={
                  <select
                    className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                    onChange={(e) => handleTradeTypeChange(e.target.value)}
                    value={selectedStrategyType}
                  >
                    <option value="" disabled>
                      Select Strategy Type
                    </option>
                    {STRATEGY_TYPE_DROPDOWNS?.map((item) => (
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

              <GlobalDropdown
                formData={formData?.trade_time_interval}
                label="Time Interval"
                children={
                  <select
                    className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                    onChange={(e) =>
                      handleTradeTimeIntervalChange(e.target.value)
                    }
                    value={selectedTradeTimeInterval}
                  >
                    <option value="" disabled>
                      Select Time Interval
                    </option>
                    {TRADE_TIME_INTERVAL_DROPDOWNS?.map((item) => (
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <GlobalTextArea
                row="4"
                label=""
                placeholder="Entry Criteria *"
                isValue={formData?.entry_criteria}
                name="entry_criteria"
                errors={errors?.entry_criteria}
                onChangeHandler={(name, value) => handleChange(name, value)}
              />

              <GlobalTextArea
                row="4"
                label=""
                placeholder="Exit Criteria *"
                isValue={formData?.exit_criteria}
                name="exit_criteria"
                errors={errors?.exit_criteria}
                onChangeHandler={(name, value) => handleChange(name, value)}
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
                Choose Indicators
              </label>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
              {cards.map((item) => (
                <SelectCard
                  key={item.id}
                  item={item}
                  handleSelect={handleSelect}
                  isSelected={selectedItems.some(
                    (selectedItem) => selectedItem.id === item.id
                  )}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2 mt-5">
              <GlobalTextArea
                row="4"
                label=""
                placeholder="Description"
                isValue={formData?.description}
                name="description"
                onChangeHandler={(name, value) => handleChange(name, value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-5">
              <GlobalButton
                btnTitle={isEditMode ? "Update Strategy" : "Add Strategy"}
                disabled={false}
                type="submit"
                onButtonClickHandler={handleSubmit}
                bgColor="bg-main_color"
              />
            </div>
          </div>
        </form>
      </div>

      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<LIST_FLOAT_SVG />}
      />
    </>
  );
}

export default CreateEditTradingStrategy;
