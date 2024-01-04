import { FetchApi } from "./fetchApi";

export const GlobalSearchApis = {
  Search: (data) => { // modified
    return FetchApi({
      path: `/search?query=${data}`, 
      type: "GET",
    });
  },
};
