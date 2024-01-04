import { TIMEZONE } from "../constants/routes";
  import { FetchApi } from "./fetchApi";
  
  export const TimeZoneApi = {  
    getTimezones: function () {
        return FetchApi({ path: TIMEZONE, type: "GET", isLoader: false });
    },
  };