import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
//mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// other imports
import "./Overview.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { LeadAPI } from "../../apis/LeadApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Convert from "../common/Convert";
import { DataContext } from "../../context";
import { SentEmail } from "../common/SentEmail";
import { SendEmailAPI } from "../../apis/SendEmailApi";
import { SnackBar } from "../common/SnackBar";
import OverviewTab from "../common/OverviewTab";
import { Toaster } from "../common/Toaster";
//import global css
import "../../styles/global/common.css";
import DropdownCreateEdit from "../common/Dropdowns_Crud/DropdownCreateEdit";
import LostPipelinePopup from "../../components/Pipeline/Details/PipelineOverview/LostPipeline";
import DropdownDelete from "../common/Dropdowns_Crud/DropdownDelete";
import { LostLeadApi } from "../../apis/LostLeadApi";
import {
  deleteMethodError,
  getMethodError,
  restMethodError,
} from "../../constants/errorMessages";
import { RECORD_EXIST, INVALID_ID_DATA } from "../../utils/constants";

const LeadsOverview = () => {
  let field_editLabel = "";
  // const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
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
  //sentemail error state
  const [subjectErr, setSubjectErr] = useState("");
  const [bodyErr, setBodyErr] = useState("");
  const location = useLocation();
  //dropdown_crud lost lead reason
  const [fieldName, setFieldName] = useState();
  const [fieldID, setFieldID] = useState();
  const [itemValue, setItemValue] = useState("");
  const [fieldErrMsg, setFieldErrMsg] = useState("");
  const [isEditModal, setIsEditModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);
  const [show, setShow] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [reason_id, setReasonId] = useState("");
  const [loading, setLoading] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);

  const { overviewHeaderData, setOverviewHeaderData, crudField } =
    useContext(DataContext);
  // const current_page = localStorage.getItem("current_page");
  let url = `${params?.id}`;
  const getUserData = () => {
    LeadAPI.getByid(params?.id)
      .then((res) => {
        const header = {
          full_name: res?.data?.attributes?.contact_detail?.full_name,
          sub_head: res?.data?.attributes?.contact_detail?.designation,
          email: res?.data?.attributes?.contact_detail?.email,
        };
        setOverviewHeaderData(header);
        localStorage.setItem("useDataPopup", JSON.stringify(res?.data));
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

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const navigationData = [
    {
      handleClick: () =>
        navigate(`/lead/${url}/overview`, { state: { type: "Lead" } }),
      title: "Overview",
      listItemIconTxt: "overview",
    },
    {
      handleClick: () =>
        navigate(`/lead/${url}/note`, { state: { type: "Lead" } }),
      title: "Notes",
      listItemIconTxt: "note",
    },
    {
      handleClick: () =>
        navigate(`/lead/${url}/task`, { state: { type: "Lead" } }),
      title: "Tasks",
      listItemIconTxt: "task",
    },
    {
      handleClick: () =>
        navigate(`/lead/${url}/meeting`, { state: { type: "Lead" } }),
      title: "Meetings",
      listItemIconTxt: "meeting",
    },
    {
      handleClick: () =>
        navigate(`/lead/${url}/call-information`, { state: { type: "Lead" } }),
      title: "Calls",
      listItemIconTxt: "call-information",
    },
  ];

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
    navigate(`/lead`);
  };

  const editLead = () => {
    const leadId = params?.id;
    navigate(`/lead/update/${leadId}`);
  };

  const handleConvert = (val) => {
    if (val === "lost_lead") {
      return;
    }

    const data = {
      lead_ids: [parseInt(params?.id)],
      convert_to: val,
    };

    LeadAPI.convertType({ data })
      .then((response) => {
        Toaster.TOAST(response?.message, "success");
        switch (val) {
          case "pipeline":
            navigate(`/pipeline/create/${response?.record_id}`);
            break;
          case "potential":
            navigate(`/potential/create/${response?.record_id}`);
            break;
          case "deal":
            navigate(`/deal/create/${response?.record_id}`);
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const data = useMemo(
    () => [
      { eventKey: "pipeline", label: "Convert to Pipeline" },
      { eventKey: "potential", label: "Convert to Potential" },
      { eventKey: "deal", label: "Convert to Deal" },
      { eventKey: "lost_lead", label: "Convert to Lost" },
    ],
    []
  );

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
      formData.append("data[lead_emailable_type]", "Lead");
      formData.append("data[body]", emailBody);
      formData.append("data[subject]", emailSubject);
      formData.append("data[cc_emails][]", ccRecipients);
      formData.append("data[bcc_emails][]", bccRecipients);
      attachments.map(
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

  //  convert into lost lead
  const handleLostConvert = (label) => {
    if (label === "Convert to Lost") {
      setLostModal(!lostModal);
    }
  };

  // lost lead reason crud

  useEffect(() => {
    handleFields();
  }, [crudField]);

  useEffect(() => {
    setItemValue(fieldName?.attributes?.name);
  }, [fieldName]);

  let deleteContent = {
    Name: fieldID?.attributes?.name,
    EditLabel: field_editLabel,
    ModuleName: "lead",
  };

  const handleFields = () => {
    if (crudField === "lost_lead") {
      field_editLabel = "Lost Lead";
    }
  };

  const handleModalClose = () => setShow(false);

  const handleValid = () => {
    if (!itemValue) {
      setFieldErrMsg("Field can't be empty");
    }
  };

  const handleFieldChange = (val) => {
    setItemValue(val);
  };

  const handleShow = (data) => {
    handleDeleteClick(data?.id, false);
    setFieldID(data);
  };

  const handleEditClick = (event, data) => {
    setIsEditModal(!isEditModal);
    setFieldName(data);
  };

  const onAddPopup = (data, id) => {
    if (data === "add_new") {
      setItemValue("");
      setFieldName("");
    }
    setIsEditModal(!isEditModal);
  };

  const handleClosePopup = () => {
    setIsEditModal(!isEditModal);
    setFieldName();
    setFieldErrMsg("");
  };

  const handleDropdownSubmit = () => {
    handleValid();
    let data = {
      data: {
        name: itemValue,
      },
    };

    if (itemValue && !fieldErrMsg) {
      apiCallingEndPoints(data);
    }
  };

  const apiCallingEndPoints = (data) => {
    let apiCall;
    apiCall = fieldName?.id
      ? LostLeadApi.editReason(fieldName.id, data)
      : LostLeadApi.createReason(data);

    handleDropdownsAPI(apiCall);
  };

  const handleDropdownsAPI = (apiCall) => {
    if (!apiCall) return;
    apiCall
      .then((response) => {
        if (response?.data) {
          setIsEditModal(false);
          let successMessage = "";
          successMessage = fieldName?.id
            ? "Reason updated Successfully"
            : "Reason created Successfully";
          if (!fieldName?.id) {
            setReasonId(response?.data?.id);
          }
          Toaster.TOAST(successMessage, "success");
          handleClosePopup();
        }
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleDeleteClick = (id, associatedFlag) => {
    const deleteId = id ? id : fieldID?.id;
    let apiCall = LostLeadApi.deleteReason(deleteId, associatedFlag);
    handleDropdownItemDelete(apiCall);
  };

  const handleDropdownItemDelete = (apiCall) => {
    if (!apiCall) return;
    apiCall
      .then((res) => {
        Toaster.TOAST(res?.message, "success");
        handleModalClose();
        setIsDelete(!isDelete);
        setReasonId("");
      })
      .catch((error) => {
        if (error?.reponse?.data?.code === RECORD_EXIST) {
          setShow(true);
        }
        Toaster.TOAST(deleteMethodError(error), "error");
        console.log(error);
      });
  };

  return (
    <Box>
      {emailToast && <SnackBar setEmailToast={setEmailToast} />}
      <Card
        variant="outlined"
        className="ma-leads-box border-0 overflow-visible"
      >
        {!Invalid_data && (
          <Box>
            <div className="tobNavigation ma-overview-heading">
              <div className="border-0">
                <Typography className="createlead-heading p-0 border-0">
                  <ArrowBackIcon
                    className="Arrowbtn-mr"
                    onClick={backNavigation}
                  />
                  <span>
                    {" "}
                    {overviewHeaderData?.full_name
                      ? overviewHeaderData?.full_name
                      : "N/A"}{" "}
                    |{" "}
                  </span>{" "}
                  <span className="role_text" data-testid="designation">
                    {overviewHeaderData?.sub_head || "No Designation"}
                  </span>
                </Typography>
              </div>
              <div>
                <Button
                  className="CreateLeadButton"
                  onClick={() => {
                    setToEmail(overviewHeaderData?.email);
                    setOpenMail(true);
                  }}
                >
                  <MailOutlineIcon />
                  <div className="sendEmailtext">Send Email</div>
                </Button>
                <SentEmail
                  toEmail={toEmail}
                  setToEmail={setToEmail}
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
              <OverviewTab navigationData={navigationData} />
              <Box className="ma-convertEdit-bar ma-Divider-bar ma-piplineLost-lead">
                <Convert
                  data={data}
                  handleConvert={handleConvert}
                  handleLostConvert={handleLostConvert}
                />
                <Button className="ms-2 me-2 ma-edit-btn" onClick={editLead}>
                  <EditOutlinedIcon />
                  Edit Details
                </Button>
                <Button className="d-none">
                  <MoreHoriz />
                </Button>
              </Box>
            </CardContent>
          </Box>
        )}
      </Card>
      {/* lost lead for reason dialog */}
      {/* lost lead for reason dialog */}
      {lostModal && (
        <LostPipelinePopup
          setOpenModal={setLostModal}
          openModal={isEditModal}
          type={"Lead"}
          id={params.id}
          addNew={"REASON"}
          onAddDetail={onAddPopup}
          handleEditClick={handleEditClick}
          handleShow={handleShow}
          isDelete={isDelete}
          fieldName={fieldName}
          setReasonId={setReasonId}
          reason_id={reason_id}
        />
      )}
      {isEditModal && (
        <DropdownCreateEdit
          openModal={isEditModal}
          setOpenModal={setIsEditModal}
          valueName={fieldName}
          editLabel={"Reason"}
          addLabel={"Reason"}
          placeholder={"Enter reason"}
          handleSubmit={handleDropdownSubmit}
          itemValue={itemValue}
          handleChange={handleFieldChange}
          errMsg={fieldErrMsg}
          setErrMsg={setFieldErrMsg}
          handleToCloseLT={handleClosePopup}
        />
      )}
      <DropdownDelete
        title={deleteContent}
        content={deleteContent}
        openDelete={show}
        handleClose={handleModalClose}
        handleDelete={handleDeleteClick}
      />
    </Box>
  );
};

export default LeadsOverview;
