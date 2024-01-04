import { CONTACT_US } from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const homeApi = {
  contactUs: (body) => {
    return FetchApi({
      path: CONTACT_US,
      type: "POST",
      data: JSON.stringify({ data: body }),
    });
  },
};
