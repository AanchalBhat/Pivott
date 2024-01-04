import { Router } from "react-router-dom";
import { screen, render, cleanup} from "@testing-library/react";
import AccountActivation from "../../pages/VerifyEmail/VerifyEmail";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";

jest.mock("axios", () => {});
describe("Testing VerifyEmail Component", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <AccountActivation />
      </Router>
    );
  });

  test("Testing Logo Image", () => {
    expect(screen.getByTestId("logo-img-1")).toBeInTheDocument();
    expect(screen.getByTestId("logo-img-2")).toBeInTheDocument();
  });
  test("Testing Text ", () => {
    expect(screen.getByText(/Verify your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Resend OTP/i)).toBeInTheDocument();
  });
  test("Testing input fields", async () => {
    const otp = screen.getByTestId("otp");

    await userEvent.type(otp, "32222");
    expect(otp.value).toBe("32222");
  });
  test("Testing Verify Email Button", async () => {
    const btn = screen.getByTestId("verify-btn");
    await userEvent.click(btn);
  });
});
