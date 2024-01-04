import React from "react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import DataPermission from "../../pages/RolesPermissions/DataPermission";

import { act } from "react-dom/test-utils";


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({ state: { data: {} } }),
  useOutletContext: () => [null, jest.fn(), jest.fn(), null, jest.fn()],
}));

jest.mock("../../pages/RolesPermissions/UserOverview", () => ({
  __esModule: true,
  default: jest.fn(() => null), 
  
}));

const data = {
  data: [
    {
      permissions: {
        dashboards: {
          is_read: true,
          is_create: false,
          is_update: false,
          is_delete: false,
          is_assign: false,
        },
        leads: {
          is_read: true,
          is_create: true,
          is_update: false,
          is_delete: false,
          is_assign: false,
        },
      },
    },
  ],
};

jest.mock("../../apis/RolesApi", () => ({
  __esModule: true,
  ...jest.requireActual("../../apis/RolesApi"),
  RolesApi: {
    getPermission: (id) =>
      new Promise((resolve, reject) => {
        return resolve(data);
      }),
    updatePermission: jest.fn(() =>
      Promise.resolve({ data: { attributes: { permissions: true } } })
    ),
  },
}));

describe("DataPermission Component", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
act(()=>{
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <DataPermission />
      </Router>
    );
  });
})
 
  test("renders correctly", async () => {
     screen.debug()
    
        // expect(screen.getByText('create-note')).toBeInTheDocument();
  });


});