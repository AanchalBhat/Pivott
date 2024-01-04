import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import DrawerData from "../../../components/DrawerData";
const history = createMemoryHistory();

describe("DrawerData component", () => {
  it("renders without crashing", () => {
    render(
      <Router location={history.location} navigator={history}>
        <DrawerData />
      </Router>
    );
  });

  it("renders a list of items", () => {
    const drawerData = [
      {
        title: "Dashboard",
        to: "/dashboard",
        listItemIconTxt: "dashboard",
        activeTabIcon: () => (<i className="dashboard-icon" />),
      },
      {
        title: "Leads",
        to: "/leads",
        listItemIconTxt: "leads",
        activeTabIcon: () => (<i className="leads-icon" />),
      },
    ];

    render(
      <Router location={history.location} navigator={history}>
        <DrawerData drawerData={drawerData} />
      </Router>
    );

    const dashboardItem = screen.getByText("Dashboard");
    const leadsItem = screen.getByText("Leads");

    expect(dashboardItem).toBeInTheDocument();
    expect(leadsItem).toBeInTheDocument();
  });

  it("applies active styles to the selected item", () => {
    const drawerData = [
      {
        title: "Dashboard",
        to: "/dashboard",
        listItemIconTxt: "dashboard",
        activeTabIcon: () => (<i className="dashboard-icon" />),
      },
      {
        title: "Leads",
        to: "/leads",
        listItemIconTxt: "leads",
        activeTabIcon: () => (<i className="leads-icon" />),
      },
    ];

    render(
      <Router location={history.location} navigator={history}>
        <DrawerData drawerData={drawerData} />
      </Router>
    );

    const dashboardItem = screen.getByText("Dashboard");
    const leadsItem = screen.getByText("Leads");

    fireEvent.click(dashboardItem);

    expect(dashboardItem).toHaveClass("MuiTypography-root");
    expect(leadsItem).not.toHaveClass("active");
  });

  it("renders sub-navigation items when applicable", () => {
    const drawerData = [
      {
        title: "Dashboard",
        to: "/dashboard",
        listItemIconTxt: "dashboard",
        activeTabIcon: () => (<i className="dashboard-icon" />),
      },
      {
        title: "Sub Nav",
        activeTabIcon: () => (<i className="dashboard-icon" />),
        subNav: [
          {
            title: "Sub Item 1",
            to: "/sub-item-1",
            listItemIconTxt: "sub-item-1",
            icon: () => (<i className="sub-item-1-icon" />),
          },
          {
            title: "Sub Item 2",
            to: "/sub-item-2",
            listItemIconTxt: "sub-item-2",
            icon: () => (<i className="sub-item-2-icon" />),
          },
        ],
      },
    ];

    render(
      <Router location={history.location} navigator={history}>
        <DrawerData drawerData={drawerData} />
      </Router>
    );

    const subNavItem1 = screen.getByText("Sub Nav");
       expect(subNavItem1).toBeInTheDocument();
    
  });
});
