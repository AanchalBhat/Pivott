import { useState } from "react";
import { Box } from "@mui/material";
import { lazyRetry,renderLazyLoader } from "../../utils/chunkHandle";
import { lazy, Suspense } from "react";
import OverviewTabs from "./OverviewTabs";
const ReceipentsList = lazy(() =>
  lazyRetry(
    () => import("../../components/Email Campaigns/Overview/ReceipentsList"),
    "receipent-list"
  )
);
const Recipients = () => {
  const [recipientListData, setRecipientListData] = useState("");
  return (
    <>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
          <OverviewTabs showTabs={true} setRecipientListData={setRecipientListData} recipientListData={recipientListData} />
          <Suspense fallback={renderLazyLoader()}>
          <ReceipentsList recipientListData={recipientListData} />
        </Suspense>
      </Box>
    </>
  );
};

export default Recipients;
