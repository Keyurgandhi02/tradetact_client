import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { DashboardProvider } from "./context/DashboardContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <LoadingProvider>
          <AuthProvider>
            <DashboardProvider>
              <Loading />
              <App />
            </DashboardProvider>
          </AuthProvider>
        </LoadingProvider>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
