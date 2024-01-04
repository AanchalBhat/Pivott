import { InputAdornment, TextField } from "@mui/material";
import AllLeads from "../../pages/common/DropdownFilter";
import Actions from "../../pages/common/Actions";
// mui icons
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/custom/EmailCampaigns/List.css";

const CampaignsBar = ({ showActions = true, showAllLeads = true, handleSearchChange = () => { },
  searchQuery, actionsData, allDropdownData, handleAllDropdown, dropdownFilterData }) => {
  return (
    <>
      <div className="campaign-searchFilterDiv">
        <TextField
          size="small"
          className="searchField"
          name="Search"
          placeholder="Search"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          helperText={<span className="ma-error"></span>}
        />

        <div className="ma-campaignActions-bar p-0">
          {showAllLeads && <AllLeads
            title="All"
            allLead={allDropdownData}
            handleList={handleAllDropdown}
            leadArray={dropdownFilterData}
          />}
          {showActions && <Actions actionsData={actionsData} />}
        </div>
      </div>
    </>
  )
}

export default CampaignsBar;