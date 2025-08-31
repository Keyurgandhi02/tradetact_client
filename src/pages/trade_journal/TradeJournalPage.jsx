import React from "react";
import { useNavigate } from "react-router-dom";
import FloatButton from "../../components/FloatButton";
import { ADD_FLOAT_SVG } from "../../assets/svgIcons";
import { TRADE_JOURNAL_ROUTES } from "../../constants/routesConstants";
import ManageTradeJournal from "../../components/trade_journal/ManageTradeJournal";

function TradeJournalPage() {
  const navigate = useNavigate();

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_CREATE);
  };

  return (
    <>
      <ManageTradeJournal />
      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<ADD_FLOAT_SVG />}
      />
    </>
  );
}

export default TradeJournalPage;
