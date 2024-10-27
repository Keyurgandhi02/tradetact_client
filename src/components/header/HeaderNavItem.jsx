import React from "react";
import { Link } from "react-router-dom";

const HeaderNavItem = ({ onClick, classes, item, target }) => (
  <Link
    key={item?.href}
    to={item?.href}
    onClick={onClick}
    target={target}
    aria-current={item.current ? "page" : undefined}
    className={classes(
      item.current
        ? "text-main_color"
        : "text-black-dark-300 dark:text-whiten hover:text-main_color",
      "px-3 py-3 text-md font-semibold"
    )}
  >
    {item?.name}
  </Link>
);

export default HeaderNavItem;
