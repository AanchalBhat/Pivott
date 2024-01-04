import React, { useContext, useState, useEffect } from "react";
import RolesPermissions from "./RolesPermissions";
import { Stack, Avatar, FormControlLabel } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import IconTooltip from "../../pages/common/IconTooltip";
import { RolesApi } from "../../apis/RolesApi";
import { Toaster } from "../common/Toaster";
import { restMethodError } from "../../constants/errorMessages";
import { returnSubstring } from "../../utils";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    background: "#2c42b5",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
    background: "white",
  },
  "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
    background: "#2c42b5 !important",
    opacity: "2 !important",
  },
}));

let isValue = false;
let isDeactivate = false;
export default function ManageUsers(props) {
  // ROLES ND PERMISSIONS
  const rolesPermissionsHeadCells = [
    {
      field: "full_name",
      headerName: "Name",
      sortable: true,
      width: 390,
      renderCell: (cellValues) => {
        let userName =
          cellValues?.row?.attributes?.full_name &&
          cellValues?.row?.attributes?.full_name !== " "
            ? cellValues?.row?.attributes?.full_name
            : "N/A";
        return (
          <>
            <Stack
              direction="row"
              spacing={2}
              onClick={() =>
                handleRowClick(
                  cellValues?.row?.id,
                  cellValues?.row?.attributes?.email,
                  userName,
                  cellValues?.row?.attributes?.role?.name
                )
              }
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {cellValues?.row?.attributes?.profile_photo?.url && (
                <Avatar
                  sx={{ width: "42px", height: "42px" }}
                  alt="Remy Sharp"
                  src={cellValues?.row?.attributes?.profile_photo?.url}
                />
              )}
              {!cellValues?.row?.attributes?.profile_photo?.url && (
                <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
                  {" "}
                  <AccountCircleIcon />{" "}
                </Avatar>
              )}
              <div
                className="ma-nameTable-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "7px",
                }}
              >
                <IconTooltip title={userName} />
                <span className="ma-userPost-table">
                  {returnSubstring(cellValues.row?.attributes?.designation, 10) || "No Designation"}
                </span>
              </div>
            </Stack>
          </>
        );
      },
    },
    {
      field: "email",
      sortable: true,
      headerName: "Email",
      width: 250,
      renderCell: (params) => {
        return (
          <Stack
            direction="row"
            spacing={2}
            onClick={() => handleRowClick(params?.row?.id)}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <span className="linkStyling">
              {params?.row?.attributes?.email
                ? params?.row?.attributes?.email
                : "N/A"}
            </span>
          </Stack>
        );
      },
    },
    {
      field: "role_id",
      sortable: true,
      headerName: "Role",
      width: 180,
      valueGetter: (params) =>
        `${params?.row?.attributes?.role?.name
          ? params?.row?.attributes?.role?.name
          : "N/A"
        }`,
    },
    {
      field: "designation",
      sortable: true,
      headerName: "Designation",
      width: 180,
      valueGetter: (params) =>
        `${returnSubstring(params?.row?.attributes?.designation, 10) || "No Designation"
        }`,
    },
    {
      field: "disabled",
      sortable: true,
      width: 180,
      headerName: "Status",
      renderCell: (params) => {
        let disabledBtn = !params?.row?.attributes?.disabled;
        return (
          <>
            <Stack
              direction="row"
              spacing={2}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                onClick={() =>
                  params?.row?.id !== login_id &&
                  handleToggleDeactivateUser(
                    params?.row?.id,
                    !params?.row?.attributes?.disabled,
                    params?.row?.attributes?.is_deleted
                  )
                }
                control={
                  <Android12Switch
                    defaultChecked={disabledBtn}
                    disabled={
                      params?.row?.id === login_id ||
                      params?.row?.attributes?.is_deleted
                    }
                  />
                }
              />
            </Stack>
          </>
        );
      },
    },
  ];
  const { setGlobalHead, setDeactivateUserId, setOverviewHeaderData } =
    useContext(DataContext);
  const [isManageDeactivate, setIsManageDeactivate] = useState(false);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(
    searchParams.get("filter") ? searchParams.get("filter") : "All Users"
  );
  const navigate = useNavigate();
  let login_id = localStorage.getItem("login_id");

  useEffect(() => {
    if (value === "Deleted Users") {
      isValue = true;
    } else {
      isValue = false;
    }
    isDeactivate = value === "Inactive Users" ? true : false;
  }, [value]);

  const createHeader = (email, full_name, sub_head) => {
    const header = {
      full_name,
      sub_head,
      email,
    };
    setOverviewHeaderData(header);
  };

  const handleRowClick = (id, email, full_name, role) => {
    createHeader(email, full_name, role);
    if (!isValue) {
      if (value) {
        navigate(
          `/roles-permissions/manage-users/user-details/${id}?filter=${value}&page=${page}`
        );
      } else {
        navigate(`/roles-permissions/manage-users/user-details/${id}`);
      }
    }
  };

  const handleToggleDeactivateUser = (id, disabled_status, del) => {
    let data = {
      user_ids: [id],
    };
    let value = "";

    if (disabled_status) {
      value = "deactivate_user";
    } else {
      value = "activate_user";
    }
    if (!del) {
      RolesApi.toggleDeactivateUser({ data }, value)
        .then((response) => {
          setDeactivateUserId([]);
          setIsManageDeactivate((prev) => !prev);
          Toaster.TOAST(response?.message, "success");
        })
        .catch((error) => {
          setDeactivateUserId([]);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    }
  };

  useEffect(() => {
    setGlobalHead(rolesPermissionsHeadCells);
  }, []);

  return (
    <div>
      <RolesPermissions
        isManageDeactivate={isManageDeactivate}
        setIsManageDeactivate={setIsManageDeactivate}
        val={value}
        setVal={setValue}
        headCells={rolesPermissionsHeadCells}
        isValue={isValue}
        isDeactivate={isDeactivate}
        setPage={setPage}
        page={page}
      />
    </div>
  );
}
