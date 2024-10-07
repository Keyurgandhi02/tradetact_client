import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import { GENERAL_DELETE_ERROR } from "../../constants/Strings";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import NoRecordFound from "../NoRecordFound";
import {
  deleteFirebaseData,
  getFirebaseData,
} from "../../config/firestoreOperations";
import { useLoading } from "../../context/LoadingContext";
import { DELETE_SVG, EDIT_SVG } from "../../assets/svgIcons";
import { formatDateToDDMMYY } from "../../config/helper";
import ModalDialog from "../ModalDialog";
import GeneralModalContent from "../GeneralModalContent";
import PageHeader from "../PageHeader";
import { TRADING_STRATEGY_ROUTES } from "../../constants/routesConstants";

function ManageTradingStrategy() {
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
    navigate(`${TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_EDIT}/${id}`);
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
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-4 mt-5">
            {fetchedData.map((data) => (
              <div
                key={data?.id}
                className="rounded-sm shadow-lg p-4 border-[0.6px] border-gray-500 w-full md:w-104 lg:w-114 h-auto md:h-68 lg:h-68 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-bold text-lg text-black-dark-400 dark:text-whiten truncate">
                      {data?.label ? data?.label : "NA"}
                    </h4>
                  </div>
                  <span className="font-semibold text-xs text-black-dark-300 dark:text-whiten">
                    {data?.doc_created_At &&
                      formatDateToDDMMYY(data?.doc_created_At.toDate())}
                  </span>
                </div>

                <div className="border-b dark:border-black-dark-300 border-gray-500 my-3"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <button
                      className="hover:text-red-600 dark:hover:text-red-600 text-black-dark-400 dark:text-white px-2 focus:outline-none border-none"
                      onClick={() => deleteHandler(data?.id)}
                    >
                      <DELETE_SVG />
                    </button>
                    <button
                      className="hover:text-green-600 dark:hover:text-green-600 text-black-dark-400 dark:text-white px-2 focus:outline-none border-none"
                      onClick={() => editHandler(data?.id)}
                    >
                      <EDIT_SVG />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
       
        </>
      ) : (
        <NoRecordFound
          heading="You do not have any trading strategy. Tap on plus ( + ) icon to add strategy in the trading strategy list."
          handleSubmit={() =>
            navigate(TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_CREATE)
          }
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

export default ManageTradingStrategy;
