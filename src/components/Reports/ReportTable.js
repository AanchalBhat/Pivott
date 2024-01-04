import React, { useState, useEffect, useContext } from "react";
//mui
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
// mui icons
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
// other imports
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import "./Reports.css";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import MoveToFolder from "../../pages/common/MoveToFolder";
import CloneReport from "../../pages/common/CloneReport";
import ExportReport from "../../pages/common/ExportReport";
import ScheduleReports from "../../pages/common/ScheduleReport";
import RenameReport from "../../pages/common/RenameReport";
import { DeleteDialog } from "../../pages/common/DeleteDialog";
import { ReportsApi } from "../../apis/ReportsApi";
import _ from "lodash";
import IconTooltip from "../../pages/common/IconTooltip";
import { Toaster } from "../../pages/common/Toaster";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";
import { getMethodError } from "../../constants/errorMessages";

export default function ReportTable({
  handleClickFolder,
  listingData,
  manage,
  getAllData,
  page,
  rowCount,
  handlePageChange,
  fav,
  loader,
  gridKey
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [click, setClicked] = useState(false);
  const [reportName, setReportName] = useState("");
  const [openClone, setOpenClone] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowId, setRowId] = useState("");
  const pageSize = 10;
  const current_page = localStorage.getItem("current_page");
  const { setReportId, manageLabel } = useContext(DataContext);
  const handlePage = (val) => {
    let newPage = val + 1;
    handlePageChange(newPage);
  };

  useEffect(() => {
    if (current_page) {
      setSearchParams({ page: current_page})
    }
  }, [])

  useEffect(() => {
    setReportId([]);
  }, []);

  const onHandleClone = (e) => {
    setRowId(e?.id);
    setOpenClone(true);
  };
  const onHandleExport = (e) => {
    setRowId(e?.id);
    setOpenExport(true);
  };

  const handleUpdateNFav = (id, data) => {
    ReportsApi?.updateNFavorite(id, data)
      .then(function (response) {
        if (response?.data?.id) {
          fav();
          // getAllData();
        } else {
          Toaster.TOAST(response?.error || response?.errors, "error");
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const onHandleFavourite = (id, isFav) => {
    const data = {
      data: {
        favorite: !isFav,
      },
    };
    handleUpdateNFav(id, data);
  };

  const PopupAction = (popupState, value, id, ReportNames) => {
    popupState.close();
    setRowId(id);
    if (value === "rename") {
      setOpenRename(true);
      setReportName(ReportNames);
    } else if (value === "move") setClicked(true);
    else if (value === "email") setOpenEmail(true);
    else if (value === "delete") {
      setOpenDelete(true);
      setReportName(ReportNames);
    }
    else if (value === "edit") {
      navigate(`/reports/update/${id}`)
    }
  };

  const handleToCloseLT = () => {
    setClicked(false);
    setOpenClone(false);
    setOpenEmail(false);
    setOpenExport(false);
    setOpenRename(false);
    setOpenDelete(false);
  };

  const headCells = [
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      width: 400,
      renderCell: (cellValues) => {
        return (
          <Stack className="ma-reports-nameRow" direction="row" spacing={2}>
            <div
              className="ma-reports-nameTable"
              onClick={(event) => {
                handleClick(event, cellValues?.row, cellValues?.id);
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
                title={cellValues?.row?.name}
                placement="top-start"
              >
                <span className="ma-reports-userName">
                  {cellValues?.row?.name?.length > 25
                    ? cellValues?.row?.name?.substring(0, 25) + "..."
                    : cellValues?.row?.name}
                </span>
              </Tooltip>
            </div>
            <div className="ma-reports-iconTable">
              <span
                onClick={() => {
                  onHandleFavourite(cellValues?.id, cellValues?.row?.favorite);
                }}
                className="ma-reports-iconContact"
              >
                {cellValues?.row?.favorite ? (
                  <IconTooltip
                    title="Favourites"
                    icon={<StarIcon sx={{ color: "gold" }}/>}
                  />
                ) : (
                  <IconTooltip title="Favourites" icon={<StarOutlineIcon />} />
                )}
              </span>

              <span
                onClick={() => onHandleClone(cellValues?.row)}
                className="ma-reports-iconContact"
              >
                <IconTooltip
                  title="Clone Report"
                  icon={<FileCopyOutlinedIcon />}
                />
              </span>
              <span
                onClick={() => onHandleExport(cellValues?.row)}
                className="ma-reports-iconContact"
              >
                <IconTooltip
                  title="Export Report"
                  icon={<DescriptionOutlinedIcon />}
                />
              </span>

              <PopupState variant="popover" popupId="demo-popup-popover">
                {(popupState) => (
                  <>
                    <span
                      className="ma-reports-iconContact"
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
                              "rename",
                              cellValues?.id,
                              cellValues?.row?.name
                            )
                          }
                        >
                          Rename
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            PopupAction(popupState, "move", cellValues?.id, "")
                          }
                        >
                          Move To Folder
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            PopupAction(popupState, "email", cellValues?.id, "")
                          }
                        >
                          Schedule / Send Email
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            PopupAction(popupState, "edit", cellValues?.id, "")
                          }
                        >
                          Edit Report
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            PopupAction(
                              popupState,
                              "delete",
                              cellValues?.id,
                              cellValues?.row?.name
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
      field: "description",
      sortable: true,
      headerName: "Description",
      width: 250,
      valueGetter: (params) => `${params?.row?.description}` || "N/A",
    },
    {
      field: "report_folder_id",
      sortable: true,
      headerName: "folder",
      width: 200,
      valueGetter: (params) => `${params?.row?.report_folder}`,
    },
    {
      field: "updated_at",
      sortable: true,
      headerName: "Updated At",
      width: 180,
      valueGetter: (params) => `${params?.row?.updated_at}`,
    },
    {
      field: "created_by",
      sortable: true,
      width: 180,
      headerName: "Report Owner",
      renderCell: (params) => {
        return (
          <span className="ma-reports-ownerTag">{params?.row?.created_by}</span>
        );
      },
    },
    {
      field: "primary_module",
      sortable: true,
      width: 180,
      headerName: "Module",
      valueGetter: (params) => `${_.startCase(params?.row?.primary_module)}`,
    },
  ];

  const [headTable, setHeadTable] = useState(headCells);

  useEffect(() => {
    if (listingData) {
      filterdata();
    }
  }, [manage, manageLabel]);

  let filterdata = () => {
    if (manageLabel) {
      Object.keys(manageLabel).forEach(function (key) {
        if (!manageLabel[key]) {
          delete manageLabel[key];
        }
      });
      let arr = Object.keys(manageLabel);
      let data = headCells?.filter((i) => arr?.includes(i.field));
      setHeadTable(data);

      let keyVal = [];
      data.forEach(function (item) {
        keyVal.push(
          item.field,
          "id",
          "report_folder",
          "favorite",
          "updated_at",
          "primary_module"
        ); //contact_detail
      });
      if (keyVal) {
        if (keyVal?.length !== 0) {
          listingData?.filter(function (item) {
            var keys = Object.keys(item);
            keys?.forEach(function (key) {
              if (!keyVal.includes(key)) {
                delete item[key];
              }
            });

            return true;
          });
        }
      }
    }
  };

  const navigate = useNavigate();
  const handleClick = (event, name, id) => {
    const routes = name?.primary_module.replace(/_/g, '-');
    navigate(`/reports/${id}/${routes}`);
  };

  return (
    <Box className="ma-main-table" sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <div style={{ height: "700px" }}>
          <DataGrid
            key={gridKey}
            sx={{
              borderLeft: "none",
              borderRight: "none",
              color: "#191A47",
              borderRadius: "0",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                fontSize: "14px",
                textTransform: "uppercase"
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
                backgroundColor: "#F9F9FB"
              },
              "& .MuiDataGrid-columnHeader:nth-last-of-type(1)": {
                borderRight: "none"
              },
            }}
            disableColumnFilter
            disableColumnSelector
            rowHeight={58.50}
            headerHeight={52}
            rows={listingData}
            columns={headTable}
            pageSize={pageSize}
            loader={loader}
            rowsPerPageOptions={[pageSize]}
            checkboxSelection
            paginationMode="server"
            rowCount={rowCount}
            page={page - 1}
            disableRowSelectionOnClick
            disableSelectionOnClick
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm) => setReportId(itm)}
            components={{
              NoRowsOverlay: () => CustomNoRowsOverlay(loader, listingData, "report")
            }}
          />
        </div>
        <MoveToFolder
          getAllData={getAllData}
          reportId={rowId}
          openLT={click}
          handleToCloseLT={handleToCloseLT}
          handleClick={handleClickFolder}
        />

        {/*  action popup for clone reports */}
        <CloneReport
          openLT={openClone}
          handleToCloseLT={handleToCloseLT}
          handleClick={handleClickFolder}
          cloneReportId={rowId}
          clonedDataUpdate={getAllData}
        />

        {/*  action popup for export reports */}
        <ExportReport
          openLT={openExport}
          handleToCloseLT={handleToCloseLT}
          cloneReportId={rowId}
          label='Export Report'
        />

        {/*  action popup for email reports */}
        <ScheduleReports
          openLT={openEmail}
          handleToCloseLT={handleToCloseLT}
          popupDialogID={rowId}
          getAllData={() => getAllData()}
        />

        {/*  action popup for rename reports */}
        <RenameReport
          openLT={openRename}
          handleToCloseLT={handleToCloseLT}
          popupDialogID={rowId}
          getAllData={() => getAllData()}
          ReportName={reportName}
        />
        <DeleteDialog
          openDelete={openDelete}
          handleToCloseLT={handleToCloseLT}
          clonedDataUpdate={getAllData}
          reportId={rowId}
        />
      </Paper>
    </Box>
  );
}
