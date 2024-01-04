import React, { useEffect, useState } from "react";
//mui
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import "./Details.css";
import { useLocation, useParams } from "react-router-dom";
import { PipelineApi } from "../../apis/pipelineApi";
import { PotentialApi } from "../../apis/PotentialApi";
import { DealsApi } from "../../apis/DealsApi";
import { LostLeadApi } from "../../apis/LostLeadApi";
import "../../components/Leads/Overview.css";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { WEBSITE_REGEX } from "../../utils/regexLists";
import { CircularLoader } from "./CircularLoader";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "./Toaster";
import IncorrectId from "../../components/NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../../utils/constants";

const LeadDetails = ({ type }) => {
  const params = useParams();
  const leadId = params?.id;
  const location = useLocation();
  const splitLocation = location?.pathname.split("/");

  const [users, setUsers] = useState();
  const [imgData, setImgData] = useState();
  const [loader, setLoader] = useState(true);
  const [Invalid_data, setInvalidData] = useState(false);
  useEffect(() => {
    // setLoader(true)
    if (splitLocation[1] === "pipeline" && splitLocation[3] === "lead-detail") {
      PipelineApi.getDataById(leadId)
        .then((resp) => {
          setLoader(false);
          if (resp) {
            setUsers(resp?.data?.attributes);
            setImgData(
              resp?.data?.attributes?.lead_details?.data?.attributes
                ?.profile_photo?.url
            );
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
    } else if (
      splitLocation[1] === "potential" &&
      splitLocation[3] === "lead-detail"
    ) {
      PotentialApi.getDataById(leadId)
        .then((resp) => {
          setLoader(false);
          if (resp) {
            setUsers(resp?.data?.attributes);
            setImgData(
              resp?.data?.attributes?.lead_details?.data?.attributes
                ?.profile_photo?.url
            );
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
    } else if (
      splitLocation[1] === "deal" &&
      splitLocation[3] === "lead-detail"
    ) {
      DealsApi.getDataById(leadId)
        .then((resp) => {
          setLoader(false);
          if (resp) {
            setUsers(resp?.data?.attributes);
            setImgData(
              resp?.data?.attributes?.lead_details?.data?.attributes
                ?.profile_photo?.url
            );
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
    } else if (
      splitLocation[1] === "lost-lead" &&
      splitLocation[3] === "lead-detail"
    ) {
      LostLeadApi.fetchOverview(params?.id)
        .then((resp) => {
          setLoader(false);
          if (resp) {
            setUsers(resp?.data?.attributes);
            setImgData(
              resp?.data?.attributes?.lead_details?.data?.attributes
                ?.profile_photo?.url
            );
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
    }
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

  return Invalid_data ? (
    <IncorrectId />
  ) : (
    <>
      <Paper elevation={2} className="ma-paper-shadow pb-3">
        {loader ? (
          <CircularLoader />
        ) : (
          <>
            <div>
              <div>
                <h1 className="details_Text">Details</h1>
              </div>
              <div>
                <div className="text_container">
                  {!imgData && (
                    <div className="image_container account_profile Female_image">
                      <Avatar alt="Remy Sharp">
                        {" "}
                        <AccountCircleIcon />{" "}
                      </Avatar>
                    </div>
                  )}
                  {imgData && (
                    <div className="image_container Female_image">
                      <img src={imgData} alt="file" />
                    </div>
                  )}
                  <div className="profile_Text">
                    <h4 className="alishasam_Text">
                      {users?.contact_detail?.first_name &&
                      users?.contact_detail?.last_name
                        ? users?.contact_detail?.first_name +
                          " " +
                          users?.contact_detail?.last_name
                        : "N/A"}{" "}
                    </h4>
                    <h6 className="hrmanager_Text">
                      {users?.contact_detail?.designation || "No Designation"}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <label className="lable_Text">Lead Owner</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.lead_owner
                      ?.full_name
                      ? users?.lead_details?.data?.attributes?.lead_owner
                          ?.full_name
                      : "N/A"}
                  </h6>
                  <label className="lable_Text">Company Size</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.company_size
                      ?.name || "N/A"}
                  </h6>
                  <label className="lable_Text">Website</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.website
                      ? handleWebsite(
                          users?.lead_details?.data?.attributes?.website
                        )
                      : "N/A"}
                  </h6>
                </Grid>
                <Grid item xs={12} md={4}>
                  <label className="lable_Text">Lead Source</label>
                  {users?.lead_details?.data?.attributes?.lead_source?.id ? (
                    <h6 className="field_Text">
                      {users?.lead_details?.data?.attributes?.lead_source?.name}
                    </h6>
                  ) : (
                    <h6 className="field_Text">{"N/A"}</h6>
                  )}
                  <label className="lable_Text">Lead Status</label>
                  {users?.lead_details?.data?.attributes?.status?.id ? (
                    <h6 className="field_Text">
                      {users?.lead_details?.data?.attributes?.status?.name}
                    </h6>
                  ) : (
                    <h6 className="field_Text">{"N/A"}</h6>
                  )}
                  <label className="lable_Text">Industry</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.industry?.name ||
                      "N/A"}
                  </h6>
                </Grid>
              </Grid>
            </Box>
            <div>
              <h4 className="address_Text">Address</h4>
            </div>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <label className="lable_Text">Street</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.lead_address?.street
                      ? users?.lead_details?.data?.attributes?.lead_address
                          ?.street
                      : "N/A"}
                  </h6>
                  <label className="lable_Text">Country</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.lead_address
                      ?.country
                      ? users?.lead_details?.data?.attributes?.lead_address
                          ?.country
                      : "N/A"}
                  </h6>
                  <label className="lable_Text">City</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.lead_address?.city
                      ? users?.lead_details?.data?.attributes?.lead_address
                          ?.city
                      : "N/A"}
                  </h6>
                </Grid>
                <Grid item xs={12} md={4}>
                  <label className="lable_Text">Zip Code</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.lead_address
                      ?.zip_code
                      ? users?.lead_details?.data?.attributes?.lead_address
                          ?.zip_code
                      : "N/A"}
                  </h6>
                  <label className="lable_Text">State</label>
                  <h6 className="field_Text">
                    {users?.lead_details?.data?.attributes?.lead_address?.state
                      ? users?.lead_details?.data?.attributes?.lead_address
                          ?.state
                      : "N/A"}
                  </h6>
                </Grid>
                <Grid item xs={12} md={10} style={{ marginTop: "5px" }}>
                  <label className="lable_Text">Description</label>
                  <p className="paragraph_Text">
                    {users?.lead_details?.data?.attributes?.description
                      ? users?.lead_details?.data?.attributes?.description
                      : "N/A"}
                  </p>
                </Grid>
              </Grid>
            </Box>
            <div>
              <h4 className="address_Text">Contact Details</h4>
            </div>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <label className="lable_Text">First Name</label>
                  <h6 className="field_Text">
                    {users?.contact_detail?.first_name
                      ? users?.contact_detail?.first_name
                      : "N/A"}
                  </h6>
                  <label className="lable_Text">Email</label>
                  <h6 className="field_Text">
                    {users?.contact_detail?.email
                      ? users?.contact_detail?.email
                      : "N/A"}
                  </h6>
                  <label className="lable_Text">Company</label>
                  <h6 className="field_Text">
                    {users?.contact_detail?.company_name
                      ? users?.contact_detail?.company_name
                      : "N/A"}
                  </h6>
                </Grid>
                <Grid item xs={12} md={4}>
                  <label className="lable_Text">Last Name</label>
                  <h6 className="field_Text">
                    {users?.contact_detail?.last_name
                      ? users?.contact_detail?.last_name
                      : "N/A"}
                  </h6>
                  <label className="lable_Text">Designation</label>
                  <h6 className="field_Text">
                    {users?.contact_detail?.designation || "No Designation"}
                  </h6>
                  <label className="lable_Text">Contact</label>
                  <h6 className="field_Text">
                    {users?.contact_detail?.phone_number
                      ? users?.contact_detail?.country_code +
                        " " +
                        users?.contact_detail?.phone_number
                      : "N/A"}
                  </h6>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Paper>
    </>
  );
};

export default LeadDetails;
