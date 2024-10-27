import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header/Header";
import { ConsoleHeader } from "../components/console/index";

const AuthenticatedLayout = () => {
  const location = useLocation();

  // Define the route(s) where the custom header should be displayed
  const customHeaderRoutes = /^\/console(\/.*)?$/.test(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {customHeaderRoutes && <ConsoleHeader />}
        {!customHeaderRoutes && <Header />}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
