import React from "react";

function Dots({ color, width, height }) {
  return (
    <span
      className={`inline-block w-${width} h-${height} rounded-full cursor-pointer ${color}`}
    />
  );
}

export default Dots;
