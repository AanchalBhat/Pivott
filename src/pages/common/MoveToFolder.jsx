import React, { useState, useEffect, useContext } from "react";
import Grid from "@mui/material/Grid";
import { Dialog, DialogContent } from "@mui/material";
import PopupHeader from "./PopupHeader";
import PopupFooter from "./PopupFooter";
import FolderAutocomplete from "./FolderAutocomplete";
import { ReportsApi } from "../../apis/ReportsApi";
import { DataContext } from "../../context";
import { Toaster } from "./Toaster";
// import global css
import "../../styles/global/common.css";
import {  restMethodError } from "../../constants/errorMessages";

const MoveToFolder = ({
  openLT,
  handleToCloseLT,
  handleClick,
  reportId,
  getAllData
}) => {
  const [report_folderErrMsg, setReportFolderErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    setReportId,
    reportFolderId,
    reportFolderName,
    setReportFolderId,
    setReportFolderName, setIsMoveFolder
  } = useContext(DataContext);

  useEffect(() => {
    setReportFolderId("");
    setReportFolderName("");
    setIsMoveFolder(false);
  }, []);

  const handleValidation = () => {
    if (!reportFolderId) {
      setReportFolderErrMsg("Folder can't be empty");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValidation();
    const data = {
      report_ids: reportId,
      report_folder_id: reportFolderId,
    };
    if (reportFolderName) {
      setLoading(true);
      ReportsApi.moveToFolder(data)
        .then((response) => {
          if (response) {
            Toaster.TOAST(response?.message, "success");
            handleClose();
            getAllData();
            setReportFolderName("");
            setIsMoveFolder(false);
          }
          setReportId([]);
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
    setReportFolderErrMsg("");
    setReportFolderId("");
    setReportFolderName("");
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
        // onClose={handleToCloseLT}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit}>
          <PopupHeader label="Move Report" handleToCloseLT={handleClose} />
          <DialogContent>
            <div className="ma-parentLT">
              <Grid container xs={12} md={12}>
                <Grid xs={12} md={12} className={"createlead-detail-grid"}>
                  <label className="labeltxt">
                    <span className="requreiedField">*</span>Folder
                  </label>

                  <FolderAutocomplete
                    handleClick={handleClick}
                    // isFolder={false}
                    report_folderErrMsg={report_folderErrMsg}
                    setReportFolderErrMsg={setReportFolderErrMsg}
                  />
                </Grid>
                {/* <span className="ma-error">{folderNameError}</span> */}
              </Grid>
            </div>
          </DialogContent>
          <PopupFooter loading={loading} submitBtn={"Move"} handleToCloseLT={handleClose} />
        </form>
      </Dialog>
    </>
  );
};

export default MoveToFolder;
