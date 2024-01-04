import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import Convert from "../../pages/common/Convert";
import userEvent from "@testing-library/user-event";

// Mock data for testing
const mockData = [
  { eventKey: "key1", label: "Pipeline" },
  { eventKey: "key2", label: "Deal" },
];

describe("Convert Component", () => {
  it("should render the dropdown button and options correctly", async () => {
    const handleConvert = jest.fn(); // Mock function for handleConvert

    const { getByTestId, getByText } = render(
      <Convert handleConvert={handleConvert} data={mockData} />
    );

    const dropdownButton = getByTestId("drop-btn");

    expect(dropdownButton).toBeInTheDocument();
    await userEvent.click(dropdownButton);
  });
});
