import React, { useState, useEffect, useMemo, useContext } from "react";
//mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
//mui icon
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Convert from "../common/Convert";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import "./Overview.css";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { PotentialApi } from "../../apis/PotentialApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SendEmailAPI } from "../../apis/SendEmailApi";
import { SentEmail } from "../common/SentEmail";
import { SnackBar } from "../common/SnackBar";
import OverviewTab from "../common/OverviewTab";
import { Toaster } from "../common/Toaster";
//import global css
import "../../styles/global/common.css";
import { DataContext } from "../../context";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import { INVALID_ID_DATA } from "../../utils/constants";

const PotentialsOverview = () => {
  const params = useParams();
  const location = useLocation();
  const { overviewHeaderData, setOverviewHeaderData } = useContext(DataContext);
  // const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [toEmail, setToEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailCc, setEmailCc] = useState([]);
  const [emailBcc, setEmailBcc] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCc, setIsCc] = useState(false);
  const [isBcc, setIsBcc] = useState(false);
  // const [usersEmail, setUsersEmail] = useState([]);
  const [maxSize, setMaxSize] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [emailToast, setEmailToast] = useState(false);
  const [openMail, setOpenMail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  // const current_page = localStorage.getItem("current_page");
  //sentemail error state
  const [subjectErr, setSubjectErr] = useState("");
  const [bodyErr, setBodyErr] = useState("");
  const data = useMemo(
    () => [{ eventKey: "deal", label: "Convert to Deal" }],
    []
  );

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const getUserData = () => {
    PotentialApi.getDataById(params?.id)
      .then((res) => {
        const header = {
          full_name: res?.data?.attributes?.contact_detail?.full_name,
          sub_head: res?.data?.attributes?.contact_detail?.designation,
          email: res?.data?.attributes?.contact_detail?.email,
        };
        setOverviewHeaderData(header);
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  useEffect(() => {
    if (!overviewHeaderData) {
      getUserData();
    }
    if (location?.state?.type === "email") {
      setOpenMail(true);
      setToEmail(location?.state?.email);
    }
  }, [!location?.state?.type]);

  const backNavigation = () => {
    navigate(`/potential`);
  };

  const editPotential = () => {
    if (splitLocation[3] === "lead-detail") {
      navigate(`/potential/lead-detail/update/${params?.id}`);
    } else {
      navigate(`/potential/update/${params?.id}`);
    }
  };

  const handleConvert = (val) => {
    let data = {
      potential_ids: [params?.id],
      convert_to: val,
    };
    PotentialApi.massConvert({ data })
      .then((response) => {
        Toaster.TOAST(response?.message, "success");
        navigate(`/deal/create/${response?.record_id}`);
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const splitLocation = location?.pathname.split("/");

  const navigationData = [
    {
      handleClick: () => navigate(`/potential/${params?.id}/overview`),
      title: "Overview",
      listItemIconTxt: "overview",
    },
    {
      handleClick: () => navigate(`/potential/${params?.id}/note`),
      title: "Notes",
      listItemIconTxt: "note",
    },
    {
      handleClick: () => navigate(`/potential/${params?.id}/task`),
      title: "Tasks",
      listItemIconTxt: "task",
    },
    {
      handleClick: () => navigate(`/potential/${params?.id}/meeting`),
      title: "Meetings",
      listItemIconTxt: "meeting",
    },
    {
      handleClick: () => navigate(`/potential/${params?.id}/call-information`),
      title: "Calls",
      listItemIconTxt: "call-information",
    },
    {
      handleClick: () => navigate(`/potential/${params?.id}/lead-detail`),
      title: "Lead Details",
      listItemIconTxt: "lead-detail",
    },
  ];

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleClose = () => {
    setOpenMail(false);
    setAnchorEl(null);
    setIsCc(false);
    setIsBcc(false);
    setMaxSize(false);
    setEmailSubject("");
    setEmailBody("");
    setSubjectErr("");
    setBodyErr("");
    setEmailCc([]);
    setEmailBcc([]);
    setEmailBody("");
    setExpanded(true);
  };

  const handleSubject = (e) => {
    setEmailSubject(e?.target?.value);
    if (e?.target?.value?.length === "") {
      setSubjectErr("Subject can't be empty");
    } else {
      setSubjectErr("");
    }
  };

  const handleAttachment = (val, action) => {
    if (action === "add") {
      setAttachments((prev) => [...prev, val]);
    } else if (action === "remove") {
      setAttachments((prev) => prev.filter((elem) => elem?.name !== val));
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

  const bccRecipients = emailBcc?.map((recipient, index) => {
    return JSON.stringify(recipient?.attributes?.email);
  });

  const ccRecipients = emailCc?.map((recipient, index) => {
    return JSON.stringify(recipient?.attributes?.email);
  });

  const handleEmailSubmit = () => {
    setEmailToast(false);
    handleValidation();
    if (emailSubject?.length !== 0 && emailBody?.length !== 0) {
      const formData = new FormData();
      formData.append("data[lead_emailable_id]", params?.id);
      formData.append("data[lead_emailable_type]", "Potential");
      formData.append("data[body]", emailBody);
      formData.append("data[subject]", emailSubject);
      formData.append("data[cc_emails][]", ccRecipients);
      formData.append("data[bcc_emails][]", bccRecipients);
      attachments?.map(
        (item, index) => (
          formData.append(
            `data[lead_email_attachments_attributes][${index}][name]`,
            item?.name
          ),
          formData.append(
            `data[lead_email_attachments_attributes][${index}][attachment]`,
            item?.attachment
          )
        )
      );
      setLoading(true);
      SendEmailAPI.create(formData)

        .then(function (res) {
          if (!res?.error && res?.data) {
            handleClose();
            setEmailToast(true);
            setAttachments([]);
          } else {
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

  return (
    !Invalid_data && (
      <Box>
        {emailToast && <SnackBar setEmailToast={setEmailToast} />}
        <Card
          variant="outlined"
          className="ma-leads-box border-0 overflow-visible"
        >
          <Box>
            <div className="tobNavigation ma-overview-heading">
              <div className="border-0">
                <Typography className="createlead-heading p-0 border-0">
                  <ArrowBackIcon
                    className="Arrowbtn-mr"
                    onClick={backNavigation}
                  />
                  <span>
                    {overviewHeaderData?.full_name
                      ? overviewHeaderData?.full_name
                      : "N/A"}{" "}
                    |{" "}
                  </span>{" "}
                  <span className="role_text">
                    {" "}
                    {overviewHeaderData?.sub_head || "No Designation"}
                  </span>
                </Typography>
              </div>
              <div>
                <Button
                  className="CreateLeadButton"
                  onClick={(e) => {
                    setToEmail(overviewHeaderData?.email);
                    setOpenMail(true);
                  }}
                >
                  <MailOutlineIcon />
                  <div className="sendEmailtext"></div> Send Email
                </Button>
                <SentEmail
                  toEmail={toEmail}
                  emailSubject={emailSubject}
                  emailCc={emailCc}
                  emailBcc={emailBcc}
                  anchorEl={anchorEl}
                  isCc={isCc}
                  isBcc={isBcc}
                  emailBody={emailBody}
                  setEmailBody={setEmailBody}
                  handleAttachment={handleAttachment}
                  setIsCc={setIsCc}
                  setIsBcc={setIsBcc}
                  setEmailCc={setEmailCc}
                  setEmailBcc={setEmailBcc}
                  handleClose={handleClose}
                  handleSubject={handleSubject}
                  handleEmailSubmit={handleEmailSubmit}
                  maxSize={maxSize}
                  setMaxSize={setMaxSize}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  subjectErr={subjectErr}
                  bodyErr={bodyErr}
                  setBodyErr={setBodyErr}
                  openMail={openMail}
                  loading={loading}
                />
              </div>
            </div>
            <CardContent className="p-0 border-0">
              <OverviewTab navigationData={navigationData} />
              <Box className="ma-convertEdit-bar ma-Divider-bar ma-piplineLost-lead">
                <Convert
                  data={data}
                  handleConvert={handleConvert}
                  handleLostConvert={""}
                />
                <Button
                  className="ms-2 me-2 ma-edit-btn"
                  onClick={editPotential}
                >
                  <EditOutlinedIcon />
                  Edit Details
                </Button>
                <Button className="d-none">
                  <MoreHorizIcon />
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Box>
    )
  );
};

export default PotentialsOverview;
