import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, MenuItem } from "@mui/material";

//mui
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Button from "@mui/material/Button";
import { DashboardApi } from "../../apis/DashboardApi";
import AllLeads from "../../pages/common/DropdownFilter";
import DashboardTable from "./DashboardTable";
import { DataContext } from "../../context";
import "./Dashboard.css";
import { PipelineApi } from "../../apis/pipelineApi";
import { PotentialApi } from "../../apis/PotentialApi";
import { LostLeadApi } from "../../apis/LostLeadApi";
import CustomiseDrawer from "./CustomiseDrawer";
import GraphsSection from "./GraphsSection";
import CardsSection from "./CardsSection";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "../../pages/common/Toaster";

const topLeadData = ["Pipelines", "Potentials", "Deals", "Lost Leads"];
const DashboardComponent = () => {
  const [openAction, setOpenAction] = useState(false);
  const [manageStateOption, setManageStateOption] = useState();
  const [dashboardData, setDashboardData] = useState();
  const [pipelinesStage, setPipelineStage] = useState();
  const [potentialsStage, setPotentialStage] = useState();
  const [lostReason, setLostReason] = useState();
  const [reason, setReason] = useState();
  const [pipelineStageTitle, setPipelineStageTitle] = useState();
  const [potentialStageTitle, setPotentialStageTitle] = useState();
  const [manageState, setManageState] = useState();

  const [topLeads, setTopLeads] = useState("Leads");
  const { setGlobalLeads } = useContext(DataContext);
  const [loader, setLoader] = useState(false);
  const [pipelineStageData, setPipelineStageData] = useState([]);
  const [potentialStageData, setPotentialStageData] = useState([]);
  const [lostLeadReasonData, setLostLeadReasonData] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const companyId = userInfo?.company_id;
  const page = 1;
  const pageSize = 5;

  useEffect(() => {
    getPipelineStages();
    getPotentialStagesData();
    getLostLeadReasonData();
    getData();
    getAllTableData("/leads");
  }, []);
  
  const getPipelineStages = () => {
    PipelineApi.getStageData(companyId)
      .then((res) => {
        if (res?.data) {
          res.data.map((item, index) => {
            if (item.attributes.name === "Other") {
              setPipelineStage(item.id)
            }
            setPipelineStageData((prev) => [
              ...prev,
              { name: item.attributes?.name, id: item.attributes?.id },
            ]);
          });
        }
      })

      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getPotentialStagesData = () => {
    PotentialApi.getStageData(companyId)
      .then((res) => {
        if (res?.data) {
          res.data.map((item, index) => {
            if (item.attributes.name === "Other") {
              setPotentialStage(item.id)
            }
            setPotentialStageData((prev) => [
              ...prev,
              { name: item.attributes?.name, id: item.attributes?.id },
            ]);
          });
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getLostLeadReasonData = () => {
    LostLeadApi.getReasonData(companyId)
      .then((res) => {
        if (res?.data) {
          let data = res.data.map((item, index) => {
            if (item.attributes.name === "Other") {
              setLostReason(item.id)
            }
            return { name: item.attributes?.name, id: item.id };
          });
          setLostLeadReasonData(data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const topLeadFilterData = topLeadData?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem}>
        Recent {elem}
      </MenuItem>
    );
  });

  const getAllTableData = (module) => {
    setLoader(true);
    DashboardApi.getAllTable(module, page, pageSize)
      .then(function (response) {
        if (response?.data) {
          setLoader(false);
          const attr = response?.data?.map((event, key) => {
            return event.attributes;
          });
          setGlobalLeads(attr);
        } else {
          setLoader(false);
          setGlobalLeads([]);
        }
      })
      .catch((error) => {
        setGlobalLeads([]);
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleLeadData = (e) => {
    let val = e.target.value;
    let module;
    setTopLeads(e.target.value);
    if (val === "Pipelines") {
      module = "/pipelines?list_view=true";
    } else if (val === "Potentials") {
      module = "/potentials";
    } else if (val === "Deals") {
      module = "/deals";
    } else if (val === "Lost Leads") {
      module = "/lost_leads";
    } else {
      module = "/leads";
    }
    getAllTableData(module);
  };

  const getData = () => {
    DashboardApi.getAll().then((response) => {
      setDashboardData(response?.data);
      if (response?.data?.pipelines?.stage_type_count) {
        const pipelineStageId = Object.keys(
          response?.data?.pipelines?.stage_type_count
        )[0];
        setPipelineStage(pipelineStageId);
        setPipelineStageTitle(
          () =>
            pipelineStageData.find((item) => item.id == pipelinesStage)?.name
        );
      }
      if (response?.data?.potentials?.stage_type_count) {
        const potentialStageId = Object.keys(
          response?.data?.potentials?.stage_type_count
        )[0];
        setPotentialStage(potentialStageId);
        setPotentialStageTitle(
          () =>
            potentialStageData.find((item) => item.id == potentialStageId)?.name
        );
      }

      if (response?.data?.lost_leads?.reason_type_count) {
        const reasonId = Object.keys(
          response?.data?.lost_leads?.reason_type_count
        )[0];
        setLostReason(reasonId);

        setReason(
          () => lostLeadReasonData.find((item) => item.id == reasonId)?.name
        );
      }
      
      setManageState(response?.manage_data?.field_name);
      localStorage.setItem("manage_id", response?.manage_data?.id);
    }).catch((error) => {
      Toaster.TOAST(getMethodError(error), "error");
      console.log(error)
    })
  };

  const toggleDrawerAction = () => {
    setOpenAction(!openAction);
  };

  return (
    <>
      <Box container className="dashboardContainer">
        <div className="headerContainer">
          <Grid container spacing={3} xs={12} md={12}>
            <Grid xs={2} md={6} item>
              <div className="ma-dashboardTop-bar">
                <h5 data-testid="Welcome">Welcome {userInfo?.full_name}!</h5>
              </div>
            </Grid>
            <Grid item xs={10} md={6}>
              <div className="ma-dashboardTop-bar d-flex justify-content-end">
                <Button
                  data-testid="dashboardCustomize"
                  className="ma-dashboardCustomize-btn"
                  startIcon={<DashboardCustomizeOutlinedIcon />}
                  onClick={toggleDrawerAction}
                >
                  Customize View
                </Button>
                <Button className="d-none">
                  {" "}
                  <MoreHorizOutlinedIcon />{" "}
                </Button>
              </div>
            </Grid>
          </Grid>
          <div>
            <CustomiseDrawer
              toggleDrawerAction={toggleDrawerAction}
              setManageStateOption={setManageStateOption}
              pipelineStageData={pipelineStageData}
              manageStateOption={manageStateOption}
              lostLeadReasonData={lostLeadReasonData}
              potentialStageData={potentialStageData}
              setPotentialStage={setPotentialStage}
              setLostReason={setLostReason}
              openAction={openAction}
              pipelinesStage={pipelinesStage}
              setPipelineStage={setPipelineStage}
              potentialsStage={potentialsStage}
              lostReason={lostReason}
              getData={getData}
            />
          </div>

          {/*  */}
        </div>
        {/* First grid box */}
        <Grid container xs={12} md={12} spacing={3}>
          <CardsSection
            dashboardData={dashboardData}
            manageState={manageState}
            pipelineStageTitle={pipelineStageTitle}
            potentialStageTitle={potentialStageTitle}
            reason={reason}
            pipelineStageData={pipelineStageData}
            potentialStageData={potentialStageData}
            pipelinesStage={pipelinesStage}
            potentialsStage={potentialsStage}
            lostReason={lostReason}
            setPipelineStageTitle={setPipelineStageTitle}
            setPotentialStageTitle={setPotentialStageTitle}
            setManageStateOption={setManageStateOption}
          />
          {/* ....................add new graph.............................. */}

          {/* second section charts */}
          <GraphsSection />
          <Grid xs={12} md={12} item>
            <Box>
              <Card variant="outlined" className="border-0 overflow-visible">
                <div className="tobNavigation ma-overview-heading border-0">
                  <div className="ma-tableLead-heding">
                    <h5>{"Recent 5 " + topLeads}</h5>
                  </div>
                  <div className="leadChildBox ma-db-allLeadContainer m-0 border-0 p-0">
                    <AllLeads
                      title="Recent Leads"
                      allLead={topLeads}
                      handleList={handleLeadData}
                      leadArray={topLeadFilterData}
                      value="Leads"
                    />
                  </div>
                </div>
                <CardContent className="p-0 border-0">
                  <DashboardTable moduleName={topLeads} loader={loader} />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DashboardComponent;
