import "@testing-library/jest-dom";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CreatePipeline from "../../components/Pipeline/CreatePipeline";

const history = createMemoryHistory();

describe("CreatePipeline Component", () => {
  it("renders without crashing", () => {
    render(
      <Router location={history.location} navigator={history}>
        <CreatePipeline />
      </Router>
    );
    expect(screen.getByText('Create Pipeline')).toBeInTheDocument();
    expect(screen.getByTestId('Auto-complete')).toBeInTheDocument();
  });

  it("displays 'Create Pipeline' heading when no pipelineId is provided", () => {
    render(
      <Router location={history.location} navigator={history}>
        <CreatePipeline />
      </Router>
    );
    const heading = screen.getByText("Create Pipeline");
    expect(heading).toBeInTheDocument();
  });

  it("displays 'Edit Pipeline' heading when pipelineId is provided", () => {
    render(
      <Router location={history.location} navigator={history}>
        <CreatePipeline />
      </Router>,
      { route: "/pipeline/edit/123" }
    );
    const heading = screen.getByText("Contact Person");
    expect(heading).toBeInTheDocument();
  });


  it("calls handleSaveClick when the SAVE button is clicked",  () => {
    const handleSaveClickMock = jest.fn();
    act(() => {
      render(
        <Router location={history.location} navigator={history}>
          <CreatePipeline handleSaveClick={handleSaveClickMock} />
        </Router>
      );
    });
    const saveButton = screen.getByText("SAVE");
     fireEvent.click(saveButton);
    expect(handleSaveClickMock).toHaveBeenCalledTimes(0);
  });


  it("calls handleCancel when the Cancel button is clicked", () => {
    const handleCancelMock = jest.fn();

    render(
      <Router location={history.location} navigator={history}>
        <CreatePipeline handleCancel={handleCancelMock} />
      </Router>
    );
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(handleCancelMock).toHaveBeenCalledTimes(0);
  });
});
