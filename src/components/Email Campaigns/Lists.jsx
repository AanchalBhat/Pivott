import React, { useState, useEffect, useContext, useCallback } from "react";
// mui
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

// other imports
import { DataContext } from "../../context";
import debouce from "lodash.debounce";
import "./List.css";
import CampaignTable from "./CampaignTable";
import CampaignsBar from "./CampaignsBar";
import "../../styles/custom/EmailCampaigns/List.css";
import { getMethodError } from "../../constants/errorMessages";
import { campaignApi } from "../../apis/campaignApi";
import { Toaster } from "../../pages/common/Toaster";
import { EMAIL_SCHEDULED, EMAIL_SENT, EMAIL_CANCELLED, IS_CANCEL, SELECT_ATLEAST_ONE } from "../../utils/constants";
import { ARCHIVE_CAMPAIGNS, CANCEL_ARCHIVE } from "../../constants/routes";
import MassRenameCampaign from "../../pages/common/Email Campaigns/MassRenameCampaign";
import { useSearchParams } from "react-router-dom";
import { CircularLoader } from "../../pages/common/CircularLoader";

let check = false;
let dropdownCheck = false;
let allDropdown = [
  { id: 1, label: "Scheduled", value: "scheduled" },
  { id: 2, label: "Sending", value: "sending" },
  { id: 3, label: "Sent", value: "sent" },
  { id: 4, label: "Cancelled", value: "cancelled" },
];

const Lists = () => {
  const { setGlobalEmailCampaign, emailCampaignId } = useContext(DataContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, setLoader] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [moveData, setMoveData] = useState("");
  const [isCampaign, setIsCampaign] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [srchData, setSrchData] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [allDropdownData, setAllDropdownData] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [value, setValue] = useState(
    searchParams.get("filter") ? searchParams.get("filter") : "All"
  );
  const [actionsData, setActionsData] = useState([]);

  const commonActions = [
    {
      id: 1,
      value: "rename",
      handleClick: () => handleMassRename(),
      title: "Rename",
    },
    {
      id: 2,
      value: "delete",
      handleClick: () => handleMassDelete(),
      title: "Delete",
    },
  ];

  const scheduledActions = [
    {
      id: 3,
      value: "cancel",
      handleClick: () => handleCancel(),
      title: "Cancel",
    },
    {
      id: 4,
      value: "cancel and archive",
      handleClick: () => handleCancelArchive(),
      title: "Cancel & Move to Archive",
    },
  ];

  const sentCancelledActions = [
    {
      id: 5,
      value: "move to archive",
      handleClick: () => handleMoveToArchive(),
      title: "Move to Archive",
    },
  ];

  const updateActionsData = () => {
    let updatedActionsData = [...commonActions];

    if (allDropdownData === EMAIL_SCHEDULED) {
      updatedActionsData = [
        ...updatedActionsData,
        ...scheduledActions,
      ];
    }

    if (allDropdownData === EMAIL_SENT || allDropdownData === EMAIL_CANCELLED) {
      updatedActionsData = [
        ...updatedActionsData,
        ...sentCancelledActions,
      ];
    }

    setActionsData(updatedActionsData);
  };

  useEffect(() => {
    updateActionsData();
  }, [allDropdownData, emailCampaignId]);

  useEffect(() => {
    check = false;
    dropdownCheck = false;
    window.scroll(0, 0);
  }, []);

  const debounceSave = React.useCallback(
    debouce(function (e, check) {
      CallSearchApi(e, check);
    }, 600),
    []
  );

  useEffect(() => {
    if (srchData) {
      CallSearchApi(searchQuery, check);
    }
  }, [page]);

  const CallSearchApi = (data) => {
    campaignApi
      .campaignSearch(page, pageSize, "", data)

      .then((response) => {
        if (response?.data?.length > 0) {
          if (page === 1) {
            setRowCount(response?.meta?.total_records);
          }
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalEmailCampaign(attr);
        } else {
          setRowCount(0);
          setGlobalEmailCampaign([]);
        }
      })
      .catch((error) => {
        setGlobalEmailCampaign([]);
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
      setPage(1)
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
      setValue("All")
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
    setLoader(true)
    campaignApi.getStatusFilter(page_count, pageSize, val, false, false)
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
          setGlobalEmailCampaign(attr);
          setSearchQuery("")
        } else {
          setLoader(false);
          setGlobalEmailCampaign([]);
        }
        setSrchData(false);
      })
      .catch((error) => {
        setLoader(false);
        setGlobalEmailCampaign([]);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  }

  useEffect(() => {
    if (value !== "All") {
      handleDropdownFilter(value);
      setAllDropdownData(value);
    }
  }, []);

  const handleMoveToArchive = () => {
    checkIdLength();
    setMoveData(ARCHIVE_CAMPAIGNS.substring(1));
  };

  const handleCancel = () => {
    checkIdLength()
    setMoveData(IS_CANCEL)
  }

  const handleCancelArchive = () => {
    checkIdLength();
    setMoveData(CANCEL_ARCHIVE.substring(1));
  };

  const checkIdLength = () => {
    if (emailCampaignId?.length > 0) {
      setIsCampaign(true);
    } else {
      Toaster.TOAST(SELECT_ATLEAST_ONE, "error");
      setIsCampaign(false);
    }
  };

  const handleMassDelete = () => {
    if (emailCampaignId?.length > 0) {
      setOpenDelete(true);
    } else {
      setOpenDelete(false)
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
    if (emailCampaignId.length > 0) {
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
    setPage(newPage);
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
            {/* lead transfer used only */}
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
                <CampaignTable
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
                  moveData={moveData}
                  value={value}
                  setSearchQuery={setSearchQuery}
                  setSearchParams={setSearchParams}
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

export default Lists;
