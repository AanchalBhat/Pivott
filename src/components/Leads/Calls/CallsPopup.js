import React, { useEffect, useState, useRef } from "react";
//mui
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { callApi } from "../../../apis/callApi";
import moment from "moment";
import { useParams } from "react-router-dom";
import CloseIcons from "@mui/icons-material/Close";
import { Toaster } from "../../../pages/common/Toaster";
import UsersAutocomplete from "../../../pages/common/userAutocomplete";
import { userApi } from "../../../apis/userApi";
import debouce from "lodash.debounce";
import { Autocomplete, InputLabel } from "@mui/material";
import "./CallsPopup.css";
import { TimeZoneApi } from "../../../apis/TimeZonesApi";
import { ButtonLoader } from "../../../pages/common/ButtonLoader";
import { FormatDate, TodayDate } from "../../../utils";
import { getMethodError, restMethodError } from "../../../constants/errorMessages";


const MeetingsPopup = ({
  call,
  closeDrawer,
  isEdit,
  type,
  callsInit,
  page,
  setPage,
  setLoadMoreClick,
  updateCall,
}) => {
  let currentUser = JSON.parse(localStorage.getItem("user_info"));
  let userDataCall = JSON.parse(localStorage.getItem("useDataPopup"));
  const [users, setUsers] = useState([]);

  const [assignTo, setassignTo] = useState("");
  const [assignToName, setAssignToName] = useState("");
  const [callToName, setCallToName] = useState("");
  const [reminder, setReminder] = useState("");
  const [organizer, setorganizer] = useState(currentUser?.full_name);
  const [purpose, setpurpose] = useState("");
  const [purposeErr, setpurposeErr] = useState('')
  const [agenda, setagenda] = useState("");
  const [description, setDescription] = useState("");
  const [callTypes, setcallTypes] = useState([]);
  const [callType, setcallType] = useState("");
  const [callsErr, setCallsErr] = useState("");
  const [assignErr, setAssignErr] = useState("");
  const [callTypeErr, setCallTypeErr] = useState("");
  const [date, setDate] = useState(TodayDate());
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const params = useParams();
  const callTypeRef = useRef(null);
  const organizerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  let today = new Date();
  today.setMinutes(today.getMinutes() + 15);
  let hours = today.getHours();
  let minutes = today.getMinutes();
  minutes = minutes <= 9 ? '0' + minutes : minutes;

  let currentTime = hours + ':' + minutes;
  const [callTime, setcallTime] = useState(currentTime);

  const phoneno = `${userDataCall?.attributes?.contact_detail?.country_code || ""
    } ${userDataCall?.attributes?.contact_detail?.phone_number || ""}`;

  const [callTo, setcallTo] = useState(phoneno);
  const [timezoneData, setTimeZoneData] = useState([]);
  const [timezone, setTimezone] = useState("");
  const [timeZoneErr, setTimeZoneErr] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false)

  useEffect(() => {
    let time_zone = currentUser?.timezone;
    setTimezone(time_zone);
    getTimeZones();
    callApi
      .getCallTypes()

      .then((response) => {
        setcallTypes(response?.data);
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });

    if (call && Object.keys(call)?.length > 0) {
      setassignTo(call?.attributes?.assignee?.id);
      setAssignToName(call?.attributes?.assignee?.full_name || "");
      setcallTo(call?.attributes?.call_to);
      setCallToName(call?.attributes?.call_recipent?.full_name || "");
      setpurpose(call?.attributes?.purpose);
      setcallTime(call?.attributes?.call_time);
      setDate(moment(call?.attributes?.call_date).format("YYYY-MM-DD"));
      setorganizer(organizer);
      setcallType(call?.attributes?.call_type_id);
      setReminder(call?.attributes?.reminder);
      setagenda(call?.attributes?.agenda);
      setDescription(call?.attributes?.description);
      setTimezone(call?.attributes?.timezone);
    }
  }, []);

  const handleClose = () => {
    closeDrawer();
  };

  const handleSubmit = async () => {
    const minMobLength = 5;
    handleValidation();
    let types = type;

    if (
      callTo?.length > minMobLength &&
      organizer?.length !== 0 &&
      callType?.length !== 0 &&
      purpose?.length !== 0 &&
      timezone?.length !== 0
    ) {
      setLoading(true);
      var datetime = new Date();
      var now = datetime
        .toISOString()
        .replace(/T/, " ")
        .replace(/:00.000Z/, "");
      const body = {
        callable_id: parseInt(params?.id),
        callable_type: types,
        assigned_to: parseInt(assignTo),
        call_to: callTo,
        organized_by: parseInt(localStorage.getItem("login_id")),
        purpose: purpose,
        call_type_id: parseInt(callType),
        status: "Scheduled",
        call_date: date ? date : now,
        call_time: callTime,
        reminder: reminder ? reminder : "",
        agenda: agenda ? agenda : "",
        description: description ? description : "",
        timezone: timezone,
      };
      if (call && Object.keys(call)?.length > 0) {
        await callApi
          .editCall(call?.id, params?.id, types, body)

          .then((response) => {
            if (response?.data) {
              updateCall(response?.data);
              closeDrawer();
              Toaster.TOAST("Calls updated successfully", "success");
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Toaster.TOAST(restMethodError(error), "error");
            console.log(error);
          });
      }
      if (!isEdit) {
        callApi
          .scheduleCall(body)

          .then((data) => {
            if (data?.data) {
              setLoadMoreClick(false);
              if (page === 1) {
                callsInit();
              } else {
                setPage(1);
              }
              closeDrawer();
              Toaster.TOAST("Calls created successfully", "success");
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Toaster.TOAST(restMethodError(error), "error");
            console.log(error);
          });
      }
    }
  };

  const handleType = (e) => {
    setcallType(e.target.value);
    if (!e.target.value) {
      setCallTypeErr("Please select type");
    } else {
      setCallTypeErr("");
    }
  };

  const purposeHandler = (e) => {
    setpurpose(e.target.value);
    if (!e.target.value) {
      setpurposeErr("Please select purpose");
    } else {
      setpurposeErr("");
    }
  }

  const handleCallto = (e) => {
    setcallTo(e.target.value);
    if (!e.target.value) {
      setCallsErr("Call to can't be empty");
    } else {
      setCallsErr("");
    }
  };

  const handleValidation = () => {
    const minMobLength = 5;
    let isFocus = true;
    if (!(callTo?.length > minMobLength)) {
      setCallsErr("Call to can't be empty");
    }

    if (!purpose) {
      setpurposeErr("Please select purpose");
    }

    if (!callType) {
      if (isFocus) {
        callTypeRef.current.focus();
        isFocus = false;
      }
      setCallTypeErr("Please select type");
    }

    if (!organizer) {
      if (isFocus) {
        organizerRef.current.focus();
        isFocus = false;
      }
    }
  };

  const setValue = (newValue, title) => {
    if (title === "call_to") {
      setcallTo(newValue?.id);
      if (newValue?.id) {
        setCallsErr("");
      }
    } else if (title === "assign_to") {
      setassignTo(newValue?.id);
      if (newValue?.id) {
        setAssignErr("");
      }
    }
  };

  useEffect(() => {
    if (!srchUser) {
      getOwnerData();
    }
  }, [srchUser]);

  const getOwnerData = (srchQuery) => {
    userApi.getUsers(srchQuery).then((data) => {
      setUserLoading(true);
      if (data?.data) {
        setUsers(data?.data);
        setUserLoading(false);
      } else {
        setUsers([]);
        setUserLoading(false);
      }
    })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const debounceSaveUser = React.useCallback(
    debouce(function (e) {
      if (e) {
        getOwnerData(e);
      }
    }, 800),
    []
  );

  const handleInputChange = (event, newInputValue, title) => {
    if (newInputValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newInputValue);
    }
    if (title === "call_to") {
      setCallToName(newInputValue);
    } else if (title === "assign_to") {
      setAssignToName(newInputValue);
    }
  };

  const getUserAutocomplete = (title) => {
    return (
      <UsersAutocomplete
        title={title}
        userLoading={userLoading}
        setValue={setValue}
        handleInputChange={handleInputChange}
        callTo={callTo}
        assignTo={assignTo}
        organizer={currentUser?.id}
        value={title === "call_to" ? callToName : assignToName}
        error={title === "call_to" ? callsErr : assignErr}
        options={users}
        placeholder={title !== "call_to" && "Select assign to"}
      />
    );
  };

  const handleTimezone = (e, value) => {
    setTimezone(value);
    if (!value) {
      setTimeZoneErr("Please select timezone");
    } else {
      setTimeZoneErr("");
    }
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

  // date
  const handleDateChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d)
    setDate(formated_date);
  };

  const handleKeyPress = (event) => {
    const NumStartKeyCode = 48;
    const NumEndKeyCode = 57;
    const plusSymbolCode = 43;
    const charCode = event.charCode;
    const inputValue = event.target.value;

    if (
      (charCode < NumStartKeyCode || charCode > NumEndKeyCode) &&
      !(inputValue.length === 0 && charCode === plusSymbolCode)
    ) {
      event.preventDefault();
    }
    if (inputValue.length >= 18) {
      event.preventDefault();
    }
  };
  const TimeZoneDropDown = () => {
    return (

      <Autocomplete
        disablePortal
        disableClearable
        className="ma-contact-pipline m-0 placeholder_field"
        id="combo-box-demo"
        options={timezoneData}
        value={timezone}
        onChange={(e, value) => {
          handleTimezone(e, value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select timezone"
            helperText={<span className="ma-error">{timeZoneErr}</span>}
          />
        )}
      />
    );
  };

  return (
    <Paper elevation={2} className="ma-popupAll-side">
      <div>
        <button
          data-testid="schedule-btn"
          className="createtask_btn"
          onClick={handleClose}
        >
          <span className="createtask_txt">Schedule a call</span>
          <CloseIcons sx={{ color: "#fff", cursor: "pointer" }} />
        </button>
        <h6 data-testid="schedule" className="filldetails_txt">
          Schedule
        </h6>
      </div>
      <div className="ma-calls-field">
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label data-testid="call-to" className="duedate_text">
                <span className="requreiedField">*</span>Call to
              </label>
              <TextField
                data-testid="call-to"
                name="Assign to"
                size="medium"
                id="Assign to"
                placeholder="call to"
                className="duedate_textfield"
                value={callTo}
                onChange={handleCallto}
                onKeyPressCapture={handleKeyPress}
                helperText={<span className="ma-error">{callsErr}</span>}

              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <label data-testid="call-type" className="duedate_text">
                <span className="requreiedField">*</span>Call Type
              </label>
              <TextField
                data-testid="call-2"
                name="Call to"
                inputRef={callTypeRef}
                size="medium"
                id="Call to"
                placeholder="Outbound"
                className="duedate_textfield"
                select={true}
                value={callType}
                onChange={(e) => handleType(e)}
                helperText={<span className="ma-error">{callTypeErr}</span>}
                label={!callType && "Select call type"}
                InputLabelProps={{
                  shrink: false,
                  style: {
                    color: "#8c8da3",
                    fontSize: "14px",
                  },
                }}
              >
                {callTypes?.map((callType, key) => (
                  <MenuItem value={callType?.id} key={key}>
                    {callType?.attributes?.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                variant="standard"
                className="FormInputlable duedate_text"
              >
                <span className="requreiedField">*</span>Time zone
              </InputLabel>
              {TimeZoneDropDown()}
            </Grid>
            <Grid item xs={6}>
              <label data-testid="call-date" className="duedate_text">
                <span className="requreiedField">*</span>Call Date
              </label>
              <LocalizationProvider
                data-testid="date-picker"
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  disablePast
                  value={date}
                  open={openCalendar}
                  onOpen={() => setOpenCalendar(true)}
                  onClose={() => setOpenCalendar(false)}
                  onChange={(newValue) => handleDateChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="Call Date"
                      size="medium"
                      id="Call Date"
                      className="duedate_textfield"
                      onKeyDown={(e) => e.preventDefault()}
                      onClick={() => setOpenCalendar(true)}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <label data-testid="call-time" className="duedate_text">
                <span className="requreiedField">*</span>Call Time{" "}
              </label>
              <TextField
                date-testid="call-T"
                name="Call Time "
                size="medium"
                id="Call Time "
                placeholder="Dec 30, 2022"
                className="duedate_textfield placeholder_field"
                type="time"
                value={callTime}
                onChange={(e) => setcallTime(e.target.value)}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <label data-testid="assign-to" className="duedate_text">
                Assign to
              </label>
              {getUserAutocomplete("assign_to")}
            </Grid>

            <Grid item xs={12}>
              <label data-testid="organizer" className="duedate_text">
                Organizer
              </label>
              <TextField
                data-testid="organizer-2"
                name="Organizer"
                size="medium"
                id="Organizer"
                disabled
                sx={{ background: "#f1f1f4" }}
                className="duedate_textfield"
                value={organizer}
              />
            </Grid>

            <Grid item xs={6}>
              <label data-testid="reminder" className="duedate_text">
                Reminder{" "}
              </label>
              <Select
                className="placeholder_field"
                data-testid="reminder-2"
                name="reminder"
                size="medium"
                id="reminder"
                placeholder="reminder"
                displayEmpty
                value={reminder}
                fullWidth
                onChange={(e) => {
                  setReminder(e.target.value);
                }}
                sx={{ color: reminder === "" && "#8c8da3" }}
              >
                <MenuItem value="">Select reminder</MenuItem>
                <MenuItem value={`10 Minutes`}>10 Minutes Before</MenuItem>
                <MenuItem value={`15 Minutes`}>15 Minutes Before</MenuItem>
                <MenuItem value={`20 Minutes`}>20 Minutes Before</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <label data-testid="purpose" className="duedate_text">
                <span className="requreiedField">*</span>Purpose{" "}
              </label>
              <Select
                data-testid="purpose-2"
                name="Purpose "
                size="medium"
                id="Purpose "
                className="duedate_textfield placeholder_field"
                displayEmpty
                fullWidth
                value={purpose}
                onChange={purposeHandler}
                sx={{ color: purpose === "" && "#8c8da3" }}
              >
                <MenuItem value="">{"Select purpose"}</MenuItem>
                <MenuItem key={"Negotiations"} value={"Negotiations"}>
                  {"Negotiations"}
                </MenuItem>

              </Select>
              <span className="ma-error">{purposeErr}</span>
            </Grid>

            <Grid item xs={12}>
              <label data-testid="agenda" className="duedate_text">
                Description{" "}
              </label>
              <TextField
                fullWidth
                size="medium"
                name="description"
                id="description"
                className="description_textfield_txt"
                multiline
                rows={4}
                placeholder="Typing some generic description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <ButtonLoader
                loading={loading}
                disabled={loading}
                classStyle={"schedulebtn_bg"}
                data-testid={"schedul-btn"}
                title={call?.id ? "UPDATE" : "SCHEDULE"}
                handleClick={() => handleSubmit()}
                spanTextClass={"schedulebtn_text"}
              />

              <button
                data-testid="cancel-btn"
                className="cancel_btn ms-3"
                onClick={handleClose}
              >
                <span className="cancelbtn_text"> CANCEL</span>
              </button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Paper>
  );
};

export default MeetingsPopup;
