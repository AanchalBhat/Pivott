import getSymbolFromCurrency from "currency-symbol-map";

export const getSymbol = (currency_code) => {
  return getSymbolFromCurrency(currency_code ? currency_code : "USD");
};
