import React from 'react';
import "@testing-library/jest-dom"
import { render, fireEvent, waitFor ,screen} from '@testing-library/react';
import LeadReport from '../../components/Reports/ReportDetails/LeadReport';
import { DataContext } from '../../context';
import  userEvent  from '@testing-library/user-event';
describe('LeadReport Component', () => {
  // Mock any necessary dependencies and props here
  const mockDataContext = {
        setCreateModuleFields:jest.fn()
  };
    it("renders with crashing",async () => {

        render(
            <LeadReport   />,
            {
                wrapper: ({ children }) => (
                  <DataContext.Provider value={mockDataContext}>
                    {children}
                  </DataContext.Provider>
                ),
              }
        )
        expect(screen.getByText("Lead Owner")).toBeInTheDocument()
        expect(screen.getByText("Lead Source")).toBeInTheDocument()

        const leadSource=screen.getByTestId("lead_source").querySelector("input")
        expect(leadSource).toBeInTheDocument()
        leadSource.style.pointerEvents="auto"
        await userEvent.type(leadSource,"internet")

        expect(screen.getByText("Lead Status")).toBeInTheDocument()

        const leadStatus=screen.getByTestId("lead_status").querySelector("input")
        leadStatus.style.pointerEvents="auto"
        await userEvent.type(leadStatus,"status")

        const industry=screen.getByTestId("industry").querySelector("input")
        industry.style.pointerEvents="auto"
        await userEvent.type(industry,"industry")

        const email=screen.getByTestId("email").querySelector("input")
        await userEvent.type(email,"aj123@gmail.com")

        const companySize=screen.getByTestId("company_size").querySelector("input")
        companySize.style.pointerEvents="auto"
        await userEvent.type(companySize,"100")

        const phone=screen.getByTestId("phone")
        expect(phone).toBeInTheDocument()
        await userEvent.type(phone,"9876555")

        const designation=screen.getByTestId("designation").querySelector("input")
        expect(designation).toBeInTheDocument()
        await userEvent.type(designation,"ceo")


    })
});
