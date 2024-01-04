import React, { useState, useEffect, useContext } from "react";
// mui
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
// mui icons
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// other imports
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import { LeadAPI } from "../../apis/LeadApi";
import { DealsApi } from "../../apis/DealsApi";
import { dealsDefaultList } from "../../Data/ManageDataList";
import DealsTable from "../../components/Deals/DealsTable";
import debouce from "lodash.debounce";
import ManageData from "../common/ManageData";
import DialogBox from "../common/TransferDialogBox";
import Actions from "../common/Actions";
import Between from "../common/Between";
import FilterByLeads from "../common/FilterByLeads";
import ListName from "../common/ListName";
import AllLeads from "../common/DropdownFilter";
import { Toaster } from "../common/Toaster";
import { userApi } from "../../apis/userApi";
import "./List.css";
import { ButtonLoader } from "../common/ButtonLoader";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import { FilterAccordion } from "../common/AllFilter/FilterAccordion";
import LeadOwnerDropdown from "../common/LeadOwner";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { IconButton } from "@mui/material";

let check;
let dropdownCheck = false;

const Lists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const current_page = localStorage.getItem("current_page");
  const { dealPopupId, setGlobalDeals, dealData, setDealPopupId } =
    useContext(DataContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [usersData, setUsersData] = useState([]);
  const [allDeals, setAllDeals] = useState("");
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [listData, setListData] = useState();
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
  const [openLT, setOpenLT] = React.useState(false);
  const [contact_detail_id, setContactId] = useState("");
  const [term, setTerm] = useState(searchParams.get("deal_terms") || "");
  const [payment_mode, setPayment_mode] = useState(searchParams.get("payment_mode_id") || "");
  const [valueData, setValueData] = useState(searchParams.get("value") || "");
  const [tenure, setTenure] = useState(searchParams.get("tenure") || "");
  const [contactsValue, setContactsValue] = useState("");
  const [contactErr, setContactErr] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resetFilter, setResetFilter] = useState(false);
  const [manageDisable, setManageDisable] = useState(false);
  const [srchData, setSrchData] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  // const [page, setPage] = useState(1);
  const [page, setPage] = useState(current_page || 1);
  const pageSize = 10;
  const [rowCount, setRowCount] = useState(0);
  const [filterData, setFilterData] = useState("");
  const [transferLoader, setTransferLoader] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [created_date_to, setCreated_date_to] = useState(searchParams.get("created_date_to") || null);
  const [created_date_from, setCreated_date_from] = useState(searchParams.get("created_date_from") || null);
  const [updated_date_to, setUpdated_date_to] = useState(searchParams.get("updated_date_to") || null);
  const [updated_date_from, setUpdated_date_from] = useState(searchParams.get("updated_date_from") || null);
  const [owner_id, setOwner] = useState(searchParams.get("owner_id") || null);
  const [dealCountry, setDealCountry] = useState(searchParams.get("country") || "");
  const [dealState, setDealState] = useState(searchParams.get("state") || "");
  const [dealCity, setDealCity] = useState(searchParams.get("city") || "");
  const [kick_off_date, setKick_off_date] = useState(searchParams.get("kick_off_date") || null);
  const [openCalendar1, setOpenCalendar1] = useState(false);
  const [openCalendar2, setOpenCalendar2] = useState(false);
  const [sign_off_date, setSign_off_date] = useState(searchParams.get("sign_off_date") || null);
  const [leadSourceArray, setLeadSourceArray] = useState([]);
  const [leadSources, setLeadSources] = useState(searchParams.get("lead_source_id") || "");
  const [flag, setFlag] = useState(false);
  const [searchAccordianQuery, setSearchAccordianQuery] = useState("");
  let filterCount = 0;
  const isAnyAccordionOpen = activeAccordion.length > 0;
  const [manageState, setManageState] = useState({
    company_name: 1,
    email: 1,
    phone_number: 1,
    first_name: 1,
    last_name: 1,
    owner: 1,
    sign_off_date: 1,
    value: 1,
    payment_mode_id: 1,
    tenure: 1,
    deal_terms: 1,
  });
  const [userLoading, setUserLoading] = useState(false);

  const allFilterDataKeys = [
    "created_date_from", "created_date_to", "updated_date_from", "updated_date_to", "lead_source_id",
    "tenure", "payment_mode_id", "value", "deal_terms", "sign_off_date", "kick_off_date", "owner_id",
    "city", "state", "country"
  ]
  useEffect(() => {
    if (searchParams.get("kick_off_date")) {
      setOpenCalendar1(true);
    } else if (searchParams.get("sign_off_date")) {
      setOpenCalendar2(true);
    }
    if (
      (searchParams.get("created_date_from") ||
        searchParams.get("created_date_to") ||
        searchParams.get("updated_date_from") ||
        searchParams.get("updated_date_to") ||
        searchParams.get("lead_source_id") ||
        searchParams.get("tenure") ||
        searchParams.get("payment_mode_id") ||
        searchParams.get("value") ||
        searchParams.get("deal_terms") ||
        searchParams.get("sign_off_date") ||
        searchParams.get("kick_off_date") ||
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
        localStorage.setItem("current_page", searchParams.get("page"));
      else
        localStorage.setItem("current_page", 1);
    }
  }, [searchParams]);

  const actionsData = [
    {
      id: 1,
      value: "deal_delete",
      handleClick: () => handleDealDelete(),
      title: "Deal Delete",
    },
    {
      id: 2,
      value: "deal_transfer",
      handleClick: () => handleTransferDeal(),
      title: "Deal Transfer",
    },
  ];

  // const payment_termsArr = ["cash", "cheque", "online", "other"];
  const [paymentModeArray, setPaymentModeArray] = useState([]);
  const [itemList, setItemList] = useState(dealsDefaultList);

  const getPaymentModeData = () => {
    DealsApi.getPaymentModeData()
      .then((response) => {
        if (response?.data) {
          setPaymentModeArray(response?.data);
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

  useEffect(() => {
    if (searchParams?.get("page")) {
      setPage(searchParams?.get("page"));
    }
    dropdownCheck = false;
    getPaymentModeData();
  }, []);

  const handlePaymentList = (e) => {
    let val = e.target.value;
    setAllDeals(val);
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
    DealsApi.getDropdownFilter(val, page, pageSize, check)

      .then((response) => {
        if (response?.data) {
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          // if (page === 1) {
          setRowCount(response?.meta?.total_records);
          // }
          // check = true;
          setSrchData(false);
          setSearchQuery("");
          setGlobalDeals(attr);
        } else {
          setGlobalDeals([]);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        // setGlobalDeals([]);
        console.log(error);
      });
  };

  useEffect(() => {
    if (allDeals && !srchData && !check && !dropdownCheck) {
      handleDropdownFilter(allDeals);
    }
  }, [page, isDeleted, check]);

  function handleclose(obj, index, id) {
    setManageDisable(true);
    setManageState({ ...manageState, [obj?.field_name]: id });
    if (id) {
      seticonId((iconId) => iconId?.filter((elId) => elId !== obj?.id));
    } else {
      seticonId((iconId) => iconId?.concat(obj?.id));
    }
  }

  const getData = () => {
    Object.keys(JSON.parse(dealData)).forEach(function (key) {
      if (!JSON.parse(dealData)[key]) {
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
          setItemList(dealsDefaultList);
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
        CallDealSearchApi(e, check);
    }, 600),
    [srchData]
  );

  useEffect(() => {
    if (srchData) {
      CallDealSearchApi(searchQuery, check);
    }
  }, [page]);

  const CallDealSearchApi = (data, check) => {
    DealsApi.getDealSearch(data, page, pageSize, check, dropdownCheck)

      .then((response) => {
        if (response?.data?.length > 0) {
          // if (page === 1) 
          setRowCount(response?.meta?.total_records);
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalDeals(attr);
        } else {
          setGlobalDeals([]);
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

  const handleDealDelete = () => {
    let data = {
      deal_ids: dealPopupId,
    };
    // setIsDeleted(false);
    if (dealPopupId?.length > 0) {
      DealsApi.massDelete({ data })
        .then((response) => {
          setDealPopupId([]);
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
    setItemList(dealsDefaultList);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const butonopen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    navigate(`/deal/create`);
  };

  const handleManageSearch = (e) => {
    let val = e.target.value;
    var updatedList = [...dealsDefaultList];
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
    if (term) {
      filterCount++;
      data = {
        ...data,
        deal_terms: term,
      };
    }
    if (valueData) {
      filterCount++;
      data = {
        ...data,
        value: valueData,
      };
    }
    if (dealCountry?.name) {
      filterCount++;
      data = {
        ...data,
        country: dealCountry?.name,
      };
    }
    if (dealState?.name) {
      filterCount++;
      data = {
        ...data,
        state: dealState?.name,
      };
    }
    if (dealCity?.name) {
      filterCount++;
      data = {
        ...data,
        city: dealCity.name,
      };
    }
    if (payment_mode) {
      filterCount++;
      data = {
        ...data,
        payment_mode_id: payment_mode,
      };
    }
    if (tenure) {
      filterCount++;
      data = {
        ...data,
        tenure: tenure,
      };
    }
    if (kick_off_date) {
      filterCount++;
      data = {
        ...data,
        kick_off_date: kick_off_date,
      };
    }
    if (sign_off_date) {
      filterCount++;
      data = {
        ...data,
        sign_off_date: sign_off_date,
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
        tenure ||
        payment_mode ||
        valueData ||
        term ||
        sign_off_date ||
        kick_off_date ||
        owner_id ||
        dealCity ||
        dealState ||
        dealCountry
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
    DealsApi.getFilter(data, page, pageSize, dropdownCheck)
      .then((response) => {
        check = true;
        setBtnDisabled(false);
        if (response?.data) {
          setListData(response?.data);
          setRowCount(response?.meta?.total_records);
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalDeals(attr);
          setOpen(false);
          setOpenAction(false);
          setSearchQuery("");
          setSearchAccordianQuery("");
          setSrchData(false);
        } else {
          setGlobalDeals([]);
          setRowCount(0);
          setOpen(false);
          setSearchQuery("");
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

  useEffect(() => {
    if (dealData) {
      setManageState(JSON.parse(dealData));
      getData();
    }
  }, [dealData]);

  const handleClearFilter = () => {
    setActiveAccordion([]);
    setTerm("");
    setTenure("");
    setValueData("");
    setPayment_mode("");
    setKick_off_date(null);
    setSign_off_date(null);
    setDealCity("");
    setDealCountry("");
    setLeadSources("");
    setDealState("");
    setUpdated_date_from("");
    setUpdated_date_to("");
    setCreated_date_from("");
    setCreated_date_to("");
    setOwner("");
    setContactsValue("");
  };

  const handleClear = (val) => {
    handleClearFilter();
    setActiveAccordion([]);
    setSearchAccordianQuery("");
    if (val === "close") {
      toggleDrawer();
    } else if (val === "clear" && count !== 0) {
      setActiveAccordion([]);
      setSearchQuery("");
      handleClearFilter();
      setCount(0);
      setResetFilter((prev) => !prev);
      setBtnDisabled(true);
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
    setActiveAccordion([]);
    toggleDrawer();
    setResetFilter((prev) => !prev);
    setSearchQuery("");
    setSearchAccordianQuery("");
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
    check = false;
    setBtnDisabled(true);
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
        noOptionsText={"You have no other user to transfer the deal."}
        id="leadowner"
        loading={userLoading}
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

  const handleToCloseLT = () => {
    setOpenLT(false);
    setContactErr("");
    setContactsValue("");
  };

  const handleTransferDeal = () => {
    if (dealPopupId?.length > 0) {
      setOpenLT(true);
    } else {
      setOpenLT(false);
      Toaster.TOAST("Please select any entry", "error");
    }
  };

  const handleLeadMassTransfer = () => {
    let data = {
      deal_ids: dealPopupId,
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
    DealsApi.dealMassTransfer({ data })

      .then((response) => {
        setTransferLoader(false);
        if (response) {
          setDealPopupId([]);
          Toaster.TOAST(response?.message, "success");
          setOpenLT(false);
          setContactErr("");
          setContactsValue("");
          setIsDeleted((prev) => !prev);
        } else {
          setDealPopupId([]);
        }
      })
      .catch((error) => {
        setTransferLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const stateChange = () => {
    return (
      manageState?.company_name === 1 &&
      manageState?.email === 1 &&
      manageState?.phone_number === 1 &&
      manageState?.first_name === 1 &&
      manageState?.last_name === 1 &&
      manageState?.owner === 1 &&
      manageState?.sign_off_date === 1 &&
      manageState?.value === 1 &&
      manageState?.payment_mode === 1 &&
      manageState?.tenure === 1 &&
      manageState?.deal_terms === 1
    );
  };

  const dropdownFilterData = paymentModeArray?.map((data, key) => {
    return (
      <MenuItem key={key} value={data?.id}>
        {data?.attributes?.name}
      </MenuItem>
    );
  });

  const kick_off_dateCalenderOpen = () => {
    if (openCalendar1) {
      setOpenCalendar1(false);
      setFlag((prev) => !prev);
    } else {
      setOpenCalendar1(true);
      setFlag((prev) => !prev);
    }
  };

  const clearKickDate = () => {
    setOpenCalendar1(false);
    setKick_off_date(null);
    setFlag((prev) => !prev);
  };

  const sign_off_dateCalenderOpen = () => {
    if (openCalendar2) {
      setOpenCalendar2(false);
      setFlag((prev) => !prev);
    } else {
      setOpenCalendar2(true);
      setFlag((prev) => !prev);
    }
  };

  const clearSign_off_dateDate = () => {
    setOpenCalendar2(false);
    setSign_off_date(null);
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
      elementName: "Deals by Term",
      content: (
        <ListName
          title="Deal Term"
          placeholder="Deal term"
          name="term"
          setFlag={setFlag}
          handleChange={(e) => {
            setTerm(e.target.value);
          }}
          value={term}
          select={false}
        />
      ),
    },
    {
      elementName: "Deals by Payment Mode",
      content: (
        <ListName
          title="Payment Mode"
          placeholder="Select payment mode"
          name="payment_mode"
          setFlag={setFlag}
          handleChange={(e) => {
            setPayment_mode(e.target.value);
          }}
          setValue={setPayment_mode}
          value={payment_mode}
          select={true}
          arr={paymentModeArray?.map((data, index) => {
            return (
              <MenuItem key={index} value={data?.id}>
                {data?.attributes?.name}
              </MenuItem>
            );
          })}
        />
      ),
    },
    {
      elementName: "Deals by Sign-off Date",
      content: (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            open={openCalendar2}
            onOpen={() => setOpenCalendar2(true)}
            onClose={() => setOpenCalendar2(false)}
            disablePast
            value={sign_off_date}
            onChange={(newValue) => {
              setSign_off_date(newValue);
              setFlag((prev) => !prev);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="Call Time"
                size="medium"
                id="Deal sign_off_date"
                placeholder="Nov 10,2022"
                onKeyDown={(e) => e.preventDefault()}
                onMouseDown={() => sign_off_dateCalenderOpen()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => clearSign_off_dateDate()}
                        size="small"
                        edge="end"
                      >
                        {sign_off_date && <ClearIcon />}
                      </IconButton>
                      <IconButton
                        onClick={() => setOpenCalendar2(true)}
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
      ),
    },
    {
      elementName: "Deals by Implementation Kick-off",
      content: (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={kick_off_date}
            open={openCalendar1}
            onOpen={() => setOpenCalendar1(true)}
            onClose={() => setOpenCalendar1(false)}
            onChange={(newValue) => {
              setKick_off_date(newValue);
              setFlag((prev) => !prev);
            }}
            renderInput={(params) => (
              <TextField
                data-testid="Call_Time"
                {...params}
                fullWidth
                name="Call Time"
                size="medium"
                id="Deal Implementation Kick-off"
                placeholder="Nov 10,2022"
                onKeyDown={(e) => e.preventDefault()}
                onKeyUp={(e) => e.preventDefault()}
                onMouseDown={() => kick_off_dateCalenderOpen(true)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => clearKickDate()}
                        size="small"
                        edge="end"
                      >
                        {kick_off_date && <ClearIcon />}
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
      ),
    },
    {
      elementName: "Deals by Value",
      content: (
        <ListName
          title="Deal Value"
          placeholder="$ 10,000"
          name="value"
          setFlag={setFlag}
          handleChange={(e) => {
            setValueData(e.target.value);
          }}
          value={valueData}
          select={false}
        />
      ),
    },
    {
      elementName: "Deals by Tenure",
      content: (
        <ListName
          title="Deal Tenure (Week)"
          placeholder="1"
          name="tenure"
          setFlag={setFlag}
          handleChange={(e) => {
            setTenure(e.target.value);
          }}
          value={tenure}
          select={false}
        />
      ),
    },
    {
      elementName: "Deals by Source",
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
      elementName: "Deals by Country",
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
          isClearable={() => setDealCountry("")}
          value={dealCountry}
          onChange={(value) => {
            setDealCountry(value);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Deals by State",
      content: (
        <Select
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          fullWidth
          id="state"
          name="state"
          placeholder="Select state"
          options={State?.getStatesOfCountry(dealCountry?.isoCode)}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          isClearable={() => setDealState("")}
          value={dealState}
          onChange={(item) => {
            setDealState(item);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Deals by City",
      content: (
        <Select
          className="createlead-textField placeholder_field ma-reactSelect-style"
          classNamePrefix="ma-react-select-box"
          fullWidth
          id="city"
          name="city"
          placeholder="Select city"
          options={City.getCitiesOfState(
            dealState?.countryCode,
            dealState?.isoCode
          )}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          isClearable={() => setDealCity("")}
          value={dealCity}
          onChange={(item) => {
            setDealCity(item);
            setFlag((prev) => !prev);
          }}
        />
      ),
    },
    {
      elementName: "Deals by Owner",
      content: (
        <LeadOwnerDropdown
          label="Deal Owner"
          userLoading={userLoading}
          placeholder="Deal owner"
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
      if (elementName === "Deals by Payment Mode") {
        getPaymentModeData();
      }
      if (elementName === "Deals by Source") {
        getLeadSourceData();
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
            label="Deal Transfer"
            openLT={openLT}
            handleToCloseLT={handleToCloseLT}
            contactDropDown={contactDropDown}
            handleLeadMassTransfer={handleLeadMassTransfer}
            loading={transferLoader}
          />
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
                    Create Deals
                  </Button>
                  <AllLeads
                    alignParam={["bottom", -35, "top", "left"]}
                    title="All Deals"
                    allLead={allDeals}
                    handleList={handlePaymentList}
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
                    {/*  toggleDrawer */}
                    <CloseIcon />
                  </Button>
                </div>
                <FilterByLeads
                  title="By Deals"
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
                      title="By Deal"
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
                <DealsTable
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
