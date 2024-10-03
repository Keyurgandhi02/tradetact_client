import React from "react";

function SelectCard({ item, handleSelect, isSelected }) {
  return (
    <div
      key={item.id}
      className={` 
      cursor-pointer
       rounded-sm h-40 relative group items-center flex flex-col max-w-sm transition-all duration-500 border ${
         isSelected
           ? "border-secondary bg-black-dark-200"
           : "bg-black-dark-100 border-none"
       } `}
      onClick={() => handleSelect(item)}
    >
      <img
        src={item?.icon}
        className="group-hover:scale-105 transition-all w-14 h-14 mt-6 text-gray"
        alt={item?.label}
      />

      <div className="group-hover:pb-10 transition-all duration-500 delay-200 mt-6">
        <h1 className="font-bold text-primary-200 text-md">{item?.label}</h1>
      </div>
    </div>
  );
}

export default SelectCard;
