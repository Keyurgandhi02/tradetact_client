import React from "react";
import { formatTimestamp } from "../config/helper";
import { APP_USER_AVATAR } from "../assets/svgIcons";

function UserProfile({
  userData,
  currentUser,
  fetchedJournalData,
  fetchedBroker,
  fetchedStrategy,
}) {
  const formattedDate = formatTimestamp(currentUser?.metadata?.createdAt);

  return (
    <section className="p-5 ">
      <div class="w-full px-4 mx-auto">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6">
          <div class="px-6">
            <div class="flex flex-wrap justify-center">
              <div class="w-full px-4 flex justify-center">
                <div class="relative">
                  <img
                    alt="USER"
                    src={APP_USER_AVATAR}
                    class="h-28 w-28 rounded-full mt-10"
                  />
                </div>
              </div>
              <div class="w-full px-4 text-center mt-10">
                <div class="flex justify-center pb-4">
                  <StatesItem title="Broker" value={fetchedBroker} />
                  <StatesItem title="Strategy" value={fetchedStrategy} />
                  <StatesItem title="Trade" value={fetchedJournalData} />
                </div>
              </div>
            </div>
            <div class="text-center mt-12">
              <h3 class="text-2xl font-semibold leading-normal text-black-dark-400 dark:text-whiten mb-2">
                {currentUser?.displayName}
              </h3>
              <div class="text-sm leading-normal mt-0 mb-2 text-black-dark-400 dark:text-whiten font-bold">
                <i class="fas fa-map-marker-alt mr-2 text-xl text-black-dark-400 dark:text-whiten"></i>
                {currentUser?.email} -
                <span className="text-md ml-1 text-sky-500">
                  {currentUser?.emailVerified && "(Verified)"}
                </span>
              </div>
              <div class="text-sm leading-normal mt-0 mb-2 text-black-dark-400 dark:text-whiten font-bold">
                <i class="fas fa-map-marker-alt mr-2 text-xl text-black-dark-400 dark:text-whiten"></i>
                {userData?.mobile}
              </div>
            </div>
            <div className="border-b dark:border-black-dark-300 border-gray-500 my-10"></div>
            <div class="text-center">
              <span className="font-semibold text-main_color pl-6 pr-3 w-full block">
                Joined on {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;

const StatesItem = ({ title, value }) => {
  return (
    <div class="mr-4 p-3 text-center">
      <span class="text-2xl font-bold block uppercase tracking-wide text-main_color">
        {value}
      </span>
      <span class="text-lg text-black-dark-400 dark:text-whiten font-semibold uppercase">
        {title}
      </span>
    </div>
  );
};
