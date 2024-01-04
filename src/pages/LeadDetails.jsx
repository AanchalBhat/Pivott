import { Box } from "@mui/material";
import OverviewChild from "./OverviewComponent";
import { lazy, Suspense } from "react";
import { lazyRetry, renderLazyLoader } from "../utils/chunkHandle";
const LeadDetails = lazy(() =>
  lazyRetry(() => import("./common/Details"), "leadDetails")
);

const LeadDetailsComponent = ({ type }) => {
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        <OverviewChild type={type} />
        <Suspense fallback={renderLazyLoader()}>
          <LeadDetails type={type} />
        </Suspense>
      </Box>
    </>
  );
};

export default LeadDetailsComponent;
