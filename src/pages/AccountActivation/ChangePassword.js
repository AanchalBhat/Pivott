import React, { useState, useEffect } from "react";
//mui
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { ResetAPI } from "../../apis/UpdatePassword";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PopupHeader from "../common/PopupHeader";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Toaster } from "../common/Toaster";
import { Key } from "../../assets/index";
import logoBlue from "../../assets/logo_blue.svg";
//import global css
import "../../styles/global/common.css";
import "../Login/Login.css";
import { STRONGPASSWORD_REGEX } from "../../utils/regexLists";
import { ButtonLoader } from "../common/ButtonLoader";
import { restMethodError } from "../../constants/errorMessages";

const paperStyle = {};

const ChangePassword = () => {
  const navigate = useNavigate();
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordErr, setOldPasswordErr] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleNewPassword, setToggleNewPassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  const [isPasswordCheck, setIsPasswordCheck] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOldPassword = (e) => {
    setOldPassword(e.target.value);
    if (!e.target.value) {
      setOldPasswordErr("Old password can't be empty");
    } else if (e.target.value?.length < 8) {
      setIsPasswordCheck(false);
      setOldPasswordErr("Password should be minimum 8 characters");
    } else {
      setIsPasswordCheck(true);
      setOldPasswordErr("");
    }
  };

  const handleNewpasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (!e.target.value) {
      setNewPasswordErr("New password can't be empty");
    } else if (!STRONGPASSWORD_REGEX.test(e.target.value)) {
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
    if (!e.target.value) {
      setConfirmPasswordErr("Confirm password can't be empty");
    } else if (!STRONGPASSWORD_REGEX.test(e.target.value)) {
      setIsConfirm(false);
      setConfirmPasswordErr(
        "Confirm password must be at least one uppercase, lowercase, special character and number"
      );
    } else if (e.target.value?.length < 8) {
      setIsConfirm(false);
      setConfirmPasswordErr("Confirm password should be minimum 8 characters");
    } else if (e.target.value !== newPassword) {
      setIsConfirm(false);
      setConfirmPasswordErr("New password and Confirm password do not match");
    } else {
      setIsConfirm(true);
      setConfirmPasswordErr("");
    }
  };

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordErr("New password and Confirm password do not match");
    } else {
      setIsConfirm(true);
      setConfirmPasswordErr("");
    }
  }, [newPassword]);

  const togglePasswordHide = () => {
    setTogglePassword((togglePassword) => !togglePassword);
  };
  const toggleNewPasswordHide = () => {
    setToggleNewPassword((toggleNewPassword) => !toggleNewPassword);
  };
  const toggleConfirmPasswordHide = () => {
    setToggleConfirmPassword((toggleConfirmPassword) => !toggleConfirmPassword);
  };

  const handleValidation = () => {
    if (!oldPassword) {
      setOldPasswordErr("Old password can't be empty");
    }
    if (newPassword?.length === 0) {
      setNewPasswordErr("New password can't be empty");
    } else if (newPassword?.length < 8) {
      setNewPasswordErr("Password should be minimum 8 characters");
    }
    if (!confirmPassword) {
      setConfirmPasswordErr("Confirm password can't be empty");
    }
    if (oldPassword === newPassword) {
      setConfirmPasswordErr("Old password and new password should not match");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("setPassword").click();
    }
  };

  const handleClick = () => {
    const allValid = handleValidation();
    const formData = new FormData();
    const id = JSON.parse(localStorage.getItem("login_id"));
    formData.append("data[current_password]", oldPassword);
    formData.append("data[password]", newPassword);
    formData.append("data[password_confirmation]", confirmPassword);
    if (
      allValid &&
      oldPassword &&
      newPassword &&
      confirmPassword &&
      isPasswordCheck &&
      isConfirm
    ) {
      setLoading(true);
      if (newPassword === confirmPassword) {
        ResetAPI.updatePassword(formData, id)
          .then(function (response) {
            Toaster.TOAST(response?.message, "success");
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
        Toaster.TOAST("Password and Confirm password should match", "error");
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    // navigate("/account/password");
    navigate(-1);
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
          <Grid item xs={12} md={8} lg={6} sx={{ margin: "auto" }}>
            <PopupHeader
              label="Change Password"
              handleToCloseLT={handleClose}
            />
            <div
              className="ma-verify-box pt-4"
              elevation={10}
              style={paperStyle}
            >
              <div className="mail">
                <img src={Key} alt="mailLogo" />
              </div>
              <h3>Create New Password</h3>

              <div className="mx-auto ma-textfield">
                <div className="ma-reset-pass pb-0">
                  <TextField
                    data-testid="old_password"
                    className="w-100 mb-3 placeholder_field"
                    name="Old Password"
                    type={togglePassword ? "text" : "password"}
                    id="Old Password"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => {
                      handleOldPassword(e);
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
                      <span className="ma-error">{oldPasswordErr}</span>
                    }
                  />
                  <TextField
                    data-testid="new_password"
                    className="w-100 mb-3 placeholder_field"
                    name="New Password"
                    type={toggleNewPassword ? "text" : "password"}
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
                          {toggleNewPassword ? (
                            <Visibility
                              className="cursor_pointer"
                              onClick={toggleNewPasswordHide}
                            />
                          ) : (
                            <VisibilityOff onClick={toggleNewPasswordHide} />
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
                    className="w-100 mb-3 placeholder_field"
                    name="Confirm Password"
                    type={toggleConfirmPassword ? "text" : "password"}
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
                          {toggleConfirmPassword ? (
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
                    onKeyPressCapture={handleKeyPress}
                  />

                  <div className="ma-verify-main ma-login-btn pb-4">
                    <ButtonLoader
                      loading={loading}
                      classStyle={"loginBtn"}
                      btnType={"submit"}
                      handleClick={() => handleClick()}
                      testid={"set_password"}
                      title={"SET PASSWORD"}
                      id={"setPassword"}
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

export default ChangePassword;
