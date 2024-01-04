import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
//mui
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Checkbox, Chip, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { DeleteIcon } from "../../assets/index";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

//mui icons
import Avatar from "@mui/material/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import { makeStyles } from "@mui/styles";
//css
import "../../styles/global/common.css";
import "../../styles/custom/Create.css";
import { Formik, Form } from "formik";
import Select from "@mui/material/Select";
import { CampaignSchema } from "../../pages/common/ValidationSchema/CampaignSchema";
import { FormatDate, TodayDate, handleHtmlToBlob } from "../../utils";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import { Toaster } from "../../pages/common/Toaster";
import { campaignApi } from "../../apis/campaignApi";
import SelectTemplateDialog from "../../pages/EmailCampaigns/TemplateDialogBox";
import EditTemplateCard from "../../pages/EmailCampaigns/EditTemplateCard";
import SendEmailPopup from "../../pages/common/SendEmailPopup";
import { EMAIL_DRAFT } from "../../utils/constants";
import DeletePopup from "../../pages/common/DeletePopup";
import { DataContext } from "../../context";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import debouce from "lodash.debounce";
import { EMAIL_REGEX, STRING_REGEX } from "../../utils/regexLists";
import { TimeZoneApi } from "../../apis/TimeZonesApi";

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

const useStyles = makeStyles({
  createCampaignGrid: {
    width: "100%",
    maxWidth: "100vw",
  },
  createCampaignTextField: {
    width: "100%",
    maxWidth: "470px",
  },
  createCampaignCardHolder: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "20px",
  },
  createCampaignCards: {
    width: "100%",
    height: "100%",
    minWidth: "210px",
    minHeight: "210px",
    padding: "30px 15px 20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    borderRadius: "4px",
    border: "1px solid var(--ma-lightgray-color)",
    background: "var(--ma-white-color)",
    textAlign: "center",
    cursor: "pointer",
  },
  svgIcon: {
    width: "64px !important",
    height: "64px !important",
    color: "var(--ma-secondarytext-color)",
  },
  typographyHeading: {
    color: "var(--ma-primarymain-color)",
    textAlign: "center",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
  },
  emailContentBody: {
    color: "var(--ma-gray-color)",
    textAlign: "center",
    fontSize: "12px !important",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
  },
  recipientPlaceholder: {
    color: "var(--ma-gray-color)",
    fontSize: "14px !important",
    fontWeight: 400,
    opacity: 0.7,
  },
  receipientEmptyMenu: {
    borderBottom: "1px solid var(--ma-tableborder-color) !important",
    fontWeight: 500,
    fontSize: "16px",
    color: "var(--ma-primarymain-color)",
    padding: "15px 20px !important",
    background: "#FFF !important",
    cursor: "default !important",
    opacity: "1 !important",
  },
  contactMenu: {
    "& .contactTypography": {
      fontSize: "14px",
      fontWeight: 400,
      color: "var(--ma-primarymain-color)",
    },
  },
  recipientsIndividual: {
    borderTop: "1px solid var(--ma-tableborder-color) !important",
  },
  sendEmailText: {
    color: "#2C42B5",
    fontSize: "14px !important",
    marginTop: "14px !important",
    fontWeight: "500 !important",
    cursor: "pointer",
  },
  createCampaignGridSelect: {
    display: "flex",
    flexWrap: "wrap",
  },
});

let isTrue = false;

const CreateCampaign = ({ getCampaignOverviewData, overviewDraftData }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const params = useParams();
  const { status, id } = params;
  const { toPreviewData, setToPreviewData } = useContext(DataContext);
  let is_duplicate = location?.state?.is_duplicate;
  let duplicate_id = location?.state?.duplicate_id;
  const page_id = id || duplicate_id;
  let today = new Date();
  let minutes = today.getMinutes();
  minutes = minutes <= 9 ? "0" + minutes : minutes;
  let currentTime = today.getHours() + ":" + minutes;
  let time_zone = userInfo?.timezone;
  const [contactList, setContactList] = useState([]); // recipients contact list api data
  const [individualContact, setIndividualContact] = useState([]); // recipients individual contact api data
  const [openCalendar, setOpenCalendar] = useState(false);
  const [recipients_modules, setRecipientsModules] = useState([]);
  const [recipients_contacts, setRecipientsContacts] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [btnText, setBtnText] = useState("Save");
  const [loader, setLoader] = useState(false);
  const [openDiscard, setOpenDiscard] = useState(false);
  const [searchParams] = useSearchParams();

  const sendOptionsData = [
    { name: "Send Now", value: "send_now", saveBtnText: "Send" },
    {
      name: "Schedule for Later",
      value: "schedule_later",
      saveBtnText: "Schedule",
    },
    { name: "Save in Draft", value: "save_in_draft", saveBtnText: "Save" },
  ];

  const tomorrowDate = TodayDate(1);

  const [initialData, setInitialData] = useState({
    campaign_name: "",
    recipients: "",
    sender_name: userInfo?.full_name,
    sender_email: userInfo?.email,
    reply_to_address: userInfo?.email,
    subject: "",
    preview_text: "",
    send_options: "save_in_draft",
    timezone: time_zone,
    send_date: tomorrowDate,
    send_time: currentTime,
    track_opening_emails: false,
    track_click_links_in_emails: false,
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [openTemplatePopup, setOpenTemplatePopup] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [srchData, setSrchData] = useState(false);
  const [recipientErr, setRecipientErr] = useState("");
  const [timezoneData, setTimeZoneData] = useState([]);
  const obj = JSON.parse(localStorage.getItem("campaign_data"));
  const start_campaign = JSON.parse(
    localStorage.getItem("user_info")
  )?.is_campaign_started;
  const [disabled, setDisabled] = useState(false);
  const [modulesData, setModulesData] = useState([]);

  useEffect(() => {
    if (
      toPreviewData.content_html &&
      toPreviewData.content_json &&
      toPreviewData.image
    ) {
      if (is_duplicate && !toPreviewData?.blob) {
        handleImageToBlob();
      }
      setShowTemplate(true);
    }
  }, [toPreviewData]);

  const handleImageToBlob = async () => {
    const newBlob = await handleHtmlToBlob(toPreviewData.content_html);
    setToPreviewData((prev) => ({
      ...prev,
      blob: newBlob.blob,
    }));
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setOpenTemplatePopup(false);
  };

  const [sendPopup, setSendPopup] = useState(false);

  const handleSendEmail = () => {
    setSendPopup(true);
  };
  const handleClose = () => {
    setSendPopup(false);
  };

  let isViewingDraft = !!overviewDraftData;

  useEffect(() => {
    if (!obj && !overviewDraftData && id) {
      getCampaignOverviewData();
    }
    handleUserApi();
  }, []);

  useEffect(() => {
    if (page_id && is_duplicate && !obj) {
      getDetailData();
    }
  }, [is_duplicate]);

  useEffect(() => {
    getTimeZones();
    if (obj) {
      let setInitData = {
        campaign_name: obj["campaign_name"],
        recipients_contacts: obj["recipients_contacts"],
        recipients_modules: obj["recipients_modules"],
        sender_name: obj["sender_name"],
        sender_email: obj["sender_email"],
        reply_to_address: obj["reply_to_address"],
        subject: obj["subject"],
        preview_text: obj["preview_text"],
        send_options: obj["send_options"],
        timezone: obj["timezone"] || time_zone,
        send_date: obj["send_date"],
        send_time: obj["send_time"],
        track_opening_emails: obj["track_opening_emails"],
        track_click_links_in_emails: obj["track_click_links_in_emails"],
      };
      setRecipientsContacts(obj["recipients_contacts"]);
      setRecipientsModules(obj["recipients_modules"]);
      setInitialData(setInitData);
      setTimeout(() => {
        localStorage.removeItem("campaign_data");
      }, 1000);
    }
  }, []);

  const handleBtnText = () => {
    switch (initialData?.send_options) {
      case "schedule_later":
        setBtnText("Schedule");
        break;
      case "save_in_draft":
        setBtnText("Save");
        break;
      case "send_now":
        setBtnText("Send");
        break;
      default:
        setBtnText("Save");
        break;
    }
  };

  useEffect(() => {
    handleBtnText();
  }, [initialData]);
  useEffect(() => {
    if (isViewingDraft) {
      if (!obj) {
        handleDraftData();
      }
    }
  }, [isViewingDraft, overviewDraftData]);

  const getDetailData = () => {
    campaignApi
      .getDuplicateName(page_id)
      .then((resp) => {
        setInitialData((prevData) => ({
          ...prevData,
          campaign_name: resp.campaign_name,
        }));
        campaignApi
          .getDetail(page_id)
          .then((res) => {
            let val = res?.data?.attributes;
            handleInitialData(val, resp.campaign_name);
          })
          .catch((error) => {
            Toaster.TOAST(getMethodError(error), "error");
            console.log(error);
          });
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleDraftData = () => {
    if (!obj) handleInitialData();
  };

  const handleInitialData = (data, campaign_nm) => {
    let val = overviewDraftData ? overviewDraftData : data;
    setRecipientsContacts(val?.recipients_contacts);
    setRecipientsModules(val?.recipients_modules);
    let setData = {
      campaign_name: campaign_nm ? campaign_nm : val.name,
      recipients_contacts: val?.recipients_contacts,
      recipients_modules: val?.recipients_modules,
      sender_name: val?.sender_name,
      sender_email: val.sender_email,
      reply_to_address: val?.reply_to_address,
      subject: val?.subject,
      preview_text: val?.preview_text,
      content_html: val?.content_html ? val?.content_html : null,
      content_json: val?.content_json ? val?.content_json : null,
      send_options: val?.send_options,
      timezone: val?.timezone || time_zone,
      send_date: val?.send_date || tomorrowDate,
      send_time: val?.send_time || currentTime,
      track_opening_emails: val?.track_opening_emails,
      track_click_links_in_emails: val?.track_click_links_in_emails,
    };
    setInitialData(setData);
    if (val?.content_html && val?.content_json && val?.preview_image?.url) {
      setShowTemplate(true);
      setToPreviewData((prev) => ({
        ...prev,
        image: val?.preview_image?.url,
        content_html: val?.content_html ? val?.content_html : null,
        content_json: val?.content_json ? val?.content_json : null,
      }));
    }
  };

  const handleUserApi = () => {
    campaignApi
      .getRecipients()
      .then((res) => {
        setContactList(res.contact_lists);
        const data = Object.keys(res.contact_lists).map((key) => {
          return key;
        });
        setModulesData(data);
        setIndividualContact(res.individual_contacts.data);
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleDateChange = (newValue, setFieldValue) => {
    let formated_date = FormatDate(newValue?.$d);
    setFieldValue("send_date", formated_date);
  };

  const handleDraft = (formValues, flag) => {
    localStorage.removeItem("campaign_data");
    const compareArrays = (arr1, arr2) => {
      return arr1?.toString() === arr2?.toString();
    };
    if (formValues?.campaign_name !== "") {
      if (
        overviewDraftData &&
        overviewDraftData.name === formValues?.campaign_name &&
        compareArrays(
          overviewDraftData.recipients_contacts,
          recipients_contacts
        ) &&
        compareArrays(
          overviewDraftData.recipients_modules,
          recipients_modules
        ) &&
        overviewDraftData.subject === formValues?.subject &&
        overviewDraftData.content_html === formValues?.content_html &&
        overviewDraftData.reply_to_address === formValues?.reply_to_address &&
        overviewDraftData.send_options === formValues?.send_options &&
        overviewDraftData.timezone === formValues?.timezone &&
        overviewDraftData.preview_text === formValues?.preview_text &&
        overviewDraftData.track_opening_emails ===
        formValues?.track_opening_emails &&
        overviewDraftData.track_click_links_in_emails ===
        formValues?.track_click_links_in_emails
      ) {
        if (searchParams.get("page")) {
          navigate(`/campaign/drafts?page=${searchParams.get("page")}`)
        } else {
          navigate(`/campaign/drafts`)
        }
        setToPreviewData({});
        return;
      }
      if (!page_id || is_duplicate) {
        handleSaveClick(formValues, true, flag);
      } else {
        handleSaveClick(formValues, false, flag);
      }
      return;
    }
    setToPreviewData({});
    navigate("/campaign/lists");
  };

  const handleValidForData = (errors, values) => {
    if (is_duplicate) {
      navigate(-1);
    } else {
      handleDraft(values, true);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("campaign_data");
    if (toPreviewData.content_html && toPreviewData.content_json) {
      setOpenDiscard(true);
      return;
    }
    handleBack();
  };

  const handleBack = () => {
    localStorage.removeItem("campaign_data");
    setToPreviewData({});
    if (status === EMAIL_DRAFT) {
      navigate(`/campaign/drafts`);
    } else if (start_campaign) {
      navigate(`/campaign/lists`);
    } else {
      navigate(-1);
    }
  };

  const updateLocalStorage = (values) => {
    const temp = {
      ...values,
      recipients_contacts: recipients_contacts,
      recipients_modules: recipients_modules,
    };
    localStorage.setItem("campaign_data", JSON.stringify(temp));
  };

  const handleTemplate = (values) => {
    setOpenTemplatePopup(true);
    updateLocalStorage(values);
  };

  const handleNew = (values) => {
    setOpenPopup(true);
    updateLocalStorage(values);
  };

  const handleEditTemplate = (e, values) => {
    e.preventDefault();
    updateLocalStorage(values);
    navigate(`/campaign/design/load`);
  };

  const handleCreateCampaign = (data, moveToDraft, flag) => {
    campaignApi
      .createCampaign(data)
      .then((response) => {
        setLoader(false);
        setDisabled(false);
        if (moveToDraft && !is_duplicate) {
          Toaster.TOAST("Campaign saved to drafts successfully", "success");
        } else {
          const message =
            page_id && is_duplicate
              ? "Campaign duplicate successfully"
              : "Campaign created successfully";
          Toaster.TOAST(message, "success");
        }
        window.scrollTo(0, 0);
        setToPreviewData({});
        if (flag && start_campaign) {
          navigate(
            `/campaign/${response?.data?.attributes?.status !== "draft"
              ? "lists"
              : "drafts"
            }`
          );
        } else if (flag) {
          navigate(-1);
        } else {
          navigate(`/campaign/overview/${response?.data?.id}`, {
            state: {
              campaignStatus: response?.data?.attributes?.status,
            },
          });
          if (
            page_id &&
            data.send_options === "save_in_draft" &&
            !is_duplicate
          ) {
            getCampaignOverviewData();
          }
        }
      })
      .catch((error) => {
        if (flag && start_campaign) {
          navigate(`/campaign/lists`);
        } else if (flag) {
          navigate(-1);
        }
        setLoader(false);
        setDisabled(false);
        if (!flag) 
          Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleUpdateCampaign = (data, flag) => {
    let condition =
      (data.send_options !== "save_in_draft" && !flag) ? "Campaigns" : "Drafts";
    campaignApi
      .updateCampaign(data, page_id)
      .then((response) => {
        setLoader(false);
        setDisabled(false);
        Toaster.TOAST(`${condition} updated successfully`, "success");
        window.scrollTo(0, 0);
        if (!flag) {
          navigate(`/campaign/overview/${response?.data?.id}`, {
            state: {
              campaignStatus: response?.data?.attributes?.status,
            },
          });
          setInitialData({});
        } else {
          navigate(
            `/campaign/${response?.data?.attributes?.status !== "draft"
              ? "lists"
              : "drafts"
            }`
          );
        }
        setToPreviewData({});
        getCampaignOverviewData();
      })
      .catch((error) => {
        if (flag && start_campaign) {
          navigate(`/campaign/lists`);
        } else if (flag) {
          navigate(-1);
        }
        setLoader(false);
        setDisabled(false);
        if (!flag)
          Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };
  const handleSaveClick = (
    formValues,
    moveToDraft = false,
    flag,
    resetForm
  ) => {
    localStorage.removeItem("campaign_data");
    if (!flag) {
      setLoader(true);
    }
    const formdata = new FormData();
    formdata.append("data[name]", formValues?.campaign_name);

    recipients_modules.map((item) => {
      formdata.append("data[recipients_modules][]", item);
    });

    recipients_contacts.map((item) => {
      formdata.append("data[recipients_contacts][][id]", item?.id);
      formdata.append("data[recipients_contacts][][email]", item?.email);
    });

    formdata.append("data[sender_name]", formValues?.sender_name);
    formdata.append("data[sender_email]", formValues?.sender_email);
    formdata.append("data[reply_to_address]", formValues?.reply_to_address);
    formdata.append("data[subject]", formValues?.subject);
    formdata.append("data[send_options]", formValues?.send_options);
    formdata.append("data[preview_text]", formValues?.preview_text);
    formdata.append(
      "data[track_opening_emails]",
      formValues?.track_opening_emails
    );
    formdata.append(
      "data[track_click_links_in_emails]",
      formValues?.track_click_links_in_emails
    );
    if (
      showTemplate ||
      toPreviewData.content_html ||
      toPreviewData.content_json
    ) {
      if (toPreviewData?.blob) {
        formdata.append("data[preview_image]", toPreviewData?.blob);
      }
      formdata.append(
        "data[content_html]",
        toPreviewData.content_html || overviewDraftData?.content_html || null
      );
      formdata.append(
        "data[content_json]",
        toPreviewData.content_json || overviewDraftData?.content_json || null
      );
    }
    if (formValues?.send_options === "schedule_later" && !flag) {
      formdata.append("data[send_date]", formValues?.send_date);
      formdata.append("data[send_time]", formValues?.send_time);
      formdata.append("data[timezone]", formValues?.timezone || time_zone);
    }
    if (moveToDraft || flag) {
      formdata.append("data[send_options]", "save_in_draft");
    }

    if (!page_id || is_duplicate) {
      setDisabled(true);
      handleCreateCampaign(formdata, moveToDraft, flag);
    } else {
      setDisabled(true);
      handleUpdateCampaign(formdata, flag);
    }
  };

  const getFilterArray = (array) => {
    return array?.map((element) => {
      return element?.email ? element.email : element;
    });
  };
  const getDisplayedNames = (values) => {
    let retVal = getFilterArray(values);
    return retVal;
  };

  const renderValue = (selected, values) => {
    let formikFieldVal = [...recipients_contacts, ...recipients_modules];
    let getValue = formikFieldVal;
    const displayedNames = getDisplayedNames(getValue);

    if (
      getValue?.length &&
      !displayedNames.includes("") &&
      !displayedNames.includes("NaN")
    ) {
      let temp = `+${getValue?.length - 2} more contacts`;
      return displayedNames?.map((elem, idx) => {
        return (
          <Chip
            className="me-1 mb-1"
            key={idx}
            label={elem}
            clickable
            onDelete={(e) => e.preventDefault()}
            onClick={(e) => e.preventDefault()}
          />
        );
      });
    }

    return (
      <Typography className={classes.recipientPlaceholder}>
        Select recipients
      </Typography>
    );
  };
  const validateRecipient = () => {
    if (recipients_contacts.length === 0 && recipients_modules.length === 0) {
      setRecipientErr("Please select any recipient");
    } else {
      setRecipientErr("");
    }
  };
  const setReceipentModules = (event) => {
    if (!recipients_modules.includes(event.props.value)) {
      setRecipientsModules([...recipients_modules, event.props.value]);
    } else {
      let data = recipients_modules.filter(
        (elem) => elem !== event.props.value
      );
      setRecipientsModules(data);
    }
  };
  const setReceipentContact = (event) => {
    let contact = individualContact.filter(
      (elem) => elem.attributes.email === event.props.value
    );
    let contactPayload = {
      id: parseInt(contact[0].id),
      email: contact[0].attributes.email,
    };
    if (
      recipients_contacts?.findIndex(
        (item) => item.email === event.props.value
      ) <= -1
    ) {
      setRecipientsContacts([...recipients_contacts, contactPayload]);
    } else {
      let data = recipients_contacts.filter(
        (elem) => elem.email !== event.props.value
      );
      setRecipientsContacts(data);
    }
  };

  const handleChangeSelect = async (e, event) => {
    if (modulesData.includes(event.props.value)) {
      await setReceipentModules(event);
    } else {
      await setReceipentContact(event);
    }
  };

  const handleDeleteTemplate = () => {
    setShowTemplate(false);
    setToPreviewData({});
  };

  useEffect(() => {
    if (srchData) {
      CallSearchApi();
    }
  }, [srchData]);

  const handleIndividualSearch = (e) => {
    let data = e.target.value;
    if (data) {
      setSrchData(false);
    } else {
      setSrchData(true);
    }
    setSearchText(data);
    debounceSave(data);
  };

  const debounceSave = React.useCallback(
    debouce(function (e) {
      if (e) {
        CallSearchApi(e);
      }
    }, 600),
    []
  );

  const CallSearchApi = (data) => {
    campaignApi
      .getRecipients(data)
      .then((res) => {
        if (res?.individual_contacts?.data.length > 0) {
          setIndividualContact(res.individual_contacts.data);
        } else {
          setIndividualContact([]);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleSrchCancel = () => {
    setSearchMode(false);
    setSearchText("");
    CallSearchApi();
  };

  const getTimeZones = () => {
    TimeZoneApi.getTimezones()
      .then(function (response) {
        if (response?.time_zones?.length > 0) {
          setTimeZoneData(response?.time_zones);
        } else {
          console.log("An error occured");
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleTimezone = (e, value, setFieldValue) => {
    setFieldValue("timezone", value)
  };

  const TimeZoneDropDown = (values, setFieldValue) => {
    return (
      <Autocomplete
        disablePortal
        disableClearable
        className={`${classes.createCampaignTextField} placeholder_field`}
        fullWidth
        id="combo-box-demo"
        options={timezoneData}
        value={values.timezone}
        onChange={(e, value) => {
          handleTimezone(e, value, setFieldValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select timezone"
          />
        )}
      />
    );
  };

  return (
    <Box className="ma-leads-box" sx={{ display: "flex" }}>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        <Paper elevation={2} className={"ma-mainShadow-box createlead-page"}>
          <Formik
            enableReinitialize={isViewingDraft || is_duplicate || obj}
            initialValues={initialData}
            validationSchema={CampaignSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              setSubmitting(false);
              if (
                !recipientErr.length ||
                values.send_options === "save_in_draft"
              ) {
                handleSaveClick(values, false, false, resetForm);
              } else {
                window.scrollTo(0, 0);
              }
            }}
          >
            {({
              isValid,
              errors,
              touched,
              values,
              setFieldValue,
              isSubmitting,
              setSubmitting,
            }) => {
              let validForDrafts =
                values.send_options && values.send_options !== "save_in_draft";
              if (validForDrafts && values.send_options) {
                validateRecipient();
              }
              let requiredMark = validForDrafts && (
                <span className="requreiedField">*</span>
              );
              if (Object.keys(errors).length > 0 && isSubmitting) {
                if (
                  values.send_options === "save_in_draft" &&
                  values.campaign_name !== ""
                ) {
                  setSubmitting(false);
                  handleDraft(values, false);
                  return;
                }
                Toaster.TOAST("Please fill all the required fields", "error");
                window.scrollTo(0, 0);
              }
              return (
                <>
                  <Form autoComplete="off">
                    <Typography
                      className={"createlead-heading justify-content-between"}
                    >
                      <Box>
                        <ArrowBackIcon
                          disabled={disabled}
                          className="Arrowbtn-mr"
                          sx={{ color: "black" }}
                          onClick={() => handleValidForData(errors, values)}
                        />
                        {isViewingDraft
                          ? overviewDraftData.name
                          : "Create Campaign"}
                      </Box>
                    </Typography>
                    <div className="ma-createMain-form">
                      <div>
                        <h1 className="detailstxt mt-3">Details</h1>
                      </div>

                      <Box className="create-campaign-container">
                        <Grid container spacing={2} xs={12} md={12} lg={12}>
                          <Grid item xs={12} md={10} lg={10}>
                            <label className="labeltxt ">
                              <span className="requreiedField">*</span>
                              Campaign Name
                            </label>
                            <TextField
                              className={`placeholder_field`}
                              fullWidth
                              autoFocus
                              id="campaign_name"
                              placeholder="Enter campaign name"
                              name="campaign_name"
                              value={values.campaign_name}
                              onChange={(event) => {
                                setFieldValue(
                                  "campaign_name",
                                  event.target.value
                                );
                              }}
                              inputProps={{ maxLength: 100 }}
                              helperText={
                                <span className="ma-error">
                                  {touched.campaign_name &&
                                    errors.campaign_name}
                                </span>
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={10}
                            lg={10}
                            className={classes.createCampaignGrid}
                          >
                            <label className="labeltxt ">
                              {requiredMark}
                              Recipients
                            </label>
                            <Select
                              className={`${classes.createCampaignGridSelect} placeholder_field`}
                              fullWidth
                              id="recipient"
                              multiple
                              multiline
                              maxRows={4}
                              value={recipients}
                              onChange={(e, event) => {
                                handleChangeSelect(e, event);
                              }}
                              sx={{
                                ".MuiSelect-select": {
                                  display: "flex",
                                  flexWrap: "wrap",
                                },
                              }}
                              style={{ maxHeight: "auto" }}
                              renderValue={(selected) =>
                                renderValue(selected, values?.recipients)
                              }
                              placeholder="Select recipients"
                              displayEmpty
                              autoFocus={false}
                            >
                              <MenuItem
                                value=""
                                disabled
                                className={`${classes.receipientEmptyMenu}`}
                              >
                                Contact Lists
                              </MenuItem>
                              {contactList &&
                                Object.keys(contactList).map((key, idx) => {
                                  let value = key;
                                  let label = `${key} (${contactList[key]})`;
                                  return (
                                    <MenuItem
                                      key={idx}
                                      value={value}
                                      className={classes.contactMenu}
                                    >
                                      <Checkbox
                                        checked={
                                          recipients_modules.indexOf(value) > -1
                                        }
                                      />
                                      <Typography
                                        className="contactTypography"
                                        sx={{ textTransform: "capitalize" }}
                                      >
                                        {" "}
                                        {label}{" "}
                                      </Typography>
                                    </MenuItem>
                                  );
                                })}
                              <Box
                                className={`${classes.receipientEmptyMenu} ${classes.recipientsIndividual}`}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  {searchMode ? (
                                    <TextField
                                      name="Search"
                                      placeholder="Search"
                                      type="text"
                                      autoFocus={true}
                                      variant="standard"
                                      value={searchText}
                                      onChange={(e) =>
                                        handleIndividualSearch(e)
                                      }
                                      onKeyDown={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <Typography disabled>
                                      Individual Contacts
                                    </Typography>
                                  )}
                                  <IconButton>
                                    {searchMode ? (
                                      <CancelIcon
                                        onClick={() => handleSrchCancel()}
                                      />
                                    ) : (
                                      <SearchIcon
                                        onClick={() => setSearchMode(true)}
                                      />
                                    )}
                                  </IconButton>
                                </div>
                              </Box>
                              {individualContact?.length > 0 ? (
                                individualContact.map((data) => (
                                  <MenuItem
                                    className="pt-3"
                                    sx={{
                                      borderBottom:
                                        "1px solid var(--ma-tableborder-color)",
                                    }}
                                    key={data.id}
                                    value={data.attributes.email}
                                    display="flex"
                                    flexDirection={"row"}
                                  >
                                    <Avatar size={"10"} variant={"circular"}>
                                      {recipients_contacts.length > 0 &&
                                        recipients_contacts?.find(
                                          (item) =>
                                            parseInt(item.id) ===
                                            parseInt(data.id)
                                        ) ? (
                                        <CheckIcon />
                                      ) : (
                                        data?.attributes?.full_name
                                          ?.match(STRING_REGEX)
                                          .join("")
                                          .toUpperCase()
                                      )}
                                    </Avatar>
                                    <Box
                                      display={"flex"}
                                      flexDirection={"column"}
                                      ml={2}
                                    >
                                      <Typography color={"text.primary"}>
                                        {data?.attributes?.full_name}
                                      </Typography>
                                      <Typography color={"text.secondary"}>
                                        {data?.attributes?.email}
                                      </Typography>
                                    </Box>
                                  </MenuItem>
                                ))
                              ) : (
                                <Typography
                                  className="pb-3"
                                  sx={{ textAlign: "center" }}
                                >
                                  {" "}
                                  No data found
                                </Typography>
                              )}
                            </Select>
                            <FormHelperText>
                              {" "}
                              <span className="ma-error">

                                {validForDrafts && recipientErr}
                              </span>
                            </FormHelperText>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box className="create-campaign-container">
                        <Box>
                          <Typography variant="h6" className="detailstxt my-4">
                            From
                          </Typography>
                        </Box>
                        <Grid container spacing={2} xs={12} md={12} lg={12}>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            className={classes.createCampaignGrid}
                          >
                            <label className="labeltxt ">Sender Name</label>
                            <TextField
                              className={`${classes.createCampaignTextField} placeholder_field`}
                              fullWidth
                              id="sender_name"
                              placeholder="Enter sender name"
                              name="sender_name"
                              value={values.sender_name}
                              onChange={(e) =>
                                setFieldValue("sender_name", e.target.value)
                              }
                              disabled
                              sx={{
                                "& .MuiInputBase-root.Mui-disabled": {
                                  backgroundColor: "#D1D1DA",
                                },
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircleOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={classes.createCampaignGrid}
                          >
                            <label className="labeltxt ">Sender Email</label>
                            <TextField
                              className={`${classes.createCampaignTextField} placeholder_field`}
                              fullWidth
                              id="sender_email"
                              placeholder="Enter sender email"
                              name="sender_email"
                              value={values.sender_email}
                              onChange={(e) =>
                                setFieldValue("sender_email", e.target.value)
                              }
                              disabled
                              sx={{
                                "& .MuiInputBase-root.Mui-disabled": {
                                  backgroundColor: "#D1D1DA",
                                },
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircleOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={classes.createCampaignGrid}
                          >
                            <label className="labeltxt ">
                              {requiredMark}
                              Reply-to-Address
                            </label>
                            <TextField
                              className={`${classes.createCampaignTextField} placeholder_field`}
                              fullWidth
                              id="reply_to_address"
                              placeholder="Enter reply to email address"
                              name="reply_to_address"
                              value={values.reply_to_address}
                              onChange={(event) => {
                                setFieldValue(
                                  "reply_to_address",
                                  event.target.value
                                );
                              }}
                              inputProps={{ maxLength: 100 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircleOutlinedIcon
                                      sx={{ color: "black" }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              helperText={
                                <span className="ma-error">
                                  {validForDrafts &&
                                    touched.reply_to_address &&
                                    errors.reply_to_address}
                                </span>
                              }
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      <Box className="create-campaign-container">
                        <Box>
                          <Typography variant="h6" className="detailstxt my-4">
                            Subject
                          </Typography>
                        </Box>
                        <Grid container spacing={2} xs={12} md={12} lg={12}>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            lg={10}
                            className={classes.createCampaignGrid}
                          >
                            <label className="labeltxt ">
                              {requiredMark}
                              Subject
                            </label>
                            <TextField
                              className=" placeholder_field"
                              fullWidth
                              id="subject"
                              placeholder="Enter subject"
                              name="subject"
                              value={values.subject}
                              onChange={(event) => {
                                setFieldValue("subject", event.target.value);
                              }}
                              inputProps={{ maxLength: 300 }}
                              helperText={
                                <span className="ma-error">
                                  {validForDrafts &&
                                    touched.subject &&
                                    errors.subject}
                                </span>
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            lg={10}
                            className={classes.createCampaignGrid}
                          >
                            <label className="labeltxt ">Preview Text</label>
                            <TextField
                              className=" placeholder_field"
                              fullWidth
                              id="preview_text"
                              placeholder="Enter preview text"
                              name="preview_text"
                              value={values.preview_text}
                              onChange={(event) => {
                                setFieldValue(
                                  "preview_text",
                                  event.target.value
                                );
                              }}
                              inputProps={{ maxLength: 300 }}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      <Box className="create-campaign-container">
                        <Box>
                          <Typography variant="h6" className="detailstxt my-4">
                            Email Content
                          </Typography>
                        </Box>
                        <Grid container spacing={2} xs={6} md={6} lg={4}>
                          <Grid
                            item
                            xs={3}
                            md={3}
                            lg={6}
                            className={classes.createCampaignCardHolder}
                          >
                            {showTemplate ? (
                              <>
                                <Box
                                  className={`p-0 ${classes.createCampaignCards}`}
                                >
                                  <EditTemplateCard
                                    updateLocalStorage={() =>
                                      updateLocalStorage(values)
                                    }
                                  />
                                </Box>
                                <div className="h-100">
                                  <button
                                    data-testid="edit-note"
                                    className="edit_icon_btn mb-2"
                                    onClick={(e) =>
                                      handleEditTemplate(e, values)
                                    }
                                  >
                                    <EditOutlinedIcon />
                                  </button>
                                  <button
                                    data-testid="delete-note"
                                    className="delete_icon_btn"
                                    onClick={() => handleDeleteTemplate()}
                                  >
                                    <img
                                      src={DeleteIcon}
                                      alt="DeleteIcon"
                                      className="delete_Icon "
                                    />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <Box
                                  className={classes.createCampaignCards}
                                  onClick={() => handleNew(values)}
                                >
                                  <NoteAddOutlinedIcon
                                    className={classes.svgIcon}
                                  />
                                  <Typography
                                    variant="h6"
                                    component="div"
                                    className={classes.typographyHeading}
                                  >
                                    Create New
                                  </Typography>
                                  <Typography
                                    className={classes.emailContentBody}
                                  >
                                    Design the email from blank or use built-in
                                    layouts
                                  </Typography>
                                </Box>

                                <Box
                                  className={classes.createCampaignCards}
                                  onClick={() => handleTemplate(values)}
                                >
                                  <PlaylistAddOutlinedIcon
                                    className={classes.svgIcon}
                                  />
                                  <Typography
                                    variant="h6"
                                    component="div"
                                    className={classes.typographyHeading}
                                  >
                                    Your Templates
                                  </Typography>
                                  <Typography
                                    className={classes.emailContentBody}
                                  >
                                    Edit design you have previously saved as a
                                    template
                                  </Typography>
                                </Box>
                              </>
                            )}
                          </Grid>
                        </Grid>
                        {showTemplate && (
                          <>
                            <Box>
                              <Typography
                                onClick={handleSendEmail}
                                className={classes.sendEmailText}
                              >
                                Send Test Email
                              </Typography>
                            </Box>
                            <SendEmailPopup
                              preview_text={values.preview_text}
                              reply_to_address={values.reply_to_address}
                              subject={values.subject}
                              open={sendPopup}
                              handelClose={handleClose}
                            />
                          </>
                        )}
                      </Box>

                      <Box className="create-campaign-container">
                        <Box>
                          <Typography variant="h6" className="detailstxt my-4">
                            Sending Time
                          </Typography>
                        </Box>
                        <Grid container spacing={2} xs={12} md={8}>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={12}
                            className={classes.createCampaignGrid}
                          >
                            <label className="labeltxt ">Send Options</label>
                            <TextField
                              className={`${classes.createCampaignTextField} placeholder_field`}
                              fullWidth
                              id="demo-mutiple-checkbox"
                              value={values.send_options}
                              name="send_options"
                              inputProps={{ "aria-label": "Without label" }}
                              onChange={(e) => {
                                setFieldValue("send_options", e.target.value);
                              }}
                              select
                            >
                              {sendOptionsData?.map((elem, idx) => (
                                <MenuItem
                                  onClick={() => setBtnText(elem.saveBtnText)}
                                  key={idx}
                                  value={elem.value}
                                >
                                  {elem.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          {values.send_options === "schedule_later" ? (
                            <>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={12}
                                className={classes.createCampaignGrid}
                              >
                                <label className="labeltxt ">Time zone</label>
                                {TimeZoneDropDown(values, setFieldValue)}
                              </Grid>
                              <Grid item xs={6} md={6} lg={3}>
                                <label className="labeltxt ">Date</label>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    disablePast
                                    value={values.send_date}
                                    open={openCalendar}
                                    onOpen={() => setOpenCalendar(true)}
                                    onClose={() => setOpenCalendar(false)}
                                    onChange={(newValue) =>
                                      handleDateChange(newValue, setFieldValue)
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        name=""
                                        onKeyDown={(e) => e.preventDefault()}
                                        onMouseDown={() =>
                                          setOpenCalendar(true)
                                        }
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              </Grid>

                              <Grid item xs={6} md={6} lg={3}>
                                <label className="labeltxt ">Time</label>
                                <TextField
                                  name="send_time"
                                  size="medium"
                                  id="send_time"
                                  placeholder="Dec 30, 2022"
                                  className="duedate_textfield w-100"
                                  type="time"
                                  value={values.send_time}
                                  onChange={(e) => {
                                    setFieldValue("send_time", e.target.value);
                                  }}
                                ></TextField>
                              </Grid>
                            </>
                          ) : null}
                        </Grid>
                      </Box>

                      <Box className="create-campaign-container">
                        <Box>
                          <Typography variant="h6" className="detailstxt my-4">
                            Engagement
                          </Typography>
                        </Box>
                        <Grid className="my-1" item xs={6} md={6} lg={6}>
                          <Android12Switch
                            checked={values.track_opening_emails}
                            onChange={(e) => {
                              setFieldValue(
                                "track_opening_emails",
                                e.target.checked
                              );
                            }}
                          />
                          <label className="">Track opening emails</label>
                        </Grid>
                        <Grid className="my-1" item xs={6} md={6} lg={6}>
                          <Android12Switch
                            checked={values.track_click_links_in_emails}
                            onChange={(e) => {
                              setFieldValue(
                                "track_click_links_in_emails",
                                e.target.checked
                              );
                            }}
                          />
                          <label className="">
                            Track clicking links in emails
                          </label>
                        </Grid>
                      </Box>
                    </div>
                    <Grid container xs={12} md={12} lg={12}>
                      <Grid
                        item
                        className="ma-Divider-bar w-100 px-4 pb-3 pt-0"
                      >
                        <div className="createlead-buttons ma-login-btn">
                          <LoadingButton
                            loading={loader}
                            loadingIndicator={<CircularProgress />}
                            className="createlead-buttons__saveButton savebtntext"
                            disabled={loader}
                            type="submit"
                            variant="contained"
                            color="info"
                          >
                            {btnText}
                          </LoadingButton>
                          <Button
                            className="ms-3 cancelbtn"
                            variant="outlined"
                            onClick={() => handleCancel()}
                          >
                            CANCEL
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                    {openDiscard && (
                      <DeletePopup
                        title="Discard Changes ?"
                        content="Unsaved changes will be lost and campaign will be cancelled?"
                        openDelete={openDiscard}
                        handleClose={() => setOpenDiscard(false)}
                        handleDelete={() => handleBack()}
                        loading={loader}
                      />
                    )}
                  </Form>
                  <SelectTemplateDialog
                    navigateFrom="Create"
                    title="Start from a blank or use templates"
                    openPopup={openPopup}
                    handleClosePopup={handleClosePopup}
                    masterTemplate={true}
                  />
                  <SelectTemplateDialog
                    navigateFrom="Create"
                    title="My templates"
                    showFirstCard={false}
                    openPopup={openTemplatePopup}
                    handleClosePopup={handleClosePopup}
                  />
                </>
              );
            }}
          </Formik>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateCampaign;
