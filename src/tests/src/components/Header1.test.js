import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Header1 from "../../../components/Header1";
const history = createMemoryHistory();

describe("Header1 Component", () => {
  const defaultProps = {
    open: false,
    splitLocation: ["", ""],
    isProfileDrwawer: false,
    title: "Header Title",
    handleDrawerClose: jest.fn(),
    handleDrawerOpen: jest.fn(),
    handleBack: jest.fn(),
  };

  it("renders without crashing", () => {
    render(
      <Router location={history.location} navigator={history}>
        <Header1 {...defaultProps} />
      </Router>
    );
  });

//   it("calls handleBack when close icon is clicked", () => {
//     const props = {
//       ...defaultProps,
//       splitLocation: ["", "globalSearch"],
//     };
//     const { getByTestId } = render(
//       <Router location={history.location} navigator={history}>
//         <Header1 {...props} />
//       </Router>
//     );
//     const closeIcon = getByTestId("close-icon");
//     fireEvent.click(closeIcon);
//     expect(defaultProps.handleBack).toHaveBeenCalled();
//   });

  it("displays the correct title", () => {
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <Header1 {...defaultProps} />
      </Router>
    );
    const title = getByText("Header Title");
    expect(title).toBeInTheDocument();
  });
});
