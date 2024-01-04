import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Grid, Button, Paper } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import { listData, radioBtnData } from "../../Data/data";
import { RolesApi } from "../../apis/RolesApi";
import { Toaster } from "../common/Toaster";
// import global css
import "../../styles/global/common.css";
import "./RolesPermissions.css";
import { CircularLoader } from "../common/CircularLoader";
import { ButtonLoader } from "../common/ButtonLoader";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import IncorrectId from "../../components/NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../../utils/constants";

export default function DataPermission() {
  const params = useParams();
  const login_user_id = localStorage.getItem("login_id");
  const [clickRadioBtn, setClickRadioBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [permission, setPermission] = useState();
  const [Invalid_data, setInvalidData] = useState(false);
  const [copySelectedVal, setCopySelectedVal] = useState({
    leads: "",
    pipelines: "",
    potentials: "",
    deals: "",
    lost_leads: "",
    reports: "",
  });

  const [initialVal, setInitialVal] = useState({
    leads: "",
    pipelines: "",
    potentials: "",
    deals: "",
    lost_leads: "",
    reports: "",
  });
  const [selectedData, setSelectedData] = useState({});
  const [
    navigationData,
    setDrawerData,
    setOpen,
    profileNavigationData,
    setIsProfileDrawer,
  ] = useOutletContext();

  const handleChange = (e, module) => {
    if (params?.id === login_user_id) {
      return;
    }
    setClickRadioBtn(true);
    setCopySelectedVal((prev) => ({ ...prev, [module]: e.target.value }));
  };

  const getDataPermission = () => {
    // setLoader(true);
    RolesApi.getPermission(params?.id)
      .then((res) => {
        setPermission(res?.data);
        setLoader(false);
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
    if (permission) {
      createPayload();
    }
  }, [copySelectedVal]);

  const createPayload = () => {
    for (let key in copySelectedVal) {
      const temp = func(copySelectedVal[key]);
      setSelectedData((prev) => ({ ...prev, [key]: temp }));
    }
  };

  const func = (val) => {
    switch (val) {
      case "Read Only":
        return {
          is_read: true,
          is_create: false,
          is_update: false,
          is_delete: false,
          is_assign: false,
        };
      case "Read/Create/Edit":
        return {
          is_read: true,
          is_create: true,
          is_update: true,
          is_delete: false,
          is_assign: false,
        };
      case "Read/Create/Edit/Delete":
        return {
          is_read: true,
          is_create: true,
          is_update: true,
          is_delete: true,
          is_assign: false,
        };
      case "Read/Create/Edit/Delete/Assign":
        return {
          is_read: true,
          is_create: true,
          is_update: true,
          is_delete: true,
          is_assign: true,
        };
      default:
        return null;
    }
  };

  const UpdateDataPermission = () => {
    setLoading(true);
    RolesApi.updatePermission(params?.id, {
      data: { permissions: selectedData },
    })
      .then((res) => {
        if (res?.data?.attributes?.permissions) {
          setClickRadioBtn(false);
          Toaster.TOAST("Data Permission Update Successfully", "success");
        } else {
          setClickRadioBtn(false);
          setCopySelectedVal(initialVal);
        }
        setLoading(false);
      })
      .catch((error) => {
        setClickRadioBtn(false);
        setCopySelectedVal(initialVal);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  function accessLabel(is_read, is_create, is_update, is_delete, is_assign) {
    if (is_read && is_create && is_update && is_delete && is_assign) {
      return "Read/Create/Edit/Delete/Assign";
    } else if (is_read && is_create && is_update && is_delete) {
      return "Read/Create/Edit/Delete";
    } else if (is_read && is_create && is_update) {
      return "Read/Create/Edit";
    } else if (is_read) {
      return "Read Only";
    }
  }

  useEffect(() => {
    if (permission) {
      selectRadioButton();
    }
  }, [permission]);

  const selectRadioButton = () => {
    let object1 = permission[0]?.permissions;
    for (let key in object1) {
      const { is_read, is_create, is_update, is_delete, is_assign } =
        object1[key];
      const accessLabel1 = accessLabel(
        is_read,
        is_create,
        is_update,
        is_delete,
        is_assign
      );
      setCopySelectedVal((prev) => ({ ...prev, [key]: accessLabel1 }));
      setInitialVal((prev) => ({ ...prev, [key]: accessLabel1 }));
    }
  };

  useEffect(() => {
    setOpen(true);
    setDrawerData(profileNavigationData);
    setIsProfileDrawer(true);
    getDataPermission();
  }, []);

  const DataPermissionView = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <div className="ma-dataList-box" data-testid="create-note">
          <List
            className="ma-datapemission-list"
            sx={{ padding: !clickRadioBtn ? "0 0 4rem" : "" }}
          >
            {listData &&
              listData?.map((elem, index) => {
                return (
                  <>
                    <ListItem
                      className="ma-dataPermissioninner-list"
                      key={index}
                      disablePadding
                    >
                      <span className="ma-datapermission-box">
                        <ListItemText
                          className="ma-datapermission-title"
                          primary={elem?.name}
                        />
                      </span>

                      <RadioGroup
                        className="ma-listGroup-item"
                        row
                        onChange={(e) => handleChange(e, elem?.value)}
                        value={copySelectedVal[elem?.value]}
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        sx={{
                          "& .Mui-checked .MuiSvgIcon-root:not(.MuiSvgIcon-root ~ .MuiSvgIcon-root)":
                            {
                              stroke: "#2C42B5",
                              strokeWidth: 4,
                            },
                          "& .MuiSvgIcon-root + .MuiSvgIcon-root": {
                            color: "white",
                          },
                        }}
                      >
                        {radioBtnData?.map((item, key) => {
                          return (
                            <FormControlLabel
                              key={key}
                              checked={
                                item?.value === copySelectedVal[elem?.value]
                              }
                              value={item?.value}
                              control={
                                <Radio
                                  disabled={params?.id === login_user_id}
                                />
                              }
                              label={item?.title}
                            />
                          );
                        })}
                      </RadioGroup>
                    </ListItem>
                  </>
                );
              })}
          </List>
          {clickRadioBtn && (
            <Grid
              container
              spacing={2}
              xs={12}
              md={8}
              className="ma-createMain-form"
            >
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <div className="createlead-buttons ma-login-btn">
                  <ButtonLoader
                    loading={loading}
                    classStyle={"createlead-buttons__saveButton savebtntext"}
                    btnType={"submit"}
                    handleClick={() => UpdateDataPermission()}
                    testid={"save"}
                    title={"SAVE"}
                  />
                  <Button
                    data-testid="cancel"
                    className="cancelbtn"
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setClickRadioBtn(false);
                      setCopySelectedVal(initialVal);
                    }}
                  >
                    CANCEL
                  </Button>
                </div>
              </Grid>
            </Grid>
          )}
        </div>
      </Box>
    );
  };
  return Invalid_data ? (
    <IncorrectId />
  ) : (
    <div>
      <Paper>{loader ? <CircularLoader /> : DataPermissionView()}</Paper>
    </div>
  );
}
