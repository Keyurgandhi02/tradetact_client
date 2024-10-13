import React, { useEffect, useState } from "react";
import "../../index.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GlobalInput from "../GlobalInput";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import FloatButton from "../FloatButton";
import { LIST_FLOAT_SVG } from "../../assets/svgIcons";
import {
  GENERAL_FETCH_ERROR,
  GENERAL_SUBMIT_ERROR,
} from "../../constants/Strings";
import { useAuth } from "../../context/AuthContext";
import {
  addFirebaseData,
  getFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../../config/firestoreOperations";
import GlobalButton from "../GlobalButton";
import PageHeading from "../PageHeading";
import SelectCard from "../SelectCard";
import ModalDialog from "../ModalDialog";
import { checkForDuplicates, labelToKey } from "../../config/helper";
import AlertCard from "../AlertCard";
import { useLoading } from "../../context/LoadingContext";
import { BROKER_ROUTES } from "../../constants/routesConstants";

const initialState = {
  label: "",
  dematUser: "",
};

function CreateEditBrokerDematAccounts() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [localStorageUpdated, setLocalStorageUpdated] = useState(false);
  const [isViewModal, setViewModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTempItems, setSelectedTempItems] = useState([]);
  const [cards] = useState([
    {
      id: "angelone_one",
      label: "Angel One",
      icon: process.env.REACT_APP_FIREBASE_ANGELONE_LOGO_URL,
    },
    {
      id: "zerodha_one",
      label: "Zerodha",
      icon: process.env.REACT_APP_FIREBASE_ZERODHA_LOGO_URL,
    },
    {
      id: "dhan_one",
      label: "Dhan",
      icon: process.env.REACT_APP_FIREBASE_DHAN_LOGO_URL,
    },

    {
      id: "hdfcsecurities_one",
      label: "HDFC Securities",
      icon: process.env.REACT_APP_FIREBASE_HDFC_LOGO_URL,
    },

    {
      id: "kotakneo_one",
      label: "Kotak Neo",
      icon: process.env.REACT_APP_FIREBASE_KOTAK_LOGO_URL,
    },

    {
      id: "sharekhan_one",
      label: "ShareKhan",
      icon: process.env.REACT_APP_FIREBASE_SHAREKHAN_LOGO_URL,
    },
    {
      id: "groww_one",
      label: "Groww",
      icon: process.env.REACT_APP_FIREBASE_GROWW_LOGO_URL,
    },
    {
      id: "axisdirect_one",
      label: "Axis Direct",
      icon: process.env.REACT_APP_FIREBASE_AXIS_LOGO_URL,
    },
    {
      id: "upstox_one",
      label: "Upstox",
      icon: process.env.REACT_APP_FIREBASE_UPSTOX_LOGO_URL,
    },
    {
      id: "fyers_one",
      label: "Fyers",
      icon: process.env.REACT_APP_FIREBASE_FYERS_LOGO_URL,
    },
    {
      id: "5paisa_one",
      label: "5 Paisa",
      icon: process.env.REACT_APP_FIREBASE_5PAISA_LOGO_URL,
    },
    {
      id: "icicidirect_one",
      label: "ICICI Direct",
      icon: process.env.REACT_APP_FIREBASE_ICICI_LOGO_URL,
    },
    {
      id: "iifl_one",
      label: "IIFL",
      icon: process.env.REACT_APP_FIREBASE_IIFL_LOGO_URL,
    },
    {
      id: "paytmmoney_one",
      label: "Paytm Money",
      icon: process.env.REACT_APP_FIREBASE_PAYTM_MONEY_LOGO_URL,
    },
    {
      id: "sbisecurities_one",
      label: "SBI Securities",
      icon: process.env.REACT_APP_FIREBASE_SBI_LOGO_URL,
    },
    {
      id: "smcglobal_one",
      label: "Smc Global",
      icon: process.env.REACT_APP_FIREBASE_SMC_GLOBAL_LOGO_URL,
    },
  ]);

  // Input Change Handler
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Select Card Handler
  const handleSelect = (item) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.some((i) => i.id === item.id)) {
        return prevSelected.filter((i) => i.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  // Fetch Broker Data Based on ID
  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setIsEditMode(true);
        const fetchedData = await getFirebaseDataById(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
          id
        );
        setFormData(fetchedData);
        setSelectedItems(fetchedData?.consoleData);
      } catch (error) {
        toast.error(GENERAL_FETCH_ERROR);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Store temp broker locally and check for duplicates
  const handleTempSelect = async () => {
    // Custom Broker Create
    const newTempItem = {
      id: labelToKey(formData?.label),
      label: formData?.label,
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/logo192.svg?alt=media&token=d3737a5d-a8d8-4d8e-a49e-55c2810edc79",
    };

    const existingData = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      currentUser.uid,
      FIREBASE_ENDPOINTS.USER_CONSOLE_DATA,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At",
      true
    );

    // Check Duplicate broker or not
    const isDuplicate =
      existingData.some((item) => item.id === newTempItem.id) ||
      cards.some((card) => card.id === newTempItem.id);

    if (isDuplicate) {
      toast.error(`${formData?.label} broker already exists.`);
      return;
    }

    await addFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      currentUser.uid,
      FIREBASE_ENDPOINTS.USER_CONSOLE_DATA,
      newTempItem
    );

    setLocalStorageUpdated(true);
    setSelectedTempItems([...selectedTempItems, newTempItem]);
    setViewModal(false);
    setFormData({ ...formData, label: "" });
  };

  // Get Console Data Handler
  useEffect(() => {
    async function fetchConsoleData() {
      const data = await getFirebaseData(
        FIREBASE_ENDPOINTS.MASTER_DATA,
        currentUser.uid,
        FIREBASE_ENDPOINTS.USER_CONSOLE_DATA,
        startLoading,
        stopLoading,
        "desc",
        "doc_created_At"
      );
      setSelectedTempItems(data);
    }

    fetchConsoleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorageUpdated]);

  // Submit the form (add or update in Firebase)
  const handleSubmit = async () => {
    const allData = {
      dematUser: formData.dematUser,
      consoleData: selectedItems,
    };
    if (!checkForDuplicates(selectedItems)) {
      return;
    }

    try {
      if (isEditMode) {
        await updateFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
          id,
          allData
        );
        toast.success("Broker account updated successfully!");
      } else {
        await addFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
          allData
        );
        toast.success("Broker account added successfully!");
      }
      localStorage.removeItem("temp_broker");
      setFormData(initialState);
      navigate(BROKER_ROUTES.BROKER_ALL);
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(BROKER_ROUTES.BROKER_ALL);
  };

  return (
    <>
      <div className="md:mb-0 mb-12">
        <div className="flex flex-col gap-9 p-3 mt-5 mb-5">
          <PageHeading
            title="Create Broker & Demat Account"
            isListPage={false}
          />

          {!isEditMode && (
            <div className="px-3">
              <AlertCard
                bgColor="bg-transparent dark:bg-black-dark-400"
                borderColor="border-main_color"
                textColor="text-secondary"
                heading="  If you use a broker that is not listed here, you may be able to
              create your own Broker by clicking"
                action={
                  <span
                    className="text-secondary cursor-pointer underline"
                    onClick={() => setViewModal(true)}
                  >
                    Create Broker!
                  </span>
                }
              />
            </div>
          )}

          <div className="p-5">
            <form onSubmit={(e) => e.preventDefault()}>
              <GlobalInput
                inputType="text"
                placeholder="Demat User Name"
                isValue={formData?.dematUser}
                name="dematUser"
                onChangeHandler={handleChange}
              />
            </form>
            <p className="text-gray-500 font-semibold text-sm my-6 mx-1">
              Note: Please choose all brokers that are related to the
              above-mentioned Demat User Name
            </p>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
              {cards.map((item) => (
                <SelectCard
                  key={item.id}
                  item={item}
                  handleSelect={handleSelect}
                  isSelected={selectedItems.some(
                    (selectedItem) => selectedItem.id === item.id
                  )}
                />
              ))}
            </div>

            {selectedTempItems.length > 0 && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 mt-4">
                {selectedTempItems.map((item) => (
                  <SelectCard
                    key={item.id}
                    item={item}
                    handleSelect={handleSelect}
                    isSelected={selectedItems.some(
                      (selectedItem) => selectedItem.id === item.id
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {selectedItems.length > 0 && formData.dematUser && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[200px]">
              <GlobalButton
                btnTitle="Submit"
                onButtonClickHandler={handleSubmit}
                bgColor="bg-main_color"
                type="button"
              />
            </div>
          )}

          <ModalDialog
            isOpen={isViewModal}
            onClose={() => setViewModal(false)}
            children={
              <div className="p-10">
                <form>
                  <GlobalInput
                    inputType="text"
                    placeholder="Broker Account"
                    isValue={formData?.label}
                    name="label"
                    onChangeHandler={handleChange}
                  />
                  <GlobalButton
                    btnTitle="Submit"
                    onButtonClickHandler={handleTempSelect}
                    bgColor="bg-main_color"
                    type="button"
                  />
                </form>
              </div>
            }
          />
        </div>
        <FloatButton
          onClickHandler={onFloatBtnClickHandler}
          icon={<LIST_FLOAT_SVG />}
        />
      </div>
    </>
  );
}

export default CreateEditBrokerDematAccounts;
