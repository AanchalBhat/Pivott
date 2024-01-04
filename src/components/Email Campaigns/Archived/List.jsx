import React, { useState, useEffect, useContext } from "react";
// mui
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

// other imports
import { DataContext } from "../../../context";
import debouce from "lodash.debounce";
import "../List.css";
import ArchivedTable from "./ArchivedTable";
import CampaignsBar from "../CampaignsBar";
import { campaignApi } from "../../../apis/campaignApi";
import { getMethodError } from "../../../constants/errorMessages";
import { Toaster } from "../../../pages/common/Toaster";
import MassRenameCampaign from "../../../pages/common/Email Campaigns/MassRenameCampaign";
import { useSearchParams } from "react-router-dom";
import { SELECT_ATLEAST_ONE } from "../../../utils/constants";

let check = false;
let dropdownCheck = false;

let allDropdown = [
  { id: 1, label: "Sent", value: "sent" },
  { id: 2, label: "Cancelled", value: "cancelled" },
];

const ArchivedList = () => {
  const { setGlobalArchiveCampaign, archiveCampaignId } =
    useContext(DataContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [srchData, setSrchData] = useState(false);
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(0);
  const [allDropdownData, setAllDropdownData] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [isCampaign, setIsCampaign] = useState(false);
  const [value, setValue] = useState(
    searchParams.get("filter") ? searchParams.get("filter") : "All"
  );
  const pageSize = 10;
  const actionsData = [
    {
      id: 1,
      value: "rename",
      handleClick: () => handleMassRename(),
      title: "Rename",
    },
    {
      id: 2,
      value: "move to campaigns",
      handleClick: () => handleMoveCampaign(),
      title: "Move to Campaigns",
    },
    {
      id: 3,
      value: "delete",
      handleClick: () => handleMassDelete(),
      title: "Delete",
    },
  ];

  const debounceSave = React.useCallback(
    debouce(function (e, check) {
      CallSearchApi(e, check);
    }, 600),
    []
  );
  useEffect(() => {
    check = false;
    dropdownCheck = false;
  }, []);

  useEffect(() => {
    if (srchData) {
      CallSearchApi(searchQuery, check);
    }
  }, [page])

  const CallSearchApi = (data, check) => {
    campaignApi
      .campaignSearch(page, pageSize, "is_archived", data)

      .then((response) => {
        if (response?.data?.length > 0) {
          if (page === 1) {
            setRowCount(response?.meta?.total_records);
          }
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalArchiveCampaign(attr);
        } else {
          setRowCount(0);
          setGlobalArchiveCampaign([]);
        }
      })
      .catch((error) => {
        setGlobalArchiveCampaign([]);
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
      if (searchParams.get("filter")) {
        setSearchParams({ filter: value, page: 1 })
      } else {
        setSearchParams({ page: 1 })
      }
    }
    if (data) {
      setSrchData(true);
    } else {
      setSrchData(false);
    }
  };

  useEffect(() => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page;
    if (!srchData && allDropdownData && value !== "All") {
      handleDropdownFilter(allDropdownData);
    }
    if (searchParams.get("page")) {
      setPage(page_count);
    }
  }, [page]);

  const handleAllDropdown = (e) => {
    let val = e.target.value;
    setValue(val);
    if (val) {
      setSearchParams({ filter: val, page: page });
    } else {
      searchParams.delete("filter");
      searchParams.delete("page");
      setSearchParams(searchParams);
      setValue("All");
    }

    setAllDropdownData(val);
    if (val) {
      dropdownCheck = true;
    } else {
      dropdownCheck = false;
      setPage(1)
    }
    handleDropdownFilter(val);
  };

  const handleDropdownFilter = (val) => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
    setLoader(true);
    campaignApi.getStatusFilter(page_count, pageSize, val, true, true)
      .then((response) => {
        if (response?.data) {
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          if (page != 1 && !response?.meta?.next_page && !response?.meta?.previous_page) {
            setPage(1);
            setSearchParams({ filter: val, page: 1 });
          }
          setRowCount(response?.meta?.total_records);
          setLoader(false);
          setGlobalArchiveCampaign(attr);
          setSearchQuery("");
        } else {
          setLoader(false);
          setGlobalArchiveCampaign([]);
        }
        setSrchData(false);
      })
      .catch((error) => {
        setLoader(false);
        setGlobalArchiveCampaign([]);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  
  useEffect(() => {
    if (value !== "All") {
      handleDropdownFilter(value);
      setAllDropdownData(value);
    }
  }, []);

  const handleMoveCampaign = () => {
    checkIdLength();
  };

  const checkIdLength = () => {
    if (archiveCampaignId?.length > 0) {
      setIsCampaign(true);
    } else {
      Toaster.TOAST(SELECT_ATLEAST_ONE, "error");
      setIsCampaign(false);
    }
  };

  const handleMassDelete = () => {
    if (archiveCampaignId?.length > 0) {
      setOpenDelete(true);
    } else {
      setOpenDelete(false);
      Toaster.TOAST(SELECT_ATLEAST_ONE, "error");
    }
  };

  const dropdownFilterData = allDropdown?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem?.value}>
        {elem?.label}
      </MenuItem>
    );
  });

  const handleMassRename = () => {
    if (archiveCampaignId.length > 0) {
      setOpenRename(true);
    } else {
      Toaster.TOAST(SELECT_ATLEAST_ONE, "error");
    }
  };

  const handleClose = () => {
    setOpenRename(false);
  };

  const handlePageChange = (newPage) => {
    if (searchParams.get("filter")) {
      setSearchParams({ filter: value, page: newPage })
    } else {
      setSearchParams({ page: newPage })
    }
    setPage(newPage)
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          className="ma-emailMainTop-box"
          sx={{ flexGrow: 1 }}
        >
          <div className="ma-emailMainShadow-box">
            <div>
              <CampaignsBar
                handleSearchChange={handleSearchChange}
                searchQuery={searchQuery}
                actionsData={actionsData}
                allDropdownData={
                  searchParams.get("filter") && searchParams.get("filter") !== "All"
                    ? searchParams.get("filter")
                    : allDropdownData
                }
                handleAllDropdown={handleAllDropdown}
                dropdownFilterData={dropdownFilterData}
              />

              <div>
                <ArchivedTable
                  page={page}
                  handlePageChange={(newPage) => handlePageChange(newPage)}
                  rowCount={rowCount}
                  handleRowCount={(newCount) => setRowCount(newCount)}
                  srchData={srchData}
                  check={check}
                  dropdownCheck={dropdownCheck}
                  openDelete={openDelete}
                  setOpenDelete={setOpenDelete}
                  isCampaign={isCampaign}
                  setIsCampaign={setIsCampaign}
                  value={value}
                  setSearchQuery={setSearchQuery}
                />
              </div>
              {openRename && (
                <MassRenameCampaign
                  handleToCloseLT={handleClose}
                  openLT={openRename}
                />
              )}
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default ArchivedList;
