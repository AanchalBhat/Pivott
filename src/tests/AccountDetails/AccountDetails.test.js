import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileTabs from '../../components/AccountDetails/ProfileTabs';
import { Router, useNavigate } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { userApi } from '../../apis/userApi';
import "@testing-library/jest-dom";

const history = createMemoryHistory();

const mockNavigate = jest.fn();

const mockUserData = {
    data: {
        attributes: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            phone: '1234567890',
            gender: 'Male',
            user_address: { country: 'USA' },
            language: 'English',
            timezone: 'GMT',
            profile_photo: { url: 'profile.jpg' },
        },
    },
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useOutletContext: () => [
        null,
        jest.fn(),
        jest.fn(),
        null,
        jest.fn(),
    ],
}));

jest.mock('../../apis/userApi', () => ({
    userApi: {
        getUser: jest.fn(),
    },
}));

describe('AccountDetails Component', () => {
    beforeEach(() => {
        localStorage.setItem("login_id", "2");
        userApi.getUser.mockResolvedValue(mockUserData);
        render(
            <Router location={history.location} navigator={history}>
                <ProfileTabs />
            </Router>
        );
    });

    afterEach(() => {
        localStorage.clear();
      });

    test('renders the component without errors', () => {
        expect(screen.getByTestId('account-detail')).toBeInTheDocument();
    });

    test('renders user details correctly', async () => {
        // Wait for the data to be fetched and the component to update
        await screen.findByText('John');
        await screen.findByText('johndoe@example.com');

        expect(userApi.getUser).toBeCalled();
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
    });

    test('navigates to the dashboard when the back button is clicked', async () => {
        const backButton = screen.getByTestId('back-button');
        await userEvent.click(backButton);
        expect(history.location.pathname).toBe('/dashboard');
    });

    test('navigates to the edit details page when the edit button is clicked', async () => {
        const editButton = screen.getByTestId('btn');
        const expectedUrl = `/account-details/${localStorage.getItem("login_id")}`;
        await userEvent.click(editButton);
        expect(history.location.pathname).toBe(expectedUrl);
    });
});
