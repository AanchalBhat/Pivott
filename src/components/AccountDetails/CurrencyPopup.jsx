
import React from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText, Button, Grid,
    MenuItem,
    CircularProgress,
    TextField,
} from '@mui/material'
// import global css
import "../../styles/global/common.css";
import PopupHeader from '../../pages/common/PopupHeader';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { getSymbol } from '../../utils/currencySymbol';
import FlagIconFactory from 'react-flag-icon-css'

const FlagIcon = FlagIconFactory(React, { useCssModules: false });

const CurrencyPopup = ({
    loading,
    label,
    openDialog,
    currencyValue,
    currencyData,
    flagMap,
    handleChange,
    handleToClose,
    handleCurrency,
}) => {

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={handleToClose}
                className="leadT ma-popup-boxHolder"
            >
                <PopupHeader label={label} handleToCloseLT={handleToClose} />
                <DialogContent >
                    <DialogContentText>
                        <div className="ma-parentLT">
                            <Grid container xs={12} md={12}>
                                <Grid item xs={12} md={12} className={"createlead-detail-grid"}>
                                    <label className="labeltxt">
                                        Company Currency
                                    </label>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        value={currencyValue}
                                        onChange={handleChange}
                                        MenuProps={{
                                            anchorOrigin: {
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            },
                                            transformOrigin: {
                                                vertical: 'top',
                                                horizontal: 'left',
                                            },
                                            getContentAnchorEl: null
                                        }}
                                    >
                                        {
                                            currencyData?.length > 0 && currencyData?.map((elem) => {
                                                return (
                                                    <MenuItem value={elem?.id}
                                                        sx={{
                                                            width: "100%",
                                                            display: "block",
                                                            padding: "10px 20px",
                                                            textAlign: "left",
                                                            borderBottom: "1px solid #e8e8ed"
                                                        }}
                                                    >
                                                        <FlagIcon
                                                            code={flagMap[elem?.attributes?.code]}
                                                            className={`flag-icon-${flagMap[elem?.attributes?.code]}`}
                                                        />
                                                        {`${elem?.attributes?.name} (${elem?.attributes?.code}) ${getSymbol(elem?.attributes?.code)}`}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </TextField>
                                </Grid>
                            </Grid>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#F9F9FB", padding: "0" }}>
                    <div className="listMDbutton">
                        <Button className="cancel me-3" autoFocus onClick={handleToClose}>
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
                            onClick={handleCurrency}
                        >
                            CHANGE
                        </LoadingButton>
                    </div>
                </DialogActions>
            </Dialog >
        </>
    )
}

export default CurrencyPopup
