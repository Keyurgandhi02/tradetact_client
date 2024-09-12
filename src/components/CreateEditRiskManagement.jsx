import React, { useState } from "react";
import GlobalInput from "./GlobalInput";
import { useEffect } from "react";
import ModalDialog from "./ModalDialog";
import DataCardItem from "./DataCardItem";
import GlobalButton from "./GlobalButton";
import { formatNumber } from "../config/helper";

const initialState = {
  slPrice: "",
  capital_per_trade: "",
  risk_per_trade: "",
  entryPrice: "",
  active_candle_size: "",
  target_candle_size: "",
};

function CreateEditRiskManagement() {
  const [formData, setFormData] = useState(initialState);
  const [isRiskPer, setRiskPer] = useState(0);
  const [isSLPerShare, setSLPerShare] = useState(0);
  const [isQty, setQty] = useState(0);
  const [isTarget, setTarget] = useState(0);
  const [isViewModal, setViewModal] = useState(false);

  // Input Change Handler
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form Submit Handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setViewModal(true);
  };

  useEffect(() => {
    const {
      capital_per_trade,
      risk_per_trade,
      entryPrice,
      slPrice,
      active_candle_size,
      target_candle_size,
    } = formData || {};

    // Calculate risk percentage per trade
    if (capital_per_trade && risk_per_trade) {
      setRiskPer((risk_per_trade / capital_per_trade) * 100);
    }

    // Calculate stop loss per share
    if (entryPrice && slPrice) {
      setSLPerShare(entryPrice - slPrice);
    }

    // Calculate quantity
    if (capital_per_trade && entryPrice) {
      setQty(capital_per_trade / entryPrice);
    }

    // Calculate target
    if (active_candle_size && target_candle_size) {
      setTarget(Math.floor(active_candle_size * target_candle_size));
    }
  }, [formData]);

  return (
    <div className="md:mb-0 mb-12">
      <div className="flex flex-col gap-9 p-8">
        <div className="rounded-lg  bg-black-dark-200 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="p-7">
              <GlobalInput
                inputType="number"
                placeholder="Capital Per Trade"
                isValue={formData?.capital_per_trade}
                name="capital_per_trade"
                onChangeHandler={(name, value) => handleChange(name, value)}
              />

              <GlobalInput
                inputType="number"
                placeholder="Risk Per Trade"
                isValue={formData?.risk_per_trade}
                name="risk_per_trade"
                onChangeHandler={(name, value) => handleChange(name, value)}
              />

              <GlobalInput
                inputType="number"
                placeholder="Entry Price"
                isValue={formData?.entryPrice}
                onChangeHandler={(name, value) => handleChange(name, value)}
                name="entryPrice"
              />

              <GlobalInput
                inputType="number"
                placeholder="SL Price"
                isValue={formData?.slPrice}
                onChangeHandler={(name, value) => handleChange(name, value)}
                name="slPrice"
              />

              <GlobalInput
                inputType="number"
                placeholder="Active Candle Size (Price)"
                isValue={formData?.active_candle_size}
                onChangeHandler={(name, value) => handleChange(name, value)}
                name="active_candle_size"
              />

              <GlobalInput
                inputType="number"
                placeholder="Target Candle Size (Ex. 1:2)"
                isValue={formData?.target_candle_size}
                onChangeHandler={(name, value) => handleChange(name, value)}
                name="target_candle_size"
              />

              <GlobalButton
                btnTitle="Submit"
                disabled={false}
                type="submit"
                bgColor="bg-primary-500"
                textColor=""
              />
            </div>
          </form>
        </div>
      </div>
      <ModalDialog
        isOpen={isViewModal}
        onClose={() => setViewModal(false)}
        children={
          <div>
            <div className="grid grid-cols-3 gap-4 mb-4 p-5">
              <DataCardItem
                title="Capital/Trade"
                data={formatNumber(formData?.capital_per_trade)}
              />
              <DataCardItem
                title="Risk/Trade"
                data={formatNumber(formData?.risk_per_trade)}
              />
              <DataCardItem
                title="Entry Price"
                data={formatNumber(formData?.entryPrice)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 p-5">
              <DataCardItem
                title="Stop Loss"
                data={formatNumber(formData?.slPrice)}
              />
              <DataCardItem
                title="Active Candle Size"
                data={formatNumber(formData?.active_candle_size)}
              />
              <DataCardItem
                title="Target Candle Size"
                data={formData?.target_candle_size}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 p-5">
              <DataCardItem
                title="Risk/Share (%)"
                data={formatNumber(isRiskPer)}
              />
              <DataCardItem
                title="SL/Share"
                data={formatNumber(isSLPerShare)}
              />
              <DataCardItem title="Qty Buy" data={parseFloat(isQty)} />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 p-5">
              <DataCardItem
                title="Target Price"
                data={formatNumber(isTarget)}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default CreateEditRiskManagement;
