import React, { useState, useContext } from "react";
//mui
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate } from "react-router-dom";
import { GenerateOtpAPI, VerifyEmailAPI } from "../../apis/VerifyEmailApi";
import { Link } from "react-router-dom";
import { setCompanyDomain } from "../../utils";
import { DataContext } from "../../context";
import { mailImage } from "../../assets/index";
import logoBlue from "../../assets/logo_blue.svg";
import { SignUpAPI } from "../../apis/SignupApi";
import { Toaster } from "../common/Toaster";
//import global css
import "../../styles/global/common.css";
import "../Login/Login.css";
import { UpdateTimezone } from "../common/UpdateTimezone";
import { ButtonLoader } from "../common/ButtonLoader";
import { restMethodError } from "../../constants/errorMessages";

const AccountActivation = () => {
  const otpMaxLength = 4;
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const domain = location?.state?.domain;
  const get_email = localStorage.getItem("user_email")
    ? JSON.parse(localStorage.getItem("user_email"))
    : "";
  const twoFactorCode = localStorage.getItem("code");
  const { setIsCompName, deviceAddr } = useContext(DataContext);
  const signUpData = JSON.parse(localStorage.getItem("sign_up_data"));
  const company_token = localStorage.getItem("company_token");

  const handleChange = (e) => {
    if (e.target.value?.length !== 0) {
      setOtp(e.target.value);
      setErr("");
    } else {
      setErr("Please enter otp");
      setOtp(e.target.value);
    }
  };

  const handleKeyPress = (event) => {
    const charCode = event.charCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("valid_otp").click();
    }
  };

  const handleVerifyEmail = () => {
    setLoading(true);
    let user = {
      ...signUpData,
      otp_code: parseInt(otp),
    };
    SignUpAPI.create({ user }, company_token)
      .then((response) => {
        navigate("/dashboard");
        Toaster.TOAST(response?.message, "success");
        localStorage.setItem("token", response?.token);
        localStorage.setItem(
          "user_info",
          JSON.stringify(response?.data?.data?.attributes)
        );
        setCompanyDomain(response?.data?.data?.attributes?.domain);
        setIsCompName((prev) => !prev);
        UpdateTimezone(response?.data?.data?.id);
        localStorage.removeItem("sign_up_data");
        localStorage.removeItem("user_not_found_data");
        localStorage.setItem("user_email", JSON.stringify(user?.email));
        localStorage.setItem("login_id", response?.data?.data?.id);

        setLoading(false);
      })
      .catch((error) => {
        // Toaster.TOAST(error?.response?.data.error, "error");
        setLoading(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleTwoFactorVerifyEmail = () => {
    setLoading(true);
    let user = {
      email: get_email,
      otp_code: parseInt(otp),
      device_id: deviceAddr,
    };
    if (location?.state?.password) {
      user["password"] = location.state.password;
    } else if (location?.state?.token) {
      user["token"] = location.state.token;
    }
    VerifyEmailAPI.createTwoFactor({ user, domain })
      .then((response) => {
        Toaster.TOAST(response?.message, "success");
        navigate("/dashboard");
        localStorage.setItem("token", response?.token);
        localStorage.setItem(
          "user_info",
          JSON.stringify(response?.data?.data?.attributes)
        );
        setCompanyDomain(response?.data?.data?.attributes?.domain);
        setIsCompName((prev) => !prev);
        localStorage.removeItem("sign_up_data");
        localStorage.removeItem("user_not_found_data");
        localStorage.setItem("user_email", JSON.stringify(user?.email));
        localStorage.setItem("login_id", response?.data?.data?.id);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // Toaster.TOAST(error?.response?.data.error, "error");

        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleClick = () => {
    if (otp?.length === otpMaxLength) {
      if (twoFactorCode) {
        handleTwoFactorVerifyEmail();
      } else {
        handleVerifyEmail();
      }
    } else {
      if (otp?.length === 0) {
        setErr("Please enter otp");
      } else if (otp?.length < otpMaxLength) {
        setErr("Enter valid OTP");
      } else {
        setErr("");
      }
    }
  };

  const handleGenerateResendOtp = () => {
    setResendLoading(true);
    let data = JSON.parse(localStorage.getItem("sign_up_data"));
    data && delete data.password;

    GenerateOtpAPI.create({ user: data }, company_token)
      .then(function (response) {
        Toaster.TOAST(response?.message, "success");
        setOtp("");
        setResendLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // Toaster.TOAST(error?.response?.data.error, "error");

        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleTwoFactorResendOtp = () => {
    setLoading(true);
    let user = {
      email: get_email,
      device_id: deviceAddr,
    };

    GenerateOtpAPI.resend_twoFactorOtp({ user, domain })
      .then(function (response) {
        if (response) {
          Toaster.TOAST(response?.message, "success");
        } else {
          Toaster.TOAST(response?.errors?.otp || response?.error?.otp, "error");
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // Toaster.TOAST(error?.response?.data.error, "error");

        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleResendotpClick = () => {
    if (twoFactorCode) {
      handleTwoFactorResendOtp();
    } else {
      handleGenerateResendOtp();
    }
  };

  return (
    <div className="ma-main-forgot">
      <Box>
        <Grid container>
          <Grid item xs={12} md={12}>
            <div className="ma-forgot-pass">
              <img
                data-testid="logo-img-1"
                className="ma-logo"
                src={logoBlue}
                alt="logo"
              />{" "}
            </div>
          </Grid>
        </Grid>
      </Box>

      <Box className="ma-topBottom-spacer">
        <Grid container>
          <Grid item xs={12} md={6} lg={4} sx={{ margin: "auto" }}>
            <div className="ma-verify-box">
              <div className="mail">
                <img data-testid="logo-img-2" src={mailImage} alt="mailLogo" />{" "}
              </div>
              <h3>Verify your email address</h3>
              <p>
                You’ve entered <b>{get_email}</b> as the email address for your
                account. Please verify this email by clicking button below.
              </p>
              <div className="px-4 pb-3 mx-auto">
                <div className="ma-otp my-3">
                  <input
                    data-testid="otp"
                    type="text"
                    placeholder="OTP"
                    className="mt-otp-input placeholder_field"
                    value={otp}
                    name="otp"
                    maxLength={otpMaxLength}
                    onChange={(e) => handleChange(e)}
                    onKeyPressCapture={handleKeyPress}
                  />
                  <span className="ma-error">{err}</span>
                </div>

                <div className=" ma-verify-main ma-login-btn">
                  <ButtonLoader
                    loading={loading}
                    classStyle={"loginBtn"}
                    disabled={loading}
                    testid={"verify-btn"}
                    id={"valid_otp"}
                    title={"Verify your email"}
                    btnType={"submit"}
                    handleClick={() => handleClick()}
                  />
                </div>
              </div>
              <p className="resend_otp_text">
                <Link
                  className={resendLoading ? "ma-disabled" : ""}
                  onClick={handleResendotpClick}
                >
                  RESEND OTP
                </Link>
              </p>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AccountActivation;
