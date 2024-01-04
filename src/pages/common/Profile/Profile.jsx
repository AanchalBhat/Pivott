import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Avatar } from "@mui/material";
import ExitToAppSharpIcon from "@mui/icons-material/ExitToAppSharp";
import { profileImage } from "../../../assets";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { Button } from "@material-ui/core";

function Profile({
  openProfile,
  anchorEl,
  handleClose,
  id,
  handleProfileDrawer,
  handleOpenform,
}) {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const navigate = useNavigate();
  return (
    <div className="ma-profilePopup-div">
      <Popover
        id={id}
        className="ma-profilePopup-holder"
        open={openProfile}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={5}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            borderRadius: 0,
            marginTop: "2rem",
            paddingTop: "20px",
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <span className="ma-topShape-popup"> </span>
        <Box className="d-flex pt-2 pb-3">
          <Avatar
            className="d-flex align-items-center me-3"
            aria-label="recipe"
            alt="Remy Sharp"
            src={
              userInfo?.profile_photo?.url
                ? userInfo?.profile_photo?.url
                : profileImage
            }
            sx={{
              maxWidth: "46px",
              height: "46px",
              width: "100%",
            }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "18px",
                color: "#444B6E",
                lineHeight: "21px",
                width: "200px",
                boxSizing: "border-box",
                textTransform: "capitalize",
                fontWeight: 500,
              }}
            >
              {userInfo?.full_name ? userInfo?.full_name : null}
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#5E5F7E",
                fontWeight: 400,
                marginTop: "9px",
                marginBottom: "5px",
              }}
            >
              {userInfo?.email ? userInfo?.email : null}
            </Typography>
            <Typography
              sx={{
                color: "#2C42B5",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
              onClick={() => handleProfileDrawer()}
            >
              Profile & Preferences
            </Typography>
          </Box>
        </Box>
        <hr className="horizontal-divider" />
        <Box className="d-flex">
          <Box>
            <Typography
              className="py-1"
              sx={{ fontSize: "13px", color: "#8C8DA3" }}
            >
              Your Organization
            </Typography>
            <Typography
              sx={{
                color: "#2C42B5",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onClick={() => handleProfileDrawer()}
            >
              {userInfo?.company_name ? userInfo?.company_name : "-"}
            </Typography>
          </Box>
        </Box>
        <hr className="horizontal-divider" />

        <Box className="d-flex justify-content-between">
          <Box>
            <Typography
              variant="paragraph"
              sx={{ color: "#8C8DA3", fontSize: "13px" }}
              className="d-flex align-items-start mb-1"
            >
              Subscription
            </Typography>
            <Typography
              className="d-flex align-items-start"
              variant="paragraph"
              sx={{ fontSize: "14px" }}
            >
              Free Plan
            </Typography>
          </Box>
          <Button
            className="createlead-buttons__Upgradbutton Upgradebtntext ma-header-btn shadow-none"
            type="submit"
            variant="contained"
            color="info"
            sx={{
              fontSize: '16px',
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            UPGRADE
          </Button>
        </Box>
        <hr className="horizontal-divider" />
        <Box className="d-flex justify-content-between">
          <Box className="ma-profile-popup">
            {userInfo?.role?.role_name !== "executive" && (
              <Typography
                sx={{ fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                onClick={(e) => {
                  handleClose();
                  setTimeout(() => {
                    navigate("/roles-permissions/manage-users");
                  }, 500);
                }}
              >
                Admin Panel (Roles & Permission)
              </Typography>
            )}

            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
              Chat with us{" "}
            </Typography>
            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
              Write to us{" "}
            </Typography>
          </Box>
        </Box>
        <hr className="horizontal-divider" />
        <Box
          sx={{ marginTop: "5px", marginBottom: "5px" }}
          className="d-flex justify-content-between"
        >
          <Typography
            onClick={() => handleOpenform()}
            sx={{
              fontSize: "14px",
              cursor: "pointer",
              color: "#191A47",
              fontWeight: 500,
            }}
          >
            <ExitToAppSharpIcon className="me-2" />
            <span>Log Out</span>
          </Typography>
        </Box>
      </Popover>
    </div>
  );
}

export default React.memo(Profile);
