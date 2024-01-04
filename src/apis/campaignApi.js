import {
    CAMPAIGN_LIST,
    CONTACT_DETAILS,
    RECIPIENT_LIST,
    EMAIL_CAMPAIGN,
    CAMPAIGN_MASS_DELETE,
    ARCHIVE_CAMPAIGNS,
    MOVE_ARCHIVE_CAMPAIGNS,
    CANCEL_ARCHIVE,
    CAMPAIGN_RECIPIENTS,
    CAMPAIGN_DUPLICATION,
    CANCEL_CAMPAIGNS,
    DUPLICATE_NAME,
    CAMPAIGN_MASS_RENAME,
    SEND_TEST_EMAIL,
    START_CAMPAIGN,
} from "../constants/routes";
import { IS_ARCHIVE, IS_DRAFT } from "../utils/constants";
import { FetchApi } from "./fetchApi";

let url;
let header;
let archive_header;

export const campaignApi = {
    getEmailCampaign: (page, pageSize, is_archived = false) => {
        url = `${CAMPAIGN_LIST}?page=${page}&per_page=${pageSize}`;
        if (is_archived) {
            url = `${url}&search[is_archived]=true`;
        }
        return FetchApi({ path: url, type: "GET" });
    },

    getRecipients: (value) => {
        let url = RECIPIENT_LIST;
        if (value) {
            url += `?search[contact_detail]=${value}`;
        }
        return FetchApi({
            path: url,
            type: "GET",
        });
    },

    getStatusFilter: (page, pageSize, status, isTrue, isArchive = false) => {
       
        url = `${CAMPAIGN_LIST}?page=${page}&per_page=${pageSize}`
        if (status) {
            url += `&search[status]=${status}`
            if (isArchive) {
                url += `&search[is_archived]=${isTrue}`;
                archive_header = `&search[status]=${status}`
                header = ""
            } else {
                url += `&search[except_draft_archived]=true`
                header = `&search[status]=${status}`
                archive_header = ""
            }

        } else if (!status && isTrue) {
            header = "";
            archive_header = "";
            url += `&search[is_archived]=${isTrue}`
        } else {
            header = ""
            archive_header = ""
            url += `&search[except_draft_archived]=true`
        }
        return FetchApi({
            path: url,
            type: "GET"
        });
    },

    campaginSingleDelete: (id) => {        // single delete
        return FetchApi({
            path: `${CAMPAIGN_LIST}/${id}`,
            type: "DELETE"
        });
    },

    campaginMassDelete: (data) => {        // multiple delete
        return FetchApi({
            path: `${CAMPAIGN_MASS_DELETE}`,
            type: "DELETE",
            data: JSON.stringify(data),
        });
    },

    getOverviewData: (id) => {
        return FetchApi({
            path: `${CAMPAIGN_LIST}/${id}`,
            type: "GET"
        });
    },

    createCampaign: (data) => {
        return FetchApi({
            path: `${EMAIL_CAMPAIGN}`,
            type: "POST",
            data: data,
            contentType: false,
        });
    },

    updateCampaign: (data, id) => {
        return FetchApi({
            path: `${EMAIL_CAMPAIGN}/${id}`,
            type: "PUT",
            data: data,
            contentType: false,
        });
    },

    archiveCampaign: (data, name) => {

        if (name === ARCHIVE_CAMPAIGNS) {
            url = `${ARCHIVE_CAMPAIGNS}`
        } else if (name === CANCEL_ARCHIVE) {
            url = `${CANCEL_ARCHIVE}`
        } else {
            url = `${MOVE_ARCHIVE_CAMPAIGNS}`
        }

        return FetchApi({
            path: `${EMAIL_CAMPAIGN}${url}`,
            type: "PUT",
            data: JSON.stringify(data)
        });
    },
    campaignSearch: (page, pageSize, isTrue = "", data, isFirst) => {
        
        url = `${EMAIL_CAMPAIGN}?page=${page}&per_page=${pageSize}`
        if (isTrue === IS_ARCHIVE) {
            if (data) {
                url += `&search[name]=${data}&search[is_archived]=true`;
            } else {
                header = ""
                url += `&search[is_archived]=true`
            }
            if (archive_header) {
                header = ""
                url += archive_header;
            }
        } else if (isTrue === IS_DRAFT) {
            header = ""
            archive_header = ""
            if (data) {
                url += `&search[name]=${data}&search[status]=draft`;
            } else {
                url += `&search[status]=draft`;
            }
        }
        else {

            url += `&search[except_draft_archived]=true`
            if (data && !isTrue) {
                url += `&search[name]=${data}`;
            }
            archive_header = ""
            if (header && !isFirst) {
                url += header;
            } else {
                header = ""
            }
        }

        return FetchApi({
            path: url,
            type: "GET",
        });
    },
    renameCampaign: (id, data) => {
        return FetchApi({
            path: `${EMAIL_CAMPAIGN}/${id}`,
            type: "PUT",
            data: JSON.stringify(data)
        });
    },
    getReceipentsListData: function (id, page, pageSize, status) {
        if (status) {
            url = `${CAMPAIGN_RECIPIENTS}?email_campaign_id=${id}&search[status]=${status}&page=${page}&per_page=${pageSize}`;
        } else {
            url = `${CAMPAIGN_RECIPIENTS}?email_campaign_id=${id}&page=${page}&per_page=${pageSize}`;
        }
        return FetchApi({ path: url, type: "GET" });
    },
    cancelCampaign: (id) => {
        return FetchApi({
            path: `${CANCEL_CAMPAIGNS}?email_campaign_id=${id}`,
            type: "PUT"
        });
    },
    massRename: (data) => {
        return FetchApi({
            path: `${CAMPAIGN_MASS_RENAME}`,
            type: "PUT",
            data: JSON.stringify({ data: data })
        })
    },
    sendTestEmail: (data) => {
        return FetchApi({
            path: `${EMAIL_CAMPAIGN}${SEND_TEST_EMAIL}`,
            type: "POST",
            data: JSON.stringify({ data: data })
        })
    },
    getDuplicateData: function (data) {
        return FetchApi({
            path: CAMPAIGN_DUPLICATION,
            type: "POST",
            data: JSON.stringify({ data: data })
        });
    },
    getDetail: function (id) {
        return FetchApi({
            path: `${EMAIL_CAMPAIGN}/${id}`,
            type: "GET",
        });
    },
    getDuplicateName: function (id) {
        return FetchApi({
            path: `${DUPLICATE_NAME}?email_campaign_id=${id}`,
            type: "GET",
        });
    },
    startCampaign: function () {
        return FetchApi({
            path: `${START_CAMPAIGN}`,
            type: "PUT",
        });
    },
};