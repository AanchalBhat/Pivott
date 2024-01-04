import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import PageNotFound from "../../components/NotFound/PageNotFound";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("PageNotFound", () => {
  it("should render the component with the correct content", () => {
    const { getByTestId, getByText, getByAltText } = render(
      <PageNotFound domain={true} />
    );

    expect(getByTestId("not-found")).toBeInTheDocument();
    expect(getByText("Page Not Found")).toBeInTheDocument();
    expect(
      getByText(/The page you are looking for might not exists/i)
    ).toBeInTheDocument();
    expect(getByText("Back to Home")).toBeInTheDocument();
    expect(getByAltText("image 404")).toBeInTheDocument();
  });

  it("should navigate to /dashboard when domain is true", () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockReturnValue(navigateMock);

    render(<PageNotFound domain={true} />);

    fireEvent.click(screen.getByText("Back to Home"));

    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });

  it("should navigate to /login when domain is false", () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockReturnValue(navigateMock);

    render(<PageNotFound domain={false} />);

    fireEvent.click(screen.getByText("Back to Home"));

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
