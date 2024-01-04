import { LEAD_EMAIL } from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api url

export const SendEmailAPI = {
  create: function (data) {
    return FetchApi({ path: LEAD_EMAIL, type: "POST", data: data, contentType: false });
  },
};
