import {
  GET_REPORT,
  GET_REPORT_FOLDER,
  MOVE_FOLDER,
  SCHEDULE_REPORT,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

let header;
let headerFolder;
let folder = false; // as an indicator to use headerFolder url instead of header

export const ReportsApi = {
  getAll: function (page, pageSize) {
    let url = GET_REPORT + `/?page=${page}&per_page=${pageSize}`;
    return FetchApi({ path: url, type: "GET" });
  },

  getReportsFilter: function (data, compny_id, id, page, pageSize) {
    let url;
    let flag = false;
    if (compny_id) {
      folder = true;
      headerFolder = `${GET_REPORT}?report_folder_id=${id}`;
      url = `${GET_REPORT_FOLDER}/${id}?page=${page}&per_page=${pageSize}`;
      flag = true;
    } else {
      folder = false;
      if (data?.favorite) {
        header = `/get_reports?favorite=${data?.favorite}`;
        url = `${GET_REPORT}/get_reports?favorite=${data?.favorite}&page=${page}&per_page=${pageSize}`;
      } else if (data?.recent) {
        header = `/get_reports?recent=${data?.recent}`;
        url = `${GET_REPORT}/get_reports?recent=${data?.recent}&page=${page}&per_page=${pageSize}`;
      } else if (data?.scheduled) {
        header = `/get_reports?scheduled=${data?.scheduled}`;
        url = `${GET_REPORT}/get_reports?scheduled=${data?.scheduled}&page=${page}&per_page=${pageSize}`;
      } else if (data.all_report) {
        url = `${GET_REPORT}?page=${page}&per_page=${pageSize}`;
      } else if (data.shared) {
        folder = true;
        headerFolder = `${GET_REPORT}?report_folder_id=${id}`;
        url = `${GET_REPORT_FOLDER}/shared_folders?page=${page}&per_page=${pageSize}`;
        flag = true;
      }
    }
    if (flag) {
      return FetchApi({ path: url, type: "GET", isLoader: false });
    }
    return FetchApi({ path: url, type: "GET" });
  },

  getReportSearch: function (data, page, pageSize, check) {
    let searchUrl;
    if (data) {
      if (folder) {
        searchUrl =
          headerFolder + `&report=${data}&page=${page}&per_page=${pageSize}`;
      } else if (header && check) {
        searchUrl =
          `${GET_REPORT}` +
          header +
          `&report=${data}&page=${page}&per_page=${pageSize}`;
      } else {
        searchUrl = `${GET_REPORT}?report=${data}&page=${page}&per_page=${pageSize}`;
      }
    } else {
      searchUrl = `${GET_REPORT}?page=${page}&per_page=${pageSize}`;
    }
    return FetchApi({ path: searchUrl, type: "GET" });
  },

  getOverviewTableSearch: function (id, module, val, page, pageSize) {
    let url = `${GET_REPORT}/${id}?${module}=${val}&page=${page}&per_page=${pageSize}`;
    return FetchApi({ path: url, type: "GET" });
  },

  getOverviewData: function (id, page, pageSize) {
    let url = GET_REPORT + `/${id}?page=${page}&per_page=${pageSize}`;
    return FetchApi({ path: url, type: "GET" });
  },

  create: function (data) {
    return FetchApi({
      path: GET_REPORT,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  update: function (data, id) {
    return FetchApi({
      path: `${GET_REPORT}/${id}`,
      type: "PUT",
      data: JSON.stringify({ data }),
    });
  },

  getFolder: function (company_id, val, page = 1, pageSize = 20) {
    let url = `${GET_REPORT_FOLDER}?company_id=${company_id}&page=${page}&per_page=${pageSize}`;
    if (val) {
      url += `&name=${val}`;
    }
    return FetchApi({ path: url, type: "GET", isLoader: false });
  },

  updateNFavorite: function (id, data) {
    let url = `${GET_REPORT}/${id}`;
    return FetchApi({ path: url, type: "PUT", data: JSON.stringify(data) });
  },

  scheduleReport: function (id, data) {
    return FetchApi({
      path: `${SCHEDULE_REPORT}?per_page=1000`,
      type: "POST",
      data: JSON.stringify(data),
    });
  },

  createFolder: function (data) {
    return FetchApi({
      path: GET_REPORT_FOLDER,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  cloneReport: function (data) {
    let url = `${GET_REPORT}/clone_report`;
    return FetchApi({
      path: url,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  exportsReport: function (data) {
    let url = `${GET_REPORT}/export_reports?per_page=1000`;
    return FetchApi({
      path: url,
      type: "POST",
      data: JSON.stringify({ data: data }),
      isdownload: true,
    });
  },
  moveToFolder: function (data) {
    return FetchApi({
      path: MOVE_FOLDER,
      type: "PUT",
      data: JSON.stringify({ data: data }),
    });
  },

  massDelete: function (data) {
    let url = `${GET_REPORT}/report_mass_delete`;
    return FetchApi({
      path: url,
      type: "DELETE",
      data: JSON.stringify({ data: data }),
    });
  },
  isReportExists: function (data) {
    let url = `${GET_REPORT}/is_report_exists`;
    return FetchApi({
      path: url,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },

  getReportData: function (id) {
    return FetchApi({
      path: `${GET_REPORT}/${id}`,
      type: "GET",
    });
  },
};
