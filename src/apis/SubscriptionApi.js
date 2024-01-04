import { SUBSCRIPTIONS, CURRENT_PLAN, TRANSACTION_HISTORY } from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const SubscriptionApi = {

    getSubscription: (billing_cycle) => {
        return FetchApi({
            path: `${SUBSCRIPTIONS}?search[billing_cycle]=${billing_cycle}`,
            type: "GET"
        });
    },
    getCurrentPlan: () => {
        return FetchApi({
            path: CURRENT_PLAN,
            type: "GET"
        });
    },
    getTransactionHistory: (page, pageSize, data) => {
        let url = `${TRANSACTION_HISTORY}?page=${page}&per_page=${pageSize}`
        if (data) {
            url += `&search[subscription]=${data}`
        }
        return FetchApi({
            path: url,
            type: "GET"
        });
    },
};
