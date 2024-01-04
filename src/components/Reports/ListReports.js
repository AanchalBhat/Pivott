import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  TextField,
  Typography,
  InputAdornment,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
// other imports
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import debouce from "lodash.debounce";
import Actions from "../../pages/common/Actions";
import ManageData from "../../pages/common/ManageData";
import "./AllReports.css";
import _ from "lodash";
import ListReportsTable from "./ListReportsTable";
import IncorrectId from "../NotFound/IncorrectId";
import {
  leadDefaultList,
  pipelineDefaultList,
  potentialDefaultList,
  dealsDefaultList,
  lostLeadsDefaultList,
} from "./ManageListReports";
import {
  leadManageState,
  pipelineManageState,
  potentialManageState,
  dealManageState,
  lostLeadManageState,
} from "../../Data/ReportManageState";
import "./Reports.css";
import CloneReport from "../../pages/common/CloneReport";
import ExportReport from "../../pages/common/ExportReport";
import ScheduleReports from "../../pages/common/ScheduleReport";
import MoveToFolder from "../../pages/common/MoveToFolder";
import { DeleteDialog } from "../../pages/common/DeleteDialog";
import RenameReport from "../../pages/common/RenameReport";
import CreateFolder from "../../pages/common/CreateFolder";
import { ReportsApi } from "../../apis/ReportsApi";
import { LeadAPI } from "../../apis/LeadApi";
import { Toaster } from "../../pages/common/Toaster";
import {
  LEAD,
  PIPELINE,
  POTENTIAL,
  LOST_LEAD,
  DEAL,
  LOST_LEAD_REVERSE,
  INVALID_ID_DATA,
} from "../../utils/constants";
//import global css
import "../../styles/global/common.css";
import { getMethodError, restMethodError } from "../../constants/errorMessages";

let check = false;

const ListReports = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const { module, id } = useParams();
  // const current_page = localStorage.getItem("current_page");
  const [openClone, setOpenClone] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [moveToFolder, setMoveToFolder] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [loader, setLoader] = useState();
  const [manage, setManage] = useState(false);
  const [iconId, seticonId] = useState([]);
  const [overviewRowData, setOverviewRowData] = useState([]);
  const [manageDisable, setManageDisable] = useState(false);
  const [srchData, setSrchData] = useState(false);
  const [open_folder, setOpen_folder] = useState(false);
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [manageType, setManageType] = useState("");
  const [overviewData, setOverviewData] = useState();
  const [manageState, setManageState] = useState(leadManageState);
  const pageSize = 10;
  const [Invalid_data, setInvalidData] = useState(false);
  const { setReportId, setManageOverviewLabel } = React.useContext(DataContext);

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  // useEffect (() => {
  //   if (searchParams.get("page")) {
  //     if (!srchData && !check)
  //     localStorage.setItem("current_page", +searchParams.get("page"));
  //     else 
  //     localStorage.setItem("current_page", 1);
  //   }
  // }, [searchParams]);

  const getOverviewReportData = () => {
    setLoader(true);
    ReportsApi.getOverviewData(id, page, pageSize)

      .then((response) => {
        if (response?.data?.records) {
          setLoader(false);
          if (page === 1) {
            setRowCount(response?.data?.total_count);
          }
          setManageType(response?.manage_data?.manage_data_type);
          localStorage.setItem("manage_id", response?.manage_data?.id);
          setManageOverviewLabel(response?.manage_data?.field_name);
          setOverviewData(JSON.stringify(response?.manage_data?.field_name));
          let rec = response?.data?.records;
          TypeOfData(rec);
        } else {
          setLoader(false);
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

  const TypeOfData = (data) => {
    let filData;
    filData = data?.data?.map((d, key) => {
      return d?.attributes;
    });
    setOverviewRowData(filData);
  };

  useEffect(() => {
    setReportId([]);
    handleItemList();
    if (!srchData) {
      getOverviewReportData();
    }
  }, [page]);

  useEffect(() => {
    if (manage) {
      getOverviewReportData();
    }
  }, [manage]);

  const handleToCloseLT = () => {
    setMoveToFolder(false);
    setOpenClone(false);
    setOpenEmail(false);
    setOpenExport(false);
    setOpenRename(false);
    setOpenDelete(false);
  };
  const handleMoveFolder = () => {
    setOpen_folder(true);
  };

  const handleCloseFolder = () => {
    setOpen_folder(false);
  };

  const handleCloneReport = () => {
    setOpenClone(true);
  };

  const handleExportReport = () => {
    setOpenExport(true);
  };

  const handleEmail = () => {
    setOpenEmail(true);
  };

  const handleMoveToFolder = () => {
    setMoveToFolder(true);
  };

  const handleRename = () => {
    setOpenRename(true);
  };

  const handleDeleteReport = () => {
    setOpenDelete(true);
  };

  const handleUpdateNFav = (id, data) => {
    ReportsApi.updateNFavorite(id, data)

      .then(function (response) {
        if (response?.data?.id) {
          Toaster.TOAST("Report added to Favorite!", "success");
        }
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleFavorite = () => {
    const data = {
      data: {
        favorite: true,
      },
    };
    handleUpdateNFav(id, data);
  };

  const actionsData = [
    {
      id: 1,
      value: "clone_report",
      handleClick: () => handleCloneReport(),
      title: "Clone Report",
    },
    {
      id: 2,
      value: "export_report",
      handleClick: () => handleExportReport(),
      title: "Export Report",
    },
    {
      id: 3,
      value: "schedule_send_email",
      handleClick: () => handleEmail(),
      title: "Schedule/Send Email",
    },
    {
      id: 4,
      value: "make_favorite",
      handleClick: () => handleFavorite(),
      title: "Make Favorite",
    },
    {
      id: 5,
      value: "rename",
      handleClick: () => handleRename(),
      title: "Rename",
    },
    {
      id: 6,
      value: "move_to_folder",
      handleClick: () => handleMoveToFolder(),
      title: "Move To Folder",
    },
    {
      id: 7,
      value: "delete_report",
      handleClick: () => handleDeleteReport(),
      title: "Delete Report",
    },
    {
      id: 8,
      value: "edit_report",
      handleClick: () => navigate(`/reports/update/${id}`),
      title: "Edit Report",
    },
  ];

  const [itemList, setItemList] = useState(leadDefaultList);

  const handleItemList = () => {
    switch (module) {
      case LEAD:
        setManageState(leadManageState);
        setItemList(leadDefaultList);
        break;
      case PIPELINE:
        setManageState(pipelineManageState);
        setItemList(pipelineDefaultList);
        break;
      case POTENTIAL:
        setManageState(potentialManageState);
        setItemList(potentialDefaultList);
        break;
      case DEAL:
        setManageState(dealManageState);
        setItemList(dealsDefaultList);
        break;
      case LOST_LEAD:
        setManageState(lostLeadManageState);
        setItemList(lostLeadsDefaultList);
        break;

      default:
        break;
    }
  };

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
    Object.keys(JSON.parse(overviewData)).forEach(function (key) {
      if (!JSON.parse(overviewData)[key]) {
        const array = itemList.filter((i) => key.includes(i.field_name));
        seticonId((iconId) => iconId.concat(array[0]?.id));
      }
    });
  };

  const handleManage = (reset) => {
    let data;
    if (reset) {
      data = {
        operation_type: "set_default",
        manage_data_type: manageType,
      };
    } else {
      // if (iconId?.length !== 7) {
      data = {
        operation_type: "update",
        field_name: manageState,
        manage_data_type: manageType,
      };
      // }
    }

    const manage_id = localStorage.getItem("manage_id");
    if (manage_id?.length) {
      LeadAPI.manageData({ data })
        .then((response) => {
          if (!response?.error || !response.errors) {
            setOpenAction(false);
            setManage(true);
            seticonId([]);
            if (manageType === LEAD) setItemList(leadDefaultList);
            else if (manageType === PIPELINE) setItemList(pipelineDefaultList);
            else if (manageType === POTENTIAL)
              setItemList(potentialDefaultList);
            else if (manageType === DEAL) setItemList(dealsDefaultList);
            else if (manageType === LOST_LEAD_REVERSE)
              setItemList(lostLeadsDefaultList);

            setManageDisable(false);
          }
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      Toaster.TOAST("Something went wrong, try reloading!", "error");
    }
  };
  const debounceSave = React.useCallback(
    debouce(function (e) {
      CallPotentialSearchApi(e);
    }, 600),
    []
  );

  const CallPotentialSearchApi = (val) => {
    ReportsApi.getOverviewTableSearch(id, module, val, page, 2)

      .then((response) => {
        if (response?.data?.records?.data?.length > 0) {
          // if (page === 1) {
            setRowCount(response?.data?.total_count);
          // }
          const attr = response?.data?.records?.data?.map((event, key) => {
            return event.attributes;
          });
          setOverviewRowData(attr);
        } else {
          setRowCount(0);
          setOverviewRowData([]);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const handleSearchChange = (e) => {
    let data = e.target.value;
    setSearchQuery(data);
    debounceSave(data, check);
    if (data) {
      setSrchData(true);
      setPage(1);
      // setSearchParams({ page: 1 })
    } else {
      setSrchData(false);
      setPage(1);
      // setSearchParams({ page: 1 })
    }
  };

  const toggleDrawerAction = () => {
    setOpenAction(!openAction);
    setManage(false);
    switch (module) {
      case LEAD:
        setItemList(leadDefaultList);
        break;
      case PIPELINE:
        setItemList(pipelineDefaultList);
        break;
      case POTENTIAL:
        setItemList(potentialDefaultList);
        break;
      case DEAL:
        setItemList(dealsDefaultList);
        break;
      case LOST_LEAD:
        setItemList(lostLeadsDefaultList);
        break;

      default:
        break;
    }
  };

  const butonopen = Boolean(null);
  const handleClick = (event) => {
    navigate(`/reports/create`);
  };
  const navigate = useNavigate();

  const handleManageSearch = (e) => {
    let val = e.target.value;
    let updatedList;
    if (module === LEAD) updatedList = [...leadDefaultList];
    else if (module === PIPELINE) updatedList = [...pipelineDefaultList];
    else if (module === POTENTIAL) updatedList = [...potentialDefaultList];
    else if (module === DEAL) updatedList = [...dealsDefaultList];
    else if (module === LOST_LEAD) updatedList = [...lostLeadsDefaultList];
    updatedList = updatedList.filter((item) => {
      return item.data.toLowerCase().indexOf(val) !== -1;
    });
    setItemList(updatedList);
  };
  useEffect(() => {
    if (overviewData) {
      setManageState(JSON.parse(overviewData));
      getData();
    }
  }, [overviewData]);

  const leads = () => {
    return (
      manageState?.company_name === 1 &&
      manageState?.email === 1 &&
      manageState?.owner === 1 &&
      manageState?.website === 1
    );
  };
  const pipelines = () => {
    return (
      manageState?.account_name === 1 &&
      manageState?.expected_revenue === 1 &&
      manageState?.journey === 1 &&
      manageState?.company_name === 1 &&
      manageState?.email === 1 &&
      manageState?.owner === 1 &&
      manageState?.pipeline_score === 1
    );
  };
  const potentials = () => {
    return (
      manageState?.amount === 1 &&
      manageState?.email === 1 &&
      manageState?.company_name === 1 &&
      manageState?.owner === 1 &&
      manageState?.stage === 1
    );
  };
  const deals = () => {
    return (
      manageState?.company_name === 1 &&
      manageState?.email === 1 &&
      manageState?.owner === 1 &&
      manageState?.deal_terms === 1 &&
      manageState?.kick_off_date === 1 &&
      manageState?.payment_mode === 1 &&
      manageState?.sign_off_date === 1 &&
      manageState?.tenure === 1 &&
      manageState?.value === 1
    );
  };
  const lostleads = () => {
    return (
      manageState?.company === 1 &&
      manageState?.email === 1 &&
      manageState?.owner === 1 &&
      manageState?.phone_number === 1 &&
      manageState?.reason === 1
    );
  };

  const stateChange = () => {
    if (module === "lead") {
      return leads();
    } else if (module === "pipeline") {
      return pipelines();
    } else if (module === "potential") {
      return potentials();
    } else if (module === "deal") {
      return deals();
    } else if (module === "lost_lead") {
      return lostleads();
    }
  };

  const backNavigation = () => {
    navigate(`/reports`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box component="main" className="ma-mainTop-box" sx={{ flexGrow: 1 }}>
          {Invalid_data ? (
            <IncorrectId />
          ) : (
            <div className="ma-mainShadow-box">
              <div className="leadBox ma-leads-box">
                <div className="leadChildBox">
                  <div className="ma-reports-allfilter-list">
                    <div className="border-0">
                      <Typography className="createlead-heading p-0 border-0">
                        <ArrowBackIcon
                          className="Arrowbtn-mr"
                          onClick={backNavigation}
                        />
                        <span>{`${_.startCase(module)}`} | </span>
                        <span className="role_text">My Folders</span>
                      </Typography>
                    </div>
                    <Button
                      className="ms-4 CreateLeadButton"
                      id="demo-customized-button"
                      aria-controls={
                        butonopen ? "demo-customized-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={butonopen ? "true" : undefined}
                      variant="contained"
                      disableElevation
                      onClick={handleClick}
                      startIcon={<AddIcon />}
                    >
                      Create Report
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="searchFilterDiv">
                  <TextField
                    size="small"
                    className="searchField"
                    name="Search"
                    placeholder="Search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e)}
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
                    <Actions actionsData={actionsData} />
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
                        title="By Reports"
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
                <div>
                  {/*  action popup for clone reports */}
                  <CloneReport
                    openLT={openClone}
                    handleToCloseLT={handleToCloseLT}
                    handleClick={handleMoveFolder}
                    cloneReportId={id}
                    clonedDataUpdate={() => {}}
                  />
                </div>
                <div>
                  {/*  action popup for export reports */}
                  <ExportReport
                    openLT={openExport}
                    handleToCloseLT={handleToCloseLT}
                    cloneReportId={id}
                    label='Export Report'
                  />
                </div>
                <div>
                  {/*  action popup for email reports */}
                  <ScheduleReports
                    getAllData={() => {}}
                    openLT={openEmail}
                    handleToCloseLT={handleToCloseLT}
                    popupDialogID={id}
                  />
                </div>
                <div>
                  {/*  action popup for move to folder */}
                  <MoveToFolder
                    getAllData={() => {}}
                    reportId={id}
                    openLT={moveToFolder}
                    handleToCloseLT={handleToCloseLT}
                    handleClick={handleMoveFolder}
                  />
                </div>
                <div>
                  {/*  action popup for rename reports */}
                  <RenameReport
                    getAllData={() => {}}
                    openLT={openRename}
                    handleToCloseLT={handleToCloseLT}
                    popupDialogID={id}
                  />
                </div>
                <div>
                  <DeleteDialog
                    openDelete={openDelete}
                    handleToCloseLT={handleToCloseLT}
                    reportId={id}
                    clonedDataUpdate={() => {}}
                  />
                </div>
                <div>
                  <ListReportsTable
                    overviewRowData={overviewRowData}
                    page={page}
                    rowCount={rowCount}
                    handlePageChange={(newPage) => handlePageChange(newPage)}
                    manage={manage}
                    loader={loader}
                  />
                </div>
                <CreateFolder
                  openLT={open_folder}
                  handleToCloseLT={handleCloseFolder}
                  setIsFolder={() => {}}
                />
              </div>
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListReports;
