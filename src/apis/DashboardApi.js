import {
  DASHBOARD,
  MEETING_DATA,
  DASHBOARD_DEAL,
  DASHBOARD_TASK,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const DashboardApi = {
  getAll: function () {
    return FetchApi({
      path: DASHBOARD,
      type: "GET",
    });
  },

  getAllTable: function (module, page, pageSize) {
    return FetchApi({
      path: `${module}/?page=${page}&per_page=${pageSize}`,
      type: "GET",
    });
  },

  meetingData: function (filter) {
    return FetchApi({
      path: `${MEETING_DATA}?filter_by=${filter}`,
      type: "GET",
      isLoader: false,
    });
  },

  getDealsGraph: function (data) {
    return FetchApi({
      path: `${DASHBOARD_DEAL}?filter_by=${data}`,
      type: "GET",
      isLoader: false,
    });
  },

  getTasksGraph: function (data) {
    return FetchApi({
      path: `${DASHBOARD_TASK}?filter_by=${data}`,
      type: "GET",
      isLoader: false,
    });
  },
};
