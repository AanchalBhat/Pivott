import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AppsBar from '../../../components/AppsBar';
import "@testing-library/jest-dom";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
const history = createMemoryHistory();


// jest.mock("react", () => ({
//     ...jest.requireActual("react"),
//     useState: jest.fn(),
//   }));


jest.mock('../../../components/AppsBar')
describe('AppsBar component', () => {
  it('renders without crashing', () => {
    
    render(
        <Router location={history.location} navigator={history}>
       <AppsBar />
      </Router>
    );
  });



});
