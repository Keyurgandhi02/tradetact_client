import React from "react";
import { refreshPage } from "../config/helper";
import GlobalButton from "./GlobalButton";

function NoInternetConnection() {
  return (
    <div className="bg-black-dark-100 w-screen h-screen">
      <div className="justify-center flex items-center">
        <h1 className="text-5xl mt-50 p-1 text-whiten">Whoops! ☹️</h1>
      </div>
      <span className="text-lg justify-center flex mt-10 p-1 text-primary-300">
        No Internet Connection found.
      </span>
      <span className="text-lg justify-center flex p-1 text-primary-300">
        Check your connection or try again.
      </span>
      <div className="w-50 mx-auto basis-1/4 flex flex-col items-center justify-center p-10">
        <GlobalButton
          btnTitle="Try again!"
          disabled={false}
          type="button"
          onButtonClickHandler={refreshPage}
          bgColor="bg-primary-500"
        />
      </div>
    </div>
  );
}

export default NoInternetConnection;
