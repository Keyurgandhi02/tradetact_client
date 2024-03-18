import React from "react";

function GlobalInput({
  inputType,
  placeholder,
  isValue,
  onChangeHandler,
  name,
  className
}) {
  const handleChange = (e) => {
    onChangeHandler(name, e.target.value);
  };

  return (
    <input
      className={className}
      type={inputType}
      placeholder={placeholder}
      value={isValue}
      name={name}
      onChange={handleChange}
    />
  );
}

export default GlobalInput;
