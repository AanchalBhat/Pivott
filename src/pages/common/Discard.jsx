import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';
import "../../styles/custom/Popup.css";

export default function Discard({ discard_open, setDiscard_open }) {
    const navigate = useNavigate()

    const handleClose = () => {
        setDiscard_open(false);
    };
    return (
        <Dialog
            open={discard_open}
            onClose={handleClose}
            className="leadT"
            sx={{ margin: 'auto' }}
        >
            <DialogTitle className="ma-discard-leadTransferTitle">
                <label>Create Report</label>
                <DialogActions>
                    <Button className="ma-cross-btn" onClick={handleClose} color="primary" autoFocus>
                        <CloseIcon />
                    </Button>
                </DialogActions>{" "}
            </DialogTitle>

            <DialogTitle className='ma-discard-root'>
                {"Discard Changes?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ letterSpacing: "0.0075em"}}>
                    Unsaved changes will be lost?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className="listMDbutton" style={{ borderTop: "none" }}>
                    <Button className="cancel me-3" autoFocus onClick={handleClose}>
                        NO
                    </Button>
                    <Button className="applay m-0" autoFocus onClick={()=>navigate('/reports')}>
                        YES
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    )
}
