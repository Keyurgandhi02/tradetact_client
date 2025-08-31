import React from "react";
import PageHeading from "../components/PageHeading";
import UpdateInfoCard from "../components/UpdateInfoCard";

function UpdatesPage() {
  return (
    <>
      <div className="flex flex-col gap-9 p-10">
        <PageHeading title="Market Updates" />
        <div className="rounded-lg shadow-xl ">
          <UpdateInfoCard />
        </div>
      </div>
    </>
  );
}

export default UpdatesPage;
