import React from "react";
import { createMemoryHistory } from "history";
import { render, screen, cleanup, } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Router } from "react-router";
import DealsOverview from "../../components/Deals/Details/DealsOverview/DealsOverview";

// jest.mock("axios", () => {
//     const axios = jest.fn().mockResolvedValue();
//     return axios;
//   });
global.scroll = jest.fn()

describe('Overview', () => {
    const history = createMemoryHistory();
    afterEach(cleanup)
    beforeEach(() => {
        render(<Router location={history.location} navigator={history} >
            <DealsOverview />
            </Router>)
    });
    test('overview', () => {
        const txt = screen.getByText('Description')
        expect(txt).toBeInTheDocument()
    })
    test('Check text for DealsOverview Render sucessfully', () => {
        expect(screen.getByTestId('deal_owner')).toBeInTheDocument();
        expect(screen.getByTestId('deal_name')).toBeInTheDocument();
        expect(screen.getByTestId('kick_off_timeFormat')).toBeInTheDocument();
        expect(screen.getByTestId('deal_terms')).toBeInTheDocument();
        expect(screen.getByTestId('value')).toBeInTheDocument();
        expect(screen.getByTestId('sign_off_timeFormat')).toBeInTheDocument();
        expect(screen.getByTestId('payment_terms')).toBeInTheDocument();
        expect(screen.getByTestId('campaign_sources')).toBeInTheDocument();
        expect(screen.getByTestId('contact_name')).toBeInTheDocument();
        expect(screen.getByTestId('description')).toBeInTheDocument();
      })
})