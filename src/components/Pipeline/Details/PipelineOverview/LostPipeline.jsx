import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "react-phone-input-2/lib/style.css";
import { PotentialApi } from "../../../../apis/PotentialApi";
import { PipelineApi } from "../../../../apis/pipelineApi";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import AddIcon from '@mui/icons-material/AddCircleOutlined';
import { Toaster } from "../../../../pages/common/Toaster";
// import global css
import "../../../../styles/global/common.css";
import { ButtonLoader } from "../../../../pages/common/ButtonLoader";
import { getMethodError, restMethodError } from "../../../../constants/errorMessages";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function LostPipelinePopup(props) {
  const lost_leadable_type = props?.type;
  const lost_leadable_id = props?.id;
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [reasonData, setReasonData] = useState([]);

  const [errMsg, setErrMsg] = useState("");
  let id = JSON.parse(localStorage.getItem("user_info"));

  useEffect(() => {
    if (!props.openModal || props.isDelete) {
      getReasonData();
    }
    if (props.isDelete) {
      getReasonData();
      props.setReasonId("")
    }
  }, [props.openModal, props.isDelete]);

  const handleClose = () => {
    setOpen(false);
    props.setOpenModal(false);
  };
  const getReasonData = () => {
    PotentialApi.getReasonData(id?.company_id)

      .then((response) => {
        if (response?.data?.length > 0) {
          setReasonData(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const handleSubmit = () => {
    setLoading(true);
    let data = {
      description: description,
      lost_leadable_id: parseInt(lost_leadable_id), //pipeline id
      lost_leadable_type: lost_leadable_type,
      reason_id: parseInt(props?.reason_id),
    };

    if (description?.length !== 0 && props?.reason_id?.length !== 0) {
      PipelineApi.createLostData(data)

        .then((response) => {
          if (response?.data) {
            props.setOpenModal(false);
            Toaster.TOAST(
              `${props?.type} has been successfully moved to lost leads`,
              "success"
            );
            setOpen(false);
            navigate(`/lost-lead/${response.data.id}/overview`);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      setErrMsg("Please fill all fields below");
      setLoading(false);
    }
  };

  const handleReasonChange = (e) => {
    props?.setReasonId(e?.target?.value);
  };
  const handleDesciptionChanges = (e) => {
    setDescription(e?.target?.value);
  };

  return (
    <>
      <div className="">
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            className="ma-contactDetail-form"
          >
            Lost Lead
          </BootstrapDialogTitle>
          <DialogContent dividers className="ma-createMain-form">
            {errMsg && (
              <div className="d-flex justify-content-end align-items-center">
                <Alert className="py-0 px-2" severity="error">
                  {errMsg}
                </Alert>
              </div>
            )}
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={10}
                sx={{ mx: "auto" }}
                className={"createlead-detail-grid"}
              >
                <label
                  htmlFor="lost"
                  data-testid="lost-reason"
                  className="labeltxt "
                >
                  <span className="requreiedField">*</span>Reason for Lost
                </label>
                <TextField
                  className="createlead-textField placeholder_field"
                  fullWidth
                  id="lost"
                  data-testid="lost"
                  name="reason_lost"
                  onChange={(e) => handleReasonChange(e)}
                  select
                  value={props?.reason_id}
                  label={!props?.reason_id && "Select reason for lost"}
                  InputLabelProps={{
                    shrink: false,
                    style: {
                      color: '#8c8da3',
                      fontSize: '14px'
                    },
                  }}
                >
                  {reasonData?.map((data, key) => {
                    return (
                      <MenuItem key={key} value={data.id}
                        className="menu-item" divider={true}
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                      >
                        <span>{data?.attributes?.name}</span>
                        {(id.role.role_name === "superadmin" || id.role.role_name === "admin") &&
                          <span className={data?.attributes?.name === "Other" ? "edit-delete-remove" : "edit-delete-icons"}>
                            <EditIcon onClick={(event) => props.handleEditClick(event, data)} sx={{ color: '#191A47', fontSize: '20px' }} />
                            <DeleteIcon onClick={() => props.handleShow(data)} sx={{ color: '#191A47', fontSize: '20px' }} />
                          </span>
                        }

                      </MenuItem>
                    );
                  })}
                  {
                    (id?.role.role_name === "superadmin" || id?.role.role_nameInfo === "admin") &&
                    <MenuItem onClick={() => props.onAddDetail('add_new', props?.reason_id)}
                      sx={{
                        position: 'sticky',
                        zIndex: 3,
                        bottom: 0,
                        background: '#fff',
                        display: 'flex',
                        color: "#2C42B5",
                        fontSize: '14px',
                        fontWeight: '600',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        gap: "5px",
                        '&:hover': {
                          backgroundColor: "#fff !important"
                        },
                        '&.Mui-selected': {
                          backgroundColor: "#fff",
                        },
                      }}

                    ><AddIcon sx={{ color: "#2C42B5" }} /> {`ADD NEW ${props.addNew.toUpperCase()}`}</MenuItem>
                  }
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                md={10}
                sx={{ mx: "auto" }}
                className={"createlead-detail-grid"}
              >
                <label htmlFor="description" className="labeltxt ">
                  <span className="requreiedField">*</span>Description
                </label>
                <TextField
                  data-testid="desc"
                  id="description"
                  multiline
                  rows={4}
                  fullWidth
                  value={description}
                  className="placeholder_field"
                  name="description"
                  placeholder="Write some description here"
                  onChange={(e) => handleDesciptionChanges(e)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="ma-bottomBox-area">
            <div className="listMDbutton border-0 py-2 px-3">
              <Button
                data-testid="cancel"
                className="cancel me-3"
                autoFocus
                onClick={handleClose}
              >
                CANCEL
              </Button>
              <ButtonLoader
                loading={loading}
                classStyle={"ma-moveLost-btn m-0"}
                handleClick={() => handleSubmit()}
                testid={"move-lost"}
                title={"MOVE TO LOST"}
                autoFocus={true}
              />
            </div>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </>
  );
}
