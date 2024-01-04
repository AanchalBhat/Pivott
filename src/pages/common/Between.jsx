import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { IconButton } from "@mui/material";

const Between = ({
  value,
  endDate,
  handleEndDate,
  handleStartDate,
  setFlag
}) => {
  const [openCalendar1, setOpenCalendar1] = useState(false)
  const [openCalendar2, setOpenCalendar2] = useState(false)

  const handleClear = () => {
    setOpenCalendar1(false)
    handleStartDate(null);
    setFlag(prev => !prev)
  }
  const handleEndDateClear = () => {
    setOpenCalendar2(false)
    handleEndDate(null);
    setFlag(prev => !prev)
  }


  return (
    <>
      <div className="leadfilterDCformlable">Between</div>
      <div className="leadfilterDCforminput">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            open={openCalendar1}
            onOpen={() => setOpenCalendar1(true)}
            onClose={() => setOpenCalendar1(false)}
            className="placeholder_field"
            value={value === undefined ? null : value}
            onChange={(newValue) => {
              handleStartDate(newValue);
              setFlag(prev => !prev)
            }}
            renderInput={(params) => (
              <TextField
                onKeyDown={(e) => e.preventDefault()}
                {...params}
                fullWidth
                onMouseDown={() => setOpenCalendar1(true)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleClear()}
                        size="small"
                        edge="end"
                      >
                        {value && <ClearIcon />}
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
      </div>
      <div className="leadfilterDCforminput">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            open={openCalendar2}
            onOpen={() => setOpenCalendar2(true)}
            onClose={() => setOpenCalendar2(false)}
            className="placeholder_field"
            value={endDate === undefined ? null : endDate}
            onChange={(newValue) => {
              handleEndDate(newValue);
              setFlag(prev => !prev)
            }}
            renderInput={(params) => (
              <TextField
                onKeyDown={(e) => e.preventDefault()}
                {...params}
                fullWidth
                onMouseDown={() => setOpenCalendar2(true)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleEndDateClear()}
                        size="small"
                        edge="end"
                      >
                        {endDate && <ClearIcon />}
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

              // helperText={
              //   <span className="ma-error">{endDateErrorMessage}</span>
              // }
              />
            )}
          />
        </LocalizationProvider>
      </div>
    </>
  );
};

export default Between;
