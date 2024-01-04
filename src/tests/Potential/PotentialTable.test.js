import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import PotentialTable from "../../components/Potential/PotentialTable";
import { DataContext } from "../../context";
import { MemoryRouter } from "react-router-dom";
describe("PotentialTable", () => {
  it("Testing Potential Table", () => {
    const listData = [{ count: 0 }, { manage: false }];

    const mockDataContext = {
      globalPotential: [],
      setGlobalPotential: jest.fn(),
      setPotentialData: jest.fn(),
      setPotenialeId: jest.fn(),
    };
    const handlePageChange = jest.fn();

    const { getByTestId } = render(
      <MemoryRouter>
        <PotentialTable
          handlePageChange={handlePageChange}
          listData={listData}
        />
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <DataContext.Provider value={mockDataContext}>
            {children}
          </DataContext.Provider>
        ),
      }
    );

    expect(screen.getByText("No potential found")).toBeInTheDocument();
  });
});
