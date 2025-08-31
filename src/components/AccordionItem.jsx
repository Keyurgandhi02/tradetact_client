import React from "react";

const AccordionItem = ({ index, isOpen, title, content, toggleItem, data }) => {
  return (
    <div className="border-[0.6px] border-gray-500">
      <h2 id={`accordion-collapse-heading-${index}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-10 font-medium text-gray-500  bg-transparent border-none focus:outline-none rounded-sm text-black-dark-400 dark:text-whiten dark:hover:bg-black-dark-200 hover:bg-light_hover_color  gap-3"
          onClick={() => toggleItem(index)}
          aria-expanded={isOpen}
          aria-controls={`accordion-collapse-body-${index}`}
        >
          <span>{title}</span>
          <svg
            className={`w-3 h-3 shrink-0 ${!isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id={`accordion-collapse-body-${index}`}
        className={`${isOpen ? "block" : "hidden"}`}
        aria-labelledby={`accordion-collapse-heading-${index}`}
      >
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-2 text-gray-500 dark:text-gray-400">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
