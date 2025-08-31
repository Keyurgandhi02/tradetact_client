import React from "react";
import GlobalButton from "./GlobalButton";

function NoRecordFound({
  heading,
  handleSubmit,
  btnTitle,
  isSmallSize,
  isButtonVisible,
}) {
  return (
    <div
      className={`flex-grow flex flex-col justify-center items-center overflow-hidden ${
        isSmallSize ? "mt-5" : "mt-20"
      }`}
    >
      <img
        className={` ${
          isSmallSize ? "w-24 h-24" : "w-55 h-55"
        } mx-auto dark:text-gray text-black-dark-300`}
        src={process.env.REACT_APP_FIREBASE_APP_NO_RECORD_IMAGE_URL}
        alt="No Record Found"
      />
      <h3
        className={`font-medium mt-10 p-3 ${
          isSmallSize ? "text-lg text-center" : "text-lg text-center"
        } text-black-dark-400 dark:text-whiten`}
      >
        {heading}
      </h3>

      {isButtonVisible && (
        <div className={`w-[200px] p-5 ${isSmallSize ? "mt-0" : "mt-5"}`}>
          <GlobalButton
            btnTitle={btnTitle}
            disabled={false}
            type="submit"
            onButtonClickHandler={handleSubmit}
            bgColor="bg-primary"
          />
        </div>
      )}
    </div>
  );
}

export default NoRecordFound;
