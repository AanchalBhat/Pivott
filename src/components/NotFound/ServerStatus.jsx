import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import { Toaster } from "../../pages/common/Toaster";
import { getMethodError } from "../../constants/errorMessages";
let ENDPOINT = "/health-check";
const url = `${API_BASE_URL}${ENDPOINT}`;
const ServerStatus = () => {
  const [status, setStatus] = useState("");
  useEffect(() => {
    getServerStatus();
  }, []);
  const getServerStatus = () => {
    axios
      .get(url)
      .then((response) => {
        setStatus(response.data);
      })
      .catch((error) => {
        setStatus(error);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  return (
    <div className="ma-404container">
      <div className="ma-404-box">
        <h1 data-testid="not-found">Server Status!</h1>
        <div className="ma-404Content-box">
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
};
export default ServerStatus;
