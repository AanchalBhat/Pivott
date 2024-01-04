import React, { useContext, useEffect, useState } from "react";
import { Avatar, Box, Button, CircularProgress, Divider, MenuItem, Typography } from "@mui/material";
import AllLeads from "./DropdownFilter";
import CloseIcon from "@mui/icons-material/Close";
import { NotificationsApi } from "../../apis/notificationsApi";
import { DataContext } from "../../context";
import InfiniteScroll from 'react-infinite-scroll-component';
import { makeStyles } from '@mui/styles';
import { CircularLoader } from "./CircularLoader";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import { Toaster } from "./Toaster";

const useStyles = makeStyles({
  msgHolder: {
    textAlign: "center",
    fontSize: "12px",
    color: "#8C8DA3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  notFound: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignContent: "center"
  }
});

export default function Notification({ toggleDrawerAction }) {
  const classes = useStyles();
  const [filterNotification, setFilterNotification] = useState("");
  const [notificationsData, setNotificationsData] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [hasNextPage, setHasNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { counter, setCounter } = useContext(DataContext);
  const getInitials = (value) => {
    const [firstName, lastName] = value.split(" ");
    const initials =
      firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase();
    return initials;
  };

  useEffect(() => {
    if (page > 1) {
      getNotification()
    }
  }, [page])

  const getNotification = () => {
    if (page === 1) {
      setLoading(true);
    }
    NotificationsApi.getData(page, pageSize).then((resp) => {
      setLoading(false);
      try {
        if (page === 1) {
          setNotificationsData(resp?.data)
        }
        else {
          setNotificationsData(prev => [...prev, ...resp?.data])
        }
        setHasNextPage(resp?.meta?.next_page)
      } catch (error) {
        console.log("error", error);
      }
    })
    .catch((error) => {
      setLoading(false);
      Toaster.TOAST(getMethodError(error), "error");
      console.log(error);
    });
  };

  const dropdownFilterData = [
    { title: "Leads", value: "leads" },
    { title: "Pipelines", value: "pipelines" },
    { title: "Potentials", value: "potentials" },
    { title: "Deals", value: "deals" },
    { title: "Marketing Suite", value: "marketing_suite" },
    { title: "Lost Leads", value: "lost_leads" },
    { title: "Meetings", value: "meetings" },
    { title: "Tasks", value: "tasks" },
  ]?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem.value}>
        {elem.title}
      </MenuItem>
    );
  });

  const handleFilterList = (val) => {
    setFilterNotification(val);
    NotificationsApi.getAllFilter(val)
      .then((resp) => {
        setNotificationsData(resp?.data);
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  }

  useEffect(() => {
    setFilterNotification("");
    getNotification();
  }, []);

  const handleScroll = () => {
    setPage(page => page + 1);
  }

  const handleTap = (read, id) => {
    if (!read) {
      NotificationsApi.markAsRead(id)
        .then((response) => {
          const temp = notificationsData?.map((notification, key) => {
            if (notification?.id === id) {
              let data = { ...notification, attributes: { ...notification?.attributes, read: true } }
              return data;
            } else {
              return notification;
            }
          })
          setCounter(prev => prev - 1)
          setNotificationsData(temp);
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    }

  };

  const handleReadAll = () => {
    NotificationsApi.markAll()
      .then((response) => {
        const temp = notificationsData?.map((notification, key) => {
          let data = { ...notification, attributes: { ...notification?.attributes, read: true } }
          return data;
        })
        setNotificationsData(temp);
        setCounter(0);
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  return (
    <>
      <Box sx={{ overflowY: "hidden" }}>
        <div className="ma-LeadMD filterSelect">
          <h4>Notifications</h4>
          <Button className="ma-close-btn" onClick={toggleDrawerAction}>
            <CloseIcon />
          </Button>
        </div>
        <Box className="d-flex align-items-center justify-content-between px-3 leadChildBox ma-filter-notification">
          <AllLeads
            alignParam={["bottom", -35, "top", "left"]}
            title="All Filters"
            value={""}
            allLead={filterNotification}
            handleList={(e) => handleFilterList(e.target.value)}
            leadArray={dropdownFilterData}
          />
          <Button
            style={{
              color: counter !== 0 ? "#2c42b5" : "#D1D1DA",
              cursor: counter !== 0 ? "pointer" : "none",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "none"
            }}
            className="leadfilterlistname p-0 m-0"
            disabled={counter === 0}
            onClick={handleReadAll}
          >
            Mark all as read
          </Button>
        </Box>

        {loading ?
          <CircularLoader />
          : !notificationsData?.length && <div className={classes.notFound}>
            <span style={{ margin: "auto" }}>No notifications found</span>
          </div>
        }
        <InfiniteScroll
          dataLength={notificationsData?.length}
          next={handleScroll}
          hasMore={hasNextPage ? true : false}
          height={650}
          loader={<div className={`ma-infinity-holder ${classes.msgHolder}`}><CircularProgress className="my-2" /></div>}
          endMessage={notificationsData?.length && <div className={classes.msgHolder}>End of List <Divider /></div>}
        >
          {notificationsData && notificationsData.map((item, index) => {
            return (
              <div
                onClick={() => handleTap(item?.attributes?.read, item?.id)}
                style={{
                  backgroundColor:
                    item?.attributes?.read === true ? "" : "#D8F6FF", cursor: "pointer",
                  pointerEvents: item?.attributes?.read === true ? "none" : ""
                }}
              >
                <div className="d-flex justify-content-between pt-3 px-3">
                  <Box className="d-flex justify-content-between">
                    {item?.type === "notification" && item?.avatar && (
                      <Avatar
                        className="d-flex align-items-center"
                        aria-label="recipe"
                        alt="Remy Sharp"
                        src={item?.avatar}
                      />
                    )}
                    {item?.type === "notification" && !item?.avatar && item?.from && (
                      <Avatar
                        className="d-flex align-items-center"
                        sx={{
                          bgcolor: "#FFF0C3",
                          color: "#FFAB00",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                        aria-label="recipe"
                      >
                        {getInitials(item?.from)}
                      </Avatar>
                    )}

                    {item?.type === "update_notice" && (
                      <Avatar
                        className="d-flex align-items-center"
                        aria-label="recipe"
                        alt="Remy Sharp"
                        src={require("../../assets/reopen_window.png")}
                      />
                    )}

                    {item?.type === "notification" &&
                      !item?.avatar &&
                      !item?.from && (
                        <Avatar
                          className="d-flex align-items-center"
                          aria-label="recipe"
                          alt="Remy Sharp"
                          src={require("../../assets/splitscreen_top.png")}
                        />
                      )}

                    {item?.type === "scheduled" && !item?.avatar && !item?.from && (
                      <Avatar
                        className="d-flex align-items-center"
                        aria-label="recipe"
                        alt="Remy Sharp"
                        src={require("../../assets/schedule_send.png")}
                      />
                    )}

                    {item?.type === "feature_notice" &&
                      !item?.avatar &&
                      !item?.from && (
                        <Avatar
                          className="d-flex align-items-center"
                          aria-label="recipe"
                          alt="Remy Sharp"
                          src={require("../../assets/celeberation.png")}
                        />
                      )}

                    <Box className="ma-Rightnotifiaction-panel">
                      {item?.attributes?.header ? (
                        <Typography className="ma-rightPanel-header">
                          {item?.attributes?.header}&nbsp;
                          <span>
                            {item?.secondary}
                          </span>
                        </Typography>
                      ) : null}
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#444B6E",
                          boxSizing: "border-box",
                        }}
                        className="ma-rightPanel-title"
                      >
                        {item?.attributes?.title}
                      </Typography>
                      <Typography className="ma-rightPanel-desc" sx={{ color: "#8C8DA3", fontSize: "12px" }}>
                        {item?.attributes?.description?.length > 45 ? item?.attributes?.description?.substring(0, 45) + "..." : item?.attributes?.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="paragraph"
                    sx={{ color: "#8C8DA3", fontSize: "12px", fontWeight: 400 }}
                    className="d-flex align-items-start"
                  >
                    {item?.attributes?.created_time}
                  </Typography>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    marginTop: "10px",
                    borderBottom: "1px solid rgba(0,0,0, 0.1)",
                  }}
                />
              </div>
            );
          })}
        </InfiniteScroll>

      </Box>
    </>
  );
}
