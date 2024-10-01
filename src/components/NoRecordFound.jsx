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
        } mx-auto text-gray`}
        src="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/undraw_void_-3-ggu.svg?alt=media&token=bb2f9e79-e856-4e55-86e7-0c4e58cf80db"
        alt="No Record Found"
      ></img>
      <h3
        className={`font-medium mt-10 p-3 ${
          isSmallSize ? "text-lg text-center" : "text-lg text-center"
        } text-primary-300`}
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
