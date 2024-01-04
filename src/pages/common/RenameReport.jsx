import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PopupHeader from "./PopupHeader";
import PopupFooter from "./PopupFooter";
import { ReportsApi } from "../../apis/ReportsApi";
import { Toaster } from "./Toaster";
// import global css
import "../../styles/global/common.css";
import {  restMethodError } from "../../constants/errorMessages";

const RenameReport = ({
  openLT,
  handleToCloseLT,
  popupDialogID,
  getAllData,
  ReportName
}) => {
  // debugger;
  const [rename, setReName] = useState("");
  const [renameError, setReNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRename = (value) => {
    setReName(value);
    if (value) {
      setReNameError("");
    } else {
      setReNameError("Report name can't be empty");
    }
  };
  const handleValidation = (e) => {
    if (!rename || rename === "") {
      setReNameError("Report name can't be empty");
    } else {
      handleUpdate(rename);
    }
  };

  const handleUpdate = (val) => {
    const data = {
      data: {
        name: val,
      },
    };
    setLoading(true);
    ReportsApi.updateNFavorite(popupDialogID, data)
      .then(function (response) {
        if (response?.data?.id) {
          getAllData();
          handleToCloseLT();
          Toaster.TOAST("Report renamed successfully!", "success");
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValidation();
  };


  useEffect(() => {
    setReName(ReportName)
    // setReNameError("");

  }, [ReportName])


  const handelClose = () => {
    handleToCloseLT()
    setReName(ReportName)
    setReNameError("");
  }
  return (
    <Dialog
      sx={{
        position: "absolute",
        zIndex: "1000",
      }}
      className="ma-popup-boxHolder"
      open={openLT}
      onClose={handelClose}
    >
      <form onSubmit={handleSubmit}>
        <PopupHeader label="Rename Report" handleToCloseLT={handelClose} />
        <DialogContent>
          <div className="ma-parentLT">
            <Grid container xs={12} md={12}>
              <Grid item={true} xs={12} md={12} className={"createlead-detail-grid"}>
                <label className="labeltxt">Rename</label>
                <TextField
                  fullWidth
                  name="rename"
                  value={rename}
                  id="rename"
                  variant="outlined"
                  onChange={(e) => handleRename(e.target.value)}
                  helperText={<span className="ma-error">{renameError}</span>}
                  placeholder="Enter report name"
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <PopupFooter loading={loading} submitBtn={"Rename"} handleToCloseLT={handelClose} />
      </form>
    </Dialog>
  );
};

export default RenameReport;
