import React, { useState } from "react";
//mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import "../Leads/Overview.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { SentEmail } from "../common/SentEmail";
import { SendEmailAPI } from "../../apis/SendEmailApi";
import { SnackBar } from "../common/SnackBar";
import { Grid, List, ListItem, ListItemText } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./RolesPermissions.css";
import { activeUserData } from "../../Data/data";
import { Toaster } from "../common/Toaster";
//import global css
import "../../styles/global/common.css";
import { restMethodError } from "../../constants/errorMessages";

const UserOverview = ({ children, user, data }) => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [toEmail, setToEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailCc, setEmailCc] = useState([]);
  const [emailBcc, setEmailBcc] = useState([]);
  const [openMail, setOpenMail] = useState(false);
  const [isCc, setIsCc] = useState(false);
  const [isBcc, setIsBcc] = useState(false);
  const [maxSize, setMaxSize] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [emailToast, setEmailToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const splitLocation = location?.pathname ? location.pathname.split("/") : [];
  //sentemail error state
  const [subjectErr, setSubjectErr] = useState("");
  const [bodyErr, setBodyErr] = useState("");
  const [val, setVal] = useState("");
  let userData = JSON.parse(localStorage.getItem("user_info"));
  const user_id = localStorage.getItem("login_id");

  const navigationData = [
    {
      handleClick: () => {
        if (searchParams.get("filter")) {
          navigate(
            `/roles-permissions/manage-users/user-details/${
              params?.id
            }?filter=${searchParams.get("filter")}&page=${searchParams.get(
              "page"
            )}`
          );
        } else {
          navigate(
            `/roles-permissions/manage-users/user-details/${params?.id}`
          );
        }
      },
      title: "User Details",
      listItemIconTxt: "user-details",
    },
    {
      handleClick: () => {
        if (searchParams.get("filter")) {
          navigate(
            `/roles-permissions/data-permission/${
              params?.id
            }?filter=${searchParams.get("filter")}&page=${searchParams.get(
              "page"
            )}`,
            {
              state: {
                type: true,
                data: user,
              },
            }
          );
        } else {
          navigate(`/roles-permissions/data-permission/${params?.id}`, {
            state: {
              type: true,
              data: user,
            },
          });
        }
      },
      title: "Data & Permissions",
      listItemIconTxt: "data-permission",
    },
  ];
  const backNavigation = () => {
    if (location?.state?.title === "hierarchy") {
      navigate(`/roles-permissions/hierarchy`);
    } else if (location?.state?.title === "update_user_details") {
      if (searchParams.get("filter")) {
        navigate(
          `/roles-permissions/manage-users/user-details/${
            params?.id
          }?filter=${searchParams.get("filter")}&page=${searchParams.get(
            "page"
          )}`
        );
      } else {
        navigate(`/roles-permissions/manage-users/user-details/${params?.id}`);
      }
    } else {
      if (searchParams.get("filter")) {
        navigate(
          `/roles-permissions/manage-users?filter=${searchParams.get(
            "filter"
          )}&page=${searchParams.get("page")}`
        );
      } else {
        navigate(`/roles-permissions/manage-users`);
      }
    }
  };
  const editLead = () => {
    let url;
    if (searchParams.get("filter")) {
      url = `/roles-permissions/manage-users/user-details/update/${
        params?.id
      }?filter=${searchParams.get("filter")}&page=${searchParams.get("page")}`;
    } else {
      url = `/roles-permissions/manage-users/user-details/update/${params?.id}`;
    }
    navigate(url, {
      state: {
        title: "update_user_details",
      },
    });
  };

  const handleClose = () => {
    setOpenMail(false);
    setIsCc(false);
    setIsBcc(false);
    setEmailSubject("");
    setEmailBody("");
    setSubjectErr("");
    setBodyErr("");
    setEmailCc([]);
    setEmailBcc([]);
    setExpanded(true);
  };

  const handleSubject = (e) => {
    setEmailSubject(e.target.value);
    if (e.target.value?.length === "") {
      setSubjectErr("Subject can't be empty");
    } else {
      setSubjectErr("");
    }
  };

  const handleAttachment = (val, action) => {
    if (action === "add") {
      setAttachments((prev) => [...prev, val]);
    } else if (action === "remove") {
      setAttachments((prev) => prev.filter((elem) => elem.name !== val));
    }
  };

  const handleValidation = () => {
    if (!emailSubject) {
      setSubjectErr("Subject can't be empty");
    }
    if (!emailBody) {
      setBodyErr("Email body can't be empty");
    }
  };

  const bccRecipients = emailBcc?.map((recipient, key) => {
    return JSON.stringify(recipient?.attributes?.email);
  });

  const ccRecipients = emailCc?.map((recipient, key) => {
    return JSON.stringify(recipient?.attributes?.email);
  });

  const handleEmailSubmit = () => {
    setEmailToast(false);
    handleValidation();
    if (emailSubject?.length !== 0 && emailBody?.length !== 0) {
      const formData = new FormData();
      formData.append("data[lead_emailable_id]", user_id);
      formData.append("data[lead_emailable_type]", "User");
      formData.append("data[body]", emailBody);
      formData.append("data[subject]", emailSubject);
      formData.append("data[cc_emails][]", ccRecipients);
      formData.append("data[bcc_emails][]", bccRecipients);
      attachments.map((item, index) => {
        formData.append(
          `data[lead_email_attachments_attributes][${index}][name]`,
          item?.name
        );
        formData.append(
          `data[lead_email_attachments_attributes][${index}][attachment]`,
          item?.attachment
        );
      });
      setLoading(true);
      SendEmailAPI.create(formData)

        .then(function (res) {
          if (!res?.error && res?.data) {
            handleClose();
            Toaster.TOAST(res?.message, "success");
            setEmailToast(true);
            setAttachments([]);
          } else {
            Toaster.TOAST(res?.errors || res?.error, "error");
            setEmailToast(false);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    }
  };

  const handleTitle = (item, title) => {
    if (userData?.role?.role_name !== "executive") {
      return title;
    } else {
      if (item !== "data-permission") {
        return title;
      }
    }
  };

  return (
    <>
      {emailToast && <SnackBar setEmailToast={setEmailToast} />}

      <Card
        variant="outlined"
        className="ma-leads-box border-0 overflow-visible"
      >
        <>
          <div className="ma-mainShadow-box">
            <div className="tobNavigation ma-overview-heading">
              <div className="border-0">
                <Typography className="createlead-heading p-0 border-0">
                  <ArrowBackIcon
                    className="Arrowbtn-mr"
                    onClick={backNavigation}
                  />{" "}
                  <span>{user?.full_name ? user?.full_name : "N/A"} | </span>{" "}
                  <span className="role_text">
                    {user?.sub_head ? user?.sub_head : "N/A"}
                  </span>
                </Typography>
              </div>
              <div>
                <Button
                  className="CreateLeadButton"
                  onClick={() => {
                    setToEmail(user?.email);
                    setOpenMail(true);
                  }}
                >
                  <MailOutlineIcon />
                  <div className="sendEmailtext">Send Email</div>
                </Button>
                <SentEmail
                  toEmail={toEmail}
                  emailSubject={emailSubject}
                  emailCc={emailCc}
                  emailBcc={emailBcc}
                  emailBody={emailBody}
                  setEmailCc={setEmailCc}
                  setEmailBcc={setEmailBcc}
                  openMail={openMail}
                  isCc={isCc}
                  isBcc={isBcc}
                  setEmailBody={setEmailBody}
                  handleAttachment={handleAttachment}
                  setIsCc={setIsCc}
                  setIsBcc={setIsBcc}
                  handleClose={handleClose}
                  handleSubject={handleSubject}
                  handleEmailSubmit={handleEmailSubmit}
                  maxSize={maxSize}
                  attachments={attachments}
                  setMaxSize={setMaxSize}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  subjectErr={subjectErr}
                  bodyErr={bodyErr}
                  setBodyErr={setBodyErr}
                  loading={loading}
                />
              </div>
            </div>
            <CardContent className="p-0 border-0">
              {user?.sub_head !== "Super Admin" &&
                user?.sub_head !== "Admin" && (
                  <Box className="ma-overView-tab">
                    <Grid container>
                      <Grid item xs={4} md={4}>
                        <List className="ma-role-tabbar">
                          {navigationData?.map((item, id) => {
                            return (
                              <ListItem
                                key={id}
                                className={`${
                                  splitLocation[3] ===
                                  `${item?.listItemIconTxt}`
                                    ? "ma-active-tab"
                                    : "ma-deactive-tab"
                                }
                                   ${
                                     splitLocation[2] ===
                                     `${item?.listItemIconTxt}`
                                       ? "ma-active-tab"
                                       : "ma-deactive-tab"
                                   }`}
                                onClick={() =>
                                  userData?.role?.name !== "User" &&
                                  item.handleClick()
                                }
                                sx={{
                                  cursor:
                                    userData?.role?.name !== "User" &&
                                    "pointer",
                                }}
                              >
                                <ListItemText
                                  primary={handleTitle(
                                    item?.listItemIconTxt,
                                    item?.title
                                  )}
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              <Box className="ma-convertEdit-bar ma-Divider-bar ma-piplineLost-lead">
                <div className="searchFilterDiv justify-content-end">
                  {location?.pathname ===
                    `/roles-permissions/manage-users/user-details/` +
                      params?.id &&
                    data?.can_modify_user?.can_edit_details !== false && (
                      <Button className="ma-edit-btn" onClick={editLead}>
                        <EditOutlinedIcon />
                        Edit Details
                      </Button>
                    )}
                  {location?.pathname ===
                    "/roles-permissions/data-permission" && (
                    <div className="ma-convertEdit-bar ma-Divider-bar p-0">
                      <Select
                        labelid="demo-simple-select-autowidth-label"
                        id="demo-select-small"
                        value={val}
                        onChange={(e) => {
                          setVal(e.target.value);
                        }}
                        className="filterSelect ma-menuFont-family"
                        placeholder="action"
                        displayEmpty
                      >
                        <MenuItem
                          className="ma-menuFont-family"
                          disabled
                          value=""
                        >
                          Active Users
                        </MenuItem>
                        {activeUserData?.map((item, key) => {
                          return (
                            <MenuItem
                              className="ma-menuFont-family"
                              key={item.id}
                              value={item.value}
                            >
                              {item.title}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  )}
                </div>
              </Box>
              {children}
            </CardContent>
          </div>
        </>
      </Card>
    </>
  );
};

export default UserOverview;
