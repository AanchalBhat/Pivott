import React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Grid, Typography } from '@mui/material';
import PopupHeader from '../../common/PopupHeader';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import "../../../styles/custom/UpgradeOrder.css";

const UpgradeOrderDetail = ({ open, setOpen, onClose }) => {
    return (
        <Dialog
            open={open}
            className="dialogBox"
        >
            <PopupHeader
                label="Order Details"
                handleToCloseLT={() => onClose()}
            />

            <Box container className="ma-upgrade-body" p={2}>
                <Typography variant="h6" className="upgradeHeader">
                    Pro Plan
                </Typography>
                <Grid container display="flex" justifyContent="space-between" alignItems="center" pt={2}>
                    <Grid item xs={6} lg={6} md={6}>
                        <Typography className="subscriptionText">Add Users</Typography>
                    </Grid>
                    <Grid container item xs={6} lg={6} md={6} display="flex" justifyContent="flex-end">
                        <Box className="iconBox">
                            <RemoveCircleSharpIcon sx={{ color: "#5E5F7E" }} />
                            <Typography variant="h6">1</Typography>
                            <AddCircleSharpIcon sx={{ color: "#5E5F7E" }} />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container pt={2}>
                    <Grid item xs={6} lg={6} md={6}>
                        <Typography className="subscriptionText">Annual Subscription</Typography>
                    </Grid>
                    <Grid container item xs={6} lg={6} md={6}
                        display="flex"
                        justifyContent="flex-end">
                        <Typography className="subscriptionAmount">3588.00 INR</Typography>
                    </Grid>
                </Grid>
                <Grid container pt={2} sx={{ paddingBottom: "15px" }}>
                    <Grid item xs={6} lg={6} md={6}>
                        <Typography className="subscriptionText">VAT/GST/Sales taxes (18%)</Typography>
                    </Grid>
                    <Grid container item xs={6} lg={6} md={6}
                        display="flex"
                        justifyContent="flex-end">
                        <Typography className="subscriptionAmount">645.84 INR</Typography>
                    </Grid>
                </Grid>
                <Grid container pt={3} className="totalContainer">
                    <Grid item xs={6} lg={6} md={6}>
                        <Typography className="totalText">Total</Typography>
                    </Grid>
                    <Grid item xs={6} lg={6} md={6} container justifyContent="flex-end">
                        <Typography className="totalText">4233.84 INR</Typography>
                    </Grid>
                </Grid>
                <Grid container pt={6} display="flex"
                    justifyContent="center"
                    alignItems="center" sx={{ paddingBottom: "20px" }}>
                    <Grid item xs={12} lg={12} md={12} className="actions_button">
                        <Button variant="contained"
                            fullWidth
                            className="actionButton">
                            Confirm and Pay
                        </Button>
                    </Grid>

                </Grid>
            </Box>
        </Dialog >
    );
};

export default UpgradeOrderDetail;


