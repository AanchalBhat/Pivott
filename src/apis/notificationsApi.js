import { GET_NOTIFICATION, READ_NOTIFICATION, UNREAD_COUNT } from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const NotificationsApi = {
  getData: function (page, pageSize) {
    return FetchApi({
      path: `${GET_NOTIFICATION}?page=${page}&per_page=${pageSize}`,
      type: "GET",
      isLoader: false
    });
  },

  markAsRead: function (id) {
    return FetchApi({
      path: READ_NOTIFICATION,
      type: "PUT",
      data: JSON.stringify({ id }),
      isLoader: false
    });
  },

  markAll: function () {
    return FetchApi({
      path: READ_NOTIFICATION, 
      type: "PUT",
      isLoader: false
    });
  },

  getAllFilter: function (data) {
    if (data) {
      return FetchApi({
        path: `${GET_NOTIFICATION}?filter_by=${data}`,
        type: "GET",
        isLoader: false
      });
    } else {
      return FetchApi({
        path: `${GET_NOTIFICATION}`,
        type: "GET",
        isLoader: false
      });
    }
  },
  getCount: function () {
    return FetchApi({
      path: `${GET_NOTIFICATION}${UNREAD_COUNT}`,
      type: "GET",
      isLoader: false
    });
  },
};
