import { CheckIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import GlobalButton from "../../components/GlobalButton";
import { useNavigate } from "react-router-dom";
import { PRICING_ROUTES } from "../../constants/routesConstants";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { GENERAL_SUBMIT_ERROR } from "../../constants/Strings";
import * as firestore from "firebase/firestore";
import db from "../../utils/firebase-config";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";

function PricingCheckoutPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isPlan, setPlan] = useState({});
  const [isFinalPrice, setFinalPrice] = useState(0);
  const [value, setValue] = useState(1);

  // Function to handle increment
  const handleIncrement = () => {
    setValue((prevValue) => prevValue + 1);
    setFinalPrice(isPlan?.price * (value + 1));
  };

  // Function to handle decrement
  const handleDecrement = () => {
    setFinalPrice(isPlan?.price * (value - 1));
    setValue((prevValue) => (prevValue > 1 ? prevValue - 1 : 1)); // Prevent negative values
  };

  // Function to handle manual input
  const handleInputChange = (e) => {
    const newValue = e.target.value === "" ? 1 : parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setValue(newValue);
      setFinalPrice(isPlan?.price * newValue);
    }
  };

  // Plan Details Fetch Handler
  useEffect(() => {
    const planDetails = JSON.parse(localStorage.getItem("subscription_plan"));
    if (planDetails) {
      setPlan(planDetails);
    } else {
      setPlan({});
      toast.warning("Subscription Plan Not found!");
      navigate(PRICING_ROUTES.PRICING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async () => {
    try {
      const dataWithTimestamp = {
        subscription: {
          planDetails: {
            planId: isPlan?.id,
            planName: isPlan?.name,
            planDurationType: isPlan?.duration_type,
            planDurationMonth: value,
            planPrice: isPlan?.price,
          },
          createdAt: firestore.serverTimestamp(),
        },
        subscription_status: true,
      };

      const docRef = firestore.doc(
        db,
        FIREBASE_ENDPOINTS.USER_AUTH,
        currentUser?.uid
      );

      await firestore.updateDoc(docRef, dataWithTimestamp);
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {isPlan && (
        <div className="shrink-0 px-4 lg:order-2 lg:min-w-0 lg:flex-1 lg:px-16 xl:px-20">
          <div className="mx-auto grid max-w-md grid-cols-1 ">
            <div className="relative py-10 lg:pt-24">
              <div className="mt-10 flex space-x-3 lg:mt-0">
                <h1 className="text-base font-semibold leading-6 text-main_color">
                  {isPlan?.name?.toUpperCase()}
                </h1>
                <span className="rounded-full bg-secondary px-3 text-xs font-bold leading-6 text-black-dark-400">
                  Pro
                </span>
              </div>
              <div className="mt-4 flex items-center space-x-3">
                <p className="text-4xl text-black-dark-400 dark:text-whiten">
                  <span className="font-bold"> ₹ {isPlan?.price}</span>
                </p>
                <p className="text-sm font-semibold dark:text-gray text-black-dark-400">
                  {isPlan?.duration_type} payment
                </p>
              </div>

              <ul className="dark:text-gray text-black-dark-400 mt-8 space-y-3 text-sm leading-6 sm:mt-10">
                {isPlan?.features?.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="text-blue-600 h-6 w-5 flex-none"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm leading-6 text-secondary">
                All prices in INR
              </p>

              <div className="py-2 px-3 mt-5 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                <div className="w-full flex justify-between items-center gap-x-3">
                  <div>
                    <span className="block font-medium text-sm text-gray-800 dark:text-white">
                      Choose Plan Duration
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-neutral-400">
                      ₹ {isPlan?.price} {isPlan?.duration_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-1.5">
                    <button
                      type="button"
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      aria-label="Decrease"
                      onClick={handleDecrement}
                    >
                      <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                      </svg>
                    </button>
                    <input
                      className="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 dark:text-white"
                      style={{ MozAppearance: "textfield" }}
                      type="number"
                      aria-roledescription="Number field"
                      value={value}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      aria-label="Increase"
                      onClick={handleIncrement}
                    >
                      <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-10 font-semibold text-black-dark-400 dark:text-whiten">
                <dt>Total price</dt>
                <dd>
                  ₹{" "}
                  <span>{isFinalPrice > 0 ? isFinalPrice : isPlan?.price}</span>
                </dd>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-5">
              <GlobalButton
                btnTitle="Checkout"
                disabled={false}
                type="submit"
                bgColor="bg-main_color"
                textColor=""
                onButtonClickHandler={submitHandler}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PricingCheckoutPage;
