import React, { useEffect, useState } from "react";
import { EconomicCalendar } from "react-ts-tradingview-widgets";
import CardTitle from "../components/CardTitle";
import { collection, getDocs, query } from "firebase/firestore";
import db from "../firebase-config";
import StatesData from "../components/StatesData";
import StatesDataSummary from "../components/StatesDataSummary";

function MarketPage() {
  const [isGDPData, setGDPData] = useState([]);
  const [isLabourData, setLabourData] = useState([]);
  const [isPricesData, setPricesData] = useState([]);
  const [isMoneyData, setMoneyData] = useState([]);
  const fetchData = async () => {
    try {
      const q = query(
        collection(db, "economic_data", "economic_data_all", "gdp_data")
      );

      const q1 = query(
        collection(db, "economic_data", "economic_data_all", "labour_data")
      );

      const q2 = query(
        collection(db, "economic_data", "economic_data_all", "money_data")
      );

      const q3 = query(
        collection(db, "economic_data", "economic_data_all", "prices_data")
      );

      const querySnapshot = await getDocs(q);
      const querySnapshot1 = await getDocs(q1);
      const querySnapshot2 = await getDocs(q2);
      const querySnapshot3 = await getDocs(q3);

      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const docs1 = querySnapshot1.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const docs2 = querySnapshot2.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const docs3 = querySnapshot3.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setGDPData(docs);
      setLabourData(docs1);
      setMoneyData(docs2);
      setPricesData(docs3);
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="mt-5 px-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-sm bg-black-dark-400 px-4 py-5  shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="Economic Calendar" />
          <EconomicCalendar
            colorTheme="dark"
            isTransparent={true}
            width="100%"
            showSymbolLogo={false}
            countryFilter="in"
          ></EconomicCalendar>
        </div>
      </div>
      <div className="mt-5 px-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-sm bg-black-dark-400 px-4 py-5  shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="GDP Growth Annually" />
          <StatesData
            highlightCardData={isGDPData[0]?.growth_rate_annual}
            unit="%"
          />
        </div>
      </div>

      <div className="mt-5 px-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-sm bg-black-dark-400 px-4 py-5  shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="GDP Growth" />
          <StatesData highlightCardData={isGDPData[0]?.growth_rate} unit="%" />
        </div>
      </div>

      <div className="mt-5 px-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-sm bg-black-dark-400 px-4 py-5  shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="Unemployment" />
          <StatesData
            highlightCardData={isLabourData[0]?.unemp_data}
            unit="%"
          />
        </div>
      </div>

      <div className="mt-5 px-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-sm bg-black-dark-400 px-4 py-5  shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="Interest Rate" />
          <StatesData
            highlightCardData={isMoneyData[0]?.interest_rate_data}
            unit="%"
          />
        </div>
      </div>
      <div className="mt-5 px-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-sm bg-black-dark-400 px-4 py-5  shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="Consumer Price Index (CPI)" />
          <StatesData
            highlightCardData={isPricesData[0]?.cpi_data}
            unit="Point"
          />
        </div>
      </div>

      <div className="mt-5 px-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-sm bg-black-dark-400 px-4 py-5  shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="Inflation" />
          <StatesData
            highlightCardData={isPricesData[0]?.inflation_data}
            unit="%"
          />
        </div>
      </div>

      <div className="mt-5 px-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-sm bg-black-dark-400 px-4 py-5  shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="Economic Summary" />
          <StatesDataSummary
            gdpData={isGDPData[0]?.growth_rate_annual}
            labourData={isLabourData[0]?.unemp_data}
            priceData={isPricesData[0]?.cpi_data}
            priceData1={isPricesData[0]?.inflation_data}
            moneyData={isMoneyData[0]?.interest_rate_data}
          />
        </div>
      </div>
    </>
  );
}

export default MarketPage;
