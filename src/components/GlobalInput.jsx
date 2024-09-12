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
    <div class="mb-4.5 text-whiten w-full">
      <label class="mb-3 block text-sm font-semibold text-whiten">
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
        className="w-full rounded border-[1.5px] border-black-dark-300 bg-transparent px-5 py-3 font-normal text-whiten outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-black-dark-300 disabled:border-none dark:focus:border-primary"
      />
      {errors && (
        <span className="text-red-500 text-xs my-3 block">{errors}</span>
      )}
    </div>
  );
}

export default GlobalInput;
