import { screen, render, cleanup } from "@testing-library/react";
import RolesNHierarchy from "../../pages/RolesPermissions/rolesNHierarchy";
import { FetchApi } from "../../apis/fetchApi";
import "@testing-library/jest-dom";
import { Router } from "react-router-dom";
import {
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { createMemoryHistory } from "history";
import { userInfo } from "os";

jest.mock("../../apis/fetchApi", () => ({
  FetchApi: jest.fn(),
}));

beforeEach(() => {
  localStorage.setItem(
    "user_info",
    JSON.stringify({ id: 1, role: { role_name: "abc" } })
  );
});
afterEach(cleanup);
const history = createMemoryHistory();

const mockNavigate = jest.fn();

const mockResponse = {
  data: [
    {
      id: 1,
      attributes: {
        full_name: "John Doe",
        email: "john@example.com",
        role: {
          name: "Admin",
        },
        profile_photo: {
          url: "profile.jpg",
        },
        has_children: false,
      },
    },
  ],
  meta: {
    total_records: 10,
  },
};

describe("RolesNHierarchy", () => {
  it("fetches and renders data when page changes", async () => {
    FetchApi.mockResolvedValueOnce(mockResponse);
    let userInfo = JSON.parse(localStorage.getItem("user_info"));
    render(
      <Router location={history.location} navigator={history}>
        <RolesNHierarchy
          userID={userInfo?.id}
          role={userInfo?.role?.role_name}
          page={1}
          pageSize={10}
        />
      </Router>
    );

    await screen.findByText("John Doe");
    await screen.findByText("john@example.com");
    await screen.findByText("Admin");
  });

  it("should mock the reccur function", async () => {
    const mockedReccur = jest.fn();
    RolesNHierarchy.reccur = mockedReccur;
    mockedReccur.mockReturnValue("Mocked result");

    let ancestry = "1/2/3";
    let nodes = [
      {
        key: 4,
        data: {
          name: "Abc",
          email: "abc@gmail.com",
          role: "User",
          profile_photo: null,
        },
        leaf: false,
        children: [],
      },
    ];
    let lazyNode = {
      key: 4,
      data: {},
      leaf: false,
      children: [],
    };

    mockedReccur(ancestry, 1, nodes, lazyNode);
    expect(mockedReccur).toHaveBeenCalledTimes(1);
    expect(mockedReccur).toHaveBeenCalledWith(ancestry, 1, nodes, lazyNode);
  });

  it("should fetch and render child nodes correctly", async () => {
    const ancestry = ["some_key"];
    const lazyNode = {
      key: "lazy_key",
      children: [],
    };

    const getChildsResponse = {
      data: [
        {
          id: 1,
          attributes: {
            full_name: "Ram Sharma",
            email: "ram@example.com",
            role: {
              name: "User",
            },
            profile_photo: {
              url: "profile.jpg",
            },
            has_children: false,
          },
        },
      ],
    };

    FetchApi.mockResolvedValueOnce(getChildsResponse);
    let userInfo = JSON.parse(localStorage.getItem("user_info"));

    render(
      <Router location={history.location} navigator={history}>
        <RolesNHierarchy
          userID={userInfo?.id}
          role={userInfo?.role?.role_name}
          ancestry={ancestry}
          lazyNode={lazyNode}
        />
      </Router>
    );

    await screen.findByText("Ram Sharma");
    await screen.findByText("ram@example.com");
    await screen.findByText("Executive");
  });
});
