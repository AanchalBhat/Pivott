import React, { useState, useEffect, useContext } from "react";
// mui

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";

// mui icons
import SearchIcon from "@mui/icons-material/Search";
// other imports
import { DataContext } from "../../../context";
import debouce from "lodash.debounce";
import Actions from "../../../pages/common/Actions";
import "../List.css";
import DraftTable from "./DraftTable";
import { campaignApi } from "../../../apis/campaignApi";
import { getMethodError } from "../../../constants/errorMessages";
import { Toaster } from "../../../pages/common/Toaster";
import MassRenameCampaign from "../../../pages/common/Email Campaigns/MassRenameCampaign";
import { SELECT_ATLEAST_ONE } from "../../../utils/constants";
import { CircularLoader } from "../../../pages/common/CircularLoader";
import { useSearchParams } from "react-router-dom";

let check = false;
let dropdownCheck = false;

const DraftList = () => {
  const {
    setGlobalDraftData,
    draftDataId } = useContext(DataContext)
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDelete, setOpenDelete] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [srchData, setSrchData] = useState(false);
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(0);
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
    if (srchData) {
      CallSearchApi(searchQuery, check);
    }
  }, [page]);


  useEffect(() => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page;
    if (searchParams.get("page")) {
      setPage(page_count);
    }
  }, [page])

  const CallSearchApi = (data) => {
    campaignApi
      .campaignSearch(page, pageSize, "draft", data)

      .then((response) => {
        if (response?.data?.length > 0) {
          if (page === 1) {
            setRowCount(response?.meta?.total_records);
          }
          const attr = response?.data?.map((event, index) => {
            return event?.attributes;
          });
          setGlobalDraftData(attr);
        } else {
          setRowCount(0);
          setGlobalDraftData([]);
        }
      })
      .catch((error) => {
        setGlobalDraftData([]);
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
    } else {
      setSrchData(false);
    }
  };

  const handleMassDelete = () => {
    if (draftDataId?.length > 0) {
      setOpenDelete(true);
    } else {
      setOpenDelete(false);
      Toaster.TOAST(SELECT_ATLEAST_ONE, "error");
    }
  };

  const handleMassRename = () => {
    if (draftDataId.length > 0) {
      setOpenRename(true);
    } else {
      Toaster.TOAST(SELECT_ATLEAST_ONE, "error");
    }
  }

  const handleClose = () => {
    setOpenRename(false);
  }

  const handlePageChange = (newPage) => {
    if (newPage) {
      setSearchParams({ page: newPage })
    } else {
      searchParams.delete("page");
      setSearchParams(searchParams);
    }
    setPage(newPage);
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box component="main" className="ma-emailMainTop-box" sx={{ flexGrow: 1 }}>
          <div className="ma-emailMainShadow-box">
            <div>
              <div className="campaign-searchFilterDiv">
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

                <div className="ma-campaignActions-bar p-0">
                  <Actions actionsData={actionsData} />
                </div>
              </div>
              <div>
                <DraftTable
                  isDeleted={false}
                  page={page}
                  handlePageChange={(newPage) => handlePageChange(newPage)}
                  rowCount={rowCount}
                  handleRowCount={(newCount) => setRowCount(newCount)}
                  srchData={srchData}
                  check={check}
                  dropdownCheck={dropdownCheck}
                  openDelete={openDelete}
                  setOpenDelete={setOpenDelete}
                  setSearchQuery={setSearchQuery}
                  setPage={setPage}
                />
              </div>
              {
                openRename && <MassRenameCampaign
                  handleToCloseLT={handleClose}
                  openLT={openRename}
                />
              }
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default DraftList;
