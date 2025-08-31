import React from "react";
import { useNavigate } from "react-router-dom";
import FloatButton from "../../components/FloatButton";
import { ADD_FLOAT_SVG } from "../../assets/svgIcons";
import { TRADING_STRATEGY_ROUTES } from "../../constants/routesConstants";
import { ManageTradingStrategy } from "../../components/trading_strategy";

function TradingStrategyPage() {
  const navigate = useNavigate();

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_CREATE);
  };

  return (
    <>
      <ManageTradingStrategy />
      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<ADD_FLOAT_SVG />}
      />
    </>
  );
}

export default TradingStrategyPage;
