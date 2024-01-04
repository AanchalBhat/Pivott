import React, { useContext, useEffect, useState } from "react";
import UserOverview from "./UserOverview";
import { useOutletContext, useSearchParams } from "react-router-dom";

//mui
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import DeletePopup from "../common/DeletePopup";
import { userApi } from "../../apis/userApi";
import { RolesApi } from "../../apis/RolesApi";
import { DeleteUsers } from "../../apis/PersonalApi";
import { Toaster } from "../common/Toaster";
// importing global css
import "../../styles/global/common.css";
import "../../components/Leads/Overview.css";
import { DataContext } from "../../context";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ButtonLoader } from "../common/ButtonLoader";
import { CircularLoader } from "../common/CircularLoader";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import IncorrectId from "../../components/NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../../utils/constants";

export default function UserDetails() {
  const [
    navigationData,

    setDrawerData,
    setOpen,
    profileNavigationData,
    setIsProfileDrawer,
    deactivateUserId,

    setDeactivateUserId,
  ] = useOutletContext();
  const { overviewHeaderData, setOverviewHeaderData } = useContext(DataContext);
  const params = useParams();
  const [Invalid_data, setInvalidData] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [imgData, setImgData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteId, setdeleteId] = useState([]);
  const [searchParams] = useSearchParams();
  let login_id = localStorage.getItem("login_id");
  const handleClose = () => {
    setOpenDelete(false);
  };

  const userDetailsData = () => {
    // setLoader(true);
    userApi
      .getUser(params?.id)
      .then((res) => {
        setLoader(false);
        if (res?.data) {
          setUsers(res?.data?.attributes);
          if (
            !overviewHeaderData ||
            overviewHeaderData?.full_name !== res?.data?.attributes?.full_name
          ) {
            const header = {
              full_name: res?.data?.attributes?.full_name,
              email: res?.data?.attributes?.email,
              sub_head: res?.data?.attributes?.role?.name,
            };
            setOverviewHeaderData(header);
          }
          setImgData(res.data?.attributes?.profile_photo?.url);
        }
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    setOpen(true);
    userDetailsData();
    setDrawerData(profileNavigationData);
    setIsProfileDrawer(true);
  }, []);

  const handleToggleDeactivateUser = (value) => {
    setLoading(true);
    let data = {
      user_ids: [params?.id],
    };
    if (params?.id) {
      RolesApi.toggleDeactivateUser({ data }, value)
        .then((response) => {
          if (response) {
            if (searchParams.get("filter")) {
              navigate(
                `/roles-permissions/manage-users?filter=${searchParams.get(
                  "filter"
                )}&page=${searchParams.get("page")}`
              );
            } else {
              navigate(`/roles-permissions/manage-users`);
            }

            Toaster.TOAST(response?.message, "success");
          } else {
            setDeactivateUserId([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    }
  };

  const handelDeleteButton = (id) => {
    const arr = [];
    arr.push(+id);
    setdeleteId(arr);
    setOpenDelete(true);
  };

  const handleDelete = () => {
    setDeleteLoader(true);
    DeleteUsers(deleteId)
      .then((res) => {
        setDeleteLoader(false);
        if (searchParams.get("filter")) {
          navigate(
            `/roles-permissions/manage-users?filter=${searchParams.get(
              "filter"
            )}&page=${searchParams.get("page")}`
          );
        } else {
          navigate(`/roles-permissions/manage-users`);
        }

        setOpenDelete(false);
      })
      .catch((error) => {
        setDeleteLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Grid container>
          <Box className="ma-mainTop-box ma-overview-main" sx={{ flexGrow: 1 }}>
            {Invalid_data ? (
              <IncorrectId />
            ) : (
              <div>
                <UserOverview user={overviewHeaderData} data={users} />

                <Paper elevation={2} className="ma-paper-shadow">
                  {loader ? (
                    <CircularLoader />
                  ) : (
                    <div>
                      <div className="fieldHolder">
                        <div>
                          <h1 className="details_Text">Details</h1>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="text_container">
                            {!imgData || imgData === null ? (
                              <div className="image_container account_profile Female_image">
                                <Avatar alt="Remy Sharp">
                                  {" "}
                                  <AccountCircleIcon />{" "}
                                </Avatar>
                              </div>
                            ) : (
                              ""
                            )}
                            {imgData && (
                              <div className="image_container Female_image">
                                <img src={users?.profile_photo?.url} alt="image" />
                              </div>
                            )}
                            <div className="profile_Text">
                              <h4 className="alishasam_Text">
                                {users?.first_name && users?.last_name
                                  ? users?.first_name + " " + users?.last_name
                                  : "N/A"}
                              </h4>
                              <p className="role_text">
                                {users?.designation || "No Designation"}
                              </p>
                            </div>
                          </div>
                          <div className="ma-role-userDetail">
                            {users?.disabled ? (
                              <ButtonLoader
                                loading={loading}
                                classStyle={"ma-activate-btn"}
                                title={"Activate User"}
                                handleClick={() =>
                                  handleToggleDeactivateUser("activate_user")
                                }
                              />
                            ) : (
                              <>
                                {params?.id !== login_id && (
                                  <ButtonLoader
                                    loading={loading}
                                    classStyle={"ma-deactive-btn"}
                                    title={"Deactivate User"}
                                    handleClick={() =>
                                      handleToggleDeactivateUser(
                                        "deactivate_user"
                                      )
                                    }
                                  />
                                )}
                              </>
                            )}
                            {params?.id !== login_id && (
                              <Button
                                variant="contained"
                                className="ma-deleteUser-btn"
                                onClick={() => handelDeleteButton(users?.id)}
                              >
                                Delete User
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <label className="lable_Text">First Name</label>
                            <h6 data-testid="first_name" className="field_Text">
                              {users?.first_name ? users?.first_name : "N/A"}
                            </h6>
                            <label className="lable_Text">Phone</label>
                            <h6
                              data-testid="phone_number"
                              className="field_Text"
                            >
                              {users?.phone
                                ? users?.country_code + " " + users?.phone
                                : "N/A"}
                            </h6>
                            <label className="lable_Text">Email</label>
                            <h6 data-testid="email" className="field_Text">
                              {users?.email ? users?.email : "N/A"}
                            </h6>
                            <label className="lable_Text">Role</label>
                            <h6 data-testid="role" className="field_Text">
                              {users?.role?.name ? users?.role?.name : "N/A"}
                            </h6>
                            {users?.role?.role_name !== "superadmin" && (
                              <>
                                <label className="lable_Text">Added By</label>
                                <h6
                                  data-testid="added_by"
                                  className="field_Text"
                                >
                                  {users?.added_by ? users?.added_by : "N/A"}
                                </h6>
                              </>
                            )}
                            <label className="lable_Text">Joined Date</label>
                            <h6
                              data-testid="joined_date"
                              className="field_Text"
                            >
                              {users?.joined_date ? users?.joined_date : "N/A"}
                            </h6>
                            <label className="lable_Text">Time Zone</label>
                            <h6 data-testid="timezone" className="field_Text">
                              {users?.timezone ? users?.timezone : "N/A"}
                            </h6>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <label className="lable_Text">Last Name</label>
                            <h6 data-testid="last_name" className="field_Text">
                              {users?.last_name ? users?.last_name : "N/A"}
                            </h6>
                            <label className="lable_Text">Website</label>
                            <h6 data-testid="website" className="field_Text">
                              {users?.website ? users?.website : "N/A"}
                            </h6>
                            <label className="lable_Text">Date of birth</label>
                            <h6
                              data-testid="date_of_birth"
                              className="field_Text"
                            >
                              {users?.date_of_birth
                                ? users?.date_of_birth
                                : "N/A"}
                            </h6>
                            <label className="lable_Text">Manager</label>
                            <h6 data-testid="manager" className="field_Text">
                              {users?.manager?.full_name
                                ? users?.manager?.full_name
                                : "N/A"}
                            </h6>
                            <label className="lable_Text">Fax</label>
                            <h6 data-testid="fax" className="field_Text">
                              {users?.fax ? users?.fax : "N/A"}
                            </h6>
                            <label className="lable_Text">Mobile</label>
                            <h6
                              data-testid="mobile_number"
                              className="field_Text"
                            >
                              {users?.mobile_number
                                ? users?.country_code +
                                  " " +
                                  users?.mobile_number
                                : "N/A"}
                            </h6>
                          </Grid>
                        </Grid>
                      </div>

                      <Typography variant="subtitle1">
                        <h4
                          data-testid="address_title"
                          className="address_Text"
                        >
                          Address
                        </h4>
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <label className="lable_Text">Street</label>
                          <h6
                            data-testid="street_address"
                            className="field_Text"
                          >
                            {users?.user_address?.street
                              ? users?.user_address?.street
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">Country</label>
                          <h6 data-testid="country" className="field_Text">
                            {users?.user_address?.country
                              ? users?.user_address?.country
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">City</label>
                          <h6 data-testid="city" className="field_Text">
                            {users?.user_address?.city
                              ? users?.user_address?.city
                              : "N/A"}
                          </h6>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <label className="lable_Text">Zip Code</label>
                          <h6 data-testid="zip_code" className="field_Text">
                            {users?.user_address?.zip_code
                              ? users?.user_address?.zip_code
                              : "N/A"}
                          </h6>
                          <label className="lable_Text">State</label>
                          <h6 data-testid="state" className="field_Text">
                            {users?.user_address?.state
                              ? users?.user_address?.state
                              : "N/A"}
                          </h6>
                        </Grid>
                      </Grid>
                      {openDelete && (
                        <DeletePopup
                          title="Delete User?"
                          content={`Are you sure you want to delete ${
                            users?.first_name ? users?.first_name : "N/A"
                          } ${users?.last_name ? users?.last_name : "N/A"}`}
                          openDelete={openDelete}
                          handleClose={handleClose}
                          handleDelete={handleDelete}
                          loading={deleteLoader}
                        />
                      )}
                    </div>
                  )}
                </Paper>
              </div>
            )}
          </Box>
        </Grid>
      </Box>
    </>
  );
}
