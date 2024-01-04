import { Await, Router } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";
import { createMemoryHistory } from "history";
import CreatePotential from "../../components/Potential/CreatePotential";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
// jest.mock("axios", () => {});
describe("testing createPotential", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <CreatePotential />
      </Router>
    );
  });
  test("Testing All the text fields", () => {
    expect(screen.getByText(/Contact Person/i)).toBeInTheDocument();
    expect(screen.getByText(/Details/i)).toBeInTheDocument();
  });
  test("checking  all the required fields exists or not", () => {
    expect(screen.getByText("Contact Person")).toBeInTheDocument();
    expect(screen.getByText("Create Potential")).toBeInTheDocument();
    expect(screen.getByTestId("potential-amount")).toBeInTheDocument();
    expect(screen.getByTestId("next-step")).toBeInTheDocument();
    expect(screen.getByTestId("campaign-sources")).toBeInTheDocument();
  });
  test("Checking if contact dropdown exists or not", () => {
    expect(screen.getByTestId("contact-dropdown")).toBeInTheDocument();
  });

  test("Testing Validity of Potential Name field", async () => {
    const potentialName = screen
      .getByTestId("potential-name")
      .querySelector("input");
    expect(potentialName).toBeInTheDocument();
    await userEvent.type(potentialName, "Ram shah");
    expect(potentialName).toHaveValue("Ram shah");
  });
  test("Testing validity of Potential Account Name field", async () => {
    const accountName = screen
      .getByTestId("account-name")
      .querySelector("input");
    expect(accountName).toBeInTheDocument();
    await userEvent.type(accountName, "hello");
    expect(accountName).toHaveValue("hello");
  });
  test("Testing Amount field", async () => {
    const amount = screen
      .getByTestId("potential-amount")
      .querySelector("input");
    expect(amount).toBeInTheDocument();
    await userEvent.type(amount, "20000");
    expect(amount.value).toBe("20000");
  });
  test("Testing Validity of  Potential Stage Field", () => {
    const stage = screen.getByTestId("stage").querySelector("input");
    expect(stage).toBeInTheDocument();
  });
  test("Testing Validity of Potential Type", () => {
    const potentialType = screen.getByTestId("type").querySelector("input");
    expect(potentialType).toBeInTheDocument();
  });
  test("Testing Validity of potential sources error", () => {
    const leadSources = screen.getByTestId("lead-sources");
    expect(leadSources).toBeInTheDocument();
  });

  test("Testing the next step field", async () => {
    const nextStep = screen.getByTestId("next-step").querySelector("input");
    expect(nextStep).toBeInTheDocument();
    await userEvent.type(nextStep, "Discuss");
    expect(nextStep).toHaveValue("Discuss");
  });
  test("Testing the Campaign Sources field", async () => {
    const campaignSources = screen
      .getByTestId("campaign-sources")
      .querySelector("input");
    expect(campaignSources).toBeInTheDocument();
    await userEvent.type(campaignSources, "new");
    expect(campaignSources).toHaveValue("new");
  });
  test("Testing the required buttons ", () => {
    const saveBtn = screen.getByTestId("save-new-btn");
    expect(saveBtn).toBeInTheDocument();
    expect(screen.getByTestId("cancel-btn")).toBeInTheDocument();
  });
});
