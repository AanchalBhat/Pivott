import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ScheduleReports from "../../pages/common/ScheduleReport";
import userEvent from "@testing-library/user-event";
import PopupFooter from "../../pages/common/PopupFooter";

describe("ScheduleReports Component", () => {
  it("renders without crashing", () => {
    const { getByText, getByLabelText } = render(
      <ScheduleReports
        openLT={true}
        handleToCloseLT={() => {}}
        popupDialogID={1}
        getAllData={() => {}}
        users={[]}
      />
    );

    expect(getByText("Schedule Report")).toBeInTheDocument();
    expect(getByText("Send to")).toBeInTheDocument();
    expect(getByText("Export as :")).toBeInTheDocument();
    expect(getByText("Send options")).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    const handleScheduleClose = jest.fn();

    const { getByLabelText, getByText } = render(
      <ScheduleReports
        openLT={true}
        handleToCloseLT={handleScheduleClose}
        popupDialogID={1}
        getAllData={() => {}}
        users={[]}
      />
    );

    fireEvent.click(getByLabelText("XLS"));
    fireEvent.click(getByLabelText("Schedule for later"));
    fireEvent.click(getByText("Send"));
  });
  it("renders  call time field", async () => {
    const { getByText, getByLabelText } = render(
      <ScheduleReports
        openLT={true}
        handleToCloseLT={() => {}}
        popupDialogID={1}
        getAllData={() => {}}
        users={[]}
      />
    );

    const callTime = screen.getByTestId("call-time").querySelector("input");
    expect(callTime).toBeInTheDocument();
    await userEvent.type(callTime, "call");
  });
  it("renders  popupfooter", async () => {
    const handleScheduleClose = jest.fn();
    render(
      <PopupFooter submitBtn={"submit"} handleToCloseLT={handleScheduleClose} />
    );
    const submitBtn = screen.getByTestId("submit-btn");
    await userEvent.click(submitBtn);

    const cancelBtn = screen.getByTestId("cancel-btn");
    await userEvent.click(cancelBtn);
    expect(handleScheduleClose).toHaveBeenCalled();
  });
});
