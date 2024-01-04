import { TASKS } from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api url 

export const TaskAPI = {
  create: function (data) {
    return FetchApi({ path: TASKS, type: "POST", data: JSON.stringify(data) });
  },

  getAll: function () {
    return FetchApi({ path: TASKS, type: "GET" });
  },

  update: function (id, type, taskable_id, data) {
    let URL = `${TASKS}/${id}?taskable_type=${type}&taskable_id=${taskable_id}`;
    return FetchApi({ path: URL, type: "PUT", data: JSON.stringify(data) });
  },

  delete: function (id, task_id, type) {
    let URL = `${TASKS}/${id}?taskable_type=${type}&taskable_id=${task_id}`;
    return FetchApi({ path: URL, type: "DELETE" });
  },

  getAllId: function (id, type, status = "open", page, pageSize) {
    let URL = `${TASKS}/?search[taskable_id]=${id}&search[taskable_type]=${type}&search[status]=${status}&page=${page}&per_page=${pageSize}`;
    return FetchApi({ path: URL, type: "GET", isLoader: false });
  },
}

