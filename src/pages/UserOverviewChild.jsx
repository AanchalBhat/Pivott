import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserOverview from "./RolesPermissions/UserOverview";
import UserDetailsEdit from "./RolesPermissions/UserDetails/UserDetailsEdit";
import { userApi } from "../apis/userApi";
import { useParams } from "react-router-dom";
import { getMethodError } from "../constants/errorMessages";
import { Toaster } from "./common/Toaster";
import IncorrectId from "../components/NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../utils/constants";

const UserOverviewChild = () => {
  const [users, setUsers] = useState();
  const [Invalid_data, setInvalidData] = useState(false);
  const params = useParams();

  useEffect(() => {
    userApi
      .getUser(params?.id)
      .then(function (response) {
        if (response?.data) {
          const val = response?.data?.attributes;
          setUsers(val);
        }
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  }, []);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Grid container>
          <Box className="ma-mainTop-box ma-overview-main" sx={{ flexGrow: 1 }}>
            {Invalid_data ? (
              <IncorrectId />
            ) : (
              <>
                <UserOverview user={users} />
                <UserDetailsEdit />
              </>
            )}
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default UserOverviewChild;
