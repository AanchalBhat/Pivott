import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import StepLabel from "@mui/material/StepLabel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useSearchParams } from "react-router-dom";
import Discard from "../../pages/common/Discard";
import DealReport from "./ReportDetails/DealReport";
import LeadReport from "./ReportDetails/LeadReport";
import PipelineReport from "./ReportDetails/PipelineReport";
import PotentialReport from "./ReportDetails/PotentialReport";
import LostleadReport from "./ReportDetails/LostleadReport";
import CreateFolder from "../../pages/common/CreateFolder";
import FolderAutocomplete from "../../pages/common/FolderAutocomplete";
import { ReportsApi } from "../../apis/ReportsApi";
import { DataContext } from "../../context";
import { useParams } from "react-router-dom";
import { Toaster } from "../../pages/common/Toaster";
import {
  LEAD,
  PIPELINE,
  POTENTIAL,
  DEAL,
  INVALID_ID_DATA,
} from "../../utils/constants";
// import global css
import "../../styles/global/common.css";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import IncorrectId from "../NotFound/IncorrectId";

const primary_moduleArr = [
  { name: "Lead", value: "lead" },
  { name: "Pipeline", value: "pipeline" },
  { name: "Potential", value: "potential" },
  { name: "Deals", value: "deal" },
  { name: "Lost Lead", value: "lost_lead" },
];

const steps = ["Primary Report Module", "Report Details"];

const CreateReports = () => {
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const [discard_open, setDiscard_open] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [primary_module, setPrimary_module] = useState("");
  const [primary_moduleErr, setPrimary_moduleErr] = useState("");
  const [report_name, setReport_name] = useState("");
  const [report_nameErrMsg, setreport_nameErrMsg] = useState("");
  const [description, setDescription] = useState("");
  const [conditions, setConditions] = useState();
  const [originalConditions, setOriginalConditions] = useState();
  const [openLT, setOpenLT] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [reportErrMsg, setReport_ErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  // const current_page = localStorage.getItem("current_page");
  const [report_folderErrMsg, setReportFolderErrMsg] = useState("");
  const {
    reportFolderId,
    setReportFolderId,
    createModuleFields,
    setReportFolderName,
    setCreateModuleFields,
  } = useContext(DataContext);

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const params = useParams();
  const reportId = params?.id;

  useEffect(() => {
    if (reportId) {
      getData();
    } else {
      setCreateModuleFields({});
    }
  }, []);

  const getData = () => {
    ReportsApi.getReportData(reportId)
      .then((response) => {
        const data = response?.report_data?.data?.attributes;
        setPrimary_module(data?.primary_module);
        setReport_name(response?.report_name);
        setReportFolderName(data?.report_folder);
        setReportFolderId(data?.report_folder_id);
        setDescription(data?.description);
        setConditions(data?.conditions);
        setOriginalConditions(data?.original_conditions);
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handlePrimaryModule = (e) => {
    setPrimary_module(e.target.value);
    if (!e.target.value) {
      setPrimary_moduleErr("Please select primary module");
    } else {
      setPrimary_moduleErr("");
    }
  };

  const handleReport = (e) => {
    setReport_name(e.target.value);
    if (!e.target.value) {
      setreport_nameErrMsg("Report name can't be empty");
    } else {
      setreport_nameErrMsg("");
    }
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleToCloseLT = () => {
    setOpenLT(false);
  };

  const handleClick = () => {
    setOpenLT(true);
  };

  const createReport = (data) => {
    ReportsApi.create(data)

      .then(function (response) {
        if (response?.data) {
          navigate(`/reports`);
          Toaster.TOAST("Report Created Successfully", "success");
          resetStates();
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const updateReport = (data) => {
    ReportsApi.update(data, reportId)
      .then(function (response) {
        if (response?.data) {
          navigate(`/reports`);
          Toaster.TOAST("Report Updated Successfully!", "success");
          resetStates();
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };
  const resetStates = () => {
    setPrimary_module("");
    setReportFolderName("");
    setDescription("");
    setReport_name("");
    setCreateModuleFields({});
  };
  const handleValidation = () => {
    if (!primary_module) {
      setPrimary_moduleErr("Please select primary module");
    }
    if (!report_name) {
      setreport_nameErrMsg("Report name can't be empty");
    }
    if (!reportFolderId) {
      setReportFolderErrMsg("Please select report folder");
    }
  };
  const isreportExist = () => {
    let data = {
      name: report_name,
      report_folder_id: reportFolderId,
    };
    //check if report exists
    ReportsApi.isReportExists(data)
      .then((res) => {
        if (!res) {
          setNextStep();
        } else {
          Toaster.TOAST("Report Name Already Taken!", "error");
        }
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };
  const handleNextClick = async () => {
    await handleValidation();
    if (primary_module && reportFolderId && report_name) {
      if (!reportId) {
        isreportExist();
      } else {
        setNextStep();
      }
    }
  };
  const setNextStep = () => {
    setActiveStep((prev) => prev + 1);
    setIsShow(true);
  };
  const handleCreateClick = () => {
    setLoading(true);
    let data = {
      name: report_name,
      report_folder_id: reportFolderId,
      description: description,
      primary_module: primary_module,
      conditions: createModuleFields,
    };

    let flag = false;

    Object.keys(createModuleFields).forEach(function (key) {
      if (createModuleFields[key]) {
        flag = true;
      }
    });
    if (!flag) {
      setReport_ErrMsg("Choose atleast one value to proceed");
      setLoading(false);
    } else if (reportId) {
      updateReport(data);
      setReport_ErrMsg("");
    } else {
      createReport(data);
      setReport_ErrMsg("");
    }
  };

  return (
    <Box className="ma-mainTop-box ma-leads-box" sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1 }} className="mainBox p-0">
        {Invalid_data ? (
          <IncorrectId />
        ) : (
          <Paper elevation={2} className={"ma-mainShadow-box createlead-page"}>
            <Typography className={"createlead-heading"}>
              <ArrowBackIcon
                data-testid="arrow-btn"
                className="Arrowbtn-mr"
                onClick={() => navigate(`/reports`)}
              />
              {reportId ? "Update Report" : "Create Report"}
            </Typography>
            <Grid container sx={{ mt: 4 }}>
              <Grid item xs={12} md={4} sx={{ margin: "auto" }}>
                <Stepper
                  activeStep={activeStep}
                  sx={{
                    ".MuiStepConnector-root": {
                      top: 0,
                    },
                    ".MuiStepConnector-root span": {},
                    ".MuiSvgIcon-root": {
                      borderRadius: "50%",
                      border: "1px solid #1976d2",
                    },
                    ".MuiSvgIcon-root:not(.Mui-completed)": {
                      color: "white",
                    },
                    ".MuiStepIcon-text": {
                      fill: "#1976d2",
                      fontWeight: 500,
                    },
                    ".MuiSvgIcon-root.Mui-active": {
                      color: "#1976d2",
                      padding: "3px",
                      borderRadius: "50%",
                      border: "0",
                    },
                    ".Mui-active .MuiStepIcon-text": {
                      fill: "white",
                    },
                  }}
                  className="ma-stepTop-main"
                >
                  {steps?.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel
                          className="ma-steper-no"
                          color="inherit"
                          {...labelProps}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Grid>
            </Grid>
            {activeStep === 0 && (
              <div style={{ marginTop: "40px" }}>
                <Grid container xs={12} md={4} className="mx-auto">
                  <Grid
                    item
                    xs={12}
                    md={12}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span>Primary Module
                    </label>
                    <TextField
                      data-testid="pm-module"
                      className="createlead-textField placeholder_field"
                      fullWidth
                      select
                      placeholder="Sayyed"
                      name="primary_module"
                      value={primary_module}
                      onChange={(e) => handlePrimaryModule(e)}
                      id="primary_module"
                      helperText={
                        <span className="ma-error">{primary_moduleErr}</span>
                      }
                      label={!primary_module && "Select primary module"}
                      InputLabelProps={{
                        shrink: false,
                        style: {
                          color: "#8c8da3",
                          fontSize: "14px",
                        },
                      }}
                    >
                      {primary_moduleArr?.map((data, key) => {
                        return (
                          <MenuItem key={key} value={data.value}>
                            {data.name}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    className={"createlead-detail-grid"}
                    sx={{ mt: 2 }}
                  >
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span>Report Name
                    </label>
                    <TextField
                      data-testid="report_name"
                      className="createlead-textField placeholder_field"
                      fullWidth
                      placeholder="Enter report name"
                      name="report_name"
                      value={report_name}
                      onChange={(e) => handleReport(e)}
                      id="report_name"
                      inputProps={{ maxLength: 90 }}
                      helperText={
                        <span className="ma-error">{report_nameErrMsg}</span>
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    className={"createlead-detail-grid"}
                    sx={{ mt: 2 }}
                  >
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span>Folder
                    </label>
                    <FolderAutocomplete
                      handleClick={handleClick}
                      isFolder={isFolder}
                      report_folderErrMsg={report_folderErrMsg}
                      setReportFolderErrMsg={setReportFolderErrMsg}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <label className="labeltxt ">Description</label>
                    <TextField
                      data-testid="description"
                      id="manage_data"
                      multiline
                      rows={2}
                      fullWidth
                      value={description}
                      name="manage_data"
                      className="placeholder_field"
                      placeholder="Write some description here"
                      onChange={(e) => handleDescription(e)}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <div className="ma-createMain-form">
                    <div className="createlead-buttons">
                      <Button
                        data-testid="next-btn"
                        className="createlead-buttons__saveButton savebtntext"
                        type="submit"
                        variant="contained"
                        color="info"
                        onClick={() => handleNextClick()}
                        sx={{ mr: 1, minWidth: 150 }}
                      >
                        NEXT
                      </Button>

                      <Button
                        data-testid="cancel-btn"
                        className="cancelbtn"
                        type="button"
                        variant="outlined"
                        onClick={() => setDiscard_open(true)}
                      >
                        CANCEL
                      </Button>
                    </div>
                  </div>
                </Box>
              </div>
            )}
            {activeStep === 1 && isShow && primary_module === LEAD && (
              <LeadReport
                setDiscard_open={setDiscard_open}
                setActiveStep={setActiveStep}
                handleCreateClick={handleCreateClick}
                reportErrMsg={reportErrMsg}
                conditions={conditions}
                original_conditions={originalConditions}
                loading={loading}
              />
            )}
            {activeStep === 1 && isShow && primary_module === PIPELINE && (
              <PipelineReport
                setDiscard_open={setDiscard_open}
                setActiveStep={setActiveStep}
                handleCreateClick={handleCreateClick}
                reportErrMsg={reportErrMsg}
                conditions={conditions}
                original_conditions={originalConditions}
                loading={loading}
              />
            )}
            {activeStep === 1 && isShow && primary_module === POTENTIAL && (
              <PotentialReport
                setDiscard_open={setDiscard_open}
                setActiveStep={setActiveStep}
                handleCreateClick={handleCreateClick}
                reportErrMsg={reportErrMsg}
                conditions={conditions}
                original_conditions={originalConditions}
                loading={loading}
              />
            )}
            {activeStep === 1 && isShow && primary_module === DEAL && (
              <DealReport
                setDiscard_open={setDiscard_open}
                setActiveStep={setActiveStep}
                handleCreateClick={handleCreateClick}
                reportErrMsg={reportErrMsg}
                conditions={conditions}
                original_conditions={originalConditions}
                loading={loading}
              />
            )}
            {activeStep === 1 && isShow && primary_module === "lost_lead" && (
              <LostleadReport
                setDiscard_open={setDiscard_open}
                setActiveStep={setActiveStep}
                handleCreateClick={handleCreateClick}
                reportErrMsg={reportErrMsg}
                conditions={conditions}
                original_conditions={originalConditions}
                loading={loading}
              />
            )}
          </Paper>
        )}
      </Box>
      <CreateFolder
        setIsFolder={setIsFolder}
        openLT={openLT}
        handleToCloseLT={handleToCloseLT}
        reportErrMsg={reportErrMsg}
        setReportFolderErrMsg={setReportFolderErrMsg}
      />

      {discard_open && (
        <Discard
          discard_open={discard_open}
          setDiscard_open={setDiscard_open}
        />
      )}
    </Box>
  );
};

export default CreateReports;
