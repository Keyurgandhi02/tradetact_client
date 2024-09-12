import React from "react";
import { DOWNLOAD_SVG } from "../UI/GlobalSVG";

function SearchBar({ downloadHandler, onChangeHandler }) {
  return (
    <div className="flex flex-wrap items-center p-3 mt-4 shadow-lg space-x-2">
      <div className="flex flex-grow space-x-2 text-whiten">
        <input
          className="bg-transparent border-[1.5px] border-gray-500 focus:border-primary outline-none text-whiten flex-grow min-w-0 p-3 rounded-md"
          type="text"
          placeholder="Search..."
          onChange={(e) => onChangeHandler(e.target.value)}
        />
      </div>

      <div className="flex space-x-2">
        {/* <div
         
          className="flex py-3 px-2 rounded-md text-gray-500 hover:bg-primary-400 text-whiten hover:text-black-dark-200 cursor-pointer"
        >
          <FILTER_DOWN_SVG />
        </div>
        <div className="flex py-3 px-2 rounded-md text-gray-500 hover:bg-primary-300 text-whiten hover:text-black-dark-200 cursor-pointer">
          <FILTER_UP_SVG />
        </div> */}
        <div
          onClick={downloadHandler}
          className="flex py-3 px-2 rounded-md text-gray-500 hover:bg-primary-300 text-whiten hover:text-black-dark-200 cursor-pointer"
        >
          <DOWNLOAD_SVG />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
