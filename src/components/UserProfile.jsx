import React from "react";
import { Link } from "react-router-dom";
import { formatTimestamp } from "../config/helper";
import GlobalButton from "./GlobalButton";
import GlobalInput from "./GlobalInput";
import PageHeading from "./PageHeading";

// const initialState = {
//   email: "",
//   password: "",
//   name: "",
// };

function UserProfile({ userData, fetchedData }) {
  // const [formData, setFormData] = useState(initialState);
  const formattedDate = formatTimestamp(userData?.metadata?.createdAt);

  // Input Change Handler
  // const handleChange = (name, value) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  return (
    <div className="flex flex-col gap-9 p-4">
      <PageHeading title="My Profile" />
      <div className="rounded-md bg-black-dark-400">
        <form action="#" className="p-5">
          <GlobalInput
            inputType="text"
            placeholder="Name"
            isValue={userData?.displayName}
            name="name"
            disabledStatus={true}
            // onChangeHandler={handleChange}
          />

          <GlobalInput
            inputType="email"
            placeholder={
              <>
                Email
                <span className="text-sm ml-1 text-sky-500">
                  {userData?.emailVerified && "(Verified)"}
                </span>
              </>
            }
            isValue={userData?.email}
            name="email"
            disabledStatus={true}
            // onChangeHandler={handleChange}
          />

          <GlobalInput
            inputType="text"
            placeholder="Mobile"
            isValue={fetchedData?.mobile}
            name="username"
            disabledStatus={true}
            // onChangeHandler={handleChange}
          />

          <div className="flex mt-10">
            <GlobalButton
              btnTitle="Save"
              disabled={true}
              type="submit"
              bgColor="bg-primary-500"
              // onButtonClickHandler={handleSubmit}
            />
          </div>
        </form>

        <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-md">
          <span className="font-semibold border-t border-black-dark-300 text-primary-400 py-4 pl-6 pr-3 w-full block">
            Joined on {formattedDate}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center mt-10">
        <Link to="/">
          <img
            alt="Trade Tact"
            src="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Group%2026.png?alt=media&token=65626bef-8bff-49ba-bf7a-58f597935c41"
            className="h-12 w-auto"
          />
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <h2 className="text-sm text-gray-500">
          Copyright © 2024 TradeTact. All rights reserved.
        </h2>
      </div>
    </div>
  );
}

export default UserProfile;
