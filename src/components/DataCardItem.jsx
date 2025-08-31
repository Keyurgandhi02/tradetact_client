import React from "react";

function DataCardItem({ title, data }) {
  return (
    <div>
      <p className="text-sm font-semibold text-black-dark-400 dark:text-whiten mb-1">
        {title}
      </p>
      <p className="text-sm font-normal text-black-dark-300 dark:text-whiten">
        {data ? data : "NA"}
      </p>
    </div>
  );
}

export default DataCardItem;
