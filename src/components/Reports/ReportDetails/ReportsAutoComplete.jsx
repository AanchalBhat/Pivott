import { Autocomplete, TextField } from "@mui/material";

const ReportsAutoComplete = ({
    optionsArr,
    placeholder,
    handleFunction,
    dataTestId,
    name,
    valueName = ""
}) => {
    return (
        <Autocomplete
            className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
            fullWidth
            id="combo-box-demo"
            filterOptions={(optionsArr) => optionsArr}
            onChange={(event, newValue) => {
                handleFunction(newValue);
            }}
            data-testid={dataTestId}
            name={name}
            value={{
                attributes: {
                  name: valueName,
                }
            }}
            options={optionsArr}
            getOptionLabel={(option) => option?.attributes?.name}
            renderInput={(params) => (
                <TextField
                    className="m-0"
                    {...params}
                    margin="normal"
                    variant="outlined"
                    placeholder={placeholder}
                />
            )}
        />
    )
}

export default ReportsAutoComplete;