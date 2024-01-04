import React from 'react';
import "@testing-library/jest-dom"
import { render, fireEvent, waitFor ,screen} from '@testing-library/react';
import LostleadReport from '../../components/Reports/ReportDetails/LostleadReport';
import { DataContext } from '../../context';
import  userEvent  from '@testing-library/user-event';
describe('LeadReport Component', () => {
  // Mock any necessary dependencies and props here
  const mockDataContext = {
        setCreateModuleFields:jest.fn()
  };
    it("renders with crashing",async () => {

        render(
            <LostleadReport   />,
            {
                wrapper: ({ children }) => (
                  <DataContext.Provider value={mockDataContext}>
                    {children}
                  </DataContext.Provider>
                ),
              }
        )
        expect(screen.getByText("Lead Owner")).toBeInTheDocument()
        expect(screen.getByText("Contact")).toBeInTheDocument()
        expect(screen.getByText("By Reason")).toBeInTheDocument()
        const reason=screen.getByTestId("reason").querySelector("input")
        expect(reason).toBeInTheDocument()
        reason.style.pointerEvents="auto"
        await userEvent.type(reason,"internet")



        const companyName=screen.getByTestId("company_name").querySelector("input")

        await userEvent.type(companyName,"100")

        const phone=screen.getByTestId("phone")
        expect(phone).toBeInTheDocument()
        await userEvent.type(phone,"9876555")




    })
});
