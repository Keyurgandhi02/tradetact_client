import React from "react";
import GloablInfo from "../components/GloablInfo";

function NotFound404Page() {
  return (
    <div className="flex flex-col justify-center items-center">
      <GloablInfo
        firstTitle="404"
        secondTitle="Page not found"
        desc=" Sorry, we couldn’t find the page you’re looking for."
        linktitle="Go back home"
        link="/"
      />
    </div>
  );
}

export default NotFound404Page;
