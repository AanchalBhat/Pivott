import {
  CONTACT_LISTS,
  CREATE_LIST,
  CONTACT_CATEGORIES,
  RENAME_CATEGORIES,
  COPY_TO_LIST,
  DUPLICATE_LIST,
  EXPORT_CONTACTS
} from '../constants/routes'
import { FetchApi } from './fetchApi'

let url
let header

export const ContactListApi = {
  getContactLists: (page, pageSize, data, check) => {
    url = `${CONTACT_LISTS}?page=${page}&per_page=${pageSize}`
    if (data) {
      url += `&search[contact_detail]=${data}`
    }
    if (header && check) {
      url += header
    }
    return FetchApi({
      path: url,
      type: 'GET'
    })
  },
  create: function (data) {
    return FetchApi({
      path: CREATE_LIST,
      type: 'POST',
      data: JSON.stringify({ data: data })
    })
  },

  getContactCategories: () => {
    return FetchApi({
      path: CONTACT_CATEGORIES,
      type: 'GET'
    })
  },

  categoriesById: id => {
    return FetchApi({
      path: `${CONTACT_CATEGORIES}/${id}`,
      type: 'GET'
    })
  },

  renameContactCategory: data => {
    return FetchApi({
      path: RENAME_CATEGORIES,
      type: 'PUT',
      data: data
    })
  },

  copyToList: data => {
    return FetchApi({
      path: COPY_TO_LIST,
      type: 'PUT',
      data: data
    })
  },

  duplicateList: function (data) {
    return FetchApi({
      path: DUPLICATE_LIST,
      type: 'POST',
      data: data
    })
  },

  exportContacts: function (data) {
    return FetchApi({
      path: EXPORT_CONTACTS,
      type: 'POST',
      data: data
    })
  },

  createCategories: function (data) {
    return FetchApi({
      path: CONTACT_CATEGORIES,
      type: 'POST',
      data: data
    })
  },

  categoryDelete: function (id) {
    return FetchApi({
      path: `${CONTACT_CATEGORIES}/${id}`,
      type: "DELETE",
    });
  },

  getDropdownFilter: (id, page, pageSize) => {
    url = `${CONTACT_LISTS}?page=${page}&per_page=${pageSize}`
    if (id) {
      url += `&search[category_id]=${id}`
      header = `&search[category_id]=${id}`
    }
    // else {
    //   header = '';
    // }
    return FetchApi({
      path: url,
      type: 'GET'
    })
  }
}
