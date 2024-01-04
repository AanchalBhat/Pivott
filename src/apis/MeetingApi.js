import { LANGUAGES, MEETINGS, MEETING_THIRDPARTY } from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const MeetingApi = {
  create: function (data) {
    return FetchApi({
      path: MEETINGS,
      type: "POST",
      data: JSON.stringify(data),
    });
  },

  getAll: function () {
    return FetchApi({ path: MEETINGS, type: "GET" });
  },

  update: function (id, meetingable_id, type, data) {
    let URL = `${MEETINGS}/${id}?meetingable_id=${meetingable_id}&meetingable_type=${type}`;
    return FetchApi({
      path: URL,
      type: "PUT",
      data: JSON.stringify(data),
    });
  },

  delete: function (id, meeting_id, type) {
    let URL = `${MEETINGS}/${id}?meetingable_id=${meeting_id}&meetingable_type=${type}`;
    return FetchApi({ path: URL, type: "DELETE" });
  },

  getAllId: function (id, type, page, pageSize) {
    let URL = `${MEETINGS}/?search[meetingable_type]=${type}&search[meetingable_id]=${id}&page=${page}&per_page=${pageSize}`;
    return FetchApi({ path: URL, type: "GET" });
  },

  getLanguages: () => {
    return FetchApi({ path: LANGUAGES, type: "GET" });
  },

  thirdPartyStatus: function (id) {
    return FetchApi({
      path: `${MEETING_THIRDPARTY}?user_id=${id}`,
      type: "GET",
    });
  },
};
