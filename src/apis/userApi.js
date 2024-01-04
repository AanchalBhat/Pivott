import {
  GET_GOOGLE,
  GET_SKYPE,
  GET_USER,
  GET_WEBEX,
  GOOGLE_CODE_LOGIN,
  INVITE_USERS,
  SKYPE_CODE_LOGIN,
  WEBEX_CODE_LOGIN,
  ROLE,
  COMPANY_DOMAINS
} from '../constants/routes'
import { FetchApi } from './fetchApi'

// modified

let header

export const userApi = {
  getUsers: (val, page = 1, pageSize = 20) => {
    let url = GET_USER + `?page=${page}&per_page=${pageSize}`
    if (val) {
      url += `&search[user]=${val}`
    }
    return FetchApi({
      path: url,
      type: 'GET',
      isLoader: false,
    })
  },

  getManageUsers: (val, page, pageSize, check) => {
    let url
    if (val?.hasOwnProperty('active_users')) {
      header = `&search[active_users]=${val?.active_users}`
      url = `${GET_USER}/?search[active_users]=${val?.active_users}`
    } else if (val?.is_invited) {
      header = `&search[is_invited]=${val?.is_invited}`
      url = `${GET_USER}?search[is_invited]=${val?.is_invited}`
    } else if (val?.deleted_user) {
      header = `&search[is_deleted]=${val?.deleted_user}`
      url = `${GET_USER}?search[is_deleted]=${val?.deleted_user}`
    } else if (val?.all_users) {
      header = `&search[all_users]=${val?.all_users}`
      url = `${GET_USER}?search[all_users]=${val?.all_users}`
    } else if (val?.srch && check) {
      url = `${GET_USER}?search[user]=${val?.srch}${header}`
    }
    return FetchApi({
      path: `${url}&page=${page}&per_page=${pageSize}`,
      type: 'GET'
    })
  },

  getUser: id => {
    return FetchApi({ path: `${GET_USER}/${id}`, type: 'GET' })
  },

  update: (data, id) => {
    return FetchApi({
      path: `${GET_USER}/${id}`,
      type: 'PUT',
      data: data,
      contentType: false,
    })
  },

  getRole: () => {
    return FetchApi({ path: `${ROLE}`, type: 'GET', contentType: false })
  },

  //webex apis
  getWebexUrl: () => {
    let URL = `${GET_WEBEX}?redirect_url=${window.location.origin}/third-party`
    return FetchApi({ path: URL, type: 'GET' })
  },

  webexCodeLogin: function (code, state) {
    let URL = `${WEBEX_CODE_LOGIN}?code=${code}&state=${state}&redirect_url=${
      window.location.origin + '/third-party'
    }`
    return FetchApi({ path: URL, type: 'GET' })
  },

  //skype apis....
  getSkypeUrl: () => {
    let URL = `${GET_SKYPE}?redirect_url=${window.location.origin}/third-party`
    return FetchApi({ path: URL, type: 'GET' })
  },

  skypeCodeLogin: function (code, state) {
    let URL = `${SKYPE_CODE_LOGIN}?code=${code}&redirect_url=${
      window.location.origin + '/third-party'
    }`
    return FetchApi({ path: URL, type: 'GET' })
  },

  //google meet api's
  getGoogleUrl: () => {
    let URL = `${GET_GOOGLE}?redirect_url=${window.location.origin}/third-party&url_type=meeting`
    return FetchApi({ path: URL, type: 'GET' })
  },

  googleCodeLogin: code => {
    let URL = `${GOOGLE_CODE_LOGIN}?code=${code}&redirect_url=${
      window.location.origin + '/third-party'
    }`
    return FetchApi({ path: URL, type: 'GET' })
  },

  inviteUser: data => {
    return FetchApi({
      path: INVITE_USERS,
      type: 'POST',
      data: JSON.stringify({ data: data }),
    })
  },

  getCompanyDomain: () => {
    return FetchApi({
      path: `${COMPANY_DOMAINS}`,
      type: 'GET'
    })
  },

  getCompanyDomainById: id => {
    return FetchApi({
      path: `${COMPANY_DOMAINS}/${id}`,
      type: 'GET',
    })
  },

  createDomain: data => {
    return FetchApi({
      path: `${COMPANY_DOMAINS}`,
      type: 'POST',
      data: data
    })
  },
  UpdateDomain: (data, id) => {
    return FetchApi({
      path: `${COMPANY_DOMAINS}/${id}`,
      type: 'PUT',
      data: data
    })
  },

  delete: (id) => {        // single delete
    return FetchApi({
        path: `${COMPANY_DOMAINS}/${id}`,
        type: "DELETE"
    });
},
  
}
