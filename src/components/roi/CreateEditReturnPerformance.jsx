import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import {
  addFirebaseData,
  getFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import { validateAllFields } from "../../config/validationUtils";
import { roiValidationRules } from "../../config/validations";
import {
  GENERAL_ADD_SUCCESS,
  GENERAL_FETCH_ERROR,
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
  ROI_PAGE_STRINGS,
  TRADE_SETTINGS_NO_ERROR,
} from "../../constants/Strings";
import { ROI_ROUTES } from "../../constants/routesConstants";
import PageHeading from "../PageHeading";
import GlobalInput from "../GlobalInput";
import GlobalDropdown from "../GlobalDropdown";
import GlobalButton from "../GlobalButton";
import GloablInfo from "../GloablInfo";
import FloatButton from "../FloatButton";
import { LIST_FLOAT_SVG } from "../../assets/svgIcons";

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
  const [selectedDematUser, setSelectedDematUser] = useState("");

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
        setSelectedDematUser(fetchedTasks?.accountName);
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

  // Demat Dropdown Handler
  const handleDematUserChange = (selectedUser) => {
    setSelectedDematUser(selectedUser);
    setFormData((prevFormData) => ({
      ...prevFormData,
      accountName: selectedUser,
    }));
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
      navigate(ROI_ROUTES.ROI_ALL);
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(ROI_ROUTES.ROI_ALL);
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
          "doc_created_At",
          true
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
        <div className="flex flex-col gap-9 p-4 mt-5 mb-5">
          <PageHeading
            title={
              isEditMode ? ROI_PAGE_STRINGS?.editRoi : ROI_PAGE_STRINGS?.addRoi
            }
          />

          <form onSubmit={handleSubmit}>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <GlobalInput
                  inputType="month"
                  placeholder="Date"
                  isValue={formData?.created_at}
                  name="created_at"
                  errors={errors?.created_at}
                  onChangeHandler={(name, value) => handleChange(name, value)}
                />

                <GlobalDropdown
                  formData={formData?.accountName}
                  errors={errors?.accountName}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-5">
                <GlobalButton
                  btnTitle={isEditMode ? "Update Returns" : "Add Returns"}
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
