import SocialLogin from "../../pages/Login/SocialLogin";
import { Router } from "react-router-dom";
import { screen, render, cleanup} from "@testing-library/react";
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
        <SocialLogin/>
      </Router>
    );
  });


  test("Testing Text ", () => {
    expect(screen.getByText(/with Microsoft/i)).toBeInTheDocument();

  });

  test("Testing Google Button", async () => {
    const btn = screen.getByTestId("google-btn");
    await userEvent.click(btn);
  });
  test("Testing Microsoft Button", async () => {
    const btn = screen.getByTestId("microsoft-btn");
    await userEvent.click(btn);
  });
});
