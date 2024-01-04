import React, { useState, useEffect, useContext } from "react";
// mui
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { DataGrid } from "@mui/x-data-grid";
// mui icon
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// other imports
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import { DealsApi } from "../../apis/DealsApi";
import moment from "moment";
import IconTooltip from "../../pages/common/IconTooltip";
//import global css
import "../../styles/global/common.css";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";
import { getSymbol } from "../../utils/currencySymbol";
import { Toaster } from "../../pages/common/Toaster";
import { getMethodError } from "../../constants/errorMessages";
import { returnSubstring } from "../../utils";

export default function DealsTable({
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
  const [ searchParams, setSearchParams ] = useSearchParams();
  const { setOverviewHeaderData } = useContext(DataContext);
  const [loader, setLoader] = useState();
  const [gridKey, setGridKey] = useState(0);

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
        navigate(`/deal/${id}/overview`, {
        state: {
          module: "deal",
          type: title,
          email,
        },
      });
      // navigate(`/deal/overview/${id}`)
    } else {
      navigate(`/deal/${id}/${title}`);
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
                    {returnSubstring(cellValues.row?.contact_detail?.designation, 10) || "No Designation"}
                  </span>
                </div>
              </div>
              <div className="ma-iconTable-list" style={{ color: "#8C8DA3" }}>
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
          </>
        );
      },
    },
    {
      field: "sign_off_date",
      sortable: true,
      headerName: "Sign Off Date",
      width: 150,
      valueGetter: (params) =>
        params?.row?.sign_off_date
          ? `${moment(params?.row?.sign_off_date).utc().format("DD MMM YYYY")}`
          : "N/A",
    },
    {
      field: "value",
      sortable: true,
      headerName: "Deal value",
      width: 150,
      valueGetter: (params) =>
        params?.row?.value
          ? `${getSymbol(params.row.currency?.code)} ${params?.row?.value}`
          : "N/A",
    },
    {
      field: "payment_mode_id",
      sortable: true,
      headerName: "Payment Mode",
      width: 150,
      valueGetter: (params) =>
        params?.row?.payment_mode
          ? `${params?.row?.payment_mode?.name}`
          : "N/A",
    },
    {
      field: "tenure",
      sortable: true,
      width: 150,
      headerName: "Deal tenure (Week)",
      valueGetter: (params) =>
        params?.row?.tenure ? `${params?.row?.tenure}` : "N/A",
    },
    {
      field: "deal_terms",
      sortable: true,
      width: 150,
      headerName: "Deal Terms ",
      valueGetter: (params) =>
        params?.row?.deal_terms ? `${params?.row?.deal_terms}` : "N/A",
    },
    {
      field: "company_name",
      headerName: "Company",
      sortable: true,
      width: 180,
      renderCell: (params) => {
        return <span> {params.row?.contact_detail?.company_name || "-"} </span>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      width: 270,
      renderCell: (params) => {
        return (
          <span className="linkStyling">
            {params.row?.contact_detail?.email || "-"}
          </span>
        );
      },
    },
    {
      field: "phone_number",
      headerName: "Phone",
      sortable: true,
      width: 180,
      valueGetter: (params) => {
        return params.row?.contact_detail?.phone_number
          ? `${params.row?.contact_detail?.country_code} ${params.row?.contact_detail?.phone_number}`
          : "N/A";
      },
    },
    {
      field: "owner",
      headerName: "Deal Owner",
      sortable: true,
      width: 180,
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
            {params.row?.deal_owner?.full_name
              ? params.row?.deal_owner?.full_name
              : "-"}
          </div>
        );
      },
    },
  ];

  const [headTable, setHeadTable] = useState(headCells);
  const { globalDeals, setGlobalDeals, setDealData, setDealPopupId } =
    useContext(DataContext);

  const [manageLabel, setManageLabel] = useState({
    company_name: 1,
    email: 1,
    phone_number: 1,
    first_name: 1,
    last_name: 1,
    owner: 1,
    sign_off_date: 1,
    value: 1,
    payment_mode_id: 1,
    tenure: 1,
    deal_terms: 1,
  });

  const handlePage = (val) => {
    let data = val + 1;
    handlePageChange(data);
  };

  useEffect(() => {
    dropdownCheck = false;
    check = false;
  }, []);

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
          "deal_owner",
          "lead_details",
          "lead_source",
          "sign_off_date",
          "payment_mode",
          "value",
          "tenure",
          "deal_terms",
          "currency"
        );
      });
      if (keyVal) {
        if (keyVal?.length !== 0) {
          globalDeals.filter(function (item) {
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
    setDealPopupId([]);
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
    DealsApi.getAll(page, pageSize)

      .then(function (response) {
        if (response) {
          setManageLabel(response?.manage_data?.field_name);
          setDealData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (globalDeals) {
      filterdata();
    }
  }, [checkManage, manageLabel]);

  const getData = () => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
    setLoader(true);
    DealsApi.getAll(page_count, pageSize)

      .then(function (response) {
        if (response?.data) {
          setLoader(false);
          // if (page === 1) {
            handleRowCount(response?.meta?.total_records);
          // }
          const attr = response?.data?.map((event) => {
            return event?.attributes;
          });
          if (props?.count !== 1 && !dropdownCheck) {
            setGlobalDeals(attr);
          }
          setContactErr("")
          setGridKey((prevKey) => prevKey + 1);
          setManageLabel(response?.manage_data?.field_name);
          setDealData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        } else {
          setLoader(false);
          setGlobalDeals([]);
        }
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const navigate = useNavigate();

  const handleClick = (id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    navigate(`/deal/${id}/overview`);
  };

  return (
    <Box className="ma-main-table" sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <div style={{ height: "700px" }}>
          <DataGrid
            key={gridKey}
            disableColumnFilter
            disableSelectionOnClick
            disableColumnSelector
            rows={globalDeals}
            columns={headTable}
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
            rowHeight={58.50}
            headerHeight={52}
            pageSize={pageSize}
            rowCount={rowCount}
            rowsPerPageOptions={[pageSize]}
            page={page - 1}
            checkboxSelection
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm) => setDealPopupId(itm)}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, globalDeals, "deals"),
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
