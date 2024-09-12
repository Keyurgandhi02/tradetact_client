import React, { useState, useEffect } from "react";
import GlobalInput from "./GlobalInput";
import GlobalDropdown from "./GlobalDropdown";
import { toast, Toaster } from "react-hot-toast";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { WATCHLIST_DROPDOWNS } from "../constants/Columns";
import { useNavigate, useParams } from "react-router-dom";
import {
  GENERAL_FETCH_ERROR,
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
  TRADE_SETTINGS_NO_ERROR,
  WATCHLIST_PAGE_STRINGS,
} from "../constants/Strings";
import FloatButton from "./FloatButton";
import { LIST_FLOAT_SVG } from "../UI/GlobalSVG";
import { useAuth } from "../store/AuthContext";
import {
  addFirebaseData,
  getFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../config/firestoreOperations.js";
import { validateAllFields } from "../config/validationUtils";
import { useLoading } from "../store/LoadingContext";
import GlobalButton from "./GlobalButton";
import PageHeading from "./PageHeading";
import { watchlistValidationRules } from "../config/validations";
import GloablInfo from "./GloablInfo";

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
          currentUser.uid,
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
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_WATCHLIST,
          id,
          modifiedData
        );
      } else if (!isEditMode) {
        await addFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_WATCHLIST,
          formData
        );
      }

      setFormData(initialState);
      navigate("/all_watchlist");
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate("/all_watchlist");
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedOptions = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
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
        <div className="flex flex-col gap-9 p-8">
          <PageHeading
            title={
              isEditMode
                ? WATCHLIST_PAGE_STRINGS?.editWatchlist
                : WATCHLIST_PAGE_STRINGS?.addWatchlist
            }
          />
          <div className="rounded-lg bg-black-dark-200 shadow-xl">
            <form onSubmit={handleSubmit}>
              <div className="p-7">
                <GlobalInput
                  inputType="date"
                  placeholder="Date"
                  isValue={formData?.created_at}
                  name="created_at"
                  onChangeHandler={handleChange}
                  errors={errors?.created_at}
                />

                <GlobalInput
                  inputType="text"
                  placeholder="Script Name"
                  isValue={formData?.scriptName}
                  name="scriptName"
                  onChangeHandler={handleChange}
                  errors={errors?.scriptName}
                />

                <GlobalInput
                  inputType="number"
                  placeholder="Stock Price"
                  isValue={formData?.stockPrice}
                  onChangeHandler={handleChange}
                  name="stockPrice"
                  errors={errors?.stockPrice}
                />

                <GlobalDropdown
                  options={options}
                  formData={formData?.strategyName}
                  selectDropDownHandler={selectDropDownHandler}
                  name="strategyName"
                  label="Select Strategy"
                  errors={errors?.strategyName}
                />

                <GlobalDropdown
                  options={isStatusOptions}
                  formData={formData?.status}
                  selectDropDownHandler={selectDropDownHandler}
                  name="status"
                  label="Select Status"
                  errors={errors?.status}
                />

                <GlobalButton
                  btnTitle={isEditMode ? "Update" : "Submit"}
                  disabled={isDisable}
                  type="submit"
                  bgColor="bg-primary-500"
                  textColor=""
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

export default CreateEditWatchlist;
