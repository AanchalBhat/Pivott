import React from 'react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'; 
import { FetchApi, removeStorage, errorHandling } from '../../../apis/fetchApi';
import { Toaster } from '../../../pages/common/Toaster';

jest.mock('axios'); // Mocking axios module

describe('FetchApi function', () => {
    it('should resolve with data when status is 200', async () => {
        let mockUpdatePassData = {
            current_password: "123456",
            password: "Test@1",
            password_confirmation: "Test@1"
        }
        let responseData = { message: "Password updated successfully.", success: true }
        axios.mockResolvedValueOnce({
            status: 200,
            data: responseData,
        });

        let id = 1;
        const result = await FetchApi(`/users/${id}/update_password`, 'put', mockUpdatePassData);
        expect(result).toEqual(responseData);
        expect(axios).toHaveBeenCalledWith(expect.stringMatching(`/users/${id}/update_password`), expect.any(Object));
    });

    it('should reject with response when status is not 200, 201, or 202', async () => {
        const response = {
            code: null,
            error: "Lead not found with id = 68",
            status: false
        }
        let id = 68;
        axios.mockResolvedValueOnce({
            status: 422,
            data: response
        });
        const result = await FetchApi(`/leads/${id}`, 'get');
        expect(result).toEqual(response);
        expect(axios).toHaveBeenCalledWith(expect.stringMatching(`/leads/${id}`), expect.any(Object));
    });
});

// const href = window.location.href;

beforeAll(() => {
  // Object.defineProperty(window, 'location', {
  //   value: { href: jest.fn() }
  // });
});

afterAll(() => {
  // window.location.href = href;
});

// describe('removeStorage function', () => {
//     it('should clear localStorage and redirect to the root URL', () => {
//       // Mock window.location
  
//       // Arrange
//       // const clearMock = jest.spyOn(window.localStorage.__proto__, 'clear'); // Create a spy on localStorage.clear
  
//       // Act
//       removeStorage();
  
//       // Check if localStorage.clear was called
//       // expect(clearMock).toHaveBeenCalled();
  
//       // Check if window.location.href was set to the root URL
//       expect(window.location.href).toBe('/login');
  
//       // Clean up the mocks
//       clearMock.mockRestore();

//       // Restore the original window.location
//       window.location = originalLocation;
//     });
//   });

describe('errorHandling function', () => {
  it('should display error toast and remove storage for expired signature', () => {
    const mockError = {
      error: 'Signature has expired',
    };
    const mockResponse = {
      error: 'Signature has expired',
      success: false,
    };
    const toastMock = jest.fn();
    const originalToaster = Toaster.TOAST; // Save original TOAST function
    Toaster.TOAST = toastMock; // Mock the TOAST function
    errorHandling(mockResponse, 401);
    expect(toastMock).toHaveBeenCalledTimes(2);
    expect(toastMock).toHaveBeenCalledWith('Signature has expired', 'error');
    Toaster.TOAST = originalToaster; // Restore original TOAST function
  });
});