import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GlobalButton from "../components/GlobalButton";
import GlobalInput from "../components/GlobalInput";
import {
  loginValidationRules,
  signupValidationRules,
} from "../config/validations";
import { validateAllFields } from "../config/validationUtils";
import { GENERAL_FORM_VALIDATIONS_ERROR } from "../constants/Strings";
import { useAuth } from "../store/AuthContext";

const initialState = {
  email: "",
  password: "",
  name: "",
  mobile: "",
};

function RegisterPage() {
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

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
      formData || {},
      isLogin ? loginValidationRules : signupValidationRules
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(GENERAL_FORM_VALIDATIONS_ERROR);
      return;
    }

    if (isLogin) {
      try {
        await login(formData?.email, formData?.password);
      } catch (error) {
        toast.error(error);
      }
    } else {
      try {
        await signUp(
          formData?.name,
          formData?.email,
          formData?.password,
          formData?.mobile
        );
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Trade Tact"
          className="mx-auto h-20 w-auto"
          src="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Group%2026.png?alt=media&token=65626bef-8bff-49ba-bf7a-58f597935c41"
        />
        <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-primary-300">
          {isLogin ? "Login to your account" : "Register your account"}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <GlobalInput
              inputType="name"
              placeholder="Name"
              isValue={formData?.name}
              name="name"
              errors={errors?.name}
              onChangeHandler={handleChange}
            />
          )}

          <GlobalInput
            inputType="email"
            placeholder="Email"
            isValue={formData?.email}
            name="email"
            errors={errors?.email}
            onChangeHandler={handleChange}
          />

          {!isLogin && (
            <GlobalInput
              inputType="number"
              placeholder="Mobile"
              isValue={formData?.mobile}
              name="mobile"
              errors={errors?.mobile}
              onChangeHandler={handleChange}
            />
          )}

          <div className="mt-8">
            <GlobalInput
              inputType="password"
              placeholder="Password"
              isValue={formData?.password}
              name="password"
              errors={errors?.password}
              onChangeHandler={handleChange}
            />
          </div>

          {isLogin && (
            <div className="float-right mb-5">
              <span
                onClick={() => navigate("/reset-password")}
                className="text-sm font-semibold underline cursor-pointer text-whiten hover:text-primary-300 outline-none border-none"
              >
                Forgot Password?
              </span>
            </div>
          )}

          <div className="mt-14">
            <GlobalButton
              btnTitle={isLogin ? "Login" : "Register"}
              disabled={false}
              type="submit"
              bgColor="bg-primary-500"
              onButtonClickHandler={handleSubmit}
            />
          </div>
        </form>
        <div className="mt-12 text-md font-display font-semibold text-whiten text-center">
          {isLogin ? "Don't have an account ?" : "I am already member ?"}{" "}
          <span
            className="underline cursor-pointer text-primary hover:text-primary-300 outline-none border-none"
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Register Here" : "Sign in"}
          </span>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={true} />
    </div>
  );
}

export default RegisterPage;
