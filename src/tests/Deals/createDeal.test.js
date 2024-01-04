import React from "react";
import { createMemoryHistory } from "history";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import '@testing-library/jest-dom';
import { Router } from "react-router";
import CreateDeals from "../../components/Deals/CreateDeals";
// jest.mock("axios",() => {})
const history = createMemoryHistory();
//For Create Leads  component
describe('<Create Leads/> ', () => {
  afterEach(cleanup)
  beforeEach(() => {
    render(<Router location={history.location} navigator={history} >
      <CreateDeals />
    </Router>)
  });

  test("Testing text on screen",() =>{
    expect(screen.getByText(/Details/i)).toBeInTheDocument()

  })
  test("Testing Deal Value field",async () =>{
    const value=screen.getByTestId("value").querySelector("input")
    expect(value).toBeInTheDocument()
    await userEvent.type(value,"87666")
    expect(value).toHaveValue("87666")
  })
  test("testing deal field",async () =>{
    const dealName=screen.getByTestId("deal_name").querySelector("input")
    await userEvent.type(dealName,"truhlar")
    expect(dealName).toHaveValue("truhlar")
  })
  test("Testing tenure field",async() =>{
    const tenure=screen.getByTestId("tenure").querySelector("input")
    expect(tenure).toBeInTheDocument()
    await userEvent.type(tenure,"50")
    expect(tenure).toHaveValue("50")
  })
  test("Testing Payment terms",() =>{
    const payment=screen.getByTestId('payment_terms').querySelector("input")
    expect(payment).toBeInTheDocument()
  })
  test("Testing campaign field",async () =>{
    const campaign=screen.getByTestId('campaign').querySelector("input")
    expect(campaign).toBeInTheDocument()
    await userEvent.type(campaign,"ijjk")
    expect(campaign).toHaveValue("ijjk")

  })
  test("Testing deal terms field",async () => {
    const dealTerm=screen.getByTestId("deal_terms").querySelector("input")
    expect(dealTerm).toBeInTheDocument()
    await userEvent.type(dealTerm,"67")
    expect(dealTerm).toHaveValue("67")
  })


})
