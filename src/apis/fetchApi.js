import { API_BASE_URL } from "../constants/api";
import { loader } from "../constants/loader";
import axios from "axios";
import "../App.css";

export function FetchApi({
  path,
  type,
  data = false,
  contentType = "application/json",
  isdownload = false,
  isLoader = true,
  getError = false,
  extraHeaders = {},
}) {
  const domain = localStorage.getItem("COMPANY_DOMAIN") || null;
  const url = `${API_BASE_URL}${path}`;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Accept: "application/json",
    "COMPANY-DOMAIN": domain,
    ...extraHeaders,
  };
  if (contentType) {
    headers = { ...headers, "Content-Type": contentType };
  }

  let apiParams = {
    method: type,
    headers: headers,
    data: data,
  };
  if (isdownload) {
    apiParams = { ...apiParams, responseType: "arraybuffer" };
  }

  return new Promise((resolve, reject) => {
    if (isLoader) {
      loader(true);
    }
    axios(url, apiParams)
      .then((response) => {
        resolve(response?.data);
        loader(false);
      })
      .catch((error) => {
        loader(false);
        reject(error);
      });
  });
}