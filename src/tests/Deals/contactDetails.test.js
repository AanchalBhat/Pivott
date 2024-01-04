import { Router } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ContactDetailForm from "../../components/Deals/ContactDetail";
import { DealsApi } from "../../apis/DealsApi";

jest.mock("../../apis/DealsApi", () => {
  return {
    __esModule: true,
    DealsApi: {
      createContactDetail: jest.fn(),
    },
  };
});
jest.mock("axios", () => {});

describe("YourComponent.createContact", () => {
  it("should handle a successful response", async () => {
    // Mock the response data
    const responseData = {
      data: {
        id: 123,
        attributes: {
          full_name: "John Doe",
        },
      },
    };

    DealsApi.createContactDetail.mockResolvedValue(responseData);
  });

  it("should handle an error response", async () => {
    DealsApi.createContactDetail.mockRejectedValue(new Error("Network error"));
  });
});
describe("Deals Contact details ", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    const setOpenModal = jest.fn(() => true);
    render(
      <Router location={history.location} navigator={history}>
        <ContactDetailForm setOpenModal={setOpenModal} />
      </Router>
    );
  });
  test("Testing if Contact details exists or not", () => {
    expect(screen.getByText("Contact Details")).toBeInTheDocument();
  });

  test("Testing if required  fields exists or not ", async () => {
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
    await userEvent.type(firstName, "ram");
    expect(firstName).toHaveValue("ram");

    await userEvent.type(lastName, "shah");
    expect(lastName).toHaveValue("shah");

    await userEvent.type(email, "crcc@gmail.com");
    expect(email).toHaveValue("crcc@gmail.com");

    await userEvent.type(contact, "98764-3455");
    expect(contact).toHaveValue("+91 98764-3455");

    await userEvent.type(company, "nutanix");
    expect(company).toHaveValue("nutanix");

    await userEvent.type(designation, "CEO");
    expect(designation).toHaveValue("CEO");
  });
  test("Testing Buttons", async () => {
    const btn = screen.getByTestId("sp-btn");
    const cpBtn = screen.getByTestId("cp-btn");

    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);

    expect(cpBtn).toBeInTheDocument();
    await userEvent.click(cpBtn);
  });
});
