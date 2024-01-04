import { ResetAPI } from "../../../apis/UpdatePassword";
import "../../../apis/UpdatePassword"
import { FetchApi } from "../../../apis/fetchApi";
import { CHANGE_PASSWORD, RESET_PASSWORD } from "../../../constants/routes";

jest.mock("axios", () => {
});

jest.mock('../../../apis/fetchApi');

let mockResetPassData = {
    reset_password_token: "$23424njefhjefhej",
    password: "newPassword@123",
    password_confirmation: "newPassword@123",
}

let mockUpdatePassData = {
    current_password: "123456",
    password: "Test@1",
    password_confirmation: "Test@1"
}

let newResult = { message: "Password changed successfully.", success: true }

let updateResult = { message: "Password updated successfully.", success: true }

describe("UpdatePassword.js", () => {
    test("Password changed successfully.", async () => {
        FetchApi.mockResolvedValueOnce(newResult);
        const result = await ResetAPI.create(mockResetPassData);
        expect(FetchApi).toHaveBeenCalledWith(RESET_PASSWORD, "PUT", JSON.stringify(mockResetPassData));
    });

    test("password updated successfully.", async () => {
        let id = 1;
        FetchApi.mockResolvedValueOnce(updateResult);
        const result = await ResetAPI.updatePassword(mockUpdatePassData, id);
        expect(result.message).toBe("Password updated successfully.");
        expect(FetchApi).toHaveBeenCalledWith(`/users/${id}${CHANGE_PASSWORD}`, "PUT", mockUpdatePassData);
    });
})