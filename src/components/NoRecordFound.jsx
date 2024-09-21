import React from "react";
import GlobalButton from "./GlobalButton";

function NoRecordFound({ heading, handleSubmit, btnTitle, isSmallSize }) {
  return (
    <div
      className={`flex-grow flex flex-col justify-center items-center overflow-hidden ${
        isSmallSize ? "mt5-5" : "mt-20"
      }`}
    >
      <img
        className={` ${isSmallSize ? "w-24 h-24" : "w-55 h-55"} mx-auto`}
        src="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/undraw_void_-3-ggu.svg?alt=media&token=bb2f9e79-e856-4e55-86e7-0c4e58cf80db"
        alt="No Record Found!"
      ></img>
      <h3
        className={`font-medium mt-10 ${
          isSmallSize ? "text-sm text-center" : "text-xl"
        } text-primary-300`}
      >
        {heading}
      </h3>
      <div className={`w-[200px] p-5 ${isSmallSize ? "mt-0" : "mt-5"}`}>
        <GlobalButton
          btnTitle={btnTitle}
          disabled={false}
          type="submit"
          onButtonClickHandler={handleSubmit}
          bgColor="bg-primary-400"
        />
      </div>
    </div>
  );
}

export default NoRecordFound;
