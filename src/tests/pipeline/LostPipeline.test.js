import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LostPipelinePopup from "../../components/Pipeline/Details/PipelineOverview/LostPipeline";
import { PotentialApi } from "../../apis/PotentialApi";
import { PipelineApi } from "../../apis/pipelineApi";
import userEvent from "@testing-library/user-event";

jest.mock("react-router-dom", () => {
  return {
    __esModule: true,
    useNavigate: jest.fn(),
  };
});
// Mock the APIs
jest.mock("../../apis/PotentialApi");
jest.mock("../../apis/pipelineApi");

describe("LostPipelinePopup", () => {
  test("should render correctly and handle submission", async () => {
    PotentialApi.getReasonData.mockResolvedValue({
      data: [
        {
          id: 1,
          attributes: {
            name: "Reason 1",
          },
        },
      ],
    });

    PipelineApi.createLostData.mockResolvedValue({
      data: {
        description: "Description text",
        lost_leadable_id: "id",
        lost_leadable_type: "type",
        reason_id: "1",
      },
    });

    const setOpenModal = jest.fn();

    const { getByLabelText } = render(
      <LostPipelinePopup setOpenModal={setOpenModal} />
    );

    const desc = screen.getByTestId("desc");
    await userEvent.type(desc, "description");
    const lostReason = screen.getByTestId("lost");
    expect(lostReason).toBeInTheDocument();
    await userEvent.type(lostReason, "reason");

    const moveToLostButton = screen.getByTestId("move-lost");
    expect(moveToLostButton).toBeInTheDocument();
    await userEvent.click(moveToLostButton);

    const cancelbtn = screen.getByTestId("cancel");
    expect(cancelbtn).toBeInTheDocument();
    await userEvent.click(cancelbtn);

    expect(setOpenModal).toHaveBeenCalledWith(false);
  });
});
