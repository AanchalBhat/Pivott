import { Router } from "react-router-dom";
import {
    render,
    screen,
    cleanup,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ChangePassword from "../../pages/AccountActivation/ChangePassword";

jest.mock("axios", () => {});

describe("Profile Change Password ", () => {
    const history = createMemoryHistory();
    afterEach(cleanup);
    beforeEach(() => {
        render(
            <Router location={history.location} navigator={history}>
                <ChangePassword />
            </Router>
        );
    });
    test("Testing text fields",() =>{
        expect(screen.getByText(/Create New Password/i)).toBeInTheDocument()
    })
    test("Testing old password field",async () =>{
        const old=screen.getByTestId("old_password").querySelector("input")
        expect(old).toBeInTheDocument()
        await userEvent.type(old,"8uhnsnjj91")
        expect(old).toHaveValue("8uhnsnjj91")
    })
    test("Testing new password field",async () =>{
    const newPassword=screen.getByTestId("new_password").querySelector("input")
    expect(newPassword).toBeInTheDocument()
    await userEvent.type(newPassword,"8uhhhdaq")
    expect(newPassword).toHaveValue("8uhhhdaq")
    })
    test("Testing confirm password field",async () =>{
        const confirmPassword=screen.getByTestId("confirm_password").querySelector("input")
        expect(confirmPassword).toBeInTheDocument()
        await userEvent.type(confirmPassword,"987yhhnan")
        expect(confirmPassword).toHaveValue("987yhhnan")
    })
    test("Testing Button",() =>{
        const btn=screen.getByTestId("set_password")
        expect(btn).toBeInTheDocument()
    })
});
