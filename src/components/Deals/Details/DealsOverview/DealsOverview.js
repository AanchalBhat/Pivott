import React, { useContext, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import moment from "moment";
import DealsOverview from "../../../../pages/Deals/Overview";
import { DealsApi } from "../../../../apis/DealsApi";
//import global css
import "../../../../styles/global/common.css";
import { DataContext } from "../../../../context";
import { CircularLoader } from "../../../../pages/common/CircularLoader";
import { getSymbol } from "../../../../utils/currencySymbol";
import { getMethodError } from "../../../../constants/errorMessages";
import { Toaster } from "../../../../pages/common/Toaster";
import { INVALID_ID_DATA } from "../../../../utils/constants";
import IncorrectId from "../../../NotFound/IncorrectId";

const DealOverview = () => {
  const [users, setUsers] = useState();
  const { setOverviewHeaderData } = useContext(DataContext);
  const [loader, setLoader] = useState(true);
  const [Invalid_data, setInvalidData] = useState(false);
  const params = useParams();
  const DealId = params?.id;
  const sign_off_timeFormat = users?.sign_off_date;
  const kick_off_timeFormat = users?.kick_off_date;

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    // setLoader(true);
    DealsApi.getDataById(DealId)
      .then((res) => {
        setLoader(false);
        if (res) {
          const header = {
            full_name: res?.data?.attributes?.contact_detail?.full_name,
            sub_head: res?.data?.attributes?.contact_detail?.designation,
            email: res?.data?.attributes?.contact_detail?.email,
          };
          setOverviewHeaderData(header);
          setUsers(res?.data?.attributes);
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
            <DealsOverview />
            {loader ? (
              <CircularLoader />
            ) : (
              <div>
                <Paper elevation={2} className="ma-paper-shadow">
                  <div>
                    <h1 className="details_Text">Details</h1>
                  </div>
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <label className="lable_Text">Deal Owner</label>
                        <h6 className="field_Text" data-testid="deal_owner">
                          {users?.deal_owner?.full_name !== " "
                            ? users?.deal_owner?.full_name
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Deal Name</label>
                        <h6 className="field_Text" data-testid="deal_name">
                          {users?.deal_name ? users?.deal_name : "N/A"}
                        </h6>
                        <label className="lable_Text">Deal Tenure (Week)</label>
                        <h6 className="field_Text" data-testid="tenure">
                          {users?.tenure ? users?.tenure : "N/A"}
                        </h6>
                        <label className="lable_Text">
                          Implementation Kick-off
                        </label>
                        <h6
                          className="field_Text"
                          data-testid="kick_off_timeFormat"
                        >
                          {kick_off_timeFormat
                            ? moment(kick_off_timeFormat)
                                .utc()
                                .format("DD MMM YYYY")
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Deal Terms</label>
                        <h6 className="field_Text" data-testid="deal_terms">
                          {users?.deal_terms ? users?.deal_terms : "N/A"}
                        </h6>
                        <label className="lable_Text">Lead Source</label>
                        <h6 className="field_Text">
                          {users?.lead_source?.name
                            ? users?.lead_source?.name
                            : "N/A"}
                        </h6>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <label className="lable_Text">Deal Value</label>
                        <h6 className="field_Text" data-testid="value">
                          {`${
                            users?.value ? getSymbol(users.currency?.code) : ""
                          }  
      ${users?.value ? users?.value : "N/A"}`}
                        </h6>
                        <label className="lable_Text">Sign Off Date</label>
                        <h6
                          className="field_Text"
                          data-testid="sign_off_timeFormat"
                        >
                          {sign_off_timeFormat
                            ? moment(sign_off_timeFormat)
                                .utc()
                                .format("DD MMM YYYY")
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Payment Mode</label>
                        <h6 className="field_Text" data-testid="payment_terms">
                          {users?.payment_mode?.name
                            ? users?.payment_mode?.name
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Campaign Sources</label>
                        <h6
                          className="field_Text"
                          data-testid="campaign_sources"
                        >
                          {users?.campaign_sources
                            ? users?.campaign_sources
                            : "N/A"}
                        </h6>
                        <label className="lable_Text">Contact Name</label>
                        <h6 className="field_Text" data-testid="contact_name">
                          {users?.contact_detail?.first_name &&
                          users?.contact_detail?.last_name
                            ? users?.contact_detail?.first_name +
                              " " +
                              users?.contact_detail?.last_name
                            : "N/A"}{" "}
                        </h6>
                      </Grid>
                    </Grid>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={10} style={{ marginTop: "5px" }}>
                      <label className="lable_Text" data-testid="description">
                        Description
                      </label>
                      <p className="paragraph_Text">
                        {users?.description ? users?.description : "N/A"}
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

export default DealOverview;
