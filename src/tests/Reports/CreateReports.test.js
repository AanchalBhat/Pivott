import React from "react";
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor,screen } from "@testing-library/react";
import CreateReports from "../../components/Reports/CreateReports";
import { DataContext } from "../../context";
import  userEvent  from "@testing-library/user-event";


describe("CreateReports Component", () => {




  it("Testing the  primary module field",async () => {
    const mockDataContext = {
      setReportFolderName: jest.fn(),
    };
    const { getByTestId } = render(
      <MemoryRouter>
        <CreateReports/>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <DataContext.Provider value={mockDataContext}>
            {children}
          </DataContext.Provider>
        ),
      }

    );

    expect(getByTestId("pm-module")).toBeInTheDocument()
    const reportField=screen.getByTestId("report_name")
    expect(reportField).toBeInTheDocument()
    await userEvent.type(reportField,"abc")
    const description=screen.getByTestId("description")
    expect(description).toBeInTheDocument()
    await userEvent.type(description,"description")
    const arrowBtn=getByTestId("arrow-btn")
    expect(arrowBtn).toBeInTheDocument()

    await   userEvent.click(arrowBtn)

    fireEvent.click(screen.getByText('Next'));

    // Assert that error messages are displayed
    expect(screen.getByText('Please select Primary Module')).toBeInTheDocument();
    expect(screen.getByText('Please enter Report Name')).toBeInTheDocument();

    //Testing buttons
    const nextBtn=screen.getByTestId("next-btn")
    expect(nextBtn).toBeInTheDocument()
    await userEvent.click(nextBtn)
    const cancelBtn=screen.getByTestId("cancel-btn")
    expect(cancelBtn).toBeInTheDocument()
    await userEvent.click(cancelBtn)

  })


});
