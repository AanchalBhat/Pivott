import React, { useState, useEffect, useContext } from "react";
// mui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useSearchParams } from "react-router-dom";
// other imports
import IconTooltip from "../../../pages/common/IconTooltip";
//import global css
import "../../../styles/global/common.css";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { CustomNoRowsOverlay } from "../../../pages/common/CustomNoRowsOverlay";
import { Typography } from "@mui/material";
import { EMAIL_SENT, EMAIL_CANCELLED, DELETE, CAMPAIGN_ARCHIVE } from "../../../utils/constants";
import { getMethodError, restMethodError } from "../../../constants/errorMessages";
import { campaignApi } from "../../../apis/campaignApi";
import { DataContext } from "../../../context";
import { Toaster } from "../../../pages/common/Toaster";
import RenameCampaign from "../Common/RenameCampagin";
import { MOVE_ARCHIVE_CAMPAIGNS } from "../../../constants/routes";
import { DeleteCampaign } from "../Common/DeleteCampaign";
import "../../../styles/custom/EmailCampaigns/List.css";
import EditNoteIcon from '@mui/icons-material/EditNote';

export default function ArchivedTable({
  page,
  handlePageChange,
  rowCount,
  handleRowCount,
  check,
  dropdownCheck,
  openDelete,
  setOpenDelete,
  isCampaign,
  value,
  setIsCampaign,
  setSearchQuery,
  ...props
}) {

  const { globalArchiveCampaign,
    setGlobalArchiveCampaign,
    archiveCampaignId,
    setArchiveCampaignId,
    setEmailCampaignObj,
    setCampaignTableReload,
    campaignTableReload, } = useContext(DataContext)
  const pageSize = 10;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [campaginName, setCampaginName] = useState("");
  const [rowId, setRowId] = useState("");
  const [gridKey, setGridKey] = useState(0);
  const [searchParams] = useSearchParams()

  const PopupAction = (popupState, value, id) => {
    let ids = [id]
    popupState.close();
    setRowId(id);
    if (value === DELETE) {
      setOpenDelete(true);
    }
    if ((value === MOVE_ARCHIVE_CAMPAIGNS.substring(1))) {
      handleArchive(ids);
    }
  };

  const handleStatus = (status) => {
    switch (status) {
      case EMAIL_SENT:
        return 'ma-sent';
      case EMAIL_CANCELLED:
        return 'ma-cancelled';
      default:
        return '';
    }
  };

  const headCells = [
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      width: 400,
      renderCell: (cellValues) => {
        let cell_value = cellValues && cellValues.row && cellValues.row.name;
        const status = cellValues?.row.status;
        const capitalizedStatus = status && status.charAt(0).toUpperCase() + status.slice(1);
        let date_time = status === EMAIL_SENT ? (cellValues?.row?.sent_time && `${capitalizedStatus} on ${cellValues?.row?.sent_time}`) :
         cellValues?.row?.scheduled_time && `${capitalizedStatus} on ${cellValues?.row?.scheduled_time}`;

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
                  title={cell_value}
                  placement="top-start"
                >
                  <span className="ma-campaign-userName">
                    {cell_value.length < 25
                      ? cell_value
                      : cell_value.substring(0, 25) + "..."}
                  </span>
                </Tooltip>
                <span className="ma-userPost-table">
                  {date_time}
                </span>
              </div>
            </div>
            <div className="ma-campaign-iconTable">
              <span
                onClick={() => handleDuplicate(cellValues?.id)}
                className="ma-campaign-iconContact"
              >
                <IconTooltip
                  title="Duplicate"
                  icon={<FileCopyOutlinedIcon />}
                />
              </span>
              <span
                onClick={() =>
                  handleChangeRename(cellValues?.id, cellValues?.row?.name)
                }
                className="ma-campaign-iconContact"
              >
                <IconTooltip
                  title="Rename"
                  icon={<EditNoteIcon sx={{ fontSize: "25px !important" }} />}
                />
              </span>

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
                        <MenuItem
                          onClick={() =>
                            PopupAction(
                              popupState,
                              "move_to_campaign",
                              cellValues?.id,
                              ""
                            )
                          }
                        >
                          Move to Campaigns
                        </MenuItem>
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
                      </Menu>
                    </div>
                  </>
                )}
              </PopupState>
            </div>
          </Stack>
        );
      },
    },
    {
      field: "status",
      sortable: true,
      headerName: "STATUS",
      width: 300,
      renderCell: (params) => {
        const status_archive = params && params.row && params.row.status;
        const capitalizedStatus = status_archive
          ? status_archive.charAt(0).toUpperCase() + status_archive.slice(1)
          : "N/A";
        const statusClassName = handleStatus(status_archive);
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

  const handleToCloseLT = () => {
    setOpenRename(false);
  };

  const handleClick = (e, rowData, id) => {
    if (value) {
      navigate(
        `/campaign/overview/${rowData.id}?filter=${value}&page=${page}`,
        {
          state: { name: "archive_campaign", campaignStatus: rowData.status },
        }
      );
    } else {
      navigate(`/campaign/overview/${rowData.id}`, {
        state: { name: "archive_campaign", campaignStatus: rowData.status },
      });
    }
  };

  const handleDuplicate = (id) => {
    navigate(`/campaign/create`, {
      state: {
        is_duplicate: true,
        name: CAMPAIGN_ARCHIVE,
        duplicate_id: id
      }
    })
  }

  const handlePage = (val) => {
    //pagiation page change
    let data = val + 1;
    handlePageChange(data);
  };

  useEffect(() => {
    check = false;
    dropdownCheck = false;
  }, []);

  useEffect(() => {
    setArchiveCampaignId([]);

    if (!props?.srchData && !check && !dropdownCheck && (value === "All" || searchParams.get("page"))) {
      getData();
    }
  }, [page, props?.srchData, check, dropdownCheck, value, searchParams]);


  useEffect(() => {
    if (campaignTableReload) {
      getData();
    }
  }, [campaignTableReload])

  useEffect(() => {
    let isIds = rowId ? [rowId] : archiveCampaignId;
    if (isCampaign) {
      handleArchive(isIds, MOVE_ARCHIVE_CAMPAIGNS);
    }
  }, [isCampaign]);

  const handleArchive = (id) => {
    let data = {
      data: {
        email_campaign_ids: id,
      },
    };
    moveAPI(data, MOVE_ARCHIVE_CAMPAIGNS);
  };

  const moveAPI = (data, value) => {
    campaignApi
      .archiveCampaign(data, value)
      .then((response) => {
        setIsCampaign(false);
        getData();
        setArchiveCampaignId([]);
        setRowId("");
        Toaster.TOAST(response.message, "success");
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleChangeRename = (id, name) => {
    setRowId(id);
    setCampaginName(name);
    setOpenRename(true);
  };

  const getData = () => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
    setLoader(true);
    campaignApi
      .campaignSearch(page_count, pageSize, "is_archived", null, null)

      .then(function (response) {
        if (response?.data) {
          setLoader(false);
          if (page === 1) {
            handleRowCount(response?.meta?.total_records);
          }
          const attr = response?.data?.map((event, key) => {
            return event.attributes;
          });
          setGlobalArchiveCampaign(attr);
          setGridKey((prevKey) => prevKey + 1);
          setCampaignTableReload(false)
        } else {
          setLoader(false);
          setGlobalArchiveCampaign([]);
        }
      })
      .catch((error) => {
        setLoader(false);
        setGlobalArchiveCampaign([]);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  return (
    <Box className="ma-main-table" sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <div style={{ height: "700px" }}>
          <DataGrid
            key={gridKey}
            disableColumnFilter
            disableColumnSelector
            rows={globalArchiveCampaign}
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
            checkboxSelection
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm) => {
              const selectedIDs = new Set(itm);
              const selectRows = globalArchiveCampaign?.filter((rows) =>
                selectedIDs.has(rows?.id)
              );
              let obj;
              if (selectRows?.length > 0) {
                obj = selectRows?.map((item, index) => {
                  return { id: item?.id, new_name: item?.name };
                });
              }
              setEmailCampaignObj(obj)
              setArchiveCampaignId(itm)
            }}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, globalArchiveCampaign, "archived"),
            }}
            disableSelectionOnClick
          />
        </div>
        <RenameCampaign
          title={"archive"}
          openLT={openRename}
          handleToCloseLT={() => handleToCloseLT()}
          popupDialogID={rowId}
          getData={() => getData()}
          campaignName={campaginName}
        />
        <DeleteCampaign
          title={"archive campaign"}
          content={"archive campaign"}
          openDelete={openDelete}
          handleToCloseLT={() => setOpenDelete(false)}
          deleteId={rowId}
          getData={getData}
          setRowId={setRowId}
          campaignId={archiveCampaignId}
          setCampaignId={setArchiveCampaignId}
        />
      </Paper>
    </Box>
  );
}
