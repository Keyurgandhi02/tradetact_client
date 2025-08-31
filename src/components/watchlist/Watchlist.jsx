import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  filterData,
  formatDateToDDMMYY,
  formatNumber,
} from "../../config/helper";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import { GENERAL_DELETE_ERROR } from "../../constants/Strings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getFirebaseData,
  deleteFirebaseData,
} from "../../config/firestoreOperations.js";
import NoRecordFound from "../NoRecordFound";
import { useLoading } from "../../context/LoadingContext";
import { DELETE_SVG, EDIT_SVG } from "../../assets/svgIcons.js";
import DataCardItem from "../DataCardItem";
import ModalDialog from "../ModalDialog";
import GeneralModalContent from "../GeneralModalContent";
import { handleExport } from "../ExportCSVButton";
import PageHeader from "../PageHeader";
import PageHeaderActions from "../PageHeaderActions";
import { WATCHLIST_ROUTES } from "../../constants/routesConstants.js";

function Watchlist() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [fetchedData, setFetchedData] = useState([]);
  const { startLoading, stopLoading } = useLoading();
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [filteredResults, setFilteredResults] = useState(fetchedData);

  // Fetch Watchlist
  const fetchData = useCallback(async () => {
    const fetchedTasks = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      
      FIREBASE_ENDPOINTS.USER_WATCHLIST,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At",
      true
    );
    setTotalDocuments(fetchedTasks.length);
    setFetchedData(fetchedTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.uid]);

  // Input Change Handler
  const onChangeHandler = (value) => {
    setSearchTerm(value);
  };

  const deleteHandler = (documentId) => {
    setSelectedDocumentId(documentId);
    setDeleteModal(true);
  };

  // Watchlist Delete Handler
  const confirmDeleteHandler = async () => {
    if (!selectedDocumentId) {
      toast.error(GENERAL_DELETE_ERROR);
      return;
    }

    try {
      await deleteFirebaseData(
        FIREBASE_ENDPOINTS.MASTER_DATA,
        currentUser.uid,
        FIREBASE_ENDPOINTS.USER_WATCHLIST,
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

  // Watchlist Edit Handler
  const editHandler = (id) => {
    navigate(`${WATCHLIST_ROUTES.WATCHLIST_EDIT}/${id}`);
  };

  // Fetch Watchlist
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Export CSV Handler
  const downloadHandler = () => {
    handleExport(fetchedData, "Watchlist");
  };

  // Serach Functionality
  useEffect(() => {
    setFilteredResults(filterData(fetchedData, searchTerm, "scriptName"));
  }, [searchTerm, fetchedData]);

  return (
    <div className="md:mb-0 mb-12">
      <PageHeader
        pageTitle="Watchlist"
        isListPage={true}
        firstData={totalDocuments}
        firstDataTitle="Stock"
        secondData={fetchedData.length}
        secondSubData={totalDocuments}
      />

      {fetchedData.length > 0 && (
        <PageHeaderActions
          onChangeHandler={onChangeHandler}
          downloadHandler={downloadHandler}
        />
      )}
      {filteredResults.length > 0 ? (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-4 mt-5">
            {filteredResults.map((data) => (
              <div
                key={data?.id}
                className="rounded-sm shadow-lg p-4 border-[0.6px] border-gray-500 w-full md:w-104 lg:w-114 h-auto md:h-68 lg:h-68 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-bold text-lg text-black-dark-400 dark:text-whiten truncate">
                      {data?.scriptName ? data?.scriptName : "NA"}
                    </h4>
                  </div>
                  <span className="font-semibold text-xs text-black-dark-300 dark:text-whiten">
                    {data?.doc_created_At &&
                      formatDateToDDMMYY(data?.doc_created_At.toDate())}
                  </span>
                </div>
                <div className="border-b dark:border-black-dark-300 border-gray-500 my-3"></div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-black-2">
                  <DataCardItem title="BUY DATE" data={data?.created_at} />
                  <DataCardItem title="STRATEGY" data={data?.strategyName} />
                  <DataCardItem
                    title="STOCK PRICE"
                    data={formatNumber(data?.stockPrice)}
                  />
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
                  <div className="text-right text-lg font-bold truncate text-green-500">
                    {data?.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
      
        </>
      ) : (
        <NoRecordFound
          heading="This watchlist is empty. Tap on plus ( + ) icon to add items in the watchlist."
          handleSubmit={() => navigate(WATCHLIST_ROUTES.WATCHLIST_CREATE)}
          btnTitle="Add Stocks"
          isSmallSize={false}
          isButtonVisible={false}
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

export default Watchlist;
