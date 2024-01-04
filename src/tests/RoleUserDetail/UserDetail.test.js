import React from "react";
import { createMemoryHistory } from "history";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Router } from "react-router";
import UserDetails from "../../pages/RolesPermissions/UserDetails";

const history = createMemoryHistory();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useOutletContext: () => [null, jest.fn(), jest.fn(), null, jest.fn()],
}));
const mockUsers = {
  first_name: "John",
  last_name: "Doe",
  profile_photo: {
    url: "https://example.com/profile.jpg",
  },
};

jest.mock("../../apis/userApi", () => ({
  __esModule: true,
  ...jest.requireActual("../../apis/userApi"),
  userApi: {
    getUser: (id) =>
      new Promise((resolve, reject) => {
        return resolve(mockUsers);
      }),
  },
}));

jest.mock("../../apis/RolesApi", () => ({
    __esModule: true,
    ...jest.requireActual("../../apis/RolesApi"),
    RolesApi: {
        toggleDeactivateUser: (id) =>
        new Promise((resolve, reject) => {
          return resolve(mockUsers);
        }),
    },
  }));

  jest.mock("../../apis/PersonalApi", () => ({
    __esModule: true,
    ...jest.requireActual("../../apis/PersonalApi"),
    DeleteUsers : jest.fn().mockResolvedValue({}),
  }));

const mockSetUsers = jest.fn();
const mockSetImgData = jest.fn();
const mockSetOpenDelete = jest.fn();
const mockSetDeleteId = jest.fn();


describe("UserDetails Component", () => {
  it("renders user details correctly", async () => {
    render(
      <Router location={history.location} navigator={history}>
        <UserDetails />
      </Router>
    );
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Added By")).toBeInTheDocument();
    expect(screen.getByText("Joined Date")).toBeInTheDocument();
    expect(screen.getByText("Time Zone")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });

  it("handles deactivate user button click", async () => {
    render(
      <Router location={history.location} navigator={history}>
        <UserDetails />
      </Router>
    );

    const deactivateButton = screen.getByText("Deactivate User");
    fireEvent.click(deactivateButton);
  });

  it("handles delete user button click", async () => {
    render(
      <Router location={history.location} navigator={history}>
        <UserDetails
          users={mockUsers}
          setUsers={mockSetUsers}
          setImgData={mockSetImgData}
          setOpenDelete={mockSetOpenDelete}
          setDeleteId={mockSetDeleteId}
        />
      </Router>
    );

    // const deleteUserButton = screen.getByText("Delete User");
    // fireEvent.click(deleteUserButton);

    // expect(screen.getByText("Delete User?")).toBeInTheDocument();
    // const confirmDeleteButton = screen.getByText("Confirm Delete");
    // fireEvent.click(confirmDeleteButton);
  });
});
