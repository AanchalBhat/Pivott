import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { getSymbol } from "../../../../utils/currencySymbol";

const headCells = [
  {
    field: "stage",
    sortable: true,
    headerName: "STAGE",
    width: 250,
    valueGetter: (params) => `${params.row?.attributes?.stage}`,
  },

  {
    field: "stage_duration",
    sortable: true,
    headerName: "STAGE DURATION (Days)",
    width: 250,
    valueGetter: (params) => `${params.row?.attributes?.stage_duration}`,
  },
  {
    field: "Amount",
    sortable: true,
    headerName: "EXPECTED REVENUE",
    width: 250,
    valueGetter: (params) =>
      params.row?.attributes?.amount
        ? `${getSymbol(params.row?.attributes?.currency_code)}${
            params.row?.attributes?.amount
          }`
        : "N/A",
  },
  {
    field: "closing_date",
    sortable: true,
    headerName: "CLOSING DATE",
    width: 250,
    valueGetter: (params) =>
      `${
        params.row?.attributes?.closing_date
          ? moment(params.row?.attributes?.closing_date)
              .utc()
              .format("DD MMM YYYY")
          : "N/A"
      }`,
  },
  {
    field: "Modified_time",
    sortable: true,
    headerName: "MODIFIED TIME",
    width: 250,
    valueGetter: (params) => `${params.row?.attributes?.updated_at}`,
  },
];

function OverviewTable(props) {
  const stage_history = props?.data;
  return (
    <Box sx={{ height: 300, width: "100%" }}>
      {stage_history && (
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
              borderRadius: "0",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              backgroundColor: "#F9F9FB",
            },
            "& .MuiDataGrid-columnHeader:nth-of-type(1)": {
              paddingLeft: "30px",
            },
            "& .MuiDataGrid-cell:nth-of-type(1)": {
              paddingLeft: "30px",
            },
            "& .MuiDataGrid-columnHeader:nth-last-of-type(1)": {
              borderRight: "none",
            },
          }}
          disableColumnFilter
          disableColumnSelector
          rows={stage_history}
          columns={headCells}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
        />
      )}
    </Box>
  );
}

export default OverviewTable;
