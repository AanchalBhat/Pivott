import { COMPANIES, CURRENCY } from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const CurrencyApi = {
    getCurrency: () => {
        return FetchApi({ path: CURRENCY, type: "GET" })
    },
    updateCurrency: (id, data) => {
        return FetchApi({ path: `${COMPANIES}/${id}`, type: "PUT", data: { data: data } })
    },
}