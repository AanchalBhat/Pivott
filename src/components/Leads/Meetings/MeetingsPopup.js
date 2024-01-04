import React, { useState, useEffect, useContext, useRef } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForward";
//mui
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import "../../../components/Leads/CreateLeads.css";
import { MeetingApi } from "../../../apis/MeetingApi";
import { DataContext } from "../../../context";
import { useParams } from "react-router-dom";
import CloseIcons from "@mui/icons-material/Close";
import moment from "moment";
import ConnectApp from "./ConnectApp";
import {
  Autocomplete
} from "@mui/material";
import { Toaster } from "../../../pages/common/Toaster";
import UsersAutocomplete from "../../../pages/common/userAutocomplete";
import { userApi } from "../../../apis/userApi";
import debouce from "lodash.debounce";
import { ReactMultiEmail } from "react-multi-email";
import { EMAIL_REGEX } from "../../../utils/regexLists";
import "../../../styles/custom/Create.css";
import "./MeetingsPopup.css";
import { TimeZoneApi } from "../../../apis/TimeZonesApi";
import { ButtonLoader } from "../../../pages/common/ButtonLoader";
import { FormatDate, TodayDate } from "../../../utils";
import {
  getMethodError,
  restMethodError,
} from "../../../constants/errorMessages";

const MeetingsPopup = ({
  meet,
  closeDrawer,
  isEdit,
  type,
  setOpen,
  page,
  setPage,
  setLoadMoreClick,
  getData,
}) => {
  const user_info = JSON.parse(localStorage?.getItem("user_info"))
  let time_zone = user_info?.timezone;
  const tomorrowDate = TodayDate(1);
  const [globalStatus, setGlobalStatus] = useState();
  const [organizer2, setOrganizer2] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizer2Name, setOrganizer2Name] = useState("");
  const [title, setTitle] = useState("");
  const [reminder, setReminder] = useState("");
  const [timezone, setTimezone] = useState(time_zone);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [dateValue, setDateValue] = useState(tomorrowDate);
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("17:00");
  const { meetings, setMeetings } = useContext(DataContext);
  const [timezoneData, setTimeZoneData] = useState([]);
  const [titleErr, setTitleErr] = useState("");
  const [organiserOneErr, setOrganiserOneErr] = useState("");
  const [timeZoneErr, setTimeZoneErr] = useState("");
  const [locationErr, setLocationErr] = useState("");
  const [attendeesCount, setattendeesCount] = useState();
  const [openApp, setOpenApp] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personLocation, setpersonLocation] = useState(false);
  const [city, setCity] = useState("");
  const [cityErr, setCityErr] = useState("");
  const userDataCall = JSON.parse(localStorage.getItem("useDataPopup"));
  const organizerr = user_info?.full_name;
  const id = user_info?.id;
  const [organizer, setOrganizer] = useState(meet?.id ? "" : id);
  const emailss = userDataCall?.attributes?.contact_detail?.email;
  const [emailError, setEmailError] = useState("");
  const [emails, setEmails] = useState(meet?.id ? [] : [emailss]);
  const [openCalendar, setOpenCalendar] = useState(false);

  useEffect(() => {
    setOrganizerName(organizerr);
    const attendee = emails?.length;
    setattendeesCount(attendee);
  }, [emails]);

  window.addEventListener("storage", (event) => {
    if (event.storageArea != localStorage) return;
    if (event.key === "loggedIn") {
      localStorage.removeItem("loggedIn");
      handleClosePopup();
    }
  });

  const handleBlur = (e) => {
    if (e?.key === "Enter") {
      const inputEmail = e?.target?.value;
      const isValid = validateEmail(inputEmail);
      setEmailError(isValid ? "" : "Invalid email address");
    }
  };

  const validateEmail = (email) => EMAIL_REGEX.test(email);

  const getHandleEmail = (val) => {
    setEmails(val);
    if (!val?.length) {
      setEmailError("Attendees can't be empty");
    } else {
      setEmailError("");
    }
  };

  let param = useParams();
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const userMap = new Map();
  users?.map((user, key) =>
    userMap.set(+user?.id, user?.attributes?.full_name)
  );

  const OpenMeetingApp = () => {
    setOpenApp(true);
  };

  const handleClosePopup = () => {
    setOpenApp(false);
    setOpen(true);
  };

  const handleLocation = (e) => {
    const { name, value } = e.target;
    if (e.target.value == "in_person") {
      setpersonLocation(true);
    } else {
      setpersonLocation(false);
    }
    if (e.target.value === "connect_app") {
      OpenMeetingApp();
    } else {
      setLocation(e.target.value);
    }

    if (!e.target.value) {
      setLocationErr("Please select location");
    } else {
      setLocationErr("");
    }

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleAddOneHour = (time) => {
    const endDate = new Date(`2023-09-19T${time}`);
    endDate.setHours(endDate.getHours() + 1);
    setEndTime(
      `${endDate.getHours().toString().padStart(2, "0")}:${endDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleClose = () => {
    closeDrawer();
  };

  const initialValues = {
    title: "",
    organizer: "",
    organizer2: "",
    reminder: "",
    timezone: "",
    location: "",
    attendees: "",
    dateValue: "",
    description: "",
  };
  const [formValues, setFormValues] = useState(initialValues);

  const handleTitle = (e) => {
    setTitle(e.target.value);
    if (!e.target.value) {
      setTitleErr("Title can't be empty");
    } else {
      setTitleErr("");
    }
  };

  const handelCity = (e) => {
    setCity(e.target.value);
    if (!e.target.value) {
      setCityErr("Location can't be empty");
    } else {
      setCityErr("");
    }
  };

  const handleTimezone = (e, value) => {
    setTimezone(value);
    if (!value) {
      setTimeZoneErr("Please select timezone");
    } else {
      setTimeZoneErr("");
    }
  };

  const handleValidation = () => {
    let isFocus = true;
    if (!organizer) {
      setOrganiserOneErr("Please select organizer");
    }
    if (personLocation && !city) {
      setCityErr("Location can't be empty");
    }
    if (!title) {
      if (isFocus) {
        titleRef.current.focus();
        isFocus = false;
      }
      setTitleErr("Title can't be empty");
    }
    if (!timezone) {
      setTimeZoneErr("Please select timezone");
    }
    if (!location) {
      if (isFocus) {
        locationRef.current.focus();
        isFocus = false;
      }
      setLocationErr("Please select location");
    }
  };

  useEffect(() => {
    getTimeZones();
    if (meet && Object.keys(meet)?.length > 0) {
      setTitle(meet?.attributes?.title);
      setReminder(meet?.attributes?.reminder);
      setDateValue(moment(meet?.attributes?.date).format("YYYY-MM-DD"));
      setDescription(meet?.attributes?.description);
      setOrganizer(meet?.attributes?.organizer?.id);
      setOrganizerName(meet?.attributes?.organizer?.full_name || "");
      setOrganizer2(meet?.attributes?.second_organizer?.id);
      setOrganizer2Name(meet?.attributes?.second_organizer?.full_name || "");
      setEmails(meet?.attributes?.attendees?.map((d, index) => d));
      setStartTime(meet?.attributes?.start_time);
      setEndTime(meet?.attributes?.end_time);
      setTimezone(meet?.attributes?.timezone);
      setLocation(meet?.attributes?.meeting_mode);
      if (meet?.attributes?.location?.length > 0) {
        setpersonLocation(true);

        setCity(meet?.attributes?.location);
      }
    } else {
      // organizer field
      users?.map((user, index) => {
        if (user?.attributes?.full_name === user_info?.full_name) {
          setOrganizer(user?.id);
          setOrganizerName(user?.attributes?.full_name);
        }
      });
    }
  }, []);

  useEffect(() => {
    thirdPartyLocation();
  }, [
    user_info?.google_meet_access,
    user_info?.webex_access,
    user_info?.skype_access,
  ]);

  const thirdPartyLocation = () => {
    MeetingApi.thirdPartyStatus(user_info?.id)
      .then((res) => {
        setGlobalStatus(res);
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  // const getData = () => {
  //   let types = type;
  //   MeetingApi.getAllId(param.id, types, 1, 5)
  //     .then((response) => {
  //       if (response?.data) {
  //         setMeetings(response?.data);
  //       }
  //     })
  //     .catch((error) => {
  //       Toaster.TOAST(getMethodError(error), "error");
  //       console.log(error);
  //     });
  // };

  const handleSubmit = async (e) => {
    handleValidation();
    e.preventDefault();
    let types = type;
    if (
      title?.length !== 0 &&
      organizer?.length !== 0 &&
      timezone?.length !== 0 &&
      location?.length !== 0 &&
      (personLocation ? city?.length !== 0 : true)
    ) {
      setLoading(true);
      var datetime = new Date();
      var now = datetime
        .toISOString()
        .replace(/T/, " ")
        .replace(/:00.000Z/, "");

      let data = {
        title: title,
        meetingable_type: types,
        meetingable_id: param.id,
        all_day: true,
        is_online: true,
        attendees: emails,
        organizer_id: organizer,
        second_organizer_id: organizer2,
        start_time: startTime,
        end_time: endTime,
        date: moment(dateValue).format("YYYY-MM-DD")
          ? moment(dateValue).format("YYYY-MM-DD")
          : moment(now).format("YYYY-MM-DD"),
        reminder: reminder,
        description: description,
        timezone: timezone,
        location: city,
        meeting_mode: location,
      };
      if (Object.keys(meet)?.length) {
        MeetingApi.update(meet?.id, param?.id, types, { data })
          .then((response) => {
            if (response?.data?.attributes) {
              closeDrawer();
              const updatedNotes = meetings?.map((elem, index) => {
                return elem?.id === response?.data?.id ? response?.data : elem;
              });
              setMeetings(updatedNotes);
              getData();
              Toaster.TOAST("Meeting updated successfully", "success");
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
        MeetingApi.create({ data })
          .then((response) => {
            if (response?.data?.attributes) {
              setLoadMoreClick(false);
              closeDrawer();
              if (page === 1) {
                getData();
              } else {
                setPage(1);
              }
              Toaster.TOAST("Meeting created successfully", "success");
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

  const setValue = (newValue, title) => {
    if (title === "organizer") {
      setOrganizer(newValue?.id);
      if (newValue?.id) {
        setOrganiserOneErr("");
      }
    } else if (title === "organizer2") {
      setOrganizer2(newValue?.id);
    }
  };

  useEffect(() => {
    if (!srchUser) {
      getOwnerData();
    }
  }, [srchUser]);

  const getOwnerData = (srchQuery) => {
    userApi
      .getUsers(srchQuery)
      .then((data) => {
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
        setUserLoading(false);
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
    if (title === "organizer") {
      setOrganizerName(newInputValue);
    } else if (title === "organizer2") {
      setOrganizer2Name(newInputValue);
    }
  };

  const getUserAutocomplete = (title) => {
    return (
      <UsersAutocomplete
        title={title}
        userLoading={userLoading}
        setValue={setValue}
        handleInputChange={handleInputChange}
        organizer={organizer}
        organizer2={organizer2}
        value={title === "organizer" ? organizerName : organizer2Name}
        error={title === "organizer" ? organiserOneErr : ""}
        options={users}
        placeholder={title !== "organizer" && "Select organizer2"}
      />
    );
  };
  const handelEndtime = (e) => {
    setStartTime(e.target.value);
    handleAddOneHour(e.target.value);
  };

  // date
  const handleDateChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d);
    setDateValue(formated_date);
  };

  return (
    <>
      <Paper className="ma-popupAll-side">
        <div className="">
          <button className="createtask_btn">
            {meet?.id ? (
              <span className="createtask_txt">Edit Meeting</span>
            ) : (
              <span className="createtask_txt">Add Meeting</span>
            )}
            <CloseIcons
              sx={{ color: "#fff", cursor: "pointer" }}
              onClick={() => handleClose()}
            />
          </button>
          <h6 className="filldetails_txt">Meeting Details</h6>
        </div>
        <div className="ma-calls-field">
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel
                  variant="standard"
                  className="FormInputlable duedate_text"
                >
                  <span className="requreiedField">*</span>organizer
                </InputLabel>
                {getUserAutocomplete("organizer")}
              </Grid>
              <Grid item xs={12}>
                <InputLabel
                  variant="standard"
                  className="FormInputlable duedate_text"
                >
                  organizer 2
                </InputLabel>
                {getUserAutocomplete("organizer2")}
              </Grid>
              <Grid item xs={12}>
                <InputLabel
                  variant="standard"
                  className="AttendeesFormInputlable duedate_text"
                  data-testid="Attendees"
                >
                  Attendees{" "}
                  {attendeesCount !== 0 && <span>({attendeesCount})</span>}
                </InputLabel>
                {users && (
                  <Grid container xs={12} md={12} gap="20px 35px">
                    <div className="formPopup">
                      <ReactMultiEmail
                        // placeholder="Add more Attendees"
                        emails={emails}
                        onChange={(_emails) => getHandleEmail(_emails)}
                        getLabel={(emails, index, removeEmail) => {
                          return (
                            <div className="roundInput" data-tag key={index}>
                              <div data-tag-item>{emails}</div>
                              <span
                                className="roundCross"
                                data-tag-handle
                                onClick={() => removeEmail(index)}
                              >
                                ×
                              </span>
                            </div>
                          );
                        }}
                        onKeyDown={(e) => handleBlur(e)}
                      />

                      {/* <div style={{ color: 'red' }}>{error}</div> */}
                      {emailError && (
                        <span className="ma-error">{emailError}</span>
                      )}
                    </div>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12}>
                <InputLabel
                  variant="standard"
                  className="FormInputlable duedate_text"
                >
                  <span className="requreiedField">*</span>Title
                </InputLabel>

                <TextField
                  className="placeholder_field"
                  fullWidth
                  name="title"
                  value={title}
                  inputRef={titleRef}
                  id="title"
                  placeholder="New meeting title"
                  variant="outlined"
                  onChange={handleTitle}
                  helperText={<span className="ma-error">{titleErr}</span>}
                />
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
                <InputLabel
                  variant="standard"
                  className="FormInputlableDate duedate_text"
                >
                  Date
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateValue}
                    disablePast
                    open={openCalendar}
                    onOpen={() => setOpenCalendar(true)}
                    onClose={() => setOpenCalendar(false)}
                    onChange={(val) => handleDateChange(val)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        name="dateValue"
                        onKeyDown={(e) => e.preventDefault()}
                        onMouseDown={() => setOpenCalendar(true)}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* </FormControl> */}

              <Grid item xs={6}>
                <InputLabel
                  variant="standard"
                  className="FormInputlableDate duedate_text"
                >
                  Start Time
                </InputLabel>
                <TextField
                  name="Call Time "
                  size="medium"
                  id="Call Time "
                  placeholder="Dec 30, 2022"
                  className="duedate_textfield"
                  type="time"
                  value={startTime}
                  onChange={(e) => handelEndtime(e)}
                ></TextField>
              </Grid>
              <Grid item xs={6}>
                <InputLabel
                  variant="standard"
                  className="AttendeesFormInputlable duedate_text"
                >
                  End Time
                </InputLabel>
                <TextField
                  name="Call Time "
                  size="medium"
                  id="Call Time "
                  placeholder="Dec 30, 2022"
                  className="duedate_textfield"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <InputLabel
                  variant="standard"
                  className="FormInputlable duedate_text"
                >
                  Reminder
                </InputLabel>
                <TextField
                  className="placeholder_field"
                  name="reminder"
                  size="medium"
                  id="reminder"
                  value={reminder}
                  fullWidth
                  select
                  onChange={(e) => {
                    setReminder(e.target.value);
                  }}
                  label={!reminder && "Select reminder"}
                  InputLabelProps={{
                    shrink: false,
                    style: {
                      color: "#8C8DA3",
                      fontSize: "14px",
                    },
                  }}
                >
                  <MenuItem value={`10 Minutes`}>10 Minutes Before</MenuItem>
                  <MenuItem value={`15 Minutes`}>15 Minutes Before</MenuItem>
                  <MenuItem value={`20 Minutes`}>20 Minutes Before</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <InputLabel
                  variant="standard"
                  className="FormInputlable duedate_text"
                  data-testid="location"
                >
                  <span className="requreiedField">*</span>Meeting Mode
                </InputLabel>

                <TextField
                  fullWidth
                  name="location"
                  className="placeholder_field"
                  value={location}
                  inputRef={locationRef}
                  onChange={(e) => handleLocation(e)}
                  inputProps={{ "aria-label": "Without label" }}
                  helperText={<span className="ma-error">{locationErr}</span>}
                  select
                  label={!location && "Select location"}
                  InputLabelProps={{
                    shrink: false,
                    style: {
                      color: "#8C8DA3",
                      fontSize: "14px",
                    },
                  }}
                >
                  <MenuItem value={"in_person"}>In-Person</MenuItem>
                  {globalStatus?.webex_access && (
                    <MenuItem value={"webex"}>{`Webex`}</MenuItem>
                  )}

                  {globalStatus?.skype_access && (
                    <MenuItem value={"skype"}>{"Skype "}</MenuItem>
                  )}
                  {globalStatus?.google_meet_access && (
                    <MenuItem value={"google_meet"}>{"Google meet"}</MenuItem>
                  )}
                  {!globalStatus?.skype_access ||
                    !globalStatus?.webex_access ||
                    !globalStatus?.google_meet_access ? (
                    <MenuItem
                      value={"connect_app"}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#2C42B5",
                        fontWeight: "600",
                      }}
                    >
                      CONNECT APP
                      <span>
                        <ArrowForwardOutlinedIcon />
                      </span>
                    </MenuItem>
                  ) : null}
                </TextField>
                {/* </FormControl> */}
              </Grid>
              {personLocation && (
                <Grid item xs={12}>
                  <InputLabel
                    variant="standard"
                    className="FormInputlable duedate_text"
                  >
                    <span className="requreiedField">*</span>location
                  </InputLabel>

                  <TextField
                    fullWidth
                    name="title"
                    value={city}
                    // inputRef={titleRef}
                    id="title"
                    placeholder="Enter location"
                    variant="outlined"
                    onChange={handelCity}
                    helperText={<span className="ma-error">{cityErr}</span>}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <InputLabel
                  variant="standard"
                  className="FormInputlable duedate_text"
                >
                  Description
                </InputLabel>

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
                  classStyle={"schedulebtn_bg"}
                  handleClick={handleSubmit}
                  title={meet?.id ? "SAVE" : "ADD"}
                  spanTextClass={"schedulebtn_text"}
                />
                <button
                  variant="outlined"
                  className="cancel_btn ms-3"
                  onClick={() => handleClose()}
                >
                  <span className="cancelbtn_txt">CANCEL</span>
                </button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Paper>
      {/* <--------------connect App pop start-------------> */}
      <Drawer
        sx={{ width: "250px" }}
        hideBackdrop
        anchor={"right"}
        open={openApp}
        onClose={handleClosePopup}
      >
        {openApp && (
          <ConnectApp
            handleClose={handleClosePopup}
            setLocation={setLocation}
            meet={meet}
            globalStatus={globalStatus}
          />
        )}
      </Drawer>

      {/* <--------------connect App  pop ends-------------> */}
    </>
  );
};

export default MeetingsPopup;
