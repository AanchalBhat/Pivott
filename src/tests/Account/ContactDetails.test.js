import { Router } from "react-router-dom";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import ContactDetailForm from "../../components/Potential/ContactDetail";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
jest.mock("axios", () => {
  const axios = jest.fn().mockResolvedValue();
  return axios;
});
describe("Potential Contact details ", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <ContactDetailForm />
      </Router>
    );
  });
  test("Testing if Contact details exists or not", () => {
    expect(screen.getByText("Contact Details")).toBeInTheDocument();
  });

  test("Testing if required  fields exists or not ",() => {
    const firstName = screen.getByTestId("firstname-input");
    const lastName = screen.getByTestId("lastname-input");
    const email = screen.getByTestId("email-input");
    const contact = screen.getByTestId("phone-input");
    const company = screen.getByTestId("company-input");
    const designation = screen.getByTestId("designation-input");
    const savebtn = screen.getByTestId("sp-btn");
    const cancelbtn = screen.getByTestId("cp-btn");
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(contact).toBeInTheDocument();
    expect(company).toBeInTheDocument();
    expect(designation).toBeInTheDocument();
    expect(savebtn).toBeInTheDocument();
    expect(cancelbtn).toBeInTheDocument();
  });
  test("If user can input in the fields or not", async () => {
    const firstName = screen
      .getByTestId("firstname-input")
      .querySelector("input");
    const lastName = screen
      .getByTestId("lastname-input")
      .querySelector("input");
    const email = screen.getByTestId("email-input").querySelector("input");
    const contact = screen.getByTestId("phone-input");
    const company = screen.getByTestId("company-input").querySelector("input");
    const designation = screen
      .getByTestId("designation-input")
      .querySelector("input");

    await userEvent.type(firstName, "test");
     expect(firstName).toHaveValue("test");

    await userEvent.type(lastName, "test");
     expect(lastName).toHaveValue("test");

    await userEvent.type(email, "test@gmail.com"),
      expect(email).toHaveValue("test@gmail.com");

    await userEvent.type(contact, "98876-6551"),
      expect(contact).toHaveValue("+91 98876-6551");

    await userEvent.type(company, "test");
      expect(company).toHaveValue("test");

    await userEvent.type(designation, "test"),
      expect(designation).toHaveValue("test");
  });
  test("Testing Buttons", () => {
    expect(screen.getByTestId("sp-btn")).toBeInTheDocument();
    expect(screen.getByTestId("cp-btn")).toBeInTheDocument();
  });
});
