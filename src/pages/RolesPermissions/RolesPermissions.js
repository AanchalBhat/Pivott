import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import "./RolesPermissions.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import {
  Drawer,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useOutletContext, useSearchParams } from "react-router-dom";
import AddNewUser from "./AddNewUser";
import Actions from "../common/Actions";
import { activeUserData } from "../../Data/data";
import { DataContext } from "../../context";
import { userApi } from "../../apis/userApi";
import debouce from "lodash.debounce";
import { RolesApi } from "../../apis/RolesApi";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteUsers, profileManageData } from "../../apis/PersonalApi";
import { rolesAndPermission } from "../../Data/ManageDataList";
import ManageData from "../common/ManageData";
import { Toaster } from "../common/Toaster";
import RolesNHierarchy from "./rolesNHierarchy";
import "../../styles/global/common.css";
import { CustomNoRowsOverlay } from "../common/CustomNoRowsOverlay";
import { getMethodError, restMethodError } from "../../constants/errorMessages";

let check = false;
export default function RolesPermissions(props) {
  const navigationDatas = [
    {
      handleClick: () => navigate(`/roles-permissions/manage-users`),
      title: "Manage Users",
      listItemIconTxt: "manage-users",
    },
    {
      handleClick: () => navigate(`/roles-permissions/hierarchy`),

      title: "Roles & Hierarchy",
      listItemIconTxt: "hierarchy",
    },
  ];
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const splitLocation = location?.pathname.split("/");
  const [openAction, setOpenAction] = useState(false);
  const [
    navigationData,
    setDrawerData,
    setOpen,
    profileNavigationData,
    setIsProfileDrawer,
  ] = useOutletContext();
  const [openNewUser, setOpenNewUser] = useState(false);
  const [objCopy, setObjCopy] = useState({
    active_users: true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const {
    deactivateUserId,
    setDeactivateUserId,
    globalHead,
    setGlobalHead,
    globalManageUser,
  } = useContext(DataContext);
  const [srchData, setSrchData] = useState(false);
  const pageSize = 10;
  const [manage, setManage] = useState(false);
  const [manageDisable, setManageDisable] = useState(false);
  const [iconId, seticonId] = useState([]);
  const [leadData, setLeadData] = useState();
  const [itemList, setItemList] = useState(rolesAndPermission);
  const [rowCount, setRowCount] = useState(0);
  const [loader, setLoader] = useState();
  let login_id = localStorage.getItem("login_id");
  const [addNewUserClick, setAddNewUserClick] = useState(false);

  const handlePage = (value) => {
    let data = value + 1;
    props.setPage(data);
    if (searchParams.get("filter")) {
      setSearchParams({ filter: props?.val, page: data });
    } else {
      setSearchParams({ page: data });
    }
  };

  const [userData, setUserData] = useState([]);
  const [manageState, setManageState] = useState({
    company_name: 1,
    email: 1,
    full_name: 1,
    role_id: 1,
    designation: 1,
    disabled: 1,
  });
  const [manageLabel, setManageLabel] = useState({
    company_name: 1,
    email: 1,
    full_name: 1,
    role_id: 1,
    designation: 1,
    disabled: 1,
  });

  const actionsData = [
    {
      id: 1,
      value: "Delete Users",
      title: "Delete Users",
      handleClick: () => handleDeleteUser(),
    },
    {
      id: 2,
      value: "Deactivate Users",
      title: "Deactivate Users",
      handleClick: () => handleToggleDeactivateUser("deactivate_user"),
    },
    {
      id: 3,
      value: "Activate Users",
      title: "Activate Users",
      handleClick: () => handleToggleDeactivateUser("activate_user"),
    },
  ];

  useEffect(() => {
    setDeactivateUserId([]);
    setOpen(true);
    setDrawerData(profileNavigationData);
    setIsProfileDrawer(true);
  }, []);

  useEffect(() => {
    if (searchQuery && srchData) {
      searchApi(searchQuery);
    }
  }, [props.page]);

  function handleclose(obj, index, id) {
    setManageDisable(true);
    setManageState({ ...manageState, [obj.field_name]: id });
    if (id) {
      seticonId((iconId) => iconId.filter((elId) => elId !== obj.id));
    } else {
      seticonId((iconId) => iconId.concat(obj.id));
    }
  }

  const getData = () => {
    Object.keys(JSON.parse(leadData)).forEach(function (key) {
      if (!JSON.parse(leadData)[key]) {
        const array = itemList.filter((i) => key.includes(i.field_name));
        seticonId((iconId) => iconId.concat(array[0]?.id));
      }
    });
  };

  useEffect(() => {
    if (leadData) {
      setManageState(JSON.parse(leadData));
      getData();
    }
  }, [leadData]);

  const handleAddUser = () => {
    setOpenNewUser(true);
  };

  const handleToCloseLT = () => {
    setOpenNewUser(false);
  };

  const toggleDrawerAction = () => {
    setOpenAction(!openAction);
    setManage(false);
    setItemList(rolesAndPermission);
  };

  const debounceSave = React.useCallback(
    debouce(function (e) {
        searchApi(e);
    }, 600),
    []
  );

  const handleSearch = (e) => {
    let data = e.target.value;
    setSearchQuery(data);
    if (props.page === 1) {
      debounceSave(data);
    } else {
      props.setPage(1);
      if (searchParams.get("filter")) {
        setSearchParams({ filter: props.val, page: 1 })
      } else {
        setSearchParams({ page: 1 })
      }
    }
    if (data) {
      setSrchData(true);
    } else {
      setSrchData(false);
    }
  };

  const searchApi = (data) => {
    if (data === "") return;
    let obj = {
      srch: data,
    };
    setObjCopy(obj);
    manageUserApi(obj);
  };

  const handleActive = (value) => {
    let obj = {};

    if (value === "Inactive Users" || value === "Active Users") {
      obj = {
        active_users: value === "Inactive Users" ? false : true,
      };
    } else if (value === "Invited Users") {
      obj = {
        is_invited: true,
      };
    } else if (value === "Deleted Users") {
      obj = {
        deleted_user: true,
      };
    } else if (value === "All Users") {
      obj = {
        all_users: true,
      };
    }
    check = true;
    setObjCopy(obj);
    manageUserApi(obj);
  };

  const manageUserApi = (obj) => {
    let page_count = searchParams.get("page") ? +searchParams.get("page") : props.page
    setLoader(true);
    userApi
      .getManageUsers(obj, page_count, pageSize, check)
      .then((res) => {
        if (res?.data?.length > 0) {
          setLoader(false);
          const attr = res?.data?.map((elem) => {
            return elem;
          });

          setRowCount(res?.meta?.total_records)
          setUserData(attr);
          setManageLabel(res?.manage_data?.field_name);
          setLeadData(JSON.stringify(res?.manage_data?.field_name));
          localStorage.setItem("manage_id", res?.manage_data?.id);
        } else {
          setLoader(false);
          setUserData([]);
          setRowCount(0);
        }
        if (props.page !== 1 && !res?.meta?.next_page && !res?.meta?.previous_page) {
          props.setPage(1);
          setSearchParams({ filter: props.val, page: 1 });
        }
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (manage) {
      handleManages();
    }
  }, [manage]);

  const handleManages = () => {
    userApi
      .getManageUsers(objCopy, props.page, pageSize, check)
      .then(function (response) {
        if (response?.data) {
          setManageLabel(response?.manage_data?.field_name);
          setLeadData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  let filterdata = () => {
    if (manageLabel) {
      Object.keys(manageLabel).forEach(function (key) {
        if (!manageLabel[key]) {
          delete manageLabel[key];
        }
      });
      let arr = Object.keys(manageLabel);
      let data = props?.headCells?.filter((i) => arr.includes(i.field));
      setGlobalHead(data);

      let keyVal = [];
      data.forEach(function (item) {
        keyVal.push(
          item.field,
          "id",
          "full_name",
          "role_id",
          "email",
          "designation",
          "disabled"
        );
      });
      if (keyVal) {
        if (keyVal?.length !== 0) {
          globalManageUser.filter(function (item) {
            var keys = Object.keys(item);
            keys.forEach(function (key) {
              if (!keyVal.includes(key)) {
                delete item[key];
              }
            });
            return true;
          });
        }
      }
    }
  };

  const handleManageSearch = (e) => {
    let value = e.target.value;
    var updatedList = [...rolesAndPermission];
    updatedList = updatedList.filter((item) => {
      return item.data.toLowerCase().indexOf(value) !== -1;
    });
    setItemList(updatedList);
  };

  useEffect(() => {
    filterdata();
  }, [manage, manageLabel]);

  const handleManage = (reset) => {
    let data;
    if (reset) {
      data = {
        operation_type: "set_default",
      };
    } else {
      data = {
        operation_type: "update",
        field_name: manageState,
      };
    }
    const manage_id = localStorage.getItem("manage_id");
    if (manage_id?.length) {
      profileManageData({ data })
        .then((response) => {
          setOpenAction(false);
          setManage(true);
          seticonId([]);
          setItemList(rolesAndPermission);
          setManageDisable(false);
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      Toaster.TOAST("Something went wrong, try reloading!", "error");
    }
  };

  const stateChange = () => {
    return (
      manageState?.email === 1 &&
      manageState?.designation === 1 &&
      manageState?.role_id === 1
    );
  };

  useEffect(() => {

    if (!srchData && (props?.val || props?.isManageDeactivate)) {
      handleActive(
        searchParams.get("filter") ? searchParams.get("filter") : props?.val
      );
    }
    else {
      !srchData && handleActive("All Users");
    }

    if (searchParams.get("page")) {
      props.setPage(+searchParams.get("page"))
    }

  }, [props?.isManageDeactivate, props.page, srchData, props?.val]);

  const handleDeleteUser = () => {
    if (deactivateUserId?.length > 0) {
      DeleteUsers(deactivateUserId)
        .then((response) => {
          setDeactivateUserId([]);
          props?.setIsManageDeactivate((prev) => !prev);
          Toaster.TOAST(response?.message, "success");
        })
        .catch((error) => {
          setDeactivateUserId([]);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      Toaster.TOAST("Please select any entry", "error");
    }
  };

  const handleToggleDeactivateUser = (value) => {
    if (props?.val === "Inactive Users" && value === "deactivate_user") {
      return Toaster.TOAST(
        "Please select an active user to deactivate.",
        "error"
      );
    } else if (props?.val === "Active Users" && value === "activate_user") {
      return Toaster.TOAST("User is already active.", "error");
    }
    let data = {
      user_ids: deactivateUserId,
    };
    if (deactivateUserId?.length > 0) {
      RolesApi.toggleDeactivateUser({ data }, value)
        .then((response) => {
          setDeactivateUserId([]);
          props?.setIsManageDeactivate((prev) => !prev);
          Toaster.TOAST(response?.message, "success");
        })
        .catch((error) => {
          setDeactivateUserId([]);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      Toaster.TOAST("Please select any entry", "error");
    }
  };

  const backNavigation = () => {
    setIsProfileDrawer(false);
    navigate("/dashboard");
    setDrawerData(navigationData);
    setOpen(false);
  };

  const handleFilter = (e) => {
    let data = e.target.value;
    props?.setVal(e.target.value);
    if (data === "All Users") {
      searchParams.delete("filter");
      searchParams.delete("page");
      setSearchParams(searchParams);
      props.setPage(1)
    } else {
      setSearchParams({ filter: data, page: props.page });
    }
    setSearchQuery("");
  }

  return (
    <Box component="main" className="ma-mainTop-box" sx={{ flexGrow: 1 }}>
      <Card
        variant="outlined"
        className="ma-leads-box border-0 overflow-visible"
      >
        <div className="ma-mainShadow-box">
          <div className="tobNavigation ma-overview-heading">
            <div className="border-0">
              <Typography className="createlead-heading p-0 border-0">
                <ArrowBackIcon
                  className="Arrowbtn-mr"
                  onClick={(e) => backNavigation()}
                />
                <span className="roleTxt">Roles and Permissions</span>
              </Typography>
            </div>
            <div>
              <Button
                className="CreateLeadButton"
                onClick={() => handleAddUser()}
              >
                <AddIcon />
                <div className="sendEmailtext">Add New User</div>
              </Button>
            </div>
          </div>
          <CardContent className="p-0 border-0">
            <Box className="ma-overView-tab">
              <Grid container>
                <Grid item xs={4} md={4}>
                  <List className="ma-role-tabbar">
                    {navigationDatas.map((item, id) => {
                      return (
                        <ListItem
                          key={id}
                          className={
                            splitLocation[2] === `${item?.listItemIconTxt}`
                              ? "ma-active-tab"
                              : "ma-deactive-tab"
                          }
                          onClick={() => item.handleClick()}
                          sx={{ cursor: "pointer" }}
                        >
                          <ListItemText primary={item.title} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>
              </Grid>
            </Box>

            <Box className="ma-piplineLost-lead ma-Divider-bar p-0">
              {splitLocation[2] === "manage-users" && (
                <div className="searchFilterDiv">
                  <TextField
                    size="small"
                    className="searchField"
                    name="Search"
                    placeholder="Search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    helperText={<span className="ma-error"></span>}
                  />
                  <div className="ma-convertEdit-bar p-0">
                    <Select
                      labelid="demo-simple-select-autowidth-label"
                      id="demo-select-small"
                      value={
                        searchParams.get("filter")
                          ? searchParams.get("filter")
                          : props?.val
                      }
                      onChange={(e) => handleFilter(e)}
                      className="filterSelect ma-menuFont-family"
                      placeholder="action"
                      displayEmpty
                    >
                      {activeUserData?.map((item, key) => {
                        return (
                          <MenuItem
                            className="ma-menuFont-family"
                            key={item.id}
                            value={item.value}
                          >
                            {item.title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {props?.val !== "Deleted Users" && (
                      <Actions actionsData={actionsData} />
                    )}
                    <Button
                      sx={{ width: 10 }}
                      size="small"
                      className="iconDiv"
                      onClick={toggleDrawerAction}
                    >
                      <span style={{ color: "black" }}>
                        <TuneIcon />
                      </span>
                    </Button>
                    <Drawer
                      anchor={"right"}
                      open={openAction}
                      onClose={toggleDrawerAction}
                    >
                      <ManageData
                        title="By Roles Permissions"
                        toggleDrawerAction={toggleDrawerAction}
                        handleManageSearch={handleManageSearch}
                        handleManage={handleManage}
                        itemList={itemList}
                        handleclose={handleclose}
                        iconId={iconId}
                        stateChange={stateChange}
                        manageDisable={manageDisable}
                      />
                    </Drawer>
                  </div>
                </div>
              )}
            </Box>
            {
              <Box className="ma-main-table" sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                  {splitLocation[2] === "manage-users" ? (
                    <div style={{ height: "700px" }}>
                      <DataGrid
                        sx={{
                          borderLeft: "none",
                          borderRight: "none",
                          color: "#191A47",
                          borderRadius: "0",
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: "600",
                            fontSize: "14px",
                            textTransform: "uppercase",
                          },
                          "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#F9F9FB",
                            cursor: "pointer",
                          },
                          ".MuiDataGrid-iconSeparator": {
                            display: "none",
                          },
                          "& .MuiDataGrid-columnHeader": {
                            border: "1px solid #E8E8ED",
                            borderLeft: "none",
                            borderTop: "none",
                            borderBottom: "none",
                          },
                          "& .MuiDataGrid-columnHeaders": {
                            border: "1px solid #E8E8ED",
                            borderLeft: "none",
                            borderTop: "none",
                            backgroundColor: "#F9F9FB",
                          },
                          "& .MuiDataGrid-columnHeader:nth-last-of-type(1)": {
                            borderRight: "none",
                          },
                        }}
                        disableColumnFilter
                        disableColumnSelector
                        rowHeight={58.50}
                        headerHeight={52}
                        rows={userData}
                        columns={globalHead}
                        pageSize={10}
                        borderRadius={0}
                        rowsPerPageOptions={[10]}
                        checkboxSelection={!props?.isValue ? true : false}
                        isRowSelectable={(params) =>
                          params?.id !== login_id ? true : false
                        }
                        paginationMode="server"
                        rowCount={rowCount}
                        page={props.page - 1}
                        loader={loader}
                        onPageChange={(newPage) => handlePage(newPage)}
                        onSelectionModelChange={(itm) =>
                          setDeactivateUserId(itm)
                        }
                        components={{
                          NoRowsOverlay: () =>
                            CustomNoRowsOverlay(loader, userData, "Users"),
                        }}
                        disableSelectionOnClick
                      />
                    </div>
                  ) : (
                    <RolesNHierarchy addNewUserClick={addNewUserClick} />
                  )}
                </Paper>
              </Box>
            }
          </CardContent>
        </div>
      </Card>
      {openNewUser && (
        <AddNewUser
          openNewUser={openNewUser}
          handleToCloseLT={handleToCloseLT}
          setAddNewUserClick={() => setAddNewUserClick((prev) => !prev)}
        />
      )}
    </Box>
  );
}
