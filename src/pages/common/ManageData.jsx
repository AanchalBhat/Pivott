// mui
import {
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListSubheader,
  ListItemButton,
  ListItemText,
} from "@mui/material";

// mui icons
import SearchIcon from "@mui/icons-material/Search";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { ButtonLoader } from "./ButtonLoader";

const ManageData = ({
  title,
  toggleDrawerAction,
  handleManageSearch,
  handleManage,
  itemList,
  handleclose,
  iconId,
  stateChange,
  manageDisable,
  loading,
}) => {
  return (
    <>
      <div className="ma-manageData-Container">
        <div className="ma-LeadManage">
          <h4 data-testid="mg-data">Manage Data</h4>
          <Button
            data-testid="toggle"
            className="ma-close-btn"
            onClick={toggleDrawerAction}
          >
            <CloseIcon />
          </Button>
        </div>
        <div className="LeadFilter1Box">
          <TextField
            data-testid="search"
            size="medium"
            sx={{ width: "100%" }}
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
            onChange={(e) => handleManageSearch(e)}
          />
        </div>
        <div className="LeadFilter1List">
          <List
            component="nav"
            sx={{ padding: "2px 5px" }}
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                className="ma-side-leads"
                component="div"
                id="nested-list-subheader"
              >
                <div className="leadfilterlistname"> {title} </div>
                <div className="ma-rightfilter-btn">
                  <Button
                    data-testid="reset-btn"
                    disabled={stateChange() ? true : false}
                  >
                    <div
                      style={{
                        color: stateChange() ? "#D1D1DA" : "#2c42b5",
                        fontSize: "14px",
                      }}
                      className="leadfilterlistname"
                      onClick={() => handleManage("reset")}
                    >
                      RESET DEFAULT
                    </div>
                  </Button>
                </div>
              </ListSubheader>
            }
          ></List>

          <div className="list-container">
            {itemList?.map((item, index) => (
              <List key={index} className="item-container">
                <ListItem disablePadding className="leadMDlist">
                  <ListItemButton data-testid="close-btn">
                    <DragIndicatorRoundedIcon className="leadMDlisticon" />
                    <ListItemText
                      className="leadMDlistItemText"
                      primary={item?.data}
                    />

                    {iconId.includes(item?.id) ? (
                      <VisibilityOffOutlinedIcon
                        className="ma-sideEyeClosed-icon"
                        onClick={() => handleclose(item, index, 1)}
                      />
                    ) : (
                      <RemoveRedEyeOutlinedIcon
                        className="ma-sideEye-icon"
                        id={index}
                        onClick={() => handleclose(item, index, 0)}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </List>
            ))}
          </div>
        </div>
        <div className="listMDbutton">
          <ButtonLoader
            loading={loading}
            disabled={!manageDisable || loading}
            classStyle={"applay"}
            handleClick={() => handleManage()}
            testid={"apply"}
            title={"APPLY"}
          />
          <Button
            className="cancel"
            data-testid="cancel"
            onClick={() => toggleDrawerAction()}
          >
            {" "}
            <div> CANCEL</div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default ManageData;
