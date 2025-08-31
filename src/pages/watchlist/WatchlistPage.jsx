import React from "react";
import { useNavigate } from "react-router-dom";
import FloatButton from "../../components/FloatButton";
import { ADD_FLOAT_SVG } from "../../assets/svgIcons";
import { WATCHLIST_ROUTES } from "../../constants/routesConstants";
import { Watchlist } from "../../components/watchlist";

function WatchlistPage() {
  const navigate = useNavigate();

  // Float Button Handler
  const onFloatBtnClickHandler = () => {
    navigate(WATCHLIST_ROUTES.WATCHLIST_CREATE);
  };
  return (
    <>
      <Watchlist />
      <FloatButton
        onClickHandler={onFloatBtnClickHandler}
        icon={<ADD_FLOAT_SVG />}
      />
    </>
  );
}

export default WatchlistPage;
