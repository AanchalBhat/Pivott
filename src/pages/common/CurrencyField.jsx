import React, { useState, useEffect, useCallback, useContext } from "react";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { CurrencyApi } from "../../apis/currencyApi";
import { getSymbol } from "../../utils/currencySymbol";
import { DataContext } from "../../context";
import { Toaster } from "./Toaster";
import { getMethodError } from "../../constants/errorMessages";

const CurrencyTextField = ({
  field,
  currency,
  setCurrency,
  expected_revenue,
  setFieldValue,
  setRevenue,
  handleChange = () => {},
}) => {
  const [currencyArr, setCurrencyArr] = useState([]);
  const { setCreateModuleFields } = useContext(DataContext);
  useEffect(() => {
    getCurrency();
  }, []);

  const getCurrency = () => {
    CurrencyApi.getCurrency()
      .then((res) => {
        if (res.data) {
          setCurrencyArr(res.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const handleCurrencyState = useCallback(() => {
    let symbol = currencyArr.find((i) => parseInt(i?.id) === parseInt(currency));
    return getSymbol(symbol?.attributes?.code);
  }, [currency, currencyArr]);

  const handleFunction = (e, event) => {
    setCurrency(event.props.value);
    let updatedValue = { currency_id: event.props.value };
    setCreateModuleFields((createModuleFields) => ({
      ...createModuleFields,
      ...updatedValue,
    }));
  };

  return (
    <TextField
      className="currency-textField placeholder_field"
      fullWidth
      type="text"
      id="revenue"
      placeholder="1000"
      name="revenue"
      value={expected_revenue}
      onChange={(e) => {
        if (setFieldValue) {
          setFieldValue(field, e.target.value.replace(/\D/g, ""));
        }
        setRevenue(e.target.value.replace(/\D/g, ""));
        handleChange(e);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <TextField
              id="filled-select-currency"
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
              select
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    style={{ paddingLeft: "15px" }}
                    position="start"
                  >
                    {handleCurrencyState()}
                  </InputAdornment>
                ),
              }}
              onChange={(e, event) => {
                handleFunction(e, event);
              }}
              value={currency}
            >
              {currencyArr &&
                currencyArr.map((elem, key) => (
                  <MenuItem key={key} value={elem.id}>
                    {elem.attributes.code}
                  </MenuItem>
                ))}
            </TextField>
          </InputAdornment>
        ),
      }}
      inputProps={{ maxLength: 10 }}
    />
  );
};

export default CurrencyTextField;