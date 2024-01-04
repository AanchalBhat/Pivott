import React from 'react';
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MeetingsPopup from '../../components/Leads/Meetings/MeetingsPopup';


describe('MeetingsPopup', () => {
 

  it('renders correctly in create mode', () => {
    render(<MeetingsPopup closeDrawer={() => {}} type="..." />);
  
    expect(screen.getByText("Add Meeting")).toBeInTheDocument();
    expect(screen.getByText("Meeting Details")).toBeInTheDocument();
    
    expect(screen.getByText("organizer")).toBeInTheDocument();
  });






});
