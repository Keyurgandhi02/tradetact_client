import React from "react";
import { DOWNLOAD_SVG } from "../UI/GlobalSVG";
import ActionsButton from "./ActionsButton";
import SearchBar from "./SearchBar";

function PageHeaderActions({ onChangeHandler, downloadHandler, searchValue }) {
  return (
    <div className="md:flex md:items-center md:justify-between px-5">
      <div className="md:w-100 w-auto py-1 items-center ">
        <SearchBar
          onChangeHandler={onChangeHandler}
          searchValue={searchValue}
        />
      </div>

      <div className="flex items-center gap-x-3 h-14 mt-4 md:mt-0">
        <div className="w-40 mt-1"></div>
        <ActionsButton
          icon={<DOWNLOAD_SVG />}
          label="Download"
          onClickHandler={downloadHandler}
        />
      </div>
    </div>
  );
}

export default PageHeaderActions;
