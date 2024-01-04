import {
  INTERNAL_ERROR,
  INVALID_DATA,
  NETWORK_ERROR,
  NO_DATA_FOUND,
  UPLOAD_ERROR,
} from "../utils/constants";

function removeStorage(err) {
  localStorage.clear();
}

function returnErrors(error) {
  if (error?.code === "ERR_NETWORK") return NETWORK_ERROR;
  if (error?.response?.request?.status === 500) return INTERNAL_ERROR;
  if (error?.error?.length > 0 && typeof error?.error !== "string")
    return UPLOAD_ERROR;
  if (error?.response?.request?.status === 401) {
    if (error?.response?.data?.success === false)
      return error?.response?.data?.error;
    return removeStorage(error);
  }
  if (error?.response?.data?.code) {
    return null;
  }
  return error?.response?.data?.error;
}
export const getMethodError = (error) => {
  if (error?.response?.request?.status === 404) return NO_DATA_FOUND;
  return returnErrors(error);
};

export const deleteMethodError = (error) => {
  if (error?.response?.request?.status === 422 && !error?.response?.data?.code)
  return returnErrors(error);
};

export const restMethodError = (error) => {
  return returnErrors(error);
};
