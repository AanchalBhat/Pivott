import * as Yup from "yup";
import { NAMES_REGEX, EMAIL_REGEX, ZIPCODE_REGEX, STREET_REGEX } from "../utils/regexLists";

export const LeadSchema = Yup.object().shape({
    owner_id: Yup.number().required("Please select lead owner"),
    first_name: Yup.string()
        .matches(NAMES_REGEX, "Only alphabetic characters allowed")
        .required("First name can't be empty"),
    last_name: Yup.string()
        .matches(NAMES_REGEX, "Only alphabetic characters allowed")
        .required("Last name can't be empty"),
    email: Yup.string()
        .matches(EMAIL_REGEX, "Please enter a valid email Id")
        .required("Email can't be empty"),
    company_name: Yup.string()
        .min(3, 'Company name should be min 3 characters')
        .max(75, 'Company name should be max 75 characters')
        .required("Company name can't be empty")
    ,
    lead_source_id: Yup.number().required("Please select lead source"),
    status_id: Yup.number().required("Please select lead status"),
    zip_code: Yup.string()
        .matches(ZIPCODE_REGEX, "Please enter valid zip code")
        .min(3, 'Zipcode should be min 3 characters'),
});
