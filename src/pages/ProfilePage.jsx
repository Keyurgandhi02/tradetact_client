import React, { useContext, useState } from "react";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import { DashboardContext } from "../context/DashboardContext";

function ProfilePage() {
  const { currentUser } = useAuth();
  const { journalData, fetchedBroker, fetchedStrategy, isUserData } =
    useContext(DashboardContext);

  const [isJournalData] = useState(journalData.length || 0);
  const [isBrokerData] = useState(fetchedBroker.length || 0);
  const [isStrategyData] = useState(fetchedStrategy.length || 0);

  return (
    <>
      <UserProfile
        userData={isUserData}
        currentUser={currentUser}
        fetchedJournalData={isJournalData}
        fetchedBroker={isBrokerData}
        fetchedStrategy={isStrategyData}
      />
    </>
  );
}

export default ProfilePage;
