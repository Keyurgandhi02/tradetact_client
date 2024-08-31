import React from "react";
import { NavLink } from "react-router-dom";

function TabBar({ activeTab, onTabClick }) {
  const tabs = [
    { name: "Broker", path: "all_broker_accounts" },
    { name: "Demat", path: "all_demat_accounts" },
    { name: "Strategies", path: "all_user_strategy" },
  ];

  return (
    <div className="space-y-5 mt-1 p-10 top-0">
      <div className="fixed border border-black-dark-300 rounded-lg bg-black-dark-200">
        <ul className="flex items-center gap-2 text-md font-bold p-2 w-auto">
          {tabs.map((tab) => (
            <li key={tab.path} className="flex-1">
              <NavLink
                to={`${tab.path}`}
                className={`relative flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-whiten ${
                  activeTab === tab.path
                    ? "bg-primary"
                    : "border border-transparent hover:border hover:border-primary"
                }`}
                onClick={() => onTabClick(tab.path)}
              >
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TabBar;
