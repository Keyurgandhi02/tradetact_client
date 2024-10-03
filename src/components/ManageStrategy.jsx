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
import { DELETE_SVG, EDIT_SVG } from "../UI/GlobalSVG";
import { formatDateToDDMMYY } from "../config/helper";
import ModalDialog from "./ModalDialog";
import GeneralModalContent from "./GeneralModalContent";
import PageHeader from "./PageHeader";

function ManageStrategy() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);

  // Fetch Strategy
  const fetchData = useCallback(async () => {
    const fetchedTasks = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      currentUser.uid,
      FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
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

  // Strategy Delete Handler
  const confirmDeleteHandler = async () => {
    if (!selectedDocumentId) {
      toast.error(GENERAL_DELETE_ERROR);
      return;
    }

    try {
      await deleteFirebaseData(
        FIREBASE_ENDPOINTS.MASTER_DATA,
        currentUser.uid,
        FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
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

  // Strategy Edit Handler
  const editHandler = (id) => {
    navigate(`/edit_user_strategy/${id}`);
  };

  // Fetch Strategies
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  return (
    <div className="md:mb-0 mb-12">
      <PageHeader
        pageTitle="Trading Strategy"
        isListPage={true}
        firstData={totalDocuments}
        firstDataTitle="Strategy"
        secondData={fetchedData.length}
        secondSubData={totalDocuments}
      />

      {fetchedData.length > 0 ? (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-4 mt-3">
            {fetchedData.map((data) => (
              <div
                key={data?.id}
                className="rounded-sm shadow-md p-4 bg-black-dark-400 w-full md:w-104 lg:w-114 h-auto md:h-68 lg:h-68 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-bold text-lg text-whiten truncate">
                      {data?.label ? data?.label : "NA"}
                    </h4>
                  </div>
                  <span className="font-semibold text-xs text-whiten">
                    {data?.doc_created_At &&
                      formatDateToDDMMYY(data?.doc_created_At.toDate())}
                  </span>
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
          heading="You do not have any trading strategy. Tap on plus ( + ) icon to add strategy in the trading strategy list."
          handleSubmit={() => navigate("/create_user_strategy")}
          btnTitle="Add Strategy"
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
    </div>
  );
}

export default ManageStrategy;
