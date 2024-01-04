import React, { useState, useEffect, useContext } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  dealsHeadCells,
  leadsHeadCells,
  meetingsHeadCells,
  pipelineHeadCells,
  potientialHeadCells,
  reportsHeadCells,
  notesHeadCells,
  callinfoHeadCells,
  taskHeadCells,
  LostleadsHeadCells,
} from "./GlobalSearchHeadcells";
import { DataContext } from "../../context";
import { GlobalSearchApis } from "../../apis/GlobalApi";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "../../pages/common/Toaster";
const GlobalSearch = () => {
  /* istanbul ignore next */
  const navigate = useNavigate();
  const [searchData, setsearchData] = useState({});
  const { searchTerm } = useContext(DataContext);
  const [Leads, setLeads] = useState([]);
  const [Pipeline, setPipeline] = useState([]);
  const [Deals, setDeals] = useState([]);
  const [Meetings, setMeetings] = useState([]);
  const [Potentials, setPotentials] = useState([]);
  const [Reports, setReports] = useState([]);
  const [LostLeads, setLostLeads] = useState([]);
  const [Notes, setNotes] = useState([]);
  const [callinfo, setcallinfo] = useState([]);
  const [Task, setTask] = useState([]);
  const [loader, setLoader] = useState(false);

  /* istanbul ignore next */
  const handelSetState = (res) => {
    setsearchData(res);
    setLeads(res?.leads?.data);
    setPipeline(res?.pipelines?.data);
    setDeals(res?.deals?.data);
    setMeetings(res?.meetings?.data);
    setPotentials(res?.potentials?.data);
    setReports(res?.reports?.data);
    setNotes(res?.notes?.data);
    setcallinfo(res?.callinformations?.data);
    setTask(res?.tasks?.data);
    setLostLeads(res?.lostleads?.data);
  };
  /* istanbul ignore next */
  const dynamicData = [
    {
      title: "Leads",
      headcells: leadsHeadCells,
      data: Leads ? Leads : [],
      handleClick: (e) => {
        navigate(`/${e?.row?.type}/${e?.row?.id}/overview`);
      },
    },
    {
      title: "Pipelines",
      headcells: pipelineHeadCells,
      data: Pipeline ? Pipeline : [],
      handleClick: (e) => {
        navigate(`/${e?.row?.type}/${e?.row?.id}/overview`);
      },
    },
    {
      title: "Potentials",
      headcells: potientialHeadCells,
      data: Potentials ? Potentials : [],
      handleClick: (e) => {
        navigate(`/${e?.row?.type}/${e?.row?.id}/overview`);
      },
    },
    {
      title: "Deals",
      headcells: dealsHeadCells,
      data: Deals ? Deals : [],
      handleClick: (e) => {
        navigate(`/${e?.row?.type}/${e?.row?.id}/overview`);
      },
    },
    {
      title: "Reports",
      headcells: reportsHeadCells,
      data: Reports ? Reports : [],
      handleClick: (e) => {
        navigate(
          `/${e?.row?.type + "s"}/${e?.row?.id}/${
            e?.row?.attributes?.primary_module
          }`
        );
      },
    },
    {
      title: "Lost Leads",
      headcells: LostleadsHeadCells,
      data: LostLeads ? LostLeads : [],
      handleClick: (e) => {
        navigate(`/${e?.row?.type}/${e?.row?.id}/overview`);
      },
    },
    {
      title: "Meetings",
      headcells: meetingsHeadCells,
      data: Meetings ? Meetings : [],
      handleClick: (e) => {
        let routeName = e?.row?.attributes?.meetingable_type?.toLowerCase();
        let navigateUrl = routeName === "lostlead" ? "lost-lead" : routeName;

        navigate(
          `/${navigateUrl}/${e?.row?.attributes?.meetingable_id}/meeting`
        );
      },
    },
    {
      title: "Calls",
      headcells: callinfoHeadCells,
      data: callinfo ? callinfo : [],
      handleClick: (e) => {
        let routeName = e?.row?.attributes?.callable_type?.toLowerCase();
        let navigateUrl = routeName === "lostlead" ? "lost-lead" : routeName;
        navigate(
          `/${navigateUrl}/${e?.row?.attributes?.callable_id}/call-information`
        );
      },
    },

    {
      title: "Notes",
      headcells: notesHeadCells,
      data: Notes ? Notes : [],
      handleClick: (e) => {
        let routeName = e?.row?.attributes?.noteable_type.toLowerCase();
        let navigateUrl = routeName === "lostlead" ? "lost-lead" : routeName;
        navigate(`/${navigateUrl}/${e?.row?.attributes?.noteable_id}/note`);
      },
    },
    {
      title: "Tasks",
      headcells: taskHeadCells,
      data: Task ? Task : [],
      handleClick: (e) => {
        let routeName = e?.row?.attributes?.taskable_type?.toLowerCase();
        let navigateUrl = routeName === "lostlead" ? "lost-lead" : routeName;
        navigate(`/${navigateUrl}/${e?.row?.attributes?.taskable_id}/task`);
      },
    },
  ];

  useEffect(() => {
    if (searchTerm !== "") {
      const getData = setTimeout(() => {
        setLoader(true);
        GlobalSearchApis.Search(searchTerm)

          .then(function (response) {
            if (response) {
              setLoader(false);
              if (
                response.deals?.data?.length === 0 &&
                response.leads?.data?.length === 0 &&
                response.pipelines?.data?.length === 0 &&
                response.potentials?.data?.length === 0 &&
                response.lostleads?.data?.length === 0 &&
                response.callinformations?.data?.length === 0 &&
                response.meetings?.data?.length === 0 &&
                response.notes?.data?.length === 0 &&
                response.reports?.data?.length === 0 &&
                response.tasks?.data?.length === 0
              ) {
                handelSetState({});
              } else {
                setLoader(false);
                handelSetState(response);
              }
            }
          })
          .catch((error) => {
            setLoader(false);
            Toaster.TOAST(getMethodError(error), "error");
            console.log(error);
          });
      }, 1000);
      return () => {
        clearTimeout(getData);
      };
    } else {
      handelSetState({});
    }
  }, [searchTerm]);

  return (
    <>
      <div className="ma-mainTop-box">
        <Box className="ma-leads-box" sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            {Object.keys(searchData)?.length > 0 ? (
              dynamicData?.map((item, idx) => {
                return (
                  <>
                    <h5 className="py-3 px-4 mb-0 pb-0">
                      {item?.data?.length ? item.title : ""}
                    </h5>
                    {item?.data?.length > 0 && (
                      <>
                        <div
                          key={idx}
                          className="leadChildBox px-4 m-0 border-0"
                          style={{ height: "250px" }}
                        >
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
                              "& .MuiDataGrid-columnHeader:nth-last-of-type(1)":
                                {
                                  borderRight: "none",
                                },
                            }}
                            disableColumnFilter
                            disableColumnSelector
                            rowHeight={62}
                            headerHeight={52}
                            rows={item?.data}
                            columns={item?.headcells}
                            pageSize={2}
                            rowsPerPageOptions={[2]}
                            // paginationMode="server"
                            // rowCount={rowCount}
                            // page={page - 1}
                            loader={loader}
                            onRowClick={(e) => item.handleClick(e)}
                            disableRowSelectionOnClick
                            // onPageChange={(newPage) => handlePage(newPage)}
                            // onSelectionModelChange={(itm) => setReportId(itm)}
                            components={{
                              NoRowsOverlay: () =>
                                CustomNoRowsOverlay(
                                  loader,
                                  item?.data,
                                  "report"
                                ),
                            }}
                          />
                        </div>
                      </>
                    )}
                  </>
                );
              })
            ) : (
              <div style={{ height: "800px" }}>
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
                  rowHeight={62}
                  headerHeight={52}
                  rows={[]}
                  columns={[]}
                  pageSize={2}
                  loader={loader}
                  rowsPerPageOptions={[2]}
                  components={{
                    NoRowsOverlay: () =>
                      CustomNoRowsOverlay(loader, [], "search"),
                  }}
                />
              </div>
            )}
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default GlobalSearch;
