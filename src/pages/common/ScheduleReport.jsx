import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PopupHeader from "./PopupHeader";
import PopupFooter from "./PopupFooter";
import { ReportsApi } from "../../apis/ReportsApi";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import { Toaster } from "./Toaster";
// import global css
import "../../styles/global/common.css";
import debouce from "lodash.debounce";
import { userApi } from "../../apis/userApi";
import { FormatDate, TodayDate } from "../../utils";
import { getMethodError, restMethodError } from "../../constants/errorMessages";

const ScheduleReports = ({
  openLT,
  handleToCloseLT,
  popupDialogID,
  getAllData,
}) => {
  const [email_id, setEmailId] = useState([]);
  const [exports, setExports] = useState("");
  const [others, setOthers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  let today = new Date();
  today.setMinutes(today.getMinutes() + 15);
  let hours = today.getHours();
  let minutes = today.getMinutes();
  minutes = minutes <= 9 ? '0' + minutes : minutes;
  let currentTime = hours + ':' + minutes;

  const [date, setDate] = useState(TodayDate());
  const [callTime, setCallTime] = useState(currentTime);
  const [options, setOptions] = useState("Schedule for later");
  const [emailErr, setEmailErr] = useState("");
  const [exportError, setExportError] = useState("");
  const [srchUser, setSrchUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false)
  useEffect(() => {
    if (!srchUser && openLT) {
      getLeadOwnerData();
    }
  }, [srchUser, openLT]);

  const getLeadOwnerData = (srchQuery) => {
    setUserLoading(true);
    userApi.getUsers(srchQuery).then((data) => {
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
        getLeadOwnerData(e);
      }
    }, 1000),
    []
  );

  const getUserData = (event, newValue) => {
    if (newValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }
  };
  const handleValidation = () => {
    if (email_id?.length === 0) {
      setEmailErr("Please select email");
    }
    if (!exports) {
      setExportError("Please select any one file format");
    }
  };

  const handleScheduleReport = (id, data) => {
    setLoading(true);
    ReportsApi.scheduleReport(id, data)
      .then(function (response) {
        if (response?.id) {
          getAllData();
          handleToCloseLT();
          Toaster.TOAST(response?.message, "success");
          setEmailId([]);
          setOthers([]);
          setExports("");
          setCallTime(currentTime);
          setDate();
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValidation();
    var datetime = new Date();
    var now = datetime
      .toISOString()
      .replace(/T/, " ")
      .replace(/:00.000Z/, "");
    let data;
    if (email_id && exports) {
      if (options === "Schedule for later") {
        data = {
          data: {
            send_to: email_id,
            send_others: others,
            report_id: popupDialogID,
            export_as: exports,
            send_options: "schedule_later",
            call_date: date ? date : now,
            call_time: callTime,
          },
        };
      } else {
        data = {
          data: {
            send_to: email_id,
            send_others: others,
            report_id: popupDialogID,
            export_as: exports,
            send_options: "schedule_now",
          },
        };
      }
      handleScheduleReport(popupDialogID, data);
    }
  };

  const getAllEmails = (event) => {
    if (event) {
      setEmailErr("");
      const ids = event?.map((element, index) => {
        return element?.attributes?.email;
      });
      setEmailId(ids);
    } else {
      setEmailErr("please enter email");
    }
  };

  const handleFileFormat = (value) => {
    if (value) {
      setExports(value);
      setExportError("");
    } else {
      setExportError("Please Select Any One  File Format");
    }
  };
  // date
  const handleDateChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d)
    setDate(formated_date);
  };


  const handleScheduleClose = () => {
    handleToCloseLT();
    setEmailId([]);
    setOthers([]);
    setExports("");
    setCallTime(currentTime);
    setDate();
    setExportError("");
    setEmailErr("");
  };
  const emailList = () => {
    return (
      <Autocomplete
        className="placeholder_field"
        fullWidth
        multiple
        id="send to"
        loading={userLoading}
        options={users}
        onChange={(event, newValue) => {
          getAllEmails(newValue);
        }}
        filterOptions={(users) => users}
        getOptionLabel={(option) => option?.attributes?.email}
        onInputChange={(event, newInputValue) =>
          getUserData(event, newInputValue)
        }
        renderOption={(props, option, { selected }) => {
          return (
            option?.attributes?.first_name && (
              <li {...props}>
                <Box display={"flex"} flexDirection={"row"}>
                  <Avatar size={"22"} variant={"circular"} />
                  <Box display={"flex"} ml={3} flexDirection={"column"}>
                    <Typography color={"text.primary"}>
                      {option?.attributes?.first_name +
                        " " +
                        option?.attributes?.last_name}
                    </Typography>
                    <Typography color={"text.secondary"}>
                      {option?.attributes?.email}
                    </Typography>
                  </Box>
                </Box>
                <hr />
                &nbsp;
              </li>
            )
          );
        }}
        renderInput={(params) => (
          <TextField
            className="m-0 placeholder_field"
            {...params}
            margin="normal"
            variant="outlined"
            helperText={<span className="ma-error">{emailErr}</span>}
            placeholder="Select send to email"
          />
        )}
      />
    );
  };

  return (
    <>
      <Dialog
        sx={{
          position: "absolute",
          zIndex: "1000",
        }}
        className="ma-popup-boxHolder"
        open={openLT}
        onClose={handleToCloseLT}
      >
        <form onSubmit={handleSubmit}>
          <PopupHeader
            label="Schedule Report"
            handleToCloseLT={() => handleScheduleClose()}
          />
          <DialogContent className="ma-popup-body">
            <div className="ma-parentLT">
              <Grid container xs={12} md={12} gap="20px 35px">
                <Grid item={true} xs={12} md={12}>
                  <label className="labeltxt">
                    <span className="requreiedField">*</span>Send To
                  </label>

                  {emailList()}
                </Grid>
                <Grid
                  item={true}
                  xs={12}
                  md={12}
                  className={"createlead-detail-grid"}
                >
                  <label className="labeltxt">Add Others</label>
                  <ReactMultiEmail
                    className="placeholder_field"
                    placeholder="Enter add others email"
                    emails={others}
                    onChange={(_emails) => {
                      setOthers(_emails);
                    }}
                    getLabel={(email, index, removeEmail) => {
                      return (
                        <div data-tag key={index}>
                          <div data-tag-item>{email}</div>
                          <span
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      );
                    }}
                  />
                </Grid>
                <Grid
                  item={true}
                  xs={12}
                  md={12}
                  className={"createlead-detail-grid"}
                >
                  <label className="labeltxt">
                    <span className="requreiedField">*</span> Export As :
                  </label>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e, val) => handleFileFormat(val)}
                    value={exports}
                  >
                    <FormControlLabel
                      value="xls"
                      control={<Radio />}
                      label="XLS"
                    />
                    <FormControlLabel
                      value="pdf"
                      control={<Radio />}
                      label="PDF"
                    />
                    <FormControlLabel
                      value="csv"
                      control={<Radio />}
                      label="CSV"
                    />
                  </RadioGroup>
                  {<span className="ma-error">{exportError}</span>}
                </Grid>
                <Grid
                  ititem={true}
                  em
                  xs={12}
                  md={12}
                  className={"createlead-detail-grid"}
                >
                  <label className="labeltxt">Send Options</label>
                  <Select
                    className="createlead-textField placeholder_field"
                    fullWidth
                    id="demo-mutiple-checkbox"
                    value={options}
                    name="schedule"
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={(e) => setOptions(e.target.value)}
                  >
                    {["Schedule for later", "Schedule for now"]?.map(
                      (name, idx) => (
                        <MenuItem key={idx} value={name}>
                          {name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Grid>
                {options === "Schedule for later" ? (
                  <Box className="d-flex w-100 gap-3 justify-content-between">
                    <Grid item xs={6}>
                      <label className="labeltxt">Call Date</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                              fullWidth
                              name=""
                              onKeyDown={(e) => e.preventDefault()}
                              onMouseDown={() => setOpenCalendar(true)}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={6}>
                      <label className="labeltxt">Call Time</label>
                      <TextField
                        name="Call Time "
                        size="medium"
                        data-testid="call-time"
                        id="Call Time "
                        placeholder="Dec 30, 2022"
                        className="duedate_textfield w-100"
                        type="time"
                        value={callTime}
                        onChange={(e) => setCallTime(e.target.value)}
                      ></TextField>
                    </Grid>
                  </Box>
                ) : null}
              </Grid>
            </div>
          </DialogContent>
          {/* <PopupFooter submitBtn={"Send"} handleToCloseLT={handleToCloseLT} /> */}
          <PopupFooter
            loading={loading}
            submitBtn={"Send"}
            handleToCloseLT={() => handleScheduleClose()}
          />
        </form>
      </Dialog>
    </>
  );
};

export default ScheduleReports;
