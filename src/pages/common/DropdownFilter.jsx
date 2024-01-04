import { FormControl, Select, MenuItem } from '@mui/material';
import "../../styles/global/common.css";

const AllLeads = ({ title, allLead, handleList, value, leadArray, alignParam = ["bottom", "left", "top", "center"]}) => {
    return (
        <FormControl>
            <Select
            MenuProps={{
                anchorOrigin: {
                  vertical: alignParam[0],
                  horizontal: alignParam[1]
                },
                transformOrigin: {
                  vertical: alignParam[2],
                  horizontal: alignParam[3]
                } 
            }}
                labelid="demo-simple-select-label"
                className="filterSelect"
                placeholder="All"
                id="allLead"
                name="allLead"
                value={allLead}
                onChange={(e) => handleList(e)}
                displayEmpty
                sx={{ '.MuiOutlinedInput-notchedOutline': { border: (title === "This Week" || title === "Half Yearly" || title === "Last Six Months") ? "none !important" : "" } }}
            >
                <MenuItem sx={{ float: "clear" }} value={value || ""} >
                    {title}
                </MenuItem>
                {leadArray}
            </Select>
        </FormControl>
    )
}

export default AllLeads
