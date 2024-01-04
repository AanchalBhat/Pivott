import React, { useEffect, useState, useContext } from "react";
import "./PotentialOverview.css";
//mui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DomainAddOutlinedIcon from "@mui/icons-material/DomainAddOutlined";
import { Box, Stack } from "@mui/system";
import { makeStyles } from "@mui/styles";
import OverviewTable from "./OverviewTable";
import { useParams, useNavigate } from "react-router";
import LostPipelinePopup from "../../../Pipeline/Details/PipelineOverview/LostPipeline";
import Moment from "react-moment";
import { PotentialApi } from "../../../../apis/PotentialApi";
import PotentialsOverview from "../../../../pages/Potential/Overview";
import { Toaster } from "../../../../pages/common/Toaster";
import { returnSubstring, waitForElementToExist } from "../../../../utils";
import { DataContext } from "../../../../context";
// import global css
import "../../../../styles/global/common.css";
import DropdownCreateEdit from "../../../../pages/common/Dropdowns_Crud/DropdownCreateEdit";
import DropdownDelete from "../../../../pages/common/Dropdowns_Crud/DropdownDelete";
import { LostLeadApi } from "../../../../apis/LostLeadApi";
import { ButtonLoader } from "../../../../pages/common/ButtonLoader";
import { CircularLoader } from "../../../../pages/common/CircularLoader";
import { getSymbol } from "../../../../utils/currencySymbol";
import {
  deleteMethodError,
  getMethodError,
  restMethodError,
} from "../../../../constants/errorMessages";
import { RECORD_EXIST, INVALID_ID_DATA } from "../../../../utils/constants";
import IncorrectId from "../../../NotFound/IncorrectId";
import { useSearchParams } from "react-router-dom";

const useStyles = makeStyles({
  heading: {
    fontWeight: 500,
    color: "#2C42B5",
    textAlign: "left",
  },
  divideLine: {
    "MuiDivider-root": {},
  },
  alishmagrid: {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "3px",
    color: "#191a47",
  },
  alishmaText: {
    marginRight: "10px",
  },

  rootBtn: { display: "flex", justifyContent: "flex-end" },
  ownerBtn: {
    color: "#191A47 !important",
    fontWeight: 500,
    textAlign: "center",
    textTransform: "capitalize",
    boxShadow: "none !important",
    background: "#f1f1f4 !important",
    "&:hover": {
      background: "#f1f1f4 !important",
    },
  },
  wonBtn: {
    backgroundColor: "#36B37E !important",
    fontWeight: 500,
    boxShadow: "none !important",
    padding: "6px 12px !important",
    "&:hover": {
      background: "#36B37E !important",
    },
  },
  lostBtn: {
    backgroundColor: "#FF5630 !important",
    fontWeight: 500,
    height: "38px",
    boxShadow: "none !important",
    padding: "6px 12px !important",
    "&:hover": {
      backgroundColor: "#FF5630 !important",
    },
  },
  ContactMade: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 0",
  },
});

let field_editLabel = "";
let field_placeholder = "";
let field_addLabel = "";

function PotentialOverview() {
  const classes = useStyles();
  const params = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setOverviewHeaderData, setuserDataCall, crudField } =
    useContext(DataContext);
  const [overviewData, setOverviewData] = useState();
  const [stageData, setStageData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [wonBtnLoader, setWonBtnLoader] = useState(false);
  const [loader, setLoader] = useState(true);
  const [Invalid_data, setInvalidData] = useState(false);

  //dropdown_crud lost lead reason
  const [fieldName, setFieldName] = useState();
  const [fieldID, setFieldID] = useState();
  const [itemValue, setItemValue] = useState("");
  const [fieldErrMsg, setFieldErrMsg] = useState("");
  const [isEditModal, setIsEditModal] = useState(false);
  const [show, setShow] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [reason_id, setReasonId] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const role_name = userInfo?.role?.role_name;
  const userId = overviewData?.potential_owner?.id;
  const [disabled, setDisabled] = useState(false);
  // const current_page = localStorage.getItem("current_page");

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const LostToggle = () => {
    setOpenModal(!openModal);
  };

  const getStageData = () => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    PotentialApi.getStageData(id?.company_id)
      .then(function (response) {
        if (response?.data?.length > 0) {
          setStageData(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const getData = () => {
    // setLoader(true);
    PotentialApi.getDataById(params?.id)
      .then((res) => {
        setLoader(false);
        if (res) {
          const header = {
            full_name: res?.data?.attributes?.contact_detail?.full_name,
            sub_head: res?.data?.attributes?.contact_detail?.designation,
            email: res?.data?.attributes?.contact_detail?.email,
          };
          setOverviewHeaderData(header);
          setOverviewData(res?.data?.attributes);
          localStorage.setItem("useDataPopup", JSON.stringify(res?.data));
        }
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        Toaster.TOAST(getMethodError(error), "error");
        setLoader(false);
        console.log(error);
      });
  };
  const showScrollView = () => {
    waitForElementToExist("#active-tag")
      .then((element) => {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 1);
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
    getStageData();
    showScrollView();
  }, []);

  const handleWon = () => {
    let data = {
      potential_id: params?.id,
    };
    setWonBtnLoader(true);
    PotentialApi.potentialWon(data)
      .then(function (response) {
        navigate(`/deal/create/${response?.deal_id}`);
        Toaster.TOAST(response?.message, "success");

        setWonBtnLoader(false);
      })
      .catch((error) => {
        setWonBtnLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  // useEffect(() => {
  //   const id = JSON.parse(localStorage.getItem("user_info"));
  //   PotentialApi.getType(id?.company_id)

  //     .then((response) => {})
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // lost lead reason crud

  useEffect(() => {
    handleFields();
  }, [crudField]);

  useEffect(() => {
    setItemValue(fieldName?.attributes?.name);
  }, [fieldName]);

  let deleteContent = {
    Name: fieldID?.attributes?.name,
    EditLabel: field_editLabel,
    ModuleName: "potential",
  };

  const handleFields = () => {
    if (crudField === "lost_lead") {
      field_editLabel = "Lost Lead";
      field_placeholder = "Enter lost lead";
      field_addLabel = "Lost Lead";
    }
  };

  const handleModalClose = () => setShow(false);

  const handleValid = () => {
    if (!itemValue) {
      setFieldErrMsg("Field can't be empty");
    }
  };

  const handleFieldChange = (val) => {
    setItemValue(val);
  };

  const handleShow = (data) => {
    handleDeleteClick(data?.id, false);
    setFieldID(data);
  };

  const handleEditClick = (event, data) => {
    setIsEditModal(!isEditModal);
    setFieldName(data);
  };

  const onAddPopup = (data, id) => {
    if (data === "add_new") {
      setItemValue("");
      setFieldName("");
    }
    setIsEditModal(!isEditModal);
  };

  const handleClosePopup = () => {
    setIsEditModal(!isEditModal);
    setFieldName();
    setFieldErrMsg("");
  };

  const handleDropdownSubmit = () => {
    handleValid();
    let data = {
      data: {
        name: itemValue,
      },
    };

    if (itemValue && !fieldErrMsg) {
      apiCallingEndPoints(data);
    }
  };

  const apiCallingEndPoints = (data) => {
    let apiCall;
    apiCall = fieldName?.id
      ? LostLeadApi.editReason(fieldName.id, data)
      : LostLeadApi.createReason(data);

    handleDropdownsAPI(apiCall);
  };

  const handleDropdownsAPI = (apiCall) => {
    if (!apiCall) return;
    apiCall
      .then((response) => {
        if (response?.data) {
          setIsEditModal(false);
          let successMessage = "";
          successMessage = fieldName?.id
            ? "Reason updated Successfully"
            : "Reason created Successfully";
          if (!fieldName?.id) {
            setReasonId(response?.data?.id);
          }
          Toaster.TOAST(successMessage, "success");
          handleClosePopup();
        }
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleDeleteClick = (id, associatedFlag) => {
    const deleteId = id ? id : fieldID?.id;
    let apiCall = LostLeadApi.deleteReason(deleteId, associatedFlag);
    handleDropdownItemDelete(apiCall);
  };

  const handleDropdownItemDelete = (apiCall) => {
    if (!apiCall) return;
    setDisabled(true);
    apiCall
      .then((res) => {
        Toaster.TOAST(res?.message, "success");
        handleModalClose();
        setIsDelete(!isDelete);
        setReasonId("");
        setDisabled(false);
      })
      .catch((error) => {
        if (error?.response?.data?.code === RECORD_EXIST) {
          setShow(true);
        }
        setDisabled(false);
        Toaster.TOAST(deleteMethodError(error), "error");
        console.log(error);
      });
  };

  const ownerProfileNavigation = () => {
    if (role_name !== "executive" && userId) {
      navigate(`/roles-permissions/manage-users/user-details/${userId}`);
    }
  };

  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        {Invalid_data ? (
          <IncorrectId />
        ) : (
          <div>
            <Paper elevation={2} className="ma-paper-shadow">
              <PotentialsOverview />
              {loader ? (
                <CircularLoader />
              ) : (
                <div className="pipeline-overview-block">
                  <Typography
                    data-testid="acc-name"
                    variant="h5"
                    component="h4"
                    className={classes.heading}
                  >
                    {overviewData?.account_name}
                  </Typography>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {openModal && (
                      <LostPipelinePopup
                        setOpenModal={setOpenModal}
                        type={"Potential"}
                        id={params?.id}
                        openModal={isEditModal}
                        addNew={"REASON"}
                        onAddDetail={onAddPopup}
                        handleEditClick={handleEditClick}
                        handleShow={handleShow}
                        isDelete={isDelete}
                        fieldName={fieldName}
                        setReasonId={setReasonId}
                        reason_id={reason_id}
                      />
                    )}
                    <Grid item xs={6}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography
                          data-testid="amount"
                          variant="h6"
                          className="ma-userName-name"
                        >
                          {overviewData?.amount
                            ? getSymbol(overviewData.currency?.code)
                            : ""}
                          {overviewData?.amount ? overviewData?.amount : "N/A"}
                        </Typography>
                        <Divider
                          orientation="vertical"
                          flexItem
                          className="ma-divider"
                        />
                        <Typography
                          variant="h6"
                          data-testid="user"
                          className="ma-userName-name"
                        >
                          <AccountCircleOutlinedIcon
                            className={classes.alishmaText}
                          />
                          {overviewData?.contact_detail?.first_name &&
                          overviewData?.contact_detail?.last_name
                            ? overviewData?.contact_detail?.first_name +
                              " " +
                              overviewData?.contact_detail?.last_name
                            : "N/A"}{" "}
                        </Typography>
                        <Divider
                          orientation="vertical"
                          flexItem
                          className="ma-divider"
                        />
                        <Typography
                          data-testid="contact"
                          variant="h6"
                          className="ma-userName-name"
                        >
                          <DomainAddOutlinedIcon
                            className={classes.alishmaText}
                          />
                          {overviewData?.contact_detail?.designation || "No Designation"}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} className={classes.rootBtn}>
                      <Stack
                        direction="row"
                        spacing={2}
                        className="ma-userPipline-btn"
                      >
                        <Button
                          data-testid="owner-btn"
                          variant="contained"
                          startIcon={<AccountCircleIcon />}
                          className={classes.ownerBtn}
                          sx={{
                            pointerEvents:
                              role_name !== "executive" ? "auto" : "none",
                          }}
                          onClick={() => ownerProfileNavigation()}
                        >
                          Owner |{" "}
                          {overviewData?.potential_owner?.full_name
                            ? overviewData?.potential_owner?.full_name
                            : "N/A"}
                        </Button>
                        <ButtonLoader
                          loading={wonBtnLoader}
                          classStyle={classes.wonBtn}
                          handleClick={() => handleWon()}
                          testid={"won-btn"}
                          title={"WON"}
                        />
                        <Button
                          variant="contained"
                          data-testid="lost-btn"
                          onClick={() => LostToggle()}
                          className={classes.lostBtn}
                        >
                          LOST
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>

                  <div className="ma-breadcrumb ma-flat-step">
                    {stageData.map((item, index) => (
                      <>
                        {overviewData?.potential_stage?.name ===
                        item?.attributes?.name ? (
                          <a href="#" id="active-tag" className="active">
                            {item?.attributes?.name}
                          </a>
                        ) : (
                          <a href="#">{item?.attributes?.name}</a>
                        )}
                      </>
                    ))}
                  </div>

                  <Box className={classes.ContactMade}>
                    <Typography>
                      Contact made |{" "}
                      <Moment format="MMMM Do YYYY">
                        {overviewData?.created_at}
                      </Moment>
                    </Typography>
                    <Typography className="ma-closing-on">
                      {"Closing on | "}
                      {overviewData?.lost_on ? (
                        <Moment format="MMMM Do YYYY">
                          {overviewData?.lost_on}
                        </Moment>
                      ) : (
                        "N/A"
                      )}
                    </Typography>
                  </Box>
                  <hr className="horizontal" />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 500 }}>
                      Contact Person
                    </Typography>
                    <Grid container spacing={3} mt={2}>
                      <Grid item xs={1}>
                        {overviewData?.lead_details?.data?.attributes
                          ?.profile_photo?.url ? (
                          <Avatar
                            src={
                              overviewData?.lead_details?.data?.attributes
                                ?.profile_photo?.url
                            }
                            sx={{ width: 56, height: 56, marginBottom: "10px" }}
                          />
                        ) : (
                          <Avatar
                            alt="Remy Sharp"
                            src={<AccountCircleIcon />}
                            sx={{ width: 56, height: 56, marginBottom: "10px" }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={3}>
                        <Typography
                          variant="subtitle1"
                          className="ma-firstName-user"
                        >
                          {overviewData?.contact_detail?.first_name}{" "}
                          {overviewData?.contact_detail?.last_name}
                        </Typography>
                        <Typography variant="subtitle1">
                          at{" "}
                          {overviewData?.account_name
                            ? overviewData?.account_name
                            : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#8C8DA3" }}
                        >
                          Email{" "}
                        </Typography>
                        <Typography variant="subtitle1">
                          {overviewData?.contact_detail?.email
                            ? overviewData?.contact_detail?.email
                            : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#8C8DA3" }}
                        >
                          Contact{" "}
                        </Typography>
                        <Typography variant="subtitle1">
                          {overviewData?.contact_detail?.phone_number
                            ? overviewData?.contact_detail?.country_code +
                              " " +
                              overviewData?.contact_detail?.phone_number
                            : "N/A"}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <hr className="horizontal" />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 500 }}>
                      Other Details
                    </Typography>
                    <Grid container spacing={3} xs={12} md={8}>
                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#8C8DA3" }}
                        >
                          {" "}
                          Account Name
                        </Typography>
                        <Typography variant="subtitle1">
                          {overviewData?.account_name
                            ? overviewData?.account_name
                            : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#8C8DA3" }}
                        >
                          Amount
                        </Typography>
                        <Typography variant="subtitle1">
                          {overviewData?.amount
                            ? getSymbol(overviewData.currency?.code)
                            : ""}{" "}
                          {overviewData?.amount ? overviewData?.amount : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#8C8DA3" }}
                        >
                          Type
                        </Typography>
                        <Typography variant="subtitle1">
                          {overviewData?.stage_type?.id
                            ? overviewData?.stage_type?.name
                            : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#8C8DA3" }}
                        >
                          Description{" "}
                        </Typography>
                        <Typography variant="subtitle1">
                          {overviewData?.description
                            ? overviewData?.description
                            : "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              )}

              <Box className="overView-table">
                <h4 className="history-heading">
                  {!loader && "Stage History"}
                </h4>
                <OverviewTable
                  data={overviewData?.potential_stage_history?.data}
                />
              </Box>
            </Paper>
          </div>
        )}

        {isEditModal && (
          <DropdownCreateEdit
            openModal={isEditModal}
            setOpenModal={setIsEditModal}
            valueName={fieldName}
            editLabel={"Reason"}
            addLabel={"Reason"}
            placeholder={"Enter reason"}
            handleSubmit={handleDropdownSubmit}
            itemValue={itemValue}
            handleChange={handleFieldChange}
            errMsg={fieldErrMsg}
            setErrMsg={setFieldErrMsg}
            handleToCloseLT={handleClosePopup}
          />
        )}
        <DropdownDelete
          title={deleteContent}
          content={deleteContent}
          openDelete={show}
          handleClose={handleModalClose}
          handleDelete={handleDeleteClick}
        />
      </Box>
    </>
  );
}

export default PotentialOverview;
