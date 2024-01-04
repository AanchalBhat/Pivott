import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@material-ui/core";
import { ReportsApi } from "../../apis/ReportsApi";
import { useNavigate } from "react-router-dom";
import { Toaster } from "./Toaster";
import { ButtonLoader } from "./ButtonLoader";
import { restMethodError } from "../../constants/errorMessages";

export const DeleteDialog = ({
  clonedDataUpdate,
  openDelete,
  reportId,
  handleToCloseLT,
  isDeleted,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    const data = {
      report_ids: reportId,
    };
    setLoading(true);

    ReportsApi.massDelete(data)

      .then((response) => {
        handleToCloseLT();
        clonedDataUpdate();
        isDeleted();
        if (window.location.pathname !== "/reports") {
          navigate("/reports");
        }
        Toaster.TOAST("Report deleted sucessfully", "success");

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };
  return (
    <>
      <Dialog
        open={openDelete}
        onClose={handleToCloseLT}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="alert-dialog-title">Delete Report?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete report ?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-3">
          <Button
            variant="outlined"
            onClick={() => handleToCloseLT()}
            style={{ color: "black" }}
          >
            NO
          </Button>
          <ButtonLoader
            loading={loading}
            handleClick={() => handleDelete()}
            title={"YES"}
            autoFocus={true}
            style={{
              background: "#EC627B",
              color: loading ? "transparent" : "white",
              marginLeft: "14px",
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
