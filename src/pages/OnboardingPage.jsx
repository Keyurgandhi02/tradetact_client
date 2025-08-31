import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import GlobalButton from "../components/GlobalButton";
import { GENERAL_ROUTES } from "../constants/routesConstants";
import { doc, setDoc } from "firebase/firestore";
import db from "../utils/firebase-config";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const steps = [
  {
    title: "How long have you been trading?",
    key: "experience",
    options: [
      { label: "Newbie", value: "<1 year" },
      { label: "Climbing Ranks", value: "1-3 years" },
      { label: "Ninja Level", value: "3-5 years" },
      { label: "Monk Mode", value: "5+ years" },
    ],
    type: "single",
  },
  {
    title: "What are you currently trading?",
    key: "markets",
    options: [
      { label: "Stocks", value: "stocks" },
      { label: "Options", value: "options" },
      { label: "Forex", value: "forex" },
      { label: "Crypto", value: "crypto" },
      { label: "Futures", value: "futures" },
      { label: "Other", value: "other" },
    ],
    type: "multi",
  },
  {
    title: "What are you looking to do with our platform?",
    key: "goals",
    options: [
      { label: "Journal activities", value: "journal" },
      { label: "Analyze performance", value: "analyze" },
      { label: "Backtest strategies", value: "backtest" },
      { label: "Learn with University", value: "learn" },
    ],
    type: "multi",
  },
  {
    title: "How did you hear about us?",
    key: "source",
    options: [
      { label: "Twitter (X)", value: "twitter" },
      { label: "Instagram", value: "instagram" },
      { label: "YouTube", value: "youtube" },
      { label: "TikTok", value: "tiktok" },
      { label: "Discord", value: "discord" },
      { label: "Reddit", value: "reddit" },
      { label: "Google", value: "google" },
      { label: "Community / Mentorship", value: "community" },
      { label: "From a friend", value: "friend" },
      { label: "Other", value: "other" },
    ],
    type: "single",
  },
];

const OnboardingPage = ({ userId }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useAuth();

  const currentStep = steps[step];

  const handleSelect = (value) => {
    if (currentStep.type === "single") {
      setData((prev) => ({ ...prev, [currentStep.key]: value }));
    } else {
      setData((prev) => {
        const prevValues = prev[currentStep.key] || [];
        return prevValues.includes(value)
          ? {
              ...prev,
              [currentStep.key]: prevValues.filter((v) => v !== value),
            }
          : { ...prev, [currentStep.key]: [...prevValues, value] };
      });
    }
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      try {
        setSaving(true);
        await setDoc(
          doc(db, FIREBASE_ENDPOINTS.USER_AUTH, userId),
          {
            onboardingData: { ...data },
            onboardingCompleted: true,
          },
          { merge: true }
        );
        setCurrentUser({
          ...currentUser,
          onboardingData: { ...data },
          onboardingCompleted: true,
        });
        toast.success("Onboarding completed successfully!");
        navigate(GENERAL_ROUTES.HOME_MAIN);
      } catch (error) {
        setSaving(false);
        toast.error("Failed to save onboarding data.");
      }
    }
  };

  const isSelected = (value) => {
    const selected = data[currentStep.key];
    return Array.isArray(selected)
      ? selected.includes(value)
      : selected === value;
  };

  // Redirect if onboarding is already completed
  useEffect(() => {
    if (currentUser?.onboardingCompleted) {
      navigate(GENERAL_ROUTES.HOME_MAIN);
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-6">{currentStep.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
        {currentStep.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`p-4 rounded-xl border transition ${
              isSelected(option.value)
                ? "bg-indigo-100 border-indigo-500"
                : "bg-white border-gray-300 hover:border-indigo-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-8 w-full max-w-xl">
        <GlobalButton
          btnTitle={
            saving
              ? "Saving..."
              : step === steps.length - 1
              ? "Finish"
              : "Continue"
          }
          disabled={
            saving ||
            !data[currentStep.key] ||
            data[currentStep.key].length === 0
          }
          onButtonClickHandler={handleNext}
          bgColor="bg-indigo-500"
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
