import '@testing-library/jest-dom'
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, screen, cleanup,act } from "@testing-library/react";
import Overview from '../../pages/Pipeline/Overview';
describe('Overview', () => {
    const history = createMemoryHistory();
    afterEach(cleanup)
    beforeEach(() => {
      render(<Router location={history.location} navigator={history} >
        <Overview />
      </Router>)
    });
    //
  
    test('Check text for button sent Email working sucessfully',  () => {
      expect(screen.getByText('Send Email')).toBeInTheDocument();
    })
  
    test('Check text for button sent Overview working sucessfully',  () => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
    })
  
    test('Check text for button sent Notes working sucessfully',  () => {
      expect(screen.getByText('Notes')).toBeInTheDocument();
    })
  
    test('Check text for button sent Edit Details working sucessfully',  () => {
      expect(screen.getByText('Edit Details')).toBeInTheDocument();
    })
    test('Check text for button Notes working sucessfully',  () => {
      expect(screen.getByText('Notes')).toBeInTheDocument();
    })
  
  })