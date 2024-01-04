import { Router } from "react-router-dom";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory } from "history";

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import EditDetails from "../../components/AccountDetails/EditDetails";
jest.mock("axios", () => {
  const axios = jest.fn().mockResolvedValue();
  return axios;
});
describe("EditDetails Page", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <EditDetails />
      </Router>
    );
  });
  test("heading for account details edit page", () => {
    expect(screen.getByText(/Account Details/i)).toBeInTheDocument();
  });
  test("checking change picture feature", async () => {
    const testImageFile = new File(["hello"], "hello.png", {
      type: "image/png",
    });

    const button = screen.getByTestId("change-pic");
    expect(button).toBeInTheDocument();

    const fileinput = screen.getByTestId("picture");
    await userEvent.upload(fileinput, testImageFile);
    expect(screen.getByTestId("img")).toBeInTheDocument()
  });

  test("first name and input field exist in document or not", async() => {
    const firstname = screen.getByTestId("firstnameinput").querySelector("input")
    expect(firstname).toBeInTheDocument()
    await userEvent.type(firstname,"Nirvan")
    expect(firstname).toHaveValue("Nirvan")

  });
  test("last name and input field exist in document or not",async () => {
    const lastname = screen.getByTestId("lastnameinput").querySelector("input")
    expect(lastname).toBeInTheDocument()
    await userEvent.type(lastname,"Bobde")
    expect(lastname).toHaveValue("Bobde")

  });
 
  test("phone field exist in document or not", async() => {
    const Phone = screen.getByTestId("phoneinput");
    expect(Phone).toBeInTheDocument();
    await userEvent.type(Phone, "77778-89894")
    expect(Phone).toHaveValue("+91 77778-89894");

  });
  test("gender field test",async  () => {
    const gender = screen.getByTestId("genderinput").querySelector("input");
    expect(gender).toBeInTheDocument();


  });

  // commenting temporarily needs to be re-written ( react-select )
  // test("country field test", () => {
  //   const country = screen.getByRole('combobox', { name: /country/i})
  //   expect(country).toBeInTheDocument();
  // });
  
  test("language field test", () => {
    const language = screen.getByTestId("languageinput");
    expect(language).toBeInTheDocument();

  });
  test("timezone field test", () => {
    const timezone = screen.getByTestId("timezoneinput");
    expect(timezone).toBeInTheDocument();
  ;
  });
  test("Testing Save and Cancel buttons", async () => {
    expect(screen.getByTestId("save")).toBeInTheDocument();
    expect(screen.getByTestId("cancel")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("save"))
    await userEvent.click(screen.getByTestId("cancel"))
  });
});
