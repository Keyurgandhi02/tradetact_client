import React, { useState } from "react";
import GlobalInput from "./GlobalInput";
import GlobalTextArea from "./GlobalTextArea";
import GlobalButton from "./GlobalButton";
import { LOCATION_SVG, PHONE_SVG, TIME_SVG } from "../assets/svgIcons";
import { useAuth } from "../context/AuthContext";
import { validateAllFields } from "../config/validationUtils";
import { contactValidationRules } from "../config/validations";
import {
  CONTACT_MESSAGE_SUCCESS,
  GENERAL_FORM_VALIDATIONS_ERROR,
  GENERAL_SUBMIT_ERROR,
} from "../constants/Strings";
import { toast } from "react-toastify";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import db from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { GENERAL_ROUTES } from "../constants/routesConstants";

const initialState = {
  message: "",
};

function Contact() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Input Change Handler
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toLowerCase(),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateAllFields(
      formData,
      contactValidationRules
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(GENERAL_FORM_VALIDATIONS_ERROR);
      return;
    }

    if (currentUser) {
      try {
        await addDoc(collection(db, FIREBASE_ENDPOINTS.CONTACT_US_DATA), {
          ...formData,
          createdAt: serverTimestamp(),
          name: currentUser?.displayName,
          email: currentUser?.email,
        });

        setFormData(initialState);
        toast.success(CONTACT_MESSAGE_SUCCESS);
      } catch (error) {
        toast.error(GENERAL_SUBMIT_ERROR);
      }
    } else {
      navigate(GENERAL_ROUTES.BLANK);
    }
  };

  return (
    <section class="bg-transparent" id="contact">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div class="mb-4">
          <div class="mb-10 max-w-3xl text-center sm:text-center md:mx-auto md:mb-12">
            <h2 class="font-heading mb-4 font-bold tracking-tight text-black-dark-400 dark:text-white text-3xl sm:text-5xl">
              Get in Touch
            </h2>
            <p class="mx-auto mt-4 max-w-3xl text-xl text-gray-600 dark:text-slate-400">
              Please use the form below to contact us. Thank you!
            </p>
          </div>
        </div>
        <div class="flex items-stretch justify-center">
          <div class="grid md:grid-cols-2">
            <div class="h-full pr-6">
              <p class="mt-12 mb-12 text-lg text-black-dark-400 dark:text-white">
                Feel free to reach out to us! Whether you have a question, or a
                feedback, we'd love to hear from you.
              </p>
              <ul class="mb-6 md:mb-0">
                <li class="flex">
                  <div class="flex h-10 w-10 items-center justify-center rounded bg-main_color text-white">
                    <LOCATION_SVG />
                  </div>
                  <div class="ml-4 mb-4">
                    <h3 class="mb-2 text-lg font-bold leading-6 text-black-dark-400 dark:text-white">
                      Our Address
                    </h3>
                    <p class="text-black-dark-400 dark:text-white">
                      C-441 BG Towers, Ahmedabad
                    </p>
                    <p class="text-black-dark-400 dark:text-white">
                      Gujarat, India
                    </p>
                  </div>
                </li>
                <li class="flex">
                  <div class="flex h-10 w-10 items-center justify-center rounded bg-main_color text-white">
                    <PHONE_SVG />
                  </div>
                  <div class="ml-4 mb-4">
                    <h3 class="mb-2 text-lg font-bold leading-6 text-black-dark-400 dark:text-white">
                      Contact
                    </h3>
                    <p class="text-black-dark-400 dark:text-white">
                      Mobile: +91 (722) 704-5037
                    </p>
                    <p class="text-black-dark-400 dark:text-white">
                      Mail: info@teamuprisefuse.com
                    </p>
                  </div>
                </li>
                <li class="flex">
                  <div class="flex h-10 w-10 items-center justify-center rounded bg-main_color text-white">
                    <TIME_SVG />
                  </div>
                  <div class="ml-4 mb-4">
                    <h3 class="mb-2 text-lg font-bold leading-6 text-black-dark-400 dark:text-white">
                      Working hours
                    </h3>
                    <p class="text-black-dark-400 dark:text-white">
                      Monday - Friday: 09:00 - 5:00
                    </p>
                    <p class="text-black-dark-400 dark:text-white">
                      Saturday &amp; Sunday: 09:00 - 12:00
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="card h-fit max-w-6xl p-5 md:p-12" id="form">
              <h2 class="mb-4 text-2xl font-bold dark:text-white">
                Ready to Get Started?
              </h2>
              <form id="contactForm">
                <div class="mb-6">
                  <div class="mx-0 mb-1 sm:mb-4">
                    <div class="mx-0 mb-1 sm:mb-4">
                      <GlobalInput
                        inputType="text"
                        placeholder="Name"
                        disabledStatus={true}
                        isValue={currentUser?.displayName}
                      />
                    </div>
                    <div class="mx-0 mb-1 sm:mb-4">
                      <GlobalInput
                        inputType="email"
                        placeholder="Email"
                        disabledStatus={true}
                        isValue={currentUser?.email}
                      />
                    </div>
                  </div>
                  <div class="mx-0 mb-1 sm:mb-4">
                    <GlobalTextArea
                      row="4"
                      label=""
                      placeholder="Message *"
                      isValue={formData?.message}
                      errors={errors?.message}
                      name="message"
                      onChangeHandler={(name, value) =>
                        handleChange(name, value)
                      }
                    />
                  </div>
                </div>
                <GlobalButton
                  btnTitle="Send message"
                  disabled={false}
                  type="submit"
                  onButtonClickHandler={handleSubmit}
                  bgColor="bg-main_color"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
