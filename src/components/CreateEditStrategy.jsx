import React, { useEffect, useState } from "react";
import GlobalInput from "./GlobalInput";
import "../index.css";
import { toast, Toaster } from "react-hot-toast";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import FloatButton from "./FloatButton";
import { LIST_FLOAT_SVG } from "../UI/GlobalSVG";
import { useNavigate, useParams } from "react-router-dom";
import {
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
  STRATEGY_PAGE_STRINGS,
} from "../constants/Strings";
import { useAuth } from "../store/AuthContext";
import {
  addFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../config/firestoreOperations";
import PageHeading from "./PageHeading";
import GlobalButton from "./GlobalButton";
import { validateAllFields } from "../config/validationUtils";
import { strategyValidationRules } from "../config/validations";

const initialState = {
  label: "",
};

function CreateEditStrategy() {
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
      navigate("/all_user_strategy");
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate("/all_user_strategy");
  };

  return (
    <>
      <div className="flex flex-col gap-9 p-8">
        <PageHeading
          title={
            isEditMode
              ? STRATEGY_PAGE_STRINGS?.editStrategy
              : STRATEGY_PAGE_STRINGS?.addStrategy
          }
        />

        <div className="rounded-lg bg-black-dark-200 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="p-7">
              <GlobalInput
                inputType="text"
                placeholder="Strategy"
                isValue={formData?.label}
                name="label"
                errors={errors?.label}
                onChangeHandler={(name, value) => handleChange(name, value)}
              />

              <GlobalButton
                btnTitle={isEditMode ? "Update" : "Submit"}
                disabled={false}
                type="submit"
                onButtonClickHandler={handleSubmit}
                bgColor="bg-primary-500"
              />
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={true} />
      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<LIST_FLOAT_SVG />}
      />
    </>
  );
}

export default CreateEditStrategy;
