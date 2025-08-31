import React from "react";

function GlobalInput({
  inputType,
  isValue,
  onChangeHandler,
  name,
  placeholder,
  disabledStatus,
  errors,
}) {
  const handleChange = (e) => {
    onChangeHandler(name, e.target.value);
  };

  const handleWheel = (e) => {
    e.target.blur(); // This prevents scrolling
  };

  return (
    <div className="mb-4.5 text-black-dark-400 dark:text-whiten w-full">
      <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
        {placeholder}
      </label>
      <input
        type={inputType}
        name={name}
        value={isValue}
        disabled={disabledStatus}
        onChange={handleChange}
        style={{ MozAppearance: "textfield" }}
        onWheel={handleWheel}
        className="dark:placeholder-white placeholder-black-dark-400 w-full rounded bg-transparent border-[1.2px] border-gray-500 px-5 py-3 font-normal text-black-dark-400 dark:text-whiten outline-none transition focus:border-main_color active:border-main_color disabled:cursor-default disabled:bg-gray dark:disabled:bg-slate-600 disabled:border-none dark:focus:border-main_color"
      />
      {errors && (
        <span className="text-main_red_color text-xs my-2 block">{errors}</span>
      )}
    </div>
  );
}

export default GlobalInput;
