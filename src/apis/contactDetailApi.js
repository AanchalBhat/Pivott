import { CONTACT_DETAILS } from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const ContactDetailsApi = {
  create: function (data) {
    return FetchApi({
      path: CONTACT_DETAILS, type: "POST", data: JSON.stringify({ data: data })
    });
  },
};