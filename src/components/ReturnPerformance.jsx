import React, { useState, useEffect, useCallback } from "react";
import { filterData, formatDateToDDMMYY, formatNumber } from "../config/helper";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { GENERAL_DELETE_ERROR } from "../constants/Strings";
import { useAuth } from "../store/AuthContext";
import {
  deleteFirebaseData,
  getFirebaseData,
} from "../config/firestoreOperations";
import NoRecordFound from "./NoRecordFound";
import { useLoading } from "../store/LoadingContext";
import { DELETE_SVG, EDIT_SVG } from "../UI/GlobalSVG";
import DataCardItem from "./DataCardItem";
import ModalDialog from "./ModalDialog";
import GeneralModalContent from "./GeneralModalContent";
import { handleExport } from "./ExportCSVButton";
import PageHeader from "./PageHeader";
import PageHeaderActions from "./PageHeaderActions";

function ReturnPerformance() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [filteredResults, setFilteredResults] = useState(fetchedData);

  // Fetch ROI
  const fetchData = useCallback(async () => {
    const fetchedTasks = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      currentUser.uid,
      FIREBASE_ENDPOINTS.USER_ROI,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At"
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
  // ROI Delete Handler
  const confirmDeleteHandler = async () => {
    if (!selectedDocumentId) {
      toast.error(GENERAL_DELETE_ERROR);
      return;
    }

    try {
      await deleteFirebaseData(
        FIREBASE_ENDPOINTS.MASTER_DATA,
        currentUser.uid,
        FIREBASE_ENDPOINTS.USER_ROI,
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

  // ROI Edit Handler
  const editHandler = (id) => {
    navigate(`/edit_return_performance/${id}`);
  };

  // Fetch ROI
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Export CSV Handler
  const downloadHandler = () => {
    handleExport(fetchedData, "Return Performance");
  };

  // Serach Functionality
  useEffect(() => {
    setFilteredResults(filterData(fetchedData, searchTerm, "accountName"));
  }, [searchTerm, fetchedData]);

  return (
    <div className="md:mb-0 mb-12">
      <PageHeader
        pageTitle="Returns"
        isListPage={true}
        firstData={totalDocuments}
        firstDataTitle="Returns"
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
                className="rounded-sm shadow-md p-4 bg-black-dark-400 w-full md:w-104 lg:w-114 h-auto md:h-68 lg:h-68 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-bold text-lg text-whiten truncate">
                      {data?.accountName ? data?.accountName : "NA"}
                    </h4>
                  </div>
                  <span className="font-semibold text-xs text-whiten">
                    {data?.doc_created_At &&
                      formatDateToDDMMYY(data?.doc_created_At.toDate())}
                  </span>
                </div>
                <div className="border-b border-black-dark-300 my-3"></div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-black-2">
                  <DataCardItem title="DATE" data={data?.created_at} />
                  <DataCardItem
                    title="INVESTED"
                    data={formatNumber(data?.invested_amount)}
                  />
                  <DataCardItem
                    title="RETURNED"
                    data={formatNumber(data?.returned_amount)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-black-2">
                  <DataCardItem
                    title="RETURN (%)"
                    data={parseFloat(data?.returnPercentage).toFixed(2)}
                  />
                  <DataCardItem
                    title="GAIN"
                    data={formatNumber(data?.returnAmount)}
                  />
                  <DataCardItem
                    title="CHARGES"
                    data={formatNumber(data?.charges)}
                  />
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
                  <div
                    className={`text-right text-2xl font-bold truncate ${
                      data?.returnPercentage > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {data?.returnPercentage > 0 ? "+" : "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Toaster position="top-right" reverseOrder={true} />
        </>
      ) : (
        <NoRecordFound
          heading="This return performance is empty. Tap on plus ( + ) icon to add returns in the returns performance list."
          handleSubmit={() => navigate("/create_return_performance")}
          btnTitle="Add Returns"
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

export default ReturnPerformance;
