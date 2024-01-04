import React, { useState, useEffect, useContext } from "react";
//mui
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { DataContext } from "../../context";

import {
  dealsHeadCells,
  leadsHeadCells,
  lostLeadsHeadCells,
  pipelineHeadCells,
  potentialHeadCells,
} from "./AllHeadCells";
import { CustomNoRowsOverlay } from "../../pages/common/CustomNoRowsOverlay";

export default function ListReportsTable({
  overviewRowData,
  manage,
  page,
  rowCount,
  handlePageChange,
  loader
}) {
  const { module } = useParams();
  const { setReportId, manageOverviewLabel } = useContext(DataContext);

  const handlePage = (val) => {
    let newPage = val + 1;
    handlePageChange(newPage);
  };

  useEffect(() => {
    handleHeadTable();
  }, []);

  useEffect(() => {
    if (overviewRowData) {
      filterdata();
    }
  }, [manage, manageOverviewLabel]);

  const [headTable, setHeadTable] = useState(leadsHeadCells);
  const handleHeadTable = () => {
    if (module === "lead") setHeadTable(leadsHeadCells);
    else if (module === "pipeline") setHeadTable(pipelineHeadCells);
    else if (module === "potential") setHeadTable(potentialHeadCells);
    else if (module === "deal") setHeadTable(dealsHeadCells);
    else if (module === "lost-lead") setHeadTable(lostLeadsHeadCells);
  };

  let filterdata = () => {
    if (manageOverviewLabel) {
      Object.keys(manageOverviewLabel).forEach(function (key) {
        if (!manageOverviewLabel[key]) {
          delete manageOverviewLabel[key];
        }
      });
      let arr = Object.keys(manageOverviewLabel);
      let data;
      if (module === "lead") {
        data = leadsHeadCells?.filter((i) => arr.includes(i.field));
      } else if (module === "pipeline") {
        data = pipelineHeadCells?.filter((i) => arr.includes(i.field));
      } else if (module === "potential") {
        data = potentialHeadCells?.filter((i) => arr.includes(i.field));
      } else if (module === "deal") {
        data = dealsHeadCells?.filter((i) => arr.includes(i.field));
      } else if (module === "lost-lead") {
        data = lostLeadsHeadCells?.filter((i) => arr.includes(i.field));
      }
      setHeadTable(data);
      let keyVal = [];
      data?.forEach(function (item) {
        keyVal.push(
          item?.field,
          "id",
          "full_name",
          "designation",
          "profile_photo",
          "country_code",
          "owner"
        );
      });
      if (keyVal) {
        if (keyVal?.length !== 0) {
          overviewRowData?.filter(function (item) {
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

  return (
    <Box className="ma-main-table" sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <div style={{ height: "700px" }}>
          <DataGrid
            sx={{
              borderLeft: "none",
              borderRight: "none",
              color: "#191A47",
              borderRadius: "0",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                fontSize: "14px",
                textTransform:"uppercase"
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#F9F9FB",
                // cursor: "pointer",
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
            rows={overviewRowData}
            columns={headTable}
            pageSize={10}
            rowsPerPageOptions={[10]}
            paginationMode="server"
            rowCount={rowCount}
            page={page - 1}
            disableSelectionOnClick
            loader={loader}
            onPageChange={(newPage) => handlePage(newPage)}
            onSelectionModelChange={(itm) => setReportId(itm)}
            components={{
              NoRowsOverlay: () => CustomNoRowsOverlay(loader, overviewRowData, "report")
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
