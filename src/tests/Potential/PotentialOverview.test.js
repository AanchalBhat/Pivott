import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import PotentialOverview from "../../components/Potential/Details/PotentialOverview/PotentialOverview"; // Import your PotentialOverview component
import "@testing-library/jest-dom";
import { PotentialApi } from "../../apis/PotentialApi";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

jest.mock("../../apis/PotentialApi");

describe("PotentialOverview Component", () => {
  it("should render the component with initial data", async () => {
    PotentialApi.getDataById.mockResolvedValue({
      data: {
        attributes: {
          account_name: "Test Account",
          amount: 2000,
          contact_detail: {
            first_name: "alisha",
            last_name: "sam",
            designation: "engineer",
            email: "aa@gmail.com",
          },
          description: "pivott.ai",
        },
      },
    });
    PotentialApi.getReasonData.mockResolvedValue({
      data: {
        attributes: {
          account_name: "Test Account",
          amount: 2000,
        },
      },
    });
    PotentialApi.getStageData.mockResolvedValue({
      data: {
        attributes: {
          account_name: "Test Account",
          amount: 2000,
        },
      },
    })
    PotentialApi.getType.mockResolvedValue({});
    PotentialApi.potentialWon.mockResolvedValue({
      message: "Deal created successfully",
      deal_id: "12345",
    });
    const { getByText, getByTestId } = render(
      <MemoryRouter>
        <PotentialOverview />
      </MemoryRouter>
    );
    expect(getByTestId("acc-name")).toBeInTheDocument();
    expect(getByTestId("user")).toBeInTheDocument();
    expect(getByTestId("contact")).toBeInTheDocument();
    expect(getByTestId("amount")).toBeInTheDocument();

    const ownerBtn = getByTestId("owner-btn");
    expect(ownerBtn).toBeInTheDocument();
    await userEvent.click(ownerBtn);
    const wonBtn = getByTestId("won-btn");
    expect(wonBtn).toBeInTheDocument();
    await userEvent.click(wonBtn);
    const lostBtn = getByTestId("lost-btn");
    expect(lostBtn).toBeInTheDocument();
    await userEvent.click(lostBtn);
  });
});
