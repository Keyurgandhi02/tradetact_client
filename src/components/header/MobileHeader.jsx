import React from "react";
import { DisclosureButton, DisclosurePanel } from "@headlessui/react";

const MobileHeader = ({ navigation, classes }) => {
  // Menu Selection Classes
  const selected =
    "bg-black-dark-400 dark:bg-whiten text-white dark:text-black-dark-400";
  const deSelected = "text-black-dark-400 dark:text-whiten";

  return (
    <DisclosurePanel className="sm:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2 ">
        {navigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={classes(
              item.current ? selected : deSelected,
              "block rounded-md px-3 py-2 text-base font-medium"
            )}
          >
            {item.name}
          </DisclosureButton>
        ))}
      </div>
    </DisclosurePanel>
  );
};

export default MobileHeader;
