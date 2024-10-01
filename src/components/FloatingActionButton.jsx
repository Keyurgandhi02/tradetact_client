import React, { useEffect, useRef, useState } from "react";
import { GRID_SVG } from "../UI/GlobalSVG";
import { Link } from "react-router-dom";

const FloatingActionButton = () => {
  const [isChecked, setIsChecked] = useState(false);
  const fabRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsChecked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fabRef]);

  return (
    <div className="fixed bottom-8 right-8" ref={fabRef}>
      <input
        id="fabCheckbox"
        type="checkbox"
        className="hidden"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <label
        htmlFor="fabCheckbox"
        className={`relative cursor-pointer w-14 h-14 rounded-lg bg-primary hover:bg-opacity-90 shadow-lg z-10 ${
          isChecked ? "hover:bg-secondary shadow-2xl" : ""
        } transition-all duration-300 flex items-center justify-center`}
      >
        <GRID_SVG />
      </label>

      <div
        className={`absolute bottom-0 right-0 w-40 h-40 transform origin-bottom-right transition-transform duration-300 ${
          isChecked ? "scale-100" : "scale-0"
        }`}
      >
        <Link
          to="/all_trade_journal"
          className="absolute right-[-0.5rem] top-5 bg-primary w-36 h-12 rounded-xl flex items-center justify-center text-black-dark-200 font-semibold  hover:bg-secondary transition-all duration-300"
        >
          Journal
        </Link>

        <Link
          to="/all_trade_journal"
          className="absolute right-[-0.5rem] top-[-3rem] bg-primary w-36 h-12 rounded-xl flex items-center justify-center text-black-dark-200 font-semibold  hover:bg-secondary transition-all duration-300"
        >
          Watchlist
        </Link>

        <Link
          to="/create_risk_management"
          className="absolute right-[-0.5rem] top-[-7rem] bg-primary w-36 h-12 rounded-xl flex items-center justify-center text-black-dark-200 font-semibold  hover:bg-secondary transition-all duration-300"
        >
          RM Calculator
        </Link>
      </div>
    </div>
  );
};

export default FloatingActionButton;
