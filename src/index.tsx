import React from "react";
import { createRoot } from "react-dom/client";
import { DataProvider } from "./context";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

let bugsnagKey = process.env.REACT_APP_BUGSNAG_APIKEY;

let bugsnagReactPlugin;
if (bugsnagKey) {
  Bugsnag.start({
    apiKey: bugsnagKey || "",
    plugins: [new BugsnagPluginReact()],
    releaseStage: process.env.REACT_APP_ENV
  });
}
bugsnagReactPlugin = Bugsnag.getPlugin("react");
const ErrorBoundary =
bugsnagReactPlugin?.createErrorBoundary(React) || React.Fragment;

const container = document.getElementById("root")!;
const root = createRoot(container);

const ErrorBoundaryWrapper = ({ children }: { children: any }) => 
  <>
  {bugsnagKey ?
      <ErrorBoundary>
        {children}
      </ErrorBoundary> : 
      (children)
  }
  </>

root.render(
  <>
    <ErrorBoundaryWrapper>
      <DataProvider>
        <App />
      </DataProvider>
    </ErrorBoundaryWrapper>

    <ToastContainer
      // limit={1}
      toastClassName="dark-toast"
      autoClose={4500}
      className="toast-container"
      style={{ zIndex: 9999 }}
      closeButton={false}
    />
  </>
);
