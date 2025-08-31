import { Link, useLocation } from "react-router-dom";
import { HeaderNavItem, HeaderPopover, MobileHeader } from "./index";
import { useAuth } from "../../context/AuthContext";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  BROKER_ROUTES,
  CONSOLE_ROUTES,
  GENERAL_ROUTES,
  PRICING_ROUTES,
  RISK_ROUTES,
  TRADE_JOURNAL_ROUTES,
  TRADING_STRATEGY_ROUTES,
  USER_PROFILE_ROUTES,
  WATCHLIST_ROUTES,
} from "../../constants/routesConstants";
import { APP_LOGO } from "../../assets/svgIcons";
import { APP } from "../../constants/Strings";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { DashboardContext } from "../../context/DashboardContext";

export default function Header() {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const { toggleTheme, theme } = useContext(ThemeContext);
  const { planStatus } = useContext(DashboardContext);

  // Header Nav List
  const headerNavList = [
    {
      name: "Dashboard",
      href: GENERAL_ROUTES.HOME_MAIN,
      current: location.pathname === GENERAL_ROUTES.HOME_MAIN,
    },
    {
      name: "Journal",
      href: TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_ALL,
      current:
        location.pathname === TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_ALL ||
        location.pathname === TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_CREATE ||
        location.pathname === TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_EDIT,
    },
    {
      name: "Console",
      href: CONSOLE_ROUTES.CONSOLE_DASH,
      current: location.pathname === CONSOLE_ROUTES.CONSOLE_DASH,
      target: "_blank",
    },
    {
      name: "Watchlist",
      href: WATCHLIST_ROUTES.WATCHLIST_ALL,
      current:
        location.pathname === WATCHLIST_ROUTES.WATCHLIST_ALL ||
        location.pathname === WATCHLIST_ROUTES.WATCHLIST_CREATE ||
        location.pathname === WATCHLIST_ROUTES.WATCHLIST_EDIT,
    },
  ];

  // Header Popover Nav List
  const headerPopoverNavList = [
    {
      name: "My Account",
      href: USER_PROFILE_ROUTES.PROFILE,
    },
    {
      name: "Demat & Broker",
      href: BROKER_ROUTES.BROKER_ALL,
    },
    {
      name: "Trading Strategy",
      href: TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_ALL,
    },
    // Only include Pricing when planStatus is not active
    planStatus !== "active" && {
      name: "Pricing",
      href: PRICING_ROUTES.PRICING,
    },
  ].filter(Boolean); // Filter out any false or null values

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
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-black-dark-400 dark:text-whiten  focus:outline-none">
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
              <Link to={GENERAL_ROUTES.HOME_MAIN}>
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

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <HeaderPopover
              logout={logout}
              navigation={headerPopoverNavList}
              toggleTheme={toggleTheme}
              theme={theme}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
      <MobileHeader classes={classNames} navigation={headerNavList} />
    </Disclosure>
  );
}
