import React, { useEffect, useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import OwnerDropdown from "../../../pages/common/OwnerDropdown";
import FooterReport from "./FooterReport";
import { DataContext } from "../../../context";
import { useParams } from "react-router-dom";
import { userApi } from "../../../apis/userApi";
import debouce from "lodash.debounce";
import "../../../styles/global/common.css";
import { DealsApi } from "../../../apis/DealsApi";
import CurrencyTextField from "../../../pages/common/CurrencyField";
import ReportsAutoComplete from "./ReportsAutoComplete";
import { FormatDate } from "../../../utils";
import { getMethodError } from "../../../constants/errorMessages";
import { Toaster } from "../../../pages/common/Toaster";
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { IconButton } from "@mui/material";

const DealReport = ({
  setDiscard_open,
  setActiveStep,
  users,
  handleCreateClick,
  reportErrMsg,
  conditions,
  original_conditions,
  loading,
}) => {
  const [value, setValue] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [dealDay, setDealDay] = useState();
  const [tenure, setTenure] = useState("");
  const [kick_off_date, setKick_off_date] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [contactsValue, setContactsValue] = useState("");
  const [srchUser, setSrchUser] = useState(false);
  const { createModuleFields, setCreateModuleFields } = useContext(DataContext);
  const [currency, setCurrency] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [openCalendar1, setOpenCalendar1] = useState(false)
  const [openCalendar2, setOpenCalendar2] = useState(false)
  const [openCalendar3, setOpenCalendar3] = useState(false)
  // name states 
  const [paymentTerm_name, setTermName] = useState("");
  const [dealDay_name, setDealDayName] = useState("");
  const Dealsname = "Deals" + " ";
  const [payment_modeArr, setPayment_modeArr] = useState([]);
  const dealDayArr = [
    { id: "4", type: "deal_by_day", attributes: { name: "Today", value: "today" } },
    { id: "3", type: "deal_by_day", attributes: { name: "Last Week", value: "last_week" } },
    { id: "2", type: "deal_by_day", attributes: { name: "This Week", value: "this_week" } },
    { id: "1", type: "deal_by_day", attributes: { name: "This Month", value: "this_month" } },
  ];
  const params = useParams();
  const reportId = params?.id;
  let userInfo = JSON.parse(localStorage.getItem("user_info"));
  let updatedValue = {};

  useEffect(() => {
    if (reportId) {
      setContactsValue(original_conditions?.owner_name || "");
      setTenure(conditions?.tenure);
      setKick_off_date(conditions?.kick_off_date || null);
      setDealDay(original_conditions?.deal_by_day || null);
      setValue(conditions?.value);
      setDateFrom(conditions?.date_from || null);
      setDateTo(conditions?.date_to || null);
      setCurrency(original_conditions?.currency_id ? original_conditions?.currency_id : userInfo?.currency?.id);
      setTermName(original_conditions?.payment_terms_name);
      setDealDayName(original_conditions?.deal_day_name);

      updatedValue = {
        owner: conditions?.owner_id,
        payment_mode: conditions?.payment_mode_id,
        tenure: conditions?.tenure,
        kick_off_date: conditions?.kick_off_date,
        deal_by_day: original_conditions?.deal_by_day,
        value: conditions?.value,
        date_from: original_conditions?.date_from,
        date_to: original_conditions?.date_to,
        currency_id: conditions?.currency_id,
        payment_terms_name: original_conditions?.payment_terms_name,
        deal_day_name: original_conditions?.deal_day_name,
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
    getPaymentModeData();
    if (!reportId) {
      setCurrencyInit();
    }
  }, []);
  const setCurrencyInit = () => {
    setCurrency(userInfo?.currency?.id);
    let updatedValue = { currency_id: userInfo?.currency?.id };
    setValidValue(updatedValue);
  };

  const getPaymentModeData = () => {
    DealsApi.getPaymentModeData().then((response) => {
      if (response?.data) {
        setPayment_modeArr(response?.data);
      }
    })
    .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
    });
  };

  const handlePaymentsTerms = (value) => {
    if (!value) {
      setTermName();
      deleteKey("payment_mode");
      deleteKey("payment_terms_name");
      return;
    }
    setTermName(value.attributes.name);
    updatedValue = { payment_mode: parseInt(value.id), payment_terms_name: value.attributes.name };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };
  const handleDealByDay = (value) => {
    if (!value) {
      setDealDay("");
      setDealDayName("");
      deleteKey("deal_by_day");
      deleteKey("deal_day_name");
      return;
    }
    setDealDay(value.id);
    setDealDayName(value.attributes.name);
    updatedValue = { deal_by_day: parseInt(value.id), deal_day_name: value.attributes.name };
    setValidValue(updatedValue);
  };

  const handletuner = (event) => {
    setTenure(event.target.value.replace(/\D/g, ""));
    if (event.target.value) {
      updatedValue = { tenure: event.target.value.replace(/\D/g, "") };
      setValidValue(updatedValue);
    } else {
      deleteKey("tenure");
    }
  };

  const handleValue = (e) => {
    const temp = e.target.value.replace(/\D/g, "");
    if (!temp) {
      setValue();
      deleteKey("value");
      deleteKey("currency_id");
      return;
    }
    setValue(temp);
    updatedValue = {
      value: e.target.value.replace(/\D/g, ""),
      currency_id: currency,
    };
    setValidValue(updatedValue);
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
        placeholder="Choose deal owner from here"
      />
    );
  };

  const handleSubmit = () => {
    if (
      createModuleFields["currency_id"] &&
      !createModuleFields["value"]
    ) {
      deleteKey("currency_id");
    }
    handleCreateClick();
  };

  // kick off date
  const handleKickChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d);
    setKick_off_date(formated_date);
    updatedValue = {
      kick_off_date: formated_date,
    };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const clearKickDate = () => {
    setOpenCalendar1(false); // Close the calendar
    setKick_off_date(null); // Clear the date
  };

  // date from
  const handleDateFromChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d);
    setDateFrom(formated_date);
    updatedValue = {
      date_from: formated_date,
    };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const clearFromDate = () => {
    setOpenCalendar2(false); // Close the calendar
    setDateFrom(null); // Clear the date
  };

  // date to
  const handleDateToChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d);
    setDateTo(formated_date);
    updatedValue = {
      date_to: formated_date,
    };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const clearDateTo = () => {
    setOpenCalendar3(false); // Close the calendar
    setDateTo(null); // Clear the date
  };

  return (
    <>
      <Box>
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
            <label data-testid="deal-owner" className="labeltxt ">
              Deal Owner
            </label>
            {contactDropDown()}
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Payment Mode</label>
            <ReportsAutoComplete
              dataTestId="payment_terms"
              name="payment_mode"
              optionsArr={payment_modeArr}
              placeholder="Select payment mode"
              handleFunction={handlePaymentsTerms}
              valueName={paymentTerm_name}
            />
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">{Dealsname} Tenure (Week) </label>
            <TextField
              data-testid="tenure"
              className="createlead-textField placeholder_field"
              fullWidth
              placeholder="1"
              name="tenure"
              value={tenure}
              inputProps={{
                maxLength: 3,
              }}
              onChange={(e) => handletuner(e)}
              id="tenuer"
            />
          </Grid>

          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt">Implementation Kick-off</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={kick_off_date}
                open={openCalendar1}
                onOpen={() => setOpenCalendar1(true)}
                onClose={() => setOpenCalendar1(false)}
                onChange={(newValue) => handleKickChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    data-testid="Call_Time"
                    {...params}
                    fullWidth
                    name="Call Time"
                    size="medium"
                    id="Pipeline Journey"
                    placeholder="Nov 10,2022"
                    onKeyDown={(e) => e.preventDefault()}
                    onKeyUp={(e) => e.preventDefault()}
                    onMouseDown={() => setOpenCalendar1(true)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => clearKickDate()}
                            size="small"
                            edge="end"
                          >
                            {kick_off_date && <ClearIcon />}
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

          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Deal By Day</label>
            <ReportsAutoComplete
              dataTestId="dealDay"
              name="dealDay"
              optionsArr={dealDayArr}
              placeholder="Select deal by day"
              handleFunction={handleDealByDay}
              valueName={dealDay_name}
            />
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">{Dealsname} Value</label>
            <CurrencyTextField
              currency={currency}
              setCurrency={setCurrency}
              expected_revenue={value}
              setRevenue={setValue}
              handleChange={handleValue}
            />
          </Grid>
          {!dealDay && (
            <>
              <Grid item xs={6} md={6} className={"createlead-detail-grid "}>
                <label className="labeltxt ">Date From</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateFrom}
                    open={openCalendar2}
                    onOpen={() => setOpenCalendar2(true)}
                    onClose={() => setOpenCalendar2(false)}
                    onChange={(newValue) => handleDateFromChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        data-testid="date_From"
                        name="Date To"
                        size="medium"
                        id="Deal sign_off_date"
                        placeholder="Nov 10,2022"
                        onKeyDown={(e) => e.preventDefault()}
                        onKeyUp={(e) => e.preventDefault()}
                        onMouseDown={() => setOpenCalendar2(true)}
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
              <Grid item xs={6} md={6} className={"createlead-detail-grid "}>
                <label className="labeltxt ">Date To</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateTo}
                    open={openCalendar3}
                    onOpen={() => setOpenCalendar3(true)}
                    onClose={() => setOpenCalendar3(false)}
                    onChange={(newValue) => handleDateToChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        data-testid="date_to"
                        name="Date To"
                        size="medium"
                        id="Deal sign_off_date"
                        placeholder="Nov 10,2022"
                        onKeyDown={(e) => e.preventDefault()}
                        onKeyUp={(e) => e.preventDefault()}
                        onMouseDown={() => setOpenCalendar3(true)}
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
                                onClick={() => setOpenCalendar3(true)}
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
            </>
          )}
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <div className="ma-createMain-form">
            <FooterReport
              phoneErrorMessage={""}
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

export default DealReport;
