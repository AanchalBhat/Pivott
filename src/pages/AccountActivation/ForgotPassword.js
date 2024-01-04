import React, { useState } from "react";
//mui
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { ForgotAPI } from "../../apis/ForgotApi";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { mailImage } from "../../assets/index";
import logoBlue from "../../assets/logo_blue.svg";
import { Box } from "@mui/system";
import { Toaster } from "../common/Toaster";
//import global css
import "../../styles/global/common.css";
import "../Login/Login.css";
import { EMAIL_REGEX } from "../../utils/regexLists";
import { ButtonLoader } from "../common/ButtonLoader";
import { restMethodError } from "../../constants/errorMessages";

const ForgotPassword = () => {
  const [mail, setMail] = useState("");
  const [isEmailValid, setEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeMail = (e) => {
    setMail(e.target.value);
    if (!e.target.value) {
      setEmailErrorMessage("Email can't be empty");
    } else if (!EMAIL_REGEX.test(e.target.value)) {
      setEmailValid(false);
      setEmailErrorMessage("Please enter a valid email Id");
    } else {
      setEmailValid(true);
      setEmailErrorMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("send_reset_link").click();
    }
  };

  const handleClick = () => {
    setLoading(true);
    let user = {
      email: mail,
    };

    if (mail?.length !== 0 && isEmailValid) {
      ForgotAPI.create({ user })
        .then(function (response) {
          Toaster.TOAST(response?.message, "success");
          setMail("");
          localStorage.removeItem("token");
          navigate("/login");

          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      if (mail?.length === 0) {
        setEmailValid(false);
        setEmailErrorMessage("Email can't be empty");
      }
      setLoading(false);
    }
  };

  return (
    <div className="ma-main-forgot">
      <Box>
        <Grid container>
          <Grid item xs={12} md={12}>
            <div className="ma-forgot-pass">
              <img className="ma-logo" src={logoBlue} alt="logo" />
            </div>
          </Grid>
        </Grid>
      </Box>
      <Box className="ma-topBottom-spacer">
        <Grid container>
          <Grid item xs={12} md={6} lg={4} sx={{ margin: "auto" }}>
            <div className="ma-verify-box">
              <div className="mail">
                <img src={mailImage} alt="mailLogo" />
              </div>
              <h3>Reset Password</h3>
              <p className="reset_paragraph">
                Enter email ID to get reset link to your email address
              </p>
              <div className="px-4 mx-auto">
                <div className="ma-reset-pass">
                  <TextField
                    data-testid="mail"
                    name="mail"
                    className="forgot_input placeholder_field w-100"
                    id="mail"
                    placeholder="Enter email"
                    value={mail}
                    onChange={(e) => handleChangeMail(e)}
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
                    onKeyPressCapture={handleKeyPress}
                  />
                </div>
                <div className="ma-login-btn forgot_btn">
                  <ButtonLoader
                    loading={loading}
                    classStyle={"loginBtn"}
                    btnType={"submit"}
                    handleClick={() => handleClick()}
                    testid={"send_reset_link"}
                    title={"Send Reset Link"}
                    id="send_reset_link"
                    fullWidth={true}
                  />
                </div>
              </div>
              <Typography className="reset_goback_text ">
                {" "}
                <span
                  data-testid="go_back"
                  className="tryIt"
                  onClick={() => {
                    // localStorage.removeItem("token")
                    navigate(-1);
                  }}
                >
                  GO BACK
                </span>{" "}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ForgotPassword;
