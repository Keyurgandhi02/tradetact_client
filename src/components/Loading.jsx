import React from "react";
import { useLoading } from "../store/LoadingContext";

function Loading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed left-0 top-0 z-50 block h-full w-full bg-black-dark-100 opacity-65">
      <span className="r-4 relative top-1/2 mx-auto my-0 block h-0 w-0 text-green-500 opacity-75">
        <div role="status">
          <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div className="w-20 h-20 border-6 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
              <div className="w-16 h-16 border-6 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </span>
    </div>
  );
}

export default Loading;
