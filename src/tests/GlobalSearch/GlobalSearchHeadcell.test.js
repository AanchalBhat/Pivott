import React from 'react';
import { render } from '@testing-library/react';
import { leadsHeadCells,pipelineHeadCells,potentialHeadCells,dealsHeadCells } from '../../components/Reports/AllHeadCells';
import "@testing-library/jest-dom";



describe("leadsHeadCells", () => {
  it("should render the correct number of cells", () => {
    const { container } = render(<leadsHeadCells />);
    expect(container.querySelectorAll("th").length).toBe(0);
  });

  it("should render the correct header names", () => {
    const { container } = render(<leadsHeadCells />);
    const headerNames = [
      "Name",
      "Email",
      "Phone",
      "Lead Source",
      "Company",
    ];
    for (let i = 0; i < headerNames.length; i++) {
        expect(container.querySelector(`th:nth-child(${i + 1})`)).toBeNull();
        if (container.querySelector(`th:nth-child(${i + 1})`)) {
          expect(container.querySelector(`th:nth-child(${i + 1})`).textContent).toBe(null)
          
        }
    
    
    }
  });
});

describe("leadsHeadCells", () => {
  it("should render the correct number of cells", () => {
    const { container } = render(<pipelineHeadCells />);
    expect(container.querySelectorAll("th").length).toBe(0);
  });

  it("should render the correct header names", () => {
    const { container } = render(<pipelineHeadCells />);
    const headerNames = [
      "Name",
      "Email",
      "Phone",
      "Lead Source",
      "Company",
    ];
    for (let i = 0; i < headerNames.length; i++) {
        expect(container.querySelector(`th:nth-child(${i + 1})`)).toBeNull();
        if (container.querySelector(`th:nth-child(${i + 1})`)) {
          expect(container.querySelector(`th:nth-child(${i + 1})`).textContent).toBe(null)
          
        }
    
    
    }
  });
});

describe("leadsHeadCells", () => {
  it("should render the correct number of cells", () => {
    const { container } = render(<potentialHeadCells />);
    expect(container.querySelectorAll("th").length).toBe(0);
  });

  it("should render the correct header names", () => {
    const { container } = render(<potentialHeadCells />);
    const headerNames = [
      "Name",
      "Email",
      "Phone",
      "Lead Source",
      "Company",
    ];
    for (let i = 0; i < headerNames.length; i++) {
        expect(container.querySelector(`th:nth-child(${i + 1})`)).toBeNull();
        if (container.querySelector(`th:nth-child(${i + 1})`)) {
          expect(container.querySelector(`th:nth-child(${i + 1})`).textContent).toBe(null)
          
        }
    
    
    }
  });
});

describe("leadsHeadCells", () => {
  it("should render the correct number of cells", () => {
    const { container } = render(<dealsHeadCells />);
    expect(container.querySelectorAll("th").length).toBe(0);
  });

  it("should render the correct header names", () => {
    const { container } = render(<dealsHeadCells />);
    const headerNames = [
      "Name",
      "Email",
      "Phone",
      "Lead Source",
      "Company",
    ];
    for (let i = 0; i < headerNames.length; i++) {
        expect(container.querySelector(`th:nth-child(${i + 1})`)).toBeNull();
        if (container.querySelector(`th:nth-child(${i + 1})`)) {
          expect(container.querySelector(`th:nth-child(${i + 1})`).textContent).toBe(null)
          
        }
    
    
    }
  });
});

