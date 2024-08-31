import React from "react";
import { Link } from "react-router-dom";

const HeaderNavItem = ({ onClick, classes, item }) => (
  <Link
    key={item?.href}
    to={item?.href}
    onClick={onClick}
    aria-current={item.current ? "page" : undefined}
    className={classes(
      item.current
        ? "bg-primary"
        : "border border-transparent hover:border hover:border-primary",
      "px-3 py-2 text-md font-semibold text-whiten rounded-md"
    )}
  >
    {item?.name}
  </Link>
);

export default HeaderNavItem;
