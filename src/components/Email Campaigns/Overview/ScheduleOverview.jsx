import Box from "@mui/material/Box";
import OverviewTabs from "../../../pages/EmailCampaigns/OverviewTabs";
import Scheduled from "./OverviewComponent/Scheduled";

const ScheduleOverview = ({overviewData,loader,getCampaignOverviewData}) => {
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        <OverviewTabs showTabs={true} overviewData={overviewData} getCampaignOverviewData={getCampaignOverviewData}/>
        <Scheduled overviewData={overviewData} loader={loader}/>
      </Box>
    </>
  );
};
export default ScheduleOverview;
