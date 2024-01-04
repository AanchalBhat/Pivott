import React, { useState, useEffect, useContext } from "react";
// mui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useSearchParams } from "react-router-dom"
// other imports
import IconTooltip from "../../../pages/common/IconTooltip";
//import global css
import "../../../styles/global/common.css";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { CustomNoRowsOverlay } from "../../../pages/common/CustomNoRowsOverlay";
import { Typography } from "@mui/material";
import { campaignApi } from "../../../apis/campaignApi";
import { DataContext } from "../../../context";
import { Toaster } from "../../../pages/common/Toaster";
import { getMethodError } from "../../../constants/errorMessages";
import moment from "moment";
import { DeleteCampaign } from "../Common/DeleteCampaign";
import RenameCampaign from "../Common/RenameCampagin";
import "../../../styles/custom/EmailCampaigns/List.css";
import { DELETE } from "../../../utils/constants";
import EditNoteIcon from '@mui/icons-material/EditNote';

export default function DraftTable({
	page,
	handlePageChange,
	rowCount,
	handleRowCount,
	check,
	dropdownCheck,
	handleDelete, openDelete, setOpenDelete,
	setSearchQuery,
	...props
}) {
	const {
		globalDraftData,
		setGlobalDraftData,
		setEmailCampaignObj,
		campaignTableReload,
		setCampaignTableReload,
		setDraftDataId,
		draftDataId } = useContext(DataContext)
	const pageSize = 10;
	const navigate = useNavigate();
	const [loader, setLoader] = useState(false);
	const [openRename, setOpenRename] = useState(false);
	const [openMassRename, setOpenMassRename] = useState(false);
	const [campaginName, setCampaginName] = useState("");
	const [gridKey, setGridKey] = useState(0);
	const [rowId, setRowId] = useState("");
	const [searchParams] = useSearchParams();

	const PopupAction = (popupState, value, id) => {
		let ids = [id]
		popupState.close();
		setRowId(id)
		if (value === DELETE) {
			setOpenDelete(true);
		}
	};

	const handleClick = (e, rowData, id) => {
		navigate(`/campaign/overview/${rowData.id}?page=${page}`, {
			state: { campaignStatus: rowData.status }
		});
	};

	const handlePage = (val) => {
		let data = val + 1;
		handlePageChange(data);
	};

	useEffect(() => {
		check = false;
		dropdownCheck = false;
	}, []);

	useEffect(() => {
		setDraftDataId([]);
		if (!props?.srchData && !check && !dropdownCheck) {
			getData()
		}
	}, [page])
    
	useEffect(() => {
		if (campaignTableReload) {
			getData();
		}
	}, [campaignTableReload])

	const headCells = [
		{
			field: "name",
			headerName: "Name",
			sortable: true,
			width: 400,
			renderCell: (cellValues) => {
				let cell_value = cellValues && cellValues.row;
				return (
					<Stack className="ma-campaign-nameRow" direction="row" spacing={2}>
						<div
							className="ma-campaign-nameTable"
							onClick={(event) => handleClick(event, cell_value, cellValues?.id)}
						>
							<Tooltip
								componentsProps={{
									tooltip: {
										sx: {
											bgcolor: "common.grey",
											"& .MuiTooltip-arrow": {
												color: "common.grey",
											},
											fontWeight: 400,
											padding: "6px 12px",
											fontSize: 12,
										},
									},
								}}
								arrow
								title={cell_value.name}
								placement="top-start"
							>
								<span className="ma-campaign-userName">
									{cell_value.name.length < 25
										? cell_value.name
										: cell_value.name.substring(
											0,
											25
										) + "..."}
								</span>
							</Tooltip>
						</div>
						<div className="ma-campaign-iconTable">
							<span
								onClick={() => handleDuplicate(cellValues?.id)}
								className="ma-campaign-iconContact"
							>
								<IconTooltip
									title="Duplicate"
									icon={<FileCopyOutlinedIcon />}
								/>
							</span>
							<span
								onClick={() => handleChangeRename(cellValues?.id, cell_value.name)}
								className="ma-campaign-iconContact"
							>
								<IconTooltip
									title="Rename"
									icon={<EditNoteIcon sx={{ fontSize: "25px !important" }} />}
								/>
							</span>

							<PopupState variant="popover" popupId="demo-popup-popover">
								{(popupState) => (
									<>
										<span
											className="ma-campaign-iconContact"
											{...bindTrigger(popupState)}
										>
											<IconTooltip
												title="More"
												icon={<MoreVertOutlinedIcon />}
											/>
										</span>
										<div>
											<Menu
												{...bindPopover(popupState)}
												anchorOrigin={{
													vertical: "bottom",
													horizontal: "center",
												}}
												transformOrigin={{
													vertical: 0,
													horizontal: 0,
												}}
											>
												<MenuItem
													onClick={() =>
														PopupAction(
															popupState,
															"delete",
															cellValues?.id,
															""
														)
													}
												>
													Delete
												</MenuItem>
											</Menu>
										</div>
									</>
								)}
							</PopupState>
						</div>
					</Stack>
				);
			},
		},
		{
			field: "date",
			sortable: true,
			headerName: "Date",
			width: 300,
			valueGetter: (params) =>
				params?.row?.created_at
					? `${moment(params?.row?.created_at).utc().format("MMM DD YYYY")}`
					: "N/A",
		},
		{
			field: "status",
			sortable: true,
			headerName: "STATUS",
			width: 300,
			renderCell: (params) => {
				return (
					<div className="d-flex justify-content-center align-items-center w-100">
						<div className="status-class draft-status">
							<Typography>{params?.row?.status ? params?.row?.status : 'N/A'}</Typography>
						</div>
					</div>
				);
			},
		},
	];

	const handleToCloseLT = () => {
		setOpenRename(false);
	};

	const handleChangeRename = (id, name) => {
		setRowId(id)
		setCampaginName(name)
		setOpenRename(true)
	}

	const handleDuplicate = (id) => {
		navigate(`/campaign/create`, { state: { is_duplicate: true, duplicate_id: id } })
	}

	const getData = () => {
		let page_count = searchParams.get("page") ? +(searchParams.get("page")) : page
		setLoader(true)
		campaignApi.campaignSearch(page_count, pageSize, "draft")
			.then(function (response) {
				if (response?.data) {
					setLoader(false)
					if (page === 1) {
						handleRowCount(response?.meta?.total_records);
					}
					const attr = response?.data?.map((event, key) => {
						return event.attributes;
					});
					if (props?.count !== 1 && !dropdownCheck) {
						setGlobalDraftData(attr);
					}
					setGridKey((prevKey) => prevKey + 1);
					setCampaignTableReload(false)
				} else {
					setLoader(false)
					setGlobalDraftData([]);
				}
			})
			.catch((error) => {
				setLoader(false)
				setGlobalDraftData([]);
				Toaster.TOAST(getMethodError(error), "error");
				console.log(error);
			});
	};

	return (
		<Box className="ma-main-table" sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<div style={{ height: "700px" }}>
					<DataGrid
						key={gridKey}
						disableColumnFilter
						disableColumnSelector
						rows={globalDraftData}
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
						rowHeight={59.20}
						headerHeight={52}
						pageSize={pageSize}
						rowCount={rowCount}
						rowsPerPageOptions={[pageSize]}
						page={page - 1}
						checkboxSelection
						rowKey={(row) => row.id}
						onPageChange={(newPage) => handlePage(newPage)}
						onSelectionModelChange={(itm) => {
							const selectedIDs = new Set(itm);
							const selectRows = globalDraftData?.filter((rows) =>
								selectedIDs.has(rows?.id)
							);
							let obj;
							if (selectRows?.length > 0) {
								obj = selectRows?.map((item, index) => {
									return { id: item?.id, new_name: item?.name };
								});
							}
							setEmailCampaignObj(obj)
							setDraftDataId(itm)
						}}
						components={{
							NoRowsOverlay: () =>
								CustomNoRowsOverlay(loader, globalDraftData, "draft"),
						}}
						disableSelectionOnClick
					/>
				</div>
				<RenameCampaign
					title={"draft"}
					openLT={openRename}
					handleToCloseLT={() => handleToCloseLT()}
					popupDialogID={rowId}
					getData={() => getData()}
					campaignName={campaginName}
				/>
				<DeleteCampaign
					title={"draft campaign"}
					content={"draft campaign"}
					openDelete={openDelete}
					handleToCloseLT={() => setOpenDelete(false)}
					deleteId={rowId}
					getData={getData}
					setRowId={setRowId}
					campaignId={draftDataId}
					setCampaignId={setDraftDataId}
				/>
			</Paper>
		</Box>
	);
}
