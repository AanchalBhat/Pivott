import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, DialogActions, Button } from '@mui/material';
import "../../styles/custom/ReportsPopup.css";

const PopupHeader = ({ label, handleToCloseLT }) => {
  return (
    <DialogTitle className="ma-popup-leadTransferTitle" >
          <label>{label}</label>
          <DialogActions sx={{ padding: "0" }}>
            <Button className="ma-popupCross-btn" onClick={handleToCloseLT} color="primary" autoFocus>
              <CloseIcon></CloseIcon>
            </Button>
          </DialogActions>{" "}
        </DialogTitle>
  )
}

export default PopupHeader
