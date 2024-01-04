import React, { useEffect, useState } from 'react'
import { CustomNoRowsOverlay } from '../../pages/common/CustomNoRowsOverlay'
import { DataGrid } from '@mui/x-data-grid'
import { Box, InputAdornment, Paper, TextField } from '@mui/material'
import SearchIcon from "@mui/icons-material/Search";
import { SubscriptionApi } from '../../apis/SubscriptionApi';
import { getMethodError } from '../../constants/errorMessages';
import { Toaster } from '../../pages/common/Toaster';
import debouce from "lodash.debounce";

export default function TransactionHistory() {
    const [loader, setLoader] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [rowCount, setRowCount] = useState(0);
    const [page, setPage] = React.useState(1);
    const pageSize = 10;
    const [transactionData, setTransactionData] = useState([]);
    const [srchData, setSrchData] = useState(false);

    useEffect(() => {
        if (!srchData) {
            getTransactionHistory();
        }
    }, [srchData]);


    const debounceSearch = React.useCallback(
        debouce(function (e) {
            if (e) {
                getTransactionHistory(e);
            }
        }, 600),
        []
    );

    const getTransactionHistory = (searchQuery) => {
        setLoader(true)
        SubscriptionApi.getTransactionHistory(page, pageSize, searchQuery)
            .then((res) => {
                setLoader(false)
                if (res?.data) {
                    setTransactionData(res?.data)
                    setRowCount(res?.meta?.total_records)
                }
            })
            .catch(err => {
                setLoader(false)
                Toaster.TOAST(getMethodError(err), "error");
                console.log(err)
            })
    }

    const handleSearch = (e) => {
        let data = e.target.value
        if (data) {
            setSrchData(true);
        } else {
            setSrchData(false);
        }
        setSearchQuery(data)
        debounceSearch(data)
    }

    const headCells = [
        {
            field: "plan",
            sortable: true,
            headerName: "Plan",
            minWidth: 250,
            flex: 1,
            renderCell: (params) => {
                return <span>{`${params?.row?.attributes?.subscription?.name} Plan` ? `${params?.row?.attributes?.subscription?.name} Plan` : "N/A"}</span>;
            },
        },
        {
            field: "purchaseDate",
            sortable: true,
            headerName: "Purchase Date",
            minWidth: 250,
            flex: 1,
            renderCell: (params) => {
                return <span>{params?.row?.attributes?.purchase_date ? params?.row?.attributes?.purchase_date : "N/A"}</span>;
            },
        },
        {
            field: "users",
            sortable: true,
            minWidth: 200,
            flex: 1,
            headerName: "No.of.users",
            renderCell: (params) => {
                return <span>{params?.row?.attributes?.no_of_users ? params?.row?.attributes?.no_of_users : "N/A"}</span>;
            },
        },
        {
            field: "billedType",
            sortable: true,
            minWidth: 250,
            flex: 1,
            headerName: "Billed Type",
            renderCell: (params) => {
                return <span>{params?.row?.attributes?.billing_type ? params?.row?.attributes?.billing_type : "N/A"}</span>;
            },
        },
        {
            field: "amount",
            sortable: true,
            minWidth: 250,
            flex: 1,
            headerName: "Amount Per User (INR)",
            renderCell: (params) => {
                return <div className="d-flex justify-content-end align-items-center w-100"><span>{params?.row?.attributes?.amount_per_user ? params?.row?.attributes?.amount_per_user : "N/A"}</span></div>;
            },
        },
        {
            field: "totalPaid",
            sortable: true,
            minWidth: 250,
            flex: 1,
            headerName: "Total Paid (INR)",
            renderCell: (params) => {
                return <div className="d-flex justify-content-end align-items-center w-100"><span>{params?.row?.attributes?.total_paid ? params?.row?.attributes?.total_paid : "N/A"}</span></div>;
            },
        },
    ];
    return (
        <Box className="ma-main-table p-0">
            <div className="searchFilterDiv">
                <TextField
                    size="small"
                    className="searchField"
                    name="Search"
                    placeholder="Search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    helperText={<span className="ma-error"></span>}
                />
            </div>
            <Paper sx={{ width: "100%", mb: 2, padding: "0px !important" }}>
                <div style={{ height: "700px" }}>
                    <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        rows={transactionData}
                        columns={headCells}
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
                        rowHeight={62}
                        headerHeight={52}
                        pageSize={pageSize}
                        rowCount={rowCount}
                        rowsPerPageOptions={[pageSize]}
                        page={page - 1}
                        disableSelectionOnClick
                        components={{
                            NoRowsOverlay: () =>
                                CustomNoRowsOverlay(loader, transactionData, "transaction-history"),
                        }}
                    />
                </div>
            </Paper>
        </Box>
    )
}
