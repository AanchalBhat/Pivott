import { COMPANY, FETCH_COMPANY, GET_EMAIL_N_COMP, ISEMAILVALID, SIGNUP } from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api url

export const SignUpAPI = {
  create: function (data, invitation_token = false, company_domain = false) { // default
    let url;
    url = SIGNUP;
    if (invitation_token && company_domain) {
      url += `?invitation_token=${invitation_token}&company_domain=${company_domain}`
    } else if (invitation_token) {
      url += `?company_token=${invitation_token}`
    }
    return FetchApi({
      path: url,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  getEmailNCompany: function (invitation_token, company_domain) {
    return FetchApi({
      path: GET_EMAIL_N_COMP + `?invitation_token=${invitation_token}&company_domain=${company_domain}`,
      type: "GET"
    })
  },

  companyFilter:function (data) {
    return FetchApi({
      path: COMPANY,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false
    })
  },

  emailFilter:function (data) {
    return FetchApi({
      path: ISEMAILVALID,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false
    })
  },

  getCompanyToken: (token) => {
    return FetchApi({ path: `${FETCH_COMPANY}?company_token=${token}`, type: "GET" });
  },

}

