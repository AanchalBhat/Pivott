import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// mui
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
//mui icons
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";

// api
import { LeadAPI } from "../../apis/LeadApi";
import { LostLeadApi } from "../../apis/LostLeadApi";

// components
import ManageData from "../../pages/common/ManageData";
import Convert from "../../pages/common/Convert";
import DialogBox from "../../pages/common/TransferDialogBox";
import Actions from "../../pages/common/Actions";
import LostLeadTable from "./LostLeadTable";
import AllLeads from "../../pages/common/DropdownFilter";
import debouce from "lodash.debounce";
// other imports
import { DataContext } from "../../context";
import "../../pages/Leads/List.css";
import { lostLeadsDefaultList } from "../../Data/ManageDataList";
import { Toaster } from "../../pages/common/Toaster";
import { userApi } from "../../apis/userApi";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import ListName from "../../pages/common/ListName";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Between from "../../pages/common/Between";
import FilterByLeads from "../../pages/common/FilterByLeads";
import { FilterAccordion } from "../../pages/common/AllFilter/FilterAccordion";
import { ButtonLoader } from "../../pages/common/ButtonLoader";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PipelineApi } from "../../apis/pipelineApi";
import { PotentialApi } from "../../apis/PotentialApi";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

let dropdownCheck = false;
let check;

const LostLists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const current_page = localStorage.getItem("current_page");
  const [searchParams, setSearchParams] = useSearchParams();
  const [usersData, setUsersData] = useState([]);
  const [openAction, setOpenAction] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [manage, setManage] = useState(false);
  const [iconId, seticonId] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [openLT, setOpenLT] = React.useState(false);
  const [contact_detail_id, setContactId] = useState();
  const [contactErr, setContactErr] = useState("");
  const [contactsValue, setContactsValue] = useState("");
  const [reasonData, setReasonData] = useState([]);
  const [allReason, setAllReason] = useState("");
  const [manageDisable, setManageDisable] = useState(false);
  const [srchData, setSrchData] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [page, setPage] = useState(current_page || 1);
  const pageSize = 10;
  const [manageLoader, setManageLoader] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [created_date_to, setCreated_date_to] = useState(searchParams.get("created_date_to") || null);
  const [created_date_from, setCreated_date_from] = useState(searchParams.get("created_date_from") || null);
  const [updated_date_to, setUpdated_date_to] = useState(searchParams.get("updated_date_to") || null);
  const [updated_date_from, setUpdated_date_from] = useState(searchParams.get("updated_date_from") || null);
  const isAnyAccordionOpen = activeAccordion.length > 0;
  const [leadSources, setLeadSources] = useState(+searchParams.get("lead_source_id") || "");
  const [leadStatus, setLeadStatus] = useState(+searchParams.get("status_id") || "");
  const [value, setValue] = useState(searchParams.get("journey") || null);
  const [amount, setAmount] = useState(searchParams.get("amount") || "");
  const [leadCountry, setLeadCountry] = useState(searchParams.get("country") || "");
  const [leadState, setLeadState] = useState(searchParams.get("state") || "");
  const [leadCity, setLeadCity] = useState(searchParams.get("city") || "");
  const [leadSize, setLeadSize] = useState(+searchParams.get("company_size_id") || "");
  const [leadStatusArray, setLeadStatusArray] = useState([]);
  const [leadSourceArray, setLeadSourceArray] = useState([]);
  const [compnySizeArray, setCompnySizeArray] = useState([]);
  const [pipelineStageArray, setPipelineStageArray] = useState([]);
  const allFilterData = localStorage.getItem("all_filter_data") ? JSON.parse(localStorage.getItem("all_filter_data")) : null;
  const currentFilterCount = allFilterData ?
    Object.keys(allFilterData).length :
    null;
  const [count, setCount] = useState(+currentFilterCount || 0);
  const [open, setOpen] = useState(false);
  const [filterData, setFilterData] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [filterLoader, setFilterLoader] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [listData, setListData] = useState();
  const [resetFilter, setResetFilter] = useState(false);
  const [pipelineScore, setPipelineScore] = useState(+searchParams.get("pipeline_score_id") || "");
  const [campaign, setCampaign] = useState(searchParams.get("campaign_sources") || "");
  const [revenue, setRevenue] = useState(searchParams.get("expected_revenue") || null);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openCalendar1, setOpenCalendar1] = useState(false);
  const [closing_date, setClosing_date] = useState(searchParams.get("closing_date") || null);
  const [stageData, setStageData] = useState([]);
  const [pipelineScoreArray, setPipelineScoreArray] = useState([]);
  const [typeArray, setTypeArray] = useState([]);
  const [type, setType] = useState(+searchParams.get("stage_type_id") || "");
  const [stage, setStage] = useState(searchParams.get("potential_stage") || "");
  const [pipeline_stage, setPipeline_stage] = useState(searchParams.get("pipeline_stage") || "");
  const [flag, setFlag] = useState(false);
  const [searchAccordianQuery, setSearchAccordianQuery] = useState("");
  const [manageState, setManageState] = useState({
    company: 1,
    email: 1,
    // first_name: 1,
    //  owner: 1,
    owner: 1,
    phone_number: 1,
    name: 1,
    reason: 1,
  });
  const [userLoading, setUserLoading] = useState(false);
  const [transferLoader, setTransferLoader] = useState(false);

  const [itemList, setItemList] = useState(lostLeadsDefaultList);
  const {
    setGlobalLostLeads,
    setLostLeadPopupId,
    lostLeadData,
    lostLeadPopupId,
  } = React.useContext(DataContext);

  const allFilterDataKeys = [
    "created_date_from", "created_date_to",
    "updated_date_from", "updated_date_to",
    "lead_source_id", "status_id",
    "expected_revenue", "company_size_id",
    "pipeline_score_id", "journey",
    "campaign_sources", "potential_stage",
    "pipeline_stage", "closing_date",
    "stage_type_id",
    "city", "state", "country"
  ]

  useEffect(() => {
    if (
      (searchParams.get("created_date_from") ||
        searchParams.get("created_date_to") ||
        searchParams.get("updated_date_from") ||
        searchParams.get("updated_date_to") ||
        searchParams.get("lead_source_id") ||
        searchParams.get("status_id") ||
        searchParams.get("expected_revenue") ||
        searchParams.get("pipeline_score_id") ||
        searchParams.get("company_size_id") ||
        searchParams.get("journey") ||
        searchParams.get("amount") ||
        searchParams.get("campaign_sources") ||
        searchParams.get("stage_type_id") ||
        searchParams.get("potential_stage") ||
        searchParams.get("pipeline_stage") ||
        searchParams.get("closing_date") ||
        searchParams.get("city") ||
        searchParams.get("state") ||
        searchParams.get("country") ||
        currentFilterCount) && !check
    ) {
      check = true;
      appendFilterParams();
    }
  }, [])

  useEffect(() => {
    if (current_page && !check) {
      setSearchParams({ page: current_page })
    } else if (current_page && check) {
      setSearchParams({ page: current_page, ...allFilterData })
    }
  }, [])

  const getLeadStatus = () => {
    LeadAPI.getLeadStatusData().then((response) => {
      setLeadStatusArray(response?.data);
      setFlag((prev) => !prev);
    });
  };

  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData().then((response) => {
      setLeadSourceArray(response?.data);
      setFlag((prev) => !prev);
    });
  };

  const getCompanySize = () => {
    LeadAPI.getCompanySize().then((response) => {
      setCompnySizeArray(response?.data);
      setFlag((prev) => !prev);
    });
  };

  const getPipelineScoreData = () => {
    PipelineApi.getPipelineScoreData().then((response) => {
      if (response?.data) {
        setPipelineScoreArray(response?.data);
        setFlag((prev) => !prev);
      }
    });
  };
  const getTypeData = () => {
    const id = JSON.parse(localStorage.getItem("user_info"));
    PotentialApi.getType(id?.company_id)
      .then(function (response) {
        if (response?.data?.length > 0) {
          setTypeArray(response?.data);
          setFlag((prev) => !prev);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStageData = () => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    PotentialApi.getStageData(id?.company_id)
      .then(function (response) {
        if (response?.data?.length > 0) {
          setStageData(response?.data);
          setFlag((prev) => !prev);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPipelineStageData = () => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    PipelineApi.getStageData(id?.company_id)
      .then(function (response) {
        if (response?.data?.length > 0) {
          setPipelineStageArray(response?.data);
          setFlag((prev) => !prev);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (searchParams.get("page")) {
      if (!srchData && !dropdownCheck)
        localStorage.setItem("current_page", +searchParams.get("page"));
      else
        localStorage.setItem("current_page", 1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams?.get("page")) {
      setPage(searchParams?.get("page"));
    }
    dropdownCheck = false;
    getReasonData();
  }, []);

  function handleclose(obj, index, id) {
    setManageDisable(true);
    setManageState({ ...manageState, [obj?.field_name]: id });
    if (id) {
      seticonId((iconId) => iconId.filter((elId) => elId !== obj?.id));
    } else {
      seticonId((iconId) => iconId.concat(obj?.id));
    }
  }

  const getData = () => {
    Object.keys(JSON.parse(lostLeadData)).forEach(function (key) {
      if (!JSON.parse(lostLeadData)[key]) {
        const array = itemList.filter((i) => key.includes(i.field_name));
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
      };
    } else {
      data = {
        operation_type: "update",
        field_name: manageState,
      };
    }
    const manage_id = localStorage.getItem("manage_id");
    if (manage_id?.length) {
      LeadAPI.manageData({ data })
        .then((response) => {
          setOpenAction(false);
          setManage(true);
          seticonId([]);
          setItemList(lostLeadsDefaultList);
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
        CallLostSearchApi(e);
    }, 600),
    [srchData]
  );

  useEffect(() => {
    if (srchData) {
      CallLostSearchApi(searchQuery);
    }
  }, [page]);

  const CallLostSearchApi = (data) => {
    LostLeadApi.getLostLeadSearch(data, page, pageSize, dropdownCheck)
      .then((response) => {
        if (response?.data?.length > 0) {
          setRowCount(response?.meta?.total_records);
          const attr = response?.data?.map((event, key) => {
            return event?.attributes;
          });
          setGlobalLostLeads(attr);
        } else {
          setGlobalLostLeads([]);
          setRowCount(0);
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
      debounceSave(data);
    } else {
      setPage(1);
      setSearchParams({ page: 1 })
    }

    if (data) {
      setSrchData(true);
      setSearchParams({ page: 1 })
    } else {
      setSearchParams({ page: 1 })
      setSrchData(false);
    }
  };

  const handleLeadDelete = () => {
    // setLoader(true);
    let data = {
      lead_ids: lostLeadPopupId,
    };
    // setIsDeleted(false);
    if (lostLeadPopupId?.length > 0) {
      LostLeadApi.leadDelete({ data })
        .then((response) => {
          setLostLeadPopupId([]);
          setIsDeleted((prev) => !prev);
          Toaster.TOAST(response?.message, "success");
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      Toaster.TOAST("Please select any entry", "error");
    }
  };
  const handleLeadTransfer = () => {
    let data = {
      lead_ids: lostLeadPopupId,
      owner_id: parseInt(contact_detail_id),
    };
    setIsDeleted((prev) => !prev);
    if (contactErr === "" && contact_detail_id) {
      setTransferLoader(true);
      massTransferApi(data);
    } else {
      setContactErr("Please select owner");
    }
  };

  const massTransferApi = (data) => {
    console.log("massTransferApi");
    LostLeadApi.massTransfer({ data })
      .then((response) => {
        setTransferLoader(false);
        if (response) {
          setLostLeadPopupId([]);
          Toaster.TOAST(response?.message, "success");
          setOpenLT(false);
          setContactErr("");
          setContactsValue("");
          setIsDeleted((prev) => !prev);
        } else {
          setLostLeadPopupId([]);
          Toaster.TOAST(response?.error || response?.errors, "error");
        }
      })
      .catch((error) => {
        setTransferLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const toggleDrawerAction = () => {
    setOpenAction(!openAction);
    setManage(false);
    setItemList(lostLeadsDefaultList);
  };

  const handleManageSearch = (e) => {
    let val = e.target.value;
    var updatedList = [...lostLeadsDefaultList];
    updatedList = updatedList.filter((item) => {
      return item?.data?.toLowerCase()?.indexOf(val) !== -1;
    });
    setItemList(updatedList);
  };

  const getReasonData = () => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    LostLeadApi.getReasonData(id?.company_id)
      .then(function (response) {
        if (response?.data?.length > 0) {
          setReasonData(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleReasonList = (e) => {
    let val = e.target.value;
    setAllReason(val);
    if (val) {
      dropdownCheck = true;
    } else {
      dropdownCheck = false;
    }
    setPage(1);
    setSearchParams({ page: 1, ...allFilterData })
    handleDropdownFilter(val);
  };

  const handleDropdownFilter = (val) => {
    LostLeadApi.getAllFilter(val, page, pageSize)
      .then((response) => {
        if (response?.data) {
          const attr = response?.data?.map((event, key) => {
            return event?.attributes;
          });
          // if (page === 1) {
          setRowCount(response?.meta?.total_records);
          // }
          setSrchData(false);
          setSearchQuery("");
          setGlobalLostLeads(attr);
        } else {
          Toaster.TOAST(response?.error || response?.errors, "error");
          setGlobalLostLeads([]);
          setSrchData(false);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (allReason && !srchData) {
      handleDropdownFilter(allReason);
    }
  }, [page, isDeleted]);

  useEffect(() => {
    if (lostLeadData) {
      setManageState(JSON.parse(lostLeadData));
      getData();
    }
  }, [lostLeadData]);

  const handleToCloseLT = () => {
    setOpenLT(false);
    setContactErr("");
    setContactsValue("");
  };
  const data = [
    { eventKey: "lead", label: "Convert to Lead" },
    { eventKey: "pipeline", label: "Convert to Pipeline" },
    { eventKey: "potential", label: "Convert to Potential" },
    { eventKey: "deal", label: "Convert to Deal" },
  ];

  const handleConvert = (val) => {
    if (lostLeadPopupId?.length === 1) {
      let data = {
        lead_ids: lostLeadPopupId,
      };

      switch (val) {
        case "pipeline":
        case "potential":
        case "deal":
        case "lead":
          data = {
            ...data,
            convert_to: val,
          };
          break;
        default:
          break;
      }

      LostLeadApi.convertType({ data })
        .then((response) => {
          if (response) {
            setLostLeadPopupId([]);
            Toaster.TOAST(response?.message, "success");
            switch (val) {
              case "pipeline":
                navigate(`/pipeline/create/${response?.record_id}`);
                break;
              case "potential":
                navigate(`/potential/create/${response?.record_id}`);
                break;
              case "lead":
                navigate(`/lead/create/${response?.record_id}`);
                break;
              case "deal":
                navigate(`/deal/create/${response?.record_id}`);
                break;
              default:
                break;
            }
          } else {
            setLostLeadPopupId([]);
            Toaster.TOAST(response?.error || response?.errors, "error");
          }
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else if (lostLeadPopupId?.length === 0) {
      Toaster.TOAST("Please select anyone", "error");
    } else {
      Toaster.TOAST("Please select only one entry", "error");
    }
  };

  const contactDropDown = () => {
    return (
      <Autocomplete
        className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
        fullWidth
        id="leadowner"
        filterOptions={(usersData) => usersData}
        loading={userLoading}
        options={usersData}
        onChange={(event, newValue) => {
          setContactId(newValue?.id);
        }}
        getOptionLabel={(option) => option?.attributes?.email}
        value={{
          attributes: {
            email: contactsValue,
          },
        }}
        onInputChange={(event, newInputValue) => {
          getContactData(event, newInputValue);
        }}
        renderOption={(props, option, { selected }) => {
          return (
            option?.attributes?.first_name && (
              <li {...props}>
                <Box display={"flex"} flexDirection={"row"}>
                  <Avatar size={"22"} variant={"circular"} />
                  <Box display={"flex"} ml={3} flexDirection={"column"}>
                    <Typography color={"text.primary"}>
                      {option?.attributes?.first_name +
                        " " +
                        option?.attributes?.last_name}
                    </Typography>
                    <Typography color={"text.secondary"}>
                      {option?.attributes?.email}
                    </Typography>
                  </Box>
                </Box>
                <hr />
                &nbsp;
              </li>
            )
          );
        }}
        renderInput={(params) => (
          <TextField
            className="m-0"
            {...params}
            placeholder="Choose owner from here"
            margin="normal"
            variant="outlined"
            helperText={<span className="ma-error">{contactErr}</span>}
          />
        )}
      />
    );
  };

  const handleTransferLead = () => {
    if (lostLeadPopupId?.length > 0) {
      setOpenLT(true);
    } else {
      setOpenLT(false);
      Toaster.TOAST("Please select any entry", "error");
    }
  };

  useEffect(() => {
    if (!srchUser) {
      getLeadOwnerData();
    }
  }, [srchUser]);

  const getLeadOwnerData = (srchQuery) => {
    let login_user_id = localStorage.getItem("login_id");
    userApi
      .getUsers(srchQuery)
      .then((data) => {
        setUserLoading(true);
        if (data?.data) {
          let restUsers = data?.data?.filter(
            (elem) => elem?.id !== login_user_id
          );
          setUsersData(restUsers);
          setUserLoading(false);
        } else {
          setUsersData([]);
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
        getLeadOwnerData(e);
      }
    }, 800),
    []
  );

  const getContactData = (event, newValue) => {
    const isValidEmail = usersData.find(
      (elem) => elem.attributes.email === newValue
    );

    if (isValidEmail && newValue) {
      setContactErr("");
      setContactId(isValidEmail?.id);
    } else {
      setContactId("");
      setContactErr("Please select owner");
    }
    if (newValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }

    setContactsValue(newValue);
  };

  const dropdownFilterData = reasonData?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem?.id}>
        {elem?.attributes?.name}
      </MenuItem>
    );
  });

  const actionsData = [
    {
      id: 1,
      value: "lead_delete",
      handleClick: () => handleLeadDelete(),
      title: "Lead Delete",
    },
    {
      id: 2,
      value: "lostlead_transfer",
      handleClick: () => handleTransferLead(),
      title: "Lead Transfer",
    },
  ];

  const stateChange = () => {
    return (
      manageState?.company === 1 &&
      manageState?.email === 1 &&
      manageState?.owner === 1 &&
      manageState?.phone_number === 1 &&
      manageState?.name === 1 &&
      manageState?.reason === 1
    );
  };

  const handleApply = () => {
    let creationDateFrom = new Date(created_date_from);
    let creationDateTo = new Date(created_date_to);
    let creationStartDate = `${creationDateFrom.getDate()}/${(
      "0" +
      (creationDateFrom.getMonth() + 1)
    ).slice(-2)}/${creationDateFrom.getFullYear()}`;
    let creationEndDate = `${creationDateTo.getDate()}/${(
      "0" +
      (creationDateTo.getMonth() + 1)
    ).slice(-2)}/${creationDateTo.getFullYear()}`;

    let modificationDateFrom = new Date(updated_date_from);
    let modificationDateTo = new Date(updated_date_to);
    let modificationDateStart = `${modificationDateFrom.getDate()}/${(
      "0" +
      (modificationDateFrom.getMonth() + 1)
    ).slice(-2)}/${modificationDateFrom.getFullYear()}`;
    let modificationDateEnd = `${modificationDateTo.getDate()}/${(
      "0" +
      (modificationDateTo.getMonth() + 1)
    ).slice(-2)}/${modificationDateTo.getFullYear()}`;

    let data = {};
    let filterCount = 0;

    if (created_date_from) {
      data = {
        ...data,
        created_date_from: created_date_from !== null ? created_date_from : creationStartDate,
      };
    }
    if (created_date_to) {
      data = {
        ...data,
        created_date_to: created_date_to !== null ? created_date_to : creationEndDate,
      };
    }
    if (created_date_from || created_date_to) {
      filterCount++;
    }
    if (created_date_from && created_date_to) {
      data = {
        ...data, created_at: true,
      };
    }
    if (updated_date_from) {
      data = {
        ...data,
        updated_date_from: updated_date_from !== null ? created_date_from : modificationDateStart,
      };
    }
    if (updated_date_to) {
      data = {
        ...data,
        updated_date_to: updated_date_to !== null ? updated_date_to : modificationDateEnd,
      };
    }
    if (updated_date_from || updated_date_to) {
      filterCount++;
    }
    if (updated_date_from && updated_date_to) {
      data = {
        ...data, updated_at: true,
      };
    }

    if (leadSources) {
      filterCount++;
      data = {
        ...data,
        lead_source_id: leadSources,
      };
    }
    if (leadStatus) {
      filterCount++;
      data = {
        ...data,
        status_id: leadStatus,
      };
    }
    if (leadCountry?.name) {
      filterCount++;
      data = {
        ...data,
        country: leadCountry?.name,
      };
    }
    if (leadState?.name) {
      filterCount++;
      data = {
        ...data,
        state: leadState?.name,
      };
    }
    if (leadCity?.name) {
      filterCount++;
      data = {
        ...data,
        city: leadCity.name,
      };
    }
    if (leadSize) {
      filterCount++;
      data = {
        ...data,
        company_size_id: leadSize,
      };
    }
    if (pipeline_stage) {
      filterCount++;
      data = {
        ...data,
        pipeline_stage: parseInt(pipeline_stage),
      };
    }
    if (pipelineScore) {
      filterCount++;
      data = {
        ...data,
        pipeline_score_id: parseInt(pipelineScore),
      };
    }
    if (revenue) {
      filterCount++;
      data = {
        ...data,
        expected_revenue: revenue,
      };
    }
    if (campaign) {
      filterCount++;
      data = {
        ...data,
        campaign_sources: campaign,
      };
    }

    if (value) {
      filterCount++;
      data = {
        ...data,
        journey: value, // journey
      };
    }
    if (amount) {
      filterCount++;
      data = {
        ...data,
        amount: amount,
      };
    }
    if (closing_date) {
      filterCount++;
      data = {
        ...data,
        closing_date: closing_date,
      };
    }
    if (type) {
      filterCount++;
      data = {
        ...data,
        stage_type_id: type,
      };
    }
    if (stage) {
      filterCount++;
      data = {
        ...data,
        potential_stage: parseInt(stage),
      };
    }
    setCount(filterCount);
    setFilterData(data);
    localStorage.setItem("all_filter_data", JSON.stringify(data));
    if (page === 1) {
      if (
        created_date_from ||
        created_date_to ||
        updated_date_from ||
        updated_date_to ||
        leadSources ||
        leadCity ||
        leadState ||
        leadCountry ||
        pipelineScore ||
        stage ||
        type ||
        revenue ||
        campaign ||
        value ||
        amount ||
        closing_date ||
        pipeline_stage ||
        leadStatus ||
        leadSize
      ) {
        appendFilterParams(data);
        setSearchParams({ ...data })
      }
    } else {
      setPage(1);
      setSearchParams({ page: 1, ...data })
    }
    check = true;
  };

  const appendFilterParams = (params) => {
    if (allFilterData)
      applyFilter(allFilterData);
  }

  const applyFilter = (data) => {
    setFilterLoader(true);
    LostLeadApi.getFilter(data, page, pageSize, dropdownCheck)
      .then((response) => {
        if (response?.data) {
          setListData(response?.data);
          // if (page === 1) {
          setRowCount(response?.meta?.total_records);
          // }
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalLostLeads(attr);
          setOpen(false);
          setSearchQuery("");
          setOpenAction(false);
          setBtnDisabled(false);
          setSrchData(false);
          check = true;
          //error state
        } else {
          setGlobalLostLeads([]);
          setRowCount(0);
          setOpen(false);
          setOpenAction(false);
          setPage(1);
          setBtnDisabled(false);
          setSrchData(false);
          check = true;
        }
        setFilterLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (check && !srchData) {
      appendFilterParams(filterData);
    }
  }, [page, isDeleted]);

  const handleClearFilter = () => {
    setCreated_date_from("");
    setCreated_date_to("");
    setUpdated_date_from("");
    setUpdated_date_to("");
    setLeadCountry("");
    setLeadCity("");
    setLeadSources("");
    setLeadStatus("");
    setLeadSize("");
    setType("");
    setPipelineScore("");
    setRevenue("");
    setPipeline_stage("");
    setCampaign("");
    setValue("");
    setClosing_date("");
    setStage("");
    setAmount("");
  };

  const handleClear = (val) => {
    setActiveAccordion([]);
    handleClearFilter();
    setSearchQuery("");
    setSearchAccordianQuery("");
    if (val === "close") {
      toggleDrawer();
    } else if (val === "clear" && count !== 0) {
      setActiveAccordion([]);
      handleClearFilter();
      setCount(0);
      setResetFilter((prev) => !prev);
      setBtnDisabled(true);
      setPage(1);
      setSearchParams({ page: 1 })
      allFilterDataKeys.map(elem => {
        searchParams.delete(elem)
      }
      )
      setSearchParams(searchParams);
      localStorage.removeItem("all_filter_data");
      check = false;
    }
  };

  const handleReset = () => {
    setActiveAccordion([]);
    toggleDrawer();
    setSearchQuery("");
    setSearchAccordianQuery("");
    setResetFilter((prev) => !prev);
    handleClearFilter();
    setCount(0);
    setPage(1);
    setSearchParams({ page: 1 })
    allFilterDataKeys.map(elem => {
      searchParams.delete(elem)
    }
    )
    setSearchParams(searchParams);
    localStorage.removeItem("all_filter_data");
    setBtnDisabled(true);
    check = false;
  };

  const toggleDrawer = () => {
    setOpen(!open);
    setAccordionFilterData(accordionData);
    setSearchAccordianQuery("");
  };

  const closing_dateCalenderOpen = () => {
    if (openCalendar1) {
      setOpenCalendar1(false);
      setFlag((prev) => !prev);
    } else {
      setOpenCalendar1(true);
      setFlag((prev) => !prev);
    }
  };

  const clearClosingDate = () => {
    setOpenCalendar1(false); // Close the calendar
    setClosing_date(null); // Clear the date
    setFlag((prev) => !prev);
  };

  const CalenderOpen = () => {
    if (openCalendar) {
      setOpenCalendar(false);
      setFlag((prev) => !prev);
    } else {
      setOpenCalendar(true);
      setFlag((prev) => !prev);
    }
  };

  const clearDate = () => {
    setOpenCalendar(false); // Close the calendar
    setValue(null); // Clear the date
    setFlag((prev) => !prev);
  };

  const accordionData = [
    {
      elementName: "Leads by Date of Creation",
      content: (
        <Between
          value={created_date_from}
          endDate={created_date_to}
          setFlag={setFlag}
          handleStartDate={setCreated_date_from}
          handleEndDate={setCreated_date_to}
        />
      ),
    },
    {
      elementName: "Leads by Last Modification",
      content: (
        <Between
          value={updated_date_from}
          endDate={updated_date_to}
          setFlag={setFlag}
          handleStartDate={setUpdated_date_from}
          handleEndDate={setUpdated_date_to}
        />
      ),
    },
    {
      elementName: "Leads by Source",
      content: (
        <ListName
          title="Lead Source"
          placeholder="Select lead source"
          name="leadSources"
          setFlag={setFlag}
          handleChange={(e) => {
            setLeadSources(e.target.value);
          }}
          setValue={setLeadSources}
          value={leadSources}
          select={true}
          arr={leadSourceArray?.map((data, key) => {
            return (
              <MenuItem key={key} value={data?.id}>
                {data?.attributes?.name}
              </MenuItem>
            );
          })}
        />
      ),
    },
    {
      elementName: "Leads by Status",
      content: (
        <ListName
          title="Lead Status"
          placeholder="Select lead status"
          name="leadstatus"
          setFlag={setFlag}
          handleChange={(e) => {
            setLeadStatus(e.target.value);
          }}
          setValue={setLeadStatus}
          value={leadStatus}
          select={true}
          arr={leadStatusArray?.map((data, key) => {
            return (
              <MenuItem key={key} value={data?.id}>
                {data?.attributes?.name}
              </MenuItem>
            );
          })}
        />
      ),
    },
    {
      elementName: "Leads by Country",
      content: (
        <Select
          title="Country"
          placeholder="Select country"
          name="leadcountry"
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          options={Country.getAllCountries()}
          getOptionLabel={(options) => {
            return (
              <div className="country-search">
                <div>{options?.name}</div>&nbsp;
                <div>{options?.flag}</div>
              </div>
            );
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          isClearable={() => setLeadCountry("")}
          value={leadCountry}
          onChange={(value) => {
            setLeadCountry(value);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Leads by State",
      content: (
        <Select
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          fullWidth
          id="state"
          name="state"
          placeholder="Select state"
          options={State?.getStatesOfCountry(leadCountry?.isoCode)}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          isClearable={() => setLeadState("")}
          value={leadState}
          onChange={(item) => {
            setLeadState(item);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Leads by City",
      content: (
        <Select
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          fullWidth
          id="city"
          name="city"
          placeholder="Select city"
          options={City.getCitiesOfState(
            leadState?.countryCode,
            leadState?.isoCode
          )}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          isClearable={() => setLeadCity("")}
          value={leadCity}
          onChange={(item) => {
            setLeadCity(item);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Leads by Type",
      content: (
        <ListName
          title="Type"
          placeholder="Select Type"
          name="type"
          setFlag={setFlag}
          handleChange={(e) => {
            setType(e.target.value);
          }}
          setValue={setType}
          value={type}
          select={true}
          arr={typeArray?.map((data, key) => {
            return (
              <MenuItem key={key} value={data?.id}>
                {data?.attributes?.name}
              </MenuItem>
            );
          })}
        />
      ),
    },
    {
      elementName: "Leads by Employee Size",
      content: (
        <ListName
          title="Employee Size"
          placeholder="Select employee size"
          name="leadSize"
          setFlag={setFlag}
          handleChange={(e) => {
            setLeadSize(e.target.value);
          }}
          setValue={setLeadSize}
          value={leadSize}
          select={true}
          arr={compnySizeArray?.map((elem, index) => {
            return (
              <MenuItem key={index} value={elem?.id}>
                {elem?.attributes?.name}
              </MenuItem>
            );
          })}
        />
      ),
    },
    {
      elementName: "Leads by Score",
      content: (
        <ListName
          title="Pipeline Score"
          placeholder="Select pipeline score"
          name="pipeline score"
          setFlag={setFlag}
          handleChange={(e) => {
            setPipelineScore(e.target.value);
          }}
          setValue={setPipelineScore}
          value={pipelineScore}
          select={true}
          arr={pipelineScoreArray.map((elem, index) => (
            <MenuItem key={index} value={elem?.id}>
              {elem?.attributes?.name}
            </MenuItem>
          ))}
        />
      ),
    },
    {
      elementName: "Leads by Expected Revenue",
      content: (
        <ListName
          title="Add Expected Revenue"
          placeholder="Enter expected revenue"
          name="revenue"
          setFlag={setFlag}
          handleChange={(e) => {
            setRevenue(e.target.value.replace(/\D/g, ""));
          }}
          value={revenue}
          select={false}
          inputProps={{ maxLength: 10 }}
        />
      ),
    },
    {
      elementName: "Leads by Pipeline Stage",
      content: (
        <ListName
          title="stage"
          placeholder="Select Stage"
          name="stage"
          setFlag={setFlag}
          handleChange={(e) => {
            setPipeline_stage(e.target.value);
          }}
          setValue={setPipeline_stage}
          value={pipeline_stage}
          select={true}
          arr={pipelineStageArray?.map((data, key) => {
            return (
              <MenuItem key={key} value={data?.id}>
                {data?.attributes?.name}
              </MenuItem>
            );
          })}
        />
      ),
    },
    {
      elementName: "Leads by Campaign Source",
      content: (
        <ListName
          title="Add Campaign Source"
          placeholder="Enter campaign source"
          name="campaignsource"
          setFlag={setFlag}
          handleChange={(e) => {
            setCampaign(e.target.value);
          }}
          value={campaign}
          select={false}
        />
      ),
    },
    {
      elementName: "Leads by Journey",
      content: (
        <div className="leadfilterDCforminput">
          <div className="leadfilterDCformlable">Add Date</div>
          <div className="leadfilterDCforminput">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                open={openCalendar}
                onOpen={() => setOpenCalendar(true)}
                onClose={() => setOpenCalendar(false)}
                className="placeholder_field"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue?.$d.toISOString().replace(/:00.000Z/, ""));
                  setFlag((prev) => !prev);
                }}
                renderInput={(params) => (
                  <TextField
                    onKeyDown={(e) => e.preventDefault()}
                    {...params}
                    fullWidth
                    onMouseDown={() => CalenderOpen()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => clearDate()}
                            size="small"
                            edge="end"
                          >
                            {value && <ClearIcon />}
                          </IconButton>
                          <IconButton
                            onClick={() => setOpenCalendar(true)}
                            size="small"
                            edge="end"
                          >
                            <CalendarTodayIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
      ),
    },
    {
      elementName: "Leads by Closing Date",
      content: (
        <div className="leadfilterDCforminput">
          <div className="leadfilterDCformlable">Closing Date</div>
          <div className="leadfilterDCforminput">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                open={openCalendar1}
                onOpen={() => setOpenCalendar1(true)}
                onClose={() => setOpenCalendar1(false)}
                className="placeholder_field"
                value={closing_date}
                onChange={(newValue) => {
                  setClosing_date(
                    newValue?.$d.toISOString().replace(/:00.000Z/, "")
                  );
                  setFlag((prev) => !prev);
                }}
                renderInput={(params) => (
                  <TextField
                    onKeyDown={(e) => e.preventDefault()}
                    {...params}
                    fullWidth
                    onMouseDown={() => closing_dateCalenderOpen()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => clearClosingDate()}
                            size="small"
                            edge="end"
                          >
                            {closing_date && <ClearIcon />}
                          </IconButton>
                          <IconButton
                            onClick={() => setOpenCalendar1(true)}
                            size="small"
                            edge="end"
                          >
                            <CalendarTodayIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
      ),
    },
    {
      elementName: "Leads by Potential Stage",
      content: (
        <ListName
          title="Stage"
          placeholder="Select stage"
          name="stage"
          setFlag={setFlag}
          handleChange={(e) => {
            setStage(e.target.value);
          }}
          setValue={setStage}
          value={stage}
          select={true}
          inputProps={{ maxLength: 10 }}
          arr={stageData?.map((data, key) => {
            return (
              <MenuItem key={key} value={data?.id}>
                {data?.attributes?.name}
              </MenuItem>
            );
          })}
        />
      ),
    },
    {
      elementName: "Leads by Amount",
      content: (
        <ListName
          title="Amount"
          placeholder="$ 10,000"
          name="amount"
          setFlag={setFlag}
          handleChange={(e) => {
            setAmount(e.target.value.replace(/\D/g, ""));
          }}
          value={amount}
          select={false}
          inputProps={{ maxLength: 10 }}
        />
      ),
    },
  ];

  const [accordionFilterData, setAccordionFilterData] = useState(accordionData);

  useEffect(() => {
    const filteredAccordionData = accordionData.filter((accordion) =>
      accordion.elementName
        .toLowerCase()
        .includes(searchAccordianQuery.toLowerCase())
    );
    if (searchAccordianQuery?.length > 0) {
      setAccordionFilterData(filteredAccordionData);
    } else {
      setAccordionFilterData(accordionData);
    }
  }, [flag]);

  const handleAccordionChange = (elementName) => {
    if (activeAccordion.includes(elementName)) {
      setActiveAccordion(
        activeAccordion.filter((item) => item !== elementName)
      );
    } else {
      setActiveAccordion([...activeAccordion, elementName]);
      if (elementName === "Leads by Type") {
        getTypeData();
      }
      if (elementName === "Leads by Source") {
        getLeadSourceData();
      }
      if (elementName === "Leads by Potential Stage") {
        getStageData();
      }
      if (elementName === "Leads by Score") {
        getPipelineScoreData();
      }
      if (elementName === "Leads by Status") {
        getLeadStatus();
      }
      if (elementName === "Leads by Employee Size") {
        getCompanySize();
      }
      if (elementName === "Leads by Pipeline Stage") {
        getPipelineStageData();
      }
    }
  };

  const isAccordionOpen = (elementName) => {
    return activeAccordion.includes(elementName);
  };

  const handleSetSearchParam = (page) => {
    if (allFilterData && Object.keys(allFilterData).length > 0) {
      setSearchParams({ page: parseInt(page), ...allFilterData })
    }
    else {
      setSearchParams({ page: parseInt(page) })
    }
  }

  const handleSearch = (query) => {
    setSearchAccordianQuery(query);
    const filteredAccordionData = accordionData.filter((accordion) =>
      accordion.elementName.toLowerCase().includes(query.toLowerCase())
    );
    setAccordionFilterData(filteredAccordionData);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box component="main" className="ma-mainTop-box" sx={{ flexGrow: 1 }}>
          <DialogBox
            label="Lost Lead Transfer"
            openLT={openLT}
            handleToCloseLT={handleToCloseLT}
            contactDropDown={contactDropDown}
            handleLeadMassTransfer={handleLeadTransfer}
            loading={transferLoader}
          />
          <div className="ma-mainShadow-box">
            <div className="leadBox ma-leads-box">
              <div className="leadChildBox">
                <div className="ma-allfilter-list ma-lost-filter">
                  <AllLeads
                    alignParam={["bottom", -35, "top", "left"]}
                    title="All Reasons"
                    allLead={allReason}
                    handleList={handleReasonList}
                    leadArray={dropdownFilterData}
                  />
                  <Button className="p-0 mx-3" onClick={toggleDrawer}>
                    <Typography
                      variant="button"
                      className="ma-sideEye-icon mb-0 p-0"
                      gutterBottom
                    >
                      <TuneIcon className="mb-0 me-2 p-0" />
                      All Filter ({count})
                    </Typography>
                  </Button>
                </div>
              </div>
            </div>
            <Drawer anchor={"right"} open={open} onClose={toggleDrawer}>
              <div>
                <div className="ma-LeadMD filterSelect">
                  <h4>All Filters</h4>
                  <Button
                    className="ma-close-btn"
                    onClick={() => handleClear("close")}
                  >
                    {/*  toggleDrawer */}
                    <CloseIcon />
                  </Button>
                </div>
                <FilterByLeads
                  handleReset={handleReset}
                  btnDisabled={btnDisabled}
                  title="By LostLeads"
                  handleSearch={(e) => {
                    handleSearch(e.target.value);
                  }}
                >
                  <div className="leadfilterDCform">
                    {accordionFilterData.map((accordion, index) => (
                      <FilterAccordion
                        key={index}
                        elementName={accordion.elementName}
                        content={accordion.content}
                        handleAccordionChange={handleAccordionChange}
                        isAccordionOpen={isAccordionOpen}
                      />
                    ))}
                  </div>
                </FilterByLeads>
                {isAnyAccordionOpen && (
                  <div className="leadMDbutton listMDbutton border-0 mb-0 mt-3">
                    <ButtonLoader
                      loading={filterLoader}
                      classStyle={"applay"}
                      handleClick={() => handleApply()}
                      title={"APPLY"}
                    />
                    <Button
                      className="cancel"
                      onClick={() => handleClear("clear")}
                    >
                      CLEAR
                    </Button>
                  </div>
                )}
              </div>
            </Drawer>
            <div>
              <div className="searchFilterDiv">
                <TextField
                  size="small"
                  className="searchField"
                  data-testId="search"
                  name="Search"
                  placeholder="Search"
                  type="text"
                  id="Search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="ma-convertEdit-bar p-0">
                  <Convert
                    data={data}
                    handleConvert={handleConvert}
                    handleLostConvert={""}
                  />
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
                      title="By Leads"
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
                <LostLeadTable
                  isDeleted={isDeleted}
                  resetFilter={resetFilter}
                  page={page}
                  handlePageChange={(newPage) => {
                    setPage(newPage)
                    handleSetSearchParam(newPage)
                  }}
                  count={count}
                  rowCount={rowCount}
                  handleRowCount={(newCount) => setRowCount(newCount)}
                  listData={[{ listData }, { manage }]}
                  srchData={srchData}
                  dropdownCheck={dropdownCheck}
                  setContactErr={setContactErr}
                />
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default LostLists;
