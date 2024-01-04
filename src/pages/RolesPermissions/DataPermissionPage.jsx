import { Box, Grid } from "@mui/material";
import UserOverview from "./UserOverview";
import { lazy, Suspense } from "react";
import { lazyRetry, renderLazyLoader } from "../../utils/chunkHandle";
import { useLocation } from "react-router-dom";
const DataPermissions = lazy(() =>
  lazyRetry(() => import("./DataPermission"), "dataPermission")
);

const DataPermissionPage = () => {
  const location = useLocation();
  const userData = location?.state?.data;
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Grid container>
          <Box
            component="main"
            className="ma-mainTop-box ma-overview-main"
            sx={{ flexGrow: 1 }}
          >
            {location?.state?.type ? (
              <UserOverview user={userData} />
            ) : (
              <UserOverview />
            )}
            <Suspense fallback={renderLazyLoader()}>
              <DataPermissions />
            </Suspense>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default DataPermissionPage;
