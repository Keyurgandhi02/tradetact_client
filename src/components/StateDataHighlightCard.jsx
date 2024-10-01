import React from "react";

function StateDataHighlightCard({ highlightCardData, unit }) {
  return (
    <div
      className={`flex gap-5 p-8 max-w-max border ${
        highlightCardData?.previous < highlightCardData?.current
          ? "border-green-500"
          : "border-red-500"
      } ${
        highlightCardData?.previous === highlightCardData?.current &&
        "border-gray"
      } rounded-md`}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold pb-2 text-primary">
          {highlightCardData?.previous} {unit}
        </h2>
        <h4 className="inline text-gray-500 text-sm">Last Year</h4>
      </div>
      <div>
        <svg
          className="fill-primary"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          width="35px"
          height="30px"
          viewBox="0 0 44.952 44.952"
        >
          <g>
            <path
              d="M44.952,22.108c0-1.25-0.478-2.424-1.362-3.308L30.627,5.831c-0.977-0.977-2.561-0.977-3.536,0
                c-0.978,0.977-0.976,2.568,0,3.546l10.574,10.57H2.484C1.102,19.948,0,21.081,0,22.464c0,0.003,0,0.025,0,0.028
                c0,1.382,1.102,2.523,2.484,2.523h35.182L27.094,35.579c-0.978,0.978-0.978,2.564,0,3.541c0.977,0.979,2.561,0.978,3.538-0.001
                l12.958-12.97c0.885-0.882,1.362-2.059,1.362-3.309C44.952,22.717,44.952,22.231,44.952,22.108z"
            />
          </g>
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold pb-2 text-primary">
          {highlightCardData?.current} {unit}
        </h2>
        <h4 className="inline text-gray-500 text-sm">This Year</h4>
      </div>
    </div>
  );
}

export default StateDataHighlightCard;
