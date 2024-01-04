import React, { useState, useEffect } from "react";
//mui
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import MeetingsPopup from "./MeetingsPopup";
import { MeetingApi } from "../../../apis/MeetingApi";
import { useParams, useNavigate } from "react-router-dom";
import { AccountCircle, DeleteIcon } from "../../../assets/index";
import googleMeetImg from "../../../assets/google_meet.svg";
import webexImg from "../../../assets/webex.svg";
import skypeImg from "../../../assets/skype.svg";

import moment from "moment";
import NotFound from "../../NotFound/NotFound";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LoadMore from "../../../pages/common/LoadMore";
import { Toaster } from "../../../pages/common/Toaster";
import DeletePopup from "../../../pages/common/DeletePopup";
import "../../../styles/custom/Tabs.css";
import { CircularLoader } from "../../../pages/common/CircularLoader";
import {
  deleteMethodError,
  getMethodError,
} from "../../../constants/errorMessages";
import { INVALID_ID_DATA } from "../../../utils/constants";
import IncorrectId from "../../NotFound/IncorrectId";

export default function Meeting(props) {
  let OverviewType = props.type;
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [meetID, setMeetID] = useState();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [meet, setMeet] = useState({});
  const [meetings, setMeetings] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [LoadMoreClick, setLoadMoreClick] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  const [loaderState, setLoaderState] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const role_name = userInfo?.role?.role_name;

  let param = useParams();
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleModalClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setMeetID(id);
  };

  useEffect(() => {
    setMeetings([]);
    setIsEdit(false);
  }, []);

  const getData = () => {
    if (!LoadMoreClick) {
      setLoaderState("loadAll");
    } else {
      setLoaderState("loadMore");
    }
    let type = OverviewType;
    MeetingApi.getAllId(param?.id, type, page, pageSize)

      .then((response) => {
        if (response?.data) {
          if (!LoadMoreClick) {
            setMeetings(response?.data);
          } else {
            setMeetings((prev) => [...prev, ...response?.data]);
          }
          setNextPage(response?.meta?.next_page);
        }
        setLoaderState("");
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        setLoaderState("");
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const editMeeting = (elem) => {
    setMeet(elem);
    setIsEdit(true);
    toggleDrawer();
  };

  const closeDrawer = () => {
    setMeet({});
    toggleDrawer();
  };

  const handleDelete = (id) => {
    setLoading(true);
    let type = OverviewType;
    MeetingApi.delete(id, param?.id, type)

      .then((response) => {
        setLoadMoreClick(false);
        setMeetings((prev) => prev.filter((elem) => elem?.id !== id));
        setShow(false);
        Toaster.TOAST(response?.message, "success");
        if (meetings.length === 1) {
          getData();
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(deleteMethodError(error), "error");
        console.log(error);
      });
  };

  const handleLoadMore = () => {
    setLoadMoreClick(true);
    if (nextPage) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    getData();
  }, [page]);
  const handleProfileData = (userId) => {
    if (role_name !== "executive" && userId) {
      navigate(`/roles-permissions/manage-users/user-details/${userId}`);
    }
  };

  return (
    <div className="">
      <Drawer anchor={"right"} open={open} onClose={toggleDrawer}>
        <div>
          {
            <MeetingsPopup
              getData={getData}
              page={page}
              setPage={setPage}
              setLoadMoreClick={setLoadMoreClick}
              type={OverviewType}
              meet={meet}
              closeDrawer={closeDrawer}
              isEdit={isEdit}
              setOpen={setOpen}
            />
          }
        </div>
      </Drawer>
      {Invalid_data ? (
        <IncorrectId />
      ) : (
        <Paper elevation={2} className="ma-shadow-hide">
          <div className="ma-main-note">
            {OverviewType !== "LostLead" && (
              <button
                onClick={() => {
                  toggleDrawer();
                  setMeet({});
                  setIsEdit(false);
                }}
                className="addTask_btn"
              >
                <span className="addmeetingbtn_txt"> Add Meeting </span>
              </button>
            )}
            {meetings?.length > 0 && (
              <h6 className="open_Tasks_txt">Upcoming Meetings</h6>
            )}
            <div>
              {loaderState === "loadAll" ? (
                <CircularLoader />
              ) : (
                <>
                  {meetings?.length > 0 ? (
                    meetings?.map((elem, idx) => {
                      let date = elem?.attributes?.date;
                      let meetingStartTime = moment(
                        elem?.attributes?.start_time,
                        ["HH.mm"]
                      ).format("hh:mm a");
                      let meetingEndTime = moment(elem?.attributes?.end_time, [
                        "HH.mm",
                      ]).format("hh:mm a");

                      return (
                        <>
                          <div key={idx} className="Newmeet_container">
                            <div className="buttons_contianer">
                              <div className="ma-meeting-schedule">
                                <div className="ma-meet-img">
                                  <span>
                                    {elem?.attributes?.meeting_mode ===
                                      "google_meet" && (
                                      <img src={googleMeetImg} alt="Appimage" />
                                    )}
                                    {elem?.attributes?.meeting_mode ===
                                      "skype" && (
                                      <img src={skypeImg} alt="Appimage" />
                                    )}
                                    {elem?.attributes?.meeting_mode ===
                                      "webex" && (
                                      <img src={webexImg} alt="Appimage" />
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <h6 className="Newmeet_text">
                                    {elem?.attributes?.title}
                                  </h6>
                                  {/* {elem?.attributes?.meeting_url && ( */}
                                  {/* <h6 className="Newmeet_text"> */}
                                  <a
                                    className="Newmeet_text_link"
                                    href={elem?.attributes?.meeting_url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {elem?.attributes?.meeting_url}
                                  </a>

                                  {/* </h6> */}
                                  {/* )} */}
                                </div>
                              </div>
                              <div className="ma-task-btn">
                                <button
                                  className="sayyed_Txt"
                                  onClick={() =>
                                    handleProfileData(
                                      elem?.attributes?.organizer?.id
                                    )
                                  }
                                >
                                  <img
                                    src={AccountCircle}
                                    alt="EditIcon"
                                    className="edit_Icon"
                                  />
                                  <span className="user_text_in_btn">
                                    {" "}
                                    {elem?.attributes?.organizer?.full_name}
                                  </span>
                                </button>
                                <div>
                                  <button
                                    className="edit_icon_btn"
                                    onClick={() => editMeeting(elem)}
                                  >
                                    <EditOutlinedIcon />
                                    {/* <img src={EditIcon} alt="EditIcon" className="edit_Icon" /> */}
                                  </button>
                                  <button
                                    className="delete_icon_btn"
                                    onClick={() => handleShow(elem?.id)}
                                  >
                                    <img
                                      src={DeleteIcon}
                                      alt="DeleteIcon"
                                      className="delete_Icon "
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                            {elem?.attributes?.description && (
                              <h6 className="Zoomvedio_Text">
                                {elem?.attributes?.description}
                              </h6>
                            )}
                            <h6 className="Time_text">
                              {date} at {meetingStartTime} - {meetingEndTime}
                            </h6>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <NotFound value="No meetings available" />
                  )}
                  {/* load more */}
                  <LoadMore
                    loader={loaderState === "loadMore"}
                    nextPage={nextPage}
                    handleLoadMore={handleLoadMore}
                  />
                </>
              )}
            </div>
          </div>
        </Paper>
      )}

      <DeletePopup
        title="Delete Meeting"
        content="Are you sure you want to delete meeting ?"
        openDelete={show}
        handleClose={handleModalClose}
        handleDelete={handleDelete}
        primaryBtn="CONFIRM"
        secondaryBtn="CANCEL"
        deleteId={meetID}
        loading={loading}
      />
    </div>
  );
}
