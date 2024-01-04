import React, { useState, useEffect } from "react";
//mui
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@material-ui/core";
import LeadnotesPopup from "./LeadnotesPopup";
import { NoteAPI } from "../../../apis/NoteApi";
import { useParams } from "react-router";
import { DeleteIcon } from "../../../assets/index";
import NotFound from "../../NotFound/NotFound";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Img } from "react-image";
import LoadMore from "../../../pages/common/LoadMore";
import { Toaster } from "../../../pages/common/Toaster";
import DeletePopup from "../../../pages/common/DeletePopup";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "../../../styles/custom/Tabs.css";
import { CircularLoader } from "../../../pages/common/CircularLoader";
import {
  deleteMethodError,
  getMethodError,
} from "../../../constants/errorMessages";
import IncorrectId from "../../NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../../../utils/constants";

export default function LeadNotes(props) {
  let OverviewType = props.type;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [noteData, setNoteData] = useState({});
  const [notes, setNotes] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [LoadMoreClick, setLoadMoreClick] = useState(false);
  const [showIDArr, setShowIDArr] = useState([]);
  const [page, setPage] = useState(1);
  const [Invalid_data, setInvalidData] = useState(false);
  const [loaderState, setLoaderState] = useState("");
  let groupByDate = "";
  const pageSize = 10;

  let param = useParams();
  const toggleDrawer = () => {
    setOpen(!open);
    setNoteData({});
  };
  const handleModalClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setDeleteId(id);
  };

  useEffect(() => {
    do {
      setNotes([]);
    } while (open);

    setIsEdit(false);
  }, []);

  const handleLoadMore = () => {
    setLoadMoreClick(true);

    if (nextPage) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (page) {
      getData();
    }
  }, [page]);
  const getData = () => {
    if (!LoadMoreClick) {
      setLoaderState("loadAll");
    } else {
      setLoaderState("loadMore");
    }
    let type = OverviewType;
    NoteAPI.getAllId(param.id, type, page, pageSize)

      .then((response) => {
        if (response?.data) {
          if (!LoadMoreClick) {
            setNotes(response?.data);
          } else {
            setNotes((prev) => [...prev, ...response?.data]);
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

  const editNote = (elem, i) => {
    setNoteId(i);
    setNoteData(elem);
    setIsEdit(true);
    setOpen(true);
  };

  const closeDrawer = () => {
    setNoteData({});
    toggleDrawer();
  };

  const handleDelete = (id) => {
    setLoading(true);
    let type = OverviewType;
    let data = {
      id: id,
      noteable_id: param?.id,
      noteable_type: type,
    };
    NoteAPI.delete({ data })

      .then((response) => {
        setLoadMoreClick(false);
        setShow(false);
        Toaster.TOAST(response?.message, "success");
        setNotes((prev) => prev.filter((elem) => elem.id !== id));
        if (notes.length === 1) {
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

  const setGroupBy = (dateString) => {
    groupByDate = dateString;
  };

  const extractMonthAndYear = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return month + " " + year;
  };

  return (
    <>
      <div className="">
        <Drawer anchor={"right"} open={open} onClose={toggleDrawer}>
          <div>
            <LeadnotesPopup
              page={page}
              setPage={setPage}
              getData={getData}
              setLoadMoreClick={setLoadMoreClick}
              noteId={noteId}
              type={OverviewType}
              note={noteData}
              closeDrawer={closeDrawer}
              isEdit={isEdit}
            />
          </div>
        </Drawer>
        {Invalid_data ? (
          <IncorrectId />
        ) : (
          <Paper className="ma-shadow-hide" elevation={2}>
            <div className="ma-main-note">
              {OverviewType !== "LostLead" && (
                <button
                  data-testid="create-note"
                  onClick={toggleDrawer}
                  className="addTask_btn"
                >
                  <span className="addtaskbtn_txt">Create Note</span>
                </button>
              )}

              <div>
                {loaderState === "loadAll" ? (
                  <CircularLoader />
                ) : (
                  <>
                    {notes?.length > 0 ? (
                      notes?.map((elem, index) => {
                        return (
                          <>
                            {extractMonthAndYear(groupByDate) !==
                              extractMonthAndYear(
                                elem?.attributes?.created_at
                              ) && (
                              <div data-testid="open-note" className="">
                                {
                                  <>
                                    {setGroupBy(elem?.attributes?.created_at)}
                                    <h6 className="open_Tasks_txt justify-content-start">
                                      {extractMonthAndYear(
                                        elem?.attributes?.created_at
                                      )}
                                    </h6>
                                  </>
                                }
                              </div>
                            )}
                            <div key={index} className="Note_box_container">
                              <div className="buttons_contianer">
                                <h6 className="note_text">
                                  <span className="newnote_Text">
                                    {elem?.attributes?.title}
                                  </span>
                                  <span className="bySayyed">
                                    {/* {" "} */}by{" "}
                                    {
                                      elem?.attributes?.created_by?.data
                                        ?.attributes?.first_name
                                    }{" "}
                                    {
                                      elem?.attributes?.created_by?.data
                                        ?.attributes?.last_name
                                    }
                                  </span>{" "}
                                </h6>
                                <div>
                                  <button
                                    data-testid="edit-note"
                                    className="edit_icon_btn"
                                    onClick={() => editNote(elem, index)}
                                  >
                                    <EditOutlinedIcon />
                                  </button>
                                  <button
                                    data-testid="delete-note"
                                    className="delete_icon_btn"
                                    onClick={() => handleShow(elem.id)}
                                  >
                                    <img
                                      src={DeleteIcon}
                                      alt="DeleteIcon"
                                      className="delete_Icon "
                                    />
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div className="lap_container">
                                  {elem?.attributes?.attachment?.url && (
                                    <div className="ma-note-img">
                                      <Img
                                        loader={<CircularProgress />}
                                        className="image_size "
                                        src={elem?.attributes?.attachment?.url}
                                      />
                                    </div>
                                  )}
                                  <h6 className="time_text">
                                    {elem?.attributes?.created_at}
                                    <p className="paragraph_txt">
                                      {elem?.attributes?.description?.length >
                                        400 &&
                                      !showIDArr?.includes(elem?.id) ? (
                                        <>
                                          {elem?.attributes?.description.substring(
                                            0,
                                            200
                                          ) + "... "}
                                          <div
                                            className="ma-read-more-container"
                                            onClick={() =>
                                              setShowIDArr((prev) => [
                                                ...prev,
                                                elem?.id,
                                              ])
                                            }
                                          >
                                            <span className="ma-read-more-btn">
                                              Read More{" "}
                                            </span>
                                            <KeyboardArrowDownIcon className="ma-read-more-icon" />
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          {elem?.attributes?.description}
                                          {elem?.attributes?.description
                                            ?.length > 400 && (
                                            <div
                                              className="ma-read-more-container"
                                              onClick={() =>
                                                setShowIDArr((prev) =>
                                                  prev?.filter(
                                                    (item) => item !== elem?.id
                                                  )
                                                )
                                              }
                                            >
                                              <span className="ma-read-more-btn">
                                                Read Less
                                              </span>
                                              <KeyboardArrowUpIcon className="ma-read-less-icon" />
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </p>
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    ) : (
                      <NotFound value="No notes available" />
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
            <DeletePopup
              title="Delete Note"
              content="Are you sure you want to delete note ?"
              openDelete={show}
              handleClose={handleModalClose}
              handleDelete={handleDelete}
              primaryBtn="CONFIRM"
              secondaryBtn="CANCEL"
              deleteId={deleteId}
              loading={loading}
            />
          </Paper>
        )}
      </div>
    </>
  );
}
