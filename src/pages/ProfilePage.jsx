import React, { useCallback, useContext, useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
import { getAuth } from "firebase/auth";
import { DashboardContext } from "../context/DashboardContext";
import ModalDialog from "../components/ModalDialog";
import { getFirebaseData } from "../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { useLoading } from "../context/LoadingContext";
import TicketCard from "../components/TicketCard";
import { useNavigate } from "react-router-dom";
import { APP } from "../constants/Strings";
import {
  calculateDaysBetween,
  formatDateDD,
  formatNumber,
} from "../config/helper";
import { CONTACT_US_ROUTES } from "../constants/routesConstants";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const auth = getAuth();
  const {
    journalData,
    fetchedBroker,
    fetchedStrategy,
    isUserData,
    planStatus,
    subscriptionData,
  } = useContext(DashboardContext);
  const [isViewContactModal, setViewContactModal] = useState(false);
  const [isViewMembershipModal, setViewMembershipModal] = useState(false);
  const [isViewUserDetailsModal, setViewUserDetailsModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Fetch data function
  const fetchData = useCallback(async () => {
    const fetchedTasks = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      FIREBASE_ENDPOINTS.CONTACT_US_DATA,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At",
      true
    );

    setFetchedData(fetchedTasks);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ViewModal Handler
  const viewModalHandler = (status, title) => {
    if (title === "Your Membership") {
      setViewMembershipModal(status);
    } else if (title === "Your Tickets") {
      setViewContactModal(status);
    } else if (title === "Your Details") {
      setViewUserDetailsModal(status);
    } else {
      navigate(CONTACT_US_ROUTES.CONTACT);
    }
  };
  console.log("currentUser", currentUser);
  return (
    <>
      <UserProfile
        userData={isUserData}
        currentUser={auth.currentUser}
        fetchedJournalData={journalData}
        fetchedBroker={fetchedBroker}
        fetchedStrategy={fetchedStrategy}
        viewModalHandler={viewModalHandler}
      />

      <div className="fixed bottom-8 right-6">
        {/* Contact Modal */}
        <ModalDialog
          isOpen={isViewContactModal}
          onClose={() => setViewContactModal(false)}
          children={
            <div className="p-12">
              {fetchedData.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                  {fetchedData?.map((item, index) => (
                    <TicketCard
                      key={index}
                      date={item?.doc_created_At}
                      id={item?.id}
                      status={item?.status}
                      message={item?.message}
                    />
                  ))}
                </div>
              ) : (
                <h2 className="text-center text-xl font-semibold text-black-dark-400 dark:text-whiten">
                  No open tickets!
                </h2>
              )}
            </div>
          }
        />

        {/* User Details Modal */}
        <ModalDialog
          isOpen={isViewUserDetailsModal}
          onClose={() => setViewUserDetailsModal(false)}
          children={
            <div className="p-12">
              <h2 className="font-bold text-2xl text-center text-black-dark-400 dark:text-whiten">
                Hey {currentUser?.displayName}!{" "}
              </h2>

              <div className="flex flex-row justify-between items-center mt-5">
                <Grid
                  title="Mobile"
                  value={currentUser?.mobile ? currentUser?.mobile : "N/A"}
                />
                <Grid
                  title="Experience"
                  value={
                    currentUser?.onboardingData?.experience
                      ? currentUser?.onboardingData?.experience
                      : "N/A"
                  }
                />
              </div>
            </div>
          }
        />

        {/* Membership Modal */}
        <ModalDialog
          isOpen={isViewMembershipModal}
          onClose={() => setViewMembershipModal(false)}
          children={
            <div className="p-12">
              <h2 className="font-bold text-xl text-center text-black-dark-400 dark:text-whiten">
                Hey {auth.currentUser?.displayName}!{" "}
                <span className="text-main_color">{APP.name} One </span>{" "}
                Membership is {planStatus}!
              </h2>

              {planStatus === "active" && (
                <>
                  <div className="flex flex-row justify-between items-center mt-10">
                    <Grid
                      title="Started On"
                      value={formatDateDD(subscriptionData?.purchaseTimestamp)}
                    />

                    <Grid
                      title="Valid Up To"
                      value={formatDateDD(subscriptionData?.expirationDate)}
                    />

                    <Grid
                      title="Plan days"
                      value={calculateDaysBetween(
                        subscriptionData?.purchaseTimestamp,
                        subscriptionData?.expirationDate
                      )}
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center mt-10">
                    <Grid
                      title="Plan Duration"
                      value={`${subscriptionData?.subscription?.planDetails?.planDurationMonth} Month`}
                    />

                    <Grid
                      title="Plan"
                      value={
                        subscriptionData?.subscription?.planDetails?.planName
                      }
                    />

                    <Grid
                      title="Plan Price"
                      value={formatNumber(
                        subscriptionData?.subscription?.planDetails?.planPrice
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          }
        />
      </div>
    </>
  );
}

export default ProfilePage;

const Grid = ({ title, value }) => {
  return (
    <div className="flex flex-col px-3 text-center w-[150px]">
      <span className="font-semibold text-black-dark-400 dark:text-whiten text-md mb-2">
        {title}
      </span>
      <span className="font-medium text-black-dark-400 dark:text-whiten text-sm">
        {value}
      </span>
    </div>
  );
};
