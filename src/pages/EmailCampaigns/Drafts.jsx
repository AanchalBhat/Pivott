import { Box } from "@mui/material";
import { lazyRetry,renderLazyLoader } from "../../utils/chunkHandle";
import { lazy, Suspense } from "react";
import ActiveTabs from "./TabLists";
const DraftList = lazy(() =>
  lazyRetry(
    () => import("../../components/Email Campaigns/DrafEmailCampaign/List"),
    "drafts"
  )
);
const Drafts = () => {
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
          <ActiveTabs />
          <Suspense fallback={renderLazyLoader()}>
          <DraftList />
        </Suspense>
      </Box>
    </>
  );
};

export default Drafts;
