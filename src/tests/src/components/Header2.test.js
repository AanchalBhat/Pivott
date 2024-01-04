import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Header2 from "../../../components/Header2";
const history = createMemoryHistory();

describe("Header2 Component", () => {
  const defaultProps = {
    searchTerm: "",
    counter: 0,
    handleNavigate: jest.fn(),
    handleGlobalSearch: jest.fn(),
    handleClearInput: jest.fn(),
    toggleDrawerAction: jest.fn(),
    id: "test-id",
    anchorEl: null,
    openProfile: false,
    handleClose: jest.fn(),
    handleProfileDrawer: jest.fn(),
    handleOpenform: jest.fn(),
  };

  it("renders without crashing", () => {
    render(
      <Router location={history.location} navigator={history}>
        <Header2 {...defaultProps} />
      </Router>
    );
  });

  it("displays upgrade button", () => {
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <Header2 {...defaultProps} />
      </Router>
    );
    const upgradeButton = getByText("UPGRADE");
    expect(upgradeButton).toBeInTheDocument();
  });

  it("calls toggleDrawerAction when bell icon is clicked", () => {
    const { getByTestId } = render(
      <Router location={history.location} navigator={history}>
        <Header2 {...defaultProps} />
      </Router>
    );
    const bellIcon = getByTestId("bell-icon");
    fireEvent.click(bellIcon);
    expect(defaultProps.toggleDrawerAction).toHaveBeenCalled();
  });

  it("calls handleNavigate and handleGlobalSearch on input change", () => {
    const { getByPlaceholderText } = render(
      <Router location={history.location} navigator={history}>
        <Header2 {...defaultProps} />
      </Router>
    );
    const input = getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "test" } });
    expect(defaultProps.handleNavigate).toHaveBeenCalled();
    expect(defaultProps.handleGlobalSearch).toHaveBeenCalled();
  });

});
