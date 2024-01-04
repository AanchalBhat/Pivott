import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//mui
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
// icons
import { callApi } from "../../../apis/callApi";
//other imports
import moment from "moment";
import CallsPopup from "./CallsPopup";
import NotFound from "../../NotFound/NotFound";
import LoadMore from "../../../pages/common/LoadMore";
import { AccountCircle, DeleteIcon } from "../../../assets";
import { Toaster } from "../../../pages/common/Toaster";
import DeletePopup from "../../../pages/common/DeletePopup";
import { CircularLoader } from "../../../pages/common/CircularLoader";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "../../../styles/custom/Tabs.css";
import {
  deleteMethodError,
  getMethodError,
} from "../../../constants/errorMessages";
import IncorrectId from "../../NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../../../utils/constants";

export default function Calls(props) {
  let OverviewType = props?.type;

  const [open, setOpen] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  const [calls, setCalls] = useState([]);
  const [callId, setCallId] = useState();
  const [call, setcall] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [LoadMoreClick, setLoadMoreClick] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loaderState, setLoaderState] = useState("");
  const owner = JSON.parse(localStorage.getItem("useDataPopup"));
  const callOwner = owner?.attributes?.contact_detail?.first_name;
  const pageSize = 10;

  const params = useParams();

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleModalClose = () => setShow(false);

  const handleShow = (id) => {
    setShow(true);
    setCallId(id);
  };

  useEffect(() => {
    setIsEdit(false);
  }, []);

  const callsInit = () => {
    if (!LoadMoreClick) {
      setLoaderState("loadAll");
    } else {
      setLoaderState("loadMore");
    }
    let type = OverviewType;
    callApi
      .getCalls(params?.id, type, page, pageSize)

      .then((response) => {
        if (!LoadMoreClick) {
          setCalls(response?.data);
        } else {
          setCalls((prev) => [...prev, ...response?.data]);
        }
        setLoaderState("");
        setNextPage(response?.meta?.next_page);
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
        setLoaderState("");
      });
  };

  const editCall = (call) => {
    setcall(call);
    setIsEdit(true);
    toggleDrawer();
  };

  const handleDelete = (id) => {
    setLoading(true);
    let type = OverviewType;
    callApi
      .deleteCall(id, params?.id, type)

      .then((response) => {
        setLoadMoreClick(false);
        setCalls((prev) => prev.filter((elem) => elem.id !== id));
        Toaster.TOAST(response?.message, "success");
        setShow(false);
        if (calls.length === 1) {
          callsInit();
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(deleteMethodError(error), "error");
        console.log(error);
      });
  };

  const closeDrawer = () => {
    toggleDrawer();
  };

  const handleLoadMore = () => {
    setLoadMoreClick(true);
    if (nextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const updateCall = (updatedCall) => {
    const updatedCalls = calls.map((elem, key) => {
      return elem.id === updatedCall?.id ? updatedCall : elem;
    });
    setCalls(updatedCalls);
  };

  useEffect(() => {
    callsInit();
  }, [page]);

  return (
    <div className="">
      <Drawer anchor={"right"} open={open} onClose={toggleDrawer}>
        <div>
          <CallsPopup
            callsInit={callsInit}
            page={page}
            setPage={setPage}
            setLoadMoreClick={setLoadMoreClick}
            call={call}
            updateCall={updateCall}
            closeDrawer={closeDrawer}
            isEdit={isEdit}
            type={OverviewType}
          />
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
                  setcall({});
                  setIsEdit(false);
                }}
                className="addTask_btn"
              >
                <span data-testid="lead-call" className="addtaskbtn_txt">
                  {" "}
                  Add Call{" "}
                </span>
              </button>
            )}
            {calls?.length > 0 && (
              <h6 className="open_Tasks_txt">Scheduled Calls </h6>
            )}
            <div>
              {loaderState === "loadAll" ? (
                <CircularLoader />
              ) : (
                <>
                  {calls?.length > 0 ? (
                    calls?.map((call, index) => {
                      return (
                        <>
                          <div className="schedule_Calls_container" key={index}>
                            <div className="buttons_contianer">
                              <div>
                                <h6 className="Schedulecalls_txt">
                                  Call Scheduled with{" "}
                                  <span className="john_Green_txt">{`${
                                    callOwner || "N/A"
                                  }(${
                                    call?.attributes?.call_to || "N/A"
                                  })`}</span>
                                </h6>
                              </div>

                              <div className="ma-task-btn">
                                <button className="sayyed_Txt">
                                  <img
                                    src={AccountCircle}
                                    alt="EditIcon"
                                    className="edit_Icon"
                                  />
                                  <span className="user_text_in_btn">
                                    {call.attributes.assignee?.full_name ||
                                      "N/A"}
                                  </span>
                                </button>
                                <div>
                                  <button
                                    className="edit_icon_btn"
                                    onClick={() => editCall(call)}
                                  >
                                    <EditOutlinedIcon />
                                  </button>
                                  <button
                                    className="delete_icon_btn"
                                    onClick={() => handleShow(call?.id)}
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

                            <h6 className="calls_Time">
                              {call?.attributes?.call_date} at{" "}
                              <span>
                                {" "}
                                {moment(call?.attributes?.call_time, [
                                  "HH.mm",
                                ]).format("hh:mm a")}
                              </span>
                            </h6>

                            <div className="holderTasks">
                              <div className="newtask_Status">
                                <ul>
                                  <li>
                                    <h6 className="ma-dark-title ma-bullet-green">
                                      {call?.attributes?.purpose
                                        ? call?.attributes?.purpose
                                        : "N/A"}
                                    </h6>
                                    <h6
                                      className="ma-light-title"
                                      data-testid="status_txt"
                                    >
                                      Purpose
                                    </h6>
                                  </li>
                                  <li className="ma-divider-status"></li>
                                  <li>
                                    <h6 className="ma-dark-title">
                                      {call?.attributes?.callable_type
                                        ? call?.attributes?.callable_type
                                        : "N/A"}
                                    </h6>
                                    <h6 className="ma-light-title">
                                      Call Type
                                    </h6>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <span className="ma-calls-description">
                              {call?.attributes?.description}
                            </span>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <NotFound value="No calls scheduled" />
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
        title="Delete Call"
        content="Are you sure you want to delete call ?"
        openDelete={show}
        handleClose={handleModalClose}
        handleDelete={handleDelete}
        primaryBtn="CONFIRM"
        secondaryBtn="CANCEL"
        deleteId={callId}
        loading={loading}
      />
    </div>
  );
}
