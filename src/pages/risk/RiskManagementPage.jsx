import React from "react";
import { useNavigate } from "react-router-dom";
import FloatButton from "../../components/FloatButton";
import { LIST_FLOAT_SVG } from "../../assets/svgIcons";
import { RISK_ROUTES } from "../../constants/routesConstants";
import RiskManagementCalculatorPage from "./RiskManagementCalculatorPage";

function RiskManagementPage() {
  const navigate = useNavigate();

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(RISK_ROUTES.RISK_ALL);
  };

  return (
    <>
      <RiskManagementCalculatorPage />
      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<LIST_FLOAT_SVG />}
      />
    </>
  );
}

export default RiskManagementPage;
