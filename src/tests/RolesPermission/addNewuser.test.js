import React from 'react';
import { render, screen, fireEvent,act} from '@testing-library/react';
import AddNewUser from '../../pages/RolesPermissions/AddNewUser';
import '@testing-library/jest-dom'

const mockResponse =  [
    { id: 1, attributes: { name: 'Admin' } },
    { id: 2, attributes: { name: 'User' } },
  ]
  jest.mock("../../apis/LeadApi", () => ({
    __esModule: true,
    LeadAPI: {
        getRole: (id) =>
        new Promise((resolve, reject) => {
          return resolve(mockResponse);
        }),
        inviteUser: (id) =>
        new Promise((resolve, reject) => {
          return resolve({ message: 'User invited successfully' });
        })
    },
  }));


describe('AddNewUser component', () => {
  it('renders correctly', () => {
    render(<AddNewUser openNewUser={true} />);
    screen.debug()
    expect(screen.getByText("Add New User")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    
  });

  it('displays email error message when email is not provided', () => {
    render(<AddNewUser openNewUser={true} />);
    fireEvent.click(screen.getByText('Add')); 
    expect(screen.getByText("Email can't be empty")).toBeInTheDocument();
  });

  it('displays role error message when role is not selected', () => {
    render(<AddNewUser openNewUser={true} />);
    fireEvent.click(screen.getByText('Add')); 
    expect(screen.getByText('Role must be selected')).toBeInTheDocument();
  });

});



