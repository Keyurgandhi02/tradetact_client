import React from "react";

function PageHeading({ title, isListPage }) {
  return (
    <div className={`${isListPage ? "px-0" : "px-2 md:px-4 xl:px-2"} py-2`}>
      <h3
        className={`${
          isListPage ? "text-2xl" : "text-2xl"
        } font-bold text-primary-200`}
      >
        {title}
      </h3>
    </div>
  );
}

export default PageHeading;
