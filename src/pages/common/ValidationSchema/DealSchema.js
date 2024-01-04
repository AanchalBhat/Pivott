import * as Yup from "yup";
import { FIRSTNAME_REGEX } from "../../../utils/regexLists";

export const DealSchema = Yup.object().shape({
    contact_detail_id: Yup.number().required("Please select contact detail"),
    owner_id: Yup.number().required("Please select deal owner"),
    payment_mode_id: Yup.string().required("Please select payment mode"),
    tenure: Yup.string().required("Deal tenure can't be empty"),
    deal_name: Yup.string()
        .matches(FIRSTNAME_REGEX, "Only alphabetic characters allowed")
        .required("Deal name can't be empty"),
    lead_source_id: Yup.number().required("Please select lead source")
});
