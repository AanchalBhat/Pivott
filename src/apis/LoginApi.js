import {
  GOOGLE_LOGIN,
  GOOGLE_URI,
  LOGIN,
  MICROSOFT_LOGIN,
  MICROSOFT_URI,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const LoginAPI = {
  create: function (data) {
    return FetchApi({
      path: LOGIN,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },
};

// google apis for SSO
export const GoogleLoginAPI = {
  getGoogleLogin: function (code, redirect_url, device_id, isNewComp = false, company) {
    let url = `${GOOGLE_LOGIN}?code=${code}&redirect_url=${redirect_url}/&device_id=${device_id}`;
    if (isNewComp) {
      url += `&company_name=${company}`
    }
    return FetchApi({ path: url, type: "GET" });
  },

  getGoogleUri: function (redirect_url) {
    return FetchApi({
      path: `${GOOGLE_URI}?redirect_url=${redirect_url}/&url_type=sign_in`,
      type: "GET"
    });
  },
};

// microsoft apis for SSO
export const MicrosoftLoginAPI = {

  getMicrosoftLogin: function (code, redirect_url, device_id, isNewComp = false, company) {
    let url = `${MICROSOFT_LOGIN}?code=${code}&redirect_url=${redirect_url}/&device_id=${device_id}`
    if (isNewComp) {
      url += `&company_name=${company}`
    }
    return FetchApi({ path: url, type: "GET" });
  },

  getMicrosoftUri: function (redirect_url) {
    return FetchApi({
      path: `${MICROSOFT_URI}?redirect_url=${redirect_url}/&url_type=sign_in`,
      type: "GET"
    });
  },
};