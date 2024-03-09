// Header.js
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
const Header = () => {
  return (
    <header className="site-header">
      <div className="site-identity">
        <h1>The Invest Circle</h1>
      </div>
      <nav className="site-navigation">
        <ul className="nav">
          <li>
            <Link to="/">Queue Stocks</Link>
          </li>
          <li>
            <Link to="/add-journal">Add Journal</Link>
          </li>
          <li>
            <Link to="/journal-list">Journal List</Link>
          </li>
          <li>
            <Link to="/risk-management">RM</Link>
          </li>
          <li>
            <Link to="/rm-list">RM List</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
