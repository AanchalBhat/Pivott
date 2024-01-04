import React, { useState, useEffect } from "react";
import Board, { moveCard } from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import Avatar from "@mui/material/Avatar";
import "./kanbanstyle.css";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { PipelineApi } from "../../apis/pipelineApi";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconTooltip from "../../pages/common/IconTooltip";
import { Toaster } from "../../pages/common/Toaster";
//import global css
import "../../styles/global/common.css";
import { CircularLoader } from "../../pages/common/CircularLoader";
import { getSymbol } from "../../utils/currencySymbol";
import { getMethodError, restMethodError } from "../../constants/errorMessages";

const CreateBoard = (props) => {
  let board_data = props?.data?.listData;
  let get_data = props?.data?.boardData;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const addDescription = (desc) => (
    <>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => handleNavigate(desc?.id)}
      >
        <span
          className="title-desc ma-board-title"
          onClick={() => handleNavigate(desc?.id)}
        >
          <p>{desc ? desc?.account_name : "Truhlar and Truhlar"}</p>
        </span>
        <div
          className="kanban-desc ma-board-title"
          onClick={() => handleNavigate(desc?.id)}
        >
          {desc?.lead_details?.data?.attributes?.profile_photo?.url ? (
            <img
              alt=""
              className="image-desc"
              sx={{
                width: "20px",
                height: "20px",
                marginTop: "2px",
                marginLeft: "8px",
              }}
              src={desc?.lead_details?.data?.attributes?.profile_photo?.url}
            />
          ) : (
            <Avatar sx={{ width: "20px", height: "20px" }} alt="Remy Sharp">
              {" "}
              <AccountCircleIcon />{" "}
            </Avatar>
          )}
          <p className="amt" onClick={() => handleNavigate(desc?.id)}>
            {" "}
            {desc?.expected_revenue
              ? `${getSymbol(desc.currency?.code)} ${desc?.expected_revenue}`
              : "N/A"}
          </p>
        </div>
      </div>
      <div className="icons text-center d-flex align-items-center justify-content-between">
        <div
          className="ma-board-title"
          onClick={() => handleIconClick("meeting", desc?.id)}
        >
          <div className="number-desc">{desc?.pipeline_meetings_count}</div>
          <div className="icon-desc">
            <IconTooltip
              title="Meetings"
              icon={<TextSnippetOutlinedIcon sx={{ color: "#5E5F7E" }} />}
            />
          </div>
        </div>
        <div
          className="ma-board-title"
          onClick={() => handleIconClick("note", desc?.id)}
        >
          {/*placeholder not present in api response (className="number-desc")*/}
          <div className="number-desc">{desc?.pipeline_notes_count}</div>
          <div className="icon-desc">
            <IconTooltip
              title="Notes"
              icon={<TaskOutlinedIcon sx={{ color: "#5E5F7E" }} />}
            />
          </div>
        </div>
        <div
          className="ma-board-title"
          onClick={() =>
            handleIconClick("email", desc?.id, desc?.contact_detail?.email)
          }
        >
          <div className="number-desc">{desc?.pipeline_emails_count}</div>
          <div className="icon-desc">
            <IconTooltip
              title="Emails"
              icon={<MailOutlinedIcon sx={{ color: "#5E5F7E" }} />}
            />
          </div>
        </div>
        <div
          className="ma-board-title"
          onClick={() => handleIconClick("call-information", desc?.id)}
        >
          <div className="number-desc">{desc?.pipeline_calls_count}</div>
          <div className="icon-desc">
            <IconTooltip
              title="Calls"
              icon={<PhoneOutlinedIcon sx={{ color: "#5E5F7E" }} />}
            />
          </div>
        </div>
      </div>
    </>
  );

  const [getBoards, setBoards] = useState({});

  const handleNavigate = (id) => {
    navigate(`/pipeline/${id}/overview`);
  };

  const handleIconClick = (title, id, email) => {
    if (title === "email") {
      navigate(`/pipeline/${id}/overview`, {
        state: {
          module: "pipeline",
          type: title,
          email,
        },
      });
      // navigate(`/pipeline/overview/${id}`)
    } else {
      navigate(`/pipeline/${id}/${title}`);
    }
  };

  const srcData = (dt) => {
    const mydata =
      dt?.length > 0 &&
      dt?.map((d, index) => {
        return {
          id: index,
          group_id: d?.group_id,
          title: (
            <>
              <p className="col-title">{d?.group_name}</p>
              <p className="col-heading">
                {d?.group_records?.data?.length}{" "}
                {d?.group_records?.data?.length > 1 ? "Leads" : "Lead"}
              </p>
            </>
          ),
          backgroundColor: "#fff",
          cards: d?.group_records?.data?.map((element, index) => {
            return {
              id: element?.id,
              title: (
                <span
                  className="title ma-board-title"
                  onClick={() => handleNavigate(element?.id)}
                >
                  {element?.attributes?.account_name}
                </span>
              ),
              description: <>{addDescription(element?.attributes)}</>,
            };
          }),
        };
      });

    const newboards = { columns: mydata };
    setBoards(newboards);
  };
  const getData = () => {
    setLoading(true);
    PipelineApi.getAll()
      .then((response) => {
        setLoading(false);
        if (response?.records?.length > 0) {
          let dt = response?.records;
          srcData(dt);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (board_data || get_data) {
      srcData(get_data);
    }
  }, [get_data]);

  const UpdateStage = (id, body, position, updatedBoard) => {
    let data = {
      pipeline_stage_id: parseInt(body),
      position: parseInt(position) + 1,
    };
    PipelineApi.update(data, id)
      .then(function (response) {
        if (response?.data) {
          Toaster.TOAST("Stage changed Successfully", "success");
        } else {
          setBoards(getBoards);
        }
        getData();
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(getBoards, source, destination);
    setBoards(updatedBoard);
    let stage_id;
    let filteredId = updatedBoard?.columns.filter(
      (ele) => ele.id === destination?.toColumnId
    );

    filteredId.filter((ele) => {
      stage_id = ele.group_id;
      return stage_id;
    });

    UpdateStage(_card?.id, stage_id, destination.toPosition, updatedBoard);
  }

  return getBoards.columns ? (
    <Board onCardDragEnd={handleCardMove} disableColumnDrag>
      {getBoards}
    </Board>
  ) : (
    <>{loading ? <CircularLoader /> : ""}</>
  );
};
export default CreateBoard;
