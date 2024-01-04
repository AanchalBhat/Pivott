import * as Yup from "yup";
import { FIRSTNAME_REGEX } from "../../../utils/regexLists";

export const PotentialSchema = Yup.object().shape({
  contact_detail_id: Yup.number().required("Please select contact detail"),
  owner_id: Yup.number().required("Please select potential owner"),
  potential_stage_id: Yup.number().required("Please select stage"),
  stage_type_id: Yup.number().required("Please select type"),
  account_name: Yup.string()
    .matches(FIRSTNAME_REGEX, "Only alphabetic characters allowed")
    .required("Account name can't be empty"),
  potential_name: Yup.string()
    .matches(FIRSTNAME_REGEX, "Only alphabetic characters allowed")
    .required("Potential name can't be empty"),
  lead_source_id: Yup.number().required("Please select lead source"),
  amount: Yup.number().nullable().typeError('Amount must be a number')
});
