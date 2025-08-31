import React from "react";
import { DROPDOWN_SVG } from "../assets/svgIcons";

function GlobalDropdown({ label, errors, children }) {
  return (
    <div className="mb-4.5 w-full">
      <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
        {label}
      </label>
      <div className="relative z-1 bg-transparent">
        {children}
        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-black-dark-400 dark:text-whiten">
          <DROPDOWN_SVG />
        </span>
      </div>
      {errors && (
        <span className="text-main_red_color text-xs my-2 block">{errors}</span>
      )}
    </div>
  );
}

export default GlobalDropdown;
