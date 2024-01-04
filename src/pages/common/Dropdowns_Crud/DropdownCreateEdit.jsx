import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
// import global css
import "../../../styles/global/common.css";
import { SPACE_REGEX } from "../../../utils/regexLists";

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

export default function DropdownCreateEdit({
  addLabel,
  editLabel,
  placeholder,
  openModal,
  handleToCloseLT,
  valueName,
  handleSubmit,
  handleChange,
  itemValue,
  errMsg, setErrMsg
}) {

  const handleValueChanges = (e) => {
    const inputValue = e.target.value.trimStart();
    if (inputValue === "") {
      setErrMsg("Field can't be empty");
    } else if (inputValue.startsWith(" ") || SPACE_REGEX.test(inputValue)) {
      setErrMsg("Field can't allow space");
    } else {
      setErrMsg("");
    }
    handleChange(inputValue)
  }

  return (
    <BootstrapDialog
      onClose={handleToCloseLT}
      aria-labelledby="customized-dialog-title"
      open={openModal}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleToCloseLT}
        className="ma-contactDetail-form"
      >
        {valueName?.id ? `Rename ${editLabel}` : `Add New ${addLabel}`}
      </BootstrapDialogTitle>
      <DialogContent>
        <div className="ma-parentLT">
          <Grid container xs={12} md={12}>
            <Grid item xs={12} md={12} className={"createlead-detail-grid"}>
              <label className="labeltxt ">
                <span className="requreiedField">*</span> Name
              </label>
              <TextField
                fullWidth
                placeholder={placeholder}
                name="leadSource"
                onChange={(e) => handleValueChanges(e)}
                id="leadSource"
                value={itemValue}
                helperText={<span className="ma-error">{errMsg}</span>}
              />
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions className="p-0">
        <div className="listMDbutton border-0 ma-createEdit-popup">
          <Button className="cancel me-3" autoFocus onClick={handleToCloseLT}>
            CANCEL
          </Button>
          <Button className="applay m-0" autoFocus onClick={handleSubmit}>
            {valueName?.id ? "UPDATE" : "ADD"}
          </Button>
        </div>
      </DialogActions>
    </BootstrapDialog>
  );
}
