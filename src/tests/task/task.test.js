import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { DataContext } from "../../context";
import LeadTasks from '../../components/Leads/Tasks/Tasks';
import { TaskAPI } from '../../apis/TaskApi';
const history = createMemoryHistory();

describe('LeadTasks', () => {
  it('renders the component with open tasks', async () => {

    const mockTasks = [
      {
        id: 1,
        attributes: {
          subject: 'Test Task 1',
          task_owner: {
            full_name: 'John Doe',
          },
          status: 'in_progress',
          priority: 'high',
          due_date_time: '2023-08-10T10:00:00Z',
        },
      },
      // Add more mock tasks as needed
    ];
    
    jest.mock("../../apis/TaskApi", () => ({
        __esModule: true,
        ...jest.requireActual("../../apis/TaskApi"),
        
        TaskAPI: {
            getAllId: (id) =>
            new Promise((resolve, reject) => {
              return resolve(mockTasks);
            }),
        },
      }));

    render(
      <DataContext.Provider value={mockTasks}>
        <Router location={history.location} navigator={history}>
        <LeadTasks type="Pipeline" />
        </Router>
      </DataContext.Provider>
    );

  
      expect(screen.getByText('Add Task')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Send Email')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
   
    });
  
});
