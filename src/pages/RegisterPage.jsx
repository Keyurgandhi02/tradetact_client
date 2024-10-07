import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GlobalButton from "../components/GlobalButton";
import GlobalInput from "../components/GlobalInput";
import {
  loginValidationRules,
  signupValidationRules,
} from "../config/validations";
import { validateAllFields } from "../config/validationUtils";
import { GENERAL_FORM_VALIDATIONS_ERROR } from "../constants/Strings";
import { useAuth } from "../context/AuthContext";
import { APP_LOGO } from "../assets/svgIcons";

const initialState = {
  email: "",
  password: "",
  name: "",
  mobile: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const { login, signUp } = useAuth();
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
    <div className="min-h-screen dark:bg-main_black_b1 bg-whiten flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10  dark:bg-main_black_bg bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img src={APP_LOGO} className="w-32 mx-auto" alt="Logo" />
          </div>
          <div className="mt-12 flex flex-col items-center w-full">
            <h1 className="text-xl xl:text-2xl font-bold text-black">
              {isLogin ? "Log in" : "Sign up"}
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="w-full flex flex-col items-center">
                <form onSubmit={handleSubmit} className="w-full">
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

                  <GlobalInput
                    inputType="password"
                    placeholder="Password"
                    isValue={formData?.password}
                    name="password"
                    errors={errors?.password}
                    onChangeHandler={handleChange}
                  />

                  {isLogin && (
                    <div className="float-right mb-5">
                      <span
                        onClick={() => navigate("/reset-password")}
                        className="text-sm font-semibold underline cursor-pointer text-black-dark-400 dark:text-whiten hover:text-main_color outline-none border-none"
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
                      bgColor="bg-main_color"
                      onButtonClickHandler={handleSubmit}
                    />
                  </div>
                </form>
              </div>

              <div className="mt-12 text-md font-display font-semibold dark:text-whiten text-black-dark-400 text-center">
                {isLogin ? "Don't have an account ?" : "I am already member ?"}{" "}
                <span
                  className="underline cursor-pointer text-main_color outline-none border-none"
                  onClick={switchAuthModeHandler}
                >
                  {isLogin ? "Register Here" : "Sign in"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-main_color text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/auth_illustration.svg?alt=media&token=8033a712-4705-440c-8f03-9e0ae0351844')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
