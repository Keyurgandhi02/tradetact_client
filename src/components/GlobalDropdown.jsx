import React from "react";
import { DROPDOWN_SVG } from "../UI/GlobalSVG";

function GlobalDropdown({
  label,
  options,
  formData,
  selectDropDownHandler,
  name,
  errors,
}) {
  return (
    <div className="mb-4.5 w-full">
      <label class="mb-3 block text-sm font-semibold text-whiten">
        {label}
      </label>
      <div className="relative z-1 bg-transparent">
        <select
          className="relative z-2 w-full appearance-none rounded border text-whiten border-black-dark-300 bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary"
          onChange={(e) => selectDropDownHandler(name, e.target.value)}
          value={formData}
        >
          <option value="" disabled>
            {label}
          </option>
          {options?.map((item) => (
            <option key={item.id} value={item.label} className="text-whiten">
              {item.label}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-whiten">
          <DROPDOWN_SVG />
        </span>
      </div>
      {errors && (
        <span className="text-red-500 text-xs my-3 block">{errors}</span>
      )}
    </div>
  );
}

export default GlobalDropdown;
