import React, { useState, useEffect, useContext } from "react";
//mui

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { PotentialApi } from "../../apis/PotentialApi";
import { getSymbol } from "../../utils/currencySymbol";
import IconTooltip from "../../pages/common/IconTooltip";
//import global css
import "../../styles/global/common.css";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";
import { Toaster } from "../../pages/common/Toaster";
import { getMethodError } from "../../constants/errorMessages";
import { returnSubstring } from "../../utils";

export default function PotentialTable({
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
  const [searchParams, setSearchParams] = useSearchParams();
  let checkManage = props?.listData[1].manage;
  const pageSize = 10;
  // const current_page = localStorage.getItem("current_page");
  const { setOverviewHeaderData } = useContext(DataContext);
  const [gridKey, setGridKey] = useState(0);
  const handlePage = (val) => {
    let data = val + 1;
    handlePageChange(data);
  };

  useEffect(() => {
    dropdownCheck = false;
    check = false;
  }, []);

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
      navigate(`/potential/${id}/overview`, {
        state: {
          module: "potential",
          type: title,
          email,
        },
      });
    } else {
      navigate(`/potential/${id}/${title}`);
    }
  };

  const headCells = [
    {
      field: "first_name",
      headerName: "Name",
      sortable: true,
      width: 390,
      renderCell: (cellValues) => {
        let userName =
          cellValues?.row?.contact_detail?.first_name +
          " " +
          cellValues?.row?.contact_detail?.last_name;
        return (
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
              {cellValues?.row?.lead_details?.data?.attributes?.profile_photo
                ?.url && (
                <Avatar
                  sx={{ width: "42px", height: "42px" }}
                  alt="Remy Sharp"
                  src={
                    cellValues?.row?.lead_details?.data?.attributes
                      ?.profile_photo?.url
                  }
                />
              )}
              {!cellValues?.row?.lead_details?.data?.attributes?.profile_photo
                ?.url && (
                <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
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
                  {returnSubstring(cellValues.row?.contact_detail?.designation, 10) || "No Designation"}
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
                icon={<MailOutlineIcon sx={{ width: "22px" }} />}
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
                icon={<CallOutlinedIcon sx={{ width: "22px" }} />}
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
                icon={<TaskOutlinedIcon sx={{ width: "22px" }} />}
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
                icon={<DescriptionOutlinedIcon sx={{ width: "22px" }} />}
              />
            </div>
          </Stack>
        );
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
      valueGetter: (params) =>
        params.row?.lead_source?.name
          ? `${params.row?.lead_source?.name}`
          : "N/A",
    },
    {
      field: "owner",
      sortable: true,
      width: 180,
      headerName: "Potential Owner",
      renderCell: (params) => {
        return (
          <div
            style={{
              background: "#F1F1F4",
              borderRadius: "0px",
              fontWeight: "500",
              color: "#191A47",
              fontSize: "14px",
              padding: "6px 12px",
            }}
          >
            {params?.row?.potential_owner?.full_name
              ? params?.row?.potential_owner?.full_name
              : "-"}
          </div>
        );
      },
    },
    {
      field: "amount",
      sortable: true,
      width: 180,
      headerName: "Amount",
      valueGetter: (params) =>
        params.row?.amount
          ? `${getSymbol(params.row.currency?.code)} ${params.row?.amount}`
          : "N/A",
    },
    {
      field: "potential_stage_id",
      sortable: true,
      width: 180,
      headerName: "Stage",
      valueGetter: (params) => `${params.row?.potential_stage?.name}`,
    },
  ];
  const [loader, setLoader] = useState();
  const [headTable, setHeadTable] = useState(headCells);
  const {
    globalPotential,
    setGlobalPotential,
    setPotentialData,
    setPotenialeId,
  } = useContext(DataContext);

  const [manageLabel, setManageLabel] = useState({
    company_name: 1,
    email: 1,
    phone_number: 1,
    lead_source_id: 1,
    first_name: 1,
    last_name: 1,
    owner: 1,
    potential_stage_id: 1,
    amount: 1,
  });

  let filterdata = () => {
    if (manageLabel) {
      Object.keys(manageLabel).forEach(function (key) {
        if (!manageLabel[key]) {
          delete manageLabel[key];
        }
      });
      let arr = Object.keys(manageLabel);
      let data = headCells.filter((i) => arr.includes(i?.field));
      setHeadTable(data);

      let keyVal = [];
      data.forEach(function (item) {
        keyVal.push(
          item.field,
          "id",
          "contact_detail",
          "potential_owner",
          "lead_details",
          "lead_source",
          "potential_stage",
          "currency"
        );
      });
      if (keyVal) {
        if (keyVal?.length !== 0) {
          globalPotential.filter(function (item) {
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
    setPotenialeId([]);
    if (!props?.srchData && !check && count === 0 && !dropdownCheck) {
      getData();
    }
  }, [props?.isDeleted, props?.resetFilter, page]);

  useEffect(() => {
    if (checkManage) {
      handleManage();
    }
  }, [checkManage]);

  const handleManage = () => {
    PotentialApi.getAll(page, pageSize)

      .then(function (response) {
        if (response) {
          setManageLabel(response?.manage_data?.field_name);
          setPotentialData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        } else {
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (globalPotential) {
      filterdata();
    }
  }, [checkManage, manageLabel]);

  const getData = () => {
    listingData();
  };

  const listingData = () => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
    setLoader(true);
    PotentialApi.getAll(page_count, pageSize)

      .then(function (response) {
        if (response?.data) {
          setLoader(false);
          // if (page === 1) {
            handleRowCount(response?.meta?.total_records);
          // }
          const attr = response?.data?.map((event, key) => {
            return event?.attributes;
          });

          if (props?.count !== 1 && !dropdownCheck) {
            setGlobalPotential(attr);
          }
          setContactErr("")
          setGridKey((prevKey) => prevKey + 1);
          setManageLabel(response?.manage_data?.field_name);
          setPotentialData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        } else {
          setLoader(false);
          setGlobalPotential([]);
        }
      })
      .catch((error) => {
        setLoader(false);
        setGlobalPotential([]);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const navigate = useNavigate();

  const handleClick = (id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    navigate(`/potential/${id}/overview`);
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
            rowHeight={58.50}
            headerHeight={52}
            rows={globalPotential}
            columns={headTable}
            pageSize={pageSize}
            loader={loader}
            rowsPerPageOptions={[pageSize]}
            checkboxSelection
            paginationMode="server"
            rowCount={rowCount}
            page={page - 1}
            disableSelectionOnClick
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm) => setPotenialeId(itm)}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, globalPotential, "potentials"),
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
