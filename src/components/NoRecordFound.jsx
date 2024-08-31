import React from "react";

function NoRecordFound() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center overflow-hidden mt-20">
      <img
        className="w-55 h-55 mx-auto"
        src="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/undraw_void_-3-ggu.svg?alt=media&token=bb2f9e79-e856-4e55-86e7-0c4e58cf80db"
        alt="No Record Found!"
      ></img>
      <h3 className="font-medium mt-10 text-2xl text-primary-300">
        No Record Found!
      </h3>
    </div>
  );
}

export default NoRecordFound;
