import React, { useEffect } from 'react'
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";


const ReportAutocomplete = ({
  getContactValue, filterData, contactVal, FilterData, contactError,setVal
}) => {
  let user_info = JSON.parse(localStorage.getItem("user_info"));

  useEffect(()=>{
    setVal(user_info?.full_name)
  },[])

  return (
    <Autocomplete
      loading
      id="contact_person"
      data-testid="contact-dropdown"
      className="ma-contact-pipline mt-0"
      onChange={(event, value) => {
        getContactValue(value);
      }}
      noOptionsText={"Please Add Contact Details"}
      options={filterData}
      filterOptions={(filterData) => filterData}
      value={{ attributes: { full_name: contactVal } }}
      getOptionLabel={(option) => option?.attributes?.full_name}
      onInputChange={(event, value) => FilterData(value)}
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props} key={option.id}>
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
        );
      }}
      renderInput={(params) => (
        <TextField
          className="placeholder_field"
          {...params}
          placeholder="Choose contact from here"
          margin="normal"
          variant="outlined"
          helperText={
            <span className="ma-error">{contactError}</span>
          }
        />
      )}
    />
  )
}

export default ReportAutocomplete
