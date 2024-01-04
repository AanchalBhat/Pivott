import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotFound from "../../NotFound/NotFound";

const headCells = [
  {
    field: "stage",
    sortable: true,
    headerName: "STAGE",
    width: 250,
    valueGetter: (params) => {
      return params.row?.attributes?.stage
                ? params.row?.attributes?.stage
                : "N/A"
    },
  },
  {
    field: "stage_duration",
    sortable: true,
    headerName: "STAGE DURATION",
    width: 250,
    valueGetter: (params) => {
      return params.row?.attributes?.stage_duration !== null
                ? params.row?.attributes?.stage_duration
                : "N/A"
    },
  },
  {
    field: "Amount",
    sortable: true,
    headerName: "AMOUNT",
    width: 250,
    valueGetter: (params) => {
      return params.row?.attributes?.amount
                ? `$ ${params.row?.attributes?.amount}`
                : "N/A"
    },
  },
  {
    field: "closing_date",
    sortable: true,
    headerName: "CLOSING DATE",
    width: 250,
    valueGetter: (params) => {
      return params.row?.attributes?.closing_date
                ? params.row?.attributes?.closing_date
                : "N/A"
    },
  },
  {
    field: "Modified_time",
    sortable: true,
    headerName: "MODIFIED TIME",
    width: 250,
    valueGetter: (params) => {
      return params.row?.attributes?.updated_at
                ? params.row?.attributes?.updated_at
                : "N/A"
    },
  },
];

function LostOverviewTable(props) {
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
            borderRadius: "0",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: "#F9F9FB"
          },
          "& .MuiDataGrid-columnHeader:nth-of-type(1)": {
            paddingLeft: "30px"
          },
          "& .MuiDataGrid-cell:nth-of-type(1)": {
            paddingLeft: "30px"
          },
          "& .MuiDataGrid-columnHeader:nth-last-of-type(1)": {
            borderRight: "none"
          },
        }}
          disableColumnFilter
          disableColumnSelector
          rows={stage_history}
          columns={headCells}
          pageSize={5}
          rowsPerPageOptions={[5]}
          components={{
            NoRowsOverlay: () => <NotFound value={"No data found"} showImage={false} />,
          }}
        />
      )}
    </Box>
  );
}

export default LostOverviewTable;
