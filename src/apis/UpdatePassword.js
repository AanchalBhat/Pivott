import { CHANGE_PASSWORD, RESET_PASSWORD } from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api url

export const ResetAPI = { // default
  create: function (data) {
    return FetchApi({ path: RESET_PASSWORD, type: "PUT", data: JSON.stringify(data), isLoader: false });
  },

  updatePassword: function (data, id) {
    return FetchApi({ path: `/users/${id}${CHANGE_PASSWORD}`, type: "PUT", data: data, isLoader: false });
  }
};
