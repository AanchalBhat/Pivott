import {
  CAMPAIGN_TEMPLATES,
  DUPLICATE_TEMPLATE,
  EMAIL_TAGS,
  IMAGE_TEMPLATE,
  MASTER_TEMPLATES,
} from "../constants/routes";
import { FetchApi } from "./fetchApi";

// static api url

export const templateApi = {
  create: function (data) {
    return FetchApi({
      path: CAMPAIGN_TEMPLATES,
      type: "POST",
      data: data,
      contentType: false,
    });
  },
  update: function (id, data) {
    return FetchApi({
      path: `${CAMPAIGN_TEMPLATES}/${id}`,
      type: "PUT",
      data: data,
      contentType: false,
    });
  },
  getById: function (id) {
    return FetchApi({ path: `${CAMPAIGN_TEMPLATES}/${id}`, type: "GET" });
  },
  getTemplates: (page, pageSize) => {
    return FetchApi({
      path: `${CAMPAIGN_TEMPLATES}?page=${page}&per_page=${pageSize}`,
      type: "GET",
    });
  },
  getMasterTemplates: (page, pageSize) => {
    return FetchApi({
      path: `${MASTER_TEMPLATES}?page=${page}&per_page=${pageSize}`,
      type: "GET"
    });
  },
  deleteTemplate: (id) => {
    return FetchApi({
      path: `${CAMPAIGN_TEMPLATES}/${id}`,
      type: "DELETE",
    });
  },
  duplicateTemplate: (data) => {
    return FetchApi({
      path: `${CAMPAIGN_TEMPLATES}${DUPLICATE_TEMPLATE}`,
      type: "POST",
      data: JSON.stringify({ data: data }),
    });
  },
  templateSearch: (page, pageSize, data) => {
    let url = "";
    if (data) {
      url = `${CAMPAIGN_TEMPLATES}?search[name]=${data}&page=${page}&per_page=${pageSize}`;
    } else {
      url = `${CAMPAIGN_TEMPLATES}?page=${page}&per_page=${pageSize}`;
    }
    return FetchApi({
      path: url,
      type: "GET",
    });
  },
  uploadImage: function (data) {
    return FetchApi({
      path: IMAGE_TEMPLATE,
      type: "POST",
      data: data,
      contentType: false,
    });
  },
  getTags: function () {
    return FetchApi({
      path: EMAIL_TAGS,
      type: "GET"
    })
  }
};
