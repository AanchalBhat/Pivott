import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Drawer,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Autocomplete,
  Avatar,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// other imports
import PotentialTable from "../../components/Potential/PotentialTable";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import { LeadAPI } from "../../apis/LeadApi";
import { PotentialApi } from "../../apis/PotentialApi";
import { userApi } from "../../apis/userApi";
import { potentialDefaultList } from "../../Data/ManageDataList";
import debouce from "lodash.debounce";
import AllLeads from "../common/DropdownFilter";
import FilterByLeads from "../common/FilterByLeads";
import ListName from "../common/ListName";
import ManageData from "../common/ManageData";
import DialogBox from "../common/TransferDialogBox";
import Actions from "../common/Actions";
import Between from "../common/Between";
import Convert from "../common/Convert";
import { Toaster } from "../common/Toaster";
//import global css
import "../../styles/global/common.css";
import "./List.css";
import { ButtonLoader } from "../common/ButtonLoader";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import { FilterAccordion } from "../common/AllFilter/FilterAccordion";
import LeadOwnerDropdown from "../common/LeadOwner";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

let check;
let dropdownCheck = false;

const Lists = () => {
  const location = useLocation();
  const { setGlobalPotential, potentialData, potentialid, setPotenialeId } =
    React.useContext(DataContext);
  const current_page = localStorage.getItem("current_page");
  const [searchParams, setSearchParams] = useSearchParams();
  const [usersData, setUsersData] = useState([]);
  const [allPotential, setAllPotential] = useState("");
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [listData, setListData] = useState();
  const [value, setValue] = useState(searchParams.get("closing_date") || null);
  const [amount, setAmount] = useState(searchParams.get("amount") || "");
  const [stage, setStage] = useState(searchParams.get("potential_stage_id") || "");
  const [manageLoader, setManageLoader] = useState(false);
  const [filterLoader, setFilterLoader] = useState(false);
  const [manage, setManage] = useState(false);
  const [iconId, seticonId] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const allFilterData = localStorage.getItem("all_filter_data") ? JSON.parse(localStorage.getItem("all_filter_data")) : null;
  const currentFilterCount = allFilterData ?
    Object.keys(allFilterData).length :
    null;
  const [count, setCount] = useState(+currentFilterCount || 0);
  const [stageData, setStageData] = useState([]);
  const [openLT, setOpenLT] = React.useState(false);
  const [contact_detail_id, setContactId] = useState("");
  const [contactsValue, setContactsValue] = useState("");
  const [contactErr, setContactErr] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [resetFilter, setResetFilter] = useState(false);
  const [manageDisable, setManageDisable] = useState(false);
  const [srchData, setSrchData] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [transferLoader, setTransferLoader] = useState(false);
  const [page, setPage] = useState(current_page || 1);
  const pageSize = 10;
  const [rowCount, setRowCount] = useState(0);
  const [filterData, setFilterData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [created_date_to, setCreated_date_to] = useState(searchParams.get("created_date_to") || null);
  const [created_date_from, setCreated_date_from] = useState(searchParams.get("created_date_from") || null);
  const [updated_date_to, setUpdated_date_to] = useState(searchParams.get("updated_date_to") || null);
  const [updated_date_from, setUpdated_date_from] = useState(searchParams.get("updated_date_from") || null);
  const [owner_id, setOwner] = useState(searchParams.get("owner_id") || null);
  const isAnyAccordionOpen = activeAccordion.length > 0;
  const [potentialCountry, setPotentialCountry] = useState(searchParams.get("country") || "");
  const [potentialState, setPotentialState] = useState(searchParams.get("state") || "");
  const [potentialCity, setPotentialCity] = useState(searchParams.get("city") || "");
  const [leadSourceArray, setLeadSourceArray] = useState([]);
  const [leadSources, setLeadSources] = useState(searchParams.get("lead_source_id") || "");
  const [typeArray, setTypeArray] = useState([]);
  const [type, setType] = useState(searchParams.get("stage_type_id") || "");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [manageState, setManageState] = useState({
    company_name: 1,
    email: 1,
    phone_number: 1,
    lead_source_id: 1,
    first_name: 1,
    last_name: 1,
    owner: 1,
    potential_stage_id: 1,
    amount: 1,
  });
  const [userLoading, setUserLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [searchAccordianQuery, setSearchAccordianQuery] = useState("");
  let filterCount = 0;
  const data = useMemo(
    () => [{ eventKey: "deal", label: "Convert to Deal" }],
    []
  );

  const allFilterDataKeys = [
    "created_date_from", "created_date_to",
    "updated_date_from", "updated_date_to",
    "lead_source_id", "potential_stage_id", "amount",
    "closing_date", "stage_type_id", "owner_id",
    "city", "state", "country"
  ]
  useEffect(() => {
    if (
      (searchParams.get("created_date_from") ||
        searchParams.get("created_date_to") ||
        searchParams.get("updated_date_from") ||
        searchParams.get("updated_date_to") ||
        searchParams.get("lead_source_id") ||
        searchParams.get("potential_stage_id") ||
        searchParams.get("amount") ||
        searchParams.get("closing_date") ||
        searchParams.get("stage_type_id") ||
        searchParams.get("owner_id") ||
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
      value: "potential_delete",
      handleClick: () => handlePotentialDelete(),
      title: "Potential Delete",
    },
    {
      id: 2,
      value: "potential_transfer",
      handleClick: () => handleTransferPotential(),
      title: "Potential Transfer",
    },
    {
      id: 3,
      value: "covert_potential",
      handleClick: () => handleConvertPotential(),
      title: "Mass Convert Deal",
    },
  ];

  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData().then((response) => {
      setLeadSourceArray(response?.data);
      setFlag((prev) => !prev);
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
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const defaultList = [
    {
      id: 0,
      data: "Company",
      field_name: "company_name",
    },
    {
      id: 1,
      data: "Email",
      field_name: "email",
    },
    {
      id: 2,
      data: "Phone",
      field_name: "phone_number",
    },
    {
      id: 3,
      data: "Lead Source",
      field_name: "lead_source_id",
    },
    {
      id: 4,
      data: "Potential Owner",
      field_name: "owner",
    },
    {
      id: 5,
      data: "Stage",
      field_name: "stage",
    },
    {
      id: 6,
      data: "Amount",
      field_name: "amount",
    },
  ];

  const [itemList, setItemList] = useState(defaultList);

  useEffect(() => {
    if (searchParams?.get("page")) {
      setPage(searchParams?.get("page"));
    }
    dropdownCheck = false;
    // check = false;
  }, []);

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
    Object.keys(JSON.parse(potentialData)).forEach(function (key) {
      if (!JSON.parse(potentialData)[key]) {
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
      };
    } else {
      if (iconId?.length !== 8) {
        data = {
          operation_type: "update",
          field_name: manageState,
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
          setItemList(potentialDefaultList);
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
    debouce(function (e, check) {
      if (srchData)
        CallPotentialSearchApi(e, check);
    }, 600),
    [srchData]
  );

  useEffect(() => {
    if (srchData) {
      CallPotentialSearchApi(searchQuery, check);
    }
  }, [page]);

  const CallPotentialSearchApi = (data, check) => {
    PotentialApi.getPotentialSearch(data, page, pageSize, check, dropdownCheck)

      .then((response) => {
        if (response?.data?.length > 0) {
          setRowCount(response?.meta?.total_records);
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalPotential(attr);
        } else {
          setRowCount(0);
          setGlobalPotential([]);
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
      setSearchParams({ page: 1 })
      setSrchData(false);
    }
  };

  const handleConvertPotential = () => {
    let data = {
      potential_ids: potentialid,
      convert_to: "deal",
    };
    if (potentialid?.length > 0) {
      PotentialApi.massConvert({ data })

        .then((response) => {
          setPotenialeId([]);
          setSearchQuery("");
          Toaster.TOAST(response?.message, "success");
          navigate("/deal");
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      Toaster.TOAST("Please select anyone entry", "error");
    }
  };

  const handlePotentialDelete = () => {
    let data = {
      potential_ids: potentialid,
    };
    if (potentialid?.length > 0) {
      PotentialApi.massDelete({ data })
        .then((response) => {
          setPotenialeId([]);
          setSearchQuery("");
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

  const toggleDrawer = () => {
    setOpen(!open);
    setAccordionFilterData(accordionData);
    setSearchAccordianQuery("");
  };
  const toggleDrawerAction = () => {
    setOpenAction(!openAction);
    setManage(false);
    setItemList(potentialDefaultList);
  };

  const butonopen = Boolean(null);
  const handleClick = (event) => {
    navigate(`/potential/create`);
  };
  const navigate = useNavigate();

  const handleManageSearch = (e) => {
    let val = e.target.value;
    var updatedList = [...potentialDefaultList];
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
        potential_stage_id: parseInt(stage),
      };
    }
    if (type) {
      filterCount++;
      data = {
        ...data,
        stage_type_id: type,
      };
    }
    if (potentialCountry?.name) {
      filterCount++;
      data = {
        ...data,
        country: potentialCountry?.name,
      };
    }
    if (potentialState?.name) {
      filterCount++;
      data = {
        ...data,
        state: potentialState?.name,
      };
    }
    if (potentialCity?.name) {
      filterCount++;
      data = {
        ...data,
        city: potentialCity?.name,
      };
    }
    if (amount) {
      filterCount++;
      data = {
        ...data,
        amount: amount,
      };
    }
    if (value) {
      filterCount++;
      data = {
        ...data,
        closing_date: value,
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
        potentialCity ||
        potentialCountry ||
        potentialState ||
        stage ||
        amount ||
        type ||
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
    PotentialApi.getFilter(data, page, pageSize, dropdownCheck)
      .then((response) => {
        check = true;
        setBtnDisabled(false);
        if (response?.data) {
          setListData(response?.data);
          // if (page === 1) {
          setRowCount(response?.meta?.total_records);
          // }
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalPotential(attr);
          setOpen(false);
          setOpenAction(false);
          setSearchQuery("");
          setSearchAccordianQuery("");
          setSrchData(false);
        } else {
          setGlobalPotential([]);
          setSearchQuery("");
          setSearchAccordianQuery("");
          setRowCount(0);
          setOpen(false);
          setOpenAction(false);
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
    setLeadSources("");
    setType("");
    setPotentialCity("");
    setPotentialCountry("");
    setPotentialState("");
    setAmount("");
    setStage("");
    setOwner("");
    setContactsValue("");
  };

  const handleClear = (val) => {
    setActiveAccordion([]);
    handleClearFilter();
    setSearchAccordianQuery("");
    if (val === "close") {
      toggleDrawer();
    } else if (val === "clear" && count !== 0) {
      setActiveAccordion([]);
      setCount(0);
      setResetFilter((prev) => !prev);
      setBtnDisabled(true);
      handleClearFilter();
      setPage(1);
      setSearchParams({ page: 1 })
      allFilterDataKeys.map(elem => {
        searchParams.delete(elem)
      })
      setSearchParams(searchParams);
      localStorage.removeItem("all_filter_data");
      check = false;
    }
  };

  const handleReset = () => {
    toggleDrawer();
    setSearchAccordianQuery("");
    setResetFilter((prev) => !prev);
    handleClearFilter();
    setCount(0);
    setPage(1);
    setSearchParams({ page: 1 })
    allFilterDataKeys.map(elem => {
      searchParams.delete(elem)
    })
    setSearchParams(searchParams);
    localStorage.removeItem("all_filter_data");
    check = false;
    setBtnDisabled(true);
  };

  useEffect(() => {
    getStageData();
  }, []);

  useEffect(() => {
    if (potentialData) {
      setManageState(JSON.parse(potentialData));
      getData();
    }
  }, [potentialData]);

  const handleStageList = (e) => {
    let val = e.target.value;
    setAllPotential(val);
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
    PotentialApi.getDropdownFilter(val, page, pageSize, check)

      .then((response) => {
        if (response?.data) {
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          // if (page === 1) {
          setRowCount(response?.meta?.total_records);
          // }
          setSearchQuery("");
          setGlobalPotential(attr);
          setSrchData(false);
        } else {
          setGlobalPotential([]);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (allPotential && !srchData && !check && !dropdownCheck) {
      handleDropdownFilter(allPotential);
    }
  }, [page, isDeleted, check]);

  const handleConvert = (val) => {
    if (potentialid?.length === 1) {
      let data = {
        potential_ids: potentialid,
        convert_to: val,
      };

      PotentialApi.massConvert({ data })
        .then((response) => {
          if (response) {
            setPotenialeId([]);
            Toaster.TOAST(response?.message, "success");
            navigate(`/deal/create/${response?.record_id}`);
          } else {
            setPotenialeId([]);
          }
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else if (potentialid?.length === 0) {
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
        id="leadowner"
        loading={userLoading}
        noOptionsText={"You have no other user to transfer the potential."}
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
  const handleTransferPotential = () => {
    if (potentialid?.length > 0) {
      setOpenLT(true);
    } else {
      setOpenLT(false);
      Toaster.TOAST("Please select any entry", "error");
    }
  };

  const handleListMassTransfer = () => {
    let data = {
      potential_ids: potentialid,
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
    PotentialApi.potentialTransfer({ data })

      .then((response) => {
        setTransferLoader(false);
        if (response) {
          setPotenialeId([]);
          Toaster.TOAST(response?.message, "success");
          setContactErr("");
          setContactsValue("");
          setOpenLT(false);
          setIsDeleted((prev) => !prev);
        } else {
          setPotenialeId([]);
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
      manageState?.company_name === 1 &&
      manageState?.email === 1 &&
      manageState?.phone_number === 1 &&
      manageState?.first_name === 1 &&
      manageState?.last_name === 1 &&
      manageState?.lead_source_id === 1 &&
      manageState?.owner === 1 &&
      manageState?.stage === 1 &&
      manageState?.amount === 1
    );
  };

  const dropdownFilterData = stageData?.map((elem, key) => {
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
      elementName: "Potentials by Stage",
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
      elementName: "Potentials by Amount",
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
    {
      elementName: "Potentials by Country",
      content: (
        <Select
          title="Country"
          placeholder="Select country"
          name="potentialcountry"
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
          isClearable={() => setPotentialCountry("")}
          getOptionValue={(options) => {
            return options["name"];
          }}
          value={potentialCountry}
          onChange={(value) => {
            setPotentialCountry(value);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Potentials by State",
      content: (
        <Select
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          fullWidth
          id="state"
          name="state"
          placeholder="Select state"
          options={State.getStatesOfCountry(potentialCountry?.isoCode)}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          isClearable={() => setPotentialState("")}
          value={potentialState}
          onChange={(item) => {
            setPotentialState(item);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Potentials by City",
      content: (
        <Select
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          fullWidth
          id="city"
          name="city"
          isClearable={() => setPotentialCity("")}
          placeholder="Select city"
          options={City.getCitiesOfState(
            potentialState?.countryCode,
            potentialState?.isoCode
          )}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          value={potentialCity}
          onChange={(item) => {
            setPotentialCity(item);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Potentials by Source",
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
      elementName: "Potentials by Type",
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
      elementName: "Potentials by Closing Date",
      content: (
        <div className="leadfilterDCforminput">
          <div className="leadfilterDCformlable">Closing Date</div>
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
        </div>
      ),
    },
    {
      elementName: "Potentials by Owner",
      content: (
        <LeadOwnerDropdown
          label="Potential Owner"
          userLoading={userLoading}
          placeholder="potential owner"
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
      if (elementName === "Potentials by Stage") {
        getStageData();
      }
      if (elementName === "Potentials by Source") {
        getLeadSourceData();
      }
      if (elementName === "Potentials by Type") {
        getTypeData();
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
                    data-testid="potential-list"
                    aria-haspopup="true"
                    aria-expanded={butonopen ? "true" : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    startIcon={<AddIcon />}
                  >
                    Create Potential
                  </Button>
                  <AllLeads
                    alignParam={["bottom", -35, "top", "left"]}
                    title="All Potentials"
                    allLead={allPotential}
                    handleList={handleStageList}
                    leadArray={dropdownFilterData}
                  />
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
                    <CloseIcon />
                  </Button>
                </div>
                <FilterByLeads
                  title="By Potentials"
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
              label="Potential Transfer"
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
                      title="By Potential"
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
                <PotentialTable
                  isDeleted={isDeleted}
                  resetFilter={resetFilter}
                  page={page}
                  handlePageChange={(newPage) => {
                    setPage(newPage)
                    handleSetSearchParam(newPage)
                  }}
                  rowCount={rowCount}
                  handleRowCount={(newCount) => setRowCount(newCount)}
                  listData={[{ listData }, { manage }]}
                  count={count}
                  srchData={srchData}
                  check={check}
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

export default Lists;
