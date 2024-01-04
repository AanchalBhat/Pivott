import {
  DEAL_CREATE,
  PAYMENT_MODE,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

let header;
let dropdownHeader;

export const DealsApi = {
  create: function (data) {
    return FetchApi({
      path: DEAL_CREATE,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  getAll: function (page, pageSize) {
    return FetchApi({
      path: DEAL_CREATE + `/?page=${page}&per_page=${pageSize}`,
      type: "GET",
    });
  },

  update: function (data, id) {
    return FetchApi({
      path: `${DEAL_CREATE}/${id}`,
      type: "PUT",
      data: JSON.stringify({ data: data }),
    });
  },

  getDataById: function (id) {
    return FetchApi({
      path: `${DEAL_CREATE}/${id}`,
      type: "GET",
    });
  },
  updateLeadDetialsById: function (data, id) {
    return FetchApi({
      path: `${DEAL_CREATE}/${id}/lead_update`,
      type: "PUT",
      data: data,
      contentType: false,
    });
  },

  massDelete: function (data) {
    return FetchApi({
      path: `${DEAL_CREATE}/deal_mass_delete`,
      type: "DELETE",
      data: JSON.stringify(data),
    });
  },

  getFilter: function (data, page, pageSize, dropdownCheck) {
    let params = data;
    let url = DEAL_CREATE;
    let result = Object.keys(params).map(function (key) {
      if (key === "payment_mode_id")
        return `${key}[]=${params[key]}`;
      else
        return `${key}=${params[key]}`;
    });
    if (result.length > 0) {
      url += `?${result.join('&')}&page=${page}&per_page=${pageSize}`;
      header = `&${result.join('&')}`
    } else {
      url += `?page=${page}&per_page=${pageSize}`;
    }
    if (dropdownCheck && dropdownHeader) {
      url = url + dropdownHeader;
    }
    return FetchApi({ path: url, type: "GET" });
  },

  getDealSearch: function (data, page, pageSize, check, dropdownCheck) {
    let url;
    if (data || check || dropdownCheck) {
      if (header && check && dropdownHeader && dropdownCheck) {
        url = `${DEAL_CREATE}?search[deal]=${data}` + header + dropdownHeader;
      } else if (dropdownHeader && dropdownCheck) {
        url = `${DEAL_CREATE}?search[deal]=${data}` + dropdownHeader;
      } else if (header && check) {
        url = `${DEAL_CREATE}?search[deal]=${data}` + header;
      } else {
        url = `${DEAL_CREATE}?search[deal]=${data}`;
      }
    } else {
      url = DEAL_CREATE + `?page=${page}&per_page=${pageSize}`;
    }
    return FetchApi({ path: url, type: "GET" });
  },

  getDropdownFilter: function (data, page, pageSize, check) {
    dropdownHeader = `&payment_mode_id[]=${data}`;
    let dropdownFilterUrl;
    if (data) {
      dropdownFilterUrl = `${DEAL_CREATE}?payment_mode_id[]=${data}&page=${page}&per_page=${pageSize}`;
    } else {
      dropdownFilterUrl = DEAL_CREATE + `?page=${page}&per_page=${pageSize}`;
    }
    if (check && header) {
      dropdownFilterUrl = dropdownFilterUrl + header;
    }
    return FetchApi({
      path: dropdownFilterUrl,
      type: "GET",
    });
  },

  dealMassTransfer: function (data) {
    return FetchApi({
      path: `${DEAL_CREATE}/deal_mass_transfer`,
      type: "PUT",
      data: JSON.stringify(data),
    });
  },

  getPaymentModeData: function () {
    return FetchApi({
      path: PAYMENT_MODE,
      type: "GET",
      isLoader: false,
    });
  },

  createPaymentMode: function (data) {
    return FetchApi({
      path: PAYMENT_MODE,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editPaymentMode: function (id, data) {
    return FetchApi({
      data: `${PAYMENT_MODE}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deletePaymentMode: function (id, associatedFlag) {
    let url = `${PAYMENT_MODE}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },
};
