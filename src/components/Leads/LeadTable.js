import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LeadAPI } from "../../apis/LeadApi";
import { DataContext } from "../../context";
//mui
import { Avatar, Stack, Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
//mui icons
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// other imports
import IconTooltip from "../../pages/common/IconTooltip";
//import global css
import "../../styles/global/common.css";
import { WEBSITE_REGEX } from "../../utils/regexLists";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";
import { Toaster } from "../../pages/common/Toaster";
import { getMethodError } from "../../constants/errorMessages";
import { returnSubstring } from "../../utils";

export default function LeadTable({
  page,
  handlePageChange,
  rowCount,
  handleRowCount,
  check,
  dropdownCheck,
  setContactErr,
  count,
  ...props
}) {
  let checkManage = props?.listData[1].manage;
  const pageSize = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState();
  const { setOverviewHeaderData } = useContext(DataContext);
  const [gridKey, setGridKey] = useState(0);
  // const current_page = localStorage.getItem("current_page");

  const handlePage = (val) => {
    let data = val + 1;
    handlePageChange(data);
  };
  
  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])
  
  const createHeader = (email, full_name, sub_head) => {
    const header = {
      full_name,
      sub_head,
      email,
    };
    setOverviewHeaderData(header);
  };

  const handleIconClick = (title, id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    if (title === "email") {
        navigate(`/lead/${id}/overview`, {
        state: {
          module: "lead",
          type: title,
          email: email,
        },
      });
    } else {
      navigate(`/lead/${id}/${title}`);
    }
  };

  // const handleWebsiteClick = (website) => {
  //   window.location = website
  //   return null;
  // }

  const headCells = [
    {
      field: "first_name",
      headerName: "Name",
      sortable: true,
      width: 390,
      valueGetter: (params) =>
        `${
          params?.row?.contact_detail?.first_name +
          " " +
          params?.row?.contact_detail?.last_name
        }`,
      renderCell: (cellValues) => {
        let userName =
          cellValues?.row?.contact_detail?.first_name +
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
                    cellValues?.row?.contact_detail?.email,
                    userName,
                    cellValues?.row?.contact_detail?.designation
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
                    {/* {cellValues.row?.contact_detail?.designation} */}
                    {/* <IconTooltip title={cellValues.row?.contact_detail?.designation} /> */}
                    {returnSubstring(cellValues.row?.contact_detail?.designation, 15) || "No Designation"}
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
                      cellValues?.row?.contact_detail?.email,
                      userName,
                      cellValues?.row?.contact_detail?.designation
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
                      cellValues?.row?.contact_detail?.email,
                      userName,
                      cellValues?.row?.contact_detail?.designation
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
                      cellValues?.row?.contact_detail?.email,
                      userName,
                      cellValues?.row?.contact_detail?.designation
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
                      cellValues?.row?.contact_detail?.email,
                      userName,
                      cellValues?.row?.contact_detail?.designation
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
      width: 270,
      renderCell: (params) => {
        return (
          <span className="linkStyling">
            {params.row?.contact_detail?.email}
          </span>
        );
      },
    },
    {
      field: "phone_number",
      sortable: true,
      headerName: "Phone",
      width: 180,
      valueGetter: (params) => {
        return params.row?.contact_detail?.phone_number
          ? `${params.row?.contact_detail?.country_code} ${params.row?.contact_detail?.phone_number}`
          : "N/A";
      },
    },
    {
      field: "lead_source_id",
      sortable: true,
      width: 180,
      headerName: "Lead Source",
      renderCell: (params) => {
        return <span>{params?.row?.lead_source?.name || "N/A"}</span>;
      },
    },
    {
      field: "company_name",
      sortable: true,
      headerName: "Company",
      width: 180,
      renderCell: (params) => {
        return (
          <span>
            {" "}
            {params.row?.contact_detail?.company_name
              ? params.row?.contact_detail?.company_name
              : "N/A"}{" "}
          </span>
        );
      },
    },
    {
      field: "owner",
      sortable: true,
      width: 180,
      headerName: "Lead Owner",
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
              : "-"}
          </div>
        );
      },
    },
    {
      field: "website",
      sortable: true,
      width: 180,
      headerName: "Website",
      renderCell: (params) => {
        const url = params?.row?.website?.match(WEBSITE_REGEX)
          ? params?.row?.website
          : `https://${params?.row?.website}`;
        return (
          <>
            {params?.row?.website ? (
              <a
                className="ma-tableColumn-website"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                {params?.row?.website}
              </a>
            ) : (
              <span>N/A</span>
            )}
          </>
        );
      },
    },
    {
      field: "status_id",
      sortable: true,
      width: 180,
      headerName: "Lead Status",
      renderCell: (params) => {
        return <span>{params?.row?.status?.name || "N/A"}</span>;
      },
    },
    {
      field: "street_address",
      sortable: true,
      width: 270,
      headerName: "Street Address",
      valueGetter: (params) =>
        params?.row?.lead_address?.street
          ? `${params?.row?.lead_address?.street}`
          : "N/A",
    },
    {
      field: "zip_code",
      sortable: true,
      width: 120,
      headerName: "Zip Code",
      valueGetter: (params) =>
        params?.row?.lead_address?.zip_code
          ? `${params?.row?.lead_address?.zip_code}`
          : "N/A",
    },
  ];
  const [headTable, setHeadTable] = useState(headCells);
  const {
    globalLeads,
    setGlobalLeads,
    setLeadData,
    setLeadPopupId,
    setOverviewId,
  } = React.useContext(DataContext);
  const [manageLabel, setManageLabel] = useState({
    company_name: 1,
    email: 1,
    phone_number: 1,
    lead_source_id: 1,
    first_name: 1,
    last_name: 1,
    status_id: 1,
    street_address: 1,
    zip_code: 1,
    country: 1,
    city: 1,
    state: 1,
    owner: 1,
  });

  useEffect(() => {
    check = false;
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
          "contact_detail",
          "lead_owner",
          "profile_photo",
          "lead_address",
          "lead_source",
          "status"
        );
      });
      if (keyVal) {
        if (keyVal?.length !== 0) {
          globalLeads.filter(function (item) {
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
    setLeadPopupId([]);
    if (!props?.srchData && !check && count === 0 && !dropdownCheck) {
      getData();
    }
    // if (!searchParams.get("page")) {
    //   getData(page);
    // }
  }, [props?.isDeleted, props?.resetFilter, props?.isImported, page]);

  useEffect(() => {
    if (checkManage) {
      handleManage();
    }
  }, [checkManage]);

  const handleManage = () => {
    LeadAPI.getAll(page, pageSize)
      .then(function (response) {
        if (response?.data) {
          setManageLabel(response?.manage_data?.field_name);
          setLeadData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (globalLeads) {
      filterdata();
    }
  }, [checkManage, manageLabel]);

  const getData = () => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
    setLoader(true);
    LeadAPI.getAll(page_count, pageSize)

      .then(function (response) {
        if (response?.data) {
          setLoader(false);
            handleRowCount(response?.meta?.total_records);
          const attr = response?.data?.map((event, key) => {
            return event.attributes;
          });
          if (props?.count !== 1 && !dropdownCheck) {
            setGlobalLeads(attr);
          }
          setContactErr("");
          setGridKey((prevKey) => prevKey + 1);
          setManageLabel(response?.manage_data?.field_name);
          setLeadData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        } else {
          setLoader(false);
          setGlobalLeads([]);
        }
      })
      .catch((error) => {
        setLoader(false);
        setGlobalLeads([]);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleClick = (id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    setOverviewId(id);
    navigate(`/lead/${id}/overview`);
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
            disableSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            rowHeight={58.50}
            headerHeight={50}
            rows={globalLeads}
            columns={headTable}
            pageSize={pageSize}
            checkboxSelection
            paginationMode="server"
            rowCount={rowCount}
            rowsPerPageOptions={[pageSize]}
            page={page - 1}
            loader={loader}
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm) => setLeadPopupId(itm)}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, globalLeads, "leads"),
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
