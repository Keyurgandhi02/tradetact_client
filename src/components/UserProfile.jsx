import React from "react";
import { formatTimestamp } from "../config/helper";
import { APP_USER_AVATAR } from "../assets/svgIcons";
import ProfileCardItem from "./ProfileCardItem";

function UserProfile({
  userData,
  currentUser,
  fetchedJournalData,
  fetchedBroker,
  fetchedStrategy,
  viewModalHandler,
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
                  <StatesItem
                    title="Broker"
                    value={fetchedBroker ? fetchedBroker?.length : 0}
                  />
                  <StatesItem
                    title="Strategy"
                    value={fetchedStrategy ? fetchedStrategy?.length : 0}
                  />
                  <StatesItem
                    title="Trade"
                    value={fetchedJournalData ? fetchedJournalData?.length : 0}
                  />
                </div>
              </div>
            </div>
            <div class="text-center mt-5">
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
                {currentUser?.mobile}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-5">
              <div className="col-span-1">
                <ProfileCardItem
                  viewModalHandler={viewModalHandler}
                  title="Your Details"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      class="w-12 h-12"
                      fill="#00c805"
                      width="24"
                      height="24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="col-span-1">
                <ProfileCardItem
                  viewModalHandler={viewModalHandler}
                  title="Your Membership"
                  icon={
                    <svg
                      class="w-12 h-12"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#00c805"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  }
                />
              </div>

              <div className="col-span-1">
                <ProfileCardItem
                  title="Help & Support"
                  viewModalHandler={viewModalHandler}
                  icon={
                    <svg
                      class="w-12 h-12"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#00c805"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2a7 7 0 0 0-7 7 3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1V9a5 5 0 1 1 10 0v7.083A2.919 2.919 0 0 1 14.083 19H14a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 1.732-1h.351a4.917 4.917 0 0 0 4.83-4H19a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3 7 7 0 0 0-7-7Zm1.45 3.275a4 4 0 0 0-4.352.976 1 1 0 0 0 1.452 1.376 2.001 2.001 0 0 1 2.836-.067 1 1 0 1 0 1.386-1.442 4 4 0 0 0-1.321-.843Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="col-span-1">
                <ProfileCardItem
                  title="Your Tickets"
                  viewModalHandler={viewModalHandler}
                  icon={
                    <svg
                      class="w-12 h-12"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#00c805"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 5a2 2 0 0 0-2 2v2.5a1 1 0 0 0 1 1 1.5 1.5 0 1 1 0 3 1 1 0 0 0-1 1V17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2.5a1 1 0 0 0-1-1 1.5 1.5 0 1 1 0-3 1 1 0 0 0 1-1V7a2 2 0 0 0-2-2H4Z" />
                    </svg>
                  }
                />
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
