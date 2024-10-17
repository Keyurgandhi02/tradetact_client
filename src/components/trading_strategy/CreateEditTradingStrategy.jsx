import React, { useEffect, useState } from "react";
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

const initialState = {
  label: "",
};

function CreateEditTradingStrategy() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsEditMode(true);
      try {
        const fetchedTasks = await getFirebaseDataById(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
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
      strategyValidationRules
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
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          id,
          modifiedData
        );
      } else if (!isEditMode) {
        await addFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          formData
        );
      }
      setFormData(initialState);
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
                placeholder="Strategy *"
                isValue={formData?.label}
                name="label"
                errors={errors?.label}
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
