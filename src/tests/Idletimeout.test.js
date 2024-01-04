import React from "react";
import "@testing-library/jest-dom";
import { render, act, fireEvent } from "@testing-library/react";
import IdleTimeout from "../constants/IdleTimeout";
jest.mock("react-idle-timer", () => ({
  __esModule: true,
  useIdleTimer: jest.fn(),
}));
describe("IdleTimeout Component", () => {
  let logOutMock = jest.fn();

  it("should call logOut function when user becomes idle", () => {
    require("react-idle-timer").useIdleTimer.mockImplementation((config) => {
      config.onIdle();
    });
    render(<IdleTimeout logOut={logOutMock} />);

    act(() => {
      jest.advanceTimersByTime(1 * 60 * 60 * 1000 + 1);
    });

    expect(logOutMock).toHaveBeenCalled();
  });

  it("should not call logOut function before becoming idle", () => {
    render(<IdleTimeout logOut={logOutMock} />);

    act(() => {
      fireEvent.mouseMove(document);
    });

    expect(logOutMock).not.toHaveBeenCalled();
  });
});
