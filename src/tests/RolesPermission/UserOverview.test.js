import React from "react";
import "@testing-library/jest-dom";
import { screen, cleanup } from "@testing-library/react";

import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";
import UserOverview from "../../pages/RolesPermissions/UserOverview";

// jest.mock("react-router-dom", () => ({
//   useParams: () => ({ id: "some-id" }),
//   useNavigate: jest.fn(),
//   useLocation: () => ({ pathname: "/some-path" }),
// }));
const history = createMemoryHistory();
describe("UserOverview Component", () => {
  it("renders without errors", async () => {
    render(
      <Router location={history.location} navigator={history}>
        <UserOverview />
      </Router>
    );
    screen.debug();
    expect(screen.getByText("Send Email")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.getByText("Users Details")).toBeInTheDocument();
    expect(screen.getByText("Data & Permissions")).toBeInTheDocument();
  });

  it("opens the email modal when 'Send Email' button is clicked", () => {
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <UserOverview />
      </Router>
    );
    const sendEmailButton = getByText("Send Email");

    fireEvent.click(sendEmailButton);
  });
    
  it("opens the email modal when 'Send Email' button is clicked", () => {
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <UserOverview />
      </Router>
    );
    const UserButton = getByText("Users Details");

    fireEvent.click(UserButton);

  });

  it("opens the email modal when 'Send Email' button is clicked", () => {
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <UserOverview />
      </Router>
    );
    const data_permission = getByText("Data & Permissions");

    fireEvent.click(data_permission);

  });

    it("displays subject error when subject is not entered", () => {
      const { getByText, getByTestId } = render(
        <Router location={history.location} navigator={history}>
        <UserOverview />
      </Router>
      );
      const sendEmailButton = getByText("Send Email");

      fireEvent.click(sendEmailButton);

    
    });
});
