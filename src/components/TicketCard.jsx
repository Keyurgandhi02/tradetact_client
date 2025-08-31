import React from "react";
import { convertFirebaseTimestamp, convertToUpperCase } from "../config/helper";

const TicketCard = ({ date, id, status, message }) => {
  return (
    <div className="bg-transparent p-4 rounded-sm border-[0.6px] border-gray-500  shadow-md m-2">
      <div className="flex justify-between items-center mb-2">
        <p className="text-black-dark-400 dark:text-whiten text-sm">
          {date && convertFirebaseTimestamp(date?.seconds, date?.nanoseconds)}
        </p>

        <div className="flex items-center space-x-2">
          <span className="bg-main_color text-whiten px-2 py-1 text-xs rounded-full font-semibold">
            {convertToUpperCase(status)}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 text-black-dark-400 dark:text-whiten p-3 mt-4 rounded-lg">
        {message}
      </div>
    </div>
  );
};

export default TicketCard;
