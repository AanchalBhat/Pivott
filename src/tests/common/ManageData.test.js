import "@testing-library/jest-dom";
import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, screen } from "@testing-library/react";
import ManageData from "../../pages/common/ManageData";
import userEvent from "@testing-library/user-event";

describe("Testing  Lost Lead list", () => {
  const stateChange = jest.fn(() => true);
  const toggleDrawerActionMock = jest.fn();
  const handleManageSearchMock = jest.fn();
  const handleManageMock = jest.fn();

  const history = createMemoryHistory();
  render(
    <Router location={history.location} navigator={history}>
      <ManageData
        handleManage={handleManageMock}
        handleManageSearch={handleManageSearchMock}
        stateChange={stateChange}
        toggleDrawerAction={toggleDrawerActionMock}
      />
    </Router>
  );

  test("Testing  toggle ,reset button and handleManage function", async () => {
    const toggle = screen.getByTestId("toggle");
    expect(screen.getByTestId("toggle")).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(toggleDrawerActionMock).toHaveBeenCalled();
    const btn = screen.getByTestId("reset-btn");
    expect(btn).toBeInTheDocument();

    const search = screen.getByTestId("search").querySelector("input");
    expect(search).toBeInTheDocument();
    await userEvent.type(search, "HHH");
    expect(handleManageSearchMock).toHaveBeenCalled();
    const apply = screen.getByTestId("apply");
    expect(apply).toBeInTheDocument();
    await userEvent.click(apply);
    expect(handleManageMock).toHaveBeenCalled();
    const cancel = screen.getByTestId("cancel");
    expect(cancel).toBeInTheDocument();
    await userEvent.click(cancel);
    expect(toggleDrawerActionMock).toHaveBeenCalled();
  });
});
