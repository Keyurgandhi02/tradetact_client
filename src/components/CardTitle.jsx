import React from "react";

function CardTitle({ title }) {
  return (
    <h4 className="mb-3 mt-2 text-lg font-medium text-black-dark-200 dark:text-whiten">
      {title}
    </h4>
  );
}

export default CardTitle;
