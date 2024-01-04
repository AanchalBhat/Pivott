import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Paper from "@material-ui/core/Paper";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const ContactPerson = ({
  getContactValue,
  filterData,
  contactVal,
  FilterData,
  contactError,
  onAddDetail,
  userLoading,
  helperText,
  setContactId,
}) => {
  const PaperComponentCustom = (options) => {
    const { containerProps, children } = options;
    return (
      <Paper {...containerProps}>
        {children}
        <Box
          sx={{
            padding: "12px",
            display: "flex",
            alignContent: "center",
            cursor: "pointer",
          }}
          onMouseDown={() => onAddDetail()}
        >
          <span style={{ color: "#2C42B5", fontWeight: 500 }}>
            <span style={{ marginLeft: "16px" }}>
              <GroupAddIcon />
            </span>
            <span style={{ marginLeft: "30px", textTransform: "uppercase" }}>
              Add Contact
            </span>
          </span>
        </Box>
      </Paper>
    );
  };

  return (
    <Autocomplete
      id="contact_person"
      data-testid="contact-dropdown"
      className="ma-contact-pipline mt-0"
      loading={userLoading}
      filterOptions={(filterData) => filterData}
      onChange={(event, value) => {
        getContactValue("contact_detail_id", value.id);
        setContactId(value.id);
      }}
      noOptionsText={"No data found"}
      disableClearable
      options={filterData}
      value={{ attributes: { full_name: contactVal } }}
      getOptionLabel={(option) => option?.attributes?.full_name}
      onInputChange={(event, value) => {
        FilterData(event, value);
        if (!value) {
          getContactValue("contact_detail_id", "");
        }
      }}
      renderOption={(props, option, { selected }) => {
        return (
          option?.attributes?.first_name && (
            <li
              {...props}
              key={option.id}
              style={{ borderBottom: "1px solid #E8E8ED" }}
            >
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
          className="placeholder_field"
          {...params}
          placeholder="Choose contact from here"
          margin="normal"
          variant="outlined"
          helperText={
            helperText ? (
              helperText
            ) : (
              <span className="ma-error">{contactError}</span>
            )
          }
        />
      )}
      PaperComponent={PaperComponentCustom}
    />
  );
};

export default ContactPerson;
