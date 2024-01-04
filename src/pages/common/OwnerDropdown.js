import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

let isCheck = false;
const OwnerDropdown = ({
  users,
  contactsValue,
  getContactData,
  handleContactId,
  userLoading,
  placeholder,
  contactId,
}) => {
  return (
    <Autocomplete
      className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
      fullWidth
      id="leadowner"
      options={users}
      loading={userLoading}
      noOptionsText={"No data found"}
      filterOptions={(users) => users}
      onChange={(event, newValue) => {
        handleContactId(event, newValue);
      }}
      getOptionLabel={(option) => option?.attributes?.full_name}
      value={{
        attributes: {
          full_name: contactsValue,
        },
      }}
      onInputChange={(event, newInputValue) => {
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
          option?.attributes?.first_name && (
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
          )
        );
      }}
      renderInput={(params) => (
        <TextField
          className="m-0"
          {...params}
          // placeholder="Choose your lead owner from here"
          placeholder={placeholder}
          margin="normal"
          variant="outlined"
        />
      )}
    />
  );
};

export default OwnerDropdown;
