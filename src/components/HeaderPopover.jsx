import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";

const HeaderPopover = ({ logout }) => (
  <Menu as="div" className="relative ml-3">
    <div>
      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Open user menu</span>
        <img
          alt=""
          src="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/3d-illustration-business-man-with-glasses-grey-background-clipping-path.jpg?alt=media&token=8aa66837-fbda-4e44-96f0-269064d19af5"
          className="h-8 w-8 rounded-full"
        />
      </MenuButton>
    </div>
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black-dark-200 py-1 shadow-lg ring-1 ring-black-dark-200 ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
      <MenuItem>
        <Link
          to="/profile"
          className="block px-4 py-3 text-md text-whiten hover:text-primary-300 font-semibold"
        >
          Your Profile
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          to="/help"
          className="block px-4 py-3 text-md text-whiten hover:text-primary-300 font-semibold"
        >
          Help & Support
        </Link>
      </MenuItem>

      <MenuItem>
        <Link
          onClick={logout}
          className="block px-4 py-2 text-md text-whiten hover:text-primary-300 font-semibold"
        >
          Sign out
        </Link>
      </MenuItem>
    </MenuItems>
  </Menu>
);

export default HeaderPopover;
