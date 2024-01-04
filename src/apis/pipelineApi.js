import {
  CONTACT_DETAILS,
  CREATE_PIPELINE,
  GET_PIPELINE,
  PIPELINE_LOST,
  PIPELINE_SCORE,
  PIPELINE_STAGE,
  PIPELINE_TRANSFER,
  PIPELINE_TYPE,
  PIPELINE_WON,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api url

let header;
let dropdownHeader;

export const PipelineApi = {
  create: function (data) {
    return FetchApi({
      path: CREATE_PIPELINE,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  createLostData: function (data) {
    return FetchApi({
      path: PIPELINE_LOST,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  pipelineWon: function (data) {
    return FetchApi({
      path: PIPELINE_WON,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  getType: function (company_id) {
    let URL = `${PIPELINE_TYPE}&company_id=${company_id}`;
    return FetchApi({
      path: URL,
      type: "GET",
      isLoader: false
    });
  },

  getAll: function () {
    return FetchApi({ path: GET_PIPELINE, type: "GET" });
  },

  getStageData: function (company_id) {
    let URL = `${PIPELINE_STAGE}?company_id=${company_id}`;
    return FetchApi({ path: URL, type: "GET", isLoader: false });
  },

  getContactDetails: function (srchQuery, page, pageSize) {
    let url = CONTACT_DETAILS + `?page=${page}&per_page=${pageSize}`;
    if (srchQuery) {
      url += `&search[contact_detail]=${srchQuery}`;
    }
    return FetchApi({ path: url, type: "GET", isLoader: false });
  },

  update: function (data, id) {
    return FetchApi({
      path: `${CREATE_PIPELINE}/${id}`,
      type: "PUT",
      data: JSON.stringify({ data: data }),
    });
  },

  getDataById: function (id) {
    return FetchApi({
      path: `${GET_PIPELINE}/${id}`,
      type: "GET",
    });
  },

  updateLeadDetialsById: function (data, id) {
    return FetchApi({
      path: `${CREATE_PIPELINE}/${id}/lead_update`,
      type: "PUT",
      data: data,
      isLoader: false,
    });
  },

  piplineView: function (view, page, pageSize) {
    return FetchApi({
      path: `${CREATE_PIPELINE}?list_view=${view}&page=${page}&per_page=${pageSize}`,
      type: "GET",
    });
  },

  massDelete: function (data) {
    return FetchApi({
      path: `${CREATE_PIPELINE}/pipeline_mass_delete`,
      type: "DELETE",
      data: JSON.stringify(data),
    });
  },

  pipelineTransfer: function (data) {
    return FetchApi({
      path: PIPELINE_TRANSFER,
      type: "PUT",
      data: JSON.stringify(data),
    });
  },

  massConvert: function (data) {
    return FetchApi({
      path: `${CREATE_PIPELINE}/pipeline_mass_convert`,
      type: "POST",
      data: JSON.stringify(data),
    });
  },

  getDropdownFilter: function (val, data, page, pageSize, check) {
    let url;
    if (val) {
      url = `${CREATE_PIPELINE}?pipeline_stage_id[]=${val}`;
      dropdownHeader = `&pipeline_stage_id[]=${val}`;
      if (data) {
        url = `${CREATE_PIPELINE}?list_view=true&pipeline_stage_id[]=${val}&page=${page}&per_page=${pageSize}`;
      }
    } else {
      url = CREATE_PIPELINE;
      if (data) {
        url = `${CREATE_PIPELINE}?list_view=true&page=${page}&per_page=${pageSize}`;
      }
    }

    if (check && header) {
      url = url + header;
    }
    return FetchApi({ path: url, type: "GET" });
  },

  getFilter: function (data, page, pageSize, val, dropdownCheck) {
    let params = data;
    let url = CREATE_PIPELINE;
    let result = Object.keys(params).map(function (key) {
      if (key === "pipeline_stage_id")
        return `${key}[]=${params[key]}`;
      else
        return `${key}=${params[key]}`;
    });
    if (result.length > 0) {
      url += `?list_view=true&${result.join('&')}&page=${page}&per_page=${pageSize}`;
      header = `&${result.join('&')}`
    } else {
      url += `?page=${page}&list_view=true&per_page=${pageSize}`;
    }
    if (dropdownCheck && dropdownHeader) {
      // to get data of both filter and dropdown filter
      url = url + dropdownHeader;
    }

    return FetchApi({ path: url, type: "GET" });
  },

  getPipelineSearch: function (
    data,
    check,
    list_view,
    page,
    pageSize,
    dropdownCheck
  ) {
    let url;
    if (data || check || dropdownCheck) {
      if (!list_view) {
        if (dropdownCheck && dropdownHeader) {
          url = `${GET_PIPELINE}?search[pipeline]=${data}` + dropdownHeader;
        } else {
          url = `${GET_PIPELINE}?search[pipeline]=${data}`;
        }
      } else {
        if (header && check && dropdownHeader && dropdownCheck) {
          url =
            `${GET_PIPELINE}?list_view=true&search[pipeline]=${data}` +
            header +
            dropdownHeader +
            `&page=${page}&per_page=${pageSize}`;
        } else if (dropdownHeader && dropdownCheck) {
          url =
            `${GET_PIPELINE}?list_view=true&search[pipeline]=${data}` +
            dropdownHeader +
            `&page=${page}&per_page=${pageSize}`;
        } else if (header && check) {
          url =
            `${GET_PIPELINE}?list_view=true&search[pipeline]=${data}` +
            header +
            `&page=${page}&per_page=${pageSize}`;
        } else {
          url = `${GET_PIPELINE}?list_view=true&search[pipeline]=${data}&page=${page}&per_page=${pageSize}`;
        }
      }
    } else {
      url = CREATE_PIPELINE;
      if (list_view) {
        url =
          CREATE_PIPELINE +
          `?list_view=${true}&page=${page}&per_page=${pageSize}`;
      }
    }
    return FetchApi({ path: url, type: "GET" });
  },
  //crud pipeline stage
  createPipelineStage: function (data) {
    return FetchApi({
      path: PIPELINE_STAGE,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editPipelineStage: function (id, data) {
    return FetchApi({
      path: `${PIPELINE_STAGE}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deletePipelineStage: function (id, associatedFlag) {
    let url = `${PIPELINE_STAGE}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },

  getPipelineScoreData: function () {
    return FetchApi({
      path: `${PIPELINE_SCORE}`,
      type: "GET",
      isLoader: false,
    });
  },

  createPipelineScore: function (data) {
    return FetchApi({
      path: `${PIPELINE_SCORE}`,
      type: "POST",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  editPipelineScore: function (id, data) {
    return FetchApi({
      path: `${PIPELINE_SCORE}/${id}`,
      type: "PUT",
      data: JSON.stringify(data),
      isLoader: false,
    });
  },

  deletePipelineScore: function (id, associatedFlag) {
    let url = `${PIPELINE_SCORE}/${id}`;
    if (associatedFlag) {
      url += `?confirmation=true`;
    }
    return FetchApi({ path: url, type: "DELETE" });
  },
};
