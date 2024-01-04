import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactMultiEmail } from "react-multi-email";
import { userApi } from "../../apis/userApi";
import { Toaster } from "../common/Toaster";
import debouce from "lodash.debounce";
import OwnerDropdown from "../common/OwnerDropdown";
import "react-multi-email/dist/style.css";
import "../../styles/global/common.css";
import { ButtonLoader } from "../common/ButtonLoader";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { EXECUTIVE, INVITE_VIA_EMAIL } from "../../utils/constants";
import { RolesApi } from "../../apis/RolesApi";
import { featureFlag } from "../../utils/splitConfig";

const AddNewUser = ({ handleToCloseLT, openNewUser, setAddNewUserClick }) => {
  const [email, setEmail] = useState();
  const [role, setRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [userRoles, setUserRoles] = useState();
  const [isEmail, setIsEmail] = useState(false);
  //manager
  const [managerId, setManagerId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [viaEmail, setViaEmail] = useState("invite_via_email");
  const [viaLink, setViaLink] = useState("");
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const [loading, setLoading] = useState(false);
  const superAdminNote =
    "*To include multiple super administrators, kindly reach out to our designated contact.";

  useEffect(() => {
    userApi
      .getRole()
      .then((resp) => {
        setUserRoles(resp?.data);
        resp.data.filter((elem) => {
          if (elem.attributes.role_name === EXECUTIVE) {
            setRole(elem.id);
          }
        });
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
    setManagerId(userInfo?.id);
    setManagerName(userInfo?.full_name);
  }, []);

  useEffect(() => {
    if (viaEmail !== INVITE_VIA_EMAIL && !viaLink) {
      getLinkData();
    }
  }, [viaEmail]);

  useEffect(() => {
    if (!srchUser) {
      getManagerData();
    }
  }, [srchUser]);

  const getLinkData = () => {
    RolesApi.getLink()
      .then((res) => {
        setViaLink(res?.invitation_link);
      })
      .catch((error) => console.log(error));
  };

  const getManagerData = (srchQuery) => {
    userApi
      .getUsers(srchQuery)
      .then((data) => {
        setUserLoading(true);
        if (data?.data) {
          setUsersData(data?.data);
          setUserLoading(false);
        } else {
          setUsersData([]);
          setUserLoading(false);
        }
      })
      .catch((error) => {
        setUserLoading(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const debounceSaveUser = React.useCallback(
    debouce(function (e) {
      if (e) {
        getManagerData(e);
      }
    }, 800),
    []
  );

  const getUserData = (event, newValue) => {
    if (newValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }
    setManagerName(newValue);
  };

  const handleManager = (event, val) => {
    setManagerId(val?.id);
  };

  const handleValidate = () => {
    if (!role) {
      setRoleError("Role must be selected");
    }
    if (!email) {
      setEmailError("Email can't be empty");
    }
  };

  const getHandleEmail = (val) => {
    setEmail(val);
    if (!val?.length) {
      setEmailError("Email can't be empty");
      setIsEmail(true);
    } else {
      setEmailError("");
      setIsEmail(false);
    }
  };

  const handleRole = (e) => {
    setRole(e.target.value);
    if (!e.target.value) {
      setRoleError("Role must be selected");
    } else if (e.target.value === 1) {
      setRoleError(superAdminNote);
    } else {
      setRoleError("");
    }
  };

  const handleViaEmail = (event) => {
    let val = event.target.value;
    setViaEmail(val);
    setEmailError("");
    setEmail();
  };

  const handleCopyClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(viaLink)
        .then(() => {
          setSnackbarOpen(true);
        })
        .catch((err) => {});
    } else {
      console.warn("Clipboard API not supported");
    }
  };

  const handleClick = () => {
    handleValidate();
    let data = {
      role_id: parseInt(role),
      parent_id: parseInt(managerId),
      emails: email,
    };

    if (email) {
      setLoading(true);
      userApi
        .inviteUser(data)
        .then(function (response) {
          Toaster.TOAST(response?.message, "success");
          setAddNewUserClick();
          handleToCloseLT();

          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    }
  };

  return (
    <Dialog
      sx={{
        position: "absolute",
        zIndex: "1000",
      }}
      className="ma-popup-boxHolder"
      open={openNewUser}
      onClose={handleToCloseLT}
    >
      <DialogTitle className="ma-leadTransferTitle">
        <label>Add New User</label>
        <DialogActions sx={{ padding: "0" }}>
          <Button
            className="ma-cross-btn"
            onClick={handleToCloseLT}
            color="primary"
            autoFocus
          >
            <CloseIcon />
          </Button>
        </DialogActions>{" "}
      </DialogTitle>
      <DialogContent>
        <div className="ma-parentLT">
          <Grid container xs={12} md={12} gap="20px 35px">
            {featureFlag("enable_invite_link") && (
              <Grid
                item={true}
                xs={12}
                md={12}
                className={"createlead-detail-grid"}
              >
                <FormControl className="radio-button-label">
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={viaEmail}
                    onChange={handleViaEmail}
                  >
                    <FormControlLabel
                      className="radio-label"
                      value="invite_via_email"
                      control={<Radio />}
                      label="Invite via Email"
                      sx={{ marginRight: "30px", fontSize: "14px !important" }}
                    />
                    <FormControlLabel
                      className="radio-label"
                      value="invite_via_link"
                      control={<Radio />}
                      label="Invite via Link"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}

            {viaEmail === INVITE_VIA_EMAIL ? (
              <>
                <Grid
                  item={true}
                  xs={12}
                  md={12}
                  className={"createlead-detail-grid"}
                >
                  <label className="labeltxt">
                    <span className="requreiedField">*</span>Email
                  </label>
                  <ReactMultiEmail
                    className="placeholder_field"
                    placeholder="Enter Email Address"
                    emails={email}
                    onChange={(_emails) => getHandleEmail(_emails)}
                    getLabel={(email, index, removeEmail) => {
                      return (
                        <div data-tag key={index}>
                          <div data-tag-item>{email}</div>
                          <span
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      );
                    }}
                  />
                  {/* </Grid> */}
                  {emailError && <span className="ma-error">{emailError}</span>}
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                  <label className="labeltxt ">
                    <span className="requreiedField">*</span>Role{" "}
                  </label>
                  <TextField
                    data-testid="share_folder"
                    className="createlead-textField placeholder_field"
                    id="share_folder"
                    value={role}
                    select
                    fullWidth
                    placeholder="Selected User"
                    name="share_folder"
                    onChange={(e) => handleRole(e)}
                    error={roleError}
                    helperText={
                      <span
                        className={
                          roleError === superAdminNote
                            ? "requreiedField"
                            : "ma-error"
                        }
                      >
                        {roleError}
                      </span>
                    }
                    label={!role && "Select role"}
                    InputLabelProps={{
                      shrink: false,
                      style: {
                        color: "#8c8da3",
                        fontSize: "14px",
                      },
                    }}
                  >
                    {userRoles?.map((role) => {
                      return (
                        <MenuItem key={role?.id} value={role?.id}>
                          {role?.attributes?.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <label className="labeltxt ">Report To</label>
                  <OwnerDropdown
                    users={usersData}
                    contactsValue={managerName}
                    getContactData={getUserData}
                    handleContactId={handleManager}
                    userLoading={userLoading}
                    placeholder="Select report to"
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  item={true}
                  xs={12}
                  md={12}
                  className={"createlead-detail-grid"}
                >
                  <label className="labeltxt">Add to team</label>
                  <TextField
                    className="placeholder_field"
                    placeholder="Enter link"
                    value={viaLink}
                    disabled
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {viaLink && (
                            <IconButton onClick={handleCopyClick}>
                              <FileCopyIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Snackbar
                  anchorOrigin={{ horizontal: "center", vertical: "top" }}
                  open={isSnackbarOpen}
                  autoHideDuration={2000}
                  onClose={() => {
                    setSnackbarOpen(false);
                  }}
                  message="Text copied to clipboard"
                />
              </>
            )}
          </Grid>
        </div>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#F9F9FB", padding: "0" }}>
        <div className="listMDbutton">
          <Button className="cancel me-3" autoFocus onClick={handleToCloseLT}>
            CANCEL
          </Button>
          <ButtonLoader
            loading={loading}
            classStyle={"applay m-0"}
            testid={"save"}
            title={viaEmail === INVITE_VIA_EMAIL ? "ADD" : "COPY LINK"}
            autoFocus={true}
            handleClick={() =>
              viaEmail === INVITE_VIA_EMAIL ? handleClick() : handleCopyClick()
            }
          />
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewUser;
