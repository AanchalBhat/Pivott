import React from "react";
import { render } from "@testing-library/react";
import OverviewTable from "../../components/Pipeline/Details/PipelineOverview/OverviewTable";

import "@testing-library/jest-dom";

jest.mock("moment", () => {
  return () => ({
    utc: () => ({
      format: () => "01 Jan 2023",
    }),
  });
});

describe("OverviewTable", () => {
  it("should render a table with the provided data", () => {
    const mockData = [
      {
        id: 1,
        attributes: {
          stage: "Stage 1",
          stage_duration: "Duration 1",
          amount: 1000,
          closing_date: "2023-01-01",
          updated_at: "2023-01-01T12:00:00Z",
        },
      },
    ];

    const { getByText } = render(<OverviewTable data={mockData} />);

    expect(getByText("Stage 1")).toBeInTheDocument();
    expect(getByText("Duration 1")).toBeInTheDocument();
    expect(getByText("$1000")).toBeInTheDocument();
  });

  it("should handle rendering when no data is provided", () => {
    const { container } = render(<OverviewTable data={null} />);

    expect(container).toBeInTheDocument();
  });
});
