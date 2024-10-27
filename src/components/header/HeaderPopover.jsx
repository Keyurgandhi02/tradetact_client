import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
import { APP_USER_AVATAR } from "../../assets/svgIcons";

const HeaderPopover = ({
  logout,
  navigation,
  toggleTheme,
  theme,
  currentUser,
}) => (
  <Menu as="div" className="relative ml-3">
    <div>
      <MenuButton className="cursor-pointer relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="absolute -inset-1.5" />
        <img
          alt="User"
          src={APP_USER_AVATAR}
          className="h-8 w-8 rounded-full"
        />
      </MenuButton>
    </div>
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-2 w-70 origin-top-right rounded-md dark:bg-main_black_bg_1 bg-white shadow-xl border-[1px] border-gray-500 py-3 dark:border-none dark:shadow-lg ring-1 ring-black-dark-200 ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
      <MenuItem>
        <span className="block px-5 pt-2 pb-4 text-sm text-black-dark-400 dark:text-white font-bold">
          {currentUser.displayName
            ? currentUser?.displayName
            : currentUser?.email}
        </span>
      </MenuItem>

      <div className="border-b dark:border-black-dark-300 border-gray-500"></div>
      {navigation.map((item, index) => (
        <MenuItem key={index}>
          <Link
            to={item?.href}
            target={item?.target}
            className="block px-5 py-5 text-sm text-black-dark-400 hover:bg-light_hover_color dark:text-whiten dark:hover:bg-black-dark-300  font-semibold"
          >
            {item?.name}
          </Link>
        </MenuItem>
      ))}
      <MenuItem>
        <Link
          onClick={toggleTheme}
          className="block px-5 py-5 text-sm text-black-dark-400 hover:bg-light_hover_color dark:text-whiten dark:hover:bg-black-dark-300 font-semibold"
        >
          Turn on - {theme === "dark" ? "Light" : "Dark"} Mode
        </Link>
      </MenuItem>

      <div className="border-b dark:border-black-dark-300 border-gray-500"></div>
      <MenuItem>
        <Link
          onClick={logout}
          className="block px-5 pt-4 pb-2 text-sm text-red-500 hover:text-red-400 font-semibold"
        >
          Log Out
        </Link>
      </MenuItem>
    </MenuItems>
  </Menu>
);

export default HeaderPopover;
