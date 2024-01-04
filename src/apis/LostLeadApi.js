import {
  LOST,
  LOST_CONVERT,
  LOST_DELETE,
  LOST_MASS_TRANSFER,
  LOST_REASONS,
  LOST_SEARCH,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

let header;
let dropdownHeader;

export const LostLeadApi = {
  getAllData: (page, pageSize) => {
    return FetchApi({
      path: `${LOST}/?page=${page}&per_page=${pageSize}`,
      type: "GET",
    });
  },

  getAllFilter: (id, page, pageSize) => {
    header = `&search[reason_id]=${id}`;
    let url;
    if (id) {
      url = `${LOST}?search[reason_id]=${id}&page=${page}&per_page=${pageSize}`;
    } else {
      url = LOST + `?page=${page}&per_page=${pageSize}`;
    }
    return FetchApi({ path: url, type: "GET" });
  },

  getLostLeadSearch: function (data, page, pageSize, dropdownCheck) {
    let url;
    if (data || dropdownCheck) {
      if (header && dropdownCheck) {
        url = `${LOST_SEARCH}/?search[lost_lead]=${data}` + header;
      } else {
        url = `${LOST_SEARCH}/?search[lost_lead]=${data}`;
      }
      url += `&page=${page}&per_page=${pageSize}`;
    } else {
      url = LOST + `?page=${page}&per_page=${pageSize}`;
    }

    return FetchApi({ path: url, type: "GET" });
  },

  fetchOverview: (id) => {
    let URL = `${LOST}/${id}`;
    return FetchApi({ path: URL, type: "GET"
  });
  },

  convertType: (data) => {
    return FetchApi({
      path: LOST_CONVERT,
      type: "POST",
      data: JSON.stringify(data),
    });
  },

  leadDelete: (data) => {
    return FetchApi({
      path: LOST_DELETE,
      type: "DELETE",
      data: JSON.stringify(data),
    });
  },

  massTransfer: (data) => {
    return FetchApi({
      path: LOST_MASS_TRANSFER,
      type: "PUT",
      data: JSON.stringify(data),
    });
  },

  getReasonData: function (company_id) {
    let URL = `${LOST_REASONS}?company_id=${company_id}`;
    return FetchApi({ path: URL, type: "GET", isLoader: false });
  },

  // reason crud
  createReason: function (data) {
    return FetchApi({
      path: LOST_REASONS,
      type: "POST",
      data: JSON.stringify(data),
    });
  },

  editReason: function (id, data) {
    return FetchApi({
      path: `${LOST_REASONS}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
    });
  },

  deleteReason: function (id, associatedFlag) {
    let url = `${LOST_REASONS}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },
  getFilter: function (data, page, pageSize, dropdownCheck) {
    let params = data;
    let url = LOST;
    let result = Object.keys(params).map(function (key) {
        return `${key}=${params[key]}`;
    });

    if (result.length > 0) {
      url += `?${result.join('&')}&page=${page}&per_page=${pageSize}`;
      header = `&${result.join('&')}`
    } else {
      url += `?page=${page}&per_page=${pageSize}`;
    }

    if (dropdownCheck && dropdownHeader) {
      // to get data of both filter and dropdown filter
      url = url + dropdownHeader;
    }

    return FetchApi({ path: url, type: "GET" });
  },

};
