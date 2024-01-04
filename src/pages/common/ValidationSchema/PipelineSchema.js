import * as Yup from "yup";
import { NAMES_REGEX } from "../../../utils/regexLists";

export const PipelineSchema = Yup.object().shape({
  owner_id: Yup.number().required("Please select pipeline owner"),
  pipeline_stage_id: Yup.string().required("Please select pipeline stage"),
  stage_type_id: Yup.number().required("Please select type"),
  account_name: Yup.string()
    .matches(NAMES_REGEX, "Only alphabetic characters allowed")
    .required("Account name can't be empty"),
  lead_source_id: Yup.number().required("Please select lead source"),
  contact_detail_id: Yup.number().required("Please select contact detail"),
});
