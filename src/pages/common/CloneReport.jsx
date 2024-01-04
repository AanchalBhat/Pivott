import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PopupHeader from "./PopupHeader";
import PopupFooter from "./PopupFooter";
import FolderAutocomplete from "./FolderAutocomplete";
import { DataContext } from "../../context";
import { ReportsApi } from "../../apis/ReportsApi";
import { Toaster } from "./Toaster";
// import global css
import "../../styles/global/common.css";
import { restMethodError } from "../../constants/errorMessages";

const CloneReport = ({
  openLT,
  handleToCloseLT,
  handleClick,
  cloneReportId,
  clonedDataUpdate,
}) => {
  const [reportName, setReportName] = useState("");
  const [description, setDescription] = useState("");
  const [reportNameError, setReportNameError] = useState("");
  const [report_folderErrMsg, setReportFolderErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { reportFolderId, setReportFolderId, setReportFolderName } =
    useContext(DataContext);

  const handleReport = (value) => {
    setReportName(value);
    if (value) {
      setReportNameError("");
    } else {
      setReportNameError("Report name can't be empty");
    }
  };
  const handleValidation = (e) => {
    if (!reportName || reportName === "") {
      setReportNameError("Report name can't be empty");
    }
    if (!reportFolderId) {
      setReportFolderErrMsg("Folder can't be empty");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValidation();
    const data = {
      report_id: cloneReportId,
      name: reportName,
      description: description,
      report_folder_id: parseInt(reportFolderId),
    };
    if (reportName) {
      setLoading(true);
      ReportsApi.cloneReport(data)
        .then(function (response) {
          if (response?.data?.type) {
            Toaster.TOAST("Report cloned sucessfully", "success");
            handleClose();
            clonedDataUpdate();
            setReportFolderName("");
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    }
  };
  const handleClose = () => {
    setDescription("");
    setReportName("");
    setReportFolderName("");
    setReportFolderId("");
    //err state
    setReportNameError("");
    setReportFolderErrMsg("");
    handleToCloseLT();
  };
  return (
    <>
      <Dialog
        sx={{
          position: "absolute",
          zIndex: "1000",
        }}
        className="ma-popup-boxHolder"
        open={openLT}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit}>
          <PopupHeader label="Clone Report" handleToCloseLT={handleClose} />
          <DialogContent>
            <div className="ma-parentLT">
              <Grid container xs={12} md={12} gap="20px 35px">
                <Grid item xs={12}>
                  <label className="labeltxt">
                    <span className="requreiedField">*</span>Report Name
                  </label>
                  <TextField
                    fullWidth
                    name="report"
                    value={reportName}
                    id="report"
                    variant="outlined"
                    onChange={(e) => handleReport(e.target.value)}
                    helperText={
                      <span className="ma-error">{reportNameError}</span>
                    }
                    placeholder="Enter report name"
                  />
                </Grid>
                <Grid xs={12} md={12} className={"createlead-detail-grid"}>
                  <label className="labeltxt">
                    <span className="requreiedField">*</span>Folder
                  </label>
                  <FolderAutocomplete
                    handleClick={handleClick}
                    isFolder={false}
                    report_folderErrMsg={report_folderErrMsg}
                    setReportFolderErrMsg={setReportFolderErrMsg}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <label className="labeltxt ">Description </label>
                  <TextField
                    data-testid="description"
                    className="createlead-textField placeholder_field"
                    id="description"
                    multiline
                    rows={4}
                    fullWidth
                    name="description"
                    value={description}
                    placeholder="Write some description here"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <PopupFooter loading={loading} submitBtn={"Clone"} handleToCloseLT={handleClose} />
        </form>
      </Dialog>
    </>
  );
};

export default CloneReport;
