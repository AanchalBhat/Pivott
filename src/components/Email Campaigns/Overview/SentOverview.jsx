import React from "react";
import OverviewTabs from "../../../pages/EmailCampaigns/OverviewTabs";
import Box from "@mui/material/Box";
import Sent from "./OverviewComponent/Sent";

const SentOverview = ({ overviewData, status, loader,getCampaignOverviewData}) => {
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        <OverviewTabs showTabs={true} overviewData={overviewData} getCampaignOverviewData={getCampaignOverviewData}/>
        <Sent overviewData={overviewData} status={status} loader={loader}/>
      </Box>
    </>
  );
};
export default SentOverview;
