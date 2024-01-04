import { CALLS, GET_CALL_TYPE} from "../constants/routes";
import { FetchApi } from "./fetchApi";

export const callApi = {
  scheduleCall: (body) => {
    return FetchApi({
      path: CALLS, 
      type: "POST", 
      data: JSON.stringify({ data: body }), 
    });
  },

  editCall: (id, callable_id, callable_type, body) => {
    return FetchApi({
      path: CALLS + `/${id}?callable_id=${callable_id}&callable_type=${callable_type}`, 
      type: "PUT", 
      data: JSON.stringify({ data: body }), 
    });
  },

  //   {marketing_management_host}}/call_informations/1?callable_id=1&callable_type=Lead
  deleteCall: (id, callable_id, callable_type) => {
    return FetchApi({
      path: CALLS + `/${id}?callable_id=${callable_id}&callable_type=${callable_type}`, 
      type: "DELETE",
    });
  },

  getCallTypes: () => {
    return FetchApi({
      path: GET_CALL_TYPE, 
      type: "GET"
    });
  },

  getCalls: (id, type,page,pageSize) => {
    return FetchApi({
      path: CALLS + `?search[callable_id]=${id}&search[callable_type]=${type}&page=${page}&per_page=${pageSize}`, 
      type: "GET",
    });
  },
};
