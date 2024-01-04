
import { Dialog, DialogActions, DialogContent, DialogContentText, Button, Grid, CircularProgress } from '@mui/material'
// import global css
import "../../styles/global/common.css";
import PopupHeader from './PopupHeader';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';

const DialogBox = ({
  label, openLT, handleToCloseLT, contactDropDown, handleLeadMassTransfer, loading
}) => {
  return (
    <>
      <Dialog
        open={openLT}
        onClose={handleToCloseLT}
        className="leadT ma-popup-boxHolder"
      >
        <PopupHeader label={label} handleToCloseLT={handleToCloseLT} />
        <DialogContent >
          <DialogContentText>
            <div className="ma-parentLT">
              <Grid container xs={12} md={12}>
                <Grid item xs={12} md={12} className={"createlead-detail-grid"}>
                  <label className="labeltxt">
                    <span className="requreiedField">*</span>Transfer to
                  </label>
                  {contactDropDown()}
                </Grid>
              </Grid>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#F9F9FB", padding: "0" }}>
          <div className="listMDbutton">
            <Button className="cancel me-3" autoFocus onClick={handleToCloseLT}>
              CANCEL
            </Button>
            <LoadingButton
                    loading={loading}
                    loadingIndicator={<CircularProgress />}
                    disabled={loading}
                    data-testid="submit-btn"
                    className="applay m-0"
                    type='button'
                    autoFocus
                    variant="contained"
                    onClick={handleLeadMassTransfer}>
                    TRANSFER
                </LoadingButton>
          </div>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogBox
