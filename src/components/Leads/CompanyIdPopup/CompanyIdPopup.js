import React, { useContext, useState } from "react";
//mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  GoogleLoginAPI,
  MicrosoftLoginAPI,
} from "../../../apis/LoginApi";
import { setCompanyDomain } from "../../../utils";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../../../context";
import { Toaster } from "../../../pages/common/Toaster";
import debouce from "lodash.debounce";
import { SignUpAPI } from "../../../apis/SignupApi";
import { InputAdornment } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
//import global css
import "../../../styles/global/common.css";
import "../../../pages/Login/Login.css";
import { ButtonLoader } from "../../../pages/common/ButtonLoader";
import { getMethodError, restMethodError } from "../../../constants/errorMessages";

function CompanyIdPopup() {
  const [organization, setOrganization] = useState("");
  const [organizationErrMsg, setOrganizationErrMsg] = useState("");
  const [loader, setLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsCompName, deviceAddr } = useContext(DataContext);

  const handleValue = (e) => {
    setOrganization(e.target.value);
    debounceSave(e.target.value);

    if (!e.target.value) {
      setOrganizationErrMsg("Organization is required!");
      setDisabled(true)
    } else {
      setDisabled(true);
      setOrganizationErrMsg("");
    }
  };

  const googleLogin = () => {
    GoogleLoginAPI.getGoogleLogin(
      location?.state?.code,
      `${window.location.origin}/auth-callback`,
      deviceAddr,
      true,
      organization
    )
      .then((res) => {
        setSubmitLoader(false);
        if (res?.token) {
          localStorage.setItem("token", res?.token);
          localStorage.setItem("login_id", res?.data?.data?.id);
          localStorage.setItem(
            "user_info",
            JSON.stringify(res?.data?.data?.attributes)
          );
          localStorage.removeItem("social_title");
          setCompanyDomain(res?.data?.data?.attributes?.domain);
          setIsCompName((prev) => !prev);
          Toaster.TOAST(res?.message, "success");
          navigate("/dashboard");
        } else {
          navigate("/signup");
        }
      })
      .catch((error) => {
        setSubmitLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const microsoftLogin = () => {
    MicrosoftLoginAPI.getMicrosoftLogin(
      location?.state?.code,
      `${window.location.origin}/auth-callback`,
      deviceAddr,
      true,
      organization
    )
      .then((res) => {
        setSubmitLoader(false);
        if (res?.token) {
          localStorage.setItem("token", res?.token);
          localStorage.setItem("login_id", res?.data?.data?.id);
          localStorage.setItem(
            "user_info",
            JSON.stringify(res?.data?.data?.attributes)
          );
          localStorage.removeItem("social_title");
          setCompanyDomain(res?.data?.data?.attributes?.domain);
          setIsCompName((prev) => !prev);
          Toaster.TOAST(res?.message, "success");
          navigate("/dashboard");
        } else {
          navigate("/signup");
          Toaster.TOAST(res?.error || res?.errors, "error");
        }
      })
      .catch((error) => {
        setSubmitLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const handleValidate = () => {
    if (!organization) {
      setOrganizationErrMsg("Organization is required!");
      return false;
    } else {
      return organizationErrMsg === "" ? true : false;
    }
  };
  const submit = async () => {
    const isValid = handleValidate();
    setSubmitLoader(true);
    if (isValid) {
      if (location?.state?.scope) {
        googleLogin();
      } else {
        microsoftLogin();
      }
    }
  };

  const debounceSave = React.useCallback(
    debouce(function (e) {
      if (e) {
        isCompanyExist(e);
      }
    }, 1000),
    []
  );

  const isCompanyExist = (value) => {
    let data = {
      name: value,
    };
    setLoader(true);
    SignUpAPI.companyFilter({ data }).then((res) => {
      if (res.status) {
        setOrganizationErrMsg("");
        setDisabled(false);
      }
      setLoader(false);
    })
      .catch((error) => {
        setLoader(false);
        setOrganizationErrMsg(restMethodError(error));
        setDisabled(true);
        console.log(error);
      });
  };

  const handleCancel = () => {
    navigate("/signup");
  };

  return (
    <>
      <div className="ma-main-forgot">
        <Dialog open={true}>
          <DialogTitle>Add Organization</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter Organization.</DialogContentText>
            <div className="ma-reset-pass">
              <TextField
                autoFocus
                margin="dense"
                id="company"
                className="forgot_input w-100"
                label="company"
                type="text"
                fullWidth
                variant="standard"
                value={organization}
                onChange={(e) => handleValue(e)}
                helperText={
                  <span className="ma-error">{organizationErrMsg}</span>
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      {loader && (
                        <CircularProgress size="1.2rem" thickness="1.5" />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>CANCEL</Button>
            <ButtonLoader
              loading={submitLoader}
              disabled={disabled}
              title={"SUBMIT"}
              handleClick={(e) => submit(e)}
            />
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
export default CompanyIdPopup;
