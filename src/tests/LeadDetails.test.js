import { Router } from "react-router-dom";
import {
  render,
  screen,
  cleanup,
  } from "@testing-library/react";
import { createMemoryHistory } from "history";
import LeadDetailsEdit from "../pages/common/leadDetails";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// jest.mock("axios", () => {});
const history = createMemoryHistory();
afterEach(cleanup);
beforeEach(() => {
  render(
    <Router location={history.location} navigator={history}>
      <LeadDetailsEdit />
    </Router>
  );
});

describe("Contact details ", () => {

  test("Checking change picture function", async () => {
    const testImageFile = new File(["hello"], "hello.png", {
      type: "image/png",
    });

    const btn = screen.getByTestId("change-pic");
    expect(btn).toBeInTheDocument();
    const fileinput = screen.getByTestId("pic");
    await userEvent.upload(fileinput, testImageFile);
    expect(screen.getByTestId("img")).toBeInTheDocument()
  });
  test("If lead details heading exists or not", () => {
    expect(screen.getByText("Lead Details")).toBeInTheDocument();
  });
  test("if details heading exists or not", () => {
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
  test("if change picture appears or not", () => {
    expect(screen.getByText("Change Picture")).toBeInTheDocument();
  });



  test("testing validity of website field", async () => {
    const website = screen.getByTestId("website-1").querySelector("input");
    await userEvent.type(website, "www.google.com");
    expect(website).toHaveValue("www.google.com");
  });
  test("testing validity of designation field", async () => {
    const designation = screen.getByTestId("desig").querySelector("input");
    expect(designation).toBeInTheDocument();
    await userEvent.type(designation, "CEO");
    expect(designation).toHaveValue("CEO");
  });

  test("testing validity of lead source field", () => {
    const leadSource = screen.getByTestId("lead-source").querySelector("input");
    expect(leadSource).toBeInTheDocument();
  });
  test("testing validity of lead Status field", () => {
    const leadStatus = screen.getByTestId("lead-status").querySelector("input");
    expect(leadStatus).toBeInTheDocument();
  });

  test("Testing Company Size Field", () => {
    expect(screen.getByText(/Company Size/i)).toBeInTheDocument();

  });
  test("Testing Address Details form", () => {
    expect(screen.getByText(/Address/i)).toBeInTheDocument();
  });
  test("Testing Street Field ", async () => {
    expect(screen.getByText(/Street/i)).toBeInTheDocument();
    const street = screen.getByTestId("street").querySelector("input");
    await userEvent.type(street, "abcd");
    expect(street).toHaveValue("abcd");
  });
  test("Testing Zip Code", async () => {
    expect(screen.getByText(/Zip Code/i)).toBeInTheDocument();
    const zip = screen.getByTestId("zip").querySelector("input");
    await userEvent.type(zip, "45671");
    expect(zip).toHaveValue("45671");
  });

  // commenting temporarily as react-select test cases needs to be updated

  // test("Testing Country Field", () => {
  //   expect(screen.getByText(/Country/i)).toBeInTheDocument();
  //   const country = screen.getByTestId("country").querySelector("input");
  //   expect(country).toBeInTheDocument();
  // });
  // test("Testing State field", () => {
  //   expect(screen.getByText(/State/i)).toBeInTheDocument();
  //   const state = screen.getByTestId("state").querySelector("input");
  //   expect(state).toBeInTheDocument();
  // });
  // test("Testing City Field", () => {
  //   expect(screen.getByText(/City/i)).toBeInTheDocument();
  //   const city = screen.getByTestId("city");
  //   expect(city).toBeInTheDocument();
  // });


  test("Testing Description Field", () => {
    expect(screen.getByText(/Description/i)).toBeInTheDocument();
    const desc = screen.getByTestId("desc");
    expect(desc).toBeInTheDocument();
  });
  test("Testing Contact Details Form", () => {
    expect(screen.getByText("Contact Details")).toBeInTheDocument();
  });
  test("Testing First Name field and its input", async () => {
    expect(screen.getByText(/First Name/i)).toBeInTheDocument();
    const fname = screen.getByTestId("fname").querySelector("input");
    await userEvent.type(fname, "abcd");
    expect(fname).toHaveValue("abcd");
  });
  test("Testing Company Field", async () => {
    const company = screen.getByTestId("company").querySelector("input");
    await userEvent.type(company, "Google");
    expect(company).toHaveValue("Google");
  });
  test("Testing Last Name Field", async () => {
    expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
    const lname = screen.getByTestId("lname").querySelector("input");
    await userEvent.type(lname, "pal");
    expect(lname).toHaveValue("pal");
  });
  test("Testing Email Field", async () => {
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    const email = screen.getByTestId("email").querySelector("input");
    await userEvent.type(email, "pp12@gmail.com");
    expect(email).toHaveValue("pp12@gmail.com");
  });

  test("Testing Save and Cancel buttons", () => {
    expect(screen.getByTestId("save")).toBeInTheDocument();
    expect(screen.getByTestId("cancel")).toBeInTheDocument();
  });
});
