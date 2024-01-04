import { Navigate, useLocation } from "react-router-dom";
import { Toaster } from "./pages/common/Toaster";
import { UNAUTHORISED_ERROR } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;

  let location = useLocation();

  if (!isAuthenticated && !location.state?.action) {
    Toaster.TOAST(UNAUTHORISED_ERROR, "error");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
