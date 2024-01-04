import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { DataContext } from "../../context";
import Calls from '../../components/Leads/Calls/Calls';
const history = createMemoryHistory();



describe('Calls', () => {
  it('renders the component with scheduled calls', async () => {

    const mockCalls = [
      {
        id: 1,
        attributes: {
          call_to: 2,
          assigned_to: 3,
          call_date: '2023-08-10',
          call_time: '10:00',
          purpose: 'Meeting',
          agenda: 'Discuss project updates',
        },
      },
  
    ];
    
    const mockGetCalls = jest.fn().mockResolvedValue({
      data: mockCalls,
      meta: {
        next_page: null,
      },
    });

    render(
      <DataContext.Provider>
          <Router location={history.location} navigator={history}>
        <Calls type="Pipeline" />
        </Router>
      </DataContext.Provider>
    );

      expect(screen.getByText('N/A')).toBeInTheDocument();

      expect(screen.getByText('Send Email')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    //   expect(screen.getByText('Meeting')).toBeInTheDocument();
    //   expect(screen.getByText('Discuss project updates')).toBeInTheDocument();
    //   expect(screen.getByText('August 10, 2023 at 10:00 AM')).toBeInTheDocument();
    
    });
  });

