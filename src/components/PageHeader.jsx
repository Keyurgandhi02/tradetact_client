import React from "react";
import PageHeading from "./PageHeading";

function PageHeader({
  pageTitle,
  isListPage,
  firstData,
  firstDataTitle,
  secondData,
  secondSubData,
}) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between px-5 py-8">
      <div>
        <div className="flex items-center gap-x-3">
          <PageHeading title={pageTitle} isListPage={isListPage} />
          <span className="px-3 py-1 text-sm font-semibold dark:text-black-dark-400 bg-secondary rounded-full">
            {firstData} {firstDataTitle}
          </span>
        </div>

        <p className="mt-1 text-md text-black-dark-300 dark:text-whiten">
          {secondData} records showing out of {secondSubData}
        </p>
      </div>
    </div>
  );
}

export default PageHeader;
