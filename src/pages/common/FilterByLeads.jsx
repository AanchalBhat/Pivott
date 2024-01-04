import React from "react";
import { List, ListSubheader, Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const FilterByLeads = ({ handleSearch, title, handleReset, btnDisabled, children }) => {

    return (
        <>
            <div className="LeadFilter1Box">
                <TextField
                    size="medium"
                    className="LeadFilter1BoxsearchField"
                    name="Search"
                    placeholder="Search"
                    type="Search"
                    id="Search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => handleSearch(e)}
                />
            </div>
            <div className="LeadFilter1List">
                <List
                    className="ma-all-filters"
                    component="div"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader className="ma-side-leads pt-3" component="div" id="nested-list-subheader">
                            <div className="leadfilterlistname pb-2">{title}</div>
                            <div className="ma-rightfilter-btn">
                                <Button disabled={btnDisabled}>
                                    <div
                                        style={{ color: btnDisabled ? "#D1D1DA" : "#2c42b5", fontSize: "14px" }}
                                        className="leadfilterlistname pb-2"
                                        onClick={() => handleReset()}
                                    >
                                        RESET FILTERS
                                    </div>
                                </Button>
                            </div>
                        </ListSubheader>
                    }
                >
                    {children}
                </List>
            </div>
        </>
    )
}

export default FilterByLeads;
