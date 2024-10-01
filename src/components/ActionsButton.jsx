import React from "react";

function ActionsButton({ icon, label, onClickHandler }) {
  return (
    <button
      className="flex items-center justify-center w-1/2 px-5 py-3 text-sm text-whiten hover:text-primary transition-colors duration-200 border-[1.5px] border-gray-500 hover:border-primary rounded-md gap-x-2 sm:w-auto"
      onClick={onClickHandler}
    >
      {icon}
      <span className="font-semibold text-md">{label}</span>
    </button>
  );
}

export default ActionsButton;
