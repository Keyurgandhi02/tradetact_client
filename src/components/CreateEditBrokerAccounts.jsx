import React, { useEffect, useState } from "react";
import GlobalInput from "./GlobalInput";
import "../index.css";
import { toast, Toaster } from "react-hot-toast";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import FloatButton from "./FloatButton";
import { LIST_FLOAT_SVG } from "../UI/GlobalSVG";
import { useNavigate, useParams } from "react-router-dom";
import {
  GENERAL_FETCH_ERROR,
  GENERAL_SUBMIT_ERROR,
} from "../constants/Strings";
import { useAuth } from "../store/AuthContext";
import {
  addFirebaseData,
  getFirebaseData,
  getFirebaseDataById,
  updateFirebaseData,
} from "../config/firestoreOperations";
import GlobalButton from "./GlobalButton";
import PageHeading from "./PageHeading";
import SelectCard from "./SelectCard";
import ModalDialog from "./ModalDialog";
import { checkForDuplicates, labelToKey } from "../config/helper";
import AlertCard from "./AlertCard";
import { useLoading } from "../store/LoadingContext";

const initialState = {
  label: "",
  dematUser: "",
};

function CreateEditBrokerAccounts() {
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
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/AngelOne.png?alt=media&token=25b2a00d-6de9-44ba-8035-617d57d91210",
    },
    {
      id: "zerodha_one",
      label: "Zerodha",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/kite.png?alt=media&token=7e1395ed-2f82-49d3-8fab-7b243ad4f131",
    },
    {
      id: "dhan_one",
      label: "Dhan",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/d.jpg?alt=media&token=af91104b-4ee0-4010-be6c-a6ac178991fe",
    },

    {
      id: "hdfcsecurities_one",
      label: "HDFC Securities",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/HDFC.png?alt=media&token=e8c1c8a6-457a-4e41-b72e-c96ae4b4658a",
    },

    {
      id: "kotakneo_one",
      label: "Kotak Neo",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Kotak.png?alt=media&token=27263266-1848-4d0d-9679-cc8b80bb69e4",
    },

    {
      id: "sharekhan_one",
      label: "ShareKhan",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Sharekhan.png?alt=media&token=7be21936-3328-4f58-ad68-84a39e9d82b9",
    },
    {
      id: "groww_one",
      label: "Groww",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Grow.png?alt=media&token=2bad3964-5232-4b44-b088-048bcbb4a370",
    },
    {
      id: "axisdirect_one",
      label: "Axis Direct",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Axis.png?alt=media&token=1fe8ba89-d7c0-4bec-aee4-2be889efda8b",
    },
    {
      id: "upstox_one",
      label: "Upstox",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Upstox.png?alt=media&token=08b1b2d3-4b08-4e43-b593-105d064589b3",
    },
    {
      id: "fyers_one",
      label: "Fyers",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Fyers.png?alt=media&token=385bf0e5-b0e6-4777-94b8-730ce3de47de",
    },
    {
      id: "5paisa_one",
      label: "5 Paisa",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/5Paisa.png?alt=media&token=2614bb79-62c1-4242-9752-f28a1f165d3c",
    },
    {
      id: "icicidirect_one",
      label: "ICICI Direct",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/ICICI.jpg?alt=media&token=aa46532b-a6f1-495b-974d-136b256c53bc",
    },
    {
      id: "iifl_one",
      label: "IIFL",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/IIFL.png?alt=media&token=ab26ba19-a0e0-49f9-a2cb-61ba7529d617",
    },
    {
      id: "paytmmoney_one",
      label: "Paytm Money",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Paytm.png?alt=media&token=af3e0b37-f57b-42f4-aab4-653c265c1405",
    },
    {
      id: "sbisecurities_one",
      label: "SBI Securities",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/SBI.png?alt=media&token=78888574-1920-4886-ba17-61ec613877d6",
    },
    {
      id: "smcglobal_one",
      label: "Smc Global",
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/SMCGLOBAL.png?alt=media&token=903c2804-dbf4-425c-90ea-bdfb12905827",
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
      icon: "https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/favicon.svg?alt=media&token=20b1ffc5-b21f-43d3-a65f-3a748c800847",
    };

    const existingData = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      currentUser.uid,
      FIREBASE_ENDPOINTS.USER_CONSOLE_DATA,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At"
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
      navigate("/all_broker_accounts");
    } catch (error) {
      toast.error(GENERAL_SUBMIT_ERROR);
    }
  };

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate("/all_broker_accounts");
  };

  return (
    <>
      <div className="md:mb-0 mb-12">
        <div className="flex flex-col gap-9 p-4 mt-5 mb-5">
          <PageHeading
            title="Create Broker & Demat Account"
            isListPage={false}
          />
          
          {!isEditMode && (
            <AlertCard
              bgColor="bg-black-dark-400"
              borderColor="border-primary-200"
              textColor="text-whiten"
              heading="  If you use a broker that is not listed here, you may be able to
              create your own Broker by clicking"
              action={
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => setViewModal(true)}
                >
                  Create Broker!
                </span>
              }
            />
          )}

          <div className="rounded-sm bg-black-dark-400">
            <div className="p-7">
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
          </div>

          {selectedItems.length > 0 && formData.dematUser && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary-200 text-black-dark-200 font-bold py-4 px-6 rounded-md shadow-lg w-[180px]"
              >
                Submit
              </button>
            </div>
          )}

          <ModalDialog
            isOpen={isViewModal}
            onClose={() => setViewModal(false)}
            children={
              <div className="p-7">
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
                    bgColor="bg-primary-500"
                    type="button"
                  />
                </form>
              </div>
            }
          />

          <Toaster position="top-right" reverseOrder={true} />
        </div>
        <FloatButton
          onClickHandler={onFloatBtnClickHandler}
          icon={<LIST_FLOAT_SVG />}
        />
      </div>
    </>
  );
}

export default CreateEditBrokerAccounts;
