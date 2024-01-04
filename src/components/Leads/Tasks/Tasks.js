import React, { useState, useEffect } from "react";
//mui
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TaskPopup from "./Taskspopup";
import { TaskAPI } from "../../../apis/TaskApi";
import { useParams } from "react-router-dom";
import NotFound from "../../NotFound/NotFound";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { taskArr, PriorityArr } from "../../../Data/data";
import LoadMore from "../../../pages/common/LoadMore";
import { AccountCircle, DeleteIcon } from "../../../assets";
import { Toaster } from "../../../pages/common/Toaster";
import DeletePopup from "../../../pages/common/DeletePopup";
import "../../../styles/custom/Tabs.css";
import { CircularLoader } from "../../../pages/common/CircularLoader";
import {
  deleteMethodError,
  getMethodError,
} from "../../../constants/errorMessages";
import IncorrectId from "../../NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../../../utils/constants";

export default function LeadTasks(props) {
  let OverviewType = props?.type;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deletId, setDeleteId] = useState();
  const [task, setTask] = useState({});
  const [complete, setComplete] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [LoadMoreClick, setLoadMoreClick] = useState(false);
  const [page, setPage] = useState(1);
  const [Invalid_data, setInvalidData] = useState(false);
  const [loaderState, setLoaderState] = useState("");
  const pageSize = 10;
  let param = useParams();

  const toggleDrawer = (e) => {
    setOpen(!open);
  };

  const handleModalClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setDeleteId(id);
  };

  useEffect(() => {
    setIsEdit(false);
  }, []);

  const getData = (parameter) => {
    if (!LoadMoreClick) {
      setLoaderState("loadAll");
    } else {
      setLoaderState("loadMore");
    }
    let type = OverviewType;
    TaskAPI.getAllId(param?.id, type, parameter, page, pageSize)

      .then((response) => {
        if (!LoadMoreClick) {
          setTasks(response?.data);
        } else {
          setTasks((prev) => [...prev, ...response?.data]);
        }
        setLoaderState("");
        setNextPage(response?.meta?.next_page);
        handleCompleted(parameter);
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

  const editTask = (elem) => {
    setTask(elem);
    setIsEdit(true);
    toggleDrawer();
  };

  const handleDelete = (id) => {
    setLoading(true);
    let type = OverviewType;
    TaskAPI.delete(id, param?.id, type)
      .then((response) => {
        setLoadMoreClick(false);
        setTasks((prev) => prev.filter((elem) => elem.id !== id));
        setShow(false);
        Toaster.TOAST(response?.message, "success");
        if (tasks.length === 1) {
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

  const closeDrawer = () => {
    setTask({});
    toggleDrawer();
  };

  const handleCompleted = (status) => {
    if (status === "completed") {
      setComplete(true);
    } else {
      setComplete(false);
    }
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

  return (
    <div className="">
      <>
        <Drawer anchor={"right"} open={open} onClose={toggleDrawer}>
          <div>
            <TaskPopup
              getData={getData}
              Tasktype={complete}
              page={page}
              setPage={setPage}
              setLoadMoreClick={setLoadMoreClick}
              type={OverviewType}
              task={task}
              closeDrawer={closeDrawer}
              isEdit={isEdit}
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
                  className="addTask_btn"
                  onClick={() => {
                    toggleDrawer();
                    setTask({});
                    setIsEdit(false);
                  }}
                >
                  <span data-testid="task" className="addtaskbtn_txt">
                    Add Task
                  </span>
                </button>
              )}

              <Box className="show_task">
                {complete === false ? (
                  <h6 className="open_Tasks_txt justify-content-start">
                    Open Tasks
                  </h6>
                ) : (
                  <h6 className="open_Tasks_txt justify-content-start">
                    Completed Tasks
                  </h6>
                )}
                {complete === false ? (
                  <h6
                    className="completed_txt justify-content-end"
                    onClick={() => getData("completed")}
                  >
                    Show Completed Tasks
                  </h6>
                ) : (
                  <h6 className="completed_txt" onClick={() => getData()}>
                    Show Open Tasks
                  </h6>
                )}
              </Box>
              <div>
                {loaderState === "loadAll" ? (
                  <CircularLoader />
                ) : (
                  <>
                    {tasks?.length > 0 ? (
                      tasks?.map((elem, key) => {
                        let due_date = new Date(
                          elem?.attributes?.due_date_time
                        );
                        return (
                          <div key={key} className="box_Container">
                            <div className="buttons_contianer">
                              <h6 className="newTask_txt">
                                {elem?.attributes?.subject}
                              </h6>
                              <div className="ma-task-btn">
                                <div>
                                  <button className="sayyed_Txt">
                                    <img
                                      src={AccountCircle}
                                      alt="EditIcon"
                                      className="edit_Icon"
                                    />
                                    <span className="user_text_in_btn">
                                      {elem?.attributes?.task_owner?.full_name}
                                    </span>
                                  </button>
                                </div>
                                <div>
                                  {OverviewType !== "lost_leads" ? (
                                    <div>
                                      <button
                                        className="edit_icon_btn"
                                        onClick={() => editTask(elem)}
                                      >
                                        <EditOutlinedIcon />
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
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="holderTasks">
                              <div className="newtask_Status">
                                <ul>
                                  <li>
                                    {taskArr?.map(
                                      (item, key) =>
                                        item?.value ===
                                          elem?.attributes?.status && (
                                          <h6
                                            key={key}
                                            className={`ma-dark-title ma-bullet 
                                      ${
                                        elem?.attributes?.status ===
                                          "started" && "ma-bullet-blue"
                                      }
                                        ${
                                          elem?.attributes?.status ===
                                            "in_progress" && "ma-bullet-yellow"
                                        }
                                        ${
                                          elem?.attributes?.status ===
                                            "not_started" && "ma-bullet-orange"
                                        }
                                        ${
                                          elem?.attributes?.status ===
                                            "completed" && "ma-bullet-green"
                                        }
                                       `}
                                          >
                                            {item?.label}
                                          </h6>
                                        )
                                    )}
                                    <h6 className="ma-light-title">Status</h6>
                                  </li>

                                  <li className="ma-divider-status"></li>

                                  <li>
                                    {PriorityArr?.map(
                                      (item, key) =>
                                        item?.value ===
                                          elem?.attributes?.priority && (
                                          <h6
                                            key={key}
                                            className="ma-dark-title"
                                          >
                                            {item?.label}
                                          </h6>
                                        )
                                    )}
                                    <h6 className="ma-light-title">Priority</h6>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <h6 className="timeline_txt">
                              {due_date.toLocaleString("en-us", {
                                month: "long",
                                year: "numeric",
                                day: "numeric",
                              })}{" "}
                              at{" "}
                              {due_date.toLocaleString("en-us", {
                                timeZone: "UTC",
                                hour12: true,
                                hour: "numeric",
                                minute: "numeric",
                              })}
                            </h6>
                          </div>
                        );
                      })
                    ) : (
                      <NotFound value="No tasks available" />
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
      </>
      <DeletePopup
        title="Delete Task"
        content="Are you sure you want to delete task ?"
        openDelete={show}
        handleClose={handleModalClose}
        handleDelete={handleDelete}
        primaryBtn="CONFIRM"
        secondaryBtn="CANCEL"
        deleteId={deletId}
        loading={loading}
      />
    </div>
  );
}
