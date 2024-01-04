export const FIRSTNAME_REGEX = /^[a-z ,.'-]+$/i;
export const LASTNAME_REGEX = /^[a-z ,.'-]+$/i;
export const ZIPCODE_REGEX = /^[0-9,.'-]+$/i;
export const EMAIL_REGEX = /\S+@\S+\.\S+/;
export const STREET_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const WEBSITE_REGEX =
  /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)/;
export const SPACE_REGEX = /\s{2,}/g;
export const NAMES_REGEX = /^[a-z ,.'-]+$/i;
export const NUM_REGEX = /^[0-9\b]+$/;
export const STRONGPASSWORD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*])(?=.{4,})"
);
export const CITY_REGEX = /^[a-z ,.'-]+$/i;
export const PROTOCOL_REGEX = /(^\w+:|^)\/\//;
export const STRING_REGEX = /\b(\w)/g;
