import { Router } from "react-router-dom";
import { screen, render, cleanup } from "@testing-library/react";
import Signup from "../../pages/Signup/Signup";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";

jest.setTimeout(30000);

describe("Testing Signup Component", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <Signup />
      </Router>
    );
  });

  test("Testing userinput fields", async () => {
    const fname = screen.getByTestId("firstName").querySelector("input");
    expect(fname).toBeInTheDocument();
    await userEvent.type(fname, "Hello,World!");
    expect(fname.value).toBe("Hello,World!");
    const lname = screen.getByTestId("lastname").querySelector("input");
    await userEvent.type(lname, "hello");
    expect(lname.value).toBe("hello");
    const email = screen.getByTestId("email-input").querySelector("input");
    expect(email).toBeInTheDocument();
    await userEvent.type(email, "ram123@gmail.com");
    expect(email.value).toBe("ram123@gmail.com");

    const phone = screen.getByTestId("phone");

    await userEvent.type(phone, "98764-3455");
    expect(phone.value).toBe("+91 98764-3455");
    const company = screen.getByTestId("company").querySelector("input");
    await userEvent.type(company, "google");
    expect(company.value).toBe("google");

    const password = screen.getByTestId("password").querySelector("input");
    await userEvent.type(password, "8aaa4ddsa55");
    expect(password.value).toBe("8aaa4ddsa55");
  });

  test("Checking Text Of Agree Statement", () => {
    expect(screen.getByText(/Jump start/i)).toBeInTheDocument();
    expect(
      screen.getByText(/By clicking Sign me up you agree to/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Have an account?/i)).toBeInTheDocument();

    expect(screen.getByTestId("login")).toBeInTheDocument();
  });
  test("Testing signup and login  button", async () => {
    const signupBtn = screen.getByTestId("signup-btn");
    await userEvent.click(signupBtn);
  });
});
