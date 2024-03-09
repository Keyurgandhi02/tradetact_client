import React from "react";
import AddJournalForm from "./components/AddJournalForm";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import DataList from "./components/DataList";
import RiskMangeMent from "./components/RiskMangeMent";
import QueueStocks from "./components/QueueStocks";
import RMList from "./components/RMList";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<QueueStocks />} />
        <Route path="/add-journal" element={<AddJournalForm />} />
        <Route path="/journal-list" element={<DataList />} />
        <Route path="/risk-management" element={<RiskMangeMent />} />
        <Route path="/rm-list" element={<RMList />} />
      </Routes>
    </div>
  );
}

export default App;
