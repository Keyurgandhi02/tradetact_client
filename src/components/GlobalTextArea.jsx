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
      <label className="mb-3 block text-sm font-semibold text-whiten">
        {placeholder}
      </label>
      <textarea
        rows={row}
        name={name}
        value={isValue}
        onChange={handleChange}
        className="w-full rounded border-[1.5px] border-black-dark-300 bg-transparent px-5 py-3 font-normal text-whiten outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
      ></textarea>
      {errors && (
        <span className="text-red-500 text-xs my-3 block">{errors}</span>
      )}
    </div>
  );
}

export default GlobalTextArea;
