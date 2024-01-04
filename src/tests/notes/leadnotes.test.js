import React from 'react';
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, screen, fireEvent } from '@testing-library/react';
import LeadnotesPopup from '../../components/Leads/Notes/LeadnotesPopup';


describe('LeadnotesPopup', () => {
  it('renders the component with initial state', () => {
    render(<LeadnotesPopup />);

    expect(screen.getByText('Create Note')).toBeInTheDocument();

  
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

   
    expect(screen.getByText('Attach Image (jpg/png)')).toBeInTheDocument();

    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('handles title and description changes', () => {
    render(<LeadnotesPopup />);

    const titleInput = screen.getByText('Title');
    const descriptionInput = screen.getByText('Description');


    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<LeadnotesPopup />);

    const fileInput = screen.getByText('Attach Image (jpg/png)');
    const testFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [testFile] } });


  });

  it('handles form submission', () => {
    render(<LeadnotesPopup />);

    const createButton = screen.getByText('Create');

  

    fireEvent.click(createButton);

  });

});
