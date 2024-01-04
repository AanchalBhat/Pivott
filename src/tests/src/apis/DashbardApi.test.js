import React from "react";
import "@testing-library/jest-dom";

import { createMemoryHistory } from "history";
import { DashboardApi } from "../../../apis/DashboardApi";

const history = createMemoryHistory();

describe("DashboardApi", () => {
  it("should return a promise", () => {
    const promise = DashboardApi.getAll();
    promise.then((DashboardApi) => {
      expect(DashboardApi).toBePromise();
    });
  });

  it("should resolve with a list of dashboards", () => {
    const promise = DashboardApi.getAll();
    promise.then((dashboards) => {
      expect(dashboards).toBeArray();
      expect(dashboards.length).toBeGreaterThan(0);
    });
  });
});
