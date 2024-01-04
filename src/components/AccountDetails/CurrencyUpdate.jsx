import { useState, useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import "../../styles/global/common.css"
import { CurrencyApi } from "../../apis/currencyApi";
import CurrencyPopup from "./CurrencyPopup";
import { Toaster } from "../../pages/common/Toaster";
import { getMethodError, restMethodError } from "../../constants/errorMessages";
import { getSymbol } from "../../utils/currencySymbol";

const CurrencyUpdate = () => {
    const [currencyData, setCurrencyData] = useState([]);
    const [flagMap, setFlagMap] = useState({});
    const [defaultCurrency, setDefaultCurrency] = useState();
    const [currencyValue, setCurrencyValue] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [loader, setLoader] = useState(false);
    const company_id = JSON.parse(localStorage.getItem("user_info"))?.company_id;

    useEffect(() => {
        getCurrencyData();
    }, []);

    const getCurrencyData = () => {
        CurrencyApi.getCurrency()
            .then((res) => {
                res?.data.filter(elem => {
                    if (elem?.attributes?.default_currency) {
                        setCurrencyValue(elem.id);
                        setDefaultCurrency(elem?.attributes)
                    }
                    setFlagMap((prevFlagMap) => ({
                        ...prevFlagMap,
                        [elem?.attributes?.code]: (elem?.attributes?.code.substring(0, 2))?.toLowerCase(),
                    }));
                })
                setCurrencyData(res?.data);
            })
            .catch((error) => {
                Toaster.TOAST(getMethodError(error), "error");
                console.log(error)
            });
    }

    const handleChange = (e) => {
        let val = e.target.value;
        setCurrencyValue(val)
    }

    const handleCurrency = () => {
        setLoader(true);
        let data = {
            currency_id: currencyValue
        }
        CurrencyApi.updateCurrency(company_id, data)
            .then((res) => {
                Toaster.TOAST("Currency updated successfully", 'success')
                setLoader(false);
                setOpenDialog(false);
                getCurrencyData();
                const userData = JSON.parse(localStorage.getItem('user_info')) || {};
                userData.currency = res?.data?.attributes?.currency;
                localStorage.setItem('user_info', JSON.stringify(userData));
            })
            .catch((error) => {
                setLoader(false);
                Toaster.TOAST(restMethodError(error), 'error')
                console.log(error)
            })
    }

    const handleToClose = () => {
        setOpenDialog(false);
        currencyData?.filter(elem => elem?.attributes?.default_currency && setCurrencyValue(elem.id))
    };

    const currencyName = () => {
        if (defaultCurrency?.name) {
            return (
                <Typography className="currency-span">{`${defaultCurrency?.name} (${defaultCurrency?.code}) ${getSymbol(defaultCurrency?.code)}`}</Typography>
            );
        } else return "-";
    }

    return (
        <Box className="pb-3 currency-main-box">
            <Box className='d-flex justify-content-between  align-items-center m-4'>
                <Typography variant='h6'>Default Currency</Typography>
            </Box>
            <Box className="currency-box">
                <Grid container xs={12} md={12} lg={12}
                >
                    <Grid item xs={12} md={12} lg={4} className="currency-grid"  >
                        <Typography className="currency-heading">Currency</Typography>
                        {currencyName()}
                    </Grid>
                    <Grid item xs={12} md={12} lg={4} className="currency-grid" >
                        <Typography className="currency-heading">Currency Format</Typography>
                        <Typography className="currency-span">
                            {defaultCurrency?.code ? `${getSymbol(defaultCurrency?.code)} 123,456.24` : '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={4} className="currency-grid-button" >
                        <Button
                            className="currency-btn"
                            variant="contained"
                            onClick={() => { setOpenDialog(true) }}
                        >
                            Change Currency
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <CurrencyPopup
                loading={loader}
                label="Change default currency"
                openDialog={openDialog}
                currencyValue={currencyValue}
                currencyData={currencyData}
                flagMap={flagMap}
                handleChange={handleChange}
                handleToClose={handleToClose}
                handleCurrency={handleCurrency}
            />
        </Box>
    )
}

export default CurrencyUpdate;