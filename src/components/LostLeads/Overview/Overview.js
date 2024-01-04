import React, { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DomainAddOutlinedIcon from "@mui/icons-material/DomainAddOutlined";
import { Box, Stack } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { PipelineApi } from "../../../apis/pipelineApi";
import { PotentialApi } from "../../../apis/PotentialApi";
import { useParams, useNavigate } from "react-router";
import LostPipelinePopup from "../../Pipeline/Details/PipelineOverview/LostPipeline";
import Moment from "react-moment";
import LostOverviewTable from "./OverviewTable";
import { DataContext } from "../../../context";
import LostsOverview from "../../../pages/LostLeads/Overview";
import { LostLeadApi } from "../../../apis/LostLeadApi";
import { waitForElementToExist } from "../../../utils";
import { CircularLoader } from "../../../pages/common/CircularLoader";

//import global css
import "../../../styles/global/common.css";
import "./Overview.css";
import { Toaster } from "../../../pages/common/Toaster";
import { getMethodError } from "../../../constants/errorMessages";
import IncorrectId from "../../NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../../../utils/constants";
import { WEBSITE_REGEX } from "../../../utils/regexLists";

const useStyles = makeStyles({
  heading: {
    fontWeight: 500,
    color: "#2C42B5",
    textAlign: "left",
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
    boxShadow: "none !important",
    textTransform: "capitalize",
    background: "#f1f1f4 !important",
    "&:hover": {
      background: "#f1f1f4 !important",
    },
  },
  ContactMade: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 0",
  },
});

function LostOverview(props) {
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState();
  const { setOverviewHeaderData } = useContext(DataContext);
  const [owner, setOwner] = useState("");
  const [ownerId, setOwnerId] = useState();
  const [stageHistory, setStageHistory] = useState({});
  const [moduleType, setModuleType] = useState("");
  const [stageData, setStageData] = useState([]);
  const [stageType, setStageType] = useState("");
  const [loader, setLoader] = useState(true);
  const [Invalid_data, setInvalidData] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const role_name = userInfo?.role?.role_name;

  const getData = () => {
    // setLoader(true);
    LostLeadApi.fetchOverview(params?.id)
      .then((res) => {
        setLoader(false);
        if (res) {
          const header = {
            full_name: res?.data?.attributes?.contact_detail?.full_name,
            sub_head: res?.data?.attributes?.contact_detail?.designation,
            email: res?.data?.attributes?.contact_detail?.email,
          };
          setOverviewHeaderData(header);
          setUser(res?.data?.attributes);
          setModuleType(res?.data?.type);
        }
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
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
  const getStageData = (type) => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    type
      ?.getStageData(id?.company_id)
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
  useEffect(() => {
    showScrollView();
    !user && getData();
  }, []);

  const handleWebsite = (website) => {
    const url = website?.match(WEBSITE_REGEX) ? website : `https://${website}`;
    return (
      <>
        {website ? (
          <a
            className="ma-tableColumn-website"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {website}
          </a>
        ) : (
          <span>N/A</span>
        )}
      </>
    );
  };
  const LeadOverviewTab = () => {
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
              <LostsOverview />
              {loader ? (
                <CircularLoader />
              ) : (
                <div>
                  <Paper
                    className="ma-shadow-hide"
                    sx={{ boxShadow: "none", borderRadius: "0px" }}
                  >
                    <div className="fieldHolder">
                      <div>
                        <h1 data-testid="overview" className="details_Text">
                          Details
                        </h1>
                      </div>
                      <div>
                        <div className="text_container">
                          {user?.profile_photo?.url ? (
                            <div className="image_container Female_image">
                              <img
                                src={user?.profile_photo?.url}
                                alt="profile"
                              />
                            </div>
                          ) : (
                            <div className="image_container account_profile Female_image">
                              <Avatar alt="Remy Sharp">
                                {" "}
                                <AccountCircleIcon />{" "}
                              </Avatar>
                            </div>
                          )}
                          <div className="profile_Text">
                            <h4 className="alishasam_Text">
                              {user?.contact_detail?.first_name ||
                              user?.contact_detail?.last_name
                                ? user?.contact_detail?.first_name +
                                  " " +
                                  user?.contact_detail?.last_name
                                : "N/A"}
                            </h4>
                            <p className="role_text">
                              {user?.contact_detail?.designation || "No Designation"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <label className="lable_Text">Lead Owner</label>
                          <h6
                            data-testid="lead-owner-name"
                            className="field_Text"
                          >
                            {user?.lead_owner?.full_name
                              ? user?.lead_owner?.full_name
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">First Name</label>
                          <h6 data-testid="first_name" className="field_Text">
                            {user?.contact_detail?.first_name
                              ? user?.contact_detail?.first_name
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">Last Name</label>
                          <h6 data-testid="last_name" className="field_Text">
                            {user?.contact_detail?.last_name
                              ? user?.contact_detail?.last_name
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">Email</label>
                          <h6 data-testid="email" className="field_Text">
                            {user?.contact_detail?.email
                              ? user?.contact_detail?.email
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">Contact</label>
                          <h6 data-testid="phone_number" className="field_Text">
                            {user?.contact_detail?.phone_number
                              ? user?.contact_detail?.country_code +
                                " " +
                                user?.contact_detail?.phone_number
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">Company</label>
                          <h6 data-testid="company_name" className="field_Text">
                            {user?.contact_detail?.company_name
                              ? user?.contact_detail?.company_name
                              : "N/A"}
                          </h6>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <label className="lable_Text">Lead Source</label>
                          <h6 className="field_Text" data-testid="lead_source">
                            {user?.lead_source?.name || "N/A"}
                          </h6>

                          <label className="lable_Text">Lead Status</label>
                          <h6 className="field_Text" data-testid="lead_status">
                            {user?.status?.name || "N/A"}
                          </h6>

                          <label className="lable_Text">Industry</label>
                          <h6 className="field_Text" data-testid="industry">
                            {user?.industry?.name || "N/A"}
                          </h6>
                          <label className="lable_Text">Company Size</label>
                          <h6 data-testid="company_size" className="field_Text">
                            {user?.company_size?.name || "N/A"}
                          </h6>
                          <label className="lable_Text">Website</label>
                          <h6 data-testid="website" className="field_Text">
                            {user?.website
                              ? handleWebsite(user?.website)
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">Designation</label>
                          <h6 data-testid="designation" className="field_Text">
                            {user?.contact_detail?.designation || "No Designation"}
                          </h6>
                        </Grid>
                      </Grid>
                    </div>

                    <div>
                      <h4 data-testid="address_title" className="address_Text">
                        Address
                      </h4>
                    </div>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <label className="lable_Text">Street</label>
                        <h6 data-testid="street_address" className="field_Text">
                          {user?.lead_address?.street
                            ? user?.lead_address?.street
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">State</label>
                        <h6 data-testid="state" className="field_Text">
                          {user?.lead_address?.state
                            ? user?.lead_address?.state
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Country</label>
                        <h6 data-testid="country" className="field_Text">
                          {user?.lead_address?.country
                            ? user?.lead_address?.country
                            : "N/A"}
                        </h6>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <label className="lable_Text">City</label>
                        <h6 data-testid="city" className="field_Text">
                          {user?.lead_address?.city
                            ? user?.lead_address?.city
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Zip Code</label>
                        <h6 data-testid="zip_code" className="field_Text">
                          {user?.lead_address?.zip_code
                            ? user?.lead_address?.zip_code
                            : "N/A"}
                        </h6>
                      </Grid>

                      <Grid item xs={12} md={10} style={{ marginTop: "5px" }}>
                        <label className="lable_Text">Description</label>
                        <p data-testid="description" className="paragraph_Text">
                          {user?.description ? user?.description : "N/A"}
                        </p>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              )}
            </div>
          )}
        </Box>
      </>
    );
  };
  const OtherOverviewTab = () => {
    return (
      <>
        <Box
          component="main"
          className={"ma-mainTop-box ma-overview-main"}
          sx={{ flexGrow: 1 }}
        >
          {Invalid_data ? (
            <IncorrectId />
          ) : (
            <div>
              <LostsOverview />
              {loader ? (
                <CircularLoader />
              ) : (
                <div>
                  <Paper
                    className="ma-shadow-hide"
                    sx={{ boxShadow: "none", borderRadius: "0px" }}
                  >
                    <div className="pipeline-overview-block">
                      <Typography
                        variant="h5"
                        component="h4"
                        className={classes.heading}
                      >
                        {user?.account_name ? user?.account_name : "N/A"}
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
                            type={"Pipeline"}
                            id={params?.id}
                          />
                        )}
                        <Grid item xs={6}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography
                              variant="h6"
                              className="ma-userName-name"
                            >
                              {user?.amount ? `$ ${user?.amount}` : "N/A"}
                            </Typography>
                            <Divider
                              orientation="vertical"
                              flexItem
                              className="ma-divider"
                            />
                            <Typography
                              variant="h6"
                              className="ma-userName-name"
                            >
                              <AccountCircleOutlinedIcon
                                className={classes.alishmaText}
                              />
                              {user?.contact_detail?.first_name &&
                              user?.contact_detail?.last_name
                                ? user?.contact_detail?.first_name +
                                  " " +
                                  user?.contact_detail?.last_name
                                : "N/A"}{" "}
                            </Typography>
                            <Divider
                              orientation="vertical"
                              flexItem
                              className="ma-divider"
                            />
                            <Typography
                              variant="h6"
                              className="ma-userName-name"
                            >
                              <DomainAddOutlinedIcon
                                className={classes.alishmaText}
                              />
                              {user?.contact_detail?.designation || "No Designation"}
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
                              variant="contained"
                              startIcon={<AccountCircleIcon />}
                              className={classes.ownerBtn}
                              onClick={ownerProfileNavigation}
                            >
                              Owner | {owner ? owner : "N/A"}
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                      <div className="ma-breadcrumb ma-flat-step">
                        {stageData &&
                          stageData.map((item, index) => (
                            <>
                              {user[stageType]?.name ===
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
                          {"Contact made | "}
                          <Moment format="MMMM Do YYYY">
                            {user?.created_at ? user?.created_at : "N/A"}
                          </Moment>
                        </Typography>
                        <Typography className="ma-lost-on">
                          {"Lost on | "}
                          {user?.lost_on ? (
                            <Moment format="MMMM Do YYYY">
                              {user?.lost_on}
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
                            {user?.profile_photo?.url ? (
                              <Avatar
                                src={user?.profile_photo?.url}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  marginBottom: "10px",
                                }}
                              />
                            ) : (
                              <Avatar
                                alt="Remy Sharp"
                                src={<AccountCircleIcon />}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  marginBottom: "10px",
                                }}
                              />
                            )}
                          </Grid>
                          <Grid item xs={3}>
                            <Typography
                              variant="subtitle1"
                              className="ma-firstName-user"
                            >
                              {user?.contact_detail?.first_name
                                ? user?.contact_detail?.first_name
                                : "N/A"}{" "}
                              {user?.contact_detail?.last_name
                                ? user?.contact_detail?.last_name
                                : "N/A"}
                            </Typography>
                            <Typography variant="subtitle1">
                              at{" "}
                              {user?.account_name ? user?.account_name : "N/A"}
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
                              {user?.contact_detail?.email
                                ? user?.contact_detail?.email
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
                              {user?.contact_detail?.phone_number
                                ? user?.contact_detail?.country_code +
                                  " " +
                                  user?.contact_detail?.phone_number
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
                              {user?.account_name ? user?.account_name : "N/A"}
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
                              {user?.amount ? `$ ${user?.amount}` : "N/A"}
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
                              {user?.stage_type?.id
                                ? user?.stage_type?.name
                                : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "#8C8DA3" }}
                            >
                              Description{" "}
                            </Typography>
                            <Typography variant="subtitle1">
                              {user?.description ? user?.description : "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </div>
                    <Box className="overView-table">
                      <h4 className="history-heading">Stage History</h4>
                      <LostOverviewTable data={stageHistory} />
                    </Box>
                  </Paper>
                </div>
              )}
            </div>
          )}
        </Box>
      </>
    );
  };
  useEffect(() => {
    switch (moduleType) {
      case "lead":
        setOwner(user?.lead_owner?.full_name);
        setOwnerId(user?.lead_owner?.id);
        break;
      case "pipeline":
        setOwner(user?.pipeline_owner?.full_name);
        setOwnerId(user?.pipeline_owner?.id);
        getStageData(PipelineApi);
        setStageType("pipeline_stage");
        setStageHistory(user?.pipeline_stage_history?.data);
        break;
      case "potential":
        setOwner(user?.potential_owner?.full_name);
        setOwnerId(user?.potential_owner?.id);
        getStageData(PotentialApi);
        setStageType("potential_stage");
        setStageHistory(user?.potential_stage_history?.data);
        break;
      default:
        break;
    }
  }, [moduleType]);

  const ownerProfileNavigation = () => {
    if (role_name !== "executive" && ownerId) {
      navigate(`/roles-permissions/manage-users/user-details/${ownerId}`);
    }
  };

  return (
    <>
      <div>
        {moduleType !== "lead" ? OtherOverviewTab() : LeadOverviewTab()}
      </div>
    </>
  );
}

export default LostOverview;
