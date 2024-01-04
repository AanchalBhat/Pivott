import React from "react";
import { createMemoryHistory } from "history";
import { render, screen, cleanup, } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Router } from "react-router";
import SocialLoading from "../../components/SocialLoading/SocialLoading";

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

describe('Social loading', () => {
    const history = createMemoryHistory();
    afterEach(cleanup)
    beforeEach(() => {
        render(<Router location={history.location} navigator={history} >
            <SocialLoading />
        </Router>)
    });
    test('After Page reload text is show', () => {
        const txt = screen.getByText('Please wait...')
        expect(txt).toBeInTheDocument()
    })
})