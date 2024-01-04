import {
  CREATE_POTENTIAL,
  POTENTIAL_REASON,
  POTENTIAL_STAGE,
  POTENTIAL_TRANSFER,
  POTENTIAL_TYPE,
  POTENTIAL_WON,
  POTENTIAL_STAGETYPE,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api urls

let header;
let dropdownHeader;

export const PotentialApi = {
  create: function (data) {
    return FetchApi({
      path: CREATE_POTENTIAL,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  potentialWon: function (data) {
    return FetchApi({
      path: POTENTIAL_WON,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  getType: function (company_id) {
    return FetchApi({
      path: POTENTIAL_TYPE + `&company_id=${company_id}`,
      type: "GET",
      isLoader: false,
    });
  },

  getAll: function (page, pageSize) {
    return FetchApi({
      path: CREATE_POTENTIAL + `/?page=${page}&per_page=${pageSize}`,
      type: "GET",
    });
  },

  getStageData: function (company_id) {
    return FetchApi({
      path: POTENTIAL_STAGE + `?company_id=${company_id}`,
      type: "GET",
      isLoader: false,
    });
  },

  getReasonData: function (company_id) {
    return FetchApi({
      path: POTENTIAL_REASON + `?company_id=${company_id}`,
      type: "GET",
    });
  },

  update: function (data, id) {
    return FetchApi({
      path: `${CREATE_POTENTIAL}/${id}`,
      type: "PUT",
      data: JSON.stringify({ data: data }),
    });
  },

  getDataById: function (id) {
    return FetchApi({
      path: `${CREATE_POTENTIAL}/${id}`,
      type: "GET",
    });
  },

  updateLeadDetialsById: function (data, id) {
    return FetchApi({
      path: `${CREATE_POTENTIAL}/${id}/lead_update`,
      type: "PUT",
      data: data,
      contentType: false,
    });
  },

  massDelete: function (data) {
    return FetchApi({
      path: `${CREATE_POTENTIAL}/potential_mass_delete`,
      type: "DELETE",
      data: JSON.stringify(data),
    });
  },

  potentialTransfer: function (data) {
    return FetchApi({
      path: POTENTIAL_TRANSFER,
      type: "PUT",
      data: JSON.stringify(data),
    });
  },

  massConvert: function (data) {
    return FetchApi({
      path: `${CREATE_POTENTIAL}/potential_mass_convert`,
      type: "POST",
      data: JSON.stringify(data),
    });
  },

  getFilter: function (data, page, pageSize, dropdownCheck) {
    let params = data;
    let url = CREATE_POTENTIAL;
    let result = Object.keys(params).map(function (key) {
      if (key === "potential_stage_id")
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

  getPotentialSearch: function (data, page, pageSize, check, dropdownCheck) {
    let url;
    if (data || check || dropdownCheck) {
      if (header && check && dropdownHeader && dropdownCheck) {
        url =
          `${CREATE_POTENTIAL}?search[potential]=${data}` +
          header +
          dropdownHeader;
      } else if (dropdownHeader && dropdownCheck) {
        url = `${CREATE_POTENTIAL}?search[potential]=${data}` + dropdownHeader;
      } else if (header && check) {
        url = `${CREATE_POTENTIAL}?search[potential]=${data}` + header;
      } else {
        url = `${CREATE_POTENTIAL}?search[potential]=${data}`;
      }
      url += `&page=${page}&per_page=${pageSize}`;
    } else {
      url = CREATE_POTENTIAL + `?page=${page}&per_page=${pageSize}`;
    }

    return FetchApi({ path: url, type: "GET" });
  },

  getDropdownFilter: function (data, page, pageSize, check) {
    dropdownHeader = `&potential_stage_id[]=${data}`;

    let dropdownFilterUrl;
    if (data) {
      dropdownFilterUrl = `${CREATE_POTENTIAL}?potential_stage_id[]=${data}&page=${page}&per_page=${pageSize}`;
    } else {
      dropdownFilterUrl =
        CREATE_POTENTIAL + `?page=${page}&per_page=${pageSize}`;
    }
    if (check && header) {
      dropdownFilterUrl = dropdownFilterUrl + header;
    }
    return FetchApi({ path: dropdownFilterUrl, type: "GET" });
  },

  //Dropdown crud
  createStageData: function (data) {
    return FetchApi({
      path: POTENTIAL_STAGE,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editStageData: function (id, data) {
    return FetchApi({
      path: `${POTENTIAL_STAGE}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deleteStageData: function (id) {
    return FetchApi({ path: `${POTENTIAL_STAGE}/${id}`, type: "DELETE" });
  },

  createTypeData: function (data) {
    return FetchApi({
      path: POTENTIAL_STAGETYPE,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editTypeData: function (id, data) {
    return FetchApi({
      path: `${POTENTIAL_STAGETYPE}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deleteTypeData: function (id, associatedFlag) {
    let url = `${POTENTIAL_STAGETYPE}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },
};
