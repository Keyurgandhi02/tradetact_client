import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { useNavigate, useParams } from "react-router-dom";
import GlobalInput from "./GlobalInput";
import { LIST_FLOAT_SVG } from "../UI/GlobalSVG";
import FloatButton from "./FloatButton";
import {
  GENERAL_ADD_SUCCESS,
  GENERAL_FETCH_ERROR,
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
  ROI_PAGE_STRINGS,
  TRADE_SETTINGS_NO_ERROR,
} from "../constants/Strings";
import { useAuth } from "../store/AuthContext";
import {
  addFirebaseData,
  getFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../config/firestoreOperations.js";
import PageHeading from "./PageHeading";
import GlobalButton from "./GlobalButton";
import { validateAllFields } from "../config/validationUtils";
import { roiValidationRules } from "../config/validations";
import { useLoading } from "../store/LoadingContext";
import GlobalDropdown from "./GlobalDropdown";
import GloablInfo from "./GloablInfo";

const initialState = {
  created_at: "",
  accountName: "",
  invested_amount: "",
  returned_amount: "",
  charges: "",
};

function CreateEditReturnPerformance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const { startLoading, stopLoading } = useLoading();
  const [isViewModal, setViewModal] = useState(false);
  const [isDisable, setDisable] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsEditMode(true);
      try {
        const fetchedTasks = await getFirebaseDataById(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_ROI,
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

    const { invested_amount, returned_amount } = formData;
    const investmentNum = parseFloat(invested_amount);
    const returnAmountNum = parseFloat(returned_amount);

    const roiResult = ((returnAmountNum - investmentNum) / investmentNum) * 100;
    const returnAmount = returnAmountNum - investmentNum;
    const data = {
      ...formData,
      returnPercentage: roiResult,
      returnAmount,
    };

    const modifiedData = {};
    let hasChanges = false;

    Object.keys(data).forEach((key) => {
      if (data[key] !== initialState[key]) {
        modifiedData[key] = data[key];
        hasChanges = true;
      }
    });

    const validationErrors = validateAllFields(
      isEditMode ? modifiedData : data,
      roiValidationRules
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
          FIREBASE_ENDPOINTS.USER_ROI,
          id,
          modifiedData
        );
      } else if (!isEditMode) {
        await addFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_ROI,
          data
        );
        toast.success(GENERAL_ADD_SUCCESS);
      }

      setFormData(initialState);
      navigate("/all_return_performance");
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate("/all_return_performance");
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedOptions = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_DEMAT,
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
              isEditMode ? ROI_PAGE_STRINGS?.editRoi : ROI_PAGE_STRINGS?.addRoi
            }
          />
          <div className="rounded-lg  bg-black-dark-200 shadow-xl">
            <form onSubmit={handleSubmit}>
              <div className="p-7">
                <GlobalInput
                  inputType="month"
                  placeholder="Date"
                  isValue={formData?.created_at}
                  name="created_at"
                  errors={errors?.created_at}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                />

                <GlobalDropdown
                  options={options}
                  formData={formData?.label}
                  selectDropDownHandler={selectDropDownHandler}
                  name="accountName"
                  label="Select Account"
                  errors={errors?.accountName}
                />

                <GlobalInput
                  inputType="number"
                  placeholder="Amount Invested"
                  isValue={formData?.invested_amount}
                  name="invested_amount"
                  errors={errors?.invested_amount}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                />
                <GlobalInput
                  inputType="number"
                  placeholder="Amount Returned"
                  isValue={formData?.returned_amount}
                  name="returned_amount"
                  errors={errors?.returned_amount}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                />
                <GlobalInput
                  inputType="number"
                  placeholder="Total Charges"
                  isValue={formData?.charges}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                  name="charges"
                  errors={errors?.charges}
                  disabledStatus={false}
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
          link="/create_demat_accounts"
        />
      )}

      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<LIST_FLOAT_SVG />}
      />
    </div>
  );
}

export default CreateEditReturnPerformance;
