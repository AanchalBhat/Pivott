import React from "react";
import { render, screen, fireEvent, waitFor,act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Meeting from "../../components/Leads/Meetings/Meetings";
import { MeetingApi } from "../../apis/MeetingApi";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { DataContext } from "../../context";


describe("Meeting Component", () => {
  const mockMeetings = [
              {
                id: 1,
                attributes: {
                  title: "Mock Meeting",
                  location: "google_meet",
                  organizer: {
                    full_name: "John Doe",
                  },
                  date: "2023-08-09",
                  start_time: "09:00",
                  end_time: "10:00",
                  description: "Mock description",
                },
              }
  ];

  const mockSetMeetings = jest.fn();

  const mockDataContextValue = {
    meetings: mockMeetings,
    setMeetings: mockSetMeetings,
  };

  const mockUseParams = jest.fn(() => ({ id: "mockId" }));

  beforeAll(() => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useParams: mockUseParams,
    }));
  });

  it("renders without crashing", () => {
    const history = createMemoryHistory();
    render(
      <DataContext.Provider value={mockDataContextValue}>
        <Router location={history.location} navigator={history}>
        <Meeting type="Pipeline" />
        </Router>
      </DataContext.Provider>
      
    );
  });

  it("displays 'Add Meeting' button", () => {
    const history = createMemoryHistory();
    render(
      <DataContext.Provider value={mockDataContextValue}>
        <Router location={history.location} navigator={history}>
        <Meeting type="Pipeline" />
        </Router>
      </DataContext.Provider>
    );
    
    const addButton = screen.getByText("Add Meeting");
    expect(addButton).toBeInTheDocument();
    const emailtext = screen.getByText("Send Email");
    expect(emailtext).toBeInTheDocument();
    const overviewtext = screen.getByText("Overview");
    expect(overviewtext).toBeInTheDocument();
  });



  it("displays 'No meetings available' when no meetings exist", () => {
    const history = createMemoryHistory();
    render(
      <DataContext.Provider value={{ meetings: [], setMeetings: mockSetMeetings }}>
        <Router location={history.location} navigator={history}>
        <Meeting type="Pipeline" />
        </Router>
      </DataContext.Provider>
    );
    const noMeetingsMessage = screen.getByText("No meetings available");
    expect(noMeetingsMessage).toBeInTheDocument();
  });

});

