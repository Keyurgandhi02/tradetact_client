import React from "react";

function AlertCard({
  bgColor,
  borderColor,
  textColor,
  heading,
  action,
  child,
}) {
  return (
    <div
      className={`${bgColor} border-[0.6px] ${borderColor} rounded-sm ${textColor} px-4 py-2 `}
      role="alert"
    >
      <div className="flex">
        {child && <div>{child}</div>}
        <div className="px-2">
          <p className="font-semibold">
            {heading} {action}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AlertCard;
