import React from "react";
import { Link } from "react-router-dom";

const HeaderNavItem = ({ onClick, classes, item }) => (
  <Link
    key={item?.href}
    to={item?.href}
    onClick={onClick}
    aria-current={item.current ? "page" : undefined}
    className={classes(
      item.current ? "text-primary" : " text-whiten hover:text-primary-200",
      "px-3 py-3 text-lg font-semibold"
    )}
  >
    {item?.name}
  </Link>
);

export default HeaderNavItem;
