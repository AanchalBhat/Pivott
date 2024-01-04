import { Box } from "@mui/material";
import OverviewChild from "./OverviewComponent";
import { lazy, Suspense } from "react";
import { lazyRetry, renderLazyLoader } from "../utils/chunkHandle";
const LeadCalls = lazy(() =>
  lazyRetry(() => import("../components/Leads/Calls/Calls"), "calls")
);

const Calls = ({ type }) => {
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        <OverviewChild type={type} />
        <Suspense fallback={renderLazyLoader()}>
          <LeadCalls type={type} />
        </Suspense>
      </Box>
    </>
  );
};

export default Calls;
