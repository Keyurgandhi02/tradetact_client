import React from "react";
import Journals from "./components/Journals";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RiskMangeMent from "./components/RiskMangeMent";
import QueueStocks from "./components/QueueStocks";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/queuestocks" element={<QueueStocks />} />
        <Route path="/journal" element={<Journals />} />
        <Route path="/risk-management" element={<RiskMangeMent />} />
      </Routes>
    </>
  );
}

export default App;
