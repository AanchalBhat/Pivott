import {BrowserRouter as Router } from "react-router-dom";
import { screen, render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import Login from "../../pages/Login/Login";

// jest.mock("axios", () => {});
describe("Testing login Component", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router >
        <Login />,
        
     </Router>
    );
  });
  test("Login logo exist or  not  in page ", () => {
    expect(screen.getByTestId("login-logo")).toBeInTheDocument();
    expect(screen.getByTestId("login-thumb")).toBeInTheDocument()
  });
  test("login page text exist or not in page ", () => {
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Log in/i)).toBeInTheDocument();
    expect(screen.getByText(/Or access quickly/i)).toBeInTheDocument();
    expect(screen.getByText(/Didn't have account/i)).toBeInTheDocument();
  });
  test("span clickable text ", async () => {
    const forgotPass = screen.getByTestId("forgot-password");
    expect(forgotPass).toBeInTheDocument();
    await userEvent.click(forgotPass);
    const tryFree = screen.getByTestId("try-free");
    expect(tryFree).toBeInTheDocument();
    await userEvent.click(tryFree);
    const loginBtn = screen.getByTestId("login-btn");
    expect(loginBtn).toBeInTheDocument();
    await userEvent.click(loginBtn);
  });
  test("testing user inputs on login", async () => {
    const email = screen.getByTestId("email-input").querySelector("input");
    expect(email).toBeInTheDocument();
    await userEvent.type(email, "nirvan@yopmail.com");
    expect(email.value).toBe("nirvan@yopmail.com");

    const password = screen.getByTestId("password-input").querySelector("input");
    expect(password).toBeInTheDocument();
    await userEvent.type(password,"Badmintonworld1@")
    expect(password.value).toBe("Badmintonworld1@")
  });
});