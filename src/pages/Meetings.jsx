import { Box } from "@mui/material";
import OverviewChild from "./OverviewComponent";
import { lazy, Suspense } from "react";
import { lazyRetry, renderLazyLoader } from "../utils/chunkHandle";
const LeadMeetings = lazy(() =>
  lazyRetry(() => import("../components/Leads/Meetings/Meetings"), "meetings")
);

const Meetings = ({ type }) => {
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        <OverviewChild type={type} />
        <Suspense fallback={renderLazyLoader()}>
          <LeadMeetings type={type} />
        </Suspense>
      </Box>
    </>
  );
};

export default Meetings;
