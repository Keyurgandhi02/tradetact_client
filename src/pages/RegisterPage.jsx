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
import ModalDialog from "../components/ModalDialog";
import { sendEmailVerification } from "firebase/auth";

const initialState = {
  email: "",
  password: "",
  name: "",
  mobile: "",
  subscription_status: false,
};

function RegisterPage() {
  const navigate = useNavigate();
  const { login, signUp, currentUser } = useAuth();
  const [isViewModal, setViewModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Switch Hadler Signup and Login
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
        if (currentUser?.emailVerified === false) {
          setViewModal(true);
        } else {
          await login(formData?.email, formData?.password);
        }
      } catch (error) {
        toast.error(error);
      }
    } else {
      try {
        await signUp(
          formData?.name,
          formData?.email,
          formData?.password,
          formData?.mobile,
          formData?.subscription_status
        );

        setFormData(initialState);
        setIsLogin(true);
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const resendVerificationEmail = async () => {
    const user = currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        toast.success("Verification email sent again!");
        setViewModal(false);
      } catch (error) {
        toast.error("Error resending verification email");
      }
    } else {
      toast.error("User is either not logged in or already verified");
    }
  };

  return (
    <div className="min-h-screen dark:bg-main_black_b1 bg-whiten flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10  dark:bg-main_black_bg bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-12">
          <div>
            <img src={APP_LOGO} className="w-35 mx-auto" alt="Logo" />
          </div>
          <div className="mt-12 flex flex-col items-center w-full">
            <h1 className="text-lg xl:text-xl font-bold text-black-dark-400 dark:text-whiten">
              {isLogin ? "Welcome Back" : "Register"}
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
        <div className="flex-1 bg-main_color text-center hidden lg:flex sm:rounded-lg">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${process.env.REACT_APP_FIREBASE_APP_REGISTER_IMAGE_URL})`,
            }}
          ></div>
        </div>
      </div>

      <ModalDialog
        isOpen={isViewModal}
        onClose={() => setViewModal(false)}
        children={
          <div className="p-12 flex flex-col justify-between items-center">
            <h2 className="py-5 text-black-dark-400 dark:text-whiten font-bold text-2xl">
              Verify your email
            </h2>
            <p className="text-black-dark-400 dark:text-whiten font-normal text-lg pt-5 pb-8 text-center">
              Hi {currentUser?.displayName}, Please verify your email address by
              clicking the link sent to{" "}
              <span className="font-bold">{currentUser?.email}</span>
            </p>

            <GlobalButton
              btnTitle="Resend Verification Email"
              disabled={false}
              type="submit"
              bgColor="bg-main_color"
              onButtonClickHandler={resendVerificationEmail}
            />
          </div>
        }
      />
    </div>
  );
}

export default RegisterPage;
