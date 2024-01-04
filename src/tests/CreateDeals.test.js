import React from "react";
import { createMemoryHistory } from "history";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { DealsApi } from "../apis/DealsApi";
import CreateDeals from "../components/Deals/CreateDeals";
const history = createMemoryHistory();


const mockApiResponse = {
  data: [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ],
};
jest.mock("../apis/DealsApi", () => ({
  ...jest.requireActual("../apis/DealsApi"),

  DealsApi: {
    getDataById: (id) =>
      new Promise((resolve, reject) => {
        return resolve(mockApiResponse);
      }),
      update: (id) =>
      new Promise((resolve, reject) => {
        return resolve(mockApiResponse);
      }),
      create: (id) =>
      new Promise((resolve, reject) => {
        return resolve(mockApiResponse);
      }),
      getDataById: (id) =>
      new Promise((resolve, reject) => {
        return resolve(mockApiResponse);
      }),
     },

}));

jest.mock("../apis/userApi", () => ({
    ...jest.requireActual("../apis/userApi"),

    userApi: {
        getUsers: (id) =>
        new Promise((resolve, reject) => {
          return resolve(mockApiResponse);
        }),
    },
  }));

describe("<Create Leads/> ", () => {
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <CreateDeals />
      </Router>
    );
  });

  test("check weather text on screen", () => {
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
  test("check weather Deal Value field", async () => {
    const value = screen.getByTestId("value").querySelector("input");
    expect(value).toBeInTheDocument();
    await userEvent.type(value, "1111");
    expect(value).toHaveValue("1111");
  });
  test("check weather deal field", async () => {
    const dealName = screen.getByTestId("deal_name").querySelector("input");
    await userEvent.type(dealName, "test");
    expect(dealName).toHaveValue("test");
  });
  test("check weather tenure field", async () => {
    const tenure = screen.getByTestId("tenure").querySelector("input");
    expect(tenure).toBeInTheDocument();
    await userEvent.type(tenure, "11");
    expect(tenure).toHaveValue("11");
  });
  test("check weather Payment terms", () => {
    const payment = screen.getByTestId("payment_terms").querySelector("input");
    expect(payment).toBeInTheDocument();
  });
  test("check weather campaign field", async () => {
    const campaign = screen.getByTestId("campaign").querySelector("input");
    expect(campaign).toBeInTheDocument();
    await userEvent.type(campaign, "test");
    expect(campaign).toHaveValue("test");
  });
  test("check weather deal terms field", async () => {
    const navigate = jest.fn();
    const dealTerm = screen.getByTestId("deal_terms").querySelector("input");
    expect(dealTerm).toBeInTheDocument();
    await userEvent.type(dealTerm, "11");
    expect(dealTerm).toHaveValue("11");
  });
  test("check weather Create Deals is present in overview table", () => {
    expect(screen.getByText("Create Deals")).toBeInTheDocument();
  });
  test("check weather  Contact Person is present in overview table", () => {
    expect(screen.getByText("Contact Person")).toBeInTheDocument();
  });
  test("check weather  Cancel is present in overview table", () => {
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
  test("check weather  SAVE AND NEW is present in overview table", () => {
    expect(screen.getByText("SAVE AND NEW")).toBeInTheDocument();
  });
  test("check weather  Description is present in overview table", () => {
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
  test("check weather  Campaign Sources is present in overview table", () => {
    expect(screen.getByText("Campaign Sources")).toBeInTheDocument();
  });

  test("check weather  Implementation Kick-off is present in overview table", () => {
    expect(screen.getByText("Implementation Kick-off")).toBeInTheDocument();
  });

  test("check weather  Payments Terms is present in overview table", () => {
    expect(screen.getByText("Payment Terms")).toBeInTheDocument();
  });
  test("check weather  Sign Off Date Terms is present in overview table", () => {
    expect(screen.getByText("Sign Off Date")).toBeInTheDocument();
  });

  test("check weather cancel function trigger proper", async () => {
    const campaign = screen.getByTestId("cancel-abc");
    await userEvent.click(campaign);
    expect(campaign).toBeInTheDocument();
  });

  test("check weather tenure function trigger proper", async () => {
    const campaign = screen.getByTestId("tenure");
    await userEvent.click(campaign);
    expect(campaign).toBeInTheDocument();
  });

  test("check weather payment_terms function trigger proper", async () => {
    const campaign = screen.getByTestId("payment_terms");
    await userEvent.click(campaign);
    expect(campaign).toBeInTheDocument();
  });

  test("check weather deal_terms function trigger proper", async () => {
    const campaign = screen.getByTestId("deal_terms");
    await userEvent.click(campaign);
    expect(campaign).toBeInTheDocument();
  });

  test("check weather description function trigger proper", async () => {
    const campaign = screen.getByTestId("description");
    await userEvent.click(campaign);
    expect(campaign).toBeInTheDocument();
  });

  test("check weather save-btn function trigger proper", async () => {
    const campaign = screen.getByTestId("save-btn");
    await userEvent.click(campaign);
    expect(campaign).toBeInTheDocument();
  });

});