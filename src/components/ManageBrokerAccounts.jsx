import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { GENERAL_DELETE_ERROR } from "../constants/Strings";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../store/AuthContext";
import NoRecordFound from "./NoRecordFound";
import {
  deleteFirebaseData,
  getFirebaseData,
} from "../config/firestoreOperations";
import { useLoading } from "../store/LoadingContext";
import { ADD_FLOAT_SVG, DELETE_SVG, EDIT_SVG } from "../UI/GlobalSVG";
import { formatDateToDDMMYY } from "../config/helper";
import ModalDialog from "./ModalDialog";
import GeneralModalContent from "./GeneralModalContent";
import PageHeader from "./PageHeader";
import FloatButton from "./FloatButton";

function ManageBrokerAccounts() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [fetchedData, setFetchedData] = useState([]);
  const { startLoading, stopLoading } = useLoading();
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);

  // Fetch Broker Accounts
  const fetchData = useCallback(async () => {
    const fetchedTasks = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      currentUser.uid,
      FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At"
    );
    setTotalDocuments(fetchedTasks.length);
    setFetchedData(fetchedTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.uid]);

  const deleteHandler = (documentId) => {
    setSelectedDocumentId(documentId);
    setDeleteModal(true);
  };

  // Broker Accounts Delete Handler
  const confirmDeleteHandler = async () => {
    if (!selectedDocumentId) {
      toast.error(GENERAL_DELETE_ERROR);
      return;
    }

    try {
      await deleteFirebaseData(
        FIREBASE_ENDPOINTS.MASTER_DATA,
        currentUser.uid,
        FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
        selectedDocumentId,
        startLoading,
        stopLoading
      );
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setDeleteModal(false);
      setSelectedDocumentId(null);
      fetchData();
    }
  };

  const cancelDeleteHandler = () => {
    setDeleteModal(false);
    setSelectedDocumentId(null);
  };

  // Trade Journal Edit Handler
  const editHandler = (id) => {
    navigate(`/edit_broker_accounts/${id}`);
  };

  // Fetch Broker Accounts
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate("/create_broker_accounts");
  };

  return (
    <div className="md:mb-0 mb-12">
      <PageHeader
        pageTitle="Demat & Broker"
        isListPage={true}
        firstData={totalDocuments}
        firstDataTitle="Account"
        secondData={fetchedData.length}
        secondSubData={totalDocuments}
      />

      {fetchedData.length > 0 ? (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-4">
            {fetchedData.map((data) => (
              <div
                key={data?.id}
                className="rounded-lg shadow-lg p-4 bg-black-dark-400 w-full md:w-110 lg:w-120 h-auto md:h-68 lg:h-68 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-bold text-lg text-whiten truncate">
                      {data?.dematUser ? data?.dematUser : "NA"}
                    </h4>
                  </div>
                  <span className="font-semibold text-xs text-whiten">
                    {data?.doc_created_At &&
                      formatDateToDDMMYY(data?.doc_created_At.toDate())}
                  </span>
                </div>

                <div className="border-b border-black-dark-300 my-3"></div>

                <div className="h-[180px] overflow-y-auto no-scrollbar">
                  <table class="w-full md:table-fixed ">
                    <tbody>
                      {data?.consoleData?.map((item, index) => (
                        <tr>
                          <td className="px-4 text-base py-3 font-bold text-primary">
                            {index + 1}
                          </td>

                          <td className="whitespace-nowrap py-3 md:w-[284px]">
                            <div className="flex items-center">
                              <span className="text-primary font-bold">
                                {item?.label}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-b border-black-dark-300 my-3"></div>

                <div className="flex justify-between items-center">
                  <div className="text-gray-500">
                    <button
                      className="hover:text-red-600 px-2"
                      onClick={() => deleteHandler(data?.id)}
                    >
                      <DELETE_SVG />
                    </button>
                    <button
                      className="hover:text-green-600 px-2"
                      onClick={() => editHandler(data?.id)}
                    >
                      <EDIT_SVG />
                    </button>
                  </div>
                  <div className="text-right text-lg font-bold truncate text-green-500">
                    {data?.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Toaster position="top-right" reverseOrder={true} />
        </>
      ) : (
        <NoRecordFound
          heading="You do not have any broker account. Tap on plus ( + ) icon to add account in the broker list."
          handleSubmit={() => navigate("/create_broker_accounts")}
          btnTitle="Add Broker"
          isSmallSize={false}
        />
      )}

      <ModalDialog
        isOpen={isDeleteModal}
        onClose={cancelDeleteHandler}
        children={
          <GeneralModalContent
            heading="Are you sure you want to delete?"
            description="Once delete item you can not recover it!"
            onRejectHandler={cancelDeleteHandler}
            onSuccessHandler={confirmDeleteHandler}
            btnTitleReject="No"
            btnTitleSuccess="Yes"
          />
        }
      />
      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<ADD_FLOAT_SVG />}
      />
    </div>
  );
}

export default ManageBrokerAccounts;
