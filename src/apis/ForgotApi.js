import { FORGET_PASSWORD } from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api declaration

export const ForgotAPI = { // default
  create: function (data) {
    return FetchApi({ 
      path: FORGET_PASSWORD, 
      type: "POST", 
      data: JSON.stringify(data), 
      isLoader: false,
    });
  },
};
