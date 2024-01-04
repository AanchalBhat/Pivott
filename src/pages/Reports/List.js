import React, { useState, useEffect, useContext } from "react";
import { Button, Drawer, TextField, InputAdornment, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
// other imports
import ReportTable from "../../components/Reports/ReportTable";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import debouce from "lodash.debounce";
import ManageData from "../common/ManageData";
import Actions from "../common/Actions";
import MoveToFolder from "../common/MoveToFolder";
import { DeleteDialog } from "../common/DeleteDialog";
import Autocomplete from "@mui/material/Autocomplete";
import { reportManualArr } from "../../Data/data";
import CreateFolder from "../common/CreateFolder";
import { ReportsApi } from "../../apis/ReportsApi";
import { Typography } from "@material-ui/core";
import { LeadAPI } from "../../apis/LeadApi";
import { Toaster } from "../common/Toaster";
import "./list.css";
import { getMethodError, restMethodError } from "../../constants/errorMessages";

let check = false; // used as an indicator for dropdown filter for reports selection

const Lists = () => {
  const location = useLocation();
  const current_page = localStorage.getItem("current_page");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openAction, setOpenAction] = useState(false);
  const [manage, setManage] = useState(false);
  const [iconId, seticonId] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [openLT, setOpenLT] = useState(false);
  const [manageLoader, setManageLoader] = useState(false);
  const [loader, setLoader] = useState();
  const [manageDisable, setManageDisable] = useState(false);
  const [srchData, setSrchData] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(current_page || 1);
  const pageSize = 10;
  const [rowCount, setRowCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [commonArr, setCommonArr] = useState(reportManualArr);
  const [recordVal, setRecordVal] = useState(commonArr[0]);
  const [listData, setListingData] = useState([]);
  const [inputValue, setInputValue] = useState("All Reports");
  const [open_folder, setOpen_folder] = useState(false);
  const { reportId, setManageLabel } = useContext(DataContext);
  const [reportsData, setReportsData] = useState();
  const [isCheck, setIsCheck] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState({
    data: {},
    companyId: 0,
    id: 0,
  });
  const [fav, setFav] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const [manageState, setManageState] = useState({
    name: 1,
    description: 1,
    report_folder_id: 1,
    primary_module: 1,
    created_by: 1,
    last_accessed_date: 1,
    updated_at: 1,
  });

  useEffect(() => {
    if (current_page) {
      setSearchParams({ page: current_page})
    }
  }, [])
  useEffect (() => {
    if (searchParams.get("page")) {
      if (!srchData && !check)
      localStorage.setItem("current_page", +searchParams.get("page"));
      else 
      localStorage.setItem("current_page", 1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams?.get("page")) {
      setPage(searchParams?.get("page"));
    }
    check = false;
  }, []);

  const handleMoveToFolder = () => {
    if (reportId?.length > 0) {
      setOpenLT(true);
    } else {
      Toaster.TOAST("Please select anyone entry", "error");
    }
  };

  const handleDelete = () => {
    if (reportId?.length > 0) {
      setOpenDelete(true);
    } else {
      Toaster.TOAST("Please select anyone entry", "error");
    }
  };

  const handleClickFolder = () => {
    setOpen_folder(true);
  };

  const handleCloseFolder = () => {
    setOpen_folder(false);
  };

  const listingData = () => {
    setLoader(true);
    ReportsApi.getAll(page, pageSize)

      .then(function (response) {
        if (response?.data) {
          setLoader(false);
          // if (page === 1 && !check) {
            setRowCount(response?.data?.total_count);
          // }
          const attr = response?.data?.records?.data?.map((event, index) => {
            return event?.attributes;
          });
          if (!check) {
            setListingData(attr);
          }
          setIsCheck(true);
          setGridKey((prevKey) => prevKey + 1);
          setManageLabel(response?.manage_data?.field_name);
          setReportsData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        } else {
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const actionsData = [
    {
      id: 1,
      value: "move_folder",
      handleClick: () => handleMoveToFolder(),
      title: "Move to Folder",
    },
    {
      id: 2,
      value: "delete",
      handleClick: () => handleDelete(),
      title: "Delete",
    },
  ];

  const defaultList = [
    {
      id: 0,
      data: "Description",
      field_name: "description",
    },
    {
      id: 1,
      data: "Updated At",
      field_name: "updated_at",
    },
    {
      id: 2,
      data: "Report Folder",
      field_name: "report_folder_id",
    },
    {
      id: 3,
      data: "Module",
      field_name: "primary_module",
    },
    {
      id: 4,
      data: "Report Owner",
      field_name: "created_by",
    },
  ];

  const [itemList, setItemList] = useState(defaultList);

  function handleclose(obj, index, id) {
    setManageDisable(true);
    setManageState({ ...manageState, [obj.field_name]: id });
    if (id) {
      seticonId((iconId) => iconId.filter((elId) => elId !== obj?.id));
    } else {
      seticonId((iconId) => iconId.concat(obj.id));
    }
  }

  const getData = () => {
    Object.keys(JSON.parse(reportsData)).forEach(function (key) {
      if (!JSON.parse(reportsData)[key]) {
        const array = itemList.filter((i) => key.includes(i?.field_name));
        seticonId((iconId) => iconId.concat(array[0]?.id));
      }
    });
  };

  const handleManage = (reset) => {
    setManageLoader(true);
    let data;
    if (reset) {
      data = {
        operation_type: "set_default",
        manage_data_type: "report",
      };
    } else {
      if (iconId?.length !== 6) {
        data = {
          operation_type: "update",
          field_name: manageState,
          manage_data_type: "report",
        };
      }
    }
    const manage_id = localStorage.getItem("manage_id");
    if (manage_id?.length) {
      LeadAPI.manageData({ data })

        .then((response) => {
          setOpenAction(false);
          setManage(true);
          seticonId([]);
          setItemList(defaultList);
          setManageDisable(false);
          setManageLoader(false);
        })
        .catch((error) => {
          setManageLoader(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      Toaster.TOAST("Something went wrong, try reloading!", "error");
    }
  };
  const debounceSave = React.useCallback(
    debouce(function (e) {
      if (srchData)
      CallReportSearchApi(e);
    }, 600),
    [srchData]
  );

  useEffect(() => {
    if (srchData) {
      CallReportSearchApi(searchQuery);
    }
  }, [fav]);

  const CallReportSearchApi = (data) => {
    ReportsApi.getReportSearch(data, page, pageSize, check)

      .then((response) => {
        if (response?.data?.records?.data?.length > 0) {
          setRowCount(response?.data?.total_count);
          const attr = response?.data?.records?.data.map((event, index) => {
            return event?.attributes;
          });
          setListingData(attr);
        } else if (response?.data?.attributes) {
          if (page === 1) {
            setRowCount(response?.data?.attributes?.reports_count);
          }
          const attr = response?.data?.attributes?.reports?.map(
            (event, index) => {
              return event;
            }
          );
          setListingData(attr);
        } else {
          setRowCount(0);
          setListingData([]);
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
    if (page === 1) {
      debounceSave(data, check);
    } else {
      setPage(1);
      setSearchParams({ page: 1 })
    }
    if (data) {
      setSrchData(true);
      setSearchParams({ page: 1 })
    } else {
      // if (searchParams.get("page") && page !== 1) {
      //   setPage(+(searchParams.get("page")))
      // } else {
        setSearchParams({ page: 1 })
      // }
      setSrchData(false);
    }
  };

  const toggleDrawerAction = () => {
    setOpenAction(!openAction);
    setManage(false);
    setIsCheck(false);
    setItemList(defaultList);
  };

  const butonopen = Boolean(null);
  const handleClick = (event) => {
    navigate(`/reports/create`);
  };
  const navigate = useNavigate();

  const handleManageSearch = (e) => {
    let val = e.target.value;
    var updatedList = [...defaultList];
    updatedList = updatedList.filter((item) => {
      return item.data.toLowerCase().indexOf(val) !== -1;
    });
    setItemList(updatedList);
  };
  const handleToCloseLT = () => {
    setOpenLT(false);
    setOpenDelete(false);
  };

  useEffect(() => {
    if (reportsData) {
      setManageState(JSON.parse(reportsData));
      getData();
    }
  }, [reportsData]);

  useEffect(() => {
    if (!srchData && !check) {
      listingData();
    }
    if (manage) {
      listingData();
    }
  }, [page, manage, fav]);

  const stateChange = () => {
    return (
      manageState?.name === 1 &&
      manageState?.description === 1 &&
      manageState?.updated_at === 1 &&
      manageState?.report_folder_id === 1 &&
      manageState?.primary_module === 1 &&
      manageState?.created_by === 1
    );
  };

  useEffect(() => {
    if (!srchUser) {
      AllReportGet();
    }
  }, [srchUser]);

  const AllReportGet = (srchQuery) => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    ReportsApi.getFolder(id?.company_id, srchQuery, page, 20)

      .then((res) => {
        setUserLoading(true);
        if (res?.records?.data) {
          let arr = res?.records?.data?.map((elem, index) => {
            return elem?.attributes;
          });
          if (commonArr?.length <= 5) {
            setCommonArr([...commonArr, ...arr]);
          } else {
            setCommonArr([...reportManualArr, ...arr]);
          }
          setUserLoading(false);
        } else {
          setCommonArr([]);
          setUserLoading(false);
        }
      })
      .catch((error) => {
        setUserLoading(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const debounceSaveUser = React.useCallback(
    debouce(function (e) {
      if (e) {
        AllReportGet(e);
      }
    }, 800),
    []
  );

  useEffect(() => {
    if (inputValue === "All Reports") {
      check = false;
    }
  }, [inputValue]);

  useEffect(() => {
    if (inputValue !== "All Reports" && !srchData) {
      ReportApi(
        filterDropdown?.data,
        filterDropdown?.companyId,
        filterDropdown?.id,
        inputValue
      );
    }
  }, [page, isDeleted, fav]);

  const handleInput = (val) => {
    let id = parseInt(val?.id);
    setSearchQuery("");
    setRecordVal(val);
    let data = {};
    if (val) {
      check = true;
      if (val?.name === "Favorite Reports") {
        data = { favorite: true };
      } else if (val?.name === "Recently Viewed") {
        data = { recent: true };
      } else if (val?.name === "Scheduled") {
        data = { scheduled: true };
      } else if (val?.name === "All Reports") {
        data = { all_report: true };
      } else if (val?.name === "Shared") {
        data = { shared: true };
      }
      setFilterDropdown({
        data: data,
        companyId: val?.company_id,
        id: id,
      });
      if (page === 1) {
        ReportApi(data, val?.company_id, id, val?.name);
      } else {
        setPage(1);
        setSearchParams({ page: 1 })
      }
    }
  };
  const handleSharedFilter = (arr) => {
    let sharedVal = [];
    let newSharedVal = [];
    arr.map((item, index) => {
      sharedVal.push(...item.reports.data);
      return item.reports.data;
    });
    sharedVal.filter((value, i) => {
      newSharedVal.push(value.attributes);
      return value.attributes;
    });
    setListingData(newSharedVal);
  };
  const ReportApi = (data, company_id, id, name) => {
    ReportsApi.getReportsFilter(data, company_id, id, page, pageSize)
      .then((res) => {
        let arr;
        if (res?.data?.records?.data) {
          if (page === 1) {
            setRowCount(res?.data?.total_count);
          }
          arr = res?.data?.records?.data?.map((elem, index) => {
            return elem?.attributes;
          });
          setListingData(arr);

          if (name === "Shared") {
            handleSharedFilter(arr);
          }
        } else if (res?.data?.attributes?.reports?.data?.length) {
          if (page === 1) {
            setRowCount(res?.total_count);
          }
          arr = res?.data?.attributes?.reports?.data?.map((elem, index) => {
            return elem?.attributes;
          });
          setListingData(arr);
        } else {
          setRowCount(0);
          setListingData([]);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleInputChange = (event, newInputValue) => {
    if (newInputValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newInputValue);
    }
    setInputValue(newInputValue);
  };
  const allRecord = () => {
    return (
      <Autocomplete
        loading={userLoading}
        value={recordVal}
        onChange={(event, newValue) => handleInput(newValue)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) =>
          handleInputChange(event, newInputValue)
        }
        disableClearable
        clearOnEscape
        id="controllable-states-demo"
        options={commonArr}
        filterOptions={(commonArr) => commonArr}
        className="ma-autocomplete"
        getOptionLabel={(option) => option?.name}
        componentsProps={{
          paper: {
            sx: {
              width: 230,
              boxShadow: "none",
              borderRadius: "0",
              border: "1px solid #E8E8ED",
              paddingTop: "0 !important",
              paddingBottom: "0 !important",
            },
          },
        }}
        renderOption={(props, option, { selected }) => {
          return (
            <li
              {...props}
              key={parseInt(option.id)}
              style={{
                borderBottom: "1px solid #E8E8ED",
                color: "#191a47",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "none",
              }}
            >
              <Typography
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#191a47",
                }}
                color={"text.primary"}
              >
                {option?.name}
              </Typography>
              <hr />
              &nbsp;
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} />}
        // defaultValue={"All Reports"}
      />
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (newPage === 1) {
      searchParams.delete("page");
      setSearchParams(searchParams);
    }
    setSearchParams({ page: parseInt(newPage) })
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box component="main" className="ma-mainTop-box" sx={{ flexGrow: 1 }}>
          <div className="ma-mainShadow-box">
            <div className="leadBox ma-leads-box">
              <div className="leadChildBox">
                <div className="ma-allfilter-list">
                  <Button
                    className="CreateLeadButton"
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
                  {allRecord()}
                </div>
              </div>
            </div>
            {/*  action popup for move reports */}
            <MoveToFolder
              reportId={reportId}
              getAllData={listingData}
              openLT={openLT}
              handleToCloseLT={handleToCloseLT}
              handleClick={handleClickFolder}
            />
            <DeleteDialog
              openDelete={openDelete}
              handleToCloseLT={handleToCloseLT}
              clonedDataUpdate={listingData}
              reportId={reportId}
              isDeleted={() => setIsDeleted((prev) => !prev)}
            />

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
                      loading={manageLoader}
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
                <ReportTable
                  handleClickFolder={handleClickFolder}
                  listingData={listData}
                  manage={manage}
                  isCheck={isCheck}
                  getAllData={listingData}
                  page={page}
                  rowCount={rowCount}
                  loader={loader}
                  handlePageChange={(newPage) => handlePageChange(newPage)}
                  check={check}
                  fav={() => setFav((prev) => !prev)}
                  gridKey={gridKey}
                />
              </div>
            </div>
          </div>
        </Box>
        <CreateFolder
          openLT={open_folder}
          handleToCloseLT={handleCloseFolder}
          setIsFolder={() => {}}
          AllReportGet={AllReportGet}
        />
      </Box>
    </>
  );
};

export default Lists;
