import React, { useContext } from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DataContext } from "../../context";
import IconTooltip from "../../pages/common/IconTooltip";
import { Stack, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";
import { returnSubstring } from "../../utils";

export default function DashboardTable({ moduleName, loader }) {
  const { globalLeads, setOverviewHeaderData } = useContext(DataContext);
  let module_name = moduleName.toLowerCase();

  const navigate = useNavigate();
  let name;
  if (moduleName === "Leads") {
    name = "lead";
  } else if (moduleName === "Pipelines") {
    name = "pipeline";
  } else if (moduleName === "Potentials") {
    name = "potential";
  } else if (moduleName === "Deals") {
    name = "deal";
  } else if (moduleName === "Lost Leads") {
    name = "lost_lead";
  }

  const createHeader = (email, full_name, sub_head) => {
    const header = {
      full_name,
      email,
      sub_head,
    };
    setOverviewHeaderData(header);
  };

  const handleClick = (id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    navigate(`/${name}/${id}/overview`);
  };

  const handleIconClick = (title, id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    if (title === "email") {
      navigate(`/${name}/${id}/overview`, {
        state: {
          module: `${name}`,
          type: title,
          email: email,
        },
      });
    } else {
      navigate(`/${name}/${id}/${title}`);
    }
  };
  const dashboardHeadCells = [
    {
      field: "first_name",
      headerName: "Name",
      sortable: true,
      width: 420,
      valueGetter: (params) =>
        `${
          params?.row?.contact_detail?.first_name +
          " " +
          params?.row?.contact_detail?.last_name
        }`,
      renderCell: (cellValues) => {
        let userName = cellValues?.row?.name
          ? cellValues?.row?.name
          : cellValues?.row?.contact_detail?.first_name +
            " " +
            cellValues?.row?.contact_detail?.last_name;
        return (
          <>
            <Stack
              direction="row"
              spacing={2}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onClick={() =>
                  handleClick(
                    cellValues?.id,
                    cellValues?.row?.email
                      ? cellValues?.row?.email
                      : cellValues?.row?.contact_detail?.email,
                    userName,
                    cellValues.row?.designation
                      ? cellValues.row?.designation
                      : cellValues.row?.contact_detail?.designation
                  )
                }
              >
                {cellValues?.row?.profile_photo?.url && (
                  <Avatar
                    sx={{}}
                    alt="Remy Sharp"
                    src={cellValues?.row?.profile_photo?.url}
                  />
                )}
                {!cellValues?.row?.profile_photo?.url && (
                  <Avatar sx={{}} alt="Remy Sharp">
                    {" "}
                    <AccountCircleIcon></AccountCircleIcon>{" "}
                  </Avatar>
                )}
                <div
                  className="ma-nameTable-list"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "7px",
                  }}
                >
                  <IconTooltip title={userName} />

                  <span className="ma-userPost-table">
                    {
                    cellValues.row?.designation
                      ? cellValues.row?.designation
                      : returnSubstring(cellValues.row?.contact_detail?.designation, 10) || "No Designation"
                    }
                  </span>
                </div>
              </div>
              <div
                className="ma-iconTable-list"
                style={{ color: "#8C8DA3", paddingLeft: "15px" }}
              >
                <IconTooltip
                  title="Email"
                  handleIconClick={() =>
                    handleIconClick(
                      "email",
                      cellValues?.id,
                      cellValues?.row?.email
                        ? cellValues?.row?.email
                        : cellValues?.row?.contact_detail?.email,
                      userName,
                      cellValues.row?.designation
                        ? cellValues.row?.designation
                        : cellValues.row?.contact_detail?.designation
                    )
                  }
                  icon={<MailOutlineIcon sx={{ width: "20px" }} />}
                />
                <IconTooltip
                  title="Calls"
                  handleIconClick={() =>
                    handleIconClick(
                      "call-information",
                      cellValues?.id,
                      cellValues?.row?.email
                        ? cellValues?.row?.email
                        : cellValues?.row?.contact_detail?.email,
                      userName,
                      cellValues.row?.designation
                        ? cellValues.row?.designation
                        : cellValues.row?.contact_detail?.designation
                    )
                  }
                  icon={<CallOutlinedIcon sx={{ width: "20px" }} />}
                />
                <IconTooltip
                  title="Notes"
                  handleIconClick={() =>
                    handleIconClick(
                      "note",
                      cellValues?.id,
                      cellValues?.row?.email
                        ? cellValues?.row?.email
                        : cellValues?.row?.contact_detail?.email,
                      userName,
                      cellValues.row?.designation
                        ? cellValues.row?.designation
                        : cellValues.row?.contact_detail?.designation
                    )
                  }
                  icon={<TaskOutlinedIcon sx={{ width: "20px" }} />}
                />
                <IconTooltip
                  title="Meetings"
                  handleIconClick={() =>
                    handleIconClick(
                      "meeting",
                      cellValues?.id,
                      cellValues?.row?.email
                        ? cellValues?.row?.email
                        : cellValues?.row?.contact_detail?.email,
                      userName,
                      cellValues.row?.designation
                        ? cellValues.row?.designation
                        : cellValues.row?.contact_detail?.designation
                    )
                  }
                  icon={<DescriptionOutlinedIcon sx={{ width: "20px" }} />}
                />
              </div>
            </Stack>
          </>
        );
      },
    },
    {
      field: "email",
      sortable: true,
      headerName: "Email",
      width: 350,
      renderCell: (params) => {
        return (
          <span className="linkStyling">
            {params.row?.email
              ? params.row?.email
              : params.row?.contact_detail?.email
              ? params.row?.contact_detail?.email
              : "N/A"}
          </span>
        );
      },
    },
    {
      field: "From",
      sortable: true,
      width: 220,
      headerName: "From",
      renderCell: (params) => {
        return <span>{params.row?.created_at}</span>;
      },
    },
    {
      field: "company_name",
      sortable: true,
      headerName: "Company",
      width: 220,
      renderCell: (params) => {
        return (
          <span>
            {" "}
            {params.row?.company
              ? params.row?.company
              : params.row?.contact_detail?.company_name
              ? params.row?.contact_detail?.company_name
              : "N/A"}{" "}
          </span>
        );
      },
    },
    {
      field: "owner",
      sortable: true,
      width: 220,
      headerName: "Sales Owner",
      renderCell: (params) => {
        return (
          <div
            style={{
              background: "#F1F1F4",
              borderRadius: "4px",
              fontWeight: "500",
              color: "#191A47",
              fontSize: "14px",
              padding: "6px 12px",
            }}
          >
            {params.row?.lead_owner?.full_name
              ? params.row?.lead_owner?.full_name
              : params.row?.pipeline_owner?.full_name
              ? params.row?.pipeline_owner?.full_name
              : params.row?.potential_owner?.full_name
              ? params.row?.potential_owner?.full_name
              : params.row?.deal_owner?.full_name
              ? params.row?.deal_owner?.full_name
              : params.row?.lead_owner
              ? params.row?.lead_owner
              : "-"}
          </div>
        );
      },
    },
  ];
  return (
    <Box className="ma-main-table">
      <Paper sx={{ width: "100%", mb: 2 }}>
        <div className="dashboard-dataGrid-holder">
          <DataGrid
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
            disableColumnFilter
            disableColumnSelector
            rowHeight={52}
            headerHeight={52}
            rows={globalLeads}
            columns={dashboardHeadCells}
            pageSize={5}
            loader={loader}
            borderRadius={0}
            //rowsPerPageOptions={[10]}
            //checkboxSelection
            //rowCount={rowCount}
            hideFooterPagination
            //page={page - 1}
            //onPageChange={(newPage) => handlePage(newPage)}
            //onSelectionModelChange={(itm) => setDeactivateUserId(itm)}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, globalLeads, module_name, false),
            }}
            disableSelectionOnClick
          />
        </div>
      </Paper>
    </Box>
  );
}
