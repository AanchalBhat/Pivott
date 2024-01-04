import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import MeetingsPopup from "../../components/Leads/Calls/CallsPopup";
import userEvent from "@testing-library/user-event";

describe("MeetingsPopup Component", () => {
  test("should render without errors", () => {

    const mockProps = {
      call: {},
      closeDrawer: jest.fn(),
      isEdit: false,
      type: "someType",
      callsInit: jest.fn(),
      page: 1,
      setPage: jest.fn(),
      setLoadMoreClick: jest.fn(),
      updateCall: jest.fn(),
    };

    // Render the component
    const { getByText, getByTestId } = render(<MeetingsPopup {...mockProps} />);

    expect(getByTestId("schedule-btn")).toBeInTheDocument();
    expect(getByTestId("schedule")).toBeInTheDocument();
    expect(getByTestId("call-to")).toBeInTheDocument();
    expect(getByTestId("assign-to")).toBeInTheDocument();
  });
  test("Testing related to input field", () => {
    render(<MeetingsPopup />);
    const related = screen.getByTestId("related");
    expect(related).toBeInTheDocument();
    const relatedTo = screen.getByTestId("related-to").querySelector("input");
    expect(relatedTo).toBeInTheDocument();
    fireEvent.change(relatedTo, { target: { value: "pipeline" } });
  });
  test("Testing Assign input field", () => {
    render(<MeetingsPopup />);
    const assignTo = screen.getByTestId("assign-2").querySelector("input");
    expect(assignTo).toBeInTheDocument();
    fireEvent.change(assignTo, { target: { value: "pipeline" } });
  });
  test("Testing call input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("call-type")).toBeInTheDocument();
    const callTo = screen.getByTestId("call-2").querySelector("input");
    expect(callTo).toBeInTheDocument();
    fireEvent.change(callTo, { target: { value: "pipeline" } });
  });
  test("Testing outgoing status input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("out-status")).toBeInTheDocument();
    const outStatus = screen.getByTestId("out").querySelector("input");
    expect(outStatus).toBeInTheDocument();
    fireEvent.change(outStatus, { target: { value: "pipeline" } });
  });
  test("Testing  Date picker input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("call-date")).toBeInTheDocument();
  });
  test("Testing call time input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("call-time")).toBeInTheDocument();
  });
  test("Testing subject input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("subject")).toBeInTheDocument();
    const subject = screen.getByTestId("subject-2").querySelector("input");
    expect(subject).toBeInTheDocument();
    fireEvent.change(subject, { target: { value: "pipeline" } });
  });
  test("Testing reminder input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("reminder")).toBeInTheDocument();
    const reminder = screen.getByTestId("reminder-2").querySelector("input");
    expect(reminder).toBeInTheDocument();
    fireEvent.change(reminder, { target: { value: "pipeline" } });
  });
  test("Testing organizer input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("organizer")).toBeInTheDocument();
    const organizer = screen.getByTestId("organizer-2").querySelector("input");
    expect(organizer).toBeInTheDocument();
    fireEvent.change(organizer, { target: { value: "pipeline" } });
  });
  test("Testing purpose input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("purpose")).toBeInTheDocument();
    const purpose = screen.getByTestId("purpose-2").querySelector("input");
    expect(purpose).toBeInTheDocument();
    fireEvent.change(purpose, { target: { value: "pipeline" } });
  });
  test("Testing agenda input field", () => {
    render(<MeetingsPopup />);
    expect(screen.getByTestId("agenda")).toBeInTheDocument();
    const agenda = screen.getByTestId("agenda-2").querySelector("input");
    expect(agenda).toBeInTheDocument();
    fireEvent.change(agenda, { target: { value: "pipeline" } });
  });
  test("Testing schedule button", async () => {
    render(<MeetingsPopup />);

    const scheduleBtn = screen.getByTestId("schedul-btn");
    expect(scheduleBtn).toBeInTheDocument();
    await userEvent.click(scheduleBtn);
  });

  test("Testing  cancel button", async () => {
    const closeDrawer = jest.fn();
    render(<MeetingsPopup closeDrawer={closeDrawer} />);

    const cancelBtn = screen.getByTestId("cancel-btn");
    expect(cancelBtn).toBeInTheDocument();
    await userEvent.click(cancelBtn);
  });
});
