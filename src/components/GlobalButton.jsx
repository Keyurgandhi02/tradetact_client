import React from "react";

function GlobalButton({
  btnTitle,
  disabled,
  type,
  onButtonClickHandler,
  bgColor,
  textColor,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex w-full justify-center rounded ${bgColor} p-3 font-semibold text-black-dark-400 hover:bg-opacity-90 ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-gray-400"
          : "focus:ring-2 focus:ring-primary-500"
      }`}
      onClick={onButtonClickHandler}
    >
      {btnTitle}
    </button>
  );
}

export default GlobalButton;
