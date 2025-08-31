import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import GlobalButton from "../components/GlobalButton";
import GlobalInput from "../components/GlobalInput";
import { resetPasswordValidationRules } from "../config/validations";
import { validateAllFields } from "../config/validationUtils";
import { GENERAL_FORM_VALIDATIONS_ERROR } from "../constants/Strings";
import { useAuth } from "../context/AuthContext";
import { APP_LOGO } from "../assets/svgIcons";

const initialState = {
  email: "",
};

function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Input Change Handler
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAllFields(
      formData,
      resetPasswordValidationRules
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(GENERAL_FORM_VALIDATIONS_ERROR);
      return;
    }

    try {
      await resetPassword(formData?.email);
      alert(`Check Your ${formData?.email} Inbox for Further Instructions`);
      navigate("/auth");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="TradeTact" className="mx-auto h-20 w-auto" src={APP_LOGO} />
        <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-main_color">
          Reset Password
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <GlobalInput
            inputType="email"
            placeholder="Email"
            isValue={formData?.email}
            name="email"
            errors={errors?.email}
            onChangeHandler={handleChange}
          />

          <div className="mt-14">
            <GlobalButton
              btnTitle="Submit"
              disabled={false}
              type="submit"
              bgColor="bg-main_color"
              onButtonClickHandler={handleSubmit}
            />
          </div>
        </form>
        <Link
          to="/"
          className="dark:text-whiten text-black-dark-400 text-md flex justify-center mt-5"
        >
          Go Back to home
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
