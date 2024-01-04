import React, {useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { userApi } from "../../apis/userApi";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "./Toaster";

const UsersAutocomplete = ({
  title,
  setValue,
  handleInputChange,
  options,
  value,
  error,
  userLoading,
  placeholder,
  ...props
}) => {
  const [users, setUsers] = useState([]);
  const isDisabled = title === "organizer" ? true : false;

  useEffect(() => {
    if (!users) {
      userApi
        .getUsers()
        .then((data) => {
          if (data?.data) {
            setUsers(data?.data);
          }
        })
        .catch((error) => {
          Toaster.TOAST(getMethodError(error), "error");
          console.log(error);
        });
    }
  }, []);

  if (users) {
    return (
      <Autocomplete
        disableClearable={isDisabled}
        fullWidth
        id="company"
        loading={userLoading}
        options={options}
        filterOptions={(options) => options}
        noOptionsText={"No data found"}
        onChange={(event, newValue) => {
          setValue(newValue, title);
        }}
        getOptionLabel={(option) => option?.attributes?.full_name}
        isOptionEqualToValue={(option, value) =>
          option?.attributes?.full_name === value?.attributes?.full_name
        }
        value={{
          attributes: {
            full_name: value,
          },
        }}
        onInputChange={(event, newInputValue) => {
          handleInputChange(event, newInputValue, title);
        }}
        renderOption={(prop, option, { selected }) => {
          return (
            option?.attributes?.first_name &&
            !props?.attendees?.includes(+option?.id) &&
            ((title === "organizer" && option?.id !== props?.organizer2) ||
              (title === "organizer2" && option?.id !== props?.organizer) ||
              (title === "call_to" &&
                option?.id !== props?.assignTo &&
                option?.id !== props?.organizer) ||
              (title === "assign_to" &&
                option?.id !== props?.callTo &&
                option?.id !== props?.organizer)) && (
              <>
                <li {...prop}>
                  <Typography color={"text.primary"}>
                    {option?.attributes?.full_name}
                  </Typography>
                  <hr />
                  &nbsp;
                </li>
              </>
            )
          );
        }}
        renderInput={(params) => (
          <TextField
            disabled={isDisabled}
            className="ma-Input-type placeholder_field mt-0"
            {...params}
            autoFocus={title === "call_to" || title === "organizer"}
            placeholder={placeholder}
            margin="normal"
            InputProps={{
              ...params.InputProps,
            }}
            variant="outlined"
            helperText={<span className="ma-error">{error}</span>}
          />
        )}
      />
    );
  }
};

export default UsersAutocomplete;
