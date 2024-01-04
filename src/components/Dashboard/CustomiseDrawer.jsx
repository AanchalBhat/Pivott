import React, { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  ListSubheader,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import "./Dashboard.css";
import { ButtonLoader } from "../../pages/common/ButtonLoader";
import { STAGE_TYPE_COUNT, REASON_TYPE_COUNT } from "../../utils";
import Button from "@mui/material/Button";
import { dashboardList } from "../../Data/ManageDataList";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import { LeadAPI } from "../../apis/LeadApi";
import { Toaster } from "../../pages/common/Toaster";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ListItemButton from "@mui/material/ListItemButton";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";

const CustomiseDrawer = ({
  toggleDrawerAction,
  pipelineStageData,
  setManageStateOption,
  manageStateOption,
  setPotentialStage,
  lostLeadReasonData,
  potentialStageData,
  setLostReason,
  openAction,
  pipelinesStage,
  setPipelineStage,
  potentialsStage,
  lostReason,
  getData,
}) => {
  const [loading, setLoading] = useState(false);
  const [iconId, seticonId] = useState([]);

  const handleRadioChange = (value, item) => {
    setManageStateOption((prev) => ({ ...prev, [item]: value }));
  };

  function handleclose(obj, index, id) {
    if (id) {
      seticonId((iconId) => iconId.filter((elId) => elId !== obj.id));
    } else {
      seticonId((iconId) => iconId.concat(obj.id));
    }
  }
  const handleManagePayload = () => {
    let temp = {
      leads: {
        total_leads: 1,
        assigned_leads: manageStateOption?.leads === "assigned_leads" ? 1 : 0,
        added_leads: manageStateOption?.leads === "added_leads" ? 1 : 0,
        untouched_leads: manageStateOption?.leads === "untouched_leads" ? 1 : 0,
      },
      pipelines: {
        total_pipelines: 1,
        assigned_pipelines:
          manageStateOption?.pipelines === "assigned_pipelines" ? 1 : 0,
        pipelines_this_month:
          manageStateOption?.pipelines === "pipelines_this_month" ? 1 : 0,
        stage_type_count: {},
      },
      potentials: {
        total_potentials: 1,
        assigned_potentials:
          manageStateOption?.potentials === "assigned_potentials" ? 1 : 0,
        potentials_this_month:
          manageStateOption?.potentials === "potentials_this_month" ? 1 : 0,
        stage_type_count: {},
      },
      deals: {
        total_deals: 1,
        assigned_deals: manageStateOption?.deals === "assigned_deals" ? 1 : 0,
        /* uncomment when open and close deals feature are discussed */
        // open_deals: manageStateOption?.deals === "open_deals" ? 1 : 0,
        // close_deals: manageStateOption?.deals === "close_deals" ? 1 : 0,
        deals_this_month:
          manageStateOption?.deals === "deals_this_month" ? 1 : 0,
      },
      lost_leads: {
        total_lost_leads: 1,
        assigned_lost_leads:
          manageStateOption?.lost_leads === "assigned_lost_leads" ? 1 : 0,
        lost_leads_this_month:
          manageStateOption?.lost_leads === "lost_leads_this_month" ? 1 : 0,
        reason_type_count: {},
      },
      calls: {
        total_calls: 1,
        upcoming_calls: manageStateOption?.calls === "upcoming_calls" ? 1 : 0,
        calls_this_week: manageStateOption?.calls === "calls_this_week" ? 1 : 0,
      },
    };
    if (manageStateOption?.pipelines === STAGE_TYPE_COUNT) {
      temp.pipelines.stage_type_count[`${pipelinesStage}`] = 1;
    }

    if (manageStateOption?.potentials === STAGE_TYPE_COUNT) {
      temp.potentials.stage_type_count[`${potentialsStage}`] = 1;
    }
    if (manageStateOption?.lost_leads === REASON_TYPE_COUNT) {
      temp.lost_leads.reason_type_count[`${lostReason}`] = 1;
    }

    return temp;
  };
  const handleManage = async () => {
    setLoading(true);
    const temp = await handleManagePayload();
    let data = {
      operation_type: "update",
      field_name: temp,
      manage_data_type: "dashboard",
    };
    const manage_id = localStorage.getItem("manage_id");
    if (manage_id) {
      getManage(data);
    } else {
      setLoading(false);
      toggleDrawerAction();
      seticonId([]);
      Toaster.TOAST("Something went wrong, try reloading!", "error");
    }
  };
  const getManage = (customizeData) => {
    LeadAPI.manageData({ data: customizeData }).then((response) => {
      if (response) {
        toggleDrawerAction();
        seticonId([]);
        getData();
      }
      setLoading(false);
    });
  };
  return (
    <>
      <Drawer
        className="drawerBox"
        PaperProps={{ style: { width: "426px" } }}
        anchor={"right"}
        open={openAction}
        onClose={toggleDrawerAction}
      >
        <div className="ma-manageData-Container ma-db-customize">
          <div className="ma-dashboardMD">
            <h4 data-testid="customize">Customize Dashboard</h4>
            <Button
              className="ma-dashboardClose-btn"
              onClick={toggleDrawerAction}
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="LeadFilter1List">
            <List
              component="nav"
              sx={{ padding: "2px 5px" }}
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  className="ma-side-leads"
                  component="div"
                  id="nested-list-subheader"
                >
                  <div className="leadfilterlistname"> By Widgets </div>
                </ListSubheader>
              }
            ></List>
            <div className="list-container">
              {dashboardList?.map((item, index) => (
                <List key={index} className="item-container">
                  <ListItem disablePadding className="leadMDlist">
                    <ListItemButton
                      onClick={() =>
                        iconId.includes(item.id)
                          ? handleclose(item, index, 1)
                          : handleclose(item, index, 0)
                      }
                    >
                      <DragIndicatorRoundedIcon className="leadMDlisticon" />
                      <ListItemText
                        className="leadMDlistItemText"
                        primary={item.data}
                      />

                      {iconId.includes(item.id) ? (
                        <KeyboardArrowUpIcon className="ma-sideEye-icon" />
                      ) : (
                        <KeyboardArrowDownIcon
                          className="ma-sideEye-icon"
                          id={index}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                  {iconId.includes(item.id) ? (
                    <FormControl className="ma-db-radioGroup-box">
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        sx={{
                          color: "red",
                          "& .MuiSvgIcon-root": {
                            fontSize: 18,
                          },
                        }}
                      >
                        {item.sub_fields?.map((elem, subIndex) => {
                          return (
                            <div style={{ width: "350px" }}>
                              <FormControlLabel
                                key={subIndex}
                                value={elem.value}
                                control={<Radio />}
                                label={elem.field_name}
                                checked={
                                  manageStateOption?.[item?.field_name] ===
                                  elem?.value
                                }
                                onClick={() =>
                                  handleRadioChange(elem.value, item.field_name)
                                }
                              />
                              {item?.field_name === "pipelines" &&
                                elem.value === STAGE_TYPE_COUNT &&
                                manageStateOption?.[item?.field_name] ===
                                  STAGE_TYPE_COUNT && (
                                  <Select
                                    name="stage_type"
                                    size="medium"
                                    id="stahe_type"
                                    sx={{ height: "48px" }}
                                    className="ms-1"
                                    placeholder="stahe_type"
                                    displayEmpty
                                    value={pipelinesStage}
                                    fullWidth
                                    onChange={(e) => {
                                      setPipelineStage(e.target.value);
                                    }}
                                  >
                                    {pipelineStageData?.map((elem) => {
                                      return (
                                        <MenuItem value={elem.id}>
                                          {elem.name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                              {item?.field_name === "potentials" &&
                                elem.value === STAGE_TYPE_COUNT &&
                                manageStateOption?.[item?.field_name] ===
                                  STAGE_TYPE_COUNT && (
                                  <Select
                                    name="stage_type"
                                    size="medium"
                                    id="stahe_type"
                                    sx={{ height: "48px" }}
                                    className="ms-1"
                                    placeholder="stahe_type"
                                    displayEmpty
                                    value={potentialsStage}
                                    fullWidth
                                    onChange={(e) => {
                                      setPotentialStage(e.target.value);
                                    }}
                                  >
                                    {potentialStageData?.map((elem) => {
                                      return (
                                        <MenuItem value={elem.id}>
                                          {elem.name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                              {item?.field_name === "lost_leads" &&
                                elem.value === REASON_TYPE_COUNT &&
                                manageStateOption?.[item?.field_name] ===
                                  REASON_TYPE_COUNT && (
                                  <Select
                                    name="lost_lead_reason"
                                    size="medium"
                                    id="lost_lead_reason"
                                    className="ms-1"
                                    placeholder="lost_lead_reason"
                                    displayEmpty
                                    value={lostReason}
                                    fullWidth
                                    onChange={(e) => {
                                      setLostReason(e.target.value);
                                    }}
                                  >
                                    {lostLeadReasonData?.map((elem) => {
                                      return (
                                        <MenuItem value={elem.id}>
                                          {elem.name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    ""
                  )}
                </List>
              ))}
            </div>
          </div>
          <div className="listMDbutton">
            <ButtonLoader
              loading={loading}
              classStyle={"applay"}
              handleClick={() => handleManage()}
              title={"APPLY"}
            />
            <Button className="cancel" onClick={() => toggleDrawerAction()}>
              {" "}
              <div> CANCEL</div>
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};
export default CustomiseDrawer;
