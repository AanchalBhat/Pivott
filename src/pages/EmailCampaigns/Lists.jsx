import { Box } from "@mui/material";
import { lazyRetry,renderLazyLoader } from "../../utils/chunkHandle";
import { lazy, Suspense } from "react";
import ActiveTabs from "./TabLists";
const List = lazy(() =>
  lazyRetry(
    () => import("../../components/Email Campaigns/Lists"),
    "campaign-lists"
  )
);

const Lists = () => {
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
          <ActiveTabs />
          <Suspense fallback={renderLazyLoader()}>
          <List />
        </Suspense>
      </Box>
    </>
  );
};

export default Lists;
