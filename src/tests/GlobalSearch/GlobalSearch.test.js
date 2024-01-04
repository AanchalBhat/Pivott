import { Await, Router } from "react-router-dom";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import GlobalSearch from "../../components/GlobalSearch/GlobalSearch";
import { GlobalSearchApis } from "../../apis/GlobalApi";

const data= {
      id: "88",
      type: "lead",
      attributes: {
        id: 88,
        description: "",
        industry: "",
        company_size: "",
        profile_photo: {
          url: null
        },
        website: "",
        view_count: 0,
        created_at: "07 Aug 2023 9:27 AM",
        updated_at: "07 Aug 2023 9:27 AM",
        is_deleted: null,
        contact_detail: {
          id: 83,
          first_name: "gp",
          last_name: "singh",
          company_name: "test",
          email: "gajendra.singh@protonshub.in",
          designation: "",
          phone_number: "",
          created_at: "2023-08-07T09:27:29.276Z",
          updated_at: "2023-08-07T09:27:29.276Z",
          full_name: "gp singh",
          country_code: "",
          company_id: 142,
          is_deleted: false
        },
        status: {
          id: 12,
          name: "Contact In Future",
          created_at: "2023-07-31T11:20:36.505Z",
          updated_at: "2023-07-31T11:20:36.505Z",
          is_deleted: null,
          status_type: "lead"
        },
        lead_owner: {
          id: 29,
          email: "gajendra34@yopmail.com",
          phone: "13232-13123",
          role_id: 5,
          department_id: null,
          company_id: 142,
          created_at: "2023-08-07T09:25:13.628Z",
          updated_at: "2023-08-07T09:25:13.628Z",
          jti: "7f72b9f8-0f7b-4959-8cef-87e3eab0e70e",
          first_name: "gps",
          last_name: "singh",
          full_name: "gps singh",
          is_deleted: null,
          is_activated: true,
          webex_access_token: null,
          webex_refresh_token: null,
          timezone: "UTC",
          gender: null,
          language: null,
          designation: null,
          auth_provider: null,
          profile_photo: {
            url: null
          },
          country_code: "+91",
          joined_date: null,
          date_of_birth: null,
          fax: null,
          mobile_number: null,
          added_by: null,
          website: null,
          disabled: false
        }
      }
    }
  


jest.mock("../../apis/GlobalApi", () => ({
  __esModule: true,
  ...jest.requireActual("../../apis/GlobalApi"),
  GlobalSearchApis: {
    Search: (id) =>
      new Promise((resolve, reject) => {
        return resolve(data);
      }),
  },
}));



describe("GlobalSearch Component", () => {
  const history = createMemoryHistory();
  const mockResponse = {
    leads: { data: ["lead1", "lead2"] },
    pipelines: { data: ["pipeline1", "pipeline2"] },
   
  };
  const initialState = {
    leads: [],
    pipelines: [],
 
  };
  const mockSetState = jest.fn();
  it("renders without crashing", () => {
    render(
       <Router location={history.location} navigator={history}>
            <GlobalSearch
              searchData={initialState}
              setsearchData={mockSetState}
              setLeads={mockSetState}
              setPipeline={mockSetState} />
             </Router>);
  });
  const componentInstance = render(
    <Router location={history.location} navigator={history}>
    <GlobalSearch
      searchData={initialState}
      setsearchData={mockSetState}
      setLeads={mockSetState}
      setPipeline={mockSetState} />
     </Router>
  ).container;
  it("displays 'No Search Results' message when no data is available", () => {
  
    render(<Router location={history.location} navigator={history}>
      <GlobalSearch />
       </Router>, { initialState: { searchData: {} } });

    expect(screen.getByText("No Search Results")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
  });


});

