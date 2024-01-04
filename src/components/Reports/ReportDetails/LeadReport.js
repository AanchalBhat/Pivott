import React, { useState, useEffect, useContext } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneInput from "react-phone-input-2";
import { LeadAPI } from "../../../apis/LeadApi";
import OwnerDropdown from "../../../pages/common/OwnerDropdown";
import FooterReport from "./FooterReport";
import { DataContext } from "../../../context";
import { useParams } from "react-router-dom";
import { userApi } from "../../../apis/userApi";
import debouce from "lodash.debounce";
import "react-phone-input-2/lib/style.css";
import "../../../styles/global/common.css";
import "../../../styles/custom/Create.css";
import { EMAIL_REGEX } from "../../../utils/regexLists";
import ReportsAutoComplete from "./ReportsAutoComplete";
import { FormatDate } from "../../../utils";
import { Toaster } from "../../../pages/common/Toaster";
import { getMethodError } from "../../../constants/errorMessages";
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { IconButton } from "@mui/material";

const LeadReport = ({
  setDiscard_open,
  setActiveStep,
  handleCreateClick,
  reportErrMsg,
  conditions,
  original_conditions,
  loading,
}) => {
  const [leadSourceArray, setLeadSourceArray] = useState([]);
  const [leadIndustryArray, setLeadIndustryArray] = useState([]);
  const [compnySizeArray, setCompnySizeArray] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [dateTo, setDateTo] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [contactsValue, setContactsValue] = useState("");
  const [leadStatusArray, setLeadStatusArray] = useState([]);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [phone_code, setPhoneCode] = useState("");
  const [srchUser, setSrchUser] = useState(false);
  const { setCreateModuleFields } = useContext(DataContext);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [openCalendar1, setOpenCalendar1] = useState(false)
  const [openCalendar2, setOpenCalendar2] = useState(false)
  // set states name
  const [source_name, setSourceName] = useState("");
  const [status_name, setStatusName] = useState("");
  const [industry_name, setIndustryName] = useState("");
  const [comp_size_name, setCompSizeName] = useState("");
  // loading state
  const [userLoading, setUserLoading] = useState(false);
  const params = useParams();
  const reportId = params?.id;
  let updatedValue = {};

  useEffect(() => {
    if (reportId) {
      setContactsValue(original_conditions?.owner_name || "");
      setEmail(conditions?.email);
      setPhoneNumber(conditions?.country_code + " " + conditions?.phone_number);
      setDesignation(conditions?.designation);
      setDateFrom(original_conditions?.date_from || null);
      setDateTo(original_conditions?.date_to || null);
      setSourceName(original_conditions?.source_name);
      setStatusName(original_conditions?.status_name);
      setIndustryName(original_conditions?.industry_name);
      setCompSizeName(original_conditions?.comp_size_name);

      updatedValue = {
        owner: conditions?.owner_id,
        email: conditions?.email,
        designation: conditions?.designation,
        lead_source: conditions?.lead_source_id,
        status: original_conditions?.status,
        industry: conditions?.industry_id,
        company_size: conditions?.company_size_id,
        country_code: conditions?.country_code,
        phone_number: conditions?.phone_number,
        date_from: original_conditions?.date_from,
        date_to: original_conditions?.date_to,
        source_name: original_conditions?.source_name,
        status_name: original_conditions?.status_name,
        industry_name: original_conditions?.industry_name,
        comp_size_name: original_conditions?.comp_size_name,
      };

      let flag = false;

      Object.keys(updatedValue).forEach(function (key) {
        if (updatedValue[key]) {
          flag = true;
        }
      });
      if (flag) {
        setCreateModuleFields((createModuleFields) => ({
          ...createModuleFields,
          ...updatedValue,
        }));
      }
    }
  }, []);

  useEffect(() => {
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
    getLeadSourceData();
    getLeadStatusData();
    getIndustry();
    getCompanySize();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e?.target?.value);
    if (e.target.value) {
      updatedValue = { email: e?.target?.value };
      setValidValue(updatedValue);
    } else {
      deleteKey("email");
    }
    if (!e.target.value) {
      setEmailErrorMessage("");
    } else if (!EMAIL_REGEX.test(e.target.value)) {
      setEmailErrorMessage("Please enter a valid email Id");
    } else {
      setEmailErrorMessage("");
    }
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
    if (e.target.value) {
      updatedValue = { designation: e.target.value };
      setValidValue(updatedValue);
    } else {
      deleteKey("designation");
    }
  };

  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData()
      .then((response) => {
        if (response?.data?.length > 0) {
          setLeadSourceArray(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getIndustry = () => {
    LeadAPI.getIndustry().then((response) =>
      setLeadIndustryArray(response?.data)
    )
    .catch((error) => {
      Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getCompanySize = () => {
    LeadAPI.getCompanySize().then((response) =>
      setCompnySizeArray(response?.data)
    )
    .catch((error) => {
      Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleLeadSourceChange = (value) => {
    if (!value) {
      setSourceName();
      deleteKey("lead_source");
      deleteKey("source_name");
      return;
    }
    setSourceName(value.attributes.name);
    updatedValue = { lead_source: value.id, source_name: value.attributes.name };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const getLeadStatusData = () => {
    LeadAPI.getLeadStatusData()
      .then(function (response) {
        if (response?.data?.length > 0) {
          setLeadStatusArray(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleLeadStatusChange = (value) => {
    if (!value) {
      setStatusName();
      deleteKey("status");
      deleteKey("status_name");
      return;
    }
    setStatusName(value.attributes.name);
    updatedValue = { status: value.id, status_name: value.attributes.name };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const handleIndustryChange = (value) => {
    if (!value) {
      setIndustryName();
      deleteKey("industry");
      deleteKey("industry_name");
      return;
    }
    setIndustryName(value.attributes.name);
    updatedValue = { industry: value.id, industry_name: value.attributes.name };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const handleCompany_size = (value) => {
    if (!value) {
      setCompSizeName();
      deleteKey("company_size");
      deleteKey("comp_size_name");
      return;
    }
    setCompSizeName(value.attributes.name);
    updatedValue = { company_size: value.id, comp_size_name: value.attributes.name };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const handlePhoneChanges = (value, data, event, formattedValue) => {
    const countryCode = "+" + data.dialCode;
    setPhoneNumber(formattedValue);
    setPhoneCode(countryCode);
    let number = formattedValue.replace(phone_code, "").trim();

    if (phone_code && number) {
      updatedValue = {
        country_code: phone_code,
        phone_number: number,
      };
      setValidValue(updatedValue);
    } else {
      deleteKey("country_code");
      deleteKey("phone_number");
    }

    let split_data = formattedValue?.split(countryCode);
    let split_no = split_data[1];
    if (data?.countryCode === "in") {
      if (split_no?.length > 11) {
        setPhoneErrorMessage("");
      } else if (!split_no?.length) {
        setPhoneErrorMessage("");
      } else {
        setPhoneErrorMessage("Please enter valid Contact");
      }
    } else {
      setPhoneErrorMessage("");
    }
  };

  useEffect(() => {
    if (!srchUser) {
      getLeadOwnerData();
    }
  }, [srchUser]);

  const getLeadOwnerData = (srchQuery) => {
    userApi.getUsers(srchQuery).then((data) => {
      setUserLoading(true);
      if (data?.data) {
        setUsersData(data?.data);
      } else {
        setUsersData([]);
      }
      setUserLoading(false);
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
        getLeadOwnerData(e);
      }
    }, 800),
    []
  );

  const getContactData = (event, newValue, isCheck) => {
    if (newValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }
    setContactsValue(newValue);
  };

  const setValidValue = (valueObject) => {
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...valueObject,
    }));
  };

  const deleteKey = (key) => {
    setCreateModuleFields((createModuleFields) => {
      delete createModuleFields[key];
      return {
        ...createModuleFields,
        ...updatedValue,
      };
    });
  };

  const handleContactId = (event, val) => {
    if (val?.id) {
      updatedValue = { owner: parseInt(val?.id) };
      setValidValue(updatedValue);
    } else {
      deleteKey("owner");
    }
  };

  const contactDropDown = () => {
    return (
      <OwnerDropdown
        users={usersData}
        contactsValue={contactsValue}
        getContactData={getContactData}
        handleContactId={handleContactId}
        userLoading={userLoading}
        placeholder="Choose lead owner from here"
      />
    );
  };

  const handleSubmit = () => {
    if (!phone_number?.length) {
      setPhoneErrorMessage("");
    }
    if (phoneErrorMessage == "" && emailErrorMessage == "") {
      handleCreateClick();
    }
  };

  // date from
  const handleDateFromChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d)
    setDateFrom(formated_date);
    updatedValue = {
      date_from: formated_date
    };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const clearFromDate = () => {
    setOpenCalendar1(false); // Close the calendar
    setDateFrom(null); // Clear the date
  };

  // date to
  const handleDateToChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d)
    setDateTo(formated_date);
    updatedValue = {
      date_to: formated_date
    };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const clearDateTo = () => {
    setOpenCalendar2(false); // Close the calendar
    setDateTo(null); // Clear the date
  };

  return (
    <>
      <Box className="ma-createMain-form">
        {reportErrMsg && (
          <span
            className="ma-error d-flex justify-content-center mt-1 pt-2 font-weight-bold"
            style={{ fontSize: "17px" }}
          >
            {reportErrMsg}
          </span>
        )}
        <Grid container spacing={3} md={8} className="mx-auto my-4">
          <Grid item xs={6} md={6}>
            <label className="labeltxt ">Lead Owner</label>
            {contactDropDown()}
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Lead Source</label>
            <ReportsAutoComplete
              dataTestId="lead_source"
              name="lead_source_id"
              optionsArr={leadSourceArray}
              placeholder="Select lead source"
              handleFunction={handleLeadSourceChange}
              valueName={source_name}
            />
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Lead Status</label>
            <ReportsAutoComplete
              dataTestId="lead_status"
              name="status_id"
              optionsArr={leadStatusArray}
              placeholder="Select lead status"
              handleFunction={handleLeadStatusChange}
              valueName={status_name}
            />
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Industry</label>
            <ReportsAutoComplete
              dataTestId="industry"
              name="industry"
              optionsArr={leadIndustryArray}
              placeholder="Select industry"
              handleFunction={handleIndustryChange}
              valueName={industry_name}
            />
          </Grid>
          <Grid item xs={6} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Email</label>
            <TextField
              data-testid="email"
              className="createlead-textField placeholder_field"
              fullWidth
              id="email"
              placeholder="farhan@gmail.com"
              name="email"
              value={email}
              onChange={(e) => handleEmailChange(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              }}
              helperText={<span className="ma-error">{emailErrorMessage}</span>}
            />
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Company Size</label>
            <ReportsAutoComplete
              dataTestId="company_size"
              name="company_size"
              optionsArr={compnySizeArray}
              placeholder="Select company size"
              handleFunction={handleCompany_size}
              valueName={comp_size_name}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            className={"createlead-detail-grid"}
            data-testid="phone_number"
          >
            <label className="labeltxt ">Contact</label>
            <div className="ma-country-code">
              <PhoneInput
                country={"in"}
                inputProps={{ "data-testid": "phone" }}
                value={phone_number}
                onChange={handlePhoneChanges}
                countryCodeEditable={false}
              />
              <span className="ma-error">{phoneErrorMessage}</span>
            </div>
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Designation</label>
            <TextField
              data-testid="designation"
              className="createlead-textField placeholder_field"
              fullWidth
              id="designation"
              placeholder="Enter designation "
              name="designation"
              value={designation}
              onChange={(e) => handleDesignationChange(e)}
            />
          </Grid>

          <Grid item xs={6} md={6} className={"createlead-detail-grid "}>
            <label className="labeltxt ">Date From</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateFrom}
                open={openCalendar1}
                onOpen={() => setOpenCalendar1(true)}
                onClose={() => setOpenCalendar1(false)}
                onChange={(newValue) => handleDateFromChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    data-testid="date_from"
                    name="Date From"
                    size="medium"
                    id="Deal sign_off_date"
                    placeholder="Nov 10,2022"
                    onKeyDown={(e) => e.preventDefault()}
                    onKeyUp={(e) => e.preventDefault()}
                    onMouseDown={() => setOpenCalendar1(true)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => clearFromDate()}
                            size="small"
                            edge="end"
                          >
                            {dateFrom && <ClearIcon />}
                          </IconButton>
                          <IconButton
                            onClick={() => setOpenCalendar1(true)}
                            size="small"
                            edge="end"
                          >
                            <CalendarTodayIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} md={6} className={"createlead-detail-grid "}>
            <label className="labeltxt ">Date To</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateTo}
                open={openCalendar2}
                onOpen={() => setOpenCalendar2(true)}
                onClose={() => setOpenCalendar2(false)}
                onChange={(newValue) => handleDateToChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    data-testid="date_from"
                    name="Date From"
                    size="medium"
                    id="Report date_from"
                    placeholder="Nov 10,2022"
                    onKeyDown={(e) => e.preventDefault()}
                    onKeyUp={(e) => e.preventDefault()}
                    onMouseDown={() => setOpenCalendar2(true)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => clearDateTo()}
                            size="small"
                            edge="end"
                          >
                            {dateTo && <ClearIcon />}
                          </IconButton>
                          <IconButton
                            onClick={() => setOpenCalendar2(true)}
                            size="small"
                            edge="end"
                          >
                            <CalendarTodayIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <div className="ma-createMain-form">
            <FooterReport
              phoneErrorMessage={phoneErrorMessage}
              handleSubmit={handleSubmit}
              setActiveStep={setActiveStep}
              setDiscard_open={setDiscard_open}
              setCreateModuleFields={setCreateModuleFields}
              loading={loading}
            />
          </div>
        </Grid>
      </Box>
    </>
  );
};

export default LeadReport;
