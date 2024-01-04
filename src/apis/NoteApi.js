import { NOTES } from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api url

export const NoteAPI = {
  create: function ({ formData }) {
    return FetchApi({
      path: NOTES,
      type: "POST",
      data: formData,
      contentType: false,
    });
  },

  getAll: function () {
    return FetchApi({ path: NOTES, type: "GET" });
  },

  getAllId: function (id, type, page, pageSize) {
    const URL = `${NOTES}/?search[noteable_id]=${id}&search[noteable_type]=${type}&page=${page}&per_page=${pageSize}`;
    return FetchApi({
      path: URL,
      type: "GET",
      isLoader: false,
    });
  },

  update: function (id, type, noteable_id, { formData }) {
    let URL = `${NOTES}/${id}?noteable_type=${type}&noteable_id=${noteable_id}`;
    return FetchApi({
      path: URL,
      type: "PUT",
      data: formData,
      contentType: false,
    });
  },

  delete: function (data) {
    let URL = `${NOTES}/${data.data.id}?noteable_type=${data.data.noteable_type}&noteable_id=${data.data.noteable_id}`;
    return FetchApi({
      path: URL,
      type: "DELETE",
      data: JSON.stringify(data),
    });
  },
};
