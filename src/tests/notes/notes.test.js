import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LeadNotes from "../../components/Leads/Notes/Notes";
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { DataContext } from "../../context";
import { NoteAPI } from "../../apis/NoteApi";

const history = createMemoryHistory();


describe("LeadNotes", () => {
  it("renders the component with notes", async () => {
    // Mock necessary context values and API responses

    const mockNotes = [
      {
        id: 1,
        attributes: {
          title: "Test Note 1",
          description: "Description 1",
          created_by: {
            data: {
              attributes: {
                first_name: "John",
                last_name: "Doe",
              },
            },
          },
          attachment: {
            url: "https://example.com/image.jpg",
          },
          created_at: "2023-08-10",
        },
      },
    
    ];

    jest.mock("../../apis/LeadApi", () => ({
        __esModule: true,
        ...jest.requireActual("../../apis/LeadApi"),
        
        NoteAPI: {
            getAllId: (id) =>
            new Promise((resolve, reject) => {
              return resolve(mockNotes);
            }),
        },
      }));
    const mockGetAllId = jest.fn().mockResolvedValue({
      data: mockNotes,
      meta: {
        next_page: null,
      },
    });

    // Mock context provider
    const mockDataContext = {
      notes: [],
      setNotes: jest.fn(),
    };

    render(
      <DataContext.Provider value={mockDataContext}>
        <Router location={history.location} navigator={history}>
          <LeadNotes type="Pipeline" />
        </Router>
      </DataContext.Provider>
    );

      expect(screen.getByText("Send Email")).toBeInTheDocument();

      // Check if the notes are rendered
      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("Notes")).toBeInTheDocument();
      expect(screen.getByTestId('create-note')).toBeInTheDocument();
  

  });

});
