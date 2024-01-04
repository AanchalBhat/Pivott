import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
//mui
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
//mui icons
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
// other imports
import styleds from "styled-components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PipelineApi } from "../../apis/pipelineApi";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import { DataContext } from "../../context";
import { LeadAPI } from "../../apis/LeadApi";
import BoardPipeline from "../../pages/Pipeline/Board";
import PipelineTable from "./PipelineTable";
import { userApi } from "../../apis/userApi";
import debouce from "lodash.debounce";
import { pipelineArr } from "../../Data/data";
import { pipelineDefaultList } from "../../Data/ManageDataList";
import AllLeads from "../common/DropdownFilter";
import FilterByLeads from "../common/FilterByLeads";
import DialogBox from "../common/TransferDialogBox";
import Convert from "../common/Convert";
import Actions from "../common/Actions";
import ManageData from "../common/ManageData";
import ListName from "../common/ListName";
import { Toaster } from "../common/Toaster";
import "./List.css";
import { ButtonLoader } from "../common/ButtonLoader";
import { FormatDate } from "../../utils";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import LoadingButton from "@mui/lab/LoadingButton";
import { CircularProgress, IconButton } from "@mui/material";
import "./List.css";
import { FilterAccordion } from "../common/AllFilter/FilterAccordion";
import Between from "../common/Between";
import LeadOwnerDropdown from "../common/LeadOwner";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { CITY_REGEX } from "../../utils/regexLists";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const Content = styleds.div`
  ${(props) => (props.active ? "" : "display:none")}
`;
const Tabs = styleds.div`
  overflow: hidden;
  background: #fff;
  `;

const Tab = styleds.button`
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
  border-bottom: ${(props) => (props.active ? "none" : "")};
  background-color: ${(props) => (props.active ? "#27299b17" : "white")};
  transition: background-color 0.5s ease-in-out;

  :hover {
    background-color: #27299b17;
  }
`;

let check;
let dropdownCheck = false;

const Lists = () => {
  const { pipelineData, setGlobalPipeline, pipelineid, setPipelineId } =
    React.useContext(DataContext);
  const current_page = localStorage.getItem("current_page");
  const listViewIndex = localStorage.getItem("list_view_index");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [usersData, setUsersData] = useState([]);
  const [listData, setListData] = useState();
  const [pipelineScore, setPipelineScore] = useState(searchParams.get("pipeline_score_id") || "");
  const [campaign, setCampaign] = useState(searchParams.get("campaign_sources") || "");
  const [revenue, setRevenue] = useState(searchParams.get("expected_revenue") || null);
  const allFilterData = localStorage.getItem("all_filter_data") ? JSON.parse(localStorage.getItem("all_filter_data")) : null;
  const currentFilterCount = allFilterData ?
    Object.keys(allFilterData).length :
    null;
  const [count, setCount] = useState(+currentFilterCount || 0);
  const [allPipelines, setAllPipelines] = useState("");
  const [iconId, seticonId] = useState([]);
  const [value, setValue] = useState(searchParams.get("journey") || null);
  const [openAction, setOpenAction] = useState(false);
  const [open, setOpen] = useState(false);
  const [manageLoader, setManageLoader] = useState(false);
  const [transferLoader, setTransferLoader] = useState(false);
  const [manage, setManage] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [openLT, setOpenLT] = React.useState(false);
  const [contact_detail_id, setContactId] = useState("");
  const [contactsValue, setContactsValue] = useState("");
  const [contactErr, setContactErr] = useState("");
  const [typeArray, setTypeArray] = useState([]);
  const [pipelineStageArray, setPipelineStageArray] = useState([]);
  const [pipelineScoreArray, setPipelineScoreArray] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [resetFilter, setResetFilter] = useState(false);
  const [page, setPage] = useState(current_page || 1);
  const pageSize = 10;
  const [rowCount, setRowCount] = useState(0);
  const [filterData, setFilterData] = useState("");
  const [active, setActive] = useState(+listViewIndex || 0);
  const [indx, setIndx] = useState("");
  const [boardSearch, setBoardSearch] = useState(false);
  const [manageDisable, setManageDisable] = useState(false);
  const [srchData, setSrchData] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [boardData, setBoardData] = useState([]);
  const [messags, setMessags] = useState("");
  const [filterLoader, setFilterLoader] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [created_date_to, setCreated_date_to] = useState(searchParams.get("created_date_to") || null);
  const [created_date_from, setCreated_date_from] = useState(searchParams.get("created_date_from") || null);
  const [updated_date_to, setUpdated_date_to] = useState(searchParams.get("updated_date_to") || null);
  const [updated_date_from, setUpdated_date_from] = useState(searchParams.get("updated_date_from") || null);
  const [leadSourceArray, setLeadSourceArray] = useState([]);
  const [leadSources, setLeadSources] = useState(searchParams.get("lead_source_id") || "");
  const [owner_id, setOwner] = useState(searchParams.get("owner_id") || null);
  const [pipelineCountry, setPipelineCountry] = useState(searchParams.get("country") || "");
  const [pipelineState, setPipelineState] = useState(searchParams.get("state") || "");
  const [pipelineCity, setPipelineCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("stage_type_id") || "");
  const [stage, setStage] = useState(searchParams.get("pipeline_stage_id") || "");
  const isAnyAccordionOpen = activeAccordion.length > 0;
  const [openCalendar, setOpenCalendar] = useState(false);
  const [flag, setFlag] = useState(false);
  const [searchAccordianQuery, setSearchAccordianQuery] = useState("");
  let filterCount = 0;
  const [manageState, setManageState] = useState({
    first_name: 1,
    account_name: 1,
    last_name: 1,
    email: 1,
    pipeline_score: 1,
    pipeline_stage_id: 1,
    phone_number: 1,
    owner: 1,
    expected_revenue: 1,
    company_name: 1,
    next_step: 1,
  });
  const [userLoading, setUserLoading] = useState(false);
  const [itemList, setItemList] = useState(pipelineDefaultList);

  const data = [
    { eventKey: "potential", label: "Convert to Potential" },
    { eventKey: "deal", label: "Convert to Deal" },
  ];

  const allFilterDataKeys = [
    "created_date_from", "created_date_to",
    "updated_date_from", "updated_date_to",
    "lead_source_id", "owner_id",
    "expected_revenue",
    "pipeline_score_id", "journey",
    "campaign_sources",
    "pipeline_stage",
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
        searchParams.get("owner_id") ||
        searchParams.get("expected_revenue") ||
        searchParams.get("pipeline_score_id") ||
        searchParams.get("journey") ||
        searchParams.get("campaign_sources") ||
        searchParams.get("stage_type_id") ||
        searchParams.get("pipeline_stage") ||
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

  // useEffect(() => {
  //   // if (searchParams.get("page") && active === 0) {
  //   //   if (current_page && active === 0) {
  //   //   setActive(1);
  //   // }
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  useEffect(() => {
    if (searchParams.get("page")) {
      if (!srchData && !dropdownCheck)
        localStorage.setItem("current_page", +searchParams.get("page"));
      else
        localStorage.setItem("current_page", 1);
    }
  }, [searchParams]);

  const actionsData = [
    {
      id: 1,
      value: "10",
      handleClick: () => handlePipeline(),
      title: "Pipeline Delete",
    },
    {
      id: 2,
      value: "pipeline_transfer",
      handleClick: () => handleTransferPipeline(),
      title: "Pipeline Transfer",
    },
    {
      id: 3,
      value: "30",
      handleClick: () => handlePotentialDelete(),
      title: "Mass Convert Potential",
    },
  ];

  useEffect(() => {
    if (searchParams?.get("page")) {
      setPage(searchParams?.get("page"));
    }
    dropdownCheck = false;
    getStageData();
  }, []);

  const getPipelineScoreData = () => {
    PipelineApi.getPipelineScoreData()
      .then((response) => {
        if (response?.data) {
          setPipelineScoreArray(response?.data);
          setFlag((prev) => !prev);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData().then((response) => {
      setLeadSourceArray(response?.data);
      setFlag((prev) => !prev);
    });
  };

  const getStageData = () => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    PipelineApi.getStageData(id?.company_id)

      .then(function (response) {
        if (response?.data?.length > 0) {
          setPipelineStageArray(response?.data);
          setFlag((prev) => !prev);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getTypeData = () => {
    const id = JSON.parse(localStorage.getItem("user_info"));
    PipelineApi.getType(id?.company_id)

      .then((response) => {
        if (response?.data?.length > 0) {
          setTypeArray(response?.data);
          setFlag((prev) => !prev);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStageList = (e) => {
    let val = e.target.value;
    setMessags("");
    // check = true;
    setAllPipelines(val);
    if (val) {
      dropdownCheck = true;
    } else {
      dropdownCheck = false;
    }
    setPage(1);
    setSearchParams({ page: 1, ...allFilterData })
    if (active === 1) {
      stageFilter(val, true);
    } else {
      stageFilter(val, false);
    }
  };

  const stageFilter = (val, data) => {
    PipelineApi.getDropdownFilter(val, data, page, pageSize, check)
      .then((response) => {
        if (active === 1) {
          if (response?.data?.length) {
            const attr = response?.data?.map((event, index) => {
              return event?.attributes;
            });
            setRowCount(response?.meta?.total_records);
            setSrchData(false);
            setGlobalPipeline(attr);
          } else {
            setGlobalPipeline([]);
          }
        } else {
          setBoardData(response?.records);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (allPipelines && !srchData) {
      if (active === 1) {
        stageFilter(allPipelines, true);
      } else {
        setSearchParams({ page: 1 })
        allFilterDataKeys.map(elem => {
          searchParams.delete(elem)
        })
        setSearchParams(searchParams);
        localStorage.removeItem("all_filter_data");
        stageFilter(allPipelines, false);
      }
    }
  }, [
    page,
    isDeleted,
    check,
  ]); /* adding check to call api in case of resetting filter while dropdown filter is still applied to update data */

  const debounceSave = React.useCallback(
    debouce(function (e) {
      if (srchData)
        CallSearchgetApi(e);
    }, 600),
    [active, srchData]
  );

  useEffect(() => {
    if (srchData) {
      CallSearchgetApi(messags);
    }
  }, [page]);

  const CallSearchgetApi = (data) => {
    if (active === 1) {
      getSearchApi(data, check, true);
    } else {
      getSearchApi(data, check, false);
    }
  };

  const handleSearchChange = (e) => {
    setMessags(e.target.value);
    if (page === 1) {
      debounceSave(e.target.value);
    } else {
      setSearchParams({ page: 1 })
      setPage(1);
    }
    if (e.target.value) {
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
    if (active === 1) {
      setBoardSearch(false);
    } else {
      setBoardSearch(true);
    }
  };

  const getSearchApi = (data, check, list_view) => {
    PipelineApi.getPipelineSearch(
      data,
      check,
      list_view,
      page,
      pageSize,
      dropdownCheck
    )

      .then((response) => {
        if (active === 1) {
          if (response?.data?.length > 0) {
            setRowCount(response?.meta?.total_records);
            const attr = response?.data?.map((event, index) => {
              return event?.attributes;
            });
            setGlobalPipeline(attr);
          } else {
            setRowCount(0);
            setGlobalPipeline([]);
          }
        } else {
          setBoardData(response?.records);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  function handleclose(obj, index, id) {
    setManageDisable(true);
    setManageState({ ...manageState, [obj.field_name]: id });
    if (id) {
      seticonId((iconId) => iconId.filter((elId) => elId !== obj?.id));
    } else {
      seticonId((iconId) => iconId.concat(obj?.id));
    }
  }

  const getData = () => {
    Object.keys(JSON.parse(pipelineData)).forEach(function (key) {
      if (!JSON.parse(pipelineData)[key]) {
        const array = itemList.filter((i) => key.includes(i?.field_name));
        seticonId((iconId) => iconId.concat(array[0]?.id));
      }
    });
  };

  useEffect(() => {
    if (pipelineData) {
      setManageState(JSON.parse(pipelineData));
      getData();
    }
  }, [pipelineData]);

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
          setManageLoader(false);
          setItemList(pipelineDefaultList);
          setManageDisable(false);
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

  const toggleDrawer = () => {
    setOpen(!open);
    setAccordionFilterData(accordionData);
    setSearchAccordianQuery("");
  };

  const toggleDrawerAction = () => {
    setOpenAction(!openAction);
    setManage(false);
    setItemList(pipelineDefaultList);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const butonopen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpenform = () => {
    setAnchorEl(null);
    navigate(`/pipeline/create`);
  };

  const handleManageSearch = (e) => {
    let val = e.target.value;
    var updatedList = [...pipelineDefaultList];
    updatedList = updatedList.filter((item) => {
      return item?.data?.toLowerCase().indexOf(val) !== -1;
    });
    setItemList(updatedList);
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
    if (stage) {
      filterCount++;
      data = {
        ...data,
        pipeline_stage_id: stage,
      };
    }
    if (type) {
      filterCount++;
      data = {
        ...data,
        stage_type_id: type,
      };
    }
    if (pipelineCountry?.name) {
      filterCount++;
      data = {
        ...data,
        country: pipelineCountry?.name,
      };
    }
    if (pipelineState?.name) {
      filterCount++;
      data = {
        ...data,
        state: pipelineState?.name,
      };
    }
    if (pipelineCity?.name) {
      filterCount++;
      data = {
        ...data,
        city: pipelineCity.name,
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
        journey: value !== null ? value : value,
      };
    }
    if (pipelineScore) {
      filterCount++;
      data = {
        ...data,
        pipeline_score_id: parseInt(pipelineScore),
      };
    }
    if (owner_id) {
      filterCount++;
      data = {
        ...data,
        owner_id: owner_id,
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
        pipelineCity ||
        pipelineCountry ||
        pipelineState ||
        pipelineScore ||
        stage ||
        type ||
        revenue ||
        campaign ||
        value ||
        owner_id
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
    PipelineApi.getFilter(data, page, pageSize, true, dropdownCheck)
      .then((response) => {
        setOpen(false);
        check = true;
        setBtnDisabled(false);
        setMessags("");
        setListData(response?.data?.records);
        if (response?.data) {
          setRowCount(response?.meta?.total_records);
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalPipeline(attr);
          setSrchData(false);
        } else {
          setRowCount(0);
          setGlobalPipeline([]);
          setSrchData(false);
        }
        setFilterLoader(false);
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        setFilterLoader(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (check && !srchData) {
      appendFilterParams(filterData);
    }
  }, [page, isDeleted]);

  const handleClearFilter = () => {
    setActiveAccordion([]);
    setCreated_date_from("");
    setCreated_date_to("");
    setUpdated_date_from("");
    setUpdated_date_to("");
    setValue(null);
    setCampaign("");
    setRevenue("");
    setPipelineScore("");
    setStage("");
    setType("");
    setLeadSources("");
    setPipelineCountry("");
    setPipelineCity("");
    setOwner("");
    setPipelineState("");
    setContactsValue("");
  };

  const handleClear = (val) => {
    handleClearFilter();
    setActiveAccordion([]);
    setSearchAccordianQuery("");
    setMessags("");
    if (val === "close") {
      toggleDrawer();
    } else if (val === "clear" && count !== 0) {
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
    setMessags("");
    setResetFilter((prev) => !prev);
    handleClearFilter();
    setSearchAccordianQuery("");
    setCount(0);
    setPage(1);
    setSearchParams({ page: 1 })
    allFilterDataKeys.map(elem => {
      searchParams.delete(elem)
    }
    )
    setSearchParams(searchParams);
    localStorage.removeItem("all_filter_data");
    check = false;
    setBtnDisabled(true);
  };

  const handleClicks = (e) => {
    const index = parseInt(e.currentTarget?.id, 0);
    if (index !== active) {
      setActive(index);
      setMessags("");
      setBoardSearch(false);
      setCount(0);
      //dropdown fitler state
      setAllPipelines("");
      check = false;
      setResetFilter((prev) => !prev);
      setBtnDisabled(true);
      setSrchData(false);
    }
    setIndx(index);
    localStorage.setItem("list_view_index", index)
  };

  const handlePipeline = () => {
    let data = {
      pipeline_ids: pipelineid,
    };
    if (pipelineid?.length > 0) {
      PipelineApi.massDelete({ data })
        .then((response) => {
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

  const handlePotentialDelete = () => {
    let data = {
      pipeline_ids: pipelineid,
      convert_to: "potential",
    };
    // setIsDeleted(false);
    if (pipelineid?.length > 0) {
      PipelineApi.massConvert({ data })

        .then((response) => {
          if (response) {
            setPipelineId([]);
            setIsDeleted((prev) => !prev);
            Toaster.TOAST(response?.message, "success");
            navigate("/potential");
          } else {
            setPipelineId([]);
          }
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      Toaster.TOAST("Please select anyone entry", "error");
    }
  };

  const handleConvert = (val) => {
    if (pipelineid?.length === 1) {
      let data = {
        pipeline_ids: pipelineid,
      };

      switch (val) {
        case "potential":
        case "deal":
          data = {
            ...data,
            convert_to: val,
          };
          break;
        default:
          break;
      }

      PipelineApi.massConvert({ data })
        .then((response) => {
          setPipelineId([]);
          Toaster.TOAST(response?.message, "success");
          if (val === "potential") {
            navigate(`/potential/create/${response?.record_id}`);
          } else if (val === "deal") {
            navigate(`/deal/create/${response?.record_id}`);
          }
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else if (pipelineid?.length === 0) {
      Toaster.TOAST("Please select anyone entry", "error");
    } else {
      Toaster.TOAST("Please select only one entry", "error");
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
  const contactDropDown = () => {
    return (
      <Autocomplete
        className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
        fullWidth
        loading={userLoading}
        noOptionsText={"You have no other user to transfer the pipeline."}
        id="leadowner"
        options={usersData}
        filterOptions={(usersData) => usersData}
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

  const handleTransferPipeline = () => {
    if (pipelineid?.length > 0) {
      setOpenLT(true);
    } else {
      setOpenLT(false);
      Toaster.TOAST("Please select any entry", "error");
    }
  };

  const handleListMassTransfer = () => {
    let data = {
      pipeline_ids: pipelineid,
      owner_id: parseInt(contact_detail_id),
    };
    if (contactErr === "" && contact_detail_id) {
      setTransferLoader(true);
      massTransferApi(data);
    } else {
      setContactErr("Please select owner");
    }
  };
  const massTransferApi = (data) => {
    PipelineApi.pipelineTransfer({ data })

      .then((response) => {
        setTransferLoader(false);
        if (response) {
          setPipelineId([]);
          Toaster.TOAST(response?.message, "success");
          setContactErr("");
          setContactsValue("");
          setOpenLT(false);
          setIsDeleted((prev) => !prev);
        } else {
          setPipelineId([]);
        }
      })
      .catch((error) => {
        setTransferLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };
  const handleToCloseLT = () => {
    setOpenLT(false);
    setContactsValue("");
    setContactErr("");
  };

  const stateChange = () => {
    return (
      manageState?.email === 1 &&
      manageState?.phone_number === 1 &&
      manageState?.pipeline_score === 1 &&
      manageState?.owner === 1 &&
      manageState?.expected_revenue === 1 &&
      manageState?.next_step === 1 &&
      manageState.stage === 1 &&
      manageState.company_name === 1
    );
  };

  const dropdownFilterData = pipelineStageArray?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem?.id}>
        {elem?.attributes?.name}
      </MenuItem>
    );
  });

  const calenderOpen = () => {
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
      elementName: "Date of Creation",
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
      elementName: "Last Modification",
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
      elementName: "Pipelines by Journey",
      content: (
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
                  onMouseDown={() => calenderOpen()}
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
      ),
    },
    {
      elementName: "Pipelines by Score",
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
      elementName: "Pipelines by Expected Revenue",
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
      elementName: "Pipeline by Campaign Source",
      content: (
        <ListName
          title="Add Campaign Source"
          placeholder="Enter campaign source"
          name="campaign"
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
      elementName: "Pipelines by Source",
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
      elementName: "Pipelines by Stage",
      content: (
        <ListName
          title="stage"
          placeholder="Select Stage"
          name="stage"
          setFlag={setFlag}
          handleChange={(e) => {
            setStage(e.target.value);
          }}
          setValue={setStage}
          value={stage}
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
      elementName: "Pipelines by Type",
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
      elementName: "Pipelines by Country",
      content: (
        <Select
          title="Country"
          placeholder="Select country"
          name="pipelinecountry"
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
          value={pipelineCountry}
          isClearable={() => setPipelineCountry("")}
          onChange={(value) => {
            setPipelineCountry(value);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Pipelines by State",
      content: (
        <Select
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          fullWidth
          id="state"
          name="state"
          placeholder="Select state"
          options={State.getStatesOfCountry(pipelineCountry?.isoCode)}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          value={pipelineState}
          isClearable={() => setPipelineState("")}
          onChange={(value) => {
            setPipelineState(value);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Pipelines by City",
      content: (
        <Select
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          fullWidth
          id="city"
          name="city"
          placeholder="Select city"
          options={City.getCitiesOfState(
            pipelineState?.countryCode,
            pipelineState?.isoCode
          )}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          value={pipelineCity}
          isClearable={() => setPipelineCity("")}
          onChange={(value) => {
            setPipelineCity(value);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Pipelines by Owner",
      content: (
        <LeadOwnerDropdown
          label="Pipeline Owner"
          userLoading={userLoading}
          placeholder="pipeline owner"
          users={usersData}
          owner_id={owner_id}
          OwnerValue={contactsValue}
          setFieldValue={() => { }}
          getContactData={getContactData}
          handleOwner={(val) => {
            setOwner(val);
            setFlag((prev) => !prev);
          }}
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
      if (elementName === "Pipelines by Type") {
        getTypeData();
      }
      if (elementName === "Pipelines by Source") {
        getLeadSourceData();
      }
      if (elementName === "Pipelines by Stage") {
        getStageData();
      }
      if (elementName === "Pipelines by Score") {
        getPipelineScoreData();
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
                    onClick={handleOpenform}
                    startIcon={<AddIcon />}
                  >
                    Create Pipeline
                  </Button>
                  <AllLeads
                    alignParam={["bottom", -35, "top", "left"]}
                    title="All Pipelines"
                    allLead={allPipelines}
                    handleList={handleStageList}
                    leadArray={dropdownFilterData}
                  />
                  <Box className="filterSelect ma-pipeline-filter">
                    <Tabs className="ma-filterTabs-two">
                      <Tab
                        className="ma-bgActive-bg"
                        id={0}
                        onClick={handleClicks}
                        active={active === 0}
                      >
                        <ViewAgendaOutlinedIcon
                          sx={{ color: active === 0 ? "#2C42B5" : "gray" }}
                        />
                      </Tab>
                      <Tab
                        className="ma-bgActive-bg"
                        id={1}
                        onClick={handleClicks}
                        active={active === 1}
                      >
                        <MenuIcon
                          sx={{ color: active === 1 ? "#2C42B5" : "gray" }}
                        />{" "}
                      </Tab>
                    </Tabs>
                  </Box>
                  {parseInt(listViewIndex) === 1 ? (
                    <Button className="p-0" onClick={toggleDrawer}>
                      <Typography
                        variant="button"
                        className="ma-sideEye-icon mb-0 p-0"
                        gutterBottom
                      >
                        <TuneIcon className="mb-0 me-2 p-0" />
                        All Filter ({count})
                      </Typography>
                    </Button>
                  ) : (
                    ""
                  )}
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
                  title="By Pipelines"
                  handleReset={handleReset}
                  btnDisabled={btnDisabled}
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
            {/* lead transfer used only */}
            <DialogBox
              label="Pipeline Transfer"
              openLT={openLT}
              handleToCloseLT={handleToCloseLT}
              contactDropDown={contactDropDown}
              handleLeadMassTransfer={handleListMassTransfer}
              loading={transferLoader}
            />
            <div>
              <div className="searchFilterDiv">
                <TextField
                  size="small"
                  className="searchField"
                  placeholder="Search"
                  type="text"
                  id="messags"
                  name="messags"
                  value={messags}
                  onChange={(e) => handleSearchChange(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {indx === 1 ? (
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
                        title="By Pipelines"
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
                ) : (
                  ""
                )}
              </div>
              <div>
                <Content active={active === 0}>
                  {active === 0 && (
                    <BoardPipeline
                      listData={boardSearch}
                      boardData={boardData}
                    />
                  )}
                </Content>
                <Content active={active === 1}>
                  {active === 1 && (
                    <PipelineTable
                      resetFilter={resetFilter}
                      isDeleted={isDeleted}
                      page={page}
                      handlePageChange={(newPage) => {
                        setPage(newPage)
                        handleSetSearchParam(newPage)
                      }}
                      rowCount={rowCount}
                      handleRowCount={(newCount) => setRowCount(newCount)}
                      listData={[{ listData }, { manage }]}
                      active={active}
                      count={count}
                      srchData={srchData}
                      check={check}
                      dropdownCheck={dropdownCheck}
                      setContactErr={setContactErr}
                    />
                  )}
                </Content>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Lists;
