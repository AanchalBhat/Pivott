import { GET_USER, DEACTIVATE_USER, GET_PERMISSION, ACTIVATE_USER, GET_PARENT_NODE, GET_CHILD_NODE, GET_LINK_INVITATION } from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const RolesApi = {
  toggleDeactivateUser: (body, value) => {
    let url = `${GET_USER}${DEACTIVATE_USER}`;
    if(value === "activate_user") {
      url = `${GET_USER}${ACTIVATE_USER}`;
    }
    return FetchApi({ path: `${url}`, type: "PUT", data: body });
  },

  getPermission: (id) => {
    return FetchApi({ path: `${GET_PERMISSION}/${id}`, type: "GET" });
  },

  updatePermission: (id,data) => {
    return FetchApi({ path: `${GET_PERMISSION}/${id}`, type: "PUT", data: JSON.stringify(data) });
  },

  getParents: (page, pageSize) => {
    return FetchApi({ path: GET_PARENT_NODE + `?page=${page}&per_page=${pageSize}`, type: "GET" });
  },
  getChilds: (id) => {
    return FetchApi({ path: GET_CHILD_NODE + `?user_id=${id}`, type: "GET" });
  },

  getLink: () => {
    return FetchApi({ path: GET_LINK_INVITATION, type: "GET" });
  },
};
