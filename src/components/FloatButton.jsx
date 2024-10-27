import React from "react";

function FloatButton({ onClickHandler, icon, label }) {
  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={onClickHandler}
        className="bg-secondary hover:bg-opacity-95 dark:text-whiten text-black-dark-400 font-bold py-4 px-4 rounded-2xl shadow-lg"
      >
        {icon ? icon : label}
      </button>
    </div>
  );
}

export default FloatButton;
