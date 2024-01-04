import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@material-ui/core";
import { Toaster } from "../../../pages/common/Toaster";
import { ButtonLoader } from "../../../pages/common/ButtonLoader";
import { deleteMethodError } from "../../../constants/errorMessages";
import { campaignApi } from "../../../apis/campaignApi";
import { useNavigate } from "react-router-dom";
import { templateApi } from "../../../apis/templateApi";

export const DeleteCampaign = ({
  title,
  content,
  openDelete,
  deleteId,
  getData,
  handleToCloseLT,
  setRowId,
  campaignId,
  overviewDelete = false,
  templateDelete = false,
  setPage,
  setCampaignId,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  let row_id = [deleteId];
  let ids = deleteId ? row_id : campaignId;

  const handleDeleteResponse = (response) => {
    if (response) {
      handleToCloseLT();
      Toaster.TOAST(response?.message, "success");
      if (overviewDelete) {
        navigate("/campaign/lists");
      }
    }
    setLoading(false);
    getData(1);
    setRowId("");
    setCampaignId([]);
  };

  const handleDeleteError = (error) => {
    setLoading(false);
    Toaster.TOAST(deleteMethodError(error), "error");
    console.log(error);
  };

  const handleDelete = () => {
    let data = {
      data: {
        email_campaign_ids: ids,
      },
    };
    setLoading(true);
    if (campaignId?.length > 0) {
      campaignApi
        .campaginMassDelete(data)
        .then(handleDeleteResponse)
        .catch(handleDeleteError);
    } else if (deleteId && templateDelete) {
      setPage(1);
      templateApi
        .deleteTemplate(deleteId)
        .then(handleDeleteResponse)
        .catch(handleDeleteError);
    } else {
      campaignApi
        .campaginSingleDelete(deleteId)
        .then(handleDeleteResponse)
        .catch(handleDeleteError);
    }
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
        <DialogTitle id="alert-dialog-title">Delete {title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {content} ?
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
