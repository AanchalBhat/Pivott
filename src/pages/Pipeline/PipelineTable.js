import React, { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../context";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { PipelineApi } from "../../apis/pipelineApi";
import { getSymbol } from "../../utils/currencySymbol";

import IconTooltip from "../common/IconTooltip";
//import global css
import "../../styles/global/common.css";
import "./List.css";
import { CustomNoRowsOverlay } from "../common/CustomNoRowsOverlay";
import { Toaster } from "../common/Toaster";
import { getMethodError } from "../../constants/errorMessages";
import { returnSubstring } from "../../utils";

export default function PipelineTable({
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
  let checkManage = props?.listData?.[1]?.manage;
  const pageSize = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const { setOverviewHeaderData } = useContext(DataContext);
  const [loader, setLoader] = useState();
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

  useEffect(() => {
    dropdownCheck = false;
    // check = false;
  }, []);

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
    if (title == "email") {
      navigate(`/pipeline/${id}/overview`, {
        state: {
          module: "pipeline",
          type: title,
          email: email,
        },
      });
      // navigate(`/pipeline/overview/${id}`)
    } else {
      navigate(`/pipeline/${id}/${title}`);
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
                      <AccountCircleIcon />{" "}
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
          </>
        );
      },
    },
    {
      field: "account_name",
      sortable: true,
      headerName: "Account Name",
      width: 250,
      valueGetter: (params) => `${params.row?.account_name}`,
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
      field: "pipeline_stage_id",
      sortable: true,
      headerName: "STAGE",
      width: 180,
      valueGetter: (params) =>
        params?.row?.pipeline_stage?.name
          ? `${params?.row?.pipeline_stage?.name}`
          : "N/A",
    },
    {
      field: "pipeline_score",
      sortable: true,
      headerName: "SCORE(%)",
      width: 180,
      valueGetter: (params) =>
        params?.row?.pipeline_score
          ? `${params?.row?.pipeline_score?.name}`
          : "N/A",
    },
    {
      field: "owner",
      sortable: true,
      headerName: "PIPELINE OWNER",
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
            {params.row?.pipeline_owner?.full_name
              ? params.row?.pipeline_owner?.full_name
              : "-"}
          </div>
        );
      },
    },
    {
      field: "expected_revenue",
      sortable: true,
      headerName: "Expected Revenue",
      width: 180,
      valueGetter: (params) =>
        params?.row?.expected_revenue
          ? `${getSymbol(params?.row?.currency?.code)} ${params?.row?.expected_revenue
          }`
          : "N/A",
    },
    {
      field: "next_step",
      sortable: true,
      headerName: "Next Step",
      width: 180,
      valueGetter: (params) =>
        params.row?.next_step ? `${params.row?.next_step}` : "N/A",
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
  ];
  const [headTable, setHeadTable] = useState(headCells);
  const { setPipelineData, globalPipeline, setGlobalPipeline, setPipelineId } =
    useContext(DataContext);

  const [manageLabel, setManageLabel] = useState({
    first_name: 1,
    account_name: 1,
    last_name: 1,
    email: 1,
    pipeline_score: 1,
    pipeline_stage_id: 1,
    phone_number: 1,
    owner: 1,
    expected_revenue: 1,
    company: 1,
    next_step: 1,
  });

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
          "profile_photo",
          "pipeline_owner",
          "lead_details",
          "company_name",
          "pipeline_score",
          "pipeline_stage",
          "next_step",
          "expected_revenue",
          "currency"
        );
      });
      if (keyVal) {
        if (keyVal?.length !== 0) {
          globalPipeline.filter(function (item) {
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
    setPipelineId([]);
    if (!props?.srchData && !check && count === 0 && !dropdownCheck) {
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
    PipelineApi.piplineView(true, page, 10)

      .then(function (response) {
        if (response?.data) {
          setManageLabel(response?.manage_data?.field_name);
          setPipelineData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (globalPipeline) {
      filterdata();
    }
  }, [checkManage, manageLabel]);

  const getData = () => {
    let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
    setLoader(true);
    PipelineApi.piplineView(true, page_count, pageSize)

      .then(function (response) {
        if (response?.data) {
          setLoader(false);
          // if (page === 1) {
            handleRowCount(response?.meta?.total_records);
          // }
          const attr = response?.data?.map((event, index) => {
            return event.attributes;
          });

          if (props?.count !== 1 && !dropdownCheck) {
            setGlobalPipeline(attr);
          }
          setContactErr("")
          setGridKey((prevKey) => prevKey + 1);
          setManageLabel(response?.manage_data?.field_name);
          setPipelineData(JSON.stringify(response?.manage_data?.field_name));
          localStorage.setItem("manage_id", response?.manage_data?.id);
        } else {
          setLoader(false);
          setGlobalPipeline([]);
        }
      })
      .catch((error) => {
        setLoader(false);
        setGlobalPipeline([]);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const navigate = useNavigate();

  const handleClick = (id, email, full_name, designation) => {
    createHeader(email, full_name, designation);
    navigate(`/pipeline/${id}/overview`);
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
            rows={globalPipeline}
            columns={headTable}
            pageSize={pageSize}
            rowsPerPageOptions={[pageSize]}
            checkboxSelection
            paginationMode="server"
            rowCount={rowCount}
            page={page - 1}
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm) => setPipelineId(itm)}
            loader={loader}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, globalPipeline, "pipelines"),
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
