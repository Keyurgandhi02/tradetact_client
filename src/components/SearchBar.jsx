import React from "react";
import { SEARCH_SVG } from "../assets/svgIcons";

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
        className="dark:placeholder-white placeholder-black-dark-400 block py-3 pr-5 bg-transparent border-[1px] border-gray-500 focus:border-main_color outline-none text-black-dark-400 dark:text-whiten flex-grow pl-11 rtl:pr-11 rtl:pl-5 rounded-sm"
      />
    </div>
  );
}

export default SearchBar;
