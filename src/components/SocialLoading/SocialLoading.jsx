import React, { useContext, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLoginAPI, MicrosoftLoginAPI } from "../../apis/LoginApi";
import { setCompanyDomain } from "../../utils";
import { DataContext } from "../../context";
import { Toaster } from "../../pages/common/Toaster";
import { getMethodError } from "../../constants/errorMessages";

const SocialLoading = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scope = searchParams.get("scope");
  const code = searchParams.get("code");
  const { setIsCompName, deviceAddr } = useContext(DataContext);
  const title = localStorage.getItem("social_title");

  useEffect(() => {
    if (code && deviceAddr) {
      if (title === "Signup") {
        navigate("/update-company", {
          state: {
            code,
            scope,
          },
        });
      } else {
        if (scope) {
          googleLogin();
        } else {
          microsoftLogin();
        }
      }
    }
  }, [deviceAddr]);

  const signupData = (val) => {
    const signup_data = {
      first_name: val?.user.givenName || val?.user.given_name,
      last_name: val?.user.surname || val?.user.family_name,
      email: val?.user.mail || val?.user.email,
    };
    localStorage.setItem("error", val?.error);
    localStorage.setItem("user_not_found_data", JSON.stringify(signup_data));
    window.location.href = window.location.origin + "/signup";
  };

  const googleLogin = () => {
    GoogleLoginAPI.getGoogleLogin(
      code,
      `${window.location.origin}/auth-callback`,
      deviceAddr
    )
      .then((res) => {
        if (res?.token) {
          localStorage.setItem("token", res?.token);
          localStorage.setItem("login_id", res?.data?.data?.id);
          localStorage.setItem(
            "user_info",
            JSON.stringify(res?.data?.data?.attributes)
          );
          setCompanyDomain(res?.data?.data?.attributes?.domain);
          setIsCompName((prev) => !prev);
          Toaster.TOAST(res?.message, "success");
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        if (error?.response?.data?.code === "user_not_found") {
          signupData(error?.response?.data);
        } else if (error?.response?.data?.code === "two_factor_required") {
          localStorage.setItem(
            "code",
            JSON.stringify(error?.response?.data?.code)
          );
          localStorage.setItem(
            "user_email",
            JSON.stringify(error?.response?.data?.user_email)
          );
          localStorage.setItem("token", error?.response?.data?.token);
          navigate("/verify-email", {
            state: {
              token: error?.response?.data?.token,
            },
          });
        }
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const microsoftLogin = () => {
    MicrosoftLoginAPI.getMicrosoftLogin(
      code,
      `${window.location.origin}/auth-callback`,
      deviceAddr
    )
      .then((res) => {
        if (res?.token) {
          localStorage.setItem("token", res?.token);
          localStorage.setItem("login_id", res?.data?.data?.id);
          localStorage.setItem(
            "user_info",
            JSON.stringify(res?.data?.data?.attributes)
          );
          setCompanyDomain(res?.data?.data?.attributes?.domain);
          setIsCompName((prev) => !prev);
          Toaster.TOAST(res?.message, "success");
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        if (error?.response?.data?.code === "user_not_found") {
          signupData(error?.response?.data);
        } else if (error?.response?.data?.code === "two_factor_required") {
          localStorage.setItem(
            "code",
            JSON.stringify(error?.response?.data?.code)
          );
          localStorage.setItem(
            "user_email",
            JSON.stringify(error?.response?.data?.user_email)
          );
          localStorage.setItem("token", error?.response?.data?.token);
          navigate("/verify-email", {
            state: {
              token: error?.response?.data?.token,
            },
          });
        }
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Typography
        sx={{
          fontSize: "30px",
          color: "#00a4bc",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Please wait...
      </Typography>
    </Box>
  );
};
export default SocialLoading;
