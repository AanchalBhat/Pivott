import React, { useState, useEffect } from "react";
import ArrowBack from "@mui/icons-material/ArrowBack";
//mui
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Close from "@material-ui/icons/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { userApi } from "../../../apis/userApi";
import zoomImg from "../../../assets/zoomcamera.svg";
import googleMeetImg from "../../../assets/google_meet.svg";
import webexImg from "../../../assets/webex.svg";
import skypeImg from "../../../assets/skype.svg";
import { Typography } from "@mui/material";
import "../../../styles/global/common.css";
import { ButtonLoader } from "../../../pages/common/ButtonLoader";
import { Toaster } from "../../../pages/common/Toaster";
import { getMethodError } from "../../../constants/errorMessages";

function ConnectApp(props) {
  const { handleClose, globalStatus } = props;
  const [disabled, setDisabled] = useState(true);
  const [goBack, setGoBack] = useState(false);
  const [app, setApp] = useState("");
  const [loader, setLoader] = useState(false);
  const user_info = JSON.parse(localStorage?.getItem("user_info"));
  const [redirectLink, setRedirectLink] = useState({
    webex: "#",
    skype: "#",
    google_meet: "#",
  });

  const handleCheck = () => {
    if (redirectLink[app] !== "#") {
      return true;
    }
    return false;
  }

  const handleGetwebexUrl = () => {
    setGoBack(true);
    userApi
      .getWebexUrl()
      .then((res) => {
        if (res?.url) {
          setRedirectLink((prev) => ({ ...prev, webex: res.url }))
        }
        setLoader(false);
        setDisabled(false);
      })
      .catch((error) => {
        setLoader(false);
        setDisabled(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const handleGetSkypeUrl = () => {
    setGoBack(true);
    userApi
      .getSkypeUrl()
      .then((res) => {
        if (res?.url) {
          setRedirectLink((prev) => ({ ...prev, skype: res.url }))
        }
        setLoader(false);
        setDisabled(false);
      })
      .catch((error) => {
        setLoader(false);
        setDisabled(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const handleGetGoogleUrl = () => {
    setGoBack(true);
    userApi
      .getGoogleUrl()
      .then((res) => {
        if (res?.url) {
          setRedirectLink((prev) => ({ ...prev, google_meet: res.url }))
        }
        setLoader(false);
        setDisabled(false);
      })
      .catch((error) => {
        setLoader(false);
        setDisabled(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleConnect = () => {
    if (app === "webex") {
      handleGetwebexUrl();
    } else if (app === "skype") {
      handleGetSkypeUrl();
    } else if (app === "google_meet") {
      handleGetGoogleUrl();
    }
  };

  useEffect(() => {
    const check = handleCheck();
    setLoader(true);
    if (check) {
      setLoader(false);
      setDisabled(false);
      return;
    }
    handleConnect();
  }, [app])

  const handleAppSelection = (val) => {
    localStorage.setItem("thirdparty_app", val);
    setApp(val);
    props.setLocation(val);
    setDisabled(false);
    setGoBack(false);
  };

  return (
    <>
      <div className="meetingDialogBox">
        <div className="">
          <button className="createtask_btn">
            {props?.meet?.id ? (
              <span className="createtask_txt">Edit Meeting</span>
            ) : (
              <span className="createtask_txt">Add Meeting</span>
            )}
            <Close
              style={{ color: "#fff", cursor: "pointer" }}
              onClick={() => handleClose()}
            />
          </button>
          <h6 className="filldetails_txt">Meeting Details</h6>
          {/* <span className="ma-error">{errorMsg}</span> */}
        </div>
        <div className="ma-calls-field">
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} className="ma-note-file">
                <Button className="Arrowbtn p-0" onClick={() => handleClose()}>
                  <ArrowBack /> Back {"  "}
                </Button>
                <p className="ma-connect-app">Connect App</p>
                <Typography
                  sx={{
                    display: goBack ? "block" : "none",
                    color: "var(--ma-primarymain-color)",
                    fontSize: "14px",
                  }}
                >
                  <span> (To continue, Go back!) </span>
                </Typography>
              </Grid>
              <Grid item xs={12} className="ma-note-file">
                <label className="duedate_text">Organizer</label>
                <TextField
                  name="Organizer"
                  size="medium"
                  disabled
                  sx={{ background: "#f1f1f4" }}
                  // id="Organizer"
                  placeholder="Organizer"
                  className="textfield_txt"
                  autoFocus
                  value={user_info?.full_name}
                />
              </Grid>
              <Grid item xs={6}>
                <div
                  className="appBox"
                  style={{
                    border:
                      app === "webex"
                        ? "1px solid #2C42B5"
                        : "1px solid #D1D1DA",
                  }}
                  onClick={() => {
                    handleAppSelection("webex");
                  }}
                >
                  {" "}
                  <div className="ma-meet-img">
                    <img src={webexImg} alt="Webex" />
                    <p className="my-2">Webex</p>
                    {globalStatus?.webex_access && (
                      <p className="ma-connect-icon">
                        <CheckCircleOutlineIcon sx={{ color: "#36B37E" }} />
                        connected
                      </p>
                    )}
                  </div>
                </div>
              </Grid>

              <Grid item xs={6}>
                <div
                  className="appBox"
                  style={{
                    border:
                      app === "skype"
                        ? "1px solid #2C42B5"
                        : "1px solid #D1D1DA",
                  }}
                  onClick={() => {
                    handleAppSelection("skype");
                  }}
                >
                  {" "}
                  <div>
                    <img src={skypeImg} alt="Skype" />
                    <p className="my-2">Skype</p>
                    {globalStatus?.skype_access && (
                      <p className="ma-connect-icon">
                        <CheckCircleOutlineIcon sx={{ color: "#36B37E" }} />
                        connected
                      </p>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  className="appBox"
                  style={{
                    border:
                      app === "google_meet"
                        ? "1px solid #2C42B5"
                        : "1px solid #D1D1DA",
                  }}
                  onClick={() => {
                    handleAppSelection("google_meet");
                  }}
                >
                  <div>
                    <img src={googleMeetImg} alt="Google Meet" />
                    <p className="my-2">Google Meet</p>
                    {globalStatus?.google_meet_access && (
                      <p className="ma-connect-icon">
                        <CheckCircleOutlineIcon sx={{ color: "#36B37E" }} />
                        connected
                      </p>
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  className="appBox"
                  style={{
                    border:
                      app === "zoom"
                        ? "1px solid #2C42B5"
                        : "1px solid #D1D1DA",
                  }}
                // onClick={() => handleAppSelection("zoom")}
                >
                  <div>
                    <img src={zoomImg} alt="Zoom" />
                    <p className="my-2">Zoom</p>
                    <p className="ma-connect-icon">(not in use for now)</p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <ButtonLoader
                  loading={loader}
                  disabled={disabled || loader}
                  classStyle={"FormAddbutton"}
                  btnType={"submit"}
                  handleClick={() => handleConnect()}
                  title={"CONNECT"}
                  href={redirectLink[app]}
                  style={{ textDecoration: "none", color: disabled || loader ? "transparent" : "#FFF" }}
                />
                <Button
                  variant="outlined"
                  className="FormCancelbutton cancel"
                  onClick={() => handleClose()}
                >
                  {" "}
                  CANCEL
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </>
  );
}

export default ConnectApp;
