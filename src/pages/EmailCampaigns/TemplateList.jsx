import { Box } from "@mui/material";
import { lazyRetry,renderLazyLoader } from "../../utils/chunkHandle";
import { lazy, Suspense } from "react";
import ActiveTabs from "./TabLists";
const Templates = lazy(() =>
  lazyRetry(() => import("./Templates"), "templates")
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
          <Templates />
        </Suspense>
      </Box>
    </>
  );
};

export default Drafts;
