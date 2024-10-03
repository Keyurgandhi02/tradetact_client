import { Disclosure, DisclosureButton } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import HeaderPopover from "./HeaderPopover";
import HeaderNavItem from "./HeaderNavItem";
import MobileMenu from "./MobileMenu";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function Header() {
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", current: location.pathname === "/" },
    {
      name: "Journal",
      href: "/all_trade_journal",
      current:
        location.pathname === "/all_trade_journal" ||
        location.pathname === "/create_trade_journal" ||
        location.pathname === "/edit_trade_journal",
    },
    {
      name: "Watchlist",
      href: "/all_watchlist",
      current:
        location.pathname === "/all_watchlist" ||
        location.pathname === "/create_watchlist" ||
        location.pathname === "/edit_watchlist",
    },
    // {
    //   name: "Risk Management",
    //   href: "/create_risk_management",
    //   current: location.pathname === "/create_risk_management",
    // },
    {
      name: "Returns",
      href: "/all_return_performance",
      current:
        location.pathname === "/all_return_performance" ||
        location.pathname === "/create_return_performance" ||
        location.pathname === "/edit_return_performance",
    },
    {
      name: "Market",
      href: "/market",
      current: location.pathname === "/market",
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure
      as="nav"
      className="bg-black-dark-400 top-0 sticky z-50 shadow-xl"
    >
      <div className="mx-auto px-4 sm:px-4 lg:px-10">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                <img
                  alt="TradeTact"
                  src="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Group%2026.png?alt=media&token=65626bef-8bff-49ba-bf7a-58f597935c41"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:block">
              <div className="flex space-x-4  ">
                {navigation.map((item) => (
                  <HeaderNavItem
                    key={item.name}
                    item={item}
                    classes={classNames}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <HeaderPopover logout={logout} />
          </div>
        </div>
      </div>
      <MobileMenu classes={classNames} navigation={navigation} />
    </Disclosure>
  );
}
