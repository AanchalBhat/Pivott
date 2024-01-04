import React from "react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Notification from "../../pages/common/Notification";

describe("Notification Component", () => {
  const mockNotificationsData = {
    "id": 117,
    "header": "Aanchal Bhat assigned you.",
    "title": "New Leads has been assigned to you.",
    "description": "1 Lead has been alloted to you take a look",
    "read": false,
    "created_at": "2023-08-10T09:45:30.039Z",
    "notificationable_type": "Lead",
    "created_time": "22 Hours ago",
    
}

  it("renders without crashing", () => {
    render(<Notification />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("All Filters")).toBeInTheDocument();
    expect(screen.getByText("Mark all as read")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument(); 
    expect(screen.getByText("No notifications found")).toBeInTheDocument();

  });


});
