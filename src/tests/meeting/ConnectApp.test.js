import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ConnectApp from "../../components/Leads/Meetings/ConnectApp";


describe("ConnectApp Component", () => {
  const handleCloseMock = jest.fn();

  it("renders without crashing", () => {
    render(<ConnectApp handleClose={handleCloseMock} />);
    expect(screen.getByText("Organizer")).toBeInTheDocument(); 
    expect(screen.getByText("Add Meeting")).toBeInTheDocument(); 
    expect(screen.getByText("Meeting Details")).toBeInTheDocument(); 
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Connect App")).toBeInTheDocument(); 
    expect(screen.getByText("(To continue, Go back!)")).toBeInTheDocument(); 
    expect(screen.getByText("Organizer")).toBeInTheDocument();
    expect(screen.getByText("Webex")).toBeInTheDocument();
    expect(screen.getByText("(not in use for now)")).toBeInTheDocument();
    
    
    
  });

  it("displays 'Connect App' heading", () => {
    render(<ConnectApp handleClose={handleCloseMock} />);
    const heading = screen.getByText("Connect App");
    expect(heading).toBeInTheDocument();
  });

  it("displays app options with correct labels", () => {
    render(<ConnectApp handleClose={handleCloseMock} />);
    const webexOption = screen.getByText("Webex");
    const skypeOption = screen.getByText("Skype");
    const googleMeetOption = screen.getByText("Google Meet");
    const zoomOption = screen.getByText("Zoom"); 
    expect(webexOption).toBeInTheDocument();
    expect(skypeOption).toBeInTheDocument();
    expect(googleMeetOption).toBeInTheDocument();
    expect(zoomOption).toBeInTheDocument();
  });

  it("displays 'connected' status for apps with access", () => {
    render(<ConnectApp handleClose={handleCloseMock} />);
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("displays 'Go back' message when goBack is true", () => {
    render(<ConnectApp handleClose={handleCloseMock} goBack={true} />);
    const goBackMessage = screen.getByText("(To continue, Go back!)");
    expect(goBackMessage).toBeInTheDocument();
  });

  it("calls handleClose when Cancel button is clicked", () => {
    render(<ConnectApp handleClose={handleCloseMock} />);
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

});
