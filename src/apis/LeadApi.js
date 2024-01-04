import {
  LEADS,
  LEAD_FILE_DOWNLOAD,
  LEAD_STATUS,
  LEAD_TRANSFER,
  MANAGE_LEADS,
  UPLOAD_FILE,
  LEAD_SOURCES,
  INDUSTRIES,
  COMPANY_SIZES,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

let header;
let dropdownHeader;

export const LeadAPI = {
  create: function (data) {
    return FetchApi({
      path: LEADS,
      type: "POST",
      data: data,
      contentType: false,
    });
  },

  update: function (data, id) {
    return FetchApi({
      path: `${LEADS}/${id}`,
      type: "PUT",
      data: data,
      contentType: false,
    });
  },

  getAll: function (page, pageSize) {
    return FetchApi({
      path: `${LEADS}/?page=${page}&per_page=${pageSize}`,
      type: "GET",
    });
  },

  getFilter: function (data, page, pageSize, dropdownCheck) {
    let params = data;
    let url = LEADS;
    let result = Object.keys(params).map(function (key) {
      if (key === "status_id")
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
      // to get data of both filter and dropdown filter
      url = url + dropdownHeader;
    }

    return FetchApi({ path: url, type: "GET" });
  },

  getSearchLead: function (data, page, pageSize, check, dropdownCheck) {
    let url;
    if (data || check || dropdownCheck) {
      if (header && check && dropdownHeader && dropdownCheck) {
        url = `${LEADS}/?search[lead]=${data}${header}${dropdownHeader}&page=${page}&per_page=${pageSize}`;
      } else if (dropdownHeader && dropdownCheck) {
        url = `${LEADS}/?search[lead]=${data}${dropdownHeader}&page=${page}&per_page=${pageSize}`;
      } else if (header && check) {
        url = `${LEADS}/?search[lead]=${data}${header}&page=${page}&per_page=${pageSize}`;
      } else {
        url = `${LEADS}/?search[lead]=${data}&page=${page}&per_page=${pageSize}`;
      }
    } else {
      url = LEADS + `?page=${page}&per_page=${pageSize}`;
    }
    return FetchApi({ path: url, type: "GET" });
  },

  getDropdownFilter: function (data, page, pageSize, check) {
    let dropdownFilterUrl;
    if (data) {
      dropdownHeader = `&status_id[]=${data}`;
      dropdownFilterUrl = `${LEADS}?status_id[]=${data}&page=${page}&per_page=${pageSize}`;
    } else {
      dropdownFilterUrl = LEADS + `?page=${page}&per_page=${pageSize}`;
    }
    if (check && header) {
      // to get data of both dropdown filter and normal filter
      dropdownFilterUrl = dropdownFilterUrl + header;
    }
    return FetchApi({ path: dropdownFilterUrl, type: "GET" });
  },

  getByid: function (id) {
    return FetchApi({ path: `${LEADS}/${id}`, type: "GET" });
  },

  manageData: function (data) {
    let id = "";
    id = localStorage.getItem("manage_id");
    if (id?.length) {
      return FetchApi({
        path: `${MANAGE_LEADS}/${id}`,
        type: "PATCH",
        data: JSON.stringify(data),
      });
    }
  },

  fileUpload: function (data) {
    return FetchApi({
      path: UPLOAD_FILE,
      type: "POST",
      data: data,
      contentType: false,
    });
  },

  getfildeDownload: function () {
    return FetchApi({
      path: LEAD_FILE_DOWNLOAD,
      type: "GET",
      contentType: "application/vnd.ms-excel",
      isdownload: true,
    });
  },

  convertType: function (data) {
    return FetchApi({
      path: `${LEADS}/lead_mass_convert`,
      type: "POST",
      data: JSON.stringify(data),
    });
  },

  leadMassDelete: function (data) {
    return FetchApi({
      path: `${LEADS}/lead_mass_delete`,
      type: "DELETE",
      data: JSON.stringify(data),
    });
  },

  leadTransfer: function (data) {
    return FetchApi({
      path: LEAD_TRANSFER,
      type: "PUT",
      data: JSON.stringify(data),
    });
  },

  getLeadStatusData: function () {
    return FetchApi({
      path: `${LEAD_STATUS}`,
      type: "GET",
      isLoader: false,
    });
  },

  getLeadSourceData: function () {
    return FetchApi({
      path: LEAD_SOURCES,
      type: "GET",
      isLoader: false,
    });
  },

  getIndustry: function () {
    return FetchApi({
      path: `${INDUSTRIES}`,
      type: "GET",
      isLoader: false,
    });
  },

  getCompanySize: function () {
    return FetchApi({
      path: `${COMPANY_SIZES}`,
      type: "GET",
      isLoader: false,
    });
  },

  //crud lead source
  createLeadSource: function (data) {
    return FetchApi({
      path: LEAD_SOURCES,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editLeadSource: function (id, data) {
    return FetchApi({
      path: `${LEAD_SOURCES}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deleteLeadSource: function (id, associatedFlag) {
    let url = `${LEAD_SOURCES}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },

  //crud industry
  createIndustry: function (data) {
    return FetchApi({
      path: INDUSTRIES,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editIndustry: function (id, data) {
    return FetchApi({
      path: `${INDUSTRIES}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deleteIndustry: function (id, associatedFlag) {
    let url = `${INDUSTRIES}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },
  //crud lead status
  createLeadStatus: function (data) {
    return FetchApi({
      path: LEAD_STATUS,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editLeadStatus: function (id, data) {
    return FetchApi({
      path: `${LEAD_STATUS}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deleteLeadStatus: function (id, associatedFlag) {
    let url = `${LEAD_STATUS}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },

  //crud company sizes
  createCompanySize: function (data) {
    return FetchApi({
      path: COMPANY_SIZES,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editCompanySize: function (id, data) {
    return FetchApi({
      path: `${COMPANY_SIZES}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deleteCompanySize: function (id, associatedFlag) {
    let url = `${COMPANY_SIZES}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },
};
