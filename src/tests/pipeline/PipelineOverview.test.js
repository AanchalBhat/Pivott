import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PipelineOverview from "../../components/Pipeline/Details/PipelineOverview/PipelineOverview";
import { PipelineApi } from "../../apis/pipelineApi";
import { MemoryRouter } from "react-router-dom";


import userEvent from "@testing-library/user-event";
// Mock the PipelineApi module
jest.mock("../../apis/pipelineApi");

describe("PipelineOverview", () => {
  it("should render the PipelineOverview component", async () => {
    PipelineApi.getDataById.mockResolvedValue({
      data: [
        {
          id: 1,
          attributes: {
            name: "Reason 1",
          },
        },
      ],
    });
    PipelineApi.getStageData.mockResolvedValue({
      data: [
        {
          id: 1,
          attributes: {
            name: "Reason 1",
          },
        },
      ],
    })
    PipelineApi.getType.mockResolvedValue({
      data: [
        {
          id: 1,
          attributes: {
            name: "Reason 1",
          },
        },
      ],
    });
    PipelineApi.pipelineWon.mockResolvedValue({
      data: [
        {
          id: 1,
          attributes: {
            name: "Reason 1",
          },
        },
      ],
    });
    // Render the component
    render(
      <MemoryRouter>
        <PipelineOverview />
      </MemoryRouter>
    );



    expect(screen.getByTestId("acc-name")).toBeInTheDocument();
    expect(screen.getByTestId("exp-revenue")).toBeInTheDocument();
    expect(screen.getByTestId("user-name")).toBeInTheDocument();
    expect(screen.getByTestId("designation")).toBeInTheDocument();

    const ownerBtn = screen.getByTestId("owner-btn");
    expect(ownerBtn).toBeInTheDocument();
    await userEvent.click(ownerBtn);

    const wonBtn = screen.getByTestId("won-btn");
    expect(wonBtn).toBeInTheDocument();
    await userEvent.click(wonBtn);

    const lostBtn = screen.getByTestId("lost-btn");
    expect(lostBtn).toBeInTheDocument();
    await userEvent.click(lostBtn);


    expect(screen.getByTestId("contact-made")).toBeInTheDocument();
    expect(screen.getByTestId("closing")).toBeInTheDocument();
    expect(screen.getByTestId("contact-person")).toBeInTheDocument();
    expect(screen.getByTestId("contact-detail")).toBeInTheDocument();
  });
});
