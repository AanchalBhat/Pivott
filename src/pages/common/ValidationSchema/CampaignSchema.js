import * as Yup from "yup";
import { EMAIL_REGEX } from "../../../utils/regexLists";

export const CampaignSchema = Yup.object().shape({
  campaign_name: Yup.string().required("Campaign can't be empty"),
  // recipients: Yup.string().required("Please select recipients"),
  reply_to_address: Yup.string()
    .matches(EMAIL_REGEX, "Please enter a valid email Id")
    .required("Reply address can't be empty"),
  subject: Yup.string().required("Subject can't be empty"),
});
