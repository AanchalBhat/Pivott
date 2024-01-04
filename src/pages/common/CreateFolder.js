import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import { ReportsApi } from "../../apis/ReportsApi";
import { DataContext } from "../../context";
import Checkbox from "@mui/material/Checkbox";
import { Toaster } from "./Toaster";
import { userApi } from "../../apis/userApi";
import PopupFooter from "./PopupFooter";
import ReportsAutoComplete from "../../components/Reports/ReportDetails/ReportsAutoComplete";
//import global css
import "../../styles/global/common.css";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import debouce from "lodash.debounce";
import { EVERY_ONE } from "../../utils/constants";

export default function CreateFolder({
  openLT,
  handleToCloseLT,
  setIsFolder,
  AllReportGet,
}) {
  const [users, setUsers] = useState([]);
  const [folder_name, setFolder_name] = useState("");
  const [folder_nameErrMsg, setFolder_nameErrMsg] = useState("");
  const [share_folder, setShare_folder] = useState("");
  const [email_id, setEmailId] = useState([]);
  const [emailErr, setEmailErr] = useState("");
  const [shareErrMsg, setShareErrMsg] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const { setReportFolderId, setReportFolderName, setIsMoveFolder } =
    useContext(DataContext);

  useEffect(() => {
    if (openLT) {
      userApi.getUsers().then((data) => {
        if (data?.data) {
          setUsers(data?.data);
        }
      })
        .catch((error) => {
          Toaster.TOAST(getMethodError(error), "error");
          console.log(error);
        });
    }
  }, [openLT]);

  const handleFolderName = (e) => {
    setFolder_name(e.target.value);
    if (!e.target.value) {
      setFolder_nameErrMsg("Folder name can't be empty");
    } else {
      setFolder_nameErrMsg("");
    }
  };
  const handleShareFolder = (e) => {
    let val = e.attributes.value;
    setShare_folder(val);
    if (!val) {
      setShare_folder("");
      return;
    }
    else if (val === EVERY_ONE) {
      setEmailId([]);
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = { name: folder_name };
    if (!folder_name) {
      setFolder_nameErrMsg("Folder name can't be empty");
    }
    if (share_folder === "everyone") {
      data = { ...data, ...{ share_folder_to: share_folder } }
    }
    if (folder_name) {
      if (share_folder === "selected_users") {
        if (email_id?.length === 0) {
          setShareErrMsg("Please select user to share folder with");
          return;
        }
        data = { ...data, ...{ share_folder_to: share_folder, share_with: email_id } }
      }
      createFolder(data);
      setFolder_nameErrMsg("");
      setShareErrMsg("");
    }
  };

  const getAllEmails = (event) => {
    if (event) {
      const ids = event?.map((element, index) => {
        return parseInt(element?.id);
      });
      setEmailId(ids);
      setShareErrMsg("");
    } else {
      setEmailErr("Please enter email");
    }
  };

  const createFolder = (data) => {
    setLoading(true);
    ReportsApi.createFolder(data)

      .then(function (response) {
        if (response?.data) {
          handleToCloseLT();
          setReportFolderName(response?.data?.data?.attributes?.name);
          setReportFolderId(response?.data?.data?.attributes?.id);
          setIsFolder(true);
          setIsMoveFolder(true);
          Toaster.TOAST("Folder created successfully", "success");
          setFolder_name("");
          setShare_folder("");
          setEmailId();
          AllReportGet();
          handleToCloseLT();
        }
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleFolderClose = () => {
    setFolder_name("");
    setShare_folder("");
    setFolder_nameErrMsg("");
    setShareErrMsg("");
    setEmailId([]);
    handleToCloseLT();
    setLoading(false);
  }

  useEffect(() => {
    if (srchUser) {
      getListData();
    }
  }, [srchUser]);

  const getListData = (srchQuery) => {
    userApi
      .getUsers(srchQuery)
      .then((data) => {
        setUserLoading(true);
        if (data?.data) {
          setUsers(data?.data);
          setUserLoading(false);
        } else {
          setUsers([]);
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
        getListData(e);
      }
    }, 800),
    []
  );

  const getContactData = (event, newValue) => {
    if (newValue) {
      setSrchUser(false);
    } else {
      setSrchUser(true);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }
  };

  const share_withAutocomplete = () => {
    return (
      <Autocomplete
        className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
        fullWidth
        multiple
        loading={userLoading}
        id="send to"
        disableCloseOnSelect
        options={users}
        filterOptions={(users) => users}
        onChange={(event, newValue) => {
          getAllEmails(newValue);
        }}
        onInputChange={(event, newInputValue) => getContactData(event, newInputValue)}
        getOptionLabel={(option) => option?.attributes?.full_name}
        renderOption={(props, option, { selected }) => {
          return (
            option?.attributes?.first_name && (
              <li {...props}>
                <Checkbox checked={email_id?.indexOf(+option?.id) > -1} />
                <Box display={"flex"} flexDirection={"row"}>
                  <Avatar size={"22"} variant={"circular"} />
                  <Box display={"flex"} ml={3} flexDirection={"column"}>
                    <Typography color={"text.primary"}>
                      {option?.attributes?.first_name +
                        " " +
                        option?.attributes?.last_name}
                    </Typography>
                    <Typography sx={{ wordBreak: "break-all" }}>
                      {option?.attributes?.email}
                    </Typography>
                  </Box>
                </Box>
                <hr />
                &nbsp;
              </li>
            )
          );
        }}
        renderInput={(params) => (
          <TextField
            className="m-0"
            {...params}
            margin="normal"
            variant="outlined"
            helperText={<span className="ma-error">{emailErr || shareErrMsg}</span>}
            placeholder="Select share with"
          />
        )}
      />
    );
  };

  const share_folderArr = [
    { id: "2", type: "share_folder_to", attributes: { name: "Everyone", value: "everyone" } },
    { id: "1", type: "share_folder_to", attributes: { name: "Selected User", value: "selected_users" } },
  ];

  return (
    <Dialog
      sx={{
        position: "absolute",
        zIndex: "1000",
      }}
      className="ma-popup-boxHolder"
      open={openLT}
      onClose={handleToCloseLT}
    >
      <form onSubmit={(e) => handleSubmit(e)}>
        <DialogTitle className="ma-leadTransferTitle">
          <label>Create Folder</label>
          <DialogActions sx={{ padding: "0" }}>
            <Button
              className="ma-cross-btn"
              data-testid="btn-close"
              onClick={() => handleFolderClose()}
              color="primary"
              autoFocus
            >
              <CloseIcon />
            </Button>
          </DialogActions>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="ma-parentLT">
            <Grid container xs={12} md={12} gap="20px 35px">
              <Grid item xs={12}>
                <label className="labeltxt" data-testid="folder_name">
                  <span className="requreiedField">*</span>Folder Name
                </label>
                <TextField
                  fullWidth
                  data-testid="folder-name"
                  name="folder_name"
                  value={folder_name}
                  id="folder_name"
                  variant="outlined"
                  onChange={(e) => {
                    handleFolderName(e);
                  }}
                  inputProps={{ maxLength: 90 }}
                  helperText={
                    <span className="ma-error">{folder_nameErrMsg}</span>
                  }
                  placeholder="Enter folder name"
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <label className="labeltxt ">
                  Share Folder to{" "}
                </label>
                <ReportsAutoComplete
                  dataTestId="share_folder"
                  name="share_folder"
                  optionsArr={share_folderArr}
                  placeholder="Selected user"
                  handleFunction={handleShareFolder}
                />
              </Grid>
              {share_folder === "selected_users" && (
                <Grid xs={12} md={12}>
                  <label className="labeltxt">
                    <span className="requreiedField">*</span>
                    Share With</label>
                  {share_withAutocomplete()}
                </Grid>
              )}
            </Grid>
          </div>
        </DialogContent>
        <PopupFooter loading={loading} submitBtn={"CREATE"} handleToCloseLT={handleFolderClose} />
      </form>
    </Dialog>
  );
}
