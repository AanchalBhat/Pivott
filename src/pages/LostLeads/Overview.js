import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { LostLeadApi } from "../../apis/LostLeadApi";
import { SentEmail } from "../common/SentEmail";
import { SendEmailAPI } from "../../apis/SendEmailApi";
import { SnackBar } from "../common/SnackBar";
import Convert from "../common/Convert";
import { DataContext } from "../../context";
import OverviewTab from "../common/OverviewTab";
import { Toaster } from "../common/Toaster";
//import global css
import "../../styles/global/common.css";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import { INVALID_ID_DATA } from "../../utils/constants";

const LostsOverview = (props) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  const { overviewHeaderData, setOverviewHeaderData } = useContext(DataContext);
  const [toEmail, setToEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailCc, setEmailCc] = useState([]);
  const [emailBcc, setEmailBcc] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCc, setIsCc] = useState(false);
  const [isBcc, setIsBcc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  const [maxSize, setMaxSize] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [emailToast, setEmailToast] = useState(false);
  const [openMail, setOpenMail] = useState(false);
  //sentemail error state
  const [subjectErr, setSubjectErr] = useState("");
  const [bodyErr, setBodyErr] = useState("");
  // const current_page = localStorage.getItem("current_page");

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const data = [
    { eventKey: "lead", label: "Convert to Lead" },
    { eventKey: "pipeline", label: "Convert to Pipeline" },
    { eventKey: "potential", label: "Convert to Potential" },
    { eventKey: "deal", label: "Convert to Deal" },
  ];
  let navigationData = [
    {
      handleClick: () => navigate(`/lost-lead/${params?.id}/overview`),
      title: "Overview",
      listItemIconTxt: "overview",
    },
    {
      handleClick: () => navigate(`/lost-lead/${params?.id}/note`),
      title: "Notes",
      listItemIconTxt: "note",
    },
    {
      handleClick: () => navigate(`/lost-lead/${params?.id}/task`),
      title: "Tasks",
      listItemIconTxt: "task",
    },
    {
      handleClick: () => navigate(`/lost-lead/${params?.id}/meeting`),
      title: "Meetings",
      listItemIconTxt: "meeting",
    },
    {
      handleClick: () => navigate(`/lost-lead/${params?.id}/call-information`),
      title: "Calls",
      listItemIconTxt: "call-information",
    },
    {
      handleClick: () => navigate(`/lost-lead/${params?.id}/lead-detail`),
      title: "Lead Details",
      listItemIconTxt: "lead-detail",
    },
  ];
  const getUserData = () => {
    LostLeadApi.fetchOverview(params?.id)
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
    if (!location?.state?.type) {
    } else if (location?.state?.type === "email") {
      setOpenMail(true);
      setToEmail(location?.state?.email);
    }
  }, [!location?.state?.type]);

  const backNavigation = () => {
    navigate(`/lost-lead`);
  };

  const handleConvert = (val) => {
    const data = {
      lead_ids: [parseInt(params?.id)],
      convert_to: val,
    };

    LostLeadApi.convertType({ data })
      .then((response) => {
        switch (val) {
          case "pipeline":
            navigate(`/pipeline/create/${response?.record_id}`);
            break;
          case "potential":
            navigate(`/potential/create/${response?.record_id}`);
            break;
          case "lead":
            navigate(`/lead/create/${response?.record_id}`);
            break;
          case "deal":
            navigate(`/deal/create/${response?.record_id}`);
            break;
          default:
            // Handle any other cases
            break;
        }
        Toaster.TOAST(response?.message, "success");
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

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
      formData.append("data[lead_emailable_type]", "LostLead");
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
                    data-testid="arrow-back"
                    onClick={() => backNavigation()}
                  />
                  <span>
                    {" "}
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
                  data-testid="send-mail-btn"
                  onClick={(e) => {
                    setToEmail(overviewHeaderData?.email);
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
                <Button data-testid="more-btn" className="d-none">
                  <MoreHoriz />
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Box>
    )
  );
};

export default LostsOverview;
