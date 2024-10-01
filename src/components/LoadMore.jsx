import React from "react";
import GlobalButton from "./GlobalButton";

function LoadMore({ handleLoadMore }) {
  return (
    <div className="w-50 mx-auto basis-1/4 flex flex-col items-center justify-center p-10">
      <GlobalButton
        btnTitle="Load More"
        disabled={false}
        type="button"
        onButtonClickHandler={handleLoadMore}
        bgColor="bg-primary-200"
      />
    </div>
  );
}

export default LoadMore;
