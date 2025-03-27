import { APP } from "../../constants/Strings";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { GENERAL_ROUTES, USER_ROUTES } from "../../constants/routesConstants";
import { APP_LOGO } from "../../assets/svgIcons";

const NavHome = () => {
  return (
    <Disclosure as="nav" className="bg-white top-0 sticky z-50">
      <div className="mx-auto px-4 sm:px-4 lg:px-10">
        <div className="relative flex h-18 items-center justify-between">
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
              <Link to={GENERAL_ROUTES.BLANK}>
                <img alt={APP.name} src={APP_LOGO} className="h-11 w-auto" />
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:block"></div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="flex space-x-4">
              <Link
                to={USER_ROUTES.AUTH}
                className="inline-flex items-center justify-center w-full py-2 px-6 text-lg text-white bg-main_color rounded-md sm:w-auto sm:mb-0"
              >
                Login
              </Link>

              <Link
                to={USER_ROUTES.AUTH}
                className="inline-flex items-center justify-center w-full px-6 py-2 text-lg border-main_black_bg border text-main_black_bg rounded-md sm:w-auto sm:mb-0"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default NavHome;
