import { Link, useLocation } from "react-router-dom";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  CONSOLE_ROUTES,
  GENERAL_ROUTES,
} from "../../constants/routesConstants.js";
import { APP_LOGO } from "../../assets/svgIcons";
import { APP } from "../../constants/Strings";
import { HeaderNavItem, MobileHeader } from "../header";

export default function ConsoleHeader() {
  const location = useLocation();

  // Header Nav List
  const headerNavList = [
    {
      name: "Dash",
      href: CONSOLE_ROUTES.CONSOLE_DASH,
      current: location.pathname === CONSOLE_ROUTES.CONSOLE_DASH,
    },
    {
      name: "Trades",
      href: CONSOLE_ROUTES.CONSOLE_TRADES,
      current: location.pathname === CONSOLE_ROUTES.CONSOLE_TRADES,
    },
    {
      name: "Analysis",
      href: CONSOLE_ROUTES.CONSOLE_ANALYSIS,
      current: location.pathname === CONSOLE_ROUTES.CONSOLE_ANALYSIS,
    },
    {
      name: "Download Reports",
      href: CONSOLE_ROUTES.CONSOLE_REPORTS,
      current: location.pathname === CONSOLE_ROUTES.CONSOLE_REPORTS,
    },
  ];

  // Join Class When Active Menu
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure
      as="nav"
      className="bg-white dark:bg-black top-0 sticky z-50 shadow-sm dark:shadow-black-dark-500 dark:shadow-sm"
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
              <Link to={GENERAL_ROUTES.BLANK}>
                <img alt={APP.name} src={APP_LOGO} className="h-9 w-auto" />
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:block">
              <div className="flex space-x-4  ">
                {headerNavList.map((item) => (
                  <HeaderNavItem
                    key={item.name}
                    item={item}
                    classes={classNames}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileHeader classes={classNames} navigation={headerNavList} />
    </Disclosure>
  );
}
