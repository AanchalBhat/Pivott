import { RESEND_OTP, VERIFY_EMAIL,VERIFY_TWOFACTOR, RESEND_TWOFACTOR_OTP }
  from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api urls

export const VerifyEmailAPI = { // modified
  createTwoFactor: function ({ user, domain }) {
    return FetchApi({
      path: VERIFY_TWOFACTOR,
      type: "POST",
      data: JSON.stringify({ user }),
      isLoader: true,
      extraHeaders: { "COMPANY-DOMAIN": domain }
    });
  },
};

export const GenerateOtpAPI = { // modified
  create: function (data, company_token) {
    let url = RESEND_OTP
    if (company_token) {
      url += `?company_token=${company_token}`
    }
    return FetchApi({
      path: url,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },
  resend_twoFactorOtp: function ({ user, domain }) {
    return FetchApi({
      path: RESEND_TWOFACTOR_OTP,
      type: "POST",
      data: JSON.stringify({ user }),
      isLoader: true,
      extraHeaders: { "COMPANY-DOMAIN": domain }
    });
  },
};

