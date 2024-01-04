import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Router } from "react-router-dom";
import axios from "axios";
import LeadOverview from "../../components/Leads/Overview";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { LeadAPI } from "../../apis/LeadApi";

jest.mock("../../pages/Leads/Overview");
const mockResponse = {
  data: {
    attributes: {
      contact_detail: {
        full_name: "John Doe",
        first_name: "John",
        last_name: "singh",
        designation: "Software Engineer",
        email: "john.doe@example.com",
        phone_number: "90909090",
        company_name: "tcs",
      },
      lead_details: {
        profile_photo: {
          url: "https://example.com/profile.jpg",
        },
      },
      lead_source: { name: "abc" },
      lead_owner: {
        full_name: "Jane Smith",
      },
      status: {
        name: "Qualified",
      },
      industry: {
        name: "gps Technology"
      },
      company_size:{
        name: "Large"
      },
      website: "https://example.com",
      lead_address: {
        street: "123 Main St",
        state: "CA",
        country: "USA",
        city: "Los Angeles",
        zip_code: "90001",
      },
      description: "This is a lead description.",
    },
  },
};

jest.mock("../../apis/LeadApi", () => ({
  __esModule: true,
  ...jest.requireActual("../../apis/LeadApi"),
  LeadAPI: {
    getByid: (id) =>
      new Promise((resolve, reject) => {
        return resolve(mockResponse);
      }),
  },
}));

describe("LeadOverview", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    const history = createMemoryHistory();
    act(() => {
      render(
        <Router location={history.location} navigator={history}>
          <LeadOverview />
        </Router>
      );
    });
  });

  it("handles API and displays proper api", async () => {
    // screen.debug()
    await screen.findByText("john.doe@example.com");
    expect(screen.getByTestId("lead-owner-name")).toHaveTextContent(
      "Jane Smith"
    );
    screen.findByText("Software Engineer");
    expect(screen.getByTestId("first_name")).toHaveTextContent("John");
    expect(screen.getByTestId("last_name")).toHaveTextContent("singh");
    expect(screen.getByTestId("email")).toHaveTextContent(
      "john.doe@example.com"
    );
    expect(screen.getByTestId("phone_number")).toHaveTextContent("90909090");
    expect(screen.getByTestId("company_name")).toHaveTextContent("tcs");
    expect(screen.getByTestId("lead_source")).toHaveTextContent("abc");
    expect(screen.getByTestId("lead_status")).toHaveTextContent("Qualified");
    expect(screen.getByTestId("industry")).toHaveTextContent("gps Technology");
    expect(screen.getByTestId("company_size")).toHaveTextContent("Large");
    expect(screen.getByTestId("website")).toHaveTextContent(
      "https://example.com"
    );
    expect(screen.getByTestId("designation")).toHaveTextContent(
      "Software Engineer"
    );
    expect(screen.getByTestId("street_address")).toHaveTextContent(
      "123 Main St"
    );
    expect(screen.getByTestId("state")).toHaveTextContent("CA");
    expect(screen.getByTestId("country")).toHaveTextContent("USA");
    expect(screen.getByTestId("city")).toHaveTextContent("Los Angeles");
    expect(screen.getByTestId("zip_code")).toHaveTextContent("90001");
    expect(screen.getByTestId("description")).toHaveTextContent(
      "This is a lead description."
    );
  });

  it("Component will render and display label correct", () => {
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Lead Owner")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Lead Source")).toBeInTheDocument();
    expect(screen.getByText("Lead Status")).toBeInTheDocument();
    expect(screen.getByText("Industry")).toBeInTheDocument();
    expect(screen.getByText("Company Size")).toBeInTheDocument();
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Designation")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("Zip Code")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
