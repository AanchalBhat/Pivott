import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import Lists from "../pages/Leads/List";
import PipelineLists from "../pages/Pipeline/List";
import PotentialLists from "../pages/Potential/List";
import Createlead from "../components/Leads/CreateLeads";
import LeadNotes from "../components/Leads/Notes/Notes";
import LeadOverview from "../components/Leads/Overview";
import LeadTasks from "../components/Leads/Tasks/Tasks";
import Calls from "../components/Leads/Calls/Calls";
import Meeting from "../components/Leads/Meetings/Meetings";
import CreatePipeline from "../components/Pipeline/CreatePipeline";
import DealLists from "../pages/Deals/List";
import ThirdParty from "../components/ThirdParty/index";
import ReportLists from "../pages/Reports/List";
import LostLists from "../components/LostLeads/LostLeadsList";
import GlobalSearch from "../components/GlobalSearch/GlobalSearch";
import AccountDetails from "../components/AccountDetails/ProfileTabs";
import EditDetails from "../components/AccountDetails/EditDetails";
import Password from "../components/Personal/Password";
import ManageUsers from "../pages/RolesPermissions/ManageUsers";
import DataPermission from "../pages/RolesPermissions/DataPermission";
import UserDetails from "../pages/RolesPermissions/UserDetails";
import PageNotFound from "../components/NotFound/PageNotFound";

jest.mock("../pages/Leads/List", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="create-lead-btn">leads list</div>,
  };
});

jest.mock("../pages/RolesPermissions/UserDetails", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="user_details">User Details</div>,
  };
});
jest.mock("../pages/RolesPermissions/DataPermission", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="data-permission">Data Permission</div>,
  };
});
jest.mock("../components/Personal/Password", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="password">Passwords</div>,
  };
});
jest.mock("../pages/Pipeline/List", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="pipeline">Pipeline</div>,
  };
});

jest.mock("../pages/Potential/List", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="potential-create">Potential</div>,
  };
});

jest.mock("../pages/Deals/List", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="deal">Deals</div>,
  };
});
jest.mock("../pages/Reports/List", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="reports">Reports</div>,
  };
});

jest.mock("../components/LostLeads/LostLeadsList", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="lost-lead">Lost Leads</div>,
  };
});
jest.mock("../components/Leads/Notes/Notes", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="create-note">Notes Lead</div>,
  };
});

jest.mock("../components/Leads/Meetings/Meetings", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="lead-meeting">Meetings</div>,
  };
});

jest.mock("../components/ThirdParty/index", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="third-party">Third Party</div>,
  };
});

jest.mock("../components/GlobalSearch/GlobalSearch", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="global-search">Global Search</div>,
  };
});

jest.mock("../components/AccountDetails/AccountDetails", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="account-detail">Account Details</div>,
  };
});

jest.mock("../pages/RolesPermissions/ManageUsers", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="manage-users">Manage Users</div>,
  };
});

describe("Testing LeadsList Route on route  /lead ", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/lead"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing LeadList component on route  "/lead" ', async () => {
    render(
      <Routes>
        <Route path="/lead" element={<Lists />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("create-lead-btn")).toBeInTheDocument();
  });
});

describe("Testing LeadsCreate Route on route  /lead/create ", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/lead/create"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing LeadList component on route  "/lead/create" ', async () => {
    render(
      <Routes>
        <Route path="/lead/create" element={<Createlead />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("pic-btn")).toBeInTheDocument();
  });
});

describe("Testing Notes Route on route  /lead/:id/note ", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/lead/:id/note"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing LeadList component on route  "/lead/:id/note" ', async () => {
    render(
      <Routes>
        <Route path="/lead/:id/note" element={<LeadNotes />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("create-note")).toBeInTheDocument();
  });
});

describe("Testing Overview Route on route /lead/:id/overview", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/lead/:id/overview"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing LeadList component on route  "/lead/:id/overview"', async () => {
    render(
      <Routes>
        <Route path="/lead/:id/overview" element={<LeadOverview />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("overview")).toBeInTheDocument();
  });
});

describe("Testing Task Route on route /lead/:id/task", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/lead/:id/task"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing LeadList component on route  "/lead/:id/task"', async () => {
    render(
      <Routes>
        <Route path="/lead/:id/task" element={<LeadTasks />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("task")).toBeInTheDocument();
  });
});

describe("Testing Meeting Route on route /lead/:id/meeting", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/lead/:id/meeting"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing LeadList component on route  "/lead/:id/meeting"', async () => {
    render(
      <Routes>
        <Route path="/lead/:id/meeting" element={<Meeting />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("lead-meeting")).toBeInTheDocument();
  });
});

describe("Testing Call Route on route  /lead/:id/call-information", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/lead/:id/call-information"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing LeadList component on route  "/lead/:id/call-information"', async () => {
    render(
      <Routes>
        <Route path="/lead/:id/call-information" element={<Calls />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("lead-call")).toBeInTheDocument();
  });
});

describe("Testing Pipeline Route on route  /pipeline", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/pipeline"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing LeadList component on route  "/pipeline"', async () => {
    render(
      <Routes>
        <Route path="/pipeline" element={<PipelineLists />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("pipeline")).toBeInTheDocument();
  });
});

describe("Testing Create  Pipeline Route on route  /pipeline/create/:createId?", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/pipeline/create/:createId?"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing  CreatePipeline component on route  "/pipeline/create/:createId?"', async () => {
    render(
      <Routes>
        <Route
          path="/pipeline/create/:createId?"
          element={<CreatePipeline />}
        />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("create-pipeline")).toBeInTheDocument();
  });
});

describe("Testing Potential Route on route  /potential", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/potential"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing Potential component on route  "/potential"', async () => {
    render(
      <Routes>
        <Route path="/potential" element={<PotentialLists />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("potential-create")).toBeInTheDocument();
  });
});

describe("Testing Deal on route  /deal", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/deal"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing Deal component on route  "/deal"', async () => {
    render(
      <Routes>
        <Route path="/deal" element={<DealLists />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("deal")).toBeInTheDocument();
  });
});

describe("Testing Report on route /reports", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/reports"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing Reports component on route  "/reports""', async () => {
    render(
      <Routes>
        <Route path="/reports" element={<ReportLists />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("reports")).toBeInTheDocument();
  });
});

describe("Testing Lost Lead on route  /lost-lead", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/lost-lead"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test('Testing Reports component on route "/lost-lead""', async () => {
    render(
      <Routes>
        <Route path="/lost-lead" element={<LostLists />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("lost-lead")).toBeInTheDocument();
  });
});

describe("Testing Third Party on route  /third-party", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/third-party"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing Third Party on route  /third-party", async () => {
    render(
      <Routes>
        <Route path="/third-party" element={<ThirdParty />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("third-party")).toBeInTheDocument();
  });
});

describe("Testing Global Search on route  /global-search", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/global-search"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing globalsearch on route  /global-search", async () => {
    render(
      <Routes>
        <Route path="/global-search" element={<GlobalSearch />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("global-search")).toBeInTheDocument();
  });
});

describe("Testing Account Details on route  /account_detail", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/account-details"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing Account Details on route /account-details/profile-details", async () => {
    render(
      <Routes>
        <Route path="//account-details/profile-details" element={<ProfileTabs />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("account-detail")).toBeInTheDocument();
  });
});

describe("Testing Account Details on route /account-details/:id", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/account-details/:id"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing Account Details on route /account-details/:id", async () => {
    render(
      <Routes>
        <Route path="/account-details/:id" element={<EditDetails />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("edit-detail")).toBeInTheDocument();
  });
});

describe("Testing Password on route /account/password", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/account/password"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing Account Details on route /account/password", async () => {
    render(
      <Routes>
        <Route path="/account/password" element={<Password />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("password")).toBeInTheDocument();
  });
});

describe("Testing Manage Users on route /roles-permissions/manage-users", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/roles-permissions/manage-users"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing Account Details on route  /roles-permissions/manage-users", async () => {
    render(
      <Routes>
        <Route
          path="/roles-permissions/manage-users"
          element={<ManageUsers />}
        />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("manage-users")).toBeInTheDocument();
  });
});

describe("Testing Data Permissions on route /roles-permissions/data-permission/:id", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/roles-permissions/data-permission/:id"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing Data Permissions on route /roles-permissions/data-permission/:id", async () => {
    render(
      <Routes>
        <Route
          path="/roles-permissions/data-permission/:id"
          element={<DataPermission />}
        />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("data-permission")).toBeInTheDocument();
  });
});

describe("Testing User Details on route /roles-permissions/manage-users/user-details/:id", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter
        initialEntries={["/roles-permissions/manage-users/user-details/:id"]}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing User details on route /roles-permissions/manage-users/user-details/:id", async () => {
    render(
      <Routes>
        <Route
          path="/roles-permissions/manage-users/user-details/:id"
          element={<UserDetails />}
        />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("user_details")).toBeInTheDocument();
  });
});

describe("Testing Page NOT found on route /*", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/*"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  test("Testing Page Not found on route /*", async () => {
    render(
      <Routes>
        <Route path="/*" element={<PageNotFound />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });
});
