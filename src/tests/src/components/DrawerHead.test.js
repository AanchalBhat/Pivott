import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import DrawerHead from "../../../components/DrawerHead";
const history = createMemoryHistory();

describe("DrawerHead Component", () => {
  it("renders without crashing", () => {
    render(
      <Router location={history.location} navigator={history}>
        <DrawerHead />
      </Router>
    );
  });

  it("displays icon when closed", () => {
    const { getByAltText } = render(<DrawerHead />);
    const icon = getByAltText("IconParkCubeWhite");
    expect(icon).toBeInTheDocument();
  });

  it("displays icon and title when open", () => {
    const props = {
      open: true,
    };
    const { getByAltText, getByText } = render(<DrawerHead {...props} />);
    const icon = getByAltText("IconParkCubeWhite");
    const title = getByText("Pivott.ai");
    expect(icon).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it("calls handleDrawerOpen when closed icon is clicked", () => {
    const mockHandleDrawerOpen = jest.fn();
    const props = {
      handleDrawerOpen: mockHandleDrawerOpen,
    };
    const { getByAltText } = render(<DrawerHead {...props} />);
    const icon = getByAltText("IconParkCubeWhite");
    fireEvent.click(icon);
    expect(mockHandleDrawerOpen).toHaveBeenCalled();
  });

  it("calls handleDrawerClose when open icon is clicked", () => {
    const mockHandleDrawerClose = jest.fn();
    const props = {
      open: true,
      handleDrawerClose: mockHandleDrawerClose,
    };
    const { getByText } = render(<DrawerHead {...props} />);
    const title = getByText("Pivott.ai");
    fireEvent.click(title);
    expect(mockHandleDrawerClose).toHaveBeenCalled();
  });

  it('displays "Go Back" button in profile drawer', () => {
    const props = {
      isProfileDrwawer: true,
    };
    const { getByText } = render(<DrawerHead {...props} />);
    const goBackButton = getByText("Go Back");
    expect(goBackButton).toBeInTheDocument();
  });

  it('calls backNavigation when "Go Back" button is clicked', () => {
    const mockBackNavigation = jest.fn();
    const props = {
      isProfileDrwawer: true,
      backNavigation: mockBackNavigation,
    };
    const { getByText } = render(<DrawerHead {...props} />);
    const goBackButton = getByText("Go Back");
    fireEvent.click(goBackButton);
    expect(mockBackNavigation).toHaveBeenCalled();
  });
});
