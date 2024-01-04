import CreateBoard from "../../components/Pipeline/CreateBoards";
import "@testing-library/jest-dom";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, screen, cleanup, act } from "@testing-library/react";
const history = createMemoryHistory();

describe("CreateBoard Component", () => {
  it("renders without crashing", () => {
    render(
      <Router location={history.location} navigator={history}>
        <CreateBoard />
      </Router>
    );
  });

  it("displays 'No Pipelines found' when no columns are present", () => {
    render(
      <Router location={history.location} navigator={history}>
        <CreateBoard />
      </Router>
    );
    const noPipelinesText = screen.getByText("No Pipelines found");
    expect(noPipelinesText).toBeInTheDocument();
  });

  it("displays pipeline titles correctly", () => {
    const data = {
      listData: false,
      BaordDate: ["test 1", "test 2"],
    };
    render(
      <Router location={history.location} navigator={history}>
        <CreateBoard data={data} />
      </Router>
    );
  });
});
