import React from "react";
import "./AddJournalForm.css";

function GlobalInput({
  inputType,
  placeholder,
  isValue,
  onChangeHandler,
  name,
}) {
  const handleChange = (e) => {
    onChangeHandler(name, e.target.value);
  };

  return (
    <input
      type={inputType}
      placeholder={placeholder}
      value={isValue}
      name={name}
      onChange={handleChange}
    />
  );
}

export default GlobalInput;
