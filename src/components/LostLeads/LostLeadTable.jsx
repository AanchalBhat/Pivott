import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
// mui
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { DataGrid } from "@mui/x-data-grid";
// mui icons
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// other imports
import { LostLeadApi } from "../../apis/LostLeadApi";
import IconTooltip from "../../pages/common/IconTooltip";
import "../../styles/global/common.css";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "../../pages/common/Toaster";
import { returnSubstring } from "../../utils";

export default function LeadTable({
  page,
  handlePageChange,
  rowCount,
  handleRowCount,
  dropdownCheck,
  setContactErr,
  count,
  ...props
}) {
  let checkManage = props?.listData?.[1]?.manage;
  const pageSize = 10;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setOverviewHeaderData } = useContext(DataContext);
  const [gridKey, setGridKey] = useState(0);
  // const current_page = localStorage.getItem("current_page");

  const createHeader = (email, full_name, sub_head) => {
    const header = {
      full_name,
      sub_head,
      email,
    };
    setOverviewHeaderData(header);
  };

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const handleIconClick = (title, id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    if (title === "email") {
      navigate(`/lost-lead/${id}/overview`, {
        state: {
          module: "lost-lead",
          type: title,
          email,
        },
      });
    } else {
      navigate(`/lost-lead/${id}/${title}`);
    }
  };

  const headCells = [
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      width: 390,
      // valueGetter: (params) => `${params.row?.name}`,
      renderCell: (cellValues) => {
        let userName = cellValues?.row?.name;
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
                    cellValues?.row?.id,
                    cellValues?.row?.email,
                    userName,
                    cellValues?.row?.designation
                  )
                }
              >
                {cellValues?.row?.profile_photo?.url && (
                  <Avatar
                    sx={{ width: "42px", height: "42px" }}
                    alt="Remy Sharp"
                    src={cellValues?.row?.profile_photo?.url}
                  />
                )}
                {!cellValues?.row?.profile_photo?.url && (
                  <Avatar
                    sx={{ width: "42px", height: "42px" }}
                    alt="Remy Sharp"
                  >
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
                    {returnSubstring(cellValues.row?.designation, 10) || "No Designation"}
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
                      cellValues?.row?.email,
                      userName,
                      cellValues?.row?.designation
                    )
                  }
                  icon={<MailOutlineIcon sx={{ width: "22px" }} />}
                />
                <IconTooltip
                  title="Calls"
                  handleIconClick={() =>
                    handleIconClick(
                      "call-information",
                      cellValues?.id,
                      cellValues?.row?.email,
                      userName,
                      cellValues?.row?.designation
                    )
                  }
                  icon={<CallOutlinedIcon sx={{ width: "22px" }} />}
                />
                <IconTooltip
                  title="Notes"
                  handleIconClick={() =>
                    handleIconClick(
                      "note",
                      cellValues?.id,
                      cellValues?.row?.email,
                      userName,
                      cellValues?.row?.designation
                    )
                  }
                  icon={<TaskOutlinedIcon sx={{ width: "22px" }} />}
                />
                <IconTooltip
                  title="Meetings"
                  handleIconClick={() =>
                    handleIconClick(
                      "meeting",
                      cellValues?.id,
                      cellValues?.row?.email,
                      userName,
                      cellValues?.row?.designation
                    )
                  }
                  icon={<DescriptionOutlinedIcon sx={{ width: "22px" }} />}
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
      width: 270,
      renderCell: (params) => {
        return <span className="linkStyling">{params.row?.email}</span>;
      },
    },
    {
      field: "phone_number",
      sortable: true,
      headerName: "Phone",
      width: 180,
      valueGetter: (params) => {
        return params.row?.phone_number
          ? `${params.row?.country_code} ${params.row?.phone_number}`
          : "N/A";
      },
    },
    {
      field: "company",
      sortable: true,
      headerName: "Company",
      width: 180,
      renderCell: (params) => {
        return <span> {params.row?.company || "N/A"} </span>;
      },
    },
    {
      field: "owner",
      sortable: true,
      width: 180,
      headerName: "Lead Owner",
      renderCell: (params) => {
        return (
          <>
            {params.row?.lead_owner ? (
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
                {params.row?.lead_owner}
              </div>
            ) : (
              "-"
            )}
          </>
        );
      },
    },
    {
      field: "reason",
      sortable: true,
      width: 270,
      headerName: "Reason For Lost",
      valueGetter: (params) => `${params.row?.reason}`,
    },
  ];
  const [loader, setLoader] = useState();
  const [headTable, setHeadTable] = useState(headCells);
  const {
    globalLostLeads,
    setGlobalLostLeads,
    setLostLeadPopupId,
    setLostLeadData,
  } = useContext(DataContext);

  const [manageLabel, setManageLabel] = useState({
    company: 1,
    email: 1,
    phone_number: 1,
    name: 1,
    reason: 1,
    owner: 1,
  });

  const handlePage = (val) => {
    let data = val + 1;
    handlePageChange(data);
  };

  useEffect(() => {
    dropdownCheck = false;
  }, []);

  let filterdata = () => {
    if (manageLabel) {
      Object.keys(manageLabel).forEach(function (key) {
        if (!manageLabel[key]) {
          delete manageLabel[key];
        }
      });
      let arr = Object.keys(manageLabel);
      let data = headCells.filter((i) => arr.includes(i.field));
      setHeadTable(data);
      let keyVal = [];
      data.forEach(function (item) {
        keyVal.push(
          item.field,
          "id",
          "lead_owner",
          "lost_leadable_id",
          "lost_leadable_type",
          "designation",
          "profile_photo",
          "country_code",
          "phone_number",
          "email",
          "reason",
          "company",
          "type"
        );
      });
      if (keyVal) {
        if (keyVal?.length !== 0) {
          globalLostLeads.filter(function (item) {
            var keys = Object.keys(item);
            keys.forEach(function (key) {
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

  useEffect(() => {
    setLostLeadPopupId([]);
    if (!props?.srchData && count === 0 && !dropdownCheck) {
      getData();
    }
    // if (!searchParams.get("page")) {
    //   getData(page);
    // }
  }, [props?.isDeleted, props?.resetFilter, page]);

  useEffect(() => {
    if (checkManage) {
      handleManage();
    }
  }, [checkManage]);

  const handleManage = () => {
    LostLeadApi.getAllData(page, pageSize)

      .then((response) => {
        if (response?.data) {
          setManageLabel(response?.manage_data?.field_name);
          setLostLeadData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (globalLostLeads) {
      filterdata();
    }
  }, [checkManage, manageLabel]);

  const getData = () => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
    setLoader(true);
    LostLeadApi.getAllData(page_count, pageSize)

      .then((response) => {
        if (response?.data) {
          setLoader(false);
          handleRowCount(response?.meta?.total_records);
          const attr = response?.data?.map((event, key) => {
            return event?.attributes;
          });

          if (!dropdownCheck) {
            setGlobalLostLeads(attr);
          }
          setContactErr("")
          setGridKey((prevKey) => prevKey + 1);
          setManageLabel(response?.manage_data?.field_name);
          setLostLeadData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        } else {
          setLoader(false);
          setGlobalLostLeads([]);
        }
      })
      .catch((error) => {
        setLoader(false);
        setGlobalLostLeads([]);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleClick = (id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    navigate(`/lost-lead/${id}/overview`);
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
            disableSelectionOnClick
            rowHeight={58.50}
            headerHeight={52}
            rows={globalLostLeads}
            columns={headTable}
            pageSize={pageSize}
            rowsPerPageOptions={[pageSize]}
            checkboxSelection
            //server pagination
            paginationMode="server"
            rowCount={rowCount}
            loader={loader}
            page={page - 1}
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm) => {
              const selectedIDs = new Set(itm);
              const selectRows = globalLostLeads?.filter((rows) =>
                selectedIDs.has(rows?.id)
              );
              let ids = [];
              if (selectRows?.length > 0) {
                ids = selectRows?.map((item, index) => {
                  return item?.id;
                });
              }
              setLostLeadPopupId(ids);
            }}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, globalLostLeads, "lost leads"),
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
