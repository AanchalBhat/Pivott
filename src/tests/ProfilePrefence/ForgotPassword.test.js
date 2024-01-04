import { Router } from "react-router-dom";
import {
  render,
  screen,
  cleanup,
  } from "@testing-library/react";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ForgotPassword from "../../pages/AccountActivation/ForgotPassword";

jest.mock("axios", () => {});

describe("Profile Change Password ", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <ForgotPassword />
      </Router>
    );
  });
  test("Testing all the text on screen",() =>{
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument()
    expect(screen.getByText(/Enter your email ID to get reset link to your email address/i)).toBeInTheDocument()
    expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
  })
  test("Testing the email field",async () =>{
    const mailField=screen.getByTestId("mail").querySelector("input")
    expect(mailField).toBeInTheDocument()
    await userEvent.type(mailField,"crpp@gmail.com")
    expect(mail).toHaveValue("crpp@gmail.com")
  })
  test("Test send reset link button",async () =>{
    const btn=screen.getByTestId("send_reset_link")
    expect(btn).toBeInTheDocument()
    await userEvent.click(btn)
  })
});
