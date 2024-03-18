import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav
      class="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#5BB462" }}
    >
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <Link className="navbar-brand" to="/">
          The Invest Circle
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link active">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/queuestocks" className="nav-link active">
                Queue Stocks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/risk-management" className="nav-link active">
                RM
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/journal" className="nav-link active">
                Journal
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
