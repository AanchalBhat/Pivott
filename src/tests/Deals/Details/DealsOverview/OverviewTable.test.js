import React from "react";
import { render, screen } from "@testing-library/react";
import OverviewTable from "../../../../components/Deals/Details/DealsOverview/OverviewTable";
import "@testing-library/jest-dom";

// Mock the DataGrid component to capture its props
jest.mock("@mui/x-data-grid", () => {
    return {
        DataGrid: (props) => (
            <div data-testid="data-grid">
                  {props.columns.map((column) => (
          <div key={column.field} data-testid={`column-${column.field}`}>
            {column.headerName}
          </div>
        ))}

                {
                    props.rows.length > 0 && (
                        props.rows.map((row, index) => (
                            <div key={index} data-testid={`row-${index}`}>
                              {props.columns.map((column) => (
                                <span key={column.field} data-testid={`${column.field}-${index}`}>
                                  {column.valueGetter(row)}
                                </span>
                              ))}
                            </div>
                          ))
                    )
                }
                {
                    props.rows.length === 0 && (<div>No records found</div>)
                }
            </div>)
    };
});

describe("OverviewTable Component", () => {
    const sampleData = [
        {
            id: 1,
            attributes: {
                stage: "Stage 1",
                stage_duration: "Duration 1",
                amount: "Amount 1",
                closing_date: "Date 1",
                updated_at: "Time 1",
            },
        },
    ];

    it("renders without errors", () => {
        render(<OverviewTable data={sampleData} />);
        const dataGridElement = screen.getByTestId("data-grid");
        expect(dataGridElement).toBeInTheDocument();
    });

    it("displays data rows & table columns correctly", () => {
        render(<OverviewTable data={sampleData} />);

        // check if columns are rendering when there is data
        expect(screen.getByText("STAGE")).toBeInTheDocument();
        expect(screen.getByText("STAGE DURATION")).toBeInTheDocument();
        expect(screen.getByText("AMOUNT")).toBeInTheDocument();
        expect(screen.getByText("CLOSING DATE")).toBeInTheDocument();
        expect(screen.getByText("MODIFIED TIME")).toBeInTheDocument();

        // check if id is being applied to columns
        expect(screen.getByTestId("column-stage")).toHaveTextContent("STAGE");
        expect(screen.getByTestId("column-stage_duration")).toHaveTextContent("STAGE DURATION");
        expect(screen.getByTestId("column-Amount")).toHaveTextContent("AMOUNT");
        expect(screen.getByTestId("column-closing_date")).toHaveTextContent("CLOSING DATE");
        expect(screen.getByTestId("column-Modified_time")).toHaveTextContent("MODIFIED TIME");
    });

    it("displays no data message when no data is provided", () => {
      render(<OverviewTable data={[]} />);

       // check if columns are rendering when there is no data
       expect(screen.getByText("STAGE")).toBeInTheDocument();
       expect(screen.getByText("STAGE DURATION")).toBeInTheDocument();
       expect(screen.getByText("AMOUNT")).toBeInTheDocument();
       expect(screen.getByText("CLOSING DATE")).toBeInTheDocument();
       expect(screen.getByText("MODIFIED TIME")).toBeInTheDocument();

       // no data test should be displayed
      expect(screen.getByText("No records found")).toBeInTheDocument();
    });
});