import { Router } from "react-router-dom";
import {
    render,
    screen,
    cleanup,
    waitFor,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import UpdatePassword from "../../pages/AccountActivation/UpdatePassword";

jest.mock("axios",() =>{});

describe("Profile Change Password ", () => {
    const history = createMemoryHistory();
    afterEach(cleanup);
    beforeEach(() => {
        render(
            <Router location={history.location} navigator={history}>
                <UpdatePassword />
            </Router>
        );
    });
    test("Testing all the text on screen",() =>{
        expect(screen.getByTestId("update")).toBeInTheDocument()
    })
    test("Testing new Password field",async () =>{
        const newpassword=screen.getByTestId("new_password").querySelector("input")
        expect(newpassword).toBeInTheDocument()
        await userEvent.type(newpassword,"ii887651gs")
        expect(newpassword).toHaveValue("ii887651gs")
    })
    test("Testing confirm password field",async () =>{
        const confirmPassword=screen.getByTestId("confirm_password").querySelector("input")
        expect(confirmPassword).toBeInTheDocument()
        await userEvent.type(confirmPassword,"iuj6777")
        expect(confirmPassword).toHaveValue("iuj6777")
    })
    test("Testing Update password button",async () =>{
        const update_password=screen.getByTestId("update_password")
        expect(update_password).toBeInTheDocument()
        await userEvent.click(update_password)
    })
});
