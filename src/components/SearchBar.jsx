import React from "react";
import { SEARCH_SVG } from "../UI/GlobalSVG";

function SearchBar({ searchValue, onChangeHandler }) {
  return (
    <div className="relative flex items-center mt-4 md:mt-0">
      <span className="absolute">
        <SEARCH_SVG />
      </span>
      <input
        type="text"
        placeholder="Search...."
        value={searchValue}
        onChange={(e) => onChangeHandler(e.target.value)}
        className="block py-3 pr-5 bg-transparent border-[1.5px] border-gray-500 focus:border-primary outline-none text-whiten flex-grow pl-11 rtl:pr-11 rtl:pl-5 rounded-sm"
      />
    </div>
  );
}

export default SearchBar;
