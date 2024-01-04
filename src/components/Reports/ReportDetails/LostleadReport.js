import React, { useEffect, useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PhoneInput from "react-phone-input-2";
import { LostLeadApi } from "../../../apis/LostLeadApi";
import OwnerDropdown from "../../../pages/common/OwnerDropdown";
import FooterReport from "./FooterReport";
import { DataContext } from "../../../context";
import { useParams } from "react-router-dom";
import { userApi } from "../../../apis/userApi";
import debouce from "lodash.debounce";
import ReportsAutoComplete from "./ReportsAutoComplete";
import { FormatDate } from "../../../utils";
import "../../../styles/global/common.css";
import { Toaster } from "../../../pages/common/Toaster";
import { getMethodError } from "../../../constants/errorMessages";
import { IconButton, InputAdornment } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const LostleadReport = ({
  setDiscard_open,
  setActiveStep,
  users,
  handleCreateClick,
  reportErrMsg,
  conditions,
  original_conditions,
  loading,
}) => {
  const [usersData, setUsersData] = useState([]);
  const [phone_number, setPhoneNumber] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [company_name, setcompany] = useState("");
  const [dateTo, setDateTo] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [reasonData, setReasonData] = useState([]);
  const [contactsValue, setContactsValue] = useState("");
  const [phone_code, setPhoneCode] = useState("");
  const { setCreateModuleFields } = useContext(DataContext);
  const [companyErr, setCompanyErr] = useState("");
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [openCalendar1, setOpenCalendar1] = useState(false)
  const [openCalendar2, setOpenCalendar2] = useState(false)
  const [reasonName, setReasonName] = useState("");
  const params = useParams();
  const reportId = params?.id;
  let updatedValue = {};

  useEffect(() => {
    if (reportId) {
      setContactsValue(original_conditions?.owner_name || "");
      setPhoneNumber(conditions?.country_code + " " + conditions?.phone_number);
      setcompany(conditions?.company_name);
      setDateFrom(original_conditions?.date_from || null);
      setDateTo(original_conditions?.date_to || null);
      setReasonName(original_conditions?.reason_name);

      updatedValue = {
        owner: conditions?.owner_id,
        country_code: conditions?.country_code,
        phone_number: conditions?.phone_number,
        reason: conditions?.reason_id,
        company_name: conditions?.company_name,
        date_from: original_conditions?.date_from,
        date_to: original_conditions?.date_to,
        reason_name: original_conditions?.reason_name,
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
    getReasonData();
  }, []);

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
    if (data?.countryCode == "in") {
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

  const handleCompanyChange = (e) => {
    let val = e.target.value;
    if (val) {
      setcompany(val);
      updatedValue = { company_name: val };
      setValidValue(updatedValue);
    } else {
      setcompany("");
      deleteKey("company_name");
    }
    if (!val) {
      setCompanyErr("");
    } else if (val?.length < 3 || val?.length > 75) {
      setCompanyErr("Company should be min 3 & max 75 characters");
    } else {
      setCompanyErr("");
    }
  };

  const getReasonData = () => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    LostLeadApi.getReasonData(id?.company_id)

      .then(function (response) {
        if (response?.data?.length > 0) {
          setReasonData(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
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
    }, 1000),
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
  const handleReasons = (value) => {
    if (!value) {
      setReasonName();
      deleteKey("reason");
      deleteKey("reason_name");
      return;
    }
    setReasonName(value.attributes.name);
    updatedValue = { reason: value.reportId, reason_name: value.attributes.name };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
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
    if (phoneErrorMessage == "" && companyErr == "") {
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
                inputProps={{ "data-testid": "phone" }}
                country={"in"}
                value={phone_number}
                onChange={handlePhoneChanges}
                countryCodeEditable={false}
              />
              <span className="ma-error">{phoneErrorMessage}</span>
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <label className="labeltxt ">
              By Reason
            </label>
            <ReportsAutoComplete
              dataTestId="reason"
              name="reason"
              optionsArr={reasonData}
              placeholder="Select reason"
              handleFunction={handleReasons}
              valueName={reasonName}
            />
          </Grid>

          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Company</label>
            <TextField
              data-testid="company_name"
              className="createlead-textField placeholder_field"
              fullWidth
              id="company_name"
              placeholder="Enter company name"
              name="company_name"
              value={company_name}
              onChange={(e) => handleCompanyChange(e)}
              helperText={<span className="ma-error">{companyErr}</span>}
            />
          </Grid>
          <Grid item xs={6} md={6} className={"createlead-detail-grid "}>
            <label className="labeltxt ">Date From</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                open={openCalendar1}
                onOpen={() => setOpenCalendar1(true)}
                onClose={() => setOpenCalendar1(false)}
                value={dateFrom}
                onChange={(newValue) => handleDateFromChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    data-testid="date_From"
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

export default LostleadReport;
