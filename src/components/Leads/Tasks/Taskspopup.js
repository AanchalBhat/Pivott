import React, { useState, useEffect, useRef } from "react";
//mui
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./TasksPopup.css";
import { TaskAPI } from "../../../apis/TaskApi";
import { useParams } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcons from "@mui/icons-material/Close";
import { Toaster } from "../../../pages/common/Toaster";
import { ButtonLoader } from "../../../pages/common/ButtonLoader";
import { FormatDate, TodayDate } from "../../../utils";
import { restMethodError } from "../../../constants/errorMessages";

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

const LeadTaskPopup = ({
  task,
  closeDrawer,
  isEdit,
  type,
  getData,
  Tasktype,
  setPage,
  page,
  setLoadMoreClick,
}) => {
  const [subject, setsubject] = useState("");
  const [subjectErrorMessage, setsubjectErrorMessage] = useState("");
  const [repeat, setRepeat] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState(TodayDate());
  const subject_Regex = /^[a-zA-Z0-9 ]+$/;
  const [reminder, setReminder] = useState(true);
  const [toggleEmail, setToggleEmail] = useState(false);
  const [status, setStatus] = useState("");
  const [statusErr, setstatusErr] = useState("");
  const [priorityErr, setPriorityErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  let param = useParams();
  const subjectRef = useRef(null);
  const priorityRef = useRef(null);
  const statusRef = useRef(null);

  const handleSubject = (event) => {
    if (!subject_Regex.test(event?.target?.value)) {
      setsubject(event.target.value);
      setsubjectErrorMessage("Please enter a valid Subject.");
    } else {
      setsubject(event.target.value);
      setsubjectErrorMessage("");
    }
  };

  const handlePriority = (e) => {
    setPriority(e.target.value);
    if (!e.target.value) {
      setPriorityErr("Please select priority");
    } else {
      setPriorityErr("");
    }
  };
  const handleStatus = (e) => {
    setStatus(e.target.value);
    if (!e.target.value) {
      setstatusErr("Please select status");
    } else {
      setstatusErr("");
    }
  };

  const handleValidation = () => {
    let isFocus = true;
    if (!subject) {
      if (isFocus) {
        subjectRef.current.focus();
        isFocus = false;
      }
      setsubjectErrorMessage("Subject can't be empty");
    }
    if (!priority) {
      if (isFocus) {
        priorityRef.current.focus();
        isFocus = false;
      }
      setPriorityErr("Priority can't be empty");
    }
    if (!status) {
      if (isFocus) {
        statusRef.current.focus();
        isFocus = false;
      }
      setstatusErr("Status can't be empty");
    }
  };

  const handleClose = () => {
    closeDrawer();
  };

  useEffect(() => {
    if (task && Object.keys(task)?.length > 0) {
      setsubject(task?.attributes?.subject);
      setPriority(task?.attributes?.priority);
      setDate(task?.attributes?.due_date_time);
      setReminder(task?.attributes?.reminder);
      setRepeat(task?.attributes?.repeat);
      setToggleEmail(task?.attributes?.send_email);
      setStatus(task?.attributes?.status);
    }
  }, []);

  const handleToggle = () => {
    if (reminder) {
      setRepeat("");
    } else {
      setRepeat("daily");
    }
    setReminder((prev) => !prev);
  };

  const handleToggleEmail = () => {
    setToggleEmail(!toggleEmail);
  };

  const handleSubmit = (val) => {
    handleValidation();

    let types = type;
    if (
      subject?.length &&
      status?.length &&
      priority?.length &&
      !subjectErrorMessage
    ) {
      var datetime = new Date();
      var now = datetime
        .toISOString()
        .replace(/T/, " ")
        .replace(/:00.000Z/, "");
      let data = {
        subject: subject,
        repeat: repeat,
        // send_email: toggleEmail,
        priority: priority,
        reminder: reminder,
        taskable_type: types,
        taskable_id: parseInt(param?.id),
        due_date_time: date ? date : now,
        status: status,
      };
      if (reminder) {
        data.send_email = toggleEmail;
      }

      setLoading(true);
      if (val === "save") {
        TaskAPI.update(task?.id, types, param?.id, { data })

          .then((response) => {
            if (response?.data?.attributes) {
              closeDrawer();
              setLoadMoreClick(false);
              if (page === 1) {
                getData();
              } else {
                setPage(1);
              }
              Toaster.TOAST("Task updated successfully", "success");
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Toaster.TOAST(restMethodError(error), "error");
            console.log(error);
          });
      } else {
        if (!isEdit) {
          TaskAPI.create({ data })

            .then((response) => {
              if (response?.data?.attributes) {
                setLoadMoreClick(false);
                closeDrawer();
                if (page === 1) {
                  getData(Tasktype ? "completed" : "open");
                } else {
                  setPage(1);
                }
                Toaster.TOAST("Task created successfully", "success");
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
    }
  };

  // date
  const handleDateChange = (newValue) => {
    let formated_date = FormatDate(newValue?.$d);
    setDate(formated_date);
  };

  return (
    <Paper elevation={2} className="ma-popupAll-side">
      <div>
        <button className="createtask_btn">
          {task?.id ? (
            <span className="createtask_txt">Edit Task</span>
          ) : (
            <span className="createtask_txt"> Add Task </span>
          )}
          <CloseIcons sx={{ color: "#fff" }} onClick={() => handleClose()} />
        </button>
        <h6 className="filldetails_txt">Task Details</h6>
      </div>

      <div className="ma-calls-field">
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label className="duedate_text">
                <span className="requreiedField">*</span>Subject
              </label>
              <TextField
                name="Subject"
                inputRef={subjectRef}
                sx={{
                  ".MuiOutlinedInput-input": {},
                }}
                id="Subject"
                placeholder="Subject"
                className="textfield_txt placeholder_field"
                autoFocus
                value={subject}
                onChange={(e) => handleSubject(e)}
                helperText={
                  <span className="ma-error">{subjectErrorMessage}</span>
                }
              />
            </Grid>
            <Grid item xs={6}>
              <label className="duedate_text">Due date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disablePast
                  value={date}
                  open={openCalendar}
                  onOpen={() => setOpenCalendar(true)}
                  onClose={() => setOpenCalendar(false)}
                  onChange={(val) => handleDateChange(val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name="duedate"
                      onKeyDown={(e) => e.preventDefault()}
                      onMouseDown={() => setOpenCalendar(true)}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <label className="duedate_text">
                <span className="requreiedField">*</span>Priority
              </label>
              <TextField
                name="Priority"
                inputRef={priorityRef}
                size="medium"
                id="Priority"
                className="duedate_textfield"
                value={priority}
                select
                onChange={(e) => handlePriority(e)}
                helperText={<span className="ma-error">{priorityErr}</span>}
                label={!priority && "Select priority"}
                InputLabelProps={{
                  shrink: false,
                  style: {
                    color: "#8c8da3",
                    fontSize: "14px",
                  },
                }}
              >
                <MenuItem key={"high"} value={"high"}>
                  {"High "}
                </MenuItem>
                <MenuItem key={"medium"} value={"medium"}>
                  {"Medium "}
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <label className="duedate_text">
                <span className="requreiedField">*</span>Status
              </label>
              <TextField
                name="status"
                inputRef={statusRef}
                size="medium"
                id="Status"
                className="status_textfield"
                value={status}
                onChange={(e) => handleStatus(e)}
                select
                helperText={<span className="ma-error">{statusErr}</span>}
                label={!status && "Select status"}
                InputLabelProps={{
                  shrink: false,
                  style: {
                    color: "#8c8da3",
                    fontSize: "14px",
                  },
                }}
              >
                <MenuItem value={"in_progress"}>{"In Progress "}</MenuItem>
                <MenuItem value={"started"}>{"Started"}</MenuItem>
                <MenuItem value={"not_started"}>{"Not Started"}</MenuItem>
                <MenuItem value={"completed"}>{"Completed"}</MenuItem>
              </TextField>
            </Grid>
            {reminder && (
              <>
                <Grid item xs={12} className="ma-togglebtn">
                  <label className="">Sent Email</label>
                  <Android12Switch
                    checked={toggleEmail}
                    onChange={() => handleToggleEmail()}
                  />
                </Grid>
                <Grid item xs={12} className="pt-0">
                  <div className="line_info"></div>
                </Grid>
              </>
            )}

            <Grid item xs={12} className="ma-togglebtn pt-0">
              <label className="">Reminder</label>
              <Android12Switch
                checked={reminder}
                onChange={() => handleToggle()}
              />
            </Grid>
            {reminder && (
              <Grid item xs={12}>
                <label className="duedate_text">
                  {" "}
                  <span className="requreiedField">*</span>Repeat
                </label>
                <TextField
                  name="repeat"
                  size="medium"
                  id="repeat"
                  value={repeat}
                  placeholder="Repeat"
                  className="status_textfield "
                  select
                  onChange={(e) => {
                    setRepeat(e.target.value);
                  }}
                >
                  <MenuItem key={"daily"} value={"daily"}>
                    {"Daily "}
                  </MenuItem>
                  <MenuItem key={"weekly"} value={"weekly"}>
                    {"Weekly "}
                  </MenuItem>
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              {task?.id ? (
                <ButtonLoader
                  loading={loading}
                  classStyle={"addbtn_bg"}
                  handleClick={() => handleSubmit("save")}
                  title={"SAVE"}
                  spanTextClass={"addbtn_text"}
                />
              ) : (
                <ButtonLoader
                  loading={loading}
                  classStyle={"addbtn_bg"}
                  handleClick={() => handleSubmit()}
                  title={"ADD"}
                  spanTextClass={"addbtn_text"}
                />
              )}
              <button className="cancel_btn ms-3" onClick={() => handleClose()}>
                <span className="cancelbtn_text">CANCEL</span>
              </button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Paper>
  );
};

export default LeadTaskPopup;
