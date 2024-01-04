import { ACTIVE_USERS, SESSIONS_LOGOUT, MANAGE_DATA_ROLES } from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const personalApi = {
  logOutSessions: function () {
    return FetchApi({ path: SESSIONS_LOGOUT, type: "DELETE" });
  },
};

export const DeleteUsers = (id) => {
  const data = {
    "data": {
      "user_ids": id
    }
  }
  return FetchApi({ path: `${ACTIVE_USERS}/delete_users`, type: "DELETE", data: JSON.stringify(data) });
}

export const profileManageData = (data) => {
  const id = localStorage.getItem("manage_id")
  return FetchApi({ path: `${MANAGE_DATA_ROLES}/${id}`, type: "PATCH", data: JSON.stringify(data) });
}