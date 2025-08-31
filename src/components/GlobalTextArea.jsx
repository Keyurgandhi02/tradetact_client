import React from "react";

function GlobalTextArea({
  isValue,
  onChangeHandler,
  row,
  label,
  name,
  placeholder,
  errors,
}) {
  const handleChange = (e) => {
    onChangeHandler(name, e.target.value);
  };

  return (
    <div className="mb-4.5">
      <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
        {placeholder}
      </label>
      <textarea
        rows={row}
        name={name}
        value={isValue}
        onChange={handleChange}
        className="dark:placeholder-white bg-transparent placeholder-black-dark-400 w-full rounded border-[1.2px]  border-gray-500  px-5 py-3 font-normal text-black-dark-400 dark:text-whiten outline-none transition focus:border-main_color active:border-main_color disabled:cursor-default disabled:bg-whiter"
      ></textarea>
      {errors && (
        <span className="text-main_red_color text-xs my-2 block">{errors}</span>
      )}
    </div>
  );
}

export default GlobalTextArea;
