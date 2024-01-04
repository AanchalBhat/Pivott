//@ts-nocheck
import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import ApprovalOutlinedIcon from "@mui/icons-material/ApprovalOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Outlet } from "react-router-dom";
import { createConsumer } from "@rails/actioncable";

// import global css
import "../styles/global/common.css";

import { Box, Toolbar, CssBaseline } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useLocation } from "react-router-dom";
import { DataContext } from "../context";
import Notification from "../pages/common/Notification";
import { NotificationsApi } from "../apis/notificationsApi";
import Header1 from "./Header1";
import Header2 from "./Header2";
import DrawerHead from "./DrawerHead";
import DrawerData from "./DrawerData";
import { featureFlag } from "../utils/splitConfig";
import { Toaster } from "../pages/common/Toaster";
import { getMethodError } from "../constants/errorMessages";
import { PROFILE_PREFERENCE } from "../utils/constants";
import { PROTOCOL_REGEX } from "../utils/regexLists";
const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(10)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(10)} + 1px)`,
  },
});
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(
  MuiDrawer,
  {}
)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AppsBar(props: any) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfile = Boolean(anchorEl);
  const id = openProfile ? "simple-popover" : undefined;
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const [openBellIcon, setOpenBellIcon] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const role_name = userInfo?.role?.role_name;
  let role = (role_name === "admin") || (role_name === "superadmin");
  const {
    searchTerm,
    setSearchTerm,
    counter,
    setCounter,
    globalEmailCampaign,
  } = useContext(DataContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenform = () => {
    localStorage.clear();
    setTimeout(() => navigate("/login", { state: { action: "logout" } }), 500);
  };
  const socketMessage = () => {
    let url = process.env.REACT_APP_BASE_URL.replace(PROTOCOL_REGEX, "");
    const URL = `wss://${url}/cable?token=${localStorage.getItem("token")}`;
    const consumer = createConsumer(URL, {});
    consumer.subscriptions.create(
      {
        channel: "NotificationChannel",
      },
      {
        connected: () => console.log("connected"),
        disconnected: () => console.log("disconnected"),
        received: (data) => setCounter(data.unread_count),
      }
    );
  };
  useEffect(() => {
    const domain = localStorage.getItem("COMPANY_DOMAIN");
    if (domain) {
      socketMessage();
      getNotificationCounter();
    }
  }, []);

  const getNotificationCounter = () => {
    NotificationsApi.getCount()
      .then((response) => {
        if (response.unread_count) {
          setCounter(response.unread_count);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const backNavigation = () => {
    navigate("/dashboard");
    setDrawerData(navigationData);
    setOpen(false);
    setIsProfileDrawer(false);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const navigationData = [
    {
      title: "Dashboard",
      to: "/dashboard",
      listItemIconTxt: "dashboard",
      upcoming: false,
      activeTabIcon: function () {
        return <DashboardOutlinedIcon />;
      },
    },
    {
      to: "/lead",
      title: "Leads",
      listItemIconTxt: "lead",
      upcoming: false,
      activeTabIcon: function () {
        return <AssignmentOutlinedIcon />;
      },
    },
    {
      to: "/pipeline",
      title: "Pipelines",
      listItemIconTxt: "pipeline",
      upcoming: false,
      activeTabIcon: function () {
        return <ApprovalOutlinedIcon />;
      },
    },
    {
      to: "/potential",
      title: "Potentials",
      listItemIconTxt: "potential",
      upcoming: false,
      activeTabIcon: function () {
        return <LeaderboardOutlinedIcon />;
      },
    },
    {
      to: "/deal",
      title: "Deals",
      listItemIconTxt: "deal",
      upcoming: false,
      activeTabIcon: function () {
        return <MonetizationOnOutlinedIcon />;
      },
    },
    {
      title: "Forecast",
      listItemIconTxt: "forecast",
      upcoming: true,
      activeTabIcon: function () {
        return (
          <>
            <AutoGraphOutlinedIcon />
          </>
        );
      },
    },
    {
      title: "Campaigns",
      to: userInfo?.is_campaign_started ? "/campaign/lists" : "/campaign",
      listItemIconTxt: "campaign",
      upcoming: !featureFlag("enable_feature_campaign"),
      activeTabIcon: function () {
        return <MarkEmailUnreadOutlinedIcon />;
      },
      subNav: [
        {
          id: 0,
          title: "Email Campaigns",
          to: userInfo?.is_campaign_started ? "/campaign/lists" : "/campaign",
          handleClick: () => navigate("/campaign"),
          icon: function () {
            return <SummarizeOutlinedIcon />;
          },
          cName: "sub-nav",
          listItemIconTxt: "campaign",
        },
      ],
    },
    {
      title: "Reports",
      to: "/reports",
      listItemIconTxt: "reports",
      upcoming: false,
      activeTabIcon: function () {
        return <SummarizeOutlinedIcon />;
      },
    },
    {
      title: "More Actions",
      listItemIconTxt: "lost-lead",
      toggle: true,
      upcoming: false,
      activeTabIcon: function () {
        return <MoreHorizOutlinedIcon />;
      },
      subNav: [
        {
          id: 0,
          title: "Lost Leads",
          to: "/lost-lead",
          handleClick: () => navigate("/lost-lead"),
          icon: function () {
            return <SummarizeOutlinedIcon />;
          },
          cName: "sub-nav",
          listItemIconTxt: "lost-lead",
          upcoming: false
        },
        {
          id: 1,
          title: "Contact Lists",
          to: "/contact-lists",
          handleClick: () => navigate("/contact-lists"),
          icon: function () {
            return <SummarizeOutlinedIcon />;
          },
          cName: "sub-nav",
          listItemIconTxt: "contact-lists",
          upcoming: !featureFlag("enable_feature_campaign"),
        },
      ],
    },
  ];

  const profileNavigationData = [
    {
      to: "account-details/profile-details",
      title: "Profile Preferences",
      listItemIconTxt: "account-details",
      upcoming: false,
      activeTabIcon: function () { },
    },
    {
      to: "/account/password",
      title: "Password and Login",
      listItemIconTxt: "password",
      upcoming: false,
      activeTabIcon: function () { },
    },
    role && {
      to: "/subscriptions/current-plan",
      title: "My Subscription",
      listItemIconTxt: "current-plan",
      upcoming: false,
      activeTabIcon: function () { },
    },
    role_name !== "executive" && {
      to: "/roles-permissions/manage-users",

      title: "Roles & Permissions",
      listItemIconTxt: "roles-permissions",
      upcoming: false,
      activeTabIcon: function () { },
    },
    {
      title: "Data Privacy & Consent",
      listItemIconTxt: "data_privacy",
      upcoming: true,
      activeTabIcon: function () { },
    },
  ];

  const [drawerData, setDrawerData] = useState(navigationData);
  const [isProfileDrwawer, setIsProfileDrawer] = useState(false);

  const handleProfileDrawer = () => {
    setIsProfileDrawer(true);
    setOpen(true);
    setDrawerData(profileNavigationData);
    setAnchorEl(null);
    setTimeout(() => {
      navigate("/account-details/profile-details");
    }, 200);
  };

  // global search code starts

  const [url, seturl] = useState("");

  const urls = window.location.pathname;

  const handelUrls = () => {
    if (urls !== "/global-search") {
      seturl(urls);
      setSearchTerm("");
    }
  };

  const handleNavigate = () => {
    navigate("/global-search");
  };
  const handleGlobalSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    handelUrls();
    if (props?.title === "Search Results") {
      if (isProfileDrwawer) {
        setIsProfileDrawer(false);
        setDrawerData(navigationData);
        setOpen(false);
      } else setOpen(false);
    }
  }, [props?.title, url]);

  const handleBack = () => {
    setSearchTerm("");
    if (url === "/account-details/profile-details") {
      handleProfileDrawer();
    } else if (url) {
      navigate(`${url}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleClearInput = () => {
    handleBack();
  };

  const toggleDrawerAction = () => {
    // setMarkAllEnable(true);
    setOpenBellIcon(!openBellIcon);
  };
  //one data
  useEffect(() => {
    if (isProfileDrwawer || drawerData?.[0]?.title === PROFILE_PREFERENCE) {
      setIsProfileDrawer(true);
    }
  }, []);

  return (
    <>
      <Box className="ma-topMain-sidebar" sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          open={open}
          style={{ paddingLeft: !open ? "80px" : "0px" }}
        >
          <Toolbar className="ma-main-header">
            <Header1
              open={open}
              title={props.title}
              splitLocation={splitLocation}
              isProfileDrwawer={isProfileDrwawer}
              handleDrawerClose={handleDrawerClose}
              handleDrawerOpen={handleDrawerOpen}
              handleBack={handleBack}
            />

            <Header2
              id={id}
              handleOpenform={handleOpenform}
              handleProfileDrawer={handleProfileDrawer}
              handleClose={handleClose}
              openProfile={openProfile}
              anchorEl={anchorEl}
              handleClick={handleClick}
              searchTerm={searchTerm}
              toggleDrawerAction={toggleDrawerAction}
              handleNavigate={handleNavigate}
              handleGlobalSearch={handleGlobalSearch}
              handleClearInput={handleClearInput}
            />
          </Toolbar>
        </AppBar>

        <Drawer className="ma-profile-drawer" variant="permanent" open={open}>
          <DrawerHead
            open={open}
            backNavigation={backNavigation}
            isProfileDrwawer={isProfileDrwawer}
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
          />
          <DrawerData
            open={open}
            isProfileDrwawer={isProfileDrwawer}
            splitLocation={splitLocation}
            drawerData={drawerData}
          />
        </Drawer>
        {/* Below Drawer is for Notifications */}
        <Drawer
          anchor={"right"}
          PaperProps={{ style: { width: "480px" } }}
          open={openBellIcon}
          onClose={toggleDrawerAction}
        >
          <Notification toggleDrawerAction={toggleDrawerAction} />
        </Drawer>
      </Box>
      <main>
        <div className={open ? "ma-main-outlet-open" : "ma-main-outlet"}>
          <Outlet
            context={[
              navigationData,
              setDrawerData,
              setOpen,
              profileNavigationData,
              setIsProfileDrawer,
              open,
            ]}
          />
        </div>
      </main>
    </>
  );
}
