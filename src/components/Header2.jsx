import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import "../styles/global/common.css";
import Typography from "@mui/material/Typography";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ClearIcon from "@material-ui/icons/Clear";
import AppsIcon from "@mui/icons-material/Apps";
import Menu from "@mui/material/Menu";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import { profileImage } from "../assets/index";
import marketingHub from "../assets/marketing-hub.svg";
import crmImg from "../assets/crm.svg";
import predictiveAnalysis from "../assets/predictive-analysis.svg";
import social from "../assets/social.svg";
import conversationalAi from "../assets/conversational-Ai.svg";
import accountBasedMarketing from "../assets/AB-marketing.svg";
import AdManager from "../assets/AD-manager.svg";
import salesIQ from "../assets/sales-iq.svg";
import Profile from "../pages/common/Profile/Profile";
import { DataContext } from "../context";
import Dialog from "@mui/material/Dialog";
import PopupHeader from "../pages/common/PopupHeader";
import UpgradeOrderDetail from "../pages/Main/Subscription/UpgradOrderDetail";
import { Upgrade } from "../pages/Main/Subscription/Upgrade";

const Header2 = (props) => {
  const [openApp, setopenApp] = useState(0);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const { counter } = useContext(DataContext);
  const [showOrder, setShowOrder] = useState(false);

  const handleOrderDetailClose = () => {
    setShowOrder(false);
  };

  const handleChangeTab = (event, newValue) => {
    setopenApp(newValue);
  };
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  function a11TabProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <div className="ma-topHeader-leads ma-topHeader-leads-box-size">
        <div className="ma-topHeader-leads-right ">
          <ul>
            <li className="ma-headerSearch-box headSearchFieldBox">
              <TextField
                size="medium"
                className="ma-search-head headSearchField"
                name="Search"
                sx={{ border: "none" }}
                placeholder="Search"
                type="text"
                value={props?.searchTerm}
                onChange={(e) => {
                  props?.handleNavigate();
                  props?.handleGlobalSearch(e);
                }}
                id="Search"
                InputProps={{
                  endAdornment: props?.searchTerm ? (
                    <ClearIcon
                      style={{ cursor: "pointer" }}
                      onClick={props?.handleClearInput}
                    />
                  ) : (
                    <SearchIcon style={{ color: "#191a47" }} />
                  ),
                }}
              />
            </li>
            <li>
              <Button
                className="createlead-buttons__Upgradutton Upgradebtntext ma-header-btn"
                type="submit"
                variant="contained"
                color="info"
                onClick={() => setOpenUpgrade(true)}
              >
                UPGRADE
              </Button>
            </li>
            <li
              data-testid="bell-icon"
              className="bellicon"
              style={{ cursor: "pointer" }}
              onClick={props?.toggleDrawerAction}
            >
              <Badge badgeContent={counter}>
                <NotificationsNoneIcon />
              </Badge>
            </li>

            {/* <li>
              <IconButton disabled>
                <CalendarMonthOutlinedIcon />
              </IconButton>
            </li> */}
            {/* <li>
              <IconButton disabled>
                <SettingsOutlinedIcon />
              </IconButton>
            </li> */}
            <li>
              <span className="ma-divider-header"> | </span>
            </li>
            <li>
              <IconButton
                className="ma-headerprofile-btn"
                aria-describedby={props?.id}
                onClick={props?.handleClick}
              >
                <Avatar
                  alt="avatar"
                  src={
                    userInfo?.profile_photo?.url
                      ? userInfo?.profile_photo?.url
                      : profileImage
                  }
                  sx={{ width: 34, height: 34 }}
                />
              </IconButton>
            </li>
            <Profile
              id={props?.id}
              anchorEl={props?.anchorEl}
              openProfile={props?.openProfile}
              handleClose={props?.handleClose}
              handleProfileDrawer={props?.handleProfileDrawer}
              handleOpenform={props?.handleOpenform}
            />
            <li>
              <Box className="ma-mainTop-popup d-none">
                <PopupState
                  className="ma-menuMainlist-popup"
                  variant="popover"
                  popupId="demo-popup-popover"
                >
                  {(popupState) => (
                    <>
                      <span {...bindTrigger(popupState)}>
                        <IconButton className="ma-apps-btn">
                          <AppsIcon />
                        </IconButton>
                      </span>
                      <div className="ma-mainListtop-popup">
                        <div>
                          <Menu
                            className="ma-mainWrapper-content"
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: 0,
                              horizontal: 0,
                            }}
                          >
                            <Box
                              className="ma-menulist-popup"
                              sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                              }}
                            >
                              <Tabs
                                value={openApp}
                                onChange={handleChangeTab}
                                aria-label="basic tabs"
                              >
                                <Tab label="Active" {...a11TabProps(0)} />
                                <Tab label="Upcoming" {...a11TabProps(1)} />
                              </Tabs>
                            </Box>
                            <TabPanel value={openApp} index={0}>
                              <div className="ma-menuInnerlist-popup">
                                <ul>
                                  <li className="ma-moreIcon-options-disable">
                                    <div className="ma-img-popup">
                                      <img
                                        src={marketingHub}
                                        alt="marketing-hub"
                                      />
                                    </div>
                                    <div className="ma-contentMenu-popup">
                                      <h5>Marketing Hub</h5>
                                      <p>Automate your marketing operations</p>
                                    </div>
                                  </li>
                                  <li className="ma-moreIcon-options-disable">
                                    <div className="ma-img-popup">
                                      <img src={crmImg} alt="crm" />
                                    </div>
                                    <div className="ma-contentMenu-popup">
                                      <h5>CRM</h5>
                                      <p>Customer Relationship Management</p>
                                    </div>
                                  </li>
                                  <li className="ma-moreIcon-options-disable">
                                    <div className="ma-img-popup">
                                      <img
                                        src={predictiveAnalysis}
                                        alt="predictive-analysis"
                                      />
                                    </div>
                                    <div className="ma-contentMenu-popup">
                                      <h5>Predictive Analytics</h5>
                                      <p>Data Analysis</p>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </TabPanel>
                            <TabPanel value={openApp} index={1}>
                              <div className="ma-menuInnerlist-popup">
                                <ul>
                                  <li className="ma-moreIcon-options-disable">
                                    <div className="ma-img-popup">
                                      <img src={salesIQ} alt="sales-iq" />
                                    </div>
                                    <div className="ma-contentMenu-popup">
                                      <h5>Sales IQ</h5>
                                      <p>Automate your Sales operations</p>
                                    </div>
                                  </li>
                                  <li className="ma-moreIcon-options-disable">
                                    <div className="ma-img-popup">
                                      <img src={social} alt="social" />
                                    </div>
                                    <div className="ma-contentMenu-popup">
                                      <h5>Social</h5>
                                      <p>
                                        Social Media Marketing and Campaigns
                                      </p>
                                    </div>
                                  </li>
                                  <li className="ma-moreIcon-options-disable">
                                    <div className="ma-img-popup">
                                      <img
                                        src={conversationalAi}
                                        alt="conversational-ai"
                                      />
                                    </div>
                                    <div className="ma-contentMenu-popup">
                                      <h5>Conversational AI</h5>
                                      <p>Data Analysis</p>
                                    </div>
                                  </li>
                                  <li className="ma-moreIcon-options-disable">
                                    <div className="ma-img-popup">
                                      <img
                                        src={accountBasedMarketing}
                                        alt="account-based-marketing"
                                      />
                                    </div>
                                    <div className="ma-contentMenu-popup">
                                      <h5>Account Based Marketing</h5>
                                      <p>Marketing Based on Role/Account</p>
                                    </div>
                                  </li>
                                  <li className="ma-moreIcon-options-disable">
                                    <div className="ma-img-popup">
                                      <img src={AdManager} alt="adManager" />
                                    </div>
                                    <div className="ma-contentMenu-popup">
                                      <h5>Ad Manager</h5>
                                      <p>Manage your add channels </p>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </TabPanel>
                          </Menu>
                        </div>
                      </div>
                    </>
                  )}
                </PopupState>
              </Box>
            </li>
          </ul>
        </div>
      </div>
      <Dialog className="ma-upgrade-popup" open={openUpgrade}>
        <PopupHeader
          label="Upgrade Plans"
          handleToCloseLT={() => setOpenUpgrade(false)}
        />
        <Upgrade changeTxt={true} />
      </Dialog>
      {showOrder && (
        <UpgradeOrderDetail open={showOrder} onClose={handleOrderDetailClose} />
      )}
    </>
  );
};

export default Header2;
