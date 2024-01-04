import { Router } from "react-router-dom";
import { screen, render, cleanup} from "@testing-library/react";
import Dialog from "@mui/material/Dialog";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import CreateFolder from "../../pages/common/CreateFolder";
import Lists from "../../pages/Reports/List";
import { DataContext } from "../../context";
import React from "react";
import { ReportsApi } from "../../apis/ReportsApi";

// jest.mock("react", () => ({
//     ...jest.requireActual("react"),
//     useState: jest.fn(),
//   }));
  jest.mock("../../pages/Reports/List");
const mockDataContext = {
            "id": "43",
            "type": "report_folder",
            "attributes": {
                "id": 43,
                "name": "folder",
                "company_id": 142,
                "created_at": "11 Aug 2023 10:17 AM",
                "updated_at": "11 Aug 2023 10:17 AM",
                "reports": {
                    "data": [
                        {
                            "id": "116",
                            "type": "report",
                            "attributes": {
                                "id": 116,
                                "name": "sws",
                                "description": "testing",
                                "last_accessed_date": "-",
                                "report_folder": "folder",
                                "report_folder_id": 43,
                                "company_id": 142,
                                "created_at": "11 Aug 2023 10:18 AM",
                                "updated_at": "11 Aug 2023 10:18 AM",
                                "original_name": null,
                                "favorite": false,
                                "primary_module": "pipeline",
                                "is_scheduled": false,
                                "created_by": "gp singh"
                            }
                        }
                    ]
                },
              
            }    
    
}


jest.mock("../../apis/ReportsApi", () => ({
    __esModule: true,
    ...jest.requireActual("../../apis/ReportsApi"),
    ReportsApi: {
        getAll: (id) =>
        new Promise((resolve, reject) => {
          return resolve(mockDataContext);
        }),
       
    },
  }));

describe("Testing Create Folder Component", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
 
    render(
        <DataContext.Provider>
      <Router location={history.location} navigator={history}>
        <Lists  
          />
      
      </Router>
      </DataContext.Provider>
    );
    // screen.debug()
  });

it("Testing text",async() =>{
  
  
// const save=screen.getByTestId("Create Report")
//    expect(save).toBeInTheDocument()
})


});
