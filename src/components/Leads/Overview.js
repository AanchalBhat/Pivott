import React, { useState, useEffect, useContext } from "react";
//mui
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "./Overview.css";
import { useParams } from "react-router-dom";
import LeadsOverview from "../../pages/Leads/Overview";
import { LeadAPI } from "../../apis/LeadApi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar } from "@mui/material";
import { DataContext } from "../../context";
// import global css
import "../../styles/global/common.css";
import { WEBSITE_REGEX } from "../../utils/regexLists";
import { CircularLoader } from "../../pages/common/CircularLoader";
import { Toaster } from "../../pages/common/Toaster";
import { getMethodError } from "../../constants/errorMessages";
import { INVALID_ID_DATA } from "../../utils/constants";
import IncorrectId from "../NotFound/IncorrectId";

const LeadOverview = () => {
  const params = useParams();
  const [LeadUserData, setUsers] = useState([]);
  const { setOverviewHeaderData } = useContext(DataContext);
  const [loader, setLoader] = useState(true);
  const [Invalid_data, setInvalidData] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
    getData();
  }, []);
  const getData = () => {
    // setLoader(true);
    LeadAPI.getByid(params?.id)
      .then((res) => {
        setLoader(false);
        let userdata = res?.data?.attributes;
        const header = {
          full_name: userdata?.contact_detail?.full_name,
          sub_head: userdata?.contact_detail?.designation,
          email: userdata?.contact_detail?.email,
        };
        setUsers(userdata);
        setOverviewHeaderData(header);
        localStorage.setItem("useDataPopup", JSON.stringify(res?.data));
      })
      .catch((error) => {
        setLoader(false);
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
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
            <LeadsOverview />
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
                        {LeadUserData?.profile_photo?.url ? (
                          <div className="image_container Female_image">
                            <img
                              src={LeadUserData?.profile_photo?.url}
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
                            {LeadUserData?.contact_detail?.first_name ||
                            LeadUserData?.contact_detail?.last_name
                              ? LeadUserData?.contact_detail?.first_name +
                                " " +
                                LeadUserData?.contact_detail?.last_name
                              : "N/A"}
                          </h4>
                          <p className="role_text">
                            {LeadUserData?.contact_detail?.designation
                              ? LeadUserData?.contact_detail?.designation
                              : "N/A"}
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
                          {LeadUserData?.lead_owner?.full_name
                            ? LeadUserData?.lead_owner?.full_name
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">First Name</label>
                        <h6 data-testid="first_name" className="field_Text">
                          {LeadUserData?.contact_detail?.first_name
                            ? LeadUserData?.contact_detail?.first_name
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Last Name</label>
                        <h6 data-testid="last_name" className="field_Text">
                          {LeadUserData?.contact_detail?.last_name
                            ? LeadUserData?.contact_detail?.last_name
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Email</label>
                        <h6 data-testid="email" className="field_Text">
                          {LeadUserData?.contact_detail?.email
                            ? LeadUserData?.contact_detail?.email
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Contact</label>
                        <h6 data-testid="phone_number" className="field_Text">
                          {LeadUserData?.contact_detail?.phone_number
                            ? LeadUserData?.contact_detail?.country_code +
                              " " +
                              LeadUserData?.contact_detail?.phone_number
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Company</label>
                        <h6 data-testid="company_name" className="field_Text">
                          {LeadUserData?.contact_detail?.company_name
                            ? LeadUserData?.contact_detail?.company_name
                            : "N/A"}
                        </h6>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <label className="lable_Text">Lead Source</label>
                        <h6 className="field_Text" data-testid="lead_source">
                          {LeadUserData?.lead_source?.name || "N/A"}
                        </h6>

                        <label className="lable_Text">Lead Status</label>
                        <h6 className="field_Text" data-testid="lead_status">
                          {LeadUserData?.status?.name || "N/A"}
                        </h6>

                        <label className="lable_Text">Industry</label>
                        <h6 className="field_Text" data-testid="industry">
                          {LeadUserData?.industry?.name || "N/A"}
                        </h6>
                        <label className="lable_Text">Company Size</label>
                        <h6 data-testid="company_size" className="field_Text">
                          {LeadUserData?.company_size?.name || "N/A"}
                        </h6>
                        <label className="lable_Text">Website</label>
                        <h6 data-testid="website" className="field_Text">
                          {LeadUserData?.website
                            ? handleWebsite(LeadUserData?.website)
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Designation</label>
                        <h6 data-testid="designation" className="field_Text">
                          {LeadUserData?.contact_detail?.designation
                            ? LeadUserData?.contact_detail?.designation
                            : "N/A"}
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
                        {LeadUserData?.lead_address?.street
                          ? LeadUserData?.lead_address?.street
                          : "N/A"}
                      </h6>
                      <label className="lable_Text">State</label>
                      <h6 data-testid="state" className="field_Text">
                        {LeadUserData?.lead_address?.state
                          ? LeadUserData?.lead_address?.state
                          : "N/A"}
                      </h6>
                      <label className="lable_Text">Country</label>
                      <h6 data-testid="country" className="field_Text">
                        {LeadUserData?.lead_address?.country
                          ? LeadUserData?.lead_address?.country
                          : "N/A"}
                      </h6>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <label className="lable_Text">City</label>
                      <h6 data-testid="city" className="field_Text">
                        {LeadUserData?.lead_address?.city
                          ? LeadUserData?.lead_address?.city
                          : "N/A"}
                      </h6>
                      <label className="lable_Text">Zip Code</label>
                      <h6 data-testid="zip_code" className="field_Text">
                        {LeadUserData?.lead_address?.zip_code
                          ? LeadUserData?.lead_address?.zip_code
                          : "N/A"}
                      </h6>
                    </Grid>

                    <Grid item xs={12} md={10} style={{ marginTop: "5px" }}>
                      <label className="lable_Text">Description</label>
                      <p data-testid="description" className="paragraph_Text">
                        {LeadUserData?.description
                          ? LeadUserData?.description
                          : "N/A"}
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

export default LeadOverview;
