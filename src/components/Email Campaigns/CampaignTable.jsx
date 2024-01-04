import React, { useState, useEffect, useContext } from "react";
// mui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useSearchParams } from "react-router-dom";
// other imports
import IconTooltip from "../../pages/common/IconTooltip";
//import global css
import "../../styles/global/common.css";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";
import { Typography } from "@mui/material";
import {
  EMAIL_SENT,
  EMAIL_SENDING,
  EMAIL_SCHEDULED,
  EMAIL_CANCELLED,
  EMAIL_DRAFT,
  DELETE,
  IS_CANCEL,
} from "../../utils/constants";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import { Toaster } from "../../pages/common/Toaster";
import { campaignApi } from "../../apis/campaignApi";
import { DataContext } from "../../context";
import RenameCampaign from "./Common/RenameCampagin";
import { CANCEL_ARCHIVE, ARCHIVE_CAMPAIGNS } from "../../constants/routes";
import { DeleteCampaign } from "./Common/DeleteCampaign";
import "../../styles/custom/EmailCampaigns/List.css";
import EditNoteIcon from '@mui/icons-material/EditNote';

export default function CampaignTable({
  page,
  handlePageChange,
  rowCount,
  handleRowCount,
  check,
  dropdownCheck,
  openDelete,
  setOpenDelete, isCampaign, moveData, setIsCampaign,
  setSearchQuery,
  ...props
}) {
  const {
    globalEmailCampaign,
    setGlobalEmailCampaign,
    emailCampaignId,
    setEmailCampaignObj,
    campaignTableReload,
    setCampaignTableReload,
    setEmailCampaignId,
  } = useContext(DataContext);
  const pageSize = 10;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [rowId, setRowId] = useState("");
  const [campaginName, setCampaginName] = useState("");
  const [gridKey, setGridKey] = useState(0);
  const [searchParams] = useSearchParams();

  const PopupAction = (popupState, value, id) => {
    let ids = [id];
    popupState.close();
    setRowId(id);
    if (value === DELETE) {
      setOpenDelete(true);
    }
    if (
      value === CANCEL_ARCHIVE.substring(1) ||
      value === ARCHIVE_CAMPAIGNS.substring(1)
    ) {
      handleArchive(ids, value);
    }
    if (value === IS_CANCEL) {
      handleCancel(id);
    }
  };

  const handleStatus = (status) => {
    switch (status) {
      case EMAIL_SENT:
        return "ma-sent";
      case EMAIL_SENDING:
        return "ma-sending";
      case EMAIL_SCHEDULED:
        return "ma-scheduled";
      case EMAIL_CANCELLED:
        return "ma-cancelled";
      case EMAIL_DRAFT:
        return "ma-draft";
      default:
        return null;
    }
  };

  const headCells = [
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      width: 400,
      renderCell: (cellValues) => {
        let cell_value = cellValues && cellValues.row;
        const status = cell_value.status;
        const capitalizedStatus = status === EMAIL_SENDING ? "Sent" : (status && status.charAt(0).toUpperCase() + status.slice(1));
        let date_time = status === EMAIL_SENT ? (cell_value?.sent_time && `${capitalizedStatus} on ${cell_value?.sent_time}`) :
          (cell_value?.scheduled_time && `${capitalizedStatus} on ${cell_value?.scheduled_time}`);

        return (
          <Stack className="ma-campaign-nameRow" direction="row" spacing={2}>
            <div
              className="ma-campaign-nameTable"
              onClick={(event) => {
                handleClick(event, cellValues?.row, cellValues?.id);
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "7px",
                }}
              >
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "common.grey",
                        "& .MuiTooltip-arrow": {
                          color: "common.grey",
                        },
                        fontWeight: 400,
                        padding: "6px 12px",
                        fontSize: 12,
                      },
                    },
                  }}
                  arrow
                  title={cell_value.name}
                  placement="top-start"
                >
                  <span className="ma-campaign-userName">
                    {cell_value.name.length < 25
                      ? cell_value.name
                      : cell_value.name.substring(0, 25) + "..."}
                  </span>
                </Tooltip>
                <span className="ma-userPost-table">
                  {date_time}
                </span>
              </div>
            </div>
            <div className="ma-campaign-iconTable">
              <span
                className="ma-campaign-iconContact"
                onClick={() => handleDuplicate(cellValues?.id)}
              >
                <IconTooltip
                  title="Duplicate"
                  icon={<FileCopyOutlinedIcon />}
                />
              </span>
              {cell_value.status !== EMAIL_SENDING && (
                <span
                  onClick={() =>
                    handleChangeRename(cellValues?.id, cell_value.name)
                  }
                  className="ma-campaign-iconContact"
                >
                  <IconTooltip
                    title="Rename"
                    icon={<EditNoteIcon sx={{ fontSize: "25px !important" }} />}
                  />
                </span>
              )}
              {cell_value.status !== EMAIL_SENDING && (
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <>
                      <span
                        className="ma-campaign-iconContact"
                        {...bindTrigger(popupState)}
                      >
                        <IconTooltip
                          title="More"
                          icon={<MoreVertOutlinedIcon />}
                        />
                      </span>
                      <div>
                        <Menu
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: 0,
                            horizontal: 0,
                          }}
                        >
                          {cell_value.status !== EMAIL_SENT &&
                            cell_value.status !== EMAIL_SENDING &&
                            cell_value.status !== EMAIL_CANCELLED && (
                              <MenuItem
                                onClick={() =>
                                  PopupAction(
                                    popupState,
                                    "cancel",
                                    cellValues?.id,
                                    cell_value.name
                                  )
                                }
                              >
                                Cancel
                              </MenuItem>
                            )}

                          <MenuItem
                            onClick={() =>
                              PopupAction(
                                popupState,
                                cell_value.status !== EMAIL_SENT &&
                                  cell_value.status !== EMAIL_CANCELLED
                                  ? "cancel_and_archive"
                                  : "archive_campaigns",
                                cellValues?.id,
                                ""
                              )
                            }
                          >
                            {cell_value.status !== EMAIL_SENT &&
                              cell_value.status !== EMAIL_CANCELLED
                              ? "Cancel & Archive"
                              : "Move to Archive"}
                          </MenuItem>
                          {cell_value.status !== EMAIL_SENDING && (
                            <MenuItem
                              onClick={() =>
                                PopupAction(
                                  popupState,
                                  "delete",
                                  cellValues?.id,
                                  ""
                                )
                              }
                            >
                              Delete
                            </MenuItem>
                          )}
                        </Menu>
                      </div>
                    </>
                  )}
                </PopupState>
              )}
            </div>
          </Stack>
        );
      },
    },
    {
      field: "status",
      sortable: true,
      headerName: "STATUS",
      width: 350,
      renderCell: (params) => {
        const status_email = params && params.row && params.row.status;
        const capitalizedStatus = status_email
          ? status_email.charAt(0).toUpperCase() + status_email.slice(1)
          : "N/A";
        const statusClassName = handleStatus(status_email);
        return (
          <div className="d-flex justify-content-center align-items-center w-100">
            <div className={`status-class ${statusClassName}`}>
              <Typography>{capitalizedStatus}</Typography>
            </div>
          </div>
        );
      },
    },
    {
      field: "delivered",
      sortable: true,
      headerName: "DELIVERED",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) =>
        params.row && params.row.delivered ? params.row.delivered : "-",
    },
    {
      field: "opened",
      sortable: true,
      headerName: "OPENED",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) =>
        params.row && params.row.opened ? params.row.opened : "-",
    },
    {
      field: "clicked",
      sortable: true,
      minWidth: 150,
      flex: 1,
      headerName: "CLICKED",
      valueGetter: (params) =>
        params.row && params.row.clicked ? params.row.clicked : "-",
    },
  ];

  const handlePage = (val) => {
    let data = val + 1;
    handlePageChange(data);
  };

  useEffect(() => {
    check = false;
    dropdownCheck = false;
  }, []);

  useEffect(() => {
    setEmailCampaignId([]);
    if ((!props?.srchData && !check && !dropdownCheck && (props?.value == "All" || searchParams.get("page"))) ||
      !searchParams.get("page") && !searchParams.get("filter")) {
      getData();
    }
  }, [page]);

  useEffect(() => {
    if (campaignTableReload) {
      getData();
    }
  }, [campaignTableReload]);

  const handleClick = (e, rowData, id) => {
    if (props?.value) {
      navigate(
        `/campaign/overview/${rowData.id}?filter=${props.value}&page=${page}`,
        {
          state: { name: "email_campaign", campaignStatus: rowData.status },
        }
      );
    } else {
      navigate(`/campaign/overview/${rowData.id}`, {
        state: { name: "email_campaign", campaignStatus: rowData.status },
      });
    }
  };

  const getData = () => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
    const isFirst = page == 1 ? true : false
    setLoader(true);
    campaignApi
      .campaignSearch(page_count, pageSize, "", null, isFirst)

      .then(function (response) {
        if (response?.data) {
          setLoader(false);
          if (page === 1) {
            handleRowCount(response?.meta?.total_records);
          }
          const attr = response?.data?.map((event, key) => {
            return event.attributes;
          });
          setGlobalEmailCampaign(attr);
          setGridKey((prevKey) => prevKey + 1);
          setCampaignTableReload(false)
        } else {
          setLoader(false);
          setGlobalEmailCampaign([]);
        }
      })
      .catch((error) => {
        setLoader(false);
        setGlobalEmailCampaign([]);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleDuplicate = (id) => {
    navigate(`/campaign/create`, {
      state: { is_duplicate: true, duplicate_id: id },
    });
  };

  const handleChangeRename = (id, name) => {
    setRowId(id);
    setCampaginName(name);
    setOpenRename(true);
  };

  useEffect(() => {
    let isIds = rowId ? [rowId] : emailCampaignId;
    if (
      isCampaign &&
      (moveData === ARCHIVE_CAMPAIGNS.substring(1) ||
        moveData === CANCEL_ARCHIVE.substring(1))
    ) {
      handleArchive(isIds, moveData);
    }
    if (isCampaign && moveData === IS_CANCEL) {
      handleCancel(emailCampaignId);
    }
  }, [isCampaign]);

  const handleArchive = (id, value) => {
    let data = {
      data: {
        email_campaign_ids: id,
      },
    };
    if (value === CANCEL_ARCHIVE.substring(1)) {
      moveAPI(data, CANCEL_ARCHIVE);
    } else {
      moveAPI(data, ARCHIVE_CAMPAIGNS);
    }
  };

  const moveAPI = (data, value) => {
    campaignApi
      .archiveCampaign(data, value)
      .then((response) => {
        setIsCampaign(false);
        getData();
        setEmailCampaignId([]);
        setRowId("");
        Toaster.TOAST(response.message, "success");
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleCancel = (id) => {
    campaignApi
      .cancelCampaign(id)
      .then((res) => {
        getData();
        setIsCampaign(false);
        setEmailCampaignId([]);
        Toaster.TOAST(res?.message, "success");
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleToCloseLT = () => {
    setOpenRename(false);
  };

  return (
    <Box className="ma-main-table" sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <div style={{ height: "700px" }}>
          <DataGrid
            key={gridKey}
            disableColumnFilter
            disableColumnSelector
            rows={globalEmailCampaign}
            columns={headCells}
            paginationMode="server"
            sx={{
              borderLeft: "none",
              borderRight: "none",
              color: "#191A47",
              borderRadius: "0",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                fontSize: "14px",
                textTransform: "uppercase",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#F9F9FB",
                cursor: "pointer",
              },
              ".MuiDataGrid-iconSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-columnHeader": {
                border: "1px solid #E8E8ED",
                borderLeft: "none",
                borderTop: "none",
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                border: "1px solid #E8E8ED",
                borderLeft: "none",
                borderTop: "none",
                backgroundColor: "#F9F9FB",
              },
              "& .MuiDataGrid-columnHeader:nth-last-of-type(1)": {
                borderRight: "none",
              },
            }}
            rowHeight={59.20}
            headerHeight={52}
            pageSize={pageSize}
            rowCount={rowCount}
            rowsPerPageOptions={[pageSize]}
            page={page - 1}
            loader={loader}
            checkboxSelection
            rowKey={(row) => row.id}
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm, e) => {
              const selectedIDs = new Set(itm);
              const selectRows = globalEmailCampaign?.filter((rows) =>
                selectedIDs.has(rows?.id)
              );
              let obj;
              if (selectRows?.length > 0) {
                obj = selectRows?.map((item, index) => {
                  return { id: item?.id, new_name: item?.name };
                });
              }
              setEmailCampaignId(itm);
              setEmailCampaignObj(obj);
            }}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, globalEmailCampaign, "campaign"),
            }}
            disableSelectionOnClick
          />
        </div>
        <RenameCampaign
          title={"email"}
          openLT={openRename}
          handleToCloseLT={() => handleToCloseLT()}
          popupDialogID={rowId}
          getData={() => getData()}
          campaignName={campaginName}
        />
        <DeleteCampaign
          title={"email campaign"}
          content={"email campaign"}
          openDelete={openDelete}
          handleToCloseLT={() => setOpenDelete(false)}
          deleteId={rowId}
          getData={getData}
          setRowId={setRowId}
          campaignId={emailCampaignId}
          setCampaignId={setEmailCampaignId}
        />
      </Paper>
    </Box>
  );
}
