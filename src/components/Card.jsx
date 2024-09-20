import React from "react";

function Card({ icon, value, heading }) {
  return (
    <div className="relative flex flex-col min-w-0 mb-6 break-words border border-secondary shadow-soft-xl rounded-md bg-clip-border">
      <div className="flex-auto p-5">
        <div className="flex flex-wrap -mx-3">
          <div className="flex-none max-w-full px-3 h-20 sm:h-22">
            <div className="mt-2">
              <p className="mb-4 font-sans font-semibold leading-normal text-md text-gray-500">
                {heading}
              </p>
              <h5 className="mb-0 font-bold text-primary mt-1 text-xl">
                {value}
              </h5>
            </div>
          </div>
          {/* <div className="w-4/10 max-w-full  ml-auto text-right flex-0">
            <div className="inline-block items-center justify-center w-10 h-10">
              <div className="text-lg text-center text-secondary">{icon}</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Card;
