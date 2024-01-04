import { userApi } from "../../apis/userApi";

export const UpdateTimezone = (id) => {
    let timezone;
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else {
        timezone = "UTC"
    }
    const formData = new FormData();
    formData.append("data[timezone]", timezone);
    userApi.update(formData, id, false)
}