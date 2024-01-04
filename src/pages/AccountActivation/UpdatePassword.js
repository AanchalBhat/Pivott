import React, { useState, useEffect } from "react";
//mui
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResetAPI } from "../../apis/UpdatePassword";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Key } from "../../assets/index";
import logoBlue from "../../assets/logo_blue.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Toaster } from "../common/Toaster";
//import global css
import "../../styles/global/common.css";
import "../Login/Login.css";
import { STREET_REGEX, STRONGPASSWORD_REGEX } from "../../utils/regexLists";
import { ButtonLoader } from "../common/ButtonLoader";
import { restMethodError } from "../../constants/errorMessages";

const paperStyle = {};

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const userToken = searchParams.get("reset_password_token");
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewpasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (!STRONGPASSWORD_REGEX.test(e.target.value)) {
      setNewPasswordErr(
        "Password must be at least one uppercase, lowercase, special character and number"
      );
    } else if (e.target.value?.length < 8) {
      setNewPasswordErr("Password should be minimum 8 characters");
    } else {
      setNewPasswordErr("");
    }
  };

  const handleConfirmpasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (!STREET_REGEX.test(e.target.value)) {
      setIsConfirm(false);
      setConfirmPasswordErr(
        "Confirm password must be at least one uppercase, lowercase, special character and number"
      );
    } else if (e.target.value?.length < 8) {
      setIsConfirm(false);
      setConfirmPasswordErr("Confirm password should be minimum 8 characters");
    } else if (e.target.value !== newPassword) {
      setIsConfirm(false);
      setConfirmPasswordErr("New password and Confirm password should match");
    } else {
      setIsConfirm(true);
      setConfirmPasswordErr("");
    }
  };

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordErr("New password and Confirm password should match");
    } else {
      setIsConfirm(true);
      setConfirmPasswordErr("");
    }
  }, [newPassword]);

  const togglePasswordHide = () => {
    setTogglePassword((togglePassword) => !togglePassword);
  };
  const toggleConfirmPasswordHide = () => {
    setToggleConfirm((toggleConfirm) => !toggleConfirm);
  };

  const handleClick = () => {
    setLoading(true);
    let user = {
      reset_password_token: userToken,
      password: newPassword,
      password_confirmation: confirmPassword,
    };

    if (
      newPassword?.length !== 0 &&
      confirmPassword?.length !== 0 &&
      isConfirm
    ) {
      if (newPassword === confirmPassword) {
        ResetAPI.create({ user })
          .then(function (response) {
            Toaster.TOAST(response?.message, "success");
            navigate("/password-reset-success");

            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Toaster.TOAST(restMethodError(error), "error");
            console.log(error);
          });
        setConfirmPasswordErr("");
      } else {
        setConfirmPasswordErr("New password and confirm password should match");
        setLoading(false);
      }
    } else {
      if (newPassword?.length === 0) {
        setNewPasswordErr("New password can't be empty");
      }
      if (confirmPassword?.length === 0) {
        setConfirmPasswordErr("Confirm password can't be empty");
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
            <div className="ma-verify-box" elevation={10} style={paperStyle}>
              <div className="mail">
                <img src={Key} alt="mailLogo" />{" "}
              </div>
              <h3 data-testid="update">Update Password</h3>

              <div className="px-4 mx-auto">
                <div className="ma-reset-pass pb-0">
                  <TextField
                    data-testid="new_password"
                    className="w-100 mb-3"
                    name="New Password"
                    type={togglePassword ? "text" : "password"}
                    id="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      handleNewpasswordChange(e);
                    }}
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
                          {togglePassword ? (
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
                      <span className="ma-error">{newPasswordErr}</span>
                    }
                  />
                  <TextField
                    data-testid="confirm_password"
                    className="w-100 mb-3"
                    name="Confirm Password"
                    type={toggleConfirm ? "text" : "password"}
                    id="Confirm Password"
                    placeholder="Enter confirm password"
                    value={confirmPassword}
                    onChange={(e) => {
                      handleConfirmpasswordChange(e);
                    }}
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
                          {toggleConfirm ? (
                            <Visibility
                              className="cursor_pointer"
                              onClick={toggleConfirmPasswordHide}
                            />
                          ) : (
                            <VisibilityOff
                              onClick={toggleConfirmPasswordHide}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      <span className="ma-error">{confirmPasswordErr}</span>
                    }
                  />

                  <div className="ma-verify-main ma-login-btn">
                    <ButtonLoader
                      loading={loading}
                      classStyle={"loginBtn"}
                      btnType={"submit"}
                      handleClick={() => handleClick()}
                      testid={"update_password"}
                      title={"UPDATE PASSWORD"}
                      fullWidth={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default UpdatePassword;
