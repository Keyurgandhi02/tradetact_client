import React from "react";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <div
            onClick={() => handleToggle(index)}
            className="cursor-pointer p-2 bg-gray-200 border-b"
          >
            {item.title}
          </div>
          {openIndex === index && <div className="p-2">{item.content}</div>}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
