import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Switch from "@mui/material/Switch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useOutletContext } from "react-router-dom";
import moment from "moment";
import { personalApi } from "../../apis/PersonalApi";
import { Toaster } from "../../pages/common/Toaster";
// import global css
import "../../styles/global/common.css";
import { userApi } from "../../apis/userApi";
import { FormControlLabel } from "@mui/material";
import { getMethodError, restMethodError } from "../../constants/errorMessages";

const useStyles = makeStyles({
  passwordHeading: {
    fontSize: "16px",
    color: "#0d47a1",
    fontWeight: "500 !important",
    cursor: "pointer",
    paddingBottom: "5px",
  },
  greyText: {
    fontSize: "13px",
    color: "#8C8DA3",
    fontWeight: "500",
  },
  Authentication: {
    fontSize: "20px",
    fontWeight: "500 !important",
    color: "#191A47",
  },
  paragraph: {
    fontSize: "13px",
    color: "#8C8DA3",
  },
  enable: {
    fontSize: "14px",
    marginBottom: "0",
  },
  session: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#191A47",
    paddingBottom: "5px",
    lineHeight: "30px",
  },
});

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    background: "#2c42b5",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
    background: "white",
  },
  "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
    background: "#2c42b5 !important",
    opacity: "2 !important",
  },
}));

const Password = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [
    navigationData,
    setDrawerData,
    setOpen,
    profileNavigationData,
    setIsProfileDrawer,
  ] = useOutletContext();
  const user_id = localStorage.getItem("login_id");
  let userInfo = JSON.parse(localStorage.getItem("user_info"));
  let update_date = userInfo?.updated_at;
  const [searchParams, setSearchParams] = useSearchParams();

  const updateToggle = () => {
    let userData = JSON.parse(localStorage.getItem("user_info"));
    const formData = new FormData();
    let checked = userData?.fa_enabled ? false : true;
    formData.append("data[fa_enabled]", checked);
    userApi
      .update(formData, user_id)
      .then(function (res) {
        if (res?.data) {
          localStorage.setItem(
            "user_info",
            JSON.stringify(res?.data?.attributes)
          );
          Toaster.TOAST("User updated successfully!", "success");
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleChangePassword = () => {
    if (userInfo?.auth_provider) {
      navigate("/forgot-password");
    } else {
      navigate("/change-password");
    }
  };

  const handleOpenform = () => {
    personalApi
      .logOutSessions()
      .then((response) => {
        localStorage.clear();
        if (searchParams) {
          searchParams.delete("filter");
          setSearchParams(searchParams);
        }
        Toaster.TOAST("Logged off From all Sessions", "success");
        setTimeout(() => navigate("/"), 300);
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    setOpen(true);
    setDrawerData(profileNavigationData);
    setIsProfileDrawer(true);
  }, []);

  const backNavigation = () => {
    setIsProfileDrawer(false);
    navigate("/dashboard");
    setDrawerData(navigationData);
    setOpen(false);
  };

  return (
    <Box className="ma-leads-box d-flex">
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
        className="ma-mainTop-box mainBox"
      >
        <Paper elevation={2} className="ma-mainShadow-box createlead-page">
          <Typography className="createlead-heading">
            <ArrowBackIcon
              className="Arrowbtn-mr"
              onClick={(e) => backNavigation()}
            />
            <span data-testid="password" className="roleTxt">
              Password and Login
            </span>
          </Typography>
          <Box className="px-4">
            <div className="pt-4 pb-2">
              <Typography
                onClick={() => handleChangePassword()}
                className={classes.passwordHeading}
              >
                {userInfo?.auth_provider ? "Reset Password" : "Change Password"}
              </Typography>
              <Typography className={classes.greyText}>
                Last changed on {moment(update_date).format("MMMM Do YYYY")}{" "}
              </Typography>
            </div>
            <hr className="horizontal-divider" />
          </Box>
          <Box className="px-4">
            <div className="pt-4 pb-2">
              <Typography variant={"h5"} className={classes.Authentication}>
                Two Factor Authentication
              </Typography>
              <Typography variant="paragraph" className={classes.paragraph}>
                Protect your Pivott account {userInfo?.email} with two-factor
                authentication via email. Once enabled, then the next time you
                log in, you are asked to click the verification link in an email
                to access your account. You only need to verify yourself every
                30 days on each device.
              </Typography>
              <Box className="d-flex align-items-center mx-2 px-1">
                <FormControlLabel
                  onClick={() => updateToggle()}
                  control={
                    <Android12Switch
                      className="ps-0"
                      defaultChecked={userInfo?.fa_enabled}
                    />
                  }
                />
                <Typography className={classes.enable}>
                  {" "}
                  Enable Two Factor Authentication
                </Typography>
              </Box>
            </div>
            <hr className="horizontal-divider" />
          </Box>

          <Box className="px-4 pb-5">
            <div className="pt-4 pb-2">
              <Typography variant={"h5"} className={classes.session}>
                Session Reset
              </Typography>
              <Typography
                onClick={() => {
                  handleOpenform();
                }}
                className={classes.passwordHeading}
              >
                Log Out Of All Sessions
              </Typography>
              <Typography variant="paragraph" className={classes.paragraph}>
                This will log you out of all devices and sessions, including
                this active one.
              </Typography>
            </div>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Password;
