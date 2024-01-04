import React from 'react';
import "@testing-library/jest-dom"
import { render, fireEvent, waitFor ,screen} from '@testing-library/react';
import PipelineReport from '../../components/Reports/ReportDetails/PipelineReport';
import { DataContext } from '../../context';
import  userEvent  from '@testing-library/user-event';
describe('LeadReport Component', () => {

  const mockDataContext = {
        setCreateModuleFields:jest.fn()
  };
    it("renders without crashing",async () => {

        render(
            <PipelineReport   />,
            {
                wrapper: ({ children }) => (
                  <DataContext.Provider value={mockDataContext}>
                    {children}
                  </DataContext.Provider>
                ),
              }
        )
        expect(screen.getByText("Pipeline Owner")).toBeInTheDocument()
        expect(screen.getByText("Pipeline Stage")).toBeInTheDocument()
        const stage=screen.getByTestId("stage").querySelector("input")
        expect(stage).toBeInTheDocument()
        fireEvent.change(stage, { target: { value: 'Stage1' } });

        const revenue=screen.getByTestId("revenue").querySelector("input")
        expect(revenue).toBeInTheDocument()
        fireEvent.change(revenue, { target: { value: '123456' } });

        const type=screen.getByTestId("type").querySelector("input")
        fireEvent.change(type, { target: { value: 'Type1' } });

    })
});
