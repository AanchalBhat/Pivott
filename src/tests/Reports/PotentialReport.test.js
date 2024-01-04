import React from 'react';
import "@testing-library/jest-dom"
import { render, fireEvent, waitFor ,screen} from '@testing-library/react';
import PotentialReport from '../../components/Reports/ReportDetails/PotentialReport';
import { DataContext } from '../../context';
import  userEvent  from '@testing-library/user-event';
describe('LeadReport Component', () => {
  // Mock any necessary dependencies and props here
  const mockDataContext = {
        setCreateModuleFields:jest.fn()
  };
    it("renders with crashing",async () => {

        render(
            <PotentialReport   />,
            {
                wrapper: ({ children }) => (
                  <DataContext.Provider value={mockDataContext}>
                    {children}
                  </DataContext.Provider>
                ),
              }
        )
        expect(screen.getByText("Stage")).toBeInTheDocument()
        expect(screen.getByText("Potential Owner")).toBeInTheDocument()
        expect(screen.getByText("Amount")).toBeInTheDocument()
        const stageInput = screen.getByTestId('stage').querySelector("input")
        fireEvent.change(stageInput, { target: { value: 'Stage1' } })
        const amount = screen.getByTestId('amount').querySelector("input")
        fireEvent.change(amount, { target: { value: '87222' } })


        const typeInput = screen.getByTestId('type').querySelector("input")
        fireEvent.change(typeInput, { target: { value: 'Type1' } });


    })
});
