import React, { useState, useEffect } from "react";
import GlobalInput from "../GlobalInput.jsx";
import GlobalDropdown from "../GlobalDropdown.jsx";
import { toast } from "react-toastify";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants.js";
import { WATCHLIST_DROPDOWNS } from "../../constants/Columns.js";
import { useNavigate, useParams } from "react-router-dom";
import {
  GENERAL_FETCH_ERROR,
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
  TRADE_SETTINGS_NO_ERROR,
  WATCHLIST_PAGE_STRINGS,
} from "../../constants/Strings.js";
import FloatButton from "../FloatButton.jsx";
import { LIST_FLOAT_SVG } from "../../assets/svgIcons.js";
import { useAuth } from "../../context/AuthContext.js";
import {
  addFirebaseData,
  getFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../../config/firestoreOperations.js";
import { validateAllFields } from "../../config/validationUtils.js";
import { useLoading } from "../../context/LoadingContext.js";
import GlobalButton from "../GlobalButton.jsx";
import PageHeading from "../PageHeading.jsx";
import { watchlistValidationRules } from "../../config/validations.js";
import GloablInfo from "../GloablInfo.jsx";
import { WATCHLIST_ROUTES } from "../../constants/routesConstants.js";

const initialState = {
  created_at: "",
  scriptName: "",
  stockPrice: "",
  strategyName: "",
  status: "",
};

function CreateEditWatchlist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(!id && initialState);
  const [isEditMode, setIsEditMode] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const [options, setOptions] = useState([]);
  const [isStatusOptions, setStatusOptions] = useState([]);
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

          FIREBASE_ENDPOINTS.USER_WATCHLIST,
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
    setFormData({
      ...formData,
      [name]: value,
    });
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
      watchlistValidationRules
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
          FIREBASE_ENDPOINTS.USER_WATCHLIST,
          id,
          modifiedData
        );
      } else if (!isEditMode) {
        await addFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          FIREBASE_ENDPOINTS.USER_WATCHLIST,
          formData
        );
      }

      setFormData(initialState);
      navigate(WATCHLIST_ROUTES.WATCHLIST_ALL);
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(WATCHLIST_ROUTES.WATCHLIST_ALL);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedOptions = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,

          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At",
          true
        );

        if (!fetchedOptions.length) {
          setViewModal(true);
          setDisable(true);
        } else {
          setOptions(fetchedOptions);
          setStatusOptions(WATCHLIST_DROPDOWNS);
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
                ? WATCHLIST_PAGE_STRINGS?.editWatchlist
                : WATCHLIST_PAGE_STRINGS?.addWatchlist
            }
          />

          <form onSubmit={handleSubmit}>
            <div className="p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <GlobalInput
                  inputType="date"
                  placeholder="Date *"
                  isValue={formData?.created_at}
                  name="created_at"
                  onChangeHandler={handleChange}
                  errors={errors?.created_at}
                />

                <GlobalInput
                  inputType="text"
                  placeholder="Script Name *"
                  isValue={formData?.scriptName}
                  name="scriptName"
                  onChangeHandler={handleChange}
                  errors={errors?.scriptName}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <GlobalInput
                  inputType="number"
                  placeholder="Stock Price *"
                  isValue={formData?.stockPrice}
                  onChangeHandler={handleChange}
                  name="stockPrice"
                  errors={errors?.stockPrice}
                />

                <GlobalDropdown
                  formData={formData?.strategyName}
                  label="Select Strategy *"
                  errors={errors?.strategyName}
                  children={
                    <select
                      className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                      onChange={(e) =>
                        selectDropDownHandler("strategyName", e.target.value)
                      }
                      value={formData?.strategyName}
                    >
                      <option value="" disabled>
                        Select Strategy
                      </option>
                      {options?.map((item) => (
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
                  formData={formData?.status}
                  label="Select Status *"
                  errors={errors?.status}
                  children={
                    <select
                      className="bg-transparent relative z-2 w-full appearance-none rounded border-[1.2px] border-gray-500 text-black-dark-400 dark:text-whiten px-5 py-3 outline-none transition focus:border-main_color active:border-main_color"
                      onChange={(e) =>
                        selectDropDownHandler("status", e.target.value)
                      }
                      value={formData?.status}
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {isStatusOptions?.map((item) => (
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

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-5">
                <GlobalButton
                  btnTitle={isEditMode ? "Update Stock" : "Add Stock"}
                  disabled={isDisable}
                  type="submit"
                  bgColor="bg-main_color"
                  textColor=""
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {isViewModal && (
        <GloablInfo
          firstTitle="😬"
          secondTitle="Trade Setting Required!"
          desc={TRADE_SETTINGS_NO_ERROR}
          linktitle="Go to Console"
          link="/create_user_strategy"
        />
      )}

      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<LIST_FLOAT_SVG />}
      />
    </div>
  );
}

export default CreateEditWatchlist;
