import React, { useEffect, useState, useContext } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import { Box, Paper } from "@material-ui/core";
import { ReportsApi } from "../../apis/ReportsApi";
import { DataContext } from "../../context";
import debouce from "lodash.debounce";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "./Toaster";

export default function FolderAutocomplete({
  handleClick,
  isFolder,
  report_folderErrMsg,
  setReportFolderErrMsg,
}) {
  const [filterData, setFilteredData] = useState([]);
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const page = 1;
  const pageSize = 20;

  const user_info = JSON.parse(localStorage.getItem("user_info"));
  let company_id = user_info?.company_id;
  const {
    setReportFolderId,
    setReportFolderName,
    reportFolderName,
    isMoveFolder,
  } = useContext(DataContext);

  useEffect(() => {
    if (!srchUser) {
      getFolderData();
    }
  }, [srchUser, isFolder, isMoveFolder]);
  const getFolderData = (srchQuery) => {
    ReportsApi.getFolder(company_id, srchQuery, page, pageSize)
      .then((data) => {
        setUserLoading(true);
        if (data?.records?.data) {
          setFilteredData(data?.records?.data);
          setUserLoading(false);
        } else {
          setFilteredData([]);
          setUserLoading(false);
        }
      })
      .catch((error) => {
        setUserLoading(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const debounceSaveUser = React.useCallback(
    debouce(function (e) {
      if (e) {
        getFolderData(e);
      }
    }, 800),
    []
  );

  useEffect(() => {
    setReportFolderErrMsg("");
  }, [reportFolderName]);

  const getReportFolderId = (val) => {
    setReportFolderId(val?.id);
  };

  const getFolderName = (event, name) => {
    if (name) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(name);
    }
    setReportFolderName(name);
  };

  const CustomOption = ({ label }) => (
    <span>
      <span>{label}</span>
    </span>
  );

  const PaperComponentCustom = (options) => {
    const { containerProps, children } = options;
    return (
      <Paper {...containerProps}>
        {children}
        <Box
          sx={{
            padding: "12px",
            display: "flex",
            alignContent: "center",
            cursor: "pointer",
          }}
          onMouseDown={() => handleClick()}
        >
          <span style={{ color: "#2C42B5", fontWeight: 500 }}>
            <span>
              <CreateNewFolderOutlinedIcon />
            </span>
            <span style={{ marginLeft: "12px", textTransform: "uppercase" }}>
              Create New Folder
            </span>
          </span>
        </Box>
      </Paper>
    );
  };
  return (
    <Autocomplete
      loading={userLoading}
      onChange={(event, newInputValue) => {
        getReportFolderId(newInputValue);
        setReportFolderErrMsg("");
      }}
      value={{ attributes: { name: reportFolderName } }}
      options={filterData}
      filterOptions={(filterData) => filterData}
      getOptionLabel={(option) => option?.attributes?.name}
      noOptionsText={"No data found"}
      onInputChange={(event, value) => getFolderName(event, value)}
      isOptionEqualToValue={(option, value) =>
        option?.attributes?.name === value?.attributes?.name
      }
      renderOption={(props, option) => (
        <li
          {...props}
          key={option?.attributes?.id}
          style={{ borderBottom: "1px solid #E8E8ED" }}
        >
          <CustomOption label={option?.attributes?.name} />
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label=""
          variant="outlined"
          helperText={<span className="ma-error">{report_folderErrMsg}</span>}
          placeholder="Select folder"
        />
      )}
      PaperComponent={PaperComponentCustom}
    />
  );
}
