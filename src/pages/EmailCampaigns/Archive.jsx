import { Box } from "@mui/material";
import { lazyRetry, renderLazyLoader } from "../../utils/chunkHandle";
import { lazy, Suspense } from "react";
import ActiveTabs from "./TabLists";
const ArchivedList = lazy(() =>
  lazyRetry(
    () => import("../../components/Email Campaigns/Archived/List"),
    "archive"
  )
);

const Archive = () => {
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        <ActiveTabs />
        <Suspense fallback={renderLazyLoader()}>
          <ArchivedList />
        </Suspense>
      </Box>
    </>
  );
};

export default Archive;
