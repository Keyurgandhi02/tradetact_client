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
        src="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/undraw_no_data_re_kwbl.svg?alt=media&token=015945c1-3372-4968-9ffe-941a3cb5b37b"
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
