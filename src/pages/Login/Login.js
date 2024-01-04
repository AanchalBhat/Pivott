import React, { useState, useContext, useEffect } from "react";
//mui
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
//mui icon
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoginAPI } from "../../apis/LoginApi";
import { useNavigate } from "react-router-dom";
import logoWhite from "../../assets/logo-white.svg";
import mobLogo from "../../assets/logo_bluev.svg";
import loginThumb from "../../assets/login-thumb.png";
import SocialLogin from "./SocialLogin";
import { setCompanyDomain } from "../../utils";
import { DataContext } from "../../context";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Toaster } from "../common/Toaster";
import { Box } from "@mui/material";
import { EMAIL_REGEX } from "../../utils/regexLists";
import { ButtonLoader } from "../common/ButtonLoader";
import { restMethodError } from "../../constants/errorMessages";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [toggle_password, setToggle_password] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { setIsCompName, deviceAddr } = useContext(DataContext);
  useEffect(() => {
    const loginErrorSSO = localStorage.getItem("error");
    if (loginErrorSSO) {
      Toaster.TOAST(loginErrorSSO, "error");
    }
    localStorage.removeItem("error")
    localStorage.removeItem('sign_up_data')
    localStorage.removeItem('user_not_found_data')
    localStorage.removeItem('company_token')
  }, [])

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (!event.target.value) {
      setEmailErrorMessage("Email can't be empty");
    } else if (!EMAIL_REGEX.test(event.target.value)) {
      setEmailValid(false);
      setEmailErrorMessage("Please enter a valid email Id");
    } else {
      setEmailValid(true);
      setEmailErrorMessage("");
    }
  };

  const handlePasswordChanges = (event) => {
    setPassword(event.target.value);
    if (!event.target.value) {
      setPasswordErrorMessage("Password can't be empty");
    } else {
      setPasswordErrorMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("loginBtn").click();
    }
  };

  const handleLoginClick = () => {
    setLoading(true);
    let user = {
      email: email,
      password: password,
      device_id: deviceAddr,
    };

    if (email?.length !== 0 && isEmailValid && password?.length !== 0) {
      LoginAPI.create({ user })
        .then(function (response) {
          localStorage.setItem("token", response?.token);
          localStorage.setItem("login_id", response?.data?.data?.id);
          localStorage.setItem(
            "user_info",
            JSON.stringify(response?.data?.data?.attributes)
          );
          setCompanyDomain(response?.data?.data?.attributes?.domain);
          setIsCompName(false);
          navigate("/dashboard");
          localStorage.removeItem("social_title");
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          if (
            error?.response?.activated === false ||
            error?.response?.data?.code === "two_factor_required"
          ) {
            Toaster.TOAST(restMethodError(error), "error");
            localStorage.setItem("user_email", JSON.stringify(email));
            localStorage.setItem(
              "code",
              JSON.stringify(error?.response?.data?.code)
            );
            navigate("/verify-email", {
              state: {
                password: password,
              },
            });
          } else {
            Toaster.TOAST(restMethodError(error), "error");
          }
          console.log(error);
        });
    } else {
      if (email?.length === 0) {
        setEmailValid(false);
        setEmailErrorMessage("Email can't be empty");
      }
      if (password?.length === 0) {
        setPasswordErrorMessage("Password can't be empty");
      }
      setLoading(false);
    }
  };

  const togglePasswordHide = () => {
    setToggle_password((toggle_password) => !toggle_password);
  };

  return (
    <div className="ma-login-top">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <div className="ma-mainCenter-image">
            <div className="ma-mainScreen-image">
              <div className="ma-contentImg-set">
                <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                  <img
                    className="loginImg"
                    data-testid="login-logo"
                    src={logoWhite}
                    alt="login_image"
                  />{" "}
                  <img
                    src={mobLogo}
                    className="mobile_loginImg"
                    alt="mobile_login_image"
                  />{" "}
                </Box>
                <h2>
                  Welcome <span>back!</span>
                </h2>
              </div>
              <div className="ma-loginThumb-img">
                <img
                  data-testid="login-thumb"
                  src={loginThumb}
                  alt="login_image"
                />{" "}
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={8}
          sx={{ flexDirection: "row", display: "flex", position: "relative" }}
        >
          <Grid container className="cardContainer">
            <Grid item xs={12} md={10} lg={6} sx={{ margin: "auto" }}>
              <div className="ma-mainForm-contect">
                <div className="ma-mainScreen-form">
                  <div className="ma-form-login FormInputs">
                    <h3 data-testid="login" className="ma-form-heading">
                      Log in
                    </h3>
                    <div className="ma-main-login">
                      <TextField
                        className="ma-Input-type placeholder_field"
                        data-testid="email-input"
                        fullWidth
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailOutlineIcon />
                            </InputAdornment>
                          ),
                        }}
                        error={!isEmailValid ? true : false}
                        helperText={
                          <span className="ma-error">{emailErrorMessage}</span>
                        }
                        value={email}
                        onChange={(e) => handleEmailChange(e)}
                        onKeyPressCapture={handleKeyPress}
                      />
                      <TextField
                        className="ma-Input-type placeholder_field"
                        data-testid="password-input"
                        fullWidth
                        name="password"
                        placeholder="Enter password"
                        type={toggle_password ? "text" : "password"}
                        id="password"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              sx={{ cursor: "pointer" }}
                            >
                              {" "}
                              {toggle_password ? (
                                <Visibility
                                  className="cursor_pointer"
                                  onClick={togglePasswordHide}
                                />
                              ) : (
                                <VisibilityOff onClick={togglePasswordHide} />
                              )}
                            </InputAdornment>
                          ),
                        }}
                        helperText={
                          <span className="ma-error">
                            {passwordErrorMessage}
                          </span>
                        }
                        style={{}}
                        value={password}
                        onChange={(e) => handlePasswordChanges(e)}
                        onKeyPressCapture={handleKeyPress}
                      />
                      <div className="ma-login-btn">
                        <ButtonLoader
                          loading={loading}
                          classStyle={"loginBtn"}
                          btnType={"submit"}
                          handleClick={() => handleLoginClick()}
                          testid={"login-btn"}
                          title={"LOGIN"}
                          fullWidth={true}
                          id={"loginBtn"}
                        />
                      </div>
                      <div className="middle_text_container">
                        <p className="forgotPassword">
                          <span
                            className="tryIt"
                            data-testid="forgot-password"
                            onClick={() => {
                              navigate("/forgot-password");
                            }}
                          >
                            Forgot Password ?{" "}
                          </span>
                        </p>
                      </div>

                      <div></div>
                      <div className="seprateTxt">
                        <div className="access">
                          <span>Or access quickly</span>
                        </div>
                      </div>
                      {/* Social login design starts================== */}
                      <SocialLogin title="Login" />
                      {/* Social login design ends================== */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ma-tryIt-free">
                <p>
                  Didn't have account?
                  <span
                    className="tryIt"
                    data-testid="try-free"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Try it Free
                  </span>
                </p>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
