import {
  Autocomplete,
  Avatar,
  Box,
  TextField,
  Typography,
} from "@mui/material";
// import global css
import "../../styles/global/common.css";

let isCheck = false;
const LeadOwnerDropdown = ({
  label,
  getContactData,
  handleOwner,
  ownerErr,
  users,
  OwnerValue,
  userLoading, placeholder, helperText, setFieldValue
}) => {
  return (
    <>
      <label className="labeltxt ">
        <span className="requreiedField">*</span>
        {label}
      </label>
      <Autocomplete
        className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
        fullWidth
        id="leadowner"
        loading={userLoading}
        filterOptions={(users) => users}
        options={users}
        disableClearable
        noOptionsText={"No data found"}
        onChange={(event, newValue) => {
          handleOwner(newValue.id);
          setFieldValue("owner_id", newValue?.id)
        }}
        getOptionLabel={(option) => option?.attributes?.full_name}
        value={{
          attributes: {
            full_name: OwnerValue,
          },
        }}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleOwner("");
            setFieldValue("owner_id", "")
          }
          let data = users?.filter(
            (elem) => elem?.attributes?.full_name === newInputValue
          );
          if (data?.length > 0) {
            isCheck = true;
            getContactData(event, newInputValue, isCheck);
          } else {
            isCheck = false;
            getContactData(event, newInputValue, isCheck);
          }

        }}
        renderOption={(props, option, { selected }) => {
          return (
            option?.attributes?.first_name &&
            <li {...props} key={option?.id}>
              <Box display={"flex"} flexDirection={"row"}>
                <Avatar size={"22"} variant={"circular"} />
                <Box display={"flex"} ml={3} flexDirection={"column"}>
                  <Typography color={"text.primary"}>
                    {option?.attributes?.full_name}
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
            className="m-0"
            {...params}
            placeholder={`Choose ${placeholder} from here`}
            margin="normal"
            variant="outlined"
            helperText={helperText ? helperText : <span className="ma-error">{ownerErr}</span>}
          />
        )}
      />
    </>
  );
};

export default LeadOwnerDropdown;
