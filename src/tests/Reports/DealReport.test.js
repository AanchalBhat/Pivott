import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import DealReport from "../../components/Reports/ReportDetails/DealReport";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { DataContext } from "../../context";
import FooterReport from "../../components/Reports/ReportDetails/FooterReport";
describe("DealReport Component", () => {
  it("renders the component with initial state", () => {
    render(
      <DealReport
        setDiscard_open={() => {}}
        setActiveStep={() => {}}
        users={[]}
        handleCreateClick={() => {}}
        reportErrMsg=""
      />
    );

    expect(screen.getByTestId("deal-owner")).toBeInTheDocument();
    expect(screen.getByText("Payment Mode")).toBeInTheDocument();
  });

  it("updates the payment terms when selecting an option", () => {
    render(
      <DealReport
        setDiscard_open={() => {}}
        setActiveStep={() => {}}
        users={[]}
        handleCreateClick={() => {}}
        reportErrMsg=""
      />
    );
    expect(screen.getByText("Implementation Kick-off")).toBeInTheDocument();
    expect(screen.getByText("Payment Mode")).toBeInTheDocument();
    expect(screen.getByTestId("payment_terms")).toBeInTheDocument();
  });

  it("validates and updates the tenure field", async () => {
    const mockData = {
      setCreateModuleFields: jest.fn(),
    };
    render(
      <DealReport
        setDiscard_open={() => {}}
        setActiveStep={() => {}}
        users={[]}
        handleCreateClick={() => {}}
        reportErrMsg=""
      />,
      {
        wrapper: ({ children }) => (
          <DataContext.Provider value={mockData}>
            {children}
          </DataContext.Provider>
        ),
      }
    );

    const tenure = screen.getByTestId("tenure").querySelector("input");
    expect(tenure).toBeInTheDocument();
    await userEvent.type(tenure, "5");
    expect(tenure).toHaveValue("5");
  });
  it("validates and updates the deal day field", async () => {
    const mockData = {
      setCreateModuleFields: jest.fn(),
    };
    render(
      <DealReport
        setDiscard_open={() => {}}
        setActiveStep={() => {}}
        users={[]}
        handleCreateClick={() => {}}
        reportErrMsg=""
      />,
      {
        wrapper: ({ children }) => (
          <DataContext.Provider value={mockData}>
            {children}
          </DataContext.Provider>
        ),
      }
    );

    expect(screen.getByText("Deal By Day")).toBeInTheDocument();
    expect(screen.getByTestId("dealDay")).toBeInTheDocument();
  });
  it("validates and updates the deal day field", async () => {
    const mockData = {
      setCreateModuleFields: jest.fn(),
    };
    render(
      <DealReport
        setDiscard_open={() => {}}
        setActiveStep={() => {}}
        users={[]}
        handleCreateClick={() => {}}
        reportErrMsg=""
      />,
      {
        wrapper: ({ children }) => (
          <DataContext.Provider value={mockData}>
            {children}
          </DataContext.Provider>
        ),
      }
    );

    const value = screen.getByTestId("value").querySelector("input");
    expect(value).toBeInTheDocument();
    await userEvent.type(value, "value");
  });
  it("testing the footer report ", async () => {
    const handleSubmit = jest.fn();
    const setActiveStep = jest.fn();
    const setCreateModuleFields = jest.fn();
    const setDiscard_open = jest.fn();
    render(
      <FooterReport
        setCreateModuleFields={setCreateModuleFields}
        setActiveStep={setActiveStep}
        handleSubmit={handleSubmit}
        setDiscard_open={setDiscard_open}
      />
    );
    const submitBtn = screen.getByTestId("submit");
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);
    const backBtn = screen.getByTestId("back");
    expect(backBtn).toBeInTheDocument();
    await userEvent.click(backBtn);
    const cancelBtn = screen.getByTestId("cancel");
    expect(cancelBtn).toBeInTheDocument();
    await userEvent.click(cancelBtn);
  });
});
