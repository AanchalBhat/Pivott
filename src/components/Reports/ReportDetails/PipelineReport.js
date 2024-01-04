import React, { useEffect, useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PipelineApi } from "../../../apis/pipelineApi";
import OwnerDropdown from "../../../pages/common/OwnerDropdown";
import FooterReport from "./FooterReport";
import { DataContext } from "../../../context";
import { useParams } from "react-router-dom";
import { userApi } from "../../../apis/userApi";
import debouce from "lodash.debounce";
import "../../../styles/global/common.css";
import CurrencyTextField from "../../../pages/common/CurrencyField";
import ReportsAutoComplete from "./ReportsAutoComplete";
import { FormatDate } from "../../../utils";
import { Toaster } from "../../../pages/common/Toaster";
import { getMethodError } from "../../../constants/errorMessages";
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { IconButton } from "@mui/material";

const PipelineReport = ({
  setDiscard_open,
  setActiveStep,
  users,
  handleCreateClick,
  reportErrMsg,
  conditions,
  original_conditions,
  loading,
}) => {
  const [dateTo, setDateTo] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [expected_revenue, setRevenue] = useState();
  const [typeData, setTypeValues] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [srchUser, setSrchUser] = useState(false);
  const [contactsValue, setContactsValue] = useState("");
  const [currency, setCurrency] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const params = useParams();
  const reportId = params?.id;
  const { createModuleFields, setCreateModuleFields } = useContext(DataContext);
  const [openCalendar1, setOpenCalendar1] = useState(false)
  const [openCalendar2, setOpenCalendar2] = useState(false)
  // names for dealing with autocompletes
  const [stageName, setStageName] = useState("");
  const [typeName, setTypeName] = useState("");
  let userInfo = JSON.parse(localStorage.getItem("user_info"));
  let updatedValue = {};

  useEffect(() => {
    if (reportId) {
      setContactsValue(original_conditions?.owner_name || "");
      setRevenue(conditions?.expected_revenue);
      setDateFrom(original_conditions?.date_from || null);
      setDateTo(original_conditions?.date_to || null);
      setCurrency(
        original_conditions?.currency_id ? original_conditions?.currency_id : userInfo?.currency?.id
      );
      setStageName(original_conditions?.stage_name);
      setTypeName(original_conditions?.type_name);

      updatedValue = {
        owner: conditions?.owner_id,
        pipeline_stage: conditions?.pipeline_stage_id,
        expected_revenue: conditions?.expected_revenue,
        stage_type: conditions?.stage_type_id,
        date_from: original_conditions?.date_from,
        date_to: original_conditions?.date_to,
        currency_id: conditions?.currency_id,
        stage_name: original_conditions?.stage_name,
        type_name: original_conditions?.type_name,
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
    getTypeData();
    getStageData();
    if (!reportId) {
      setCurrencyInit();
    }
  }, []);
  const setCurrencyInit = () => {
    setCurrency(userInfo?.currency?.id);
    let updatedValue = { currency_id: currency ? currency : userInfo?.currency?.id };
    setValidValue(updatedValue);
  };

  const getTypeData = () => {
    const id = JSON.parse(localStorage.getItem("user_info"));
    PipelineApi.getType(id?.company_id)

      .then((response) => {
        if (response?.data?.length > 0) {
          setTypeValues(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getStageData = () => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    PipelineApi.getStageData(id?.company_id)
      //
      .then(function (response) {
        if (response?.data?.length > 0) {
          setStageData(response?.data);
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
        placeholder="Choose pipeline owner from here"
      />
    );
  };

  const handleRevenue = (e) => {
    const temp = e.target.value.replace(/\D/g, "");
    if (!temp) {
      setRevenue();
      deleteKey("expected_revenue");
      deleteKey("currency_id");
      return;
    }
    setRevenue(temp);
    updatedValue = {
      expected_revenue: temp,
      currency_id: currency,
    };
    setValidValue(updatedValue);
  };
  const handleType = (value) => {
    if (!value) {
      setTypeName();
      deleteKey("stage_type");
      deleteKey("type_name");
      return;
    }
    setTypeName(value.attributes.name);
    updatedValue = { stage_type: parseInt(value.id), type_name: value.attributes.name };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const handleStage = (value) => {
    if (!value) {
      setStageName();
      deleteKey("pipeline_stage");
      deleteKey("stage_name");
      return;
    }
    setStageName(value.attributes.name);
    updatedValue = { pipeline_stage: parseInt(value.id), stage_name: value.attributes.name };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  const handleSubmit = () => {
    if (
      createModuleFields["currency_id"] &&
      !createModuleFields["expected_revenue"]
    ) {
      deleteKey("currency_id");
    }
    handleCreateClick();
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
    setOpenCalendar1(false); // Close the calendar
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
    setOpenCalendar2(false); // Close the calendar
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
            <label className="labeltxt ">Pipeline Owner</label>
            {contactDropDown()}
          </Grid>
          <Grid item xs={6} md={6}>
            <label className="labeltxt ">Pipeline Stage</label>
            <ReportsAutoComplete
              dataTestId="stage"
              name="stage"
              optionsArr={stageData}
              placeholder="Select stage"
              handleFunction={handleStage}
              valueName={stageName}
            />
          </Grid>
          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Expected Revenue</label>
            <CurrencyTextField
              field="expected_revenue"
              currency={currency}
              setCurrency={setCurrency}
              expected_revenue={expected_revenue}
              setRevenue={setRevenue}
              handleChange={handleRevenue}
            />
          </Grid>

          <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
            <label className="labeltxt ">Type</label>
            <ReportsAutoComplete
              dataTestId="type"
              name="type"
              optionsArr={typeData}
              placeholder="Select type"
              handleFunction={handleType}
              valueName={typeName}
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
                    name="Date To"
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
                open={openCalendar2}
                onOpen={() => setOpenCalendar2(true)}
                onClose={() => setOpenCalendar2(false)}
                value={dateTo}
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

export default PipelineReport;
